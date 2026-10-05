"use client";

import { useEffect, useRef, useState } from "react";

type OutFormat = "png" | "jpeg";

const FORMATS: { id: OutFormat; label: string; mime: string; ext: string }[] = [
  { id: "png", label: "PNG", mime: "image/png", ext: "png" },
  { id: "jpeg", label: "JPG", mime: "image/jpeg", ext: "jpg" },
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

export default function InvertImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [orig, setOrig] = useState<{ w: number; h: number } | null>(null);
  const [format, setFormat] = useState<OutFormat>("png");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    url: string;
    size: number;
    name: string;
  } | null>(null);
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
      .then((img) => setOrig({ w: img.naturalWidth, h: img.naturalHeight }))
      .catch(() => setError("That file couldn't be read as an image."));
  };

  const invert = async () => {
    if (!file || !imgUrl || !orig) return;
    setWorking(true);
    setError(null);
    try {
      const fmt = FORMATS.find((f) => f.id === format)!;
      const img = await loadImage(imgUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser couldn't start the canvas engine.");
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        px[i] = 255 - px[i];
        px[i + 1] = 255 - px[i + 1];
        px[i + 2] = 255 - px[i + 2];
      }
      ctx.putImageData(data, 0, 0);
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
      if (!blob) throw new Error("Inversion failed in this browser — try another format.");
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        name: `${base}-inverted.${fmt.ext}`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Inversion failed.");
    } finally {
      setWorking(false);
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
              <span className="field-label">After — inverted</span>
              {result ? (
                <img
                  src={result.url}
                  alt="Inverted preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 240,
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    display: "block",
                    background: "var(--surface)",
                  }}
                />
              ) : (
                <div
                  className="result-box"
                  style={{
                    minHeight: 160,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    Press <strong>Invert colors</strong> and the photo-negative preview appears here.
                  </p>
                </div>
              )}
              {result && (
                <p
                  className="font-mono2"
                  style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}
                >
                  Inverted · {formatBytes(result.size)}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
              <strong>Heads up:</strong> {error}
            </div>
          )}

          <div style={{ marginTop: 18 }}>
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
                  onClick={() => {
                    setFormat(f.id);
                    setResult(null);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 18,
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={invert}
              disabled={working || !orig}
            >
              {working ? "Inverting…" : "Invert colors"}
            </button>
            {result && (
              <a href={result.url} download={result.name} className="btn">
                Download {result.name}
              </a>
            )}
          </div>

          {result && (
            <div className="notice notice-ok" style={{ marginTop: 16 }}>
              <strong>Done.</strong> Every pixel was flipped to its opposite color —{" "}
              <span className="font-mono2">{formatBytes(result.size)}</span>. Download it above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
