"use client";

import { useEffect, useRef, useState } from "react";

const MAX_BYTES = 25 * 1024 * 1024; // tracing is CPU-heavy; keep inputs sane
const MAX_SIDE = 3000; // longest edge cap (downscaled with a notice)

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / 1024 ** i;
  return `${v >= 100 ? v.toFixed(0) : v.toFixed(1)} ${units[i]}`;
}

type Stage = "idle" | "loading" | "tracing" | "done" | "error";

export default function PngToSvgClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number; scaled: boolean } | null>(null);
  const [thresholdAuto, setThresholdAuto] = useState(true);
  const [threshold, setThreshold] = useState(128);
  const [turdSize, setTurdSize] = useState(2);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgMode, setBgMode] = useState<"transparent" | "white">("transparent");
  const [stage, setStage] = useState<Stage>("idle");
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const resultRef = useRef<{ url: string } | null>(null);
  resultRef.current = result;
  const previewRef = useRef<string | null>(null);
  previewRef.current = previewUrl;

  useEffect(() => {
    return () => {
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const pickFile = (f: File | null) => {
    if (!f) return;
    const okType = f.type === "image/png" || /\.png$/i.test(f.name);
    if (!okType) {
      setError("That doesn't look like a PNG — please choose a .png file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(
        `That PNG is ${formatBytes(f.size)} — over the 25 MB tracing limit. Compress it first (try our Image Compressor), then trace it.`
      );
      return;
    }
    if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    setError(null);
    setResult(null);
    setStage("idle");
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    // Read dimensions up front (also the downscale gate).
    const img = new Image();
    img.onload = () => {
      const long = Math.max(img.naturalWidth, img.naturalHeight);
      setDims({
        w: img.naturalWidth,
        h: img.naturalHeight,
        scaled: long > MAX_SIDE,
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      setError("That file couldn't be read as a PNG — it may be corrupted.");
      setFile(null);
      setPreviewUrl(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const trace = async () => {
    if (!file || !dims || busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setResult(null);
    try {
      setStage("loading");
      // Downscale oversized images through canvas first — tracing a 6000px
      // photo is slow and pointless (vectors scale up perfectly anyway).
      let buf: ArrayBuffer;
      if (dims.scaled) {
        const bmp = await createImageBitmap(file);
        const long = Math.max(bmp.width, bmp.height);
        const k = MAX_SIDE / long;
        const w = Math.round(bmp.width * k);
        const h = Math.round(bmp.height * k);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas-unavailable");
        ctx.drawImage(bmp, 0, 0, w, h);
        bmp.close();
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
        if (!blob) throw new Error("canvas-unavailable");
        buf = await blob.arrayBuffer();
      } else {
        buf = await file.arrayBuffer();
      }
      const jimpMod = await import("jimp");
      const potraceMod = await import("potrace");
      const JimpCtor = (jimpMod as unknown as { default?: unknown }).default ?? jimpMod;
      const Jimp = JimpCtor as {
        read(data: ArrayBuffer): Promise<{
          bitmap: { width: number; height: number };
          scan(x: number, y: number, w: number, h: number, cb: (x: number, y: number, idx: number) => void): void;
        }>;
      };
      const { Potrace } = potraceMod as unknown as {
        Potrace: new (opts: Record<string, unknown>) => {
          loadImage(t: unknown, cb: (e: Error | null) => void): void;
          getSVG(): string;
        };
      };

      setStage("tracing");
      const img = await Jimp.read(buf);

      const p = new Potrace({
        threshold: thresholdAuto ? -1 : threshold,
        turdSize,
        optCurve: true,
        color: fgColor,
        background: bgMode === "white" ? "#ffffff" : "transparent",
        blackOnWhite: true,
      });
      await new Promise<void>((resolve, reject) => {
        p.loadImage(img, (err) => (err ? reject(err) : resolve()));
      });
      const svg = p.getSVG();
      const clean = svg.trimStart();
      if (!clean.startsWith("<svg") || !clean.includes("<path")) {
        throw new Error("trace-empty");
      }
      const blob = new Blob([svg], { type: "image/svg+xml" });
      if (resultRef.current) URL.revokeObjectURL(resultRef.current.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "traced";
      setResult({
        url: URL.createObjectURL(blob),
        name: `${base}.svg`,
        size: blob.size,
      });
      setStage("done");
    } catch (e) {
      setStage("error");
      const code = e instanceof Error ? e.message : "";
      setError(
        code === "trace-empty"
          ? "Tracing produced an empty result — your image may be a solid color or too faint for the threshold. Try manual threshold instead of auto."
          : code === "canvas-unavailable"
            ? "Your browser couldn't start the canvas engine — try a Chromium-based browser."
            : "Tracing failed in this browser — the PNG may be corrupted, or the tracing engine couldn't start. Try a smaller or simpler image."
      );
    } finally {
      busyRef.current = false;
    }
  };

  const busy = stage === "loading" || stage === "tracing";

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept=".png,image/png"
        style={{ display: "none" }}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />

      <div
        className="notice"
        style={{ borderColor: "var(--red)", marginBottom: 18 }}
        role="note"
      >
        <strong>Best for logos, icons and simple graphics with flat colors</strong> — NOT for
        photos. This traces your image into a single-color vector; traced photos come out
        posterized and the files get huge.
      </div>

      {!file && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className="card"
          style={{ padding: "48px 24px", textAlign: "center", cursor: "pointer", borderStyle: "dashed", color: "var(--muted)" }}
        >
          <div className="font-display" style={{ fontSize: "1.6rem", marginBottom: 8, color: "var(--text2)" }}>
            Drop in a PNG
          </div>
          <p style={{ fontSize: "0.92rem" }}>
            Logos, icons, line art — up to 25MB. The tracing engine loads on first use.
            Your file never leaves this browser.
          </p>
        </div>
      )}

      {file && dims && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
              Choose a different PNG
            </button>
            <span className="font-mono2" style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              {file.name.length > 40 ? `${file.name.slice(0, 37)}…` : file.name} · {dims.w}×{dims.h}px ·{" "}
              {formatBytes(file.size)}
            </span>
          </div>
          {dims.scaled && (
            <div className="notice" style={{ marginBottom: 14 }}>
              Your image is {dims.w}×{dims.h}px — it will be downscaled to a {MAX_SIDE}px
              longest edge before tracing. Tracing full-resolution photos is slow and
              pointless; vectors scale up perfectly anyway.
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              alignItems: "start",
              marginBottom: 18,
            }}
          >
            <div>
              <span className="field-label">Original PNG</span>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="PNG to trace"
                  style={{ maxWidth: "100%", maxHeight: 200, border: "1px solid var(--line)", borderRadius: 12, background: "#fff" }}
                />
              )}
            </div>
            <div>
              <div style={{ marginBottom: 16 }}>
                <span className="field-label">Detail threshold</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }} role="group" aria-label="Threshold mode">
                  <button
                    type="button"
                    className={`btn btn-sm${thresholdAuto ? " btn-primary" : ""}`}
                    aria-pressed={thresholdAuto}
                    disabled={busy}
                    onClick={() => {
                      setThresholdAuto(true);
                      setResult(null);
                    }}
                  >
                    Auto (recommended)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm${!thresholdAuto ? " btn-primary" : ""}`}
                    aria-pressed={!thresholdAuto}
                    disabled={busy}
                    onClick={() => {
                      setThresholdAuto(false);
                      setResult(null);
                    }}
                  >
                    Manual
                  </button>
                </div>
                {!thresholdAuto && (
                  <>
                    <input
                      type="range"
                      min={1}
                      max={254}
                      value={threshold}
                      disabled={busy}
                      onChange={(e) => {
                        setThreshold(Number(e.target.value));
                        setResult(null);
                      }}
                      style={{ width: "100%", accentColor: "var(--red)" }}
                      aria-label={`Threshold ${threshold}`}
                    />
                    <p className="font-mono2" style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                      threshold {threshold} — lower keeps only the darkest pixels
                    </p>
                  </>
                )}
                {thresholdAuto && (
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5 }}>
                    Auto-picks the black/white cutoff. Switch to manual if faint lines disappear
                    or the background gets traced.
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="field-label" htmlFor="pts-turd">
                  Ignore specks smaller than {turdSize}px
                </label>
                <input
                  id="pts-turd"
                  type="range"
                  min={0}
                  max={20}
                  value={turdSize}
                  disabled={busy}
                  onChange={(e) => {
                    setTurdSize(Number(e.target.value));
                    setResult(null);
                  }}
                  style={{ width: "100%", accentColor: "var(--red)" }}
                />
                <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  Cleans up JPEG-ish noise and dust. Higher values smooth more — too high and
                  small details (like dots on an “i”) vanish.
                </p>
              </div>

              <div style={{ marginBottom: 16, display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div>
                  <label className="field-label" htmlFor="pts-fg">
                    Trace color
                  </label>
                  <input
                    id="pts-fg"
                    type="color"
                    value={fgColor}
                    disabled={busy}
                    onChange={(e) => {
                      setFgColor(e.target.value);
                      setResult(null);
                    }}
                    style={{ width: 44, height: 36, padding: 2, border: "1px solid var(--line)", borderRadius: 8, background: "var(--surface)", cursor: "pointer" }}
                  />
                </div>
                <div>
                  <span className="field-label">Background</span>
                  <div style={{ display: "flex", gap: 8 }} role="group" aria-label="Background">
                    {(["transparent", "white"] as const).map((b) => (
                      <button
                        key={b}
                        type="button"
                        className={`btn btn-sm${bgMode === b ? " btn-primary" : ""}`}
                        aria-pressed={bgMode === b}
                        disabled={busy}
                        onClick={() => {
                          setBgMode(b);
                          setResult(null);
                        }}
                      >
                        {b === "transparent" ? "Transparent" : "White"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.5 }}>
                One flat color only — that&apos;s the honest limit of this kind of tracing.
                Multi-color logos need a paid vectorizer.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" className="btn btn-primary" onClick={trace} disabled={busy}>
              {busy ? (stage === "loading" ? "Loading tracer…" : "Tracing…") : result ? "Trace again" : "Trace to SVG"}
            </button>
            {result && (
              <a href={result.url} download={result.name} className="btn">
                Download {result.name}
              </a>
            )}
          </div>
        </div>
      )}

      {busy && (
        <div className="notice" style={{ marginTop: 16 }} aria-live="polite">
          <strong>{stage === "loading" ? "Loading the tracing engine…" : "Tracing your image…"}</strong>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 6 }}>
            {stage === "loading"
              ? "First use downloads the tracer (a one-time load); then it's instant for the rest of your visit."
              : "Tracing walks every pixel edge — complex images can take a few seconds. Keep this tab open."}
          </p>
        </div>
      )}

      {result && stage === "done" && file && (
        <div className="notice notice-ok" style={{ marginTop: 16 }}>
          <strong>Traced.</strong>{" "}
          <span className="font-mono2">
            {formatBytes(file.size)} PNG → {formatBytes(result.size)} SVG
          </span>
          {result.size > file.size && (
            <> — the SVG is bigger than the PNG, which is normal for detailed traces: vectors store shapes, not pixels.</>
          )}
          <div style={{ marginTop: 12 }}>
            <span className="field-label">Vector preview (scales forever)</span>
            <img
              src={result.url}
              alt="Traced SVG preview"
              style={{ maxWidth: "100%", maxHeight: 240, border: "1px solid var(--line)", borderRadius: 12, background: "#fff", display: "block" }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="notice" style={{ marginTop: 16, borderColor: "var(--red)" }}>
          <strong>Heads up:</strong> {error}
        </div>
      )}
    </div>
  );
}
