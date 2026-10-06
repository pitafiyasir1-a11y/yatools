"use client";

import { useEffect, useRef, useState } from "react";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** Parse "1, 3, 5-8" into sorted unique page numbers (1-based). Null on bad input. */
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

export default function RotatePdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [scope, setScope] = useState<"all" | "custom">("all");
  const [custom, setCustom] = useState("1-2");
  const [working, setWorking] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [rotatedPages, setRotatedPages] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const downloadUrlRef = useRef<string | null>(null);
  downloadUrlRef.current = downloadUrl;

  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    };
  }, []);

  const pickFile = async (f: File) => {
    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf) {
      setError("That is not a PDF file — please choose a .pdf document.");
      return;
    }
    setError(null);
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setRotatedPages(null);
    setFile(f);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      if (src.isEncrypted) {
        setError("This PDF is password-protected. Remove its password before rotating.");
        setFile(null);
        return;
      }
      setPageCount(src.getPageCount());
    } catch {
      setError("Could not read that PDF. It may be corrupted.");
      setFile(null);
    }
  };

  const rotate = async (deg: 90 | 180 | 270) => {
    if (!file || !pageCount) return;
    setError(null);
    setWorking(true);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      let targets: number[];
      if (scope === "all") {
        targets = Array.from({ length: pageCount }, (_, i) => i);
      } else {
        const parsed = parseRanges(custom, pageCount);
        if (!parsed) {
          throw new Error(
            `Couldn't understand "${custom}". Use page numbers and ranges like 1, 3, 5-8 (this PDF has ${pageCount} pages).`
          );
        }
        targets = parsed.map((p) => p - 1);
      }
      targets.forEach((i) => {
        const page = src.getPage(i);
        page.setRotation(degrees((page.getRotation().angle + deg) % 360));
      });
      const bytes = await src.save();
      // Slice the exact byte range: a Uint8Array's .buffer may be a larger
      // pooled ArrayBuffer, which would corrupt the download with stray bytes.
      const blob = new Blob(
        [bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer],
        { type: "application/pdf" }
      );
      setDownloadUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setRotatedPages(targets.map((i) => i + 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rotation failed. Try a different file.");
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
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => inputRef.current?.click()}
        style={{ width: "100%" }}
      >
        {file ? "Choose a different PDF" : "Choose a PDF to rotate"}
      </button>
      <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "10px 0 0" }}>
        The file never leaves your device — rotation happens 100% in your browser.
      </p>

      {file && pageCount !== null && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 800 }}>{file.name}</div>
          <div className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 14 }}>
            {formatSize(file.size)} · {pageCount} page{pageCount === 1 ? "" : "s"}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {(
              [
                { v: "all", label: `All ${pageCount} pages` },
                { v: "custom", label: "Choose pages" },
              ] as { v: "all" | "custom"; label: string }[]
            ).map((s) => (
              <button
                key={s.v}
                type="button"
                className="btn btn-sm"
                style={
                  scope === s.v
                    ? { background: "var(--red)", color: "#fff", borderColor: "var(--red)" }
                    : undefined
                }
                onClick={() => setScope(s.v)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {scope === "custom" && (
            <div style={{ marginBottom: 4 }}>
              <label className="field-label" htmlFor="rp-custom">Pages to rotate</label>
              <input
                id="rp-custom"
                className="input input-mono"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="1, 3, 5-8"
                style={{ maxWidth: 320 }}
              />
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
            {(
              [
                { deg: 90, label: "⟳ 90° clockwise" },
                { deg: 270, label: "⟲ 90° counter-clockwise" },
                { deg: 180, label: "180° upside-down" },
              ] as { deg: 90 | 180 | 270; label: string }[]
            ).map((b) => (
              <button
                key={b.deg}
                type="button"
                className="btn"
                onClick={() => rotate(b.deg)}
                disabled={working}
              >
                {working ? "Rotating…" : b.label}
              </button>
            ))}
          </div>

          {downloadUrl && rotatedPages && (
            <div className="notice notice-ok" style={{ marginTop: 16 }}>
              <strong>Rotated {rotatedPages.length} page{rotatedPages.length === 1 ? "" : "s"}:</strong>{" "}
              <span className="font-mono2" style={{ fontSize: "0.85em" }}>
                {rotatedPages.slice(0, 12).join(", ")}
                {rotatedPages.length > 12 && ` …and ${rotatedPages.length - 12} more`}
              </span>
              <br />
              <a
                href={downloadUrl}
                download={file.name.replace(/\.pdf$/i, "") + "-rotated.pdf"}
                className="btn btn-primary btn-sm"
                style={{ marginTop: 10 }}
              >
                Download rotated PDF
              </a>
            </div>
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
