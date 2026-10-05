"use client";

import { useEffect, useRef, useState } from "react";

type Format = "png" | "jpeg" | "webp";

const FORMATS: { id: Format; label: string; mime: string; ext: string }[] = [
  { id: "png", label: "PNG", mime: "image/png", ext: "png" },
  { id: "jpeg", label: "JPG", mime: "image/jpeg", ext: "jpg" },
  { id: "webp", label: "WebP", mime: "image/webp", ext: "webp" },
];

const PRESETS = [
  { label: "1920 × 1080", w: 1920, h: 1080 },
  { label: "1080 × 1080", w: 1080, h: 1080 },
  { label: "1200 × 630", w: 1200, h: 630 },
  { label: "800 × 600", w: 800, h: 600 },
];

const MAX_SIDE = 8000;

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

export default function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [orig, setOrig] = useState<{ w: number; h: number } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [locked, setLocked] = useState(true);
  const [format, setFormat] = useState<Format>("png");
  const [quality, setQuality] = useState(0.85);
  const [resizing, setResizing] = useState(false);
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
      .then((img) => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setOrig({ w, h });
        setWidth(String(w));
        setHeight(String(h));
      })
      .catch(() => setError("That file couldn't be read as an image."));
  };

  const wNum = parseInt(width, 10);
  const hNum = parseInt(height, 10);
  const validDims =
    Number.isInteger(wNum) && Number.isInteger(hNum) && wNum > 0 && hNum > 0;
  const overCap = validDims && (wNum > MAX_SIDE || hNum > MAX_SIDE);

  const setWidthKeepRatio = (val: string) => {
    setWidth(val);
    setResult(null);
    const w = parseInt(val, 10);
    if (locked && orig && Number.isInteger(w) && w > 0) {
      setHeight(String(Math.max(1, Math.round((w * orig.h) / orig.w))));
    }
  };

  const setHeightKeepRatio = (val: string) => {
    setHeight(val);
    setResult(null);
    const h = parseInt(val, 10);
    if (locked && orig && Number.isInteger(h) && h > 0) {
      setWidth(String(Math.max(1, Math.round((h * orig.w) / orig.h))));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setWidth(String(w));
    setHeight(String(h));
    setResult(null);
  };

  const resize = async () => {
    if (!file || !imgUrl || !validDims || overCap) return;
    setResizing(true);
    setError(null);
    try {
      const fmt = FORMATS.find((f) => f.id === format)!;
      const img = await loadImage(imgUrl);
      const canvas = document.createElement("canvas");
      canvas.width = wNum;
      canvas.height = hNum;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser couldn't start the canvas engine.");
      ctx.imageSmoothingQuality = "high";
      if (format === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, wNum, hNum);
      }
      ctx.drawImage(img, 0, 0, wNum, hNum);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, fmt.mime, format === "png" ? undefined : quality)
      );
      if (!blob) throw new Error("Resize failed in this browser — try another format.");
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        name: `${base}-${wNum}x${hNum}.${fmt.ext}`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resize failed.");
    } finally {
      setResizing(false);
    }
  };

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
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
          border: "2.5px dashed var(--ink)",
          borderRadius: 12,
          background: dragOver ? "var(--paper2)" : "transparent",
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
              <span className="neu-label">Original</span>
              <img
                src={imgUrl}
                alt="Uploaded preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 240,
                  border: "2.5px solid var(--ink)",
                  borderRadius: 12,
                  display: "block",
                }}
              />
              <p className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}>
                {orig ? `${orig.w} × ${orig.h} px` : "…"} · {formatBytes(file.size)}
              </p>
            </div>

            <div>
              <span className="neu-label">New dimensions</span>
              <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 110px" }}>
                  <label className="neu-label" htmlFor="ir-w">
                    Width (px)
                  </label>
                  <input
                    id="ir-w"
                    type="number"
                    min={1}
                    max={MAX_SIDE}
                    className="neu-input neu-input-mono"
                    value={width}
                    onChange={(e) => setWidthKeepRatio(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
                <div style={{ paddingBottom: 14, fontWeight: 800 }} aria-hidden="true">
                  ×
                </div>
                <div style={{ flex: "1 1 110px" }}>
                  <label className="neu-label" htmlFor="ir-h">
                    Height (px)
                  </label>
                  <input
                    id="ir-h"
                    type="number"
                    min={1}
                    max={MAX_SIDE}
                    className="neu-input neu-input-mono"
                    value={height}
                    onChange={(e) => setHeightKeepRatio(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
                <button
                  type="button"
                  className={`neu-btn neu-btn-sm${locked ? " neu-btn-primary" : ""}`}
                  aria-pressed={locked}
                  onClick={() => setLocked((l) => !l)}
                  title="Lock aspect ratio"
                >
                  {locked ? "🔒 Lock on" : "🔓 Lock off"}
                </button>
              </div>

              <div style={{ marginTop: 14 }}>
                <span className="neu-label">Presets</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className="neu-btn neu-btn-sm"
                      onClick={() => applyPreset(p.w, p.h)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <span className="neu-label">Download format</span>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} role="group" aria-label="Output format">
                  {FORMATS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`neu-btn neu-btn-sm${format === f.id ? " neu-btn-primary" : ""}`}
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
                {format !== "png" && (
                  <div style={{ marginTop: 12 }}>
                    <label className="neu-label" htmlFor="ir-quality">
                      Quality — {Math.round(quality * 100)}%
                    </label>
                    <input
                      id="ir-quality"
                      type="range"
                      min={10}
                      max={100}
                      value={Math.round(quality * 100)}
                      onChange={(e) => {
                        setQuality(Number(e.target.value) / 100);
                        setResult(null);
                      }}
                      style={{ width: "100%", accentColor: "var(--red)" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
              <strong>Heads up:</strong> {error}
            </div>
          )}
          {validDims && overCap && (
            <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
              <strong>Too big.</strong> Each side is capped at {MAX_SIDE.toLocaleString()} px to keep
              the browser responsive — try something a little smaller.
            </div>
          )}
          {width !== "" && height !== "" && !validDims && (
            <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
              <strong>Check your numbers.</strong> Width and height must be positive whole numbers.
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18, alignItems: "center" }}>
            <button
              type="button"
              className="neu-btn neu-btn-primary"
              onClick={resize}
              disabled={resizing || !validDims || overCap}
            >
              {resizing ? "Resizing…" : "Resize & download"}
            </button>
            {result && (
              <a href={result.url} download={result.name} className="neu-btn">
                Download {result.name}
              </a>
            )}
          </div>

          {result && validDims && (
            <div className="notice notice-ok" style={{ marginTop: 16 }}>
              <strong>Resized to {wNum} × {hNum} px.</strong> Output file:{" "}
              <span className="font-mono2">{formatBytes(result.size)}</span>
              {orig && wNum > orig.w && (
                <>
                  {" "}— heads up, this is an upscale, so the image may look softer than the
                  original.
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
