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

const MAX_BYTES = 100 * 1024 * 1024; // ~100MB — wasm memory is finite
const BITRATES = [
  { id: "128k", label: "128 kbps — good for speech" },
  { id: "192k", label: "192 kbps — good for music" },
  { id: "320k", label: "320 kbps — best quality" },
];

type Stage = "idle" | "loading" | "working" | "done" | "error";

export default function Mp4ToMp3Client() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [bitrate, setBitrate] = useState("192k");
  const [stage, setStage] = useState<Stage>("idle");
  const [progressLabel, setProgressLabel] = useState("");
  const [progressPct, setProgressPct] = useState<number | null>(null);
  const [progressDetail, setProgressDetail] = useState("");
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
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
      setError("That doesn't look like a video — please choose an MP4, WebM, MOV, or similar video file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(
        `That video is ${formatBytes(f.size)} — over the ~100 MB limit. Trim it first (try our Video Trimmer) and upload again.`
      );
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
      setProgressLabel("Extracting audio…");
      setProgressPct(null);
      setProgressDetail("");
      const detach = onFFmpegProgress(ff, (p) => {
        setProgressPct(p);
        setProgressDetail("");
      });
      // Capture ffmpeg's stderr so a silent video gets an honest message
      // instead of a generic failure (ff.exec only rejects with a bare
      // FS error string; the reason lives in the logs).
      const logLines: string[] = [];
      const onLog = ({ message }: { message: string }) => {
        if (logLines.length < 60) logLines.push(message);
      };
      ff.on("log", onLog);
      try {
        await writeInputFile(ff, "input", file);
        const ret = await ff.exec(["-i", "input", "-vn", "-c:a", "libmp3lame", "-b:a", bitrate, "output.mp3"]);
        if (ret !== 0) throw new Error(logLines.join("\n") || "ffmpeg exited with an error");
      } finally {
        ff.off("log", onLog);
        detach();
      }
      const blob = await readOutputBlob(ff, "output.mp3", "audio/mpeg");
      await cleanupFFmpeg(ff, ["input", "output.mp3"]);
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "audio";
      setResult({ url: URL.createObjectURL(blob), name: `${base}.mp3`, size: blob.size });
      setStage("done");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
    } catch (e) {
      setStage("error");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
      // NOTE: ff.exec/readFile failures reject with a plain string (the
      // worker posts e.toString()), not an Error instance.
      const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "";
      setError(
        /does not contain any stream|no audio/i.test(msg)
          ? "That video doesn't seem to have an audio track — there's nothing to extract."
          : "Audio extraction failed. Your video may use an unusual format — try converting it to MP4 first (see our Video Converter), then try again."
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
        accept="video/*"
        style={{ display: "none" }}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()}>
          {file ? "Choose a different video" : "Choose video"}
        </button>
        <label className="field-label" style={{ margin: 0 }} htmlFor="mp3-bitrate">
          Quality
        </label>
        <select
          id="mp3-bitrate"
          className="input"
          style={{ width: "auto", padding: "6px 10px" }}
          value={bitrate}
          onChange={(e) => setBitrate(e.target.value)}
          disabled={busy}
        >
          {BITRATES.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={process}
          disabled={!file || busy}
        >
          {busy ? "Working…" : "Extract MP3"}
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
            MP4, WebM, MOV — up to ~100MB. First run loads the video engine
            (~30 MB) — once, then it&apos;s instant. Your file never leaves this browser.
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
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 12 }}>
          <span className="font-mono2">{file.name}</span> · {formatBytes(file.size)}
        </p>
      )}

      {result && stage === "done" && (
        <div style={{ marginTop: 8 }}>
          <p className="field-label">Your MP3</p>
          <audio controls src={result.url} style={{ width: "100%", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <a href={result.url} download={result.name} className="btn btn-primary btn-sm">
              Download MP3
            </a>
            <span className="font-mono2" style={{ fontSize: "0.74rem", color: "var(--text2)" }}>
              {formatBytes(result.size)} · saved as {result.name}
            </span>
          </div>
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
