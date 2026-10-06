"use client";

import { useEffect, useRef, useState } from "react";

const MAX_BYTES = 100 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / 1024 ** i;
  return `${v >= 100 ? v.toFixed(0) : v.toFixed(1)} ${units[i]}`;
}

interface UtifEngine {
  decode(b: ArrayBuffer): { width?: number; height?: number }[];
  decodeImage(b: ArrayBuffer, img: unknown): void;
  toRGBA8(img: unknown): Uint8Array;
}

function utifEngine(mod: unknown): UtifEngine {
  const m = mod as { default?: UtifEngine };
  return (m.default ?? m) as UtifEngine;
}

interface PageInfo {
  index: number;
  width: number;
  height: number;
}

type Stage = "idle" | "reading" | "converting" | "done" | "error";

export default function TiffToJpgClient() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [pageIdx, setPageIdx] = useState(0);
  const [quality, setQuality] = useState(92);
  const [stage, setStage] = useState<Stage>("idle");
  const [result, setResult] = useState<{ url: string; name: string; size: number; w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const resultRef = useRef<{ url: string } | null>(null);
  resultRef.current = result;

  useEffect(() => {
    return () => {
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    };
  }, []);

  const pickFile = async (f: File | null) => {
    if (!f) return;
    const okType = f.type === "image/tiff" || /\.(tif|tiff)$/i.test(f.name);
    if (!okType) {
      setError("That doesn't look like a TIFF — please choose a .tif or .tiff file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(
        `That TIFF is ${formatBytes(f.size)} — over the 100 MB browser limit. Try a smaller file.`
      );
      return;
    }
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    setError(null);
    setResult(null);
    setPreviewUrl(null);
    setPages([]);
    setPageIdx(0);
    setStage("reading");
    setFile(f);
    try {
      const buf = await f.arrayBuffer();
      const UTIF = utifEngine(await import("utif"));
      if (typeof UTIF.decode !== "function") throw new Error("engine-missing");
      const ifds = UTIF.decode(buf);
      if (!ifds.length) throw new Error("no-pages");
      const infos: PageInfo[] = ifds.map((ifd, i) => ({
        index: i,
        width: Number(ifd.width) || 0,
        height: Number(ifd.height) || 0,
      }));
      setBuffer(buf);
      setPages(infos);
      setStage("idle");
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      setError(
        code === "no-pages"
          ? "No image pages were found in that file — it may be corrupted or not a real TIFF."
          : code === "engine-missing"
            ? "The TIFF engine couldn't start in this browser — try a Chromium-based browser."
            : "That file couldn't be read as a TIFF — it may be corrupted or use an unsupported compression."
      );
      setFile(null);
      setBuffer(null);
      setStage("error");
    }
  };

  const renderPage = async (idx: number): Promise<{ blob: Blob; w: number; h: number }> => {
    if (!buffer) throw new Error("no-buffer");
    const UTIF = utifEngine(await import("utif"));
    const ifds = UTIF.decode(buffer);
    const ifd = ifds[idx];
    if (!ifd) throw new Error("no-page");
    UTIF.decodeImage(buffer, ifd);
    const w = Number(ifd.width) || 0;
    const h = Number(ifd.height) || 0;
    if (!w || !h) throw new Error("page-undecodable");
    if (w * h > 120_000_000) throw new Error("page-too-big");
    const rgba = UTIF.toRGBA8(ifd);
    // Copy into a clamped array (ImageData needs Uint8ClampedArray).
    const clamped = new Uint8ClampedArray(rgba.length);
    clamped.set(rgba);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas-unavailable");
    // JPEG has no transparency: composite over white (standard practice).
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    const imgData = new ImageData(clamped, w, h);
    ctx.putImageData(imgData, 0, 0);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", quality / 100)
    );
    if (!blob) throw new Error("encode-failed");
    return { blob, w, h };
  };

  const convert = async () => {
    if (!file || !buffer || busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setResult(null);
    try {
      setStage("converting");
      const { blob, w, h } = await renderPage(pageIdx);
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      const suffix = pages.length > 1 ? `-p${pageIdx + 1}` : "";
      const r = {
        url: URL.createObjectURL(blob),
        name: `${base}${suffix}.jpg`,
        size: blob.size,
        w,
        h,
      };
      setResult(r);
      setPreviewUrl(r.url);
      setStage("done");
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      setError(
        code === "page-undecodable"
          ? `Page ${pageIdx + 1} uses a TIFF flavor this browser decoder can't read (some proprietary compressions aren't supported). Try another page, or re-export the TIFF.`
          : code === "page-too-big"
            ? `Page ${pageIdx + 1} is enormous — bigger than this browser can hold in memory. Export it at a lower resolution and try again.`
            : code === "canvas-unavailable" || code === "encode-failed"
              ? "Your browser couldn't encode the JPEG — try a Chromium-based browser."
              : "Conversion failed for this page — the TIFF may use an unsupported compression."
      );
      setStage("error");
    } finally {
      busyRef.current = false;
    }
  };

  const busy = stage === "reading" || stage === "converting";
  const current = pages[pageIdx];

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept=".tif,.tiff,image/tiff"
        style={{ display: "none" }}
        onChange={(e) => {
          pickFile(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
      {!file && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className="card"
          style={{ padding: "48px 24px", textAlign: "center", cursor: "pointer", borderStyle: "dashed", color: "var(--muted)" }}
        >
          <div className="font-display" style={{ fontSize: "1.6rem", marginBottom: 8, color: "var(--text2)" }}>
            Drop in a TIFF
          </div>
          <p style={{ fontSize: "0.92rem" }}>
            .tif / .tiff scans and photos up to 100MB — multi-page files supported.
            The TIFF engine loads on first use. Your file never leaves this browser.
          </p>
        </div>
      )}

      {stage === "reading" && (
        <p className="font-mono2" style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 14 }}>
          Reading your TIFF…
        </p>
      )}

      {error && (
        <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
          <strong>Heads up:</strong> {error}
        </div>
      )}

      {file && buffer && pages.length > 0 && stage !== "reading" && (
        <div style={{ marginTop: 4 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
              Choose a different TIFF
            </button>
            <span className="font-mono2" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              {file.name.length > 40 ? `${file.name.slice(0, 37)}…` : file.name} · {formatBytes(file.size)} ·{" "}
              {pages.length} page{pages.length === 1 ? "" : "s"}
            </span>
          </div>

          {pages.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              <label className="field-label" htmlFor="tiff-page">
                Page to convert
              </label>
              <select
                id="tiff-page"
                className="input"
                style={{ width: "auto", padding: "6px 10px" }}
                value={pageIdx}
                disabled={busy}
                onChange={(e) => {
                  setPageIdx(Number(e.target.value));
                  if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
                  setResult(null);
                  setPreviewUrl(null);
                }}
              >
                {pages.map((p) => (
                  <option key={p.index} value={p.index}>
                    Page {p.index + 1}{p.width ? ` — ${p.width}×${p.height}px` : ""}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
                Multi-page TIFF → one JPG per page. Convert each page you need, one at a time.
              </p>
            </div>
          )}

          <div style={{ marginBottom: 16, maxWidth: 420 }}>
            <label className="field-label" htmlFor="tiff-quality">
              JPG quality — {quality}%
            </label>
            <input
              id="tiff-quality"
              type="range"
              min={10}
              max={100}
              value={quality}
              disabled={busy}
              onChange={(e) => {
                setQuality(Number(e.target.value));
                if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
                setResult(null);
                setPreviewUrl(null);
              }}
              style={{ width: "100%", accentColor: "var(--red)" }}
            />
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
              92% is the sweet spot for scans. TIFFs are usually uncompressed, so the JPG
              will be dramatically smaller either way.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" className="btn btn-primary" onClick={convert} disabled={busy}>
              {busy ? "Converting…" : result ? "Convert again" : `Convert page ${pageIdx + 1} to JPG`}
            </button>
            {result && (
              <a href={result.url} download={result.name} className="btn">
                Download {result.name}
              </a>
            )}
          </div>

          <div className="notice" style={{ marginTop: 14 }}>
            <strong>Heads up:</strong> JPG has no transparency — any see-through areas come out
            white. And some rare proprietary TIFF compressions can&apos;t be decoded in a
            browser; if a page fails, re-export it as an uncompressed TIFF and retry.
          </div>

          {result && stage === "done" && current && (
            <div className="notice notice-ok" style={{ marginTop: 16 }}>
              <strong>Converted.</strong>{" "}
              <span className="font-mono2">
                Page {pageIdx + 1}: {result.w}×{result.h}px · {formatBytes(file.size)} TIFF →{" "}
                {formatBytes(result.size)} JPG
              </span>
              {previewUrl && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={previewUrl}
                    alt={`Page ${pageIdx + 1} as JPG`}
                    style={{ maxWidth: "100%", maxHeight: 280, border: "1px solid var(--line)", borderRadius: 12, display: "block", background: "#fff" }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
