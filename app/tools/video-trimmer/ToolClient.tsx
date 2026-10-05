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

function fmtTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) return "0.0s";
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1);
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

export default function VideoTrimmerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [start, setStart] = useState("0");
  const [end, setEnd] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [progressLabel, setProgressLabel] = useState("");
  const [progressPct, setProgressPct] = useState<number | null>(null);
  const [progressDetail, setProgressDetail] = useState("");
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    setNow(0);
    setStart("0");
    setEnd("");
    setFile(f);
    setVideoUrl(URL.createObjectURL(f));
  };

  const useCurrentTime = (which: "start" | "end") => {
    const v = videoRef.current;
    if (!v) return;
    const t = Math.round(v.currentTime * 10) / 10;
    if (which === "start") setStart(String(t));
    else setEnd(String(t));
  };

  const process = async () => {
    if (!file || busyRef.current) return;
    const startS = Math.max(0, Number(start) || 0);
    const endS = Number(end);
    if (!Number.isFinite(endS) || endS <= startS) {
      setError("Set an end time after the start time — e.g. start 5, end 12.");
      return;
    }
    if (videoDuration && endS > videoDuration + 0.5) {
      setError(`The video is only ${fmtTime(videoDuration)} long — pick an end time within it.`);
      return;
    }
    const durS = endS - startS;
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
      setProgressLabel("Trimming video…");
      setProgressPct(null);
      setProgressDetail(`${fmtTime(startS)} → ${fmtTime(endS)}`);
      const detach = onFFmpegProgress(ff, (p) => {
        setProgressPct(p);
        setProgressDetail(`${fmtTime(startS)} → ${fmtTime(endS)}`);
      });
      try {
        await writeInputFile(ff, "input", file);
        // Re-encode (H.264 + AAC): frame-accurate cuts, plays everywhere.
        await ff.exec([
          "-ss", String(startS),
          "-t", String(durS),
          "-i", "input",
          "-c:v", "libx264",
          "-preset", "veryfast",
          "-pix_fmt", "yuv420p",
          "-c:a", "aac",
          "-movflags", "+faststart",
          "output.mp4",
        ]);
      } finally {
        detach();
      }
      const blob = await readOutputBlob(ff, "output.mp4", "video/mp4");
      await cleanupFFmpeg(ff, ["input", "output.mp4"]);
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "video";
      setResult({ url: URL.createObjectURL(blob), name: `${base}-trimmed.mp4`, size: blob.size });
      setStage("done");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
    } catch {
      setStage("error");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
      setError("Trimming failed. The video may use an unusual format — try converting it to MP4 first (see our Video Converter), then try again.");
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
            MP4, WebM, MOV — up to ~100MB. Cut out the part you want and export
            a new MP4. First run loads the video engine (~30 MB) — once, then
            it&apos;s instant. Your file never leaves this browser.
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
            <p className="field-label">Preview — scrub to find your cut points</p>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              preload="metadata"
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration;
                setVideoDuration(d);
                setEnd(String(Math.round(d * 10) / 10));
              }}
              onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)}
              style={{ width: "100%", borderRadius: 8, background: "#000" }}
            />
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 6 }}>
              Current position: <span className="font-mono2">{fmtTime(now)}</span>
              {videoDuration !== null && <> · length: {fmtTime(videoDuration)}</>}
            </p>
          </div>
          <div>
            <p className="field-label">Cut points (seconds)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label className="field-label" htmlFor="trim-start">Start</label>
                <input
                  id="trim-start"
                  type="number"
                  min={0}
                  step={0.1}
                  className="input"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  disabled={busy}
                />
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ marginTop: 8, width: "100%" }}
                  onClick={() => useCurrentTime("start")}
                  disabled={busy}
                >
                  Use current ▶ start
                </button>
              </div>
              <div>
                <label className="field-label" htmlFor="trim-end">End</label>
                <input
                  id="trim-end"
                  type="number"
                  min={0}
                  step={0.1}
                  className="input"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  disabled={busy}
                />
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ marginTop: 8, width: "100%" }}
                  onClick={() => useCurrentTime("end")}
                  disabled={busy}
                >
                  Use current ▶ end
                </button>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={process}
              disabled={!file || busy}
              style={{ width: "100%" }}
            >
              {busy ? "Working…" : "Trim & export MP4"}
            </button>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
              Exports as MP4 (H.264 + AAC) so it plays everywhere. Cuts are
              frame-accurate because the clip is re-encoded.
            </p>
          </div>
        </div>
      )}

      {result && stage === "done" && (
        <div style={{ marginTop: 8 }}>
          <p className="field-label">Your trimmed clip</p>
          <video src={result.url} controls style={{ width: "100%", maxHeight: 320, borderRadius: 8, background: "#000", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <a href={result.url} download={result.name} className="btn btn-primary btn-sm">
              Download MP4
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
