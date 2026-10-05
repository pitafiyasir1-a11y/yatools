"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatBytes,
  decodeHeic,
  encodeDrawable,
  validateImageFile,
  outputName,
  type DecodedImage,
} from "../_imgconv/convert";

const MAX_BYTES = 100 * 1024 * 1024;
const HEIC_VARIANT_MESSAGE =
  "This HEIC variant isn't supported in-browser — try exporting from your phone's Photos app.";

export default function HeicToPngClient() {
  const [file, setFile] = useState<File | null>(null);
  const [decoded, setDecoded] = useState<DecodedImage | null>(null);
  const [decoding, setDecoding] = useState(false);
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

  const pickFile = async (f: File | null) => {
    setError(null);
    setResult(null);
    if (!f) return;
    const bad = validateImageFile(f, [".heic", ".heif"], ["image/heic", "image/heif"], "a HEIC photo");
    if (bad) {
      setError(bad);
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(
        `That file is ${formatBytes(f.size)} — over the 100 MB browser limit. Try a smaller file.`
      );
      return;
    }
    reset();
    setFile(f);
    setDecoding(true);
    try {
      const d = await decodeHeic(f);
      setDecoded(d);
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (code === "heic-unsupported" || code === "heic-engine-missing") {
        setError(HEIC_VARIANT_MESSAGE);
      } else {
        setError(
          "That file couldn't be read as a HEIC image — it may be corrupted or a different format wearing a .heic name."
        );
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
      const blob = await encodeDrawable({ decoded, mime: "image/png" });
      if (result) URL.revokeObjectURL(result.url);
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        name: outputName(file.name, "png"),
        w: decoded.width,
        h: decoded.height,
      });
    } catch {
      setError("Conversion failed in this browser — the file may be corrupted.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a HEIC photo"
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
          accept=".heic,.heif"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            pickFile(e.target.files?.[0] || null);
            e.target.value = "";
          }}
        />
        <div className="font-display" style={{ fontSize: "1.5rem", marginBottom: 6 }}>
          {file ? "Swap file" : "Drop a HEIC photo here"}
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          or click to browse — .heic and .heif files. Files never leave your browser.
        </p>
      </div>

      {decoding && (
        <p className="font-mono2" style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 14 }}>
          Reading your HEIC file…
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
                alt="Uploaded HEIC preview"
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
              <span className="field-label">Output — PNG</span>
              <p style={{ fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.6 }}>
                PNG is lossless — every pixel is kept exactly, so there&apos;s no quality
                setting to tune. Transparency is preserved too.
              </p>
              <div className="notice" style={{ marginTop: 12 }}>
                <strong>Honest size note:</strong> HEIC is one of the most efficient formats
                ever made. The PNG will be <em>bigger</em> — often 3–5× — because PNG stores
                every pixel losslessly. That&apos;s the price of universal compatibility.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18, alignItems: "center" }}>
            <button type="button" className="btn btn-primary" onClick={convert} disabled={converting}>
              {converting ? "Converting…" : result ? "Convert again" : "Convert to PNG"}
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
                {result.w} × {result.h} px · {formatBytes(file.size)} HEIC → {formatBytes(result.size)} PNG
              </span>
              <div style={{ marginTop: 10 }}>
                <img
                  src={result.url}
                  alt="Converted PNG preview"
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
