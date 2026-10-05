"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadFFmpeg,
  onFFmpegProgress,
  writeInputFile,
  readOutputBlob,
  cleanupFFmpeg,
  formatBytes,
  EngineProgress,
} from "../_vidconv/ffmpeg";

const MAX_BYTES = 100 * 1024 * 1024; // ~100MB — wasm memory is finite

const PRESETS = [
  { id: "ultrafast", label: "Ultrafast — quickest, bigger file" },
  { id: "veryfast", label: "Very fast — decent speed, good size" },
  { id: "fast", label: "Fast — slower, smaller file" },
  { id: "medium", label: "Medium — balanced (recommended)" },
  { id: "slow", label: "Slow — smallest file, takes several minutes" },
];

const RESOLUTIONS = [
  { id: "orig", label: "Original" },
  { id: "1080", label: "1080p HD" },
  { id: "720", label: "720p HD" },
  { id: "480", label: "480p" },
];

type Stage = "idle" | "loading" | "working" | "done" | "error";

export default function VideoCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [crf, setCrf] = useState(26);
  const [preset, setPreset] = useState("medium");
  const [resolution, setResolution] = useState("orig");
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
    const okType =
      f.type.startsWith("video/") || /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(f.name);
    if (!okType) {
      setError("That doesn't look like a video — please choose an MP4, WebM, MOV, or similar video file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(
        `That video is ${formatBytes(f.size)} — over the ~100 MB browser limit. Trim it first, then compress.`
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

  const compress = async () => {
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
      setProgressLabel("Compressing your video…");
      setProgressPct(null);
      setProgressDetail("large videos take several minutes — keep this tab open");
      const detach = onFFmpegProgress(ff, (p) => {
        setProgressPct(p);
        setProgressDetail("");
      });
      try {
        await writeInputFile(ff, "input", file);
        const args = [
          "-i",
          "input",
          "-c:v",
          "libx264",
          "-crf",
          String(crf),
          "-preset",
          preset,
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
        ];
        if (resolution !== "orig") {
          // Downscale only — never upscale a small video.
          args.push("-vf", `scale=-2:'min(${resolution},ih)'`);
        }
        args.push("output.mp4");
        await ff.exec(args);
      } finally {
        detach();
      }
      const blob = await readOutputBlob(ff, "output.mp4", "video/mp4");
      await cleanupFFmpeg(ff, ["input", "output.mp4"]);
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "video";
      setResult({ url: URL.createObjectURL(blob), name: `${base}-compressed.mp4`, size: blob.size });
      setStage("done");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
    } catch (e) {
      setStage("error");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
      const msg = e instanceof Error ? e.message : "";
      setError(
        /moov|header|invalid data/i.test(msg)
          ? "That file couldn't be read as a video — it may be corrupted or in an unusual container. Try converting it to MP4 first, then compress."
          : "Compression failed. The video may use an unusual codec, or the file may be corrupted — try a different file."
      );
    } finally {
      busyRef.current = false;
    }
  };

  const busy = stage === "loading" || stage === "working";
  const savedPct =
    file && result && result.size < file.size
      ? Math.round((1 - result.size / file.size) * 100)
      : null;

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
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

      {file && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
              Choose a different video
            </button>
            <span className="font-mono2" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              {file.name.length > 40 ? `${file.name.slice(0, 37)}…` : file.name} · {formatBytes(file.size)}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            <div>
              <label className="field-label" htmlFor="vc-crf">
                Compression — CRF {crf}
              </label>
              <input
                id="vc-crf"
                type="range"
                min={18}
                max={34}
                value={crf}
                onChange={(e) => {
                  setCrf(Number(e.target.value));
                  setResult(null);
                }}
                disabled={busy}
                style={{ width: "100%", accentColor: "var(--red)" }}
              />
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
                Higher = smaller file, lower quality. 26 is the sweet spot; 18 is near-lossless,
                34 is heavy compression for sharing.
              </p>
            </div>
            <div>
              <label className="field-label" htmlFor="vc-preset">
                Speed vs. size
              </label>
              <select
                id="vc-preset"
                className="input"
                value={preset}
                onChange={(e) => {
                  setPreset(e.target.value);
                  setResult(null);
                }}
                disabled={busy}
              >
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
                Slower presets squeeze out more size but take longer — “slow” on a big video
                can take several minutes in your browser.
              </p>
            </div>
            <div>
              <span className="field-label">Resolution</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} role="group" aria-label="Output resolution">
                {RESOLUTIONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`btn btn-sm${resolution === r.id ? " btn-primary" : ""}`}
                    aria-pressed={resolution === r.id}
                    disabled={busy}
                    onClick={() => {
                      setResolution(r.id);
                      setResult(null);
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
                Downscales big videos — never upscales. 720p is plenty for most sharing.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={compress}
              disabled={busy}
            >
              {busy ? "Compressing…" : result ? "Compress again" : "Compress video"}
            </button>
            {result && (
              <a href={result.url} download={result.name} className="btn">
                Download {result.name}
              </a>
            )}
          </div>

          <div className="notice" style={{ marginTop: 14 }}>
            <strong>Heads up:</strong> compression happens entirely in your browser. Large videos
            take several minutes — keep this tab open and don&apos;t close your laptop lid
            while it works.
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
        <div className="notice notice-ok" style={{ marginTop: 8 }}>
          <strong>Compressed.</strong>{" "}
          <span className="font-mono2">
            {formatBytes(file.size)} → {formatBytes(result.size)}
          </span>
          {savedPct !== null && (
            <>
              {" "}— <strong>{savedPct}% smaller</strong>.
            </>
          )}
          {savedPct === null && (
            <>
              {" "}— the compressed file isn&apos;t smaller than the original. Your source was
              probably already tightly compressed; try a higher CRF or a lower resolution.
            </>
          )}
          <div style={{ marginTop: 12 }}>
            <video controls src={result.url} style={{ width: "100%", maxHeight: 320, borderRadius: 12, background: "#000" }} />
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
