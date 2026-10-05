"use client";

import { useEffect, useRef, useState } from "react";

type OutFormat = "png" | "jpeg";
type FlipMode = "horizontal" | "vertical" | "both";

const FORMATS: { id: OutFormat; label: string; mime: string; ext: string }[] = [
  { id: "png", label: "PNG", mime: "image/png", ext: "png" },
  { id: "jpeg", label: "JPG", mime: "image/jpeg", ext: "jpg" },
];

const MODES: { id: FlipMode; label: string; hint: string }[] = [
  { id: "horizontal", label: "↔ Horizontal", hint: "Mirror left ↔ right" },
  { id: "vertical", label: "↕ Vertical", hint: "Flip top ↕ bottom" },
  { id: "both", label: "🔁 Both", hint: "Rotate 180° equivalent" },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / 1024 ** i;
  return `${v >= 100 ? v.toFixed(0) : v.toFixed(1)} ${units[i]}`;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That file couldn't be read as an image."));
    img.src = url;
  });
}

export default function MirrorImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [orig, setOrig] = useState<{ w: number; h: number } | null>(null);
  const [mode, setMode] = useState<FlipMode>("horizontal");
  const [format, setFormat] = useState<OutFormat>("png");
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [imgUrl]);

  // Render the flipped image live whenever the mode or source changes.
  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !orig) return;
    canvas.width = orig.w;
    canvas.height = orig.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    if (mode === "horizontal" || mode === "both") {
      ctx.translate(orig.w, 0);
      ctx.scale(-1, 1);
    }
    if (mode === "vertical" || mode === "both") {
      ctx.translate(0, orig.h);
      ctx.scale(1, -1);
    }
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }, [mode, orig, imgUrl]);

  const pickFile = (f: File | null) => {
    setError(null);
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, WebP, GIF, BMP…).");
      return;
    }
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    const url = URL.createObjectURL(f);
    setFile(f);
    setImgUrl(url);
    setOrig(null);
    loadImage(url)
      .then((img) => {
        imgRef.current = img;
        setOrig({ w: img.naturalWidth, h: img.naturalHeight });
      })
      .catch(() => setError("That file couldn't be read as an image."));
  };

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !file || !orig) return;
    setDownloading(true);
    setError(null);
    try {
      const fmt = FORMATS.find((f) => f.id === format)!;
      // JPG has no transparency: flatten onto white first.
      const out = document.createElement("canvas");
      out.width = canvas.width;
      out.height = canvas.height;
      const octx = out.getContext("2d");
      if (!octx) throw new Error("Your browser couldn't start the canvas engine.");
      if (format === "jpeg") {
        octx.fillStyle = "#ffffff";
        octx.fillRect(0, 0, out.width, out.height);
      }
      octx.drawImage(canvas, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        out.toBlob(resolve, fmt.mime, 0.92)
      );
      if (!blob) throw new Error("Download failed in this browser — try another format.");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      a.download = `${base}-mirrored.${fmt.ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload an image"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          pickFile(e.dataTransfer.files?.[0] || null);
        }}
        style={{
          border: "1.5px dashed var(--line)",
          borderRadius: 12,
          background: dragOver ? "var(--surface2)" : "transparent",
          padding: "clamp(24px, 5vw, 44px) 16px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            pickFile(e.target.files?.[0] || null);
            e.target.value = "";
          }}
        />
        <div className="font-display" style={{ fontSize: "1.5rem", marginBottom: 6 }}>
          {file ? "Swap image" : "Drop an image here"}
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          or click to browse your device — everything stays in your browser, nothing is uploaded.
        </p>
      </div>

      {file && imgUrl && (
        <div style={{ marginTop: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div>
              <span className="field-label">Before</span>
              <img
                src={imgUrl}
                alt="Original preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 240,
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  display: "block",
                  background: "var(--surface)",
                }}
              />
              <p
                className="font-mono2"
                style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}
              >
                {orig ? `${orig.w} × ${orig.h} px` : "…"} · {formatBytes(file.size)}
              </p>
            </div>
            <div>
              <span className="field-label">After — mirrored (live)</span>
              <canvas
                ref={canvasRef}
                aria-label="Mirrored preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 240,
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  display: "block",
                  background: "var(--surface)",
                }}
              />
              <p
                className="font-mono2"
                style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}
              >
                {orig
                  ? `${MODES.find((m) => m.id === mode)!.hint} · ${orig.w} × ${orig.h} px`
                  : "…"}
              </p>
            </div>
          </div>

          {error && (
            <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
              <strong>Heads up:</strong> {error}
            </div>
          )}

          <div style={{ marginTop: 18 }}>
            <span className="field-label">Flip direction</span>
            <div
              style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
              role="group"
              aria-label="Flip direction"
            >
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`btn btn-sm${mode === m.id ? " btn-primary" : ""}`}
                  aria-pressed={mode === m.id}
                  onClick={() => setMode(m.id)}
                  title={m.hint}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <span className="field-label">Download format</span>
            <div
              style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
              role="group"
              aria-label="Output format"
            >
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`btn btn-sm${format === f.id ? " btn-primary" : ""}`}
                  aria-pressed={format === f.id}
                  onClick={() => setFormat(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={download}
              disabled={downloading || !orig}
            >
              {downloading ? "Preparing…" : "Download mirrored image"}
            </button>
          </div>

          <div className="notice notice-ok" style={{ marginTop: 16 }}>
            <strong>Mirroring is lossless.</strong> The preview updates live, and the download keeps
            the exact original resolution — nothing is re-compressed beyond your chosen format.
          </div>
        </div>
      )}
    </div>
  );
}
