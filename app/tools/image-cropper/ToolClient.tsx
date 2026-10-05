"use client";

import { useEffect, useRef, useState } from "react";

type OutFormat = "png" | "jpeg";
type AspectId = "free" | "1:1" | "4:3" | "16:9";

const ASPECTS: { id: AspectId; label: string; ratio: number | null }[] = [
  { id: "free", label: "Free", ratio: null },
  { id: "1:1", label: "1 : 1", ratio: 1 },
  { id: "4:3", label: "4 : 3", ratio: 4 / 3 },
  { id: "16:9", label: "16 : 9", ratio: 16 / 9 },
];

const FORMATS: { id: OutFormat; label: string; mime: string; ext: string }[] = [
  { id: "png", label: "PNG", mime: "image/png", ext: "png" },
  { id: "jpeg", label: "JPG", mime: "image/jpeg", ext: "jpg" },
];

const MAX_DISPLAY_W = 680;

type Sel = { x: number; y: number; w: number; h: number }; // image-pixel coords

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

function clampSel(s: Sel, w: number, h: number): Sel {
  const x = Math.min(Math.max(0, s.x), w - 1);
  const y = Math.min(Math.max(0, s.y), h - 1);
  const sw = Math.min(Math.max(1, s.w), w - x);
  const sh = Math.min(Math.max(1, s.h), h - y);
  return { x: Math.round(x), y: Math.round(y), w: Math.round(sw), h: Math.round(sh) };
}

