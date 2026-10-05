"use client";

import { useRef, useState } from "react";
import { DropZone, HonestLabel, downloadBlob } from "../doc-convert-parts";

type PageOut = { num: number; blob: Blob; url: string };

export default function WordToJpgClient() {
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [baseName, setBaseName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [quality, setQuality] = useState(0.9);
  const [images, setImages] = useState<PageOut[]>([]);
  const docRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  const reset = () => {
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setImages([]);
    setPageCount(0);
    setBaseName("");
    setProgress(0);
    setError(null);
    renderedRef.current = false;
    if (docRef.current) docRef.current.innerHTML = "";
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
      await renderAsync(blob, docRef.current as HTMLElement, undefined, {
        inWrapper: true,
        useBase64URL: true,
        ignoreWidth: false,
        ignoreHeight: false,
      });
      const pages = docRef.current?.querySelectorAll(".docx-wrapper > section.docx") ?? [];
      setPageCount(pages.length);
      renderedRef.current = true;
      if (pages.length === 0) {
        setError("The document rendered with no pages. Try a different .docx file.");
      }
    } catch {
      setError(
        "That file couldn't be rendered. It may be corrupted, password-protected, or use features this preview doesn't support."
      );
    } finally {
      setLoading(false);
    }
  };

  const convertAll = async () => {
    if (!renderedRef.current || !docRef.current) return;
    setConverting(true);
    setError(null);
    setProgress(0);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const sections = Array.from(
        docRef.current.querySelectorAll<HTMLElement>(".docx-wrapper > section.docx")
      );
      if (sections.length === 0) throw new Error("no pages");
      const out: PageOut[] = [];
      for (let i = 0; i < sections.length; i++) {
        const canvas = await html2canvas(sections[i], {
          backgroundColor: "#ffffff",
          scale: 2,
          logging: false,
        });
        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob(
            (b) => (b ? res(b) : rej(new Error("encode failed"))),
            "image/jpeg",
            quality
          )
        );
        out.push({ num: i + 1, blob, url: URL.createObjectURL(blob) });
        setProgress(Math.round(((i + 1) / sections.length) * 100));
      }
      setImages(out);
    } catch {
      setError(
        "Conversion failed in your browser. Try a smaller document or a Chromium-based browser."
      );
    } finally {
      setConverting(false);
    }
  };

  const downloadOne = (p: PageOut) =>
    downloadBlob(p.blob, `${baseName || "document"}-page-${p.num}.jpg`);

  const downloadAll = () => {
    images.forEach((p, i) => {
      setTimeout(() => downloadOne(p), i * 400);
    });
  };

  const busy = loading || converting;

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <HonestLabel>
        Each Word page becomes a JPG image rendered from the document preview — great for
        sharing or embedding, but the text in a JPG can't be edited or copied.
      </HonestLabel>

      {pageCount === 0 && (
        <DropZone
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          label={loading ? "Rendering your document…" : "Drop a .docx file here, or click to choose one"}
          hint="Word .docx files only. Runs 100% in your browser — your file is never uploaded."
          onFile={renderFile}
          disabled={busy}
        />
      )}

      {pageCount > 0 && (
        <>
          <div className="notice notice-ok" style={{ marginBottom: 16 }}>
            <strong>Document loaded:</strong> {pageCount} page
            {pageCount === 1 ? "" : "s"} ready to convert.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "end", marginBottom: 16 }}>
            <div>
              <label className="field-label" htmlFor="wtj-quality">
                JPG quality
              </label>
              <select
                id="wtj-quality"
                className="input"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={busy}
              >
                <option value={0.7}>Medium (smaller file)</option>
                <option value={0.9}>High (recommended)</option>
                <option value={0.98}>Maximum (larger file)</option>
              </select>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={convertAll}
              disabled={busy}
            >
              {converting ? `Converting… ${progress}%` : "Convert pages to JPG"}
            </button>
            {images.length > 0 && (
              <button type="button" className="btn" onClick={downloadAll}>
                Download all JPGs
              </button>
            )}
            <button type="button" className="btn" onClick={reset}>
              Start over
            </button>
          </div>

          {converting && (
            <div style={{ height: 8, borderRadius: 99, background: "var(--line)", overflow: "hidden", marginBottom: 16 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "var(--red)", transition: "width .2s" }} />
            </div>
          )}

          {images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 12,
              }}
            >
              {images.map((p) => (
                <div key={p.num} style={{ textAlign: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={`Page ${p.num} as JPG`}
                    style={{
                      width: "100%",
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      display: "block",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={() => downloadOne(p)}
                  >
                    Page {p.num} ↓
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Hidden staging area for the rendered document (kept off-screen).
          Always mounted so docx-preview has a target; html2canvas draws from the
          DOM clone, not the viewport, so off-screen elements capture fine. */}
      <div
        ref={docRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -99999,
          top: 0,
          width: 900,
          pointerEvents: "none",
        }}
      />

      {error && <div className="notice" style={{ marginTop: 14 }}>{error}</div>}
    </div>
  );
}
