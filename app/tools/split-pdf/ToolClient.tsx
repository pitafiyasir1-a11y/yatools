"use client";

import { useRef, useState } from "react";

type SplitMode = "ranges" | "every" | "pages";
type Result = { name: string; url: string; pages: number };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** Parse "1-3, 5, 8-10" into sorted unique page numbers (1-based). Returns null on bad input. */
function parseRanges(input: string, pageCount: number): number[] | null {
  const pages = new Set<number>();
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  for (const part of parts) {
    const m = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) return null;
    const a = parseInt(m[1], 10);
    const b = m[2] ? parseInt(m[2], 10) : a;
    if (a < 1 || b < 1 || a > b || b > pageCount) return null;
    for (let i = a; i <= b; i++) pages.add(i);
  }
  return [...pages].sort((x, y) => x - y);
}

export default function SplitPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<SplitMode>("ranges");
  const [ranges, setRanges] = useState("1-3");
  const [everyN, setEveryN] = useState(2);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<Result[]>([]);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = async (f: File) => {
    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf) {
      setError("That is not a PDF file — please choose a .pdf document.");
      return;
    }
    setError(null);
    setResults([]);
    setSelected(new Set());
    setFile(f);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      if (src.isEncrypted) {
        setError("This PDF is password-protected. Remove its password before splitting.");
        setFile(null);
        return;
      }
      setPageCount(src.getPageCount());
    } catch {
      setError("Could not read that PDF. It may be corrupted.");
      setFile(null);
    }
  };

  const togglePage = (n: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const saveDoc = async (PDFDocument: any, pages: number[], name: string): Promise<Result> => {
    const src = await PDFDocument.load(await file!.arrayBuffer(), { ignoreEncryption: true });
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, pages.map((p) => p - 1));
    copied.forEach((p: any) => out.addPage(p));
    const bytes = await out.save();
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
    return { name, url: URL.createObjectURL(blob), pages: pages.length };
  };

  const split = async () => {
    if (!file || !pageCount) return;
    setError(null);
    setWorking(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      let built: Result[] = [];
      if (mode === "ranges") {
        const pages = parseRanges(ranges, pageCount);
        if (!pages) {
          throw new Error(
            `Couldn't understand "${ranges}". Use page numbers and ranges like 1-3, 5, 8-10 (this PDF has ${pageCount} pages).`
          );
        }
        built = [await saveDoc(PDFDocument, pages, `${file.name.replace(/\.pdf$/i, "")}-pages.pdf`)];
      } else if (mode === "every") {
        if (everyN < 1 || everyN > pageCount) throw new Error(`"Every N pages" must be between 1 and ${pageCount}.`);
        const base = file.name.replace(/\.pdf$/i, "");
        for (let start = 1; start <= pageCount; start += everyN) {
          const chunk: number[] = [];
          for (let p = start; p < Math.min(start + everyN, pageCount + 1); p++) chunk.push(p);
          built.push(await saveDoc(PDFDocument, chunk, `${base}-part-${Math.ceil(start / everyN)}.pdf`));
        }
      } else {
        const pages = [...selected].sort((a, b) => a - b);
        if (pages.length === 0) throw new Error("Tick at least one page to extract.");
        built = [await saveDoc(PDFDocument, pages, `${file.name.replace(/\.pdf$/i, "")}-extracted.pdf`)];
      }
      setResults((prev) => {
        prev.forEach((r) => URL.revokeObjectURL(r.url));
        return built;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Splitting failed. Try refreshing the page and using a smaller file."
      );
    } finally {
      setWorking(false);
    }
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
      {!file ? (
        <>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => inputRef.current?.click()}
            style={{ width: "100%" }}
          >
            Choose a PDF to split
          </button>
          <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "10px 0 0" }}>
            The file never leaves your device — splitting happens 100% in your browser.
          </p>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 800 }}>{file.name}</div>
              <div className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                {formatSize(file.size)}
                {pageCount !== null && ` · ${pageCount} page${pageCount === 1 ? "" : "s"}`}
              </div>
            </div>
            <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()}>
              Choose a different file
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {(
              [
                { v: "ranges", label: "Page ranges" },
                { v: "every", label: "Every N pages" },
                { v: "pages", label: "Pick pages" },
              ] as { v: SplitMode; label: string }[]
            ).map((m) => (
              <button
                key={m.v}
                type="button"
                className="btn btn-sm"
                style={
                  mode === m.v
                    ? { background: "var(--red)", color: "#fff", borderColor: "var(--red)" }
                    : undefined
                }
                onClick={() => setMode(m.v)}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === "ranges" && (
            <div>
              <label className="field-label" htmlFor="sp-ranges">
                Pages to extract
              </label>
              <input
                id="sp-ranges"
                className="input input-mono"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder="1-3, 5, 8-10"
              />
              <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "8px 0 0" }}>
                Numbers and ranges separated by commas, e.g. 1-3, 5, 8-10.
              </p>
            </div>
          )}

          {mode === "every" && (
            <div>
              <label className="field-label" htmlFor="sp-everyn">
                Split every N pages
              </label>
              <input
                id="sp-everyn"
                className="input input-mono"
                type="number"
                min={1}
                max={pageCount ?? undefined}
                value={everyN}
                onChange={(e) => setEveryN(Math.max(1, parseInt(e.target.value, 10) || 1))}
                style={{ maxWidth: 160 }}
              />
              <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "8px 0 0" }}>
                Each output PDF will hold at most N pages (the last one may be shorter).
              </p>
            </div>
          )}

          {mode === "pages" && pageCount !== null && (
            <div>
              <label className="field-label">Tick pages to extract</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => togglePage(n)}
                    aria-pressed={selected.has(n)}
                    className="font-mono2"
                    style={{
                      minWidth: 44,
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid var(--line)",
                      
                      background: selected.has(n) ? "var(--red)" : "var(--surface)",
                      color: selected.has(n) ? "#fff" : "var(--text)",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i + 1)))}
                >
                  Select all
                </button>
                <button type="button" className="btn btn-sm" onClick={() => setSelected(new Set())}>
                  Clear
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={split}
            disabled={working}
            style={{ marginTop: 18 }}
          >
            {working ? "Splitting…" : "Split PDF"}
          </button>

          {results.length > 0 && (
            <div className="notice notice-ok" style={{ marginTop: 16 }}>
              <strong>Done — {results.length} file{results.length === 1 ? "" : "s"} created.</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {results.map((r) => (
                  <a key={r.url} href={r.url} download={r.name} className="btn btn-sm">
                    {r.name} ({r.pages}p)
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="notice" style={{ marginTop: 14 }}>
          {error}
        </div>
      )}
    </div>
  );
}
