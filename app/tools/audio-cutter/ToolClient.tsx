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

export default function AudioCutterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [audioUrl, result]);

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("audio/") && !/\.(mp3|wav|m4a|flac|ogg|opus|aac)$/i.test(f.name)) {
      setError("That doesn't look like an audio file — please choose an MP3, WAV, M4A, FLAC, or OGG file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(`That file is ${formatBytes(f.size)} — over the ~100 MB limit.`);
      return;
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (result) URL.revokeObjectURL(result.url);
    setError(null);
    setResult(null);
    setStage("idle");
    setProgressPct(null);
    setProgressDetail("");
    setDuration(null);
    setNow(0);
    setStart("0");
    setEnd("");
    setFile(f);
    setAudioUrl(URL.createObjectURL(f));
  };

  const useCurrentTime = (which: "start" | "end") => {
    const a = audioRef.current;
    if (!a) return;
    const t = Math.round(a.currentTime * 10) / 10;
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
    if (duration && endS > duration + 0.5) {
      setError(`The audio is only ${fmtTime(duration)} long — pick an end time within it.`);
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
      setProgressLabel("Cutting audio…");
      setProgressPct(null);
      setProgressDetail(`${fmtTime(startS)} → ${fmtTime(endS)}`);
      const detach = onFFmpegProgress(ff, (p) => {
        setProgressPct(p);
        setProgressDetail(`${fmtTime(startS)} → ${fmtTime(endS)}`);
      });
      try {
        await writeInputFile(ff, "input", file);
        // Re-encode to MP3 (libmp3lame, 192k) — sample-accurate cuts, plays everywhere.
        const ret = await ff.exec([
          "-ss", String(startS),
          "-t", String(durS),
          "-i", "input",
          "-vn",
          "-c:a", "libmp3lame",
          "-b:a", "192k",
          "output.mp3",
        ]);
        if (ret !== 0) throw new Error(`ffmpeg exited with code ${ret}`);
      } finally {
        detach();
      }
      const blob = await readOutputBlob(ff, "output.mp3", "audio/mpeg");
      await cleanupFFmpeg(ff, ["input", "output.mp3"]);
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "audio";
      setResult({ url: URL.createObjectURL(blob), name: `${base}-cut.mp3`, size: blob.size });
      setStage("done");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
    } catch {
      setStage("error");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
      setError("Cutting failed. The file may use an unusual format — try converting it to MP3 first (see our Audio to MP3 tool), then try again.");
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
        accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.opus,.aac"
        style={{ display: "none" }}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />
      <div style={{ marginBottom: 16 }}>
        <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()}>
          {file ? "Choose a different audio file" : "Choose audio file"}
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
            Drop in an audio file
          </div>
          <p style={{ fontSize: "0.92rem" }}>
            MP3, WAV, M4A, FLAC, OGG — up to ~100MB. Cut out the part you want and export a new
            MP3. First run loads the audio engine (~30 MB) — once, then it&apos;s instant. Your file
            never leaves this browser.
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

      {audioUrl && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 16 }}>
          <div>
            <p className="field-label">Preview — listen to find your cut points</p>
            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              preload="metadata"
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration;
                if (Number.isFinite(d)) {
                  setDuration(d);
                  setEnd(String(Math.round(d * 10) / 10));
                }
              }}
              onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)}
              style={{ width: "100%" }}
            />
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 6 }}>
              Current position: <span className="font-mono2">{fmtTime(now)}</span>
              {duration !== null && <> · length: {fmtTime(duration)}</>}
            </p>
          </div>
          <div>
            <p className="field-label">Cut points (seconds)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label className="field-label" htmlFor="cut-start">Start</label>
                <input
                  id="cut-start"
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
                <label className="field-label" htmlFor="cut-end">End</label>
                <input
                  id="cut-end"
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
              {busy ? "Working…" : "Cut & export MP3"}
            </button>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
              Exports as MP3 at 192 kbps, so it plays everywhere. Cuts are sample-accurate because
              the clip is re-encoded.
            </p>
          </div>
        </div>
      )}

      {result && stage === "done" && (
        <div style={{ marginTop: 8 }}>
          <p className="field-label">Your cut clip</p>
          <audio src={result.url} controls style={{ width: "100%", marginBottom: 12 }} />
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
