"use client";

import { useRef, useState } from "react";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [newSize, setNewSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = (f: File) => {
    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf) {
      setError("That is not a PDF file — please choose a .pdf document.");
      return;
    }
    setError(null);
    setFile(f);
    setOriginalSize(f.size);
    setNewSize(null);
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const compress = async () => {
    if (!file) return;
    setError(null);
    setWorking(true);
    try {
      // pdf-lib is heavy (~1MB): load it only when the user compresses.
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      if (src.isEncrypted) {
        throw new Error("This PDF is password-protected. Remove its password before compressing.");
      }

      // Structural compression: rewrite through the object model (which
      // already uses object streams) and strip embedded metadata.
      src.setTitle("");
      src.setAuthor("");
      src.setSubject("");
      src.setKeywords([]);
      src.setProducer("");
      src.setCreator("");
      src.setCreationDate(new Date(0));
      src.setModificationDate(new Date(0));

      const bytes = await src.save({ useObjectStreams: true });
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setNewSize(blob.size);
      setDownloadUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Compression failed. Try a different file."
      );
    } finally {
      setWorking(false);
    }
  };

  const savedPct =
    originalSize !== null && newSize !== null && originalSize > 0
      ? Math.round(((originalSize - newSize) / originalSize) * 100)
      : null;

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

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => inputRef.current?.click()}
          style={{ flex: 1, minWidth: 200 }}
        >
          {file ? "Choose a different PDF" : "Choose a PDF"}
        </button>
        {file && (
          <button type="button" className="btn" onClick={compress} disabled={working}>
            {working ? "Compressing…" : "Compress PDF"}
          </button>
        )}
      </div>
      <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "10px 0 0" }}>
        The file never leaves your device — compression happens 100% in your browser.
      </p>

      {file && originalSize !== null && (
        <div
          className="card"
          style={{ marginTop: 18, padding: 18, background: "var(--surface)" }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{file.name}</div>
          <div
            className="font-mono2"
            style={{ fontSize: "0.78rem", color: "var(--text2)", lineHeight: 2 }}
          >
            <div>
              Original size: <strong>{formatSize(originalSize)}</strong>
            </div>
            {newSize !== null && (
              <>
                <div>
                  Compressed size: <strong>{formatSize(newSize)}</strong>
                </div>
                <div>
                  Saved:{" "}
                  <strong style={{ color: savedPct !== null && savedPct > 0 ? "var(--green)" : "inherit" }}>
                    {savedPct !== null && savedPct > 0 ? `${savedPct}% smaller` : "0% — nothing to squeeze out"}
                  </strong>
                </div>
              </>
            )}
          </div>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={file.name.replace(/\.pdf$/i, "") + "-compressed.pdf"}
              className="btn btn-primary btn-sm"
              style={{ marginTop: 10 }}
            >
              Download compressed PDF
            </a>
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
