"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { DropZone, HonestLabel, downloadBlob } from "../doc-convert-parts";

type Phase = "idle" | "loading" | "ocr" | "building" | "done";

const MAX_FILE_BYTES = 50 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / 1024 ** i;
  return `${v >= 100 ? v.toFixed(0) : v.toFixed(1)} ${units[i]}`;
}

type LogMsg = { status?: string; progress?: number };

function friendlyEngineStatus(m: LogMsg): string {
  const s = (m.status || "").toLowerCase();
  if (s.includes("tesseract core") || s.includes("loading")) return "Downloading the OCR engine…";
  if (s.includes("traineddata") || s.includes("language")) return "Loading English language data…";
  if (s.includes("initializing")) return "Warming up the recognizer…";
  if (s.includes("recognizing")) return "Reading page…";
  return "Starting…";
}

/** Parse "1-5, 8" into a sorted, clamped, de-duplicated list of 1-based page numbers. */
function parsePageRange(input: string, total: number): number[] | null {
  const tokens = input.split(",").map((t) => t.trim()).filter(Boolean);
  if (!tokens.length) return null;
  const set = new Set<number>();
  for (const t of tokens) {
    const m = t.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
    if (!m) return null;
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    if (a < 1 || b < 1 || a > total || b > total || a > b) return null;
    for (let n = a; n <= b; n++) set.add(n);
  }
  const out = [...set].sort((x, y) => x - y);
  return out.length ? out : null;
}

