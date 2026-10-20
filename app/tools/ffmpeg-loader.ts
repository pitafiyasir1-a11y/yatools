/* Shared lazy loader for the ffmpeg.wasm video engine.
 *
 * Strategy: the SINGLE-THREADED ffmpeg core (@ffmpeg/core 0.12.9) is loaded
 * from the jsDelivr CDN (which serves CORS `*`), so no cross-origin-isolation
 * headers (COOP/COEP) are needed anywhere on the site — the single-threaded
 * build doesn't use SharedArrayBuffer. We fetch the files ourselves (with an
 * honest progress readout) and hand blob URLs to ffmpeg.
 *
 * IMPORTANT: we must use the `dist/umd` build, NOT `dist/esm`. The ffmpeg
 * class worker loads the core in two steps: first `importScripts(coreURL)`,
 * and only if that throws, a dynamic `import(coreURL)` fallback. Inside the
 * Next.js/webpack production bundle, that dynamic import is replaced by a
 * webpack stub that always throws "Cannot find module" — so the fallback
 * can NEVER succeed in production. The ESM core always fails importScripts
 * (its `export` statement is a syntax error in a classic script), which made
 * every ffmpeg tool fail at load time in production (verified 2026-10-20 by
 * running the production worker chunk against both builds: ESM -> "Cannot
 * find module 'blob:...'", UMD -> loads and converts fine). The UMD build is
 * a classic script, so `importScripts` succeeds on the first path.
 *
 * The blob URLs also need explicit MIME types: the core JS blob is typed
 * "text/javascript" so the worker can importScripts it.
 *
 * The ~32MB engine downloads once, then the instance is cached in memory
 * for the rest of the page session.
 */
"use client";

import type { FFmpeg } from "@ffmpeg/ffmpeg";

export const FFMPEG_BASE = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.9/dist/umd";
export const FFMPEG_JS_BYTES = 112059; // dist/umd/ffmpeg-core.js
export const FFMPEG_WASM_BYTES = 32232419; // dist/umd/ffmpeg-core.wasm (honest size for the progress readout)
export const FFMPEG_FIRST_RUN_NOTE =
  "First run loads the video engine (~30 MB), then it's instant for the rest of your visit.";

let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

type ProgressCb = (label: string, pct: number | null, detail: string) => void;

function fmtMB(bytes: number): string {
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/** Fetch a URL with byte-level progress (needed: the wasm is ~32MB).
 * The blob gets an explicit MIME type — the worker dynamic-imports the core
 * JS from its blob URL, and module scripts require a JavaScript MIME type. */
async function fetchWithProgress(
  url: string,
  total: number,
  label: string,
  onProgress: ProgressCb,
  mimeType: string,
  signal?: AbortSignal
): Promise<Blob> {
  const res = await fetch(url, signal ? { signal } : undefined);
  if (!res.ok || !res.body) {
    throw new Error(`Couldn't download the video engine file (${res.status}). Check your connection and try again.`);
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    onProgress(label, Math.min(99, Math.round((loaded / total) * 100)), `${fmtMB(loaded)} / ${fmtMB(total)}`);
  }
  return new Blob(chunks as BlobPart[], { type: mimeType });
}

/**
 * Load (or reuse) the ffmpeg instance. Safe to call from any event handler;
 * the heavy @ffmpeg/ffmpeg module is only imported on first use.
 */
export function loadFFmpeg(onProgress?: ProgressCb, signal?: AbortSignal): Promise<FFmpeg> {
  if (instance) return Promise.resolve(instance);
  if (loadPromise) return loadPromise;
  const report: ProgressCb = onProgress ?? (() => {});
  loadPromise = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const ff = new FFmpeg();
    // Download core files ourselves (with progress) instead of letting
    // ffmpeg fetch them blindly — jsDelivr serves CORS `*`, so blob URLs work.
    const coreJs = await fetchWithProgress(
      `${FFMPEG_BASE}/ffmpeg-core.js`,
      FFMPEG_JS_BYTES,
      "Loading video engine…",
      report,
      "text/javascript",
      signal
    );
    const coreWasm = await fetchWithProgress(
      `${FFMPEG_BASE}/ffmpeg-core.wasm`,
      FFMPEG_WASM_BYTES,
      "Loading video engine…",
      report,
      "application/wasm",
      signal
    );
    const coreURL = URL.createObjectURL(coreJs);
    const wasmURL = URL.createObjectURL(coreWasm);
    try {
      report("Starting video engine…", null, "almost there");
      await ff.load({ coreURL, wasmURL });
    } finally {
      URL.revokeObjectURL(coreURL);
      URL.revokeObjectURL(wasmURL);
    }
    instance = ff;
    return ff;
  })();
  // If loading fails, allow a retry next time instead of caching the rejection.
  loadPromise.catch(() => {
    loadPromise = null;
  });
  return loadPromise;
}

/** Attach a 0–100 progress listener (ffmpeg reports 0–1); returns a detach fn. */
export function onFFmpegProgress(ff: FFmpeg, cb: (pct: number) => void): () => void {
  const handler = ({ progress }: { progress: number }) => {
    if (Number.isFinite(progress)) cb(Math.max(0, Math.min(100, Math.round(progress * 100))));
  };
  ff.on("progress", handler);
  return () => ff.off("progress", handler);
}

/** Write a File into ffmpeg's virtual FS. */
export async function writeInputFile(ff: FFmpeg, name: string, file: File): Promise<void> {
  const { fetchFile } = await import("@ffmpeg/util");
  await ff.writeFile(name, await fetchFile(file));
}

/** Read a binary output file from ffmpeg's virtual FS as a Blob. */
export async function readOutputBlob(ff: FFmpeg, name: string, mime: string): Promise<Blob> {
  const data = await ff.readFile(name);
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : (data as Uint8Array);
  // Copy into a fresh ArrayBuffer — the wasm memory view can be detached.
  const copy = new Uint8Array(bytes.length);
  copy.set(bytes);
  return new Blob([copy.buffer as ArrayBuffer], { type: mime });
}

/** Remove temp files from the virtual FS (best effort). */
export async function cleanupFFmpeg(ff: FFmpeg, names: string[]): Promise<void> {
  await Promise.all(
    names.map(async (n) => {
      try {
        await ff.deleteFile(n);
      } catch {
        /* already gone */
      }
    })
  );
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / 1024 ** i;
  return `${v >= 100 ? v.toFixed(0) : v.toFixed(1)} ${units[i]}`;
}
