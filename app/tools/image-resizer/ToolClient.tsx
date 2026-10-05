"use client";

import { useEffect, useRef, useState } from "react";

type Format = "png" | "jpeg" | "webp";

const FORMATS: { id: Format; label: string; mime: string; ext: string }[] = [
  { id: "png", label: "PNG", mime: "image/png", ext: "png" },
  { id: "jpeg", label: "JPG", mime: "image/jpeg", ext: "jpg" },
  { id: "webp", label: "WebP", mime: "image/webp", ext: "webp" },
];

const PRESET_GROUPS: { name: string; presets: { label: string; w: number; h: number }[] }[] = [
  {
    name: "Screen",
    presets: [
      { label: "HD · 1280 × 720", w: 1280, h: 720 },
      { label: "Full HD · 1920 × 1080", w: 1920, h: 1080 },
      { label: "4K · 3840 × 2160", w: 3840, h: 2160 },
    ],
  },
  {
    name: "Social",
    presets: [
      { label: "IG post · 1080 × 1080", w: 1080, h: 1080 },
      { label: "IG story · 1080 × 1920", w: 1080, h: 1920 },
      { label: "Link preview · 1200 × 630", w: 1200, h: 630 },
    ],
  },
  {
    name: "Web",
    presets: [
      { label: "Blog · 800 × 600", w: 800, h: 600 },
      { label: "Avatar · 512 × 512", w: 512, h: 512 },
    ],
  },
];

const MAX_SIDE = 8000;
const PREVIEW_DEBOUNCE_MS = 350;

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

function renderToBlob(
  img: HTMLImageElement,
  w: number,
  h: number,
  format: Format,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("Your browser couldn't start the canvas engine."));
    ctx.imageSmoothingQuality = "high";
    const fmt = FORMATS.find((f) => f.id === format)!;
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Resize failed in this browser — try another format."))),
      fmt.mime,
      format === "png" ? undefined : quality
    );
  });
}

interface PreviewState {
  url: string;
  size: number;
  w: number;
  h: number;
}

