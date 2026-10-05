"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CANVAS_MIMES = ["image/jpeg", "image/png", "image/webp"] as const;

const FORMAT_OPTIONS = [
  { value: "original", label: "Keep original" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
] as const;

type FormatChoice = (typeof FORMAT_OPTIONS)[number]["value"];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function extFor(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return "png";
}

export default function ImageCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<FormatChoice>("original");
  const [compressing, setCompressing] = useState(false);
  const [keptOriginal, setKeptOriginal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  // Ref mirror of `file` so runCompression can compare byte sizes
  // without re-creating the callback on every file change.
  const fileRef = useRef<File | null>(null);

  // Resolve what we'll actually encode to. Canvas can only emit
  // PNG/JPEG/WebP, so exotic inputs (GIF, AVIF…) fall back to PNG.
  const resolvedMime = useCallback((): string => {
    if (format !== "original") return format;
    return CANVAS_MIMES.includes(file?.type as (typeof CANVAS_MIMES)[number])
      ? (file!.type as string)
      : "image/png";
  }, [format, file]);

  const runCompression = useCallback(async () => {
    const img = imgRef.current;
    const src = fileRef.current;
    if (!img || !src) return;
    setCompressing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no 2d context");
      ctx.drawImage(img, 0, 0);
      const mime = resolvedMime();
      // PNG is lossless: canvas offers no quality knob for it. The slider
      // only affects JPEG and WebP; PNG always encodes at full quality.
      const q = mime === "image/png" ? undefined : quality / 100;
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob((b) => res(b), mime, q));
      if (!blob) throw new Error("encode failed");
      // Universal guard: re-encoding can GROW some files (e.g. an already
      // optimized PNG re-encoded without quantization). Never deliver a
      // bigger file — keep the original and say so honestly.
      const kept = blob.size >= src.size;
      const finalBlob = kept ? src : blob;
      setKeptOriginal(kept);
      setCompressedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(finalBlob);
      });
      setCompressedSize(finalBlob.size);
    } catch {
      setError("Couldn't compress that image — try a different file.");
    } finally {
      setCompressing(false);
    }
  }, [quality, resolvedMime]);

  // Re-compress whenever quality or format changes (image already loaded).
  useEffect(() => {
    if (imgRef.current) void runCompression();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality, format]);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("That doesn't look like an image — please choose an image file.");
      return;
    }
    setError(null);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setOriginalUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setFile(f);
      fileRef.current = f;
      setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Couldn't read that image — it may be corrupted or in an unsupported format.");
    };
    img.src = url;
  };

  // Compress right after the image first loads.
  useEffect(() => {
    if (imgRef.current && file) void runCompression();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const outMime = resolvedMime();
  const qualityApplies = outMime !== "image/png";
  const origExt = (file?.name.split(".").pop() || "").toLowerCase();
  const downloadName = file
    ? `${file.name.replace(/\.[^.]+$/, "") || "image"}${keptOriginal ? "" : "-compressed"}.${keptOriginal && origExt ? origExt : extFor(outMime)}`
    : "compressed.jpg";

  const savedPct =
    file && compressedSize !== null
      ? ((file.size - compressedSize) / file.size) * 100
      : null;

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()}>
          {file ? "Choose a different image" : "Choose image"}
        </button>
      </div>

      {!file && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className="card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            borderStyle: "dashed",
            color: "var(--muted)",
          }}
        >
          <div className="font-display" style={{ fontSize: "1.6rem", marginBottom: 8, color: "var(--text2)" }}>
            Drop in an image
          </div>
          <p style={{ fontSize: "0.92rem" }}>
            JPG, PNG, WebP, GIF — compression happens in your browser, nothing is uploaded.
          </p>
        </div>
      )}

      {file && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div>
              <label className="field-label" htmlFor="ic-quality">
                Quality · {quality}%
                {!qualityApplies && (
                  <span style={{ color: "var(--muted)", fontWeight: 400 }}>
                    {" "}(N/A for PNG)
                  </span>
                )}
              </label>
              <input
                id="ic-quality"
                type="range"
                min={10}
                max={100}
                value={quality}
                disabled={!qualityApplies}
                onChange={(e) => setQuality(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--red)", height: 28 }}
              />
              {!qualityApplies && (
                <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
                  PNG is lossless, so the quality slider doesn't apply — PNG output is always full
                  quality. Switch to JPEG or WebP to use the slider.
                </p>
              )}
            </div>
            <div>
              <label className="field-label" htmlFor="ic-format">
                Output format
              </label>
              <select
                id="ic-format"
                className="select"
                value={format}
                onChange={(e) => setFormat(e.target.value as FormatChoice)}
              >
                {FORMAT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {outMime === "image/jpeg" && (
                <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
                  JPEG has no transparency — see-through areas become black.
                </p>
              )}
              {file.type === "image/gif" && (
                <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
                  Animated GIFs compress to a still PNG frame — animation is not preserved.
                </p>
              )}
            </div>
          </div>

          {originalUrl && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              <div>
                <p className="field-label">Original</p>
                <div
                  className="card"
                  style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}
                >
                  <img
                    src={originalUrl}
                    alt="Original uploaded image"
                    style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8, objectFit: "contain" }}
                  />
                </div>
                <p className="font-mono2" style={{ fontSize: "0.74rem", color: "var(--text2)", marginTop: 8 }}>
                  {formatSize(file.size)}
                  {dimensions && ` · ${dimensions.w} × ${dimensions.h} px`}
                </p>
              </div>
              <div>
                <p className="field-label">Compressed</p>
                <div
                  className="card"
                  style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}
                >
                  {compressedUrl ? (
                    <img
                      src={compressedUrl}
                      alt="Compressed image preview"
                      style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8, objectFit: "contain" }}
                    />
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                      {compressing ? "Compressing…" : "Loading…"}
                    </span>
                  )}
                </div>
                <p className="font-mono2" style={{ fontSize: "0.74rem", color: "var(--text2)", marginTop: 8 }} aria-live="polite">
                  {compressedSize !== null ? formatSize(compressedSize) : "—"}
                  {savedPct !== null && compressedSize !== null && (
                    <>
                      {" · "}
                      <span style={{ color: savedPct >= 0 ? "var(--green)" : "var(--red)" }}>
                        {keptOriginal
                          ? "Already optimized"
                          : savedPct >= 0
                            ? `${savedPct.toFixed(1)}% smaller`
                            : `${Math.abs(savedPct).toFixed(1)}% larger`}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {keptOriginal && file && (
            <div className="notice" style={{ marginTop: 16 }}>
              <strong>Already well-optimized.</strong> Compressing this file would have
              made it bigger, so we kept your original ({formatSize(file.size)}).
              Try JPEG or WebP output for extra savings.
            </div>
          )}

          {compressedUrl && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16, alignItems: "center" }}>
              <a href={compressedUrl} download={downloadName} className="btn btn-primary btn-sm">
                Download
              </a>
              <span className="font-mono2" style={{ fontSize: "0.74rem", color: "var(--text2)" }}>
                Saved as {downloadName}
              </span>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="notice" style={{ marginTop: 16 }}>
          {error}
        </div>
      )}
    </div>
  );
}
