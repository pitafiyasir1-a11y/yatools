"use client";

import { useRef, useState } from "react";
import { DropZone, HonestLabel, downloadBlob } from "../doc-convert-parts";

type Phase = "idle" | "extracting" | "building" | "done";

export default function PdfToWordClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [baseName, setBaseName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [preview, setPreview] = useState("");
  const docxBlob = useRef<Blob | null>(null);
  const busy = phase === "extracting" || phase === "building";

  const reset = () => {
    setPhase("idle");
    setProgress(0);
    setError(null);
    setBaseName("");
    setPageCount(0);
    setWordCount(0);
    setPreview("");
    docxBlob.current = null;
  };

  const convert = async (f: File) => {
    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf) {
      setError("That is not a PDF file — please choose a .pdf document.");
      return;
    }
    reset();
    setPhase("extracting");
    setError(null);
    try {
      const { getPdfjs } = await import("../../../lib/pdfjs");
      const pdfjs = getPdfjs();
      const bytes = new Uint8Array(await f.arrayBuffer());
      const pdf = await pdfjs.getDocument({ data: bytes }).promise;

      // Extract text line-by-line, page-by-page.
      const pages: string[] = [];
      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const tc = await page.getTextContent();
        const lines: string[] = [];
        let cur = "";
        for (const it of tc.items as { str: string; hasEOL?: boolean }[]) {
          cur += it.str;
          if (it.hasEOL) {
            lines.push(cur);
            cur = "";
          }
        }
        if (cur.trim()) lines.push(cur);
        pages.push(lines.join("\n").replace(/\n{3,}/g, "\n\n").trim());
        setProgress(Math.round((n / pdf.numPages) * 60));
      }
      pdf.cleanup();

      // Build a real editable DOCX with the `docx` library.
      setPhase("building");
      const { Document, Packer, Paragraph, HeadingLevel, TextRun } = await import("docx");
      const children: unknown[] = [];
      let words = 0;
      pages.forEach((text, i) => {
        children.push(
          new Paragraph({
            text: `Page ${i + 1}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: i === 0 ? 0 : 480, after: 160 },
          })
        );
        if (!text) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "(No extractable text on this page — it is probably a scanned image. Scanned pages need OCR, which this tool does not do.)",
                  italics: true,
                  color: "888888",
                }),
              ],
            })
          );
        } else {
          for (const para of text.split("\n")) {
            const t = para.trim();
            if (!t) continue;
            words += t.split(/\s+/).length;
            children.push(new Paragraph({ text: t, spacing: { after: 120 } }));
          }
        }
      });
      const doc = new Document({
        sections: [{ children: children as never[] }],
        creator: "YATools",
        description: "Text extracted from PDF by YATools",
      });
      const blob = await Packer.toBlob(doc);
      docxBlob.current = blob;
      setBaseName(f.name.replace(/\.pdf$/i, ""));
      setPageCount(pages.length);
      setWordCount(words);
      setPreview(pages[0] ? pages[0].slice(0, 600) : "");
      setProgress(100);
      setPhase("done");
    } catch {
      setError(
        "Could not read that PDF. It may be password-protected, corrupted, or too large for your browser."
      );
      setPhase("idle");
    }
  };

  const download = () => {
    if (!docxBlob.current) return;
    downloadBlob(docxBlob.current, `${baseName || "document"}.docx`);
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <HonestLabel>
        Text-based conversion — this extracts editable text from your PDF into a real .docx
        file. Complex layouts, tables, and scanned pages won't be pixel-perfect. If a page is a
        scanned image, its text can't be extracted here (that needs OCR).
      </HonestLabel>

      {phase === "idle" || phase === "done" ? null : (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>
            {phase === "extracting" ? "Extracting text…" : "Building .docx…"} {progress}%
          </p>
          <div
            style={{
              height: 8,
              borderRadius: 99,
              background: "var(--line)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "var(--red)",
                transition: "width .2s",
              }}
            />
          </div>
        </div>
      )}

      {phase !== "done" && (
        <DropZone
          accept="application/pdf,.pdf"
          label="Drop a PDF here, or click to choose one"
          hint="PDFs only. Runs 100% in your browser — your file is never uploaded."
          onFile={convert}
          disabled={busy}
        />
      )}

      {phase === "done" && (
        <>
          <div className="notice notice-ok" style={{ marginBottom: 16 }}>
            <strong>Converted.</strong> {pageCount} page{pageCount === 1 ? "" : "s"} · ~
            {wordCount.toLocaleString()} words extracted ·{" "}
            {docxBlob.current ? (docxBlob.current.size / 1024).toFixed(0) : 0} KB DOCX.
          </div>
          {preview && (
            <div style={{ marginBottom: 16 }}>
              <p className="field-label" style={{ marginBottom: 6 }}>
                Extracted text preview (page 1)
              </p>
              <pre
                className="font-mono2"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontSize: "0.78rem",
                  lineHeight: 1.6,
                  color: "var(--text2)",
                  background: "var(--bg2, #f7f7f7)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  padding: 14,
                  maxHeight: 220,
                  overflow: "auto",
                }}
              >
                {preview}
                {preview.length >= 600 ? "…" : ""}
              </pre>
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button type="button" className="btn btn-primary" onClick={download}>
              Download {baseName || "document"}.docx
            </button>
            <button type="button" className="btn" onClick={reset}>
              Convert another PDF
            </button>
          </div>
        </>
      )}

      {error && <div className="notice" style={{ marginTop: 14 }}>{error}</div>}
    </div>
  );
}