export default function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [orig, setOrig] = useState<{ w: number; h: number } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [locked, setLocked] = useState(true);
  const [format, setFormat] = useState<Format>("png");
  const [quality, setQuality] = useState(0.85);
  const [rendering, setRendering] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const pickFile = (f: File | null) => {
    setError(null);
    setPreview(null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, WebP, GIF, BMP…).");
      return;
    }
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    const url = URL.createObjectURL(f);
    setFile(f);
    setImgUrl(url);
    setImgLoading(true);
    loadImage(url)
      .then((img) => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setOrig({ w, h });
        setWidth(String(w));
        setHeight(String(h));
      })
      .catch(() => setError("That file couldn't be read as an image."))
      .finally(() => setImgLoading(false));
  };

  const wNum = parseInt(width, 10);
  const hNum = parseInt(height, 10);
  const validDims = Number.isInteger(wNum) && Number.isInteger(hNum) && wNum > 0 && hNum > 0;
  const overCap = validDims && (wNum > MAX_SIDE || hNum > MAX_SIDE);
  const upscaling = validDims && orig !== null && (wNum > orig.w || hNum > orig.h);
  const scalePct = validDims && orig ? Math.round((wNum / orig.w) * 100) : null;

  /* ---- Live preview: debounced re-render whenever settings change ---- */
  useEffect(() => {
    if (!imgUrl || !validDims || overCap) {
      setPreview(null);
      setRendering(false);
      return;
    }
    setRendering(true);
    const timer = setTimeout(async () => {
      try {
        const img = await loadImage(imgUrl);
        const blob = await renderToBlob(img, wNum, hNum, format, quality);
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        const url = URL.createObjectURL(blob);
        previewUrlRef.current = url;
        setPreview({ url, size: blob.size, w: wNum, h: hNum });
      } catch {
        setPreview(null);
      } finally {
        setRendering(false);
      }
    }, PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgUrl, width, height, format, quality]);

  const setWidthKeepRatio = (val: string) => {
    setWidth(val);
    const w = parseInt(val, 10);
    if (locked && orig && Number.isInteger(w) && w > 0) {
      setHeight(String(Math.max(1, Math.round((w * orig.h) / orig.w))));
    }
  };

  const setHeightKeepRatio = (val: string) => {
    setHeight(val);
    const h = parseInt(val, 10);
    if (locked && orig && Number.isInteger(h) && h > 0) {
      setWidth(String(Math.max(1, Math.round((h * orig.w) / orig.h))));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setWidth(String(w));
    setHeight(String(h));
  };

  const download = async () => {
    if (!file || !imgUrl || !validDims || overCap) return;
    setDownloading(true);
    setError(null);
    try {
      const img = await loadImage(imgUrl);
      const blob = await renderToBlob(img, wNum, hNum, format, quality);
      const fmt = FORMATS.find((f) => f.id === format)!;
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${base}-${wNum}x${hNum}.${fmt.ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resize failed.");
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

      {imgLoading && (
        <div className="notice" style={{ marginTop: 16 }}>
          <strong>Loading image…</strong> reading dimensions.
        </div>
      )}

      {file && imgUrl && orig && (
        <div style={{ marginTop: 18 }}>
          {/* Live dimension readout */}
          <div
            className="font-mono2"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "baseline",
              fontSize: "clamp(1rem, 2.6vw, 1.35rem)",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 16,
            }}
            aria-live="polite"
          >
            <span>{orig.w} × {orig.h}</span>
            <span aria-hidden="true" style={{ color: "var(--red)" }}>→</span>
            <span style={{ color: validDims && !overCap ? "var(--text)" : "var(--muted)" }}>
              {validDims ? `${wNum} × ${hNum}` : "—"}
            </span>
            {scalePct !== null && (
              <span
                className="font-mono2"
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  color: "var(--red-dark)",
                  background: "var(--red-tint)",
                  border: "2px solid var(--red)",
                  borderRadius: 999,
                  padding: "2px 10px",
                }}
              >
                {scalePct}% scale
              </span>
            )}
          </div>

          {/* Side-by-side preview */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              marginBottom: 18,
            }}
          >
            <div>
              <span className="field-label">Original</span>
              <div
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  background: "var(--surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 200,
                  padding: 12,
                }}
              >
                <img
                  src={imgUrl}
                  alt="Original upload"
                  style={{ maxWidth: "100%", maxHeight: 260, display: "block", borderRadius: 6 }}
                />
              </div>
              <p className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}>
                {orig.w} × {orig.h} px · {formatBytes(file.size)}
              </p>
            </div>
            <div>
              <span className="field-label">
                Resized {rendering && <span style={{ color: "var(--red-dark)" }}>· rendering…</span>}
              </span>
              <div
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  background: "var(--surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 200,
                  padding: 12,
                }}
              >
                {preview ? (
                  <img
                    src={preview.url}
                    alt={`Resized preview at ${preview.w} by ${preview.h} pixels`}
                    style={{ maxWidth: "100%", maxHeight: 260, display: "block", borderRadius: 6 }}
                  />
                ) : (
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem", textAlign: "center", padding: 16 }}>
                    {rendering
                      ? "Rendering preview…"
                      : validDims
                        ? "Preview will appear here."
                        : "Enter valid dimensions to see the resized preview."}
                  </p>
                )}
              </div>
              <p className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }} aria-live="polite">
                {preview
                  ? `${preview.w} × ${preview.h} px · ≈ ${formatBytes(preview.size)} output`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div>
              <span className="field-label">New dimensions</span>
              <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 110px" }}>
                  <label className="field-label" htmlFor="ir-w">Width (px)</label>
                  <input
                    id="ir-w"
                    type="number"
                    min={1}
                    max={MAX_SIDE}
                    className="input input-mono"
                    value={width}
                    onChange={(e) => setWidthKeepRatio(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
                <div style={{ paddingBottom: 14, fontWeight: 800 }} aria-hidden="true">×</div>
                <div style={{ flex: "1 1 110px" }}>
                  <label className="field-label" htmlFor="ir-h">Height (px)</label>
                  <input
                    id="ir-h"
                    type="number"
                    min={1}
                    max={MAX_SIDE}
                    className="input input-mono"
                    value={height}
                    onChange={(e) => setHeightKeepRatio(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
                <button
                  type="button"
                  className={`btn btn-sm${locked ? " btn-primary" : ""}`}
                  aria-pressed={locked}
                  onClick={() => setLocked((l) => !l)}
                  title="Lock aspect ratio"
                >
                  {locked ? "🔒 Lock on" : "🔓 Lock off"}
                </button>
              </div>
            </div>

            <div>
              <span className="field-label">Download format</span>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} role="group" aria-label="Output format">
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
              {format !== "png" && (
                <div style={{ marginTop: 12 }}>
                  <label className="field-label" htmlFor="ir-quality">
                    Quality — {Math.round(quality * 100)}%
                  </label>
                  <input
                    id="ir-quality"
                    type="range"
                    min={10}
                    max={100}
                    value={Math.round(quality * 100)}
                    onChange={(e) => setQuality(Number(e.target.value) / 100)}
                    style={{ width: "100%", accentColor: "var(--red)" }}
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <span className="field-label">Presets</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PRESET_GROUPS.map((g) => (
                <div key={g.name} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span className="font-mono2" style={{ fontSize: "0.7rem", color: "var(--muted)", minWidth: 52, textTransform: "uppercase" }}>
                    {g.name}
                  </span>
                  {g.presets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className="btn btn-sm"
                      onClick={() => applyPreset(p.w, p.h)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              ))}
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
          {validDims && !overCap && upscaling && (
            <div className="notice" style={{ marginTop: 16 }}>
              <strong>Honest note:</strong> you're upscaling beyond the original {orig.w} × {orig.h}.
              Resizing up adds no new detail — the result may look softer than the original.
              Resizing down is always safe.
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18, alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={download}
              disabled={downloading || !validDims || overCap}
            >
              {downloading ? "Preparing…" : "Download resized image"}
            </button>
            {preview && (
              <span className="font-mono2" style={{ fontSize: "0.78rem", color: "var(--text2)" }}>
                Estimated output: {formatBytes(preview.size)} · {FORMATS.find((f) => f.id === format)!.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
