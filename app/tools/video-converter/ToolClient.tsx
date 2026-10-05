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

const MAX_BYTES = 100 * 1024 * 1024;

type Stage = "idle" | "loading" | "working" | "done" | "error";

export default function VideoConverterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [progressLabel, setProgressLabel] = useState("");
  const [progressPct, setProgressPct] = useState<number | null>(null);
  const [progressDetail, setProgressDetail] = useState("");
  const [result, setResult] = useState<{ url: string; name: string; size: number; method: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [videoUrl, result]);

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("That doesn't look like a video — please choose a MOV, MKV, WebM, AVI, or similar video file.");
      return;
    }
    if (/\.(mp4|m4v)$/i.test(f.name)) {
      setError("That file is already an MP4 — nothing to convert. (If it won't play somewhere, try our Video Trimmer to re-export it.)");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(`That video is ${formatBytes(f.size)} — over the ~100 MB limit.`);
      return;
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (result) URL.revokeObjectURL(result.url);
    setError(null);
    setResult(null);
    setStage("idle");
    setProgressPct(null);
    setProgressDetail("");
    setFile(f);
    setVideoUrl(URL.createObjectURL(f));
  };

  const process = async () => {
    if (!file || busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setResult(null);
    const report = (label: string, pct: number | null, detail: string) => {
      setProgressLabel(label);
      setProgressPct(pct);
      setProgressDetail(detail);
    };
    try {
      setStage("loading");
      const ff = await loadFFmpeg(report);
      setStage("working");
      setProgressLabel("Converting to MP4…");
      setProgressPct(null);
      setProgressDetail("trying fast remux first");
      const detach = onFFmpegProgress(ff, (p) => {
        setProgressPct(p);
      });
      let method = "";
      try {
        await writeInputFile(ff, "input", file);
        try {
          // Fast path: repackage streams without touching them — instant,
          // zero quality loss. Works when the codecs are MP4-compatible
          // (e.g. H.264/AAC inside MOV or MKV).
          await ff.exec([
            "-i", "input",
            "-map", "0:v:0", "-map", "0:a?",
            "-c", "copy",
            "-movflags", "+faststart",
            "output.mp4",
          ]);
          method = "remuxed — streams copied untouched, zero quality loss";
        } catch {
          // Slow path: codecs (e.g. VP8/VP9, AV1, Vorbis) can't live in MP4,
          // so re-encode to H.264 + AAC.
          setProgressLabel("Converting to MP4…");
          setProgressDetail("remux not possible — re-encoding for compatibility");
          await ff.exec([
            "-i", "input",
            "-map", "0:v:0", "-map", "0:a?",
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-movflags", "+faststart",
            "output.mp4",
          ]);
          method = "re-encoded to H.264 + AAC for maximum compatibility";
        }
      } finally {
        detach();
      }
      const blob = await readOutputBlob(ff, "output.mp4", "video/mp4");
      await cleanupFFmpeg(ff, ["input", "output.mp4"]);
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "video";
      setResult({ url: URL.createObjectURL(blob), name: `${base}.mp4`, size: blob.size, method });
      setStage("done");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
    } catch {
      setStage("error");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
      setError("Conversion failed. The file may be corrupted or use a codec this browser build can't decode — try a different source file.");
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
        accept="video/*,.mkv"
        style={{ display: "none" }}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />
      <div style={{ marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()}>
          {file ? "Choose a different video" : "Choose video"}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={process}
          disabled={!file || busy}
        >
          {busy ? "Working…" : "Convert to MP4"}
        </button>
      </div>

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
            Drop in a video
          </div>
          <p style={{ fontSize: "0.92rem" }}>
            MOV, MKV, WebM, AVI — up to ~100MB. Converts to MP4 (H.264 + AAC)
            that plays everywhere. First run loads the video engine (~30 MB) — once,
            then it&apos;s instant. Your file never leaves this browser.
          </p>
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

      {videoUrl && file && (
        <div>
          <p className="field-label">Input</p>
          <video src={videoUrl} controls preload="metadata" style={{ width: "100%", maxHeight: 300, borderRadius: 8, background: "#000", marginBottom: 8 }} />
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            <span className="font-mono2">{file.name}</span> · {formatBytes(file.size)}
          </p>
        </div>
      )}

      {result && stage === "done" && (
        <div style={{ marginTop: 16 }}>
          <p className="field-label">Your MP4</p>
          <video src={result.url} controls style={{ width: "100%", maxHeight: 300, borderRadius: 8, background: "#000", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <a href={result.url} download={result.name} className="btn btn-primary btn-sm">
              Download MP4
            </a>
            <span className="font-mono2" style={{ fontSize: "0.74rem", color: "var(--text2)" }}>
              {formatBytes(result.size)} · saved as {result.name}
            </span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
            How it was converted: {result.method}.
          </p>
        </div>
      )}

      {error && (
        <div className="notice" style={{ marginTop: 16 }}>
          {error}
        </div>
      )}
    </div>
  );
}
