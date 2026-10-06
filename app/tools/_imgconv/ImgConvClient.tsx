"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatBytes,
  decodeStandard,
  decodeAvif,
  decodeHeic,
  decodeSvg,
  encodeDrawable,
  validateImageFile,
  outputName,
  type DecodedImage,
  type SvgDecoded,
} from "./convert";

export type TargetMime = "image/jpeg" | "image/png" | "image/webp";

export interface ImgConvConfig {
  /** Which decoder to use for the source file. */
  sourceKind: "standard" | "heic" | "avif" | "svg";
  sourceExts: string[];
  sourceTypes: string[];
  /** e.g. "a HEIC photo". Used in validation errors. */
  sourceLabel: string;
  targetMime: TargetMime;
  targetExt: string;
  targetLabel: string;
  /** If set, a quality slider is shown (lossy targets). */
  qualityDefault?: number;
  /** If set, a background-color picker is shown (for alpha → JPEG). */
  backgroundDefault?: string;
  /** If set, an output-size selector is shown (SVG rasterization). */
  sizeOptions?: { label: string; width: number }[];
  /** Shown when the file can't be decoded (heic gets its own honest message). */
  decodeFailedMessage: string;
  /** e.g. "Convert to PNG". */
  convertLabel: string;
  /** Short line under the dropzone, e.g. accepted variants. */
  acceptLine: string;
}

const MAX_BYTES = 100 * 1024 * 1024;

