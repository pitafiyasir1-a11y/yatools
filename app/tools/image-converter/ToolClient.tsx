"use client";

import { useEffect, useRef, useState } from "react";

type Format = "png" | "jpeg" | "webp";

const FORMATS: { id: Format; label: string; mime: string; ext: string }[] = [
  { id: "png", label: "PNG", mime: "image/png", ext: "png" },
  { id: "jpeg", label: "JPG", mime: "image/jpeg", ext: "jpg" },
  { id: "webp", label: "WebP", mime: "image/webp", ext: "webp" },
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

export default function ImageConverterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [format, setFormat] = useState<Format>("webp");
  const [quality, setQuality] = useState(0.85);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [imgUrl, result]);

  const pickFile = (f: File | null) => {
    setError(null);
    setResult(null);
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, WebP, GIF, BMP…).");
      return;
    }
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    const url = URL.createObjectURL(f);
    setFile(f);
    setImgUrl(url);
    loadImage(url)
      .then((img) => setDims({ w: img.naturalWidth, h: img.naturalHeight }))
      .catch(() => setError("That file couldn't be read as an image."));
  };

  const convert = async () => {
    if (!file || !imgUrl) return;
    setConverting(true);
    setError(null);
    try {
      const fmt = FORMATS.find((f) => f.id === format)!;
      const img = await loadImage(imgUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser couldn't start the canvas engine.");
      // JPEG has no alpha channel — flatten onto white instead of black.
      if (format === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, fmt.mime, format === "png" ? undefined : quality)
      );
      if (!blob) throw new Error("Conversion failed in this browser — try another format.");
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      setResult({ url: URL.createObjectURL(blob), size: blob.size, name: `${base}.${fmt.ext}` });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setConverting(false);
    }
  };

  const savings =
    file && result && result.size < file.size
      ? Math.round((1 - result.size / file.size) * 100)
      : null;

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
          or click to browse your device — PNG, JPG, WebP, GIF, BMP. Files never leave your browser.
        </p>
      </div>

      {file && imgUrl && (
        <div style={{ marginTop: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              alignItems: "start",
            }}
          >
            <div>
              <span className="field-label">Original</span>
              <img
                src={imgUrl}
                alt="Uploaded preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 240,
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  display: "block",
                }}
              />
              <p className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}>
                {file.name.length > 34 ? `${file.name.slice(0, 31)}…` : file.name}
                <br />
                {dims ? `${dims.w} × ${dims.h} px` : "…"} · {formatBytes(file.size)}
              </p>
            </div>

            <div>
              <span className="field-label">Convert to</span>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} role="group" aria-label="Target format">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`btn btn-sm${format === f.id ? " btn-primary" : ""}`}
                    aria-pressed={format === f.id}
                    onClick={() => {
                      setFormat(f.id);
                      setResult(null);
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 18 }}>
                <label className="field-label" htmlFor="ic-quality">
                  Quality — {format === "png" ? "not applicable (lossless)" : `${Math.round(quality * 100)}%`}
                </label>
                <input
                  id="ic-quality"
                  type="range"
                  min={10}
                  max={100}
                  value={Math.round(quality * 100)}
                  disabled={format === "png"}
                  onChange={(e) => {
                    setQuality(Number(e.target.value) / 100);
                    setResult(null);
                  }}
                  style={{ width: "100%", accentColor: "var(--red)" }}
                  aria-disabled={format === "png"}
                />
                <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
                  PNG is lossless, so it has no quality setting — every pixel is kept exactly.
                  JPG and WebP are lossy: lower quality means a smaller file.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
              <strong>Heads up:</strong> {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18, alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={convert}
              disabled={converting}
            >
              {converting ? "Converting…" : "Convert & download"}
            </button>
            {result && (
              <a href={result.url} download={result.name} className="btn">
                Download {result.name}
              </a>
            )}
          </div>

          {result && (
            <div className="notice notice-ok" style={{ marginTop: 16 }}>
              <strong>Converted.</strong> Original: <span className="font-mono2">{formatBytes(file.size)}</span>
              {" → "}New: <span className="font-mono2">{formatBytes(result.size)}</span>
              {savings !== null && (
                <> — <strong>{savings}% smaller</strong></>
              )}
              {savings === null && result.size > file.size && (
                <> — this one came out larger; lossless formats can't always shrink a file.</>
              )}
              {savings === null && result.size === file.size && (
                <> — exactly the same size as the original.</>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
