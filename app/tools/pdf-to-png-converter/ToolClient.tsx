"use client";

import { useEffect, useRef, useState } from "react";

type PageOut = { num: number; url: string; blob: Blob; w: number; h: number };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const DPI_OPTIONS = [
  { label: "Standard — 72 DPI", dpi: 72 },
  { label: "High — 150 DPI", dpi: 150 },
  { label: "Print — 300 DPI", dpi: 300 },
];

export default function PdfToPngClient() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [dpi, setDpi] = useState(150);
  const [loading, setLoading] = useState(false);
  const [rendered, setRendered] = useState<PageOut[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pdfBytes = useRef<Uint8Array | null>(null);
  const renderedRef = useRef<PageOut[]>([]);
  renderedRef.current = rendered;

  useEffect(() => {
    return () => {
      renderedRef.current.forEach((r) => URL.revokeObjectURL(r.url));
    };
  }, []);

  const pickFile = async (f: File | null) => {
    if (!f) return;
    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf) {
      setError("That is not a PDF file — please choose a .pdf document.");
      return;
    }
    if (f.size > 100 * 1024 * 1024) {
      setError("That PDF is over the 100 MB browser limit. Try a smaller file.");
      return;
    }
    setError(null);
    renderedRef.current.forEach((r) => URL.revokeObjectURL(r.url));
    setRendered([]);
    setProgress(0);
    setLoading(true);
    try {
      // pdf.js is heavy: load it only when a file is chosen.
      const pdfjs = await import("pdfjs-dist");
      const bytes = new Uint8Array(await f.arrayBuffer());
      // No worker configured → pdf.js runs on the main thread ("fake worker").
      // Simpler and reliable; big PDFs just take a few seconds.
      const pdf = await pdfjs.getDocument({ data: bytes }).promise;
      pdfBytes.current = bytes;
      setFileName(f.name.replace(/\.pdf$/i, ""));
      setPageCount(pdf.numPages);
    } catch {
      setError("Could not read that PDF. It may be password-protected or corrupted.");
      pdfBytes.current = null;
      setFileName(null);
      setPageCount(null);
    } finally {
      setLoading(false);
    }
  };

  const renderAll = async () => {
    if (!pdfBytes.current || !pageCount) return;
    setError(null);
    setLoading(true);
    renderedRef.current.forEach((r) => URL.revokeObjectURL(r.url));
    setRendered([]);
    try {
      const pdfjs = await import("pdfjs-dist");
      const pdf = await pdfjs.getDocument({ data: pdfBytes.current }).promise;
      const scale = dpi / 72;
      const out: PageOut[] = [];
      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no 2d context");
        await page.render({ canvas, viewport }).promise;
        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), "image/png")
        );
        out.push({
          num: n,
          url: URL.createObjectURL(blob),
          blob,
          w: canvas.width,
          h: canvas.height,
        });
        setProgress(Math.round((n / pdf.numPages) * 100));
      }
      setRendered(out);
    } catch {
      setError("Rendering failed in your browser. Try a lower DPI, a smaller PDF, or a Chromium-based browser.");
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = () => {
    // Browsers may block many downloads at once; stagger them slightly.
    rendered.forEach((r, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = r.url;
        a.download = `${fileName}-page-${r.num}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 400);
    });
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a PDF"
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
          accept="application/pdf,.pdf"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            pickFile(e.target.files?.[0] || null);
            e.target.value = "";
          }}
        />
        <div className="font-display" style={{ fontSize: "1.5rem", marginBottom: 6 }}>
          {fileName ? "Swap PDF" : "Drop a PDF here"}
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          or click to browse — every page becomes a PNG. Files never leave your browser.
        </p>
      </div>

      {fileName && pageCount !== null && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>{fileName}.pdf</div>
          <div className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--text2)", marginBottom: 14 }}>
            {pageCount} page{pageCount === 1 ? "" : "s"} found
            {rendered.length > 0 && ` · ${rendered.length} rendered as PNG`}
            {loading && ` · rendering… ${progress}%`}
          </div>

          {rendered.length === 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 12,
                alignItems: "end",
                marginBottom: 4,
              }}
            >
              <div>
                <label className="field-label" htmlFor="pp-dpi">Output resolution</label>
                <select
                  id="pp-dpi"
                  className="select"
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  disabled={loading}
                >
                  {DPI_OPTIONS.map((o) => (
                    <option key={o.dpi} value={o.dpi}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
                  Higher DPI = sharper image, bigger file. 150 DPI suits screens; 300 DPI suits print.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={renderAll}
                disabled={loading}
              >
                {loading ? `Rendering… ${progress}%` : `Render ${pageCount} page${pageCount === 1 ? "" : "s"} as PNG`}
              </button>
            </div>
          )}

          {rendered.length > 0 && (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                <button type="button" className="btn" onClick={downloadAll}>
                  Download all pages
                </button>
                <button type="button" className="btn btn-sm" onClick={renderAll} disabled={loading}>
                  Re-render at {dpi} DPI
                </button>
                <span className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", alignSelf: "center" }}>
                  “Download all” saves each page one at a time — your browser may ask for permission.
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 12,
                }}
              >
                {rendered.map((r) => (
                  <div key={r.num} className="card" style={{ padding: 8, background: "var(--surface)" }}>
                    <img
                      src={r.url}
                      alt={`Page ${r.num}`}
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "contain",
                        background: "#fff",
                        borderRadius: 6,
                        border: "2px solid var(--line)",
                        display: "block",
                      }}
                    />
                    <div
                      className="font-mono2"
                      style={{ fontSize: "0.7rem", color: "var(--text2)", margin: "6px 0" }}
                    >
                      Page {r.num} · {r.w}×{r.h} · {formatSize(r.blob.size)}
                    </div>
                    <a
                      href={r.url}
                      download={`${fileName}-page-${r.num}.png`}
                      className="btn btn-sm"
                      style={{ width: "100%", textAlign: "center" }}
                    >
                      Download PNG
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="notice" style={{ borderColor: "var(--red)", marginTop: 14 }}>
          <strong>Heads up:</strong> {error}
        </div>
      )}
    </div>
  );
}
