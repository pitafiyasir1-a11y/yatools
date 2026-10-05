"use client";

import { useEffect, useRef, useState } from "react";
import { DropZone, HonestLabel, PrintStyles } from "../doc-convert-parts";

const PRINT_ROOT = "word-to-pdf-print-root";

export default function WordToPdfClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [baseName, setBaseName] = useState("");
  const [rendered, setRendered] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);

  // Clean up the rendered document on unmount or reset.
  const clearDoc = () => {
    if (docRef.current) docRef.current.innerHTML = "";
    setRendered(false);
    setBaseName("");
  };

  const reset = () => {
    clearDoc();
    setError(null);
    setLoading(false);
  };

  const renderFile = async (f: File) => {
    const isDocx =
      f.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      /\.docx$/i.test(f.name);
    if (!isDocx) {
      setError("That is not a .docx file — please choose a Word document (.docx).");
      return;
    }
    reset();
    setLoading(true);
    setError(null);
    try {
      const { renderAsync } = await import("docx-preview");
      setBaseName(f.name.replace(/\.docx$/i, ""));
      const blob = new Blob([await f.arrayBuffer()], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      if (docRef.current) docRef.current.innerHTML = "";
      await renderAsync(blob, docRef.current as HTMLElement, undefined, {
        inWrapper: true,
        useBase64URL: true,
        ignoreWidth: false,
        ignoreHeight: false,
      });
      setRendered(true);
    } catch {
      setError(
        "That file couldn't be rendered. It may be corrupted, password-protected, or use features this preview doesn't support."
      );
    } finally {
      setLoading(false);
    }
  };

  const print = () => window.print();

  // Safety: nothing to clean up for print; the CSS is scoped to print media.
  useEffect(() => () => clearDoc(), []);

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <PrintStyles rootId={PRINT_ROOT} />
      <HonestLabel>
        Converted with your browser's built-in print engine — click “Print / Save as PDF” and
        choose <strong>“Save as PDF”</strong> in the print dialog. Layout follows what the
        preview shows below; extremely complex Word layouts may render slightly differently.
      </HonestLabel>

      {!rendered && (
        <DropZone
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          label={loading ? "Rendering your document…" : "Drop a .docx file here, or click to choose one"}
          hint="Word .docx files only. Runs 100% in your browser — your file is never uploaded."
          onFile={renderFile}
          disabled={loading}
        />
      )}

      {loading && !rendered && (
        <p style={{ fontWeight: 700, fontSize: "0.9rem", marginTop: 12 }}>
          Rendering your document… one moment.
        </p>
      )}

      {/* Rendered document — the ONLY thing visible in print media. */}
      <div
        id={PRINT_ROOT}
        style={{ marginTop: rendered ? 8 : 0 }}
      >
        <div
          ref={docRef}
          style={
            rendered
              ? {
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  overflow: "auto",
                  maxHeight: 560,
                  background: "#f4f4f4",
                }
              : undefined
          }
        />
      </div>

      {rendered && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          <button type="button" className="btn btn-primary" onClick={print}>
            Print / Save as PDF
          </button>
          <button type="button" className="btn" onClick={reset}>
            Convert another document
          </button>
        </div>
      )}

      {error && <div className="notice" style={{ marginTop: 14 }}>{error}</div>}
    </div>
  );
}
