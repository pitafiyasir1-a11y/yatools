"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "working" | "done";

const MAX_FILE_BYTES = 20 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / 1024 ** i;
  return `${v >= 100 ? v.toFixed(0) : v.toFixed(1)} ${units[i]}`;
}

type OcrWorker = {
  recognize: (image: string) => Promise<{ data?: { text?: string } }>;
  terminate: () => Promise<unknown>;
};

type LogMsg = { status?: string; progress?: number };

function friendlyStatus(m: LogMsg): string {
  const s = (m.status || "").toLowerCase();
  if (s.includes("tesseract core") || s.includes("loading")) return "Loading the OCR engine…";
  if (s.includes("traineddata") || s.includes("language")) return "Loading English language data…";
  if (s.includes("initializing")) return "Warming up the recognizer…";
  if (s.includes("recognizing")) return "Reading the text in your image…";
  return "Working…";
}

export default function ImageToTextClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<{ terminate: () => Promise<unknown> } | null>(null);
  const runIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
      runIdRef.current += 1;
      workerRef.current?.terminate().catch(() => undefined);
    };
  }, [imgUrl]);

  const pickFile = (f: File | null) => {
    setError(null);
    setResult("");
    setPhase("idle");
    setProgress(0);
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, WebP, BMP…).");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(
        `That file is ${formatBytes(f.size)} — please use an image under 20 MB so the browser stays responsive.`
      );
      return;
    }
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setFile(f);
    setImgUrl(URL.createObjectURL(f));
  };

  const extract = async () => {
    if (!file || !imgUrl || phase === "working") return;
    const runId = ++runIdRef.current;
    setPhase("working");
    setError(null);
    setResult("");
    setProgress(0);
    setStatus("Loading the OCR engine…");
    let worker: OcrWorker | null = null;
    try {
      const Tesseract = await import("tesseract.js");
      if (runId !== runIdRef.current) return;
      worker = await Tesseract.createWorker("eng", undefined, {
        logger: (m: LogMsg) => {
          if (runId !== runIdRef.current) return;
          setStatus(friendlyStatus(m));
          if (typeof m.progress === "number") setProgress(Math.min(1, Math.max(0, m.progress)));
        },
      });
      workerRef.current = worker;
      const { data } = await worker.recognize(imgUrl);
      await worker.terminate();
      workerRef.current = null;
      if (runId !== runIdRef.current) return;
      const text = (data?.text || "").trim();
      setResult(text);
      setPhase("done");
      setProgress(1);
      if (!text) {
        setError(
          "No readable text was found in this image. Clear, high-contrast printed text works best — handwriting and very blurry photos often fail."
        );
      }
    } catch (e) {
      if (runId !== runIdRef.current) return;
      workerRef.current = null;
      worker?.terminate().catch(() => undefined);
      setPhase("idle");
      setError(
        e instanceof Error
          ? `OCR failed: ${e.message}`
          : "OCR failed. Check your connection (the engine downloads on first run) and try again."
      );
    }
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const wordCount = result.trim() ? result.trim().split(/\s+/).length : 0;

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload an image"
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
          accept="image/*"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            pickFile(e.target.files?.[0] || null);
            e.target.value = "";
          }}
        />
        <div className="font-display" style={{ fontSize: "1.5rem", marginBottom: 6 }}>
          {file ? "Swap image" : "Drop an image here"}
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          or click to browse — screenshots, scans, and photos of documents work best.
        </p>
      </div>

      <div
        className="notice"
        style={{ marginTop: 16, borderColor: "var(--line)" }}
        role="note"
      >
        <strong>How this works:</strong> the first run downloads the OCR engine (about 10&nbsp;MB)
        and caches it in your browser. Recognition itself takes roughly 10–30 seconds depending on
        image size — larger images take longer.
      </div>

      {file && imgUrl && (
        <div style={{ marginTop: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div>
              <span className="field-label">Your image</span>
              <img
                src={imgUrl}
                alt="Uploaded preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 260,
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  display: "block",
                  background: "var(--surface)",
                }}
              />
              <p
                className="font-mono2"
                style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}
              >
                {file.name} · {formatBytes(file.size)}
              </p>
            </div>
            <div>
              <span className="field-label">Extracted text</span>
              {phase === "working" ? (
                <div className="result-box" style={{ padding: 20 }}>
                  <p style={{ fontWeight: 700, marginBottom: 10 }}>{status}</p>
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress * 100)}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: 999,
                      height: 22,
                      overflow: "hidden",
                      background: "var(--surface)",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.round(progress * 100)}%`,
                        height: "100%",
                        background: "var(--red)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <p
                    className="font-mono2"
                    style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 8 }}
                  >
                    {Math.round(progress * 100)}% — keep this tab open.
                  </p>
                </div>
              ) : result ? (
                <>
                  <textarea
                    className="textarea input input-mono"
                    style={{ minHeight: 220 }}
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    aria-label="Extracted text — editable"
                  />
                  <p
                    className="font-mono2"
                    style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 8 }}
                  >
                    {result.length.toLocaleString()} characters · {wordCount.toLocaleString()}{" "}
                    words — edit freely, then copy.
                  </p>
                </>
              ) : (
                <div
                  className="result-box"
                  style={{
                    minHeight: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    Press <strong>Extract text</strong> and the recognized words appear here,
                    ready to edit and copy.
                  </p>
                </div>
              )}

              <div
                style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}
              >
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={extract}
                  disabled={phase === "working"}
                >
                  {phase === "working"
                    ? "Reading…"
                    : result
                      ? "Extract again"
                      : "Extract text"}
                </button>
                {result && phase !== "working" && (
                  <>
                    <button type="button" className="btn btn-sm" onClick={copyResult}>
                      {copied ? "Copied!" : "Copy text"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => {
                        setResult("");
                        setPhase("idle");
                      }}
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
              <strong>Heads up:</strong> {error}
            </div>
          )}

          {phase === "done" && result && (
            <div className="notice notice-ok" style={{ marginTop: 16 }}>
              <strong>Text extracted.</strong> Proofread before using it anywhere important — OCR
              can misread blurry, stylized, or handwritten text.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
