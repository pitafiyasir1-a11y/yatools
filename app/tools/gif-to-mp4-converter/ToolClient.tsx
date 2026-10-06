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

const FPS_OPTIONS = [
  { id: "orig", label: "Original frame rate" },
  { id: "15", label: "15 fps" },
  { id: "24", label: "24 fps" },
  { id: "30", label: "30 fps" },
];

const SCALE_OPTIONS = [
  { id: "orig", label: "Original size" },
  { id: "720", label: "720p max" },
  { id: "480", label: "480p max" },
];

type Stage = "idle" | "loading" | "working" | "done" | "error";

export default function GifToMp4Client() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fps, setFps] = useState("orig");
  const [scale, setScale] = useState("orig");
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
      if (result) URL.revokeObjectURL(result.url);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [result, previewUrl]);

  const pickFile = (f: File | null) => {
    if (!f) return;
    const okType = f.type === "image/gif" || /\.gif$/i.test(f.name);
    if (!okType) {
      setError("That doesn't look like a GIF — please choose a .gif file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(
        `That GIF is ${formatBytes(f.size)} — over the ~100 MB browser limit. Try a smaller GIF.`
      );
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
    try {
      setStage("loading");
      const ff = await loadFFmpeg(report);
      setStage("working");
      setProgressLabel("Converting GIF to MP4…");
      setProgressPct(null);
      setProgressDetail("usually quick — keep this tab open");
      const detach = onFFmpegProgress(ff, (p) => {
        setProgressPct(p);
        setProgressDetail("");
      });
      try {
        await writeInputFile(ff, "input.gif", file);
        const vf: string[] = [];
        if (fps !== "orig") vf.push(`fps=${fps}`);
        if (scale !== "orig") vf.push(`scale=-2:'min(${scale},ih)'`);
        // Even width/height is required for yuv420p (h264 won't take odd sizes).
        vf.push("scale=trunc(iw/2)*2:trunc(ih/2)*2");
        const args = [
          "-i",
          "input.gif",
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-crf",
          "20",
          "-preset",
          "veryfast",
          "-movflags",
          "+faststart",
          "-vf",
          vf.join(","),
          "output.mp4",
        ];
        await ff.exec(args);
      } finally {
        detach();
      }
      const blob = await readOutputBlob(ff, "output.mp4", "video/mp4");
      await cleanupFFmpeg(ff, ["input.gif", "output.mp4"]);
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "animation";
      setResult({ url: URL.createObjectURL(blob), name: `${base}.mp4`, size: blob.size });
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
        /invalid data/i.test(msg)
          ? "That file couldn't be read as a GIF — it may be corrupted or renamed from another format."
          : "Conversion failed. The GIF may be corrupted, or it may use an unusual encoding — try a different file."
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
        accept=".gif,image/gif"
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
            Drop in a GIF
          </div>
          <p style={{ fontSize: "0.92rem" }}>
            Animated .gif files up to ~100MB. First run loads the video engine
            (~30 MB) — once, then it&apos;s instant. Your file never leaves this browser.
          </p>
        </div>
      )}

      {file && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
              Choose a different GIF
            </button>
            <img
              src={previewUrl ?? undefined}
              alt="GIF preview"
              style={{ maxHeight: 120, borderRadius: 10, border: "1px solid var(--line)" }}
            />
            <span className="font-mono2" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              {file.name.length > 40 ? `${file.name.slice(0, 37)}…` : file.name} · {formatBytes(file.size)}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            <div>
              <label className="field-label" htmlFor="g2m-fps">
                Frame rate
              </label>
              <select
                id="g2m-fps"
                className="input"
                value={fps}
                onChange={(e) => {
                  setFps(e.target.value);
                  setResult(null);
                }}
                disabled={busy}
              >
                {FPS_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
                Lower fps = smaller file. 15 fps still looks smooth for most GIFs.
              </p>
            </div>
            <div>
              <span className="field-label">Size</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} role="group" aria-label="Output size">
                {SCALE_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`btn btn-sm${scale === o.id ? " btn-primary" : ""}`}
                    aria-pressed={scale === o.id}
                    disabled={busy}
                    onClick={() => {
                      setScale(o.id);
                      setResult(null);
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
                Downscales tall GIFs — never upscales a small one.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={convert}
              disabled={busy}
            >
              {busy ? "Converting…" : result ? "Convert again" : "Convert to MP4"}
            </button>
            {result && (
              <a href={result.url} download={result.name} className="btn">
                Download {result.name}
              </a>
            )}
          </div>

          <div className="notice" style={{ marginTop: 14 }}>
            <strong>Heads up:</strong> MP4 has no transparency — if your GIF has a see-through
            background, it will come out solid in the video. GIFs also tend to convert
            dramatically smaller; 5–10× is common.
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
          <strong>Converted.</strong>{" "}
          <span className="font-mono2">
            {formatBytes(file.size)} → {formatBytes(result.size)}
          </span>
          {savedPct !== null && (
            <>
              {" "}— <strong>{savedPct}% smaller</strong> than the GIF.
            </>
          )}
          <div style={{ marginTop: 12 }}>
            <video controls loop src={result.url} style={{ width: "100%", maxHeight: 320, borderRadius: 12, background: "#000" }} />
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
