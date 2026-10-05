/* Shared single-format video → MP4 client for the dedicated SEO converter
 * pages (mkv-to-mp4-converter, mov-to-mp4-converter).
 *
 * Pipeline: ffmpeg.wasm (single-threaded core, jsDelivr CDN) via the shared
 * loader in ../ffmpeg-loader. Strategy: lossless `-c copy` remux first,
 * falling back to H.264 + AAC re-encode — the page reports which path was
 * taken. Everything runs in the user's browser — no uploads.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadFFmpeg,
  onFFmpegProgress,
  writeInputFile,
  readOutputBlob,
  cleanupFFmpeg,
  formatBytes,
} from "../ffmpeg-loader";
import { EngineProgress } from "../ffmpeg-progress";
import { remuxArgs, reencodeArgs } from "./video-args";

const MAX_BYTES = 50 * 1024 * 1024; // ~50MB — wasm memory is finite

export interface VideoMp4Config {
  /** "MKV" / "MOV" */
  inputLabel: string;
  /** ".mkv" / ".mov" */
  inputExt: string;
  /** file input accept attr */
  accept: string;
  /** validates the single accepted format */
  extPattern: RegExp;
  /** shown when the user picks a different format */
  wrongFormatError: string;
  /** drop zone headline */
  dropTitle: string;
  /** drop zone supporting copy */
  dropHint: string;
  /** explains remux-first for this format (shown in a notice) */
  strategyNote: string;
}

type Stage = "idle" | "loading" | "working" | "done" | "error";
type ConvPath = "remuxed" | "re-encoded";

export default function VideoMp4Client({ config }: { config: VideoMp4Config }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [progressLabel, setProgressLabel] = useState("");
  const [progressPct, setProgressPct] = useState<number | null>(null);
  const [progressDetail, setProgressDetail] = useState("");
  const [result, setResult] = useState<{
    url: string;
    name: string;
    size: number;
    path: ConvPath;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [result, previewUrl]);

  const reset = () => {
    if (result) URL.revokeObjectURL(result.url);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (inputRef.current) inputRef.current.value = "";
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setStage("idle");
    setProgressPct(null);
    setProgressLabel("");
    setProgressDetail("");
  };

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (!config.extPattern.test(f.name)) {
      setError(config.wrongFormatError);
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(`That file is ${formatBytes(f.size)} — over the ~50 MB browser limit.`);
      return;
    }
    if (result) URL.revokeObjectURL(result.url);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setError(null);
    setResult(null);
    setStage("idle");
    setProgressPct(null);
    setProgressDetail("");
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const convert = async () => {
    if (!file || busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setResult(null);
    const report = (label: string, pct: number | null, detail: string) => {
      setProgressLabel(label);
      setProgressPct(pct);
      setProgressDetail(detail);
    };
    const inName = `input${config.inputExt}`;
    const outName = "output.mp4";
    try {
      setStage("loading");
      const ff = await loadFFmpeg(report);
      setStage("working");
      const detach = onFFmpegProgress(ff, (p) => {
        setProgressPct(p);
        setProgressDetail("");
      });
      let path: ConvPath;
      try {
        await writeInputFile(ff, inName, file);
        // Path 1: lossless remux — instant, original quality, same size.
        setProgressLabel(`Trying a quick remux of your ${config.inputLabel}…`);
        setProgressPct(null);
        setProgressDetail("no re-encoding — this is usually instant");
        try {
          await ff.exec(remuxArgs(inName, outName));
          path = "remuxed";
        } catch {
          // Path 2: the source's streams don't fit MP4 — re-encode to
          // H.264 + AAC, the pair every player on earth understands.
          await cleanupFFmpeg(ff, [outName]);
          setProgressLabel(`Re-encoding to H.264 + AAC…`);
          setProgressDetail("keep this tab open — video encoding takes a while");
          await ff.exec(reencodeArgs(inName, outName));
          path = "re-encoded";
        }
      } finally {
        detach();
      }
      const blob = await readOutputBlob(ff, outName, "video/mp4");
      if (blob.size === 0) {
        throw new Error("The conversion produced an empty file.");
      }
      await cleanupFFmpeg(ff, [inName, outName]);
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "video";
      setResult({
        url: URL.createObjectURL(blob),
        name: `${base}.mp4`,
        size: blob.size,
        path,
      });
      setStage("done");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
    } catch (e) {
      setStage("error");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
      setError(
        e instanceof Error && /empty file/i.test(e.message)
          ? `That ${config.inputLabel} couldn't be converted — it may be corrupted or use an unsupported codec.`
          : `Conversion failed. The ${config.inputLabel} may be corrupted, DRM-protected, or use an unusual codec — try a different file.`
      );
    } finally {
      busyRef.current = false;
    }
  };

  const busy = stage === "loading" || stage === "working";

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        style={{ display: "none" }}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />
      {!file && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className="card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            borderStyle: "dashed",
            color: "var(--muted)",
          }}
        >
          <div
            className="font-display"
            style={{ fontSize: "1.6rem", marginBottom: 8, color: "var(--text2)" }}
          >
            {config.dropTitle}
          </div>
          <p style={{ fontSize: "0.92rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
            {config.dropHint}
          </p>
        </div>
      )}

      {file && (
        <div style={{ marginBottom: 4 }}>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              Choose a different file
            </button>
            {previewUrl && (
              <video
                src={previewUrl}
                muted
                playsInline
                preload="metadata"
                style={{
                  maxHeight: 120,
                  borderRadius: 10,
                  border: "1px solid var(--line)",
                  background: "#000",
                }}
              />
            )}
            <span className="font-mono2" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              {file.name.length > 40 ? `${file.name.slice(0, 37)}…` : file.name} ·{" "}
              {formatBytes(file.size)}
            </span>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={convert}
              disabled={busy}
            >
              {busy ? "Converting…" : result ? "Convert again" : "Convert to MP4"}
            </button>
            <button type="button" className="btn" onClick={reset} disabled={busy}>
              Start over
            </button>
            {result && (
              <a href={result.url} download={result.name} className="btn btn-primary btn-sm">
                Download {result.name}
              </a>
            )}
          </div>

          <div className="notice" style={{ marginTop: 14 }}>
            <strong>How it converts:</strong> {config.strategyNote}
          </div>
        </div>
      )}

      {busy && (
        <EngineProgress
          label={progressLabel}
          pct={progressPct}
          detail={progressDetail}
          firstRun={stage === "loading"}
        />
      )}

      {result && stage === "done" && file && (
        <div className="notice notice-ok" style={{ marginTop: 16 }}>
          <strong>Converted</strong> —{" "}
          {result.path === "remuxed" ? (
            <>
              your {config.inputLabel} was <strong>remuxed</strong>: same quality, same
              size, new MP4 container.{" "}
              <span className="font-mono2">
                {formatBytes(file.size)} → {formatBytes(result.size)}
              </span>
            </>
          ) : (
            <>
              your {config.inputLabel} was <strong>re-encoded</strong> to H.264 + AAC for
              maximum compatibility.{" "}
              <span className="font-mono2">
                {formatBytes(file.size)} → {formatBytes(result.size)}
              </span>
            </>
          )}
          <div style={{ marginTop: 12 }}>
            <video
              controls
              src={result.url}
              style={{
                width: "100%",
                maxHeight: 340,
                borderRadius: 12,
                background: "#000",
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="notice" style={{ marginTop: 16, borderColor: "var(--red)" }}>
          <strong>Heads up:</strong> {error}
        </div>
      )}
    </div>
  );
}
