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
const MAX_GIF_SECONDS = 10; // honest cap — longer GIFs become enormous files

type Stage = "idle" | "loading" | "working" | "done" | "error";

export default function VideoToGifClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [start, setStart] = useState("0");
  const [duration, setDuration] = useState("3");
  const [fps, setFps] = useState("10");
  const [width, setWidth] = useState("320");
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
    setVideoDuration(null);
    setStart("0");
    setDuration("3");
    setFile(f);
    setVideoUrl(URL.createObjectURL(f));
  };

  const process = async () => {
    if (!file || busyRef.current) return;
    const startS = Math.max(0, Number(start) || 0);
    let durS = Math.min(MAX_GIF_SECONDS, Math.max(1, Number(duration) || 3));
    if (videoDuration && startS + durS > videoDuration) {
      durS = Math.max(1, Math.min(MAX_GIF_SECONDS, videoDuration - startS));
    }
    setDuration(String(Math.round(durS * 10) / 10));
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
      setProgressLabel("Making your GIF…");
      setProgressPct(null);
      setProgressDetail("");
      const detach = onFFmpegProgress(ff, (p) => {
        setProgressPct(p);
        setProgressDetail("");
      });
      try {
        await writeInputFile(ff, "input", file);
        // Two-pass palette filter in one command = good-looking GIFs.
        await ff.exec([
          "-ss", String(startS),
          "-t", String(durS),
          "-i", "input",
          "-vf",
          `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256[p];[s1][p]paletteuse`,
          "output.gif",
        ]);
      } finally {
        detach();
      }
      const blob = await readOutputBlob(ff, "output.gif", "image/gif");
      await cleanupFFmpeg(ff, ["input", "output.gif"]);
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "clip";
      setResult({ url: URL.createObjectURL(blob), name: `${base}.gif`, size: blob.size });
      setStage("done");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
    } catch {
      setStage("error");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
      setError("GIF creation failed. The video may use an unusual format — try converting it to MP4 first (see our Video Converter), then try again.");
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
      <div style={{ marginBottom: 16 }}>
        <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()}>
          {file ? "Choose a different video" : "Choose video"}
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
            MP4, WebM, MOV — up to ~100MB. GIFs are capped at 10 seconds (longer
            clips make enormous files). First run loads the video engine (~30 MB) — once,
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

      {videoUrl && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 16 }}>
          <div>
            <p className="field-label">Preview</p>
            <video
              src={videoUrl}
              controls
              preload="metadata"
              onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
              style={{ width: "100%", borderRadius: 8, background: "#000" }}
            />
            {videoDuration !== null && (
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 6 }}>
                Video length: {videoDuration.toFixed(1)}s
              </p>
            )}
          </div>
          <div>
            <p className="field-label">GIF settings</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label className="field-label" htmlFor="gif-start">Start (seconds)</label>
                <input
                  id="gif-start"
                  type="number"
                  min={0}
                  step={0.5}
                  className="input"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  disabled={busy}
                />
              </div>
              <div>
                <label className="field-label" htmlFor="gif-dur">Length (seconds, max 10)</label>
                <input
                  id="gif-dur"
                  type="number"
                  min={1}
                  max={MAX_GIF_SECONDS}
                  step={0.5}
                  className="input"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={busy}
                />
              </div>
              <div>
                <label className="field-label" htmlFor="gif-fps">Smoothness</label>
                <select
                  id="gif-fps"
                  className="input"
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                  disabled={busy}
                >
                  <option value="10">10 fps — smaller file</option>
                  <option value="15">15 fps — smoother</option>
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="gif-width">Width</label>
                <select
                  id="gif-width"
                  className="input"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  disabled={busy}
                >
                  <option value="320">320 px — smaller file</option>
                  <option value="480">480 px — sharper</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={process}
              disabled={!file || busy}
              style={{ width: "100%" }}
            >
              {busy ? "Working…" : "Make GIF"}
            </button>
          </div>
        </div>
      )}

      {result && stage === "done" && (
        <div style={{ marginTop: 8 }}>
          <p className="field-label">Your GIF</p>
          <div className="card" style={{ padding: 10, display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <img src={result.url} alt="Generated GIF" style={{ maxWidth: "100%", maxHeight: 360, borderRadius: 8 }} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <a href={result.url} download={result.name} className="btn btn-primary btn-sm">
              Download GIF
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