export default function PdfToWordOcrClient() {
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [range, setRange] = useState("");
  const [rangeMode, setRangeMode] = useState<"all" | "range">("all");
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pagesDone, setPagesDone] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [preview, setPreview] = useState("");
  const pdfBytes = useRef<Uint8Array | null>(null);
  const baseName = useRef("");
  const docxBlob = useRef<Blob | null>(null);
  const runIdRef = useRef(0);
  const ocrIdx = useRef(0);
  const ocrTotal = useRef(1);
  const workerRef = useRef<{ terminate: () => Promise<unknown> } | null>(null);

  const busy = phase === "loading" || phase === "ocr" || phase === "building";

  const reset = () => {
    runIdRef.current += 1;
    workerRef.current?.terminate().catch(() => undefined);
    workerRef.current = null;
    setFileName("");
    setTotalPages(0);
    setRange("");
    setRangeMode("all");
    setPhase("idle");
    setStatus("");
    setProgress(0);
    setError(null);
    setPagesDone(0);
    setSelectedCount(0);
    setWordCount(0);
    setPreview("");
    pdfBytes.current = null;
    baseName.current = "";
    docxBlob.current = null;
  };

  const pickFile = async (f: File) => {
    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf) {
      setError("That is not a PDF file — please choose a .pdf document.");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(
        `That file is ${formatBytes(f.size)} — please use a PDF under 50 MB so your browser stays responsive.`
      );
      return;
    }
    reset();
    setPhase("loading");
    setStatus("Reading your PDF…");
    setError(null);
    try {
      const pdfjs = await import("pdfjs-dist");
      const bytes = new Uint8Array(await f.arrayBuffer());
      const pdf = await pdfjs.getDocument({ data: bytes }).promise;
      const count = pdf.numPages;
      pdfBytes.current = bytes;
      baseName.current = f.name.replace(/\.pdf$/i, "");
      setFileName(f.name);
      setTotalPages(count);
      setPhase("idle");
    } catch {
      setError("Could not read that PDF. It may be password-protected, corrupted, or too large.");
      setPhase("idle");
    }
  };

  const startOcr = async () => {
    if (!pdfBytes.current || busy) return;
    let selected: number[];
    if (rangeMode === "range") {
      const parsed = parsePageRange(range, totalPages);
      if (!parsed) {
        setError(
          `That page range didn't work. Use numbers and dashes like “1-5, 8” — this PDF has ${totalPages} page${totalPages === 1 ? "" : "s"}.`
        );
        return;
      }
      selected = parsed;
    } else {
      selected = Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const runId = ++runIdRef.current;
    setError(null);
    docxBlob.current = null;
    setSelectedCount(selected.length);
    setPhase("loading");
    setProgress(0);
    setStatus("Downloading the OCR engine…");
    try {
      // OCR engine (tesseract.js) loads once and is cached by the browser afterwards.
      const Tesseract = await import("tesseract.js");
      if (runId !== runIdRef.current) return;
      const worker = await Tesseract.createWorker("eng", undefined, {
        logger: (m: LogMsg) => {
          if (runId !== runIdRef.current) return;
          const s = (m.status || "").toLowerCase();
          if (s.includes("recognizing") && typeof m.progress === "number") {
            // Per-page progress from the worker: page i of N, each contributing 90% of the bar.
            const p = Math.min(1, Math.max(0, m.progress));
            setProgress(Math.round(((ocrIdx.current + p) / ocrTotal.current) * 90));
          } else {
            setStatus(friendlyEngineStatus(m));
          }
        },
      });
      workerRef.current = worker;
      if (runId !== runIdRef.current) return;

      // Render each page at 150 DPI and OCR it.
      const pdfjs = await import("pdfjs-dist");
      const pdf = await pdfjs.getDocument({ data: pdfBytes.current }).promise;
      const pageTexts: { num: number; text: string }[] = [];
      const scale = 150 / 72; // 150 DPI — enough for OCR, keeps memory reasonable.
      ocrTotal.current = selected.length;
      for (let i = 0; i < selected.length; i++) {
        if (runId !== runIdRef.current) return;
        const num = selected[i];
        ocrIdx.current = i;
        setPhase("ocr");
        setStatus(`OCR page ${i + 1} of ${selected.length} (PDF page ${num})…`);
        const page = await pdf.getPage(num);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no 2d context");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, viewport }).promise;
        page.cleanup();
        const imgBlob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob((b) => (b ? res(b) : rej(new Error("image encode failed"))), "image/png")
        );
        const imgUrl = URL.createObjectURL(imgBlob);
        try {
          const { data } = await worker.recognize(imgUrl);
          pageTexts.push({ num, text: (data?.text || "").trim() });
        } finally {
          URL.revokeObjectURL(imgUrl);
        }
        setPagesDone(i + 1);
      }
      await worker.terminate();
      workerRef.current = null;
      if (runId !== runIdRef.current) return;

      // Build a real editable DOCX.
      setPhase("building");
      setStatus("Building your Word file…");
      setProgress(94);
      const { Document, Packer, Paragraph, HeadingLevel, TextRun } = await import("docx");
      const children: unknown[] = [];
      let words = 0;
      pageTexts.forEach(({ num, text }) => {
        children.push(
          new Paragraph({
            text: `Page ${num}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: num === pageTexts[0].num ? 0 : 480, after: 160 },
          })
        );
        if (!text) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "(No readable text found on this page — it may be blank, very blurry, or handwritten. Handwriting and complex tables don't convert well.)",
                  italics: true,
                  color: "888888",
                }),
              ],
            })
          );
        } else {
          for (const para of text.split(/\n\s*\n/)) {
            const t = para.replace(/\s+/g, " ").trim();
            if (!t) continue;
            words += t.split(/\s+/).length;
            children.push(new Paragraph({ text: t, spacing: { after: 120 } }));
          }
        }
      });
      const doc = new Document({
        sections: [{ children: children as never[] }],
        creator: "YATools",
        description: "Text OCR'd from a scanned PDF by YATools",
      });
      const blob = await Packer.toBlob(doc);
      docxBlob.current = blob;
      setWordCount(words);
      setPreview(pageTexts[0]?.text ? pageTexts[0].text.slice(0, 600) : "");
      setPagesDone(selected.length);
      setProgress(100);
      setPhase("done");
    } catch (e) {
      if (runId !== runIdRef.current) return;
      workerRef.current = null;
      setPhase("idle");
      setError(
        e instanceof Error
          ? `OCR failed: ${e.message}`
          : "OCR failed. Check your connection (the engine downloads on first run) and try again."
      );
    }
  };

  const download = () => {
    if (!docxBlob.current) return;
    downloadBlob(docxBlob.current, `${baseName.current || "document"}-ocr.docx`);
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <HonestLabel>
        <strong>For scanned PDFs.</strong> This tool reads each page as a picture and uses OCR
        (optical character recognition) to pull out the text — then builds a real editable .docx.{" "}
        <Link href="/tools/pdf-to-word-converter" style={{ fontWeight: 700, color: "var(--red)" }}>
          For text-based PDFs use our faster PDF to Word
        </Link>{" "}
        — it extracts real text instead of guessing it.
        <br />
        OCR text may need proofreading — accuracy depends on scan quality. Best for clean,
        high-contrast scans; handwriting and complex tables won't convert well.
      </HonestLabel>

      <div className="notice" style={{ marginBottom: 18 }}>
        <strong>First-run download:</strong> the OCR engine (about 15&nbsp;MB) downloads once,
        then it's cached in your browser — later runs start instantly. OCR runs 100% in your
        browser — your files never leave your device.
      </div>

      {!fileName && (
        <DropZone
          accept="application/pdf,.pdf"
          label="Drop a scanned PDF here, or click to choose one"
          hint="PDFs up to 50 MB. A scan is a PDF whose pages are pictures — if you can't select text in it, it's scanned."
          onFile={pickFile}
          disabled={busy}
        />
      )}

      {fileName && phase !== "done" && (
        <div>
          <div className="notice notice-ok" style={{ marginBottom: 16 }}>
            <strong>{fileName}</strong> · {totalPages} page{totalPages === 1 ? "" : "s"} loaded.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <label
              className="card"
              style={{
                padding: 14,
                cursor: "pointer",
                border: rangeMode === "all" ? "2px solid var(--red)" : "1px solid var(--line)",
              }}
            >
              <input
                type="radio"
                name="ocr-range-mode"
                checked={rangeMode === "all"}
                onChange={() => setRangeMode("all")}
                style={{ marginRight: 8 }}
              />
              <strong>All pages</strong>
              <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: "6px 0 0" }}>
                OCR the whole document.
              </p>
            </label>
            <label
              className="card"
              style={{
                padding: 14,
                cursor: "pointer",
                border: rangeMode === "range" ? "2px solid var(--red)" : "1px solid var(--line)",
              }}
            >
              <input
                type="radio"
                name="ocr-range-mode"
                checked={rangeMode === "range"}
                onChange={() => setRangeMode("range")}
                style={{ marginRight: 8 }}
              />
              <strong>Page range</strong>
              <input
                className="input"
                type="text"
                placeholder={`e.g. 1-5, 8 (of ${totalPages})`}
                value={range}
                onChange={(e) => setRange(e.target.value)}
                disabled={rangeMode !== "range" || busy}
                style={{ marginTop: 10, width: "100%" }}
                aria-label="Pages to OCR, like 1-5, 8"
              />
            </label>
          </div>

          <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: "0 0 16px" }}>
            OCR language: <strong>printed English</strong> — recognition is tuned for clean,
            high-contrast English scans. Other languages, handwriting, and heavily stylized fonts
            won't read well.
          </p>

          {busy && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                {status} {progress}%
              </p>
              <div style={{ height: 8, borderRadius: 99, background: "var(--line)", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "var(--red)",
                    transition: "width .2s",
                  }}
                />
              </div>
              {phase === "ocr" && (
                <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 8 }}>
                  {pagesDone} of {selectedCount || totalPages} pages finished — keep this tab open.
                </p>
              )}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={startOcr}
              disabled={busy}
            >
              {busy ? "Working…" : "Start OCR → build .docx"}
            </button>
            <button type="button" className="btn" onClick={reset} disabled={busy}>
              Choose a different PDF
            </button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <>
          <div className="notice notice-ok" style={{ marginBottom: 16 }}>
            <strong>Done.</strong> {pagesDone} page{pagesDone === 1 ? "" : "s"} OCR'd · ~
            {wordCount.toLocaleString()} words recognized ·{" "}
            {docxBlob.current ? (docxBlob.current.size / 1024).toFixed(0) : 0} KB DOCX.
          </div>
          {preview ? (
            <div style={{ marginBottom: 16 }}>
              <p className="field-label" style={{ marginBottom: 6 }}>
                Recognized text preview (first page) — proofread this before using it
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
          ) : (
            <div className="notice" style={{ marginBottom: 16 }}>
              <strong>No text recognized.</strong> The pages may be blank, too blurry, or
              handwritten — OCR needs clear, high-contrast printed text.
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button type="button" className="btn btn-primary" onClick={download}>
              Download {baseName.current || "document"}-ocr.docx
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