export default function ImgConvClient({ config }: { config: ImgConvConfig }) {
  const [file, setFile] = useState<File | null>(null);
  const [decoded, setDecoded] = useState<DecodedImage | null>(null);
  const [decoding, setDecoding] = useState(false);
  const [quality, setQuality] = useState(config.qualityDefault ?? 0.9);
  const [background, setBackground] = useState(config.backgroundDefault ?? "#ffffff");
  const [outWidth, setOutWidth] = useState(config.sizeOptions?.[1]?.width ?? 1024);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number; name: string; w: number; h: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const decodedRef = useRef<DecodedImage | null>(null);
  decodedRef.current = decoded;
  const resultRef = useRef<{ url: string } | null>(null);
  resultRef.current = result;

  useEffect(() => {
    return () => {
      decodedRef.current?.revoke();
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    };
  }, []);

  const reset = () => {
    decodedRef.current?.revoke();
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setDecoded(null);
    setResult(null);
    setError(null);
  };

  /** Drop the current result, releasing its object URL (prevents blob-URL leaks). */
  const clearResult = () => {
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    setResult(null);
  };

  const pickFile = async (f: File | null) => {
    setError(null);
    clearResult();
    if (!f) return;
    const bad = validateImageFile(f, config.sourceExts, config.sourceTypes, config.sourceLabel);
    if (bad) {
      setError(bad);
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(
        `That file is ${formatBytes(f.size)} — over the 100 MB browser limit. Try a smaller file or compress it first.`
      );
      return;
    }
    reset();
    setFile(f);
    setDecoding(true);
    try {
      let d: DecodedImage;
      if (config.sourceKind === "heic") d = await decodeHeic(f);
      else if (config.sourceKind === "avif") d = await decodeAvif(f);
      else if (config.sourceKind === "svg") d = await decodeSvg(f);
      else d = await decodeStandard(f);
      setDecoded(d);
      if (config.sizeOptions) {
        const svg = d as SvgDecoded;
        const natural = Math.round(svg.intrinsic?.width ?? d.width);
        const closest = config.sizeOptions.reduce((a, b) =>
          Math.abs(b.width - natural) < Math.abs(a.width - natural) ? b : a
        );
        setOutWidth(closest.width);
      }
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (code === "heic-unsupported" || code === "heic-engine-missing") {
        setError(
          "This HEIC variant isn't supported in-browser — try exporting it as JPG from your phone's Photos app, then convert that."
        );
      } else {
        setError(config.decodeFailedMessage);
      }
      setFile(null);
    } finally {
      setDecoding(false);
    }
  };

  const convert = async () => {
    if (!file || !decoded || converting) return;
    setConverting(true);
    setError(null);
    try {
      const blob = await encodeDrawable({
        decoded,
        mime: config.targetMime,
        quality: config.qualityDefault !== undefined ? quality : undefined,
        background: config.backgroundDefault !== undefined ? background : undefined,
        outWidth: config.sizeOptions ? outWidth : undefined,
      });
      if (result) URL.revokeObjectURL(result.url);
      const w = config.sizeOptions ? outWidth : decoded.width;
      const h = config.sizeOptions
        ? Math.round((decoded.height * outWidth) / decoded.width)
        : decoded.height;
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        name: outputName(file.name, config.targetExt),
        w,
        h,
      });
    } catch (e) {
      setError(e instanceof Error && e.message === "canvas-unavailable"
        ? "Your browser couldn't start the canvas engine — try a Chromium-based browser."
        : "Conversion failed in this browser — the file may be corrupted.");
    } finally {
      setConverting(false);
    }
  };

  const savings =
    file && result && result.size < file.size
      ? Math.round((1 - result.size / file.size) * 100)
      : null;

  const showQuality = config.qualityDefault !== undefined;
  const showBg = config.backgroundDefault !== undefined;

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${config.sourceLabel}`}
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
          accept={config.sourceExts.join(",")}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            pickFile(e.target.files?.[0] || null);
            e.target.value = "";
          }}
        />
        <div className="font-display" style={{ fontSize: "1.5rem", marginBottom: 6 }}>
          {file ? "Swap file" : `Drop ${config.sourceLabel} here`}
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          or click to browse — {config.acceptLine}. Files never leave your browser.
        </p>
      </div>

      {decoding && (
        <p className="font-mono2" style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 14 }}>
          Reading your file…
        </p>
      )}

      {error && (
        <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
          <strong>Heads up:</strong> {error}
        </div>
      )}

      {file && decoded && !decoding && (
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
                src={decoded.previewUrl}
                alt="Uploaded preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 240,
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  display: "block",
                  background: "#fff",
                }}
              />
              <p className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}>
                {file.name.length > 34 ? `${file.name.slice(0, 31)}…` : file.name}
                <br />
                {decoded.width} × {decoded.height} px · {formatBytes(file.size)}
              </p>
            </div>

            <div>
              <span className="field-label">Output — {config.targetLabel}</span>

              {showQuality && (
                <div style={{ marginBottom: 16 }}>
                  <label className="field-label" htmlFor="conv-quality">
                    Quality — {Math.round(quality * 100)}%
                  </label>
                  <input
                    id="conv-quality"
                    type="range"
                    min={10}
                    max={100}
                    value={Math.round(quality * 100)}
                    onChange={(e) => {
                      setQuality(Number(e.target.value) / 100);
                      clearResult();
                    }}
                    style={{ width: "100%", accentColor: "var(--red)" }}
                  />
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
                    Higher quality keeps more detail but makes a bigger file. Around 85–92% is the
                    sweet spot for photos.
                  </p>
                </div>
              )}

              {showBg && (
                <div style={{ marginBottom: 16 }}>
                  <label className="field-label" htmlFor="conv-bg">
                    Background for transparent areas
                  </label>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input
                      id="conv-bg"
                      type="color"
                      value={background}
                      onChange={(e) => {
                        setBackground(e.target.value);
                        clearResult();
                      }}
                      style={{
                        width: 44,
                        height: 36,
                        padding: 2,
                        border: "1px solid var(--line)",
                        borderRadius: 8,
                        background: "var(--surface)",
                        cursor: "pointer",
                      }}
                    />
                    <span className="font-mono2" style={{ fontSize: "0.78rem", color: "var(--text2)" }}>
                      {background.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
                    {config.targetLabel} has no transparency, so see-through pixels are filled with
                    this color (white by default).
                  </p>
                </div>
              )}

              {config.sizeOptions && (
                <div style={{ marginBottom: 16 }}>
                  <span className="field-label">Output size</span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} role="group" aria-label="Output size">
                    {config.sizeOptions.map((s) => (
                      <button
                        key={s.width}
                        type="button"
                        className={`btn btn-sm${outWidth === s.width ? " btn-primary" : ""}`}
                        aria-pressed={outWidth === s.width}
                        onClick={() => {
                          setOutWidth(s.width);
                          clearResult();
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
                    Vectors scale perfectly — output will be{" "}
                    <span className="font-mono2">
                      {outWidth} × {Math.round((decoded.height * outWidth) / decoded.width)} px
                    </span>
                    .
                  </p>
                </div>
              )}

              {!showQuality && !showBg && !config.sizeOptions && (
                <p style={{ fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.6 }}>
                  {config.targetLabel} is lossless — every pixel is kept exactly, so there's no
                  quality setting to tune.
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18, alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={convert}
              disabled={converting}
            >
              {converting ? "Converting…" : result ? "Convert again" : config.convertLabel}
            </button>
            {result && (
              <a href={result.url} download={result.name} className="btn">
                Download {result.name}
              </a>
            )}
            <button type="button" className="btn btn-sm" onClick={reset}>
              Start over
            </button>
          </div>

          {result && (
            <div className="notice notice-ok" style={{ marginTop: 16 }}>
              <strong>Converted.</strong>{" "}
              <span className="font-mono2">
                {result.w} × {result.h} px · {formatBytes(result.size)}
              </span>
              {savings !== null && (
                <>
                  {" "}— <strong>{savings}% smaller</strong> than the original{" "}
                  <span className="font-mono2">{formatBytes(file.size)}</span>.
                </>
              )}
              {savings === null && result.size > file.size && (
                <> — larger than the original; lossless targets can't always shrink a file.</>
              )}
              {savings === null && result.size === file.size && (
                <> — exactly the same size as the original.</>
              )}
              <div style={{ marginTop: 10 }}>
                <img
                  src={result.url}
                  alt="Converted preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    display: "block",
                    background: "#fff",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
