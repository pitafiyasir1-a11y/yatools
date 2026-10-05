"use client";

import { useEffect, useRef, useState } from "react";

const MAX_BYTES = 10 * 1024 * 1024; // ~10MB soft cap
const MAX_SIDE = 1024; // longest side the AI runs on (see honest note below)
const MODEL_JSON_URL = "https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-slim@1.0.0/models/x2/model.json";
const MODEL_BIN_URL = "https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-slim@1.0.0/models/x2/group1-shard1of1.bin";
const MODEL_BIN_BYTES = 888300;

type Stage = "idle" | "loading" | "warming" | "working" | "done" | "error";

/* ---------- tiny IndexedDB cache: the ~0.9MB model downloads once, then
   lives in the browser (works offline on repeat visits) ---------- */
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("yatools-upscaler", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("models");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbGet(key: string): Promise<ArrayBuffer | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("models", "readonly");
      const rq = tx.objectStore("models").get(key);
      rq.onsuccess = () => resolve((rq.result as ArrayBuffer) ?? null);
      rq.onerror = () => reject(rq.error);
    });
  } catch {
    return null;
  }
}
async function idbSet(key: string, buf: ArrayBuffer): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("models", "readwrite");
      tx.objectStore("models").put(buf, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* private mode etc. — the HTTP cache still helps */
  }
}

async function fetchBytes(
  url: string,
  total: number,
  onBytes: (loaded: number) => void
): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`download failed (${res.status})`);
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    onBytes(loaded);
  }
  const out = new Uint8Array(loaded);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out.buffer;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That file couldn't be read as an image."));
    img.src = url;
  });
}

const FAIL_MESSAGE =
  "Upscaling failed. Next steps: 1) check your internet connection (the first run downloads the ~0.9 MB AI model), " +
  "2) use a Chromium-based browser like Chrome or Edge, " +
  "3) try a smaller image.";

