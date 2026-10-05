"use client";

import { useRef, useState } from "react";

type PageOut = { num: number; url: string; blob: Blob };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function PdfToJpgClient() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [scale, setScale] = useState(2);
  const [loading, setLoading] = useState(false);
  const [rendered, setRendered] = useState<PageOut[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pdfBytes = useRef<Uint8Array | null>(null);

  const pickFile = async (f: File) => {
    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf) {
      setError("That is not a PDF file — please choose a .pdf document.");
      return;
    }
    setError(null);
    setRendered((prev) => {
      prev.forEach((r) => URL.revokeObjectURL(r.url));
      return [];
    });
    setProgress(0);
    setLoading(true);
    try {
      // pdf.js is heavy: load it only when a file is chosen.
      const { getPdfjs } = await import("../../../lib/pdfjs");
      const pdfjs = getPdfjs();
      const bytes = new Uint8Array(await f.arrayBuffer());
      // Worker is configured in lib/pdfjs.ts (pdfjs-dist v6 requires one).
      const pdf = await pdfjs.getDocument({ data: bytes }).promise;
      pdfBytes.current = bytes;
      setFileName(f.name.replace(/\.pdf$/i, ""));
      setPageCount(pdf.numPages);
    } catch {
      setError("Could not read that PDF. It may be password-protected or corrupted.");
      pdfBytes.current = null;
    } finally {
      setLoading(false);
    }
  };

  const renderAll = async () => {
    if (!pdfBytes.current || !pageCount) return;
    setError(null);
    setLoading(true);
    setRendered((prev) => {
      prev.forEach((r) => URL.revokeObjectURL(r.url));
      return [];
    });
    try {
      const { getPdfjs } = await import("../../../lib/pdfjs");
      const pdfjs = getPdfjs();
      const pdf = await pdfjs.getDocument({ data: pdfBytes.current }).promise;
      const out: PageOut[] = [];
      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no 2d context");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, viewport }).promise;
        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), "image/jpeg", 0.92)
        );
        out.push({ num: n, url: URL.createObjectURL(blob), blob });
        setProgress(Math.round((n / pdf.numPages) * 100));
      }
      setRendered(out);
    } catch {
      setError("Rendering failed in your browser. Try a smaller PDF or a Chromium-based browser.");
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
        a.download = `${fileName}-page-${r.num}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 400);
    });
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) pickFile(e.target.files[0]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => inputRef.current?.click()}
        style={{ width: "100%" }}
      >
        {fileName ? "Choose a different PDF" : "Choose a PDF"}
      </button>
      <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "10px 0 0" }}>
        Pages are rendered on your device — the file is never uploaded anywhere.
      </p>

      {fileName && pageCount !== null && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>{fileName}.pdf</div>
          <div className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--text2)", marginBottom: 14 }}>
            {pageCount} page{pageCount === 1 ? "" : "s"} found
            {rendered.length > 0 && ` · ${rendered.length} rendered as JPG`}
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
                <label className="field-label" htmlFor="pj-quality">Image quality</label>
                <select
                  id="pj-quality"
                  className="select"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  disabled={loading}
                >
                  <option value={1}>Standard (1×)</option>
                  <option value={2}>High (2×, recommended)</option>
                  <option value={3}>Extra (3×, large files)</option>
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={renderAll}
                disabled={loading}
              >
                {loading ? `Rendering… ${progress}%` : `Render ${pageCount} page${pageCount === 1 ? "" : "s"} as JPG`}
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
                  Re-render
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
                      Page {r.num} · {formatSize(r.blob.size)}
                    </div>
                    <a
                      href={r.url}
                      download={`${fileName}-page-${r.num}.jpg`}
                      className="btn btn-sm"
                      style={{ width: "100%", textAlign: "center" }}
                    >
                      Download JPG
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="notice" style={{ marginTop: 14 }}>
          {error}
        </div>
      )}
    </div>
  );
}
