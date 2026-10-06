"use client";

import { useEffect, useRef, useState } from "react";

type PdfItem = { id: number; name: string; size: number; file: File };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

let nextId = 1;

export default function MergePdfClient() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [merging, setMerging] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string; pages: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIdx = useRef<number | null>(null);
  const resultRef = useRef<{ url: string } | null>(null);
  resultRef.current = result;

  useEffect(() => {
    return () => {
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    };
  }, []);

  const addFiles = (files: FileList | File[]) => {
    const valid: PdfItem[] = [];
    for (const f of Array.from(files)) {
      const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
      if (!isPdf) {
        setError(`"${f.name}" is not a PDF file — only PDFs can be merged.`);
        continue;
      }
      valid.push({ id: nextId++, name: f.name, size: f.size, file: f });
    }
    if (valid.length > 0) {
      setItems((prev) => [...prev, ...valid]);
      setError(null);
      setResult(null);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const onDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIdx.current;
    dragIdx.current = null;
    if (from === null || from === index) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
  };

  const merge = async () => {
    if (items.length < 2) {
      setError("Add at least 2 PDFs to merge — there is nothing to combine yet.");
      return;
    }
    setError(null);
    setMerging(true);
    try {
      // pdf-lib is heavy (~1MB): load it only when the user merges.
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      let totalPages = 0;
      for (const item of items) {
        const bytes = await item.file.arrayBuffer();
        let src;
        try {
          src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        } catch {
          throw new Error(`"${item.name}" could not be read. It may be password-protected or corrupted.`);
        }
        if (src.isEncrypted) {
          throw new Error(`"${item.name}" is password-protected. Remove its password before merging.`);
        }
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
        totalPages += pages.length;
      }
      const out = await merged.save();
      // Slice the exact byte range: a Uint8Array's .buffer may be a larger
      // pooled ArrayBuffer, which would corrupt the download with stray bytes.
      const blob = new Blob(
        [out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength) as ArrayBuffer],
        { type: "application/pdf" }
      );
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url: URL.createObjectURL(blob), name: "merged.pdf", pages: totalPages };
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Merging failed in your browser. Try refreshing and using smaller files."
      );
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => inputRef.current?.click()}
        style={{ width: "100%" }}
      >
        + Add PDF files
      </button>
      <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "10px 0 0" }}>
        Files are processed on your device — nothing is uploaded to any server.
      </p>

      {items.length > 0 && (
        <ol style={{ listStyle: "none", margin: "18px 0 0", padding: 0 }}>
          {items.map((item, i) => (
            <li
              key={item.id}
              draggable
              onDragStart={() => (dragIdx.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop(i)}
              className="card"
              style={{
                padding: "10px 12px",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "grab",
                background: "var(--surface)",
              }}
            >
              <span
                className="font-display"
                aria-hidden="true"
                style={{
                  width: 30,
                  height: 30,
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  background: "var(--red)",
                  color: "#fff",
                  border: "1px solid var(--line)",
                  fontSize: "1.05rem",
                }}
              >
                {i + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </div>
                <div className="font-mono2" style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                  {formatSize(item.size)} · drag to reorder
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${item.name} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label={`Move ${item.name} down`}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setItems((prev) => prev.filter((p) => p.id !== item.id))}
                  aria-label={`Remove ${item.name}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 18 }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={merge}
          disabled={merging || items.length < 2}
        >
          {merging ? "Merging…" : `Merge ${items.length} PDFs`}
        </button>
        <span className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
          {items.length === 0
            ? "no files yet"
            : `${items.length} file${items.length === 1 ? "" : "s"} in merge order`}
        </span>
      </div>

      {result && (
        <div className="notice notice-ok" style={{ marginTop: 16 }}>
          <strong>Merged successfully.</strong> {result.pages} page{result.pages === 1 ? "" : "s"} combined into{" "}
          <code className="font-mono2" style={{ fontSize: "0.85em" }}>{result.name}</code>.{" "}
          <a href={result.url} download={result.name} className="btn btn-sm" style={{ marginLeft: 8 }}>
            Download merged PDF
          </a>
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