export default function ImageUpscalerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);
  const [wasDownscaled, setWasDownscaled] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultDims, setResultDims] = useState<{ w: number; h: number } | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [progressLabel, setProgressLabel] = useState("");
  const [progressPct, setProgressPct] = useState<number | null>(null);
  const [progressDetail, setProgressDetail] = useState("");
  const [sliderPos, setSliderPos] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const upscalerRef = useRef<{ upscale: (img: string, opts: { output: "base64"; progress?: (n: number) => void }) => Promise<string>; warmup: () => Promise<void> } | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("That doesn't look like an image — please choose a JPG, PNG, WebP, or similar image file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(
        `That image is ${(f.size / 1048576).toFixed(1)} MB — over the ~10 MB limit. Compress it first (try our Image Compressor) and upload again.`
      );
      return;
    }
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setError(null);
    setResultUrl(null);
    setResultDims(null);
    setStage("idle");
    setProgressLabel("");
    setProgressPct(null);
    setProgressDetail("");
    setSliderPos(50);
    setFile(f);
    setOriginalUrl(URL.createObjectURL(f));
    setOriginalDims(null);
    setWasDownscaled(false);
    loadImage(URL.createObjectURL(f)).then((img) => {
      URL.revokeObjectURL(img.src);
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
    }).catch(() => undefined);
  };

  /** Download (or reuse from cache) the AI model, with honest progress.
   *
   *  The model lives in /public and is loaded by TensorFlow.js from its plain
   *  URL — tfjs always resolves weight files relative to the model.json URL,
   *  so no blob-URL tricks. The prefetch below warms the browser HTTP cache,
   *  making the actual tfjs load instant; IndexedDB remembers that the model
   *  was already downloaded so repeat visits skip the progress bar entirely.
   */
  const ensureModel = async (): Promise<void> => {
    if (upscalerRef.current) return;
    setProgressLabel("Downloading AI model…");
    setProgressPct(null);
    setProgressDetail("");
    const cachedJson = await idbGet("esrgan-slim-x2/model.json");
    const cachedBin = await idbGet("esrgan-slim-x2/weights.bin");
    if (!cachedJson || !cachedBin) {
      let jsonLoaded = 0;
      let binLoaded = 0;
      const report = () => {
        const total = 12336 + MODEL_BIN_BYTES;
        const loaded = jsonLoaded + binLoaded;
        setProgressPct(Math.round((loaded / total) * 100));
        setProgressDetail(`${(loaded / 1048576).toFixed(1)} / ${(total / 1048576).toFixed(1)} MB`);
      };
      const [j, b] = await Promise.all([
        fetchBytes(MODEL_JSON_URL, 12336, (n) => { jsonLoaded = n; report(); }),
        fetchBytes(MODEL_BIN_URL, MODEL_BIN_BYTES, (n) => { binLoaded = n; report(); }),
      ]);
      await Promise.all([
        idbSet("esrgan-slim-x2/model.json", j),
        idbSet("esrgan-slim-x2/weights.bin", b),
      ]);
    } else {
      setProgressDetail("loaded from browser cache");
    }
    // Dynamic imports keep TensorFlow.js (~MBs) out of the initial bundle.
    // The explicit top-level `path` makes UpscalerJS load our self-hosted
    // model instead of resolving it from their CDN.
    const [{ default: Upscaler }, { default: esrganSlimX2 }] = await Promise.all([
      import("upscaler"),
      import("@upscalerjs/esrgan-slim/2x"),
    ]);
    const upscaler = new Upscaler({
      model: { ...esrganSlimX2, path: MODEL_JSON_URL },
    });
    upscalerRef.current = upscaler as unknown as typeof upscalerRef.current;
    setStage("warming");
    setProgressLabel("Warming up the AI…");
    setProgressPct(null);
    setProgressDetail("one-time setup, a few seconds");
    await upscaler.warmup();
  };

  const process = async () => {
    if (!file || !originalUrl || busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setStage("loading");
    setProgressPct(null);
    setProgressDetail("");
    try {
      await ensureModel();
      // Cap the longest side for speed — the AI still outputs a true 2x
      // of whatever it receives. Honest note shown below the result.
      let inputUrl = originalUrl;
      let inputW = 0;
      let inputH = 0;
      const img = await loadImage(originalUrl);
      inputW = img.naturalWidth;
      inputH = img.naturalHeight;
      let downscaled = false;
      const longSide = Math.max(inputW, inputH);
      if (longSide > MAX_SIDE) {
        const scale = MAX_SIDE / longSide;
        inputW = Math.round(inputW * scale);
        inputH = Math.round(inputH * scale);
        const canvas = document.createElement("canvas");
        canvas.width = inputW;
        canvas.height = inputH;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Your browser couldn't start the canvas engine.");
        ctx.drawImage(img, 0, 0, inputW, inputH);
        const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
        if (!blob) throw new Error("Couldn't prepare the image.");
        inputUrl = URL.createObjectURL(blob);
        downscaled = true;
      }
      setWasDownscaled(downscaled);
      setStage("working");
      setProgressLabel("Upscaling image…");
      setProgressDetail(`${inputW}×${inputH} → ${inputW * 2}×${inputH * 2}`);
      const base64 = await upscalerRef.current!.upscale(inputUrl, {
        output: "base64",
        progress: (amount: number) => setProgressPct(Math.round(amount * 100)),
      });
      if (downscaled) URL.revokeObjectURL(inputUrl);
      const res = await fetch(base64);
      const blob = await res.blob();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultDims({ w: inputW * 2, h: inputH * 2 });
      setStage("done");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
    } catch (e) {
      setStage("error");
      setProgressLabel("");
      setProgressPct(null);
      setProgressDetail("");
      setError(e instanceof Error && e.message !== FAIL_MESSAGE ? `${FAIL_MESSAGE} (Details: ${e.message})` : FAIL_MESSAGE);
    } finally {
      busyRef.current = false;
    }
  };

  const downloadName = file
    ? `${file.name.replace(/\.[^.]+$/, "") || "image"}-2x.png`
    : "upscaled-2x.png";

  const busy = stage === "loading" || stage === "warming" || stage === "working";

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()}>
          {file ? "Choose a different image" : "Choose image"}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={process}
          disabled={!file || busy}
        >
          {busy ? "Working…" : "Upscale 2x"}
        </button>
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
            Drop in a photo
          </div>
          <p style={{ fontSize: "0.92rem" }}>
            JPG, PNG, WebP — up to ~10MB. First run downloads the AI model
            (~0.9 MB) — once, then it&apos;s cached in your browser. Later runs are instant.
          </p>
        </div>
      )}

      {busy && (
        <div className="notice" style={{ marginBottom: 16 }} aria-live="polite">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <strong>{progressLabel}</strong>
            {progressPct !== null && (
              <span className="font-mono2" style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                {progressDetail ? `${progressDetail} (${progressPct}%)` : `${progressPct}%`}
              </span>
            )}
          </div>
          <div
            style={{ height: 14, border: "1px solid var(--line)", borderRadius: 8, marginTop: 10, overflow: "hidden", background: "var(--surface2)" }}
          >
            <div
              style={{
                height: "100%",
                width: progressPct !== null ? `${progressPct}%` : "45%",
                background: "var(--red)",
                borderRadius: 6,
                transition: "width 0.3s ease",
                animation: progressPct !== null ? undefined : "iu-slide 1.2s ease-in-out infinite",
              }}
            />
          </div>
          <style>{`@keyframes iu-slide { 0% { transform: translateX(-100%);} 100% { transform: translateX(220%);} }`}</style>
          {stage === "loading" && (
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
              First run downloads the AI model (~0.9 MB) — once, then it&apos;s cached
              in your browser. Later runs skip this step.
            </p>
          )}
        </div>
      )}

      {originalUrl && (
        <>
          <p className="field-label">
            Before / after — drag the slider
            {originalDims && (
              <span style={{ color: "var(--muted)", fontWeight: 400 }}>
                {" "}· original {originalDims.w}×{originalDims.h}
                {resultDims && ` → upscaled ${resultDims.w}×${resultDims.h}`}
              </span>
            )}
          </p>
          <div
            className="card"
            style={{ padding: 10, position: "relative", overflow: "hidden", userSelect: "none" }}
          >
            <div style={{ position: "relative", lineHeight: 0 }}>
              <img
                src={originalUrl}
                alt="Original uploaded image"
                style={{ width: "100%", borderRadius: 8, display: "block" }}
                draggable={false}
              />
              {resultUrl && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                    lineHeight: 0,
                  }}
                >
                  <img
                    src={resultUrl}
                    alt="Upscaled image (2x)"
                    style={{ width: "100%", borderRadius: 8, display: "block" }}
                    draggable={false}
                  />
                  <span
                    className="font-mono2"
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "rgba(0,0,0,0.65)",
                      color: "#fff",
                      fontSize: "0.72rem",
                      padding: "4px 10px",
                      borderRadius: 999,
                      lineHeight: 1.4,
                    }}
                  >
                    2x AFTER
                  </span>
                </div>
              )}
              {!resultUrl && (
                <span
                  className="font-mono2"
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    fontSize: "0.72rem",
                    padding: "4px 10px",
                    borderRadius: 999,
                    lineHeight: 1.4,
                  }}
                >
                  BEFORE
                </span>
              )}
              {resultUrl && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: `${sliderPos}%`,
                      width: 3,
                      background: "var(--red)",
                      transform: "translateX(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    aria-label="Comparison slider: drag to compare before and after"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "ew-resize",
                      margin: 0,
                    }}
                  />
                </>
              )}
            </div>
          </div>
          {!resultUrl && stage !== "working" && stage !== "warming" && stage !== "loading" && (
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 10 }}>
              Press “Upscale 2x” — then drag the slider here to compare before and after.
            </p>
          )}
        </>
      )}

      {resultUrl && stage === "done" && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <a href={resultUrl} download={downloadName} className="btn btn-primary btn-sm">
              Download PNG (2x)
            </a>
            <span className="font-mono2" style={{ fontSize: "0.74rem", color: "var(--text2)" }}>
              AI upscaled · PNG · saved as {downloadName}
            </span>
          </div>
          {wasDownscaled && (
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
              Honest note: your photo was over {MAX_SIDE}px on its long side, so it was
              scaled down to {MAX_SIDE}px first — the AI ran its 2x upscale on that copy.
              The model runs on your device, and full-megapixel images would take several minutes.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="notice" style={{ marginTop: 16 }}>
          {error}
        </div>
      )}
    </div>
  );
}
