"use client";

import { useEffect, useRef, useState } from "react";

const MAX_BYTES = 10 * 1024 * 1024; // ~10MB soft cap

const FAIL_MESSAGE =
  "Background removal failed — the AI model couldn't load or run. Next steps: " +
  "1) check your internet connection (the first run downloads ~40 MB), " +
  "2) use a Chromium-based browser like Chrome or Edge with WebGPU enabled, " +
  "3) try a smaller image.";

type Stage = "idle" | "loading" | "working" | "done" | "error";

export default function BackgroundRemoverClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [progressLabel, setProgressLabel] = useState("");
  const [progressPct, setProgressPct] = useState<number | null>(null);
  const [progressDetail, setProgressDetail] = useState(""); // e.g. "12.4 / 40.0 MB"
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("That doesn't look like an image — please choose a JPG, PNG, WebP, or similar image file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(
        `That image is ${(f.size / 1024 / 1024).toFixed(1)}MB — over the ~10MB limit. Resize or compress it first (try our Image Compressor) and upload again.`
      );
      return;
    }
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setError(null);
    setResultUrl(null);
    setStage("idle");
    setProgressLabel("");
    setProgressPct(null);
    setProgressDetail("");
    setFile(f);
    setOriginalUrl(URL.createObjectURL(f));
  };

  const process = async () => {
    if (!file) return;
    setError(null);
    setStage("loading");
    setProgressLabel("Loading AI model…");
    setProgressPct(null);
    setProgressDetail("");
    try {
      // Dynamic import keeps the AI model code and its heavy dependencies
      // out of the initial bundle — nothing loads until you press the button.
      const { removeBackground } = await import("@imgly/background-removal");
      setStage("working");
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          // First-run calls fetch:… while the ~40MB model downloads,
          // then compute:… while the image is segmented.
          if (key.startsWith("fetch:")) {
            setProgressLabel("Downloading AI model…");
            if (total > 0) {
              setProgressPct(Math.round((current / total) * 100));
              setProgressDetail(
                `${(current / 1048576).toFixed(1)} / ${(total / 1048576).toFixed(1)} MB`
              );
            } else {
              setProgressPct(null);
              setProgressDetail("");
            }
          } else {
            setProgressLabel("Removing background…");
            setProgressPct(null);
            setProgressDetail("");
          }
        },
        // "small" model (~42MB vs the ~84MB default): much faster first
        // download, quality fine for typical photos per the library docs.
        model: "isnet_quint8",
        output: { format: "image/png", quality: 1 },
      });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setStage("done");
      setProgressLabel("");
    } catch {
      setStage("error");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
      setError(FAIL_MESSAGE);
    }
  };

  const downloadName = file
    ? `${file.name.replace(/\.[^.]+$/, "") || "image"}-no-background.png`
    : "no-background.png";

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button type="button" className="neu-btn neu-btn-sm" onClick={() => inputRef.current?.click()}>
          {file ? "Choose a different image" : "Choose image"}
        </button>
        <button
          type="button"
          className="neu-btn neu-btn-primary neu-btn-sm"
          onClick={process}
          disabled={!file || stage === "loading" || stage === "working"}
        >
          {stage === "loading" || stage === "working" ? "Working…" : "Remove background"}
        </button>
      </div>

      {!file && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className="neu-card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            borderStyle: "dashed",
            color: "var(--muted)",
          }}
        >
          <div className="font-display" style={{ fontSize: "1.6rem", marginBottom: 8, color: "var(--text2)" }}>
            Drop in a photo
          </div>
          <p style={{ fontSize: "0.92rem" }}>
            JPG, PNG, WebP — up to ~10MB. First run downloads the AI model
            (~40 MB) — once, then it&apos;s cached in your browser. Later runs are instant.
          </p>
        </div>
      )}

      {(stage === "loading" || stage === "working") && (
        <div className="notice" style={{ marginBottom: 16 }} aria-live="polite">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <strong>{progressLabel}</strong>
            {progressPct !== null && (
              <span className="font-mono2" style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                {progressDetail ? `${progressDetail} (${progressPct}%)` : `${progressPct}%`}
              </span>
            )}
          </div>
          <div
            style={{
              height: 14,
              border: "2px solid var(--ink)",
              borderRadius: 8,
              marginTop: 10,
              overflow: "hidden",
              background: "var(--paper2)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: progressPct !== null ? `${progressPct}%` : "45%",
                background: "var(--red)",
                borderRadius: 6,
                transition: "width 0.3s ease",
                animation: progressPct !== null ? undefined : "br-slide 1.2s ease-in-out infinite",
              }}
            />
          </div>
          <style>{`@keyframes br-slide { 0% { transform: translateX(-100%);} 100% { transform: translateX(220%);} }`}</style>
          {progressLabel.startsWith("Downloading") && (
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
              First run downloads the AI model (~40 MB) — once, then it&apos;s cached
              in your browser. Later runs are instant.
            </p>
          )}
        </div>
      )}

      {originalUrl && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          <div>
            <p className="neu-label">Before</p>
            <div
              className="neu-card"
              style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220 }}
            >
              <img
                src={originalUrl}
                alt="Original uploaded image"
                style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 8, objectFit: "contain" }}
              />
            </div>
          </div>
          <div>
            <p className="neu-label">After</p>
            <div
              className="neu-card"
              style={{
                padding: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 220,
                backgroundImage:
                  "repeating-conic-gradient(var(--line) 0 25%, transparent 0 50%)",
                backgroundSize: "22px 22px",
              }}
            >
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Image with background removed"
                  style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 8, objectFit: "contain" }}
                />
              ) : (
                <span style={{ color: "var(--muted)", fontSize: "0.9rem", padding: 20, textAlign: "center" }}>
                  {stage === "idle"
                    ? "Press “Remove background” to see the result here."
                    : "Processing…"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {resultUrl && stage === "done" && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16, alignItems: "center" }}>
          <a href={resultUrl} download={downloadName} className="neu-btn neu-btn-primary neu-btn-sm">
            Download PNG
          </a>
          <span className="font-mono2" style={{ fontSize: "0.74rem", color: "var(--text2)" }}>
            Transparent background · PNG · saved as {downloadName}
          </span>
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