export default function ImageCropperClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [orig, setOrig] = useState<{ w: number; h: number } | null>(null);
  const [aspect, setAspect] = useState<AspectId>("free");
  const [sel, setSel] = useState<Sel | null>(null);
  const [format, setFormat] = useState<OutFormat>("png");
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [imgUrl]);

  const scale = orig ? Math.min(1, MAX_DISPLAY_W / orig.w) : 1;

  const toImageCoords = (clientX: number, clientY: number): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * orig!.w,
      y: ((clientY - rect.top) / rect.height) * orig!.h,
    };
  };

  // Draw the editor canvas: image + dimmed overlay + selection box.
  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !orig) return;
    const dw = Math.round(orig.w * scale);
    const dh = Math.round(orig.h * scale);
    canvas.width = dw;
    canvas.height = dh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, dw, dh);
    if (sel) {
      const sx = sel.x * scale;
      const sy = sel.y * scale;
      const sw = sel.w * scale;
      const sh = sel.h * scale;
      ctx.fillStyle = "rgba(20, 18, 16, 0.55)";
      ctx.fillRect(0, 0, dw, dh);
      ctx.clearRect(sx, sy, sw, sh);
      ctx.drawImage(img, sx, sy, sw, sh, sx, sy, sw, sh);
      ctx.strokeStyle = "#e0263c";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(sx, sy, sw, sh);
      // Corner handles.
      const hs = 10;
      ctx.fillStyle = "#e0263c";
      ctx.strokeStyle = "#141210";
      ctx.lineWidth = 2;
      for (const [hx, hy] of [
        [sx, sy],
        [sx + sw, sy],
        [sx, sy + sh],
        [sx + sw, sy + sh],
      ]) {
        ctx.beginPath();
        ctx.rect(hx - hs / 2, hy - hs / 2, hs, hs);
        ctx.fill();
        ctx.stroke();
      }
    }
  }, [imgUrl, orig, sel, scale]);

  // Live crop preview at natural resolution.
  useEffect(() => {
    const img = imgRef.current;
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!img || !sel || !orig) return;
    const maxW = 300;
    const s = Math.min(1, maxW / sel.w);
    const pw = Math.max(1, Math.round(sel.w * s));
    const ph = Math.max(1, Math.round(sel.h * s));
    canvas.width = pw;
    canvas.height = ph;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sel.x, sel.y, sel.w, sel.h, 0, 0, pw, ph);
  }, [sel, imgUrl, orig]);

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
    setSel(null);
    dragStart.current = null;
    loadImage(url)
      .then((img) => {
        imgRef.current = img;
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setOrig({ w, h });
        setSel({ x: 0, y: 0, w, h });
      })
      .catch(() => setError("That file couldn't be read as an image."));
  };

  const ratioFor = (id: AspectId): number | null =>
    ASPECTS.find((a) => a.id === id)?.ratio ?? null;

  const changeAspect = (id: AspectId) => {
    setAspect(id);
    if (!orig) return;
    setSel((prev) => {
      const r = ratioFor(id);
      if (!r || !prev) return prev ? { ...prev } : prev;
      // Keep the center, shrink to fit the new ratio.
      const cx = prev.x + prev.w / 2;
      const cy = prev.y + prev.h / 2;
      const w = Math.min(prev.w, prev.h * r);
      const h = w / r;
      return clampSel({ x: cx - w / 2, y: cy - h / 2, w, h }, orig.w, orig.h);
    });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!orig) return;
    e.preventDefault();
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const p = toImageCoords(e.clientX, e.clientY);
    dragStart.current = { x: p.x, y: p.y };
    setSel(clampSel({ x: p.x, y: p.y, w: 1, h: 1 }, orig.w, orig.h));
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const start = dragStart.current;
    if (!start || !orig) return;
    const p = toImageCoords(e.clientX, e.clientY);
    const r = ratioFor(aspect);
    let x1 = Math.min(start.x, p.x);
    let y1 = Math.min(start.y, p.y);
    let w = Math.abs(p.x - start.x);
    let h = Math.abs(p.y - start.y);
    if (r) {
      // Lock ratio: drive from width, follow drag direction.
      w = Math.abs(p.x - start.x);
      h = w / r;
      x1 = p.x >= start.x ? start.x : start.x - w;
      y1 = p.y >= start.y ? start.y : start.y - h;
    }
    if (w < 1) w = 1;
    if (h < 1) h = 1;
    setSel(clampSel({ x: x1, y: y1, w, h }, orig.w, orig.h));
  };

  const endDrag = () => {
    dragStart.current = null;
  };

  const download = async () => {
    const img = imgRef.current;
    if (!img || !sel || !file || !orig) return;
    setDownloading(true);
    setError(null);
    try {
      const fmt = FORMATS.find((f) => f.id === format)!;
      const out = document.createElement("canvas");
      out.width = sel.w;
      out.height = sel.h;
      const ctx = out.getContext("2d");
      if (!ctx) throw new Error("Your browser couldn't start the canvas engine.");
      if (format === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, out.width, out.height);
      }
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sel.x, sel.y, sel.w, sel.h, 0, 0, sel.w, sel.h);
      const blob = await new Promise<Blob | null>((resolve) =>
        out.toBlob(resolve, fmt.mime, 0.92)
      );
      if (!blob) throw new Error("Crop failed in this browser — try another format.");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      a.download = `${base}-cropped.${fmt.ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Crop failed.");
    } finally {
      setDownloading(false);
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

      {file && imgUrl && orig && (
        <div style={{ marginTop: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              alignItems: "start",
            }}
          >
            <div>
              <span className="neu-label">Drag to select the crop area</span>
              <canvas
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                style={{
                  maxWidth: "100%",
                  border: "2.5px solid var(--ink)",
                  borderRadius: 12,
                  display: "block",
                  touchAction: "none",
                  cursor: "crosshair",
                  background: "var(--surface)",
                }}
              />
              <p
                className="font-mono2"
                style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}
              >
                {orig.w} × {orig.h} px · {formatBytes(file.size)}
                {sel && ` · crop ${sel.w} × ${sel.h} px`}
              </p>
            </div>
            <div>
              <span className="neu-label">Live preview</span>
              <div
                className="result-box"
                style={{
                  minHeight: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                }}
              >
                <canvas
                  ref={previewRef}
                  aria-label="Crop preview"
                  style={{
                    maxWidth: "100%",
                    border: "2.5px solid var(--ink)",
                    borderRadius: 10,
                    display: sel ? "block" : "none",
                    background: "var(--surface)",
                  }}
                />
                {!sel && (
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem", textAlign: "center" }}>
                    Drag on the image to pick what to keep.
                  </p>
                )}
              </div>

              <div style={{ marginTop: 16 }}>
                <span className="neu-label">Aspect ratio</span>
                <div
                  style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                  role="group"
                  aria-label="Aspect ratio"
                >
                  {ASPECTS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className={`neu-btn neu-btn-sm${aspect === a.id ? " neu-btn-primary" : ""}`}
                      aria-pressed={aspect === a.id}
                      onClick={() => changeAspect(a.id)}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <span className="neu-label">Download format</span>
                <div
                  style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                  role="group"
                  aria-label="Output format"
                >
                  {FORMATS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`neu-btn neu-btn-sm${format === f.id ? " neu-btn-primary" : ""}`}
                      aria-pressed={format === f.id}
                      onClick={() => setFormat(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}
              >
                <button
                  type="button"
                  className="neu-btn neu-btn-primary"
                  onClick={download}
                  disabled={downloading || !sel}
                >
                  {downloading ? "Cropping…" : "Crop & download"}
                </button>
                <button
                  type="button"
                  className="neu-btn neu-btn-sm"
                  onClick={() =>
                    orig && setSel({ x: 0, y: 0, w: orig.w, h: orig.h })
                  }
                  disabled={!orig}
                >
                  Reset selection
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
              <strong>Heads up:</strong> {error}
            </div>
          )}

          <div className="notice notice-ok" style={{ marginTop: 16 }}>
            <strong>Full-resolution crop.</strong> The download is cut from the original pixels —
            nothing is shrunk or re-compressed beyond your chosen format. Works with mouse and
            touch.
          </div>
        </div>
      )}
    </div>
  );
}
