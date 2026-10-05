/* Shared single-format audio → MP3 client for the dedicated SEO converter
 * pages (wav-to-mp3-converter, m4a-to-mp3-converter, flac-to-mp3-converter).
 *
 * Pipeline: Web Audio decodeAudioData (browser's own codecs) → LAME MP3
 * encoder, loaded as a classic script from the jsDelivr CDN (the lamejs npm
 * build is broken under bundlers, so we never `import "lamejs"`).
 * Everything runs in the user's browser — no uploads.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { formatBytes } from "../ffmpeg-loader";

const MAX_BYTES = 50 * 1024 * 1024; // ~50MB
const LAME_URL = "https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js";
const BITRATES = [128, 192, 320];

type Stage = "idle" | "loading" | "decoding" | "encoding" | "done" | "error";

interface Mp3Encoder {
  encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
  flush(): Int8Array;
}

export interface AudioMp3Config {
  /** unique prefix for element ids, e.g. "w2m" */
  controlPrefix: string;
  /** "WAV" / "M4A" / "FLAC" */
  inputLabel: string;
  /** file input accept attr, e.g. ".wav,audio/wav" */
  accept: string;
  /** validates the single accepted format, e.g. /\.wav$/i */
  extPattern: RegExp;
  /** shown when the user picks a different format */
  wrongFormatError: string;
  /** drop zone headline, e.g. "Drop in a WAV file" */
  dropTitle: string;
  /** drop zone supporting copy */
  dropHint: string;
  /** shown when the browser can't decode the file */
  decodeHint: string;
  /** optional extra line under the drop zone (browser caveats) */
  caveat?: string;
}

function loadLame(): Promise<{
  Mp3Encoder: new (channels: number, sampleRate: number, kbps: number) => Mp3Encoder;
}> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as {
      lamejs?: {
        Mp3Encoder: new (channels: number, sampleRate: number, kbps: number) => Mp3Encoder;
      };
    };
    if (w.lamejs?.Mp3Encoder) {
      resolve(w.lamejs);
      return;
    }
    const s = document.createElement("script");
    s.src = LAME_URL;
    s.async = true;
    s.onload = () => {
      if (w.lamejs?.Mp3Encoder) resolve(w.lamejs);
      else reject(new Error("The MP3 encoder didn't start correctly."));
    };
    s.onerror = () =>
      reject(
        new Error(
          "Couldn't load the MP3 encoder (~150 KB) — check your connection and try again."
        )
      );
    document.head.appendChild(s);
  });
}

function floatTo16(f: Float32Array): Int16Array {
  const out = new Int16Array(f.length);
  for (let i = 0; i < f.length; i++) {
    const v = Math.max(-1, Math.min(1, f[i]));
    out[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
  }
  return out;
}

export default function AudioMp3Client({ config }: { config: AudioMp3Config }) {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState(192);
  const [stage, setStage] = useState<Stage>("idle");
  const [progressLabel, setProgressLabel] = useState("");
  const [progressPct, setProgressPct] = useState<number | null>(null);
  const [result, setResult] = useState<{
    url: string;
    name: string;
    size: number;
    info: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const reset = () => {
    if (result) URL.revokeObjectURL(result.url);
    if (inputRef.current) inputRef.current.value = "";
    setFile(null);
    setResult(null);
    setError(null);
    setStage("idle");
    setProgressPct(null);
    setProgressLabel("");
  };

  const pickFile = (f: File | null) => {
    if (!f) return;
    if (!config.extPattern.test(f.name)) {
      setError(config.wrongFormatError);
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(`That file is ${formatBytes(f.size)} — over the ~50 MB limit.`);
      return;
    }
    if (result) URL.revokeObjectURL(result.url);
    setError(null);
    setResult(null);
    setStage("idle");
    setProgressPct(null);
    setFile(f);
  };

  const process = async () => {
    if (!file || busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setResult(null);
    try {
      setStage("loading");
      setProgressLabel("Loading MP3 encoder…");
      setProgressPct(null);
      const { Mp3Encoder } = await loadLame();

      setStage("decoding");
      setProgressLabel(`Reading your ${config.inputLabel} file…`);
      const raw = await file.arrayBuffer();
      // OfflineAudioContext avoids autoplay-policy issues; decoding uses the
      // browser's own codecs (M4A works in Chrome/Edge/Safari, not Firefox).
      const ctx = new OfflineAudioContext(1, 1, 44100);
      let audio: AudioBuffer;
      try {
        audio = await ctx.decodeAudioData(raw.slice(0));
      } catch {
        throw new Error(config.decodeHint);
      }

      setStage("encoding");
      setProgressLabel("Encoding MP3…");
      const channels = Math.min(2, audio.numberOfChannels);
      const sampleRate = audio.sampleRate;
      const left = floatTo16(audio.getChannelData(0));
      const right = channels > 1 ? floatTo16(audio.getChannelData(1)) : undefined;
      const encoder = new Mp3Encoder(channels, sampleRate, bitrate);
      const chunks: Uint8Array[] = [];
      const BLOCK = 1152;
      const total = left.length;
      for (let i = 0; i < total; i += BLOCK) {
        const l = left.subarray(i, i + BLOCK);
        const r = right ? right.subarray(i, i + BLOCK) : undefined;
        const data = channels === 1 ? encoder.encodeBuffer(l) : encoder.encodeBuffer(l, r);
        if (data.length > 0) chunks.push(new Uint8Array(data));
        if (i % (BLOCK * 40) === 0) {
          setProgressPct(Math.round((i / total) * 100));
          // Let the UI breathe on long files.
          await new Promise((r) => setTimeout(r, 0));
        }
      }
      const tail = encoder.flush();
      if (tail.length > 0) chunks.push(new Uint8Array(tail));
      const size = chunks.reduce((a, c) => a + c.length, 0);
      const mp3 = new Uint8Array(size);
      let off = 0;
      for (const c of chunks) {
        mp3.set(c, off);
        off += c.length;
      }
      const blob = new Blob([mp3.buffer as ArrayBuffer], { type: "audio/mpeg" });
      if (result) URL.revokeObjectURL(result.url);
      const base = file.name.replace(/\.[^.]+$/, "") || "audio";
      const mins = Math.floor(audio.duration / 60);
      const secs = Math.round(audio.duration % 60);
      setResult({
        url: URL.createObjectURL(blob),
        name: `${base}.mp3`,
        size: blob.size,
        info: `${channels === 1 ? "mono" : "stereo"} · ${sampleRate} Hz · ${bitrate} kbps · ${
          mins > 0 ? `${mins}m ` : ""
        }${secs}s`,
      });
      setStage("done");
      setProgressLabel("");
      setProgressPct(null);
    } catch (e) {
      setStage("error");
      setProgressLabel("");
      setProgressPct(null);
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      busyRef.current = false;
    }
  };

  const busy = stage === "loading" || stage === "decoding" || stage === "encoding";
  const bitrateId = `${config.controlPrefix}-bitrate`;

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        style={{ display: "none" }}
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />
      {!file && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className="card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            borderStyle: "dashed",
            color: "var(--muted)",
          }}
        >
          <div
            className="font-display"
            style={{ fontSize: "1.6rem", marginBottom: 8, color: "var(--text2)" }}
          >
            {config.dropTitle}
          </div>
          <p style={{ fontSize: "0.92rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
            {config.dropHint}
          </p>
          {config.caveat && (
            <p style={{ fontSize: "0.82rem", marginTop: 10, color: "var(--muted)" }}>
              {config.caveat}
            </p>
          )}
        </div>
      )}

      {file && (
        <div>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 16,
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              Choose a different file
            </button>
            <label className="field-label" style={{ margin: 0 }} htmlFor={bitrateId}>
              Quality
            </label>
            <select
              id={bitrateId}
              className="input"
              style={{ width: "auto", padding: "6px 10px" }}
              value={bitrate}
              onChange={(e) => {
                setBitrate(Number(e.target.value));
                setResult(null);
              }}
              disabled={busy}
            >
              {BITRATES.map((b) => (
                <option key={b} value={b}>
                  {b} kbps
                  {b === 128
                    ? " — smallest file"
                    : b === 192
                      ? " — good for music"
                      : " — best quality"}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={process}
              disabled={busy}
            >
              {busy ? "Working…" : result ? "Convert again" : "Convert to MP3"}
            </button>
            <button type="button" className="btn btn-sm" onClick={reset} disabled={busy}>
              Start over
            </button>
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            <span className="font-mono2">{file.name}</span> · {formatBytes(file.size)}
          </p>
        </div>
      )}

      {busy && (
        <div className="notice" style={{ marginTop: 16 }} aria-live="polite">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "baseline",
            }}
          >
            <strong>{progressLabel}</strong>
            {progressPct !== null && (
              <span className="font-mono2" style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                {progressPct}%
              </span>
            )}
          </div>
          <div
            style={{
              height: 14,
              border: "1px solid var(--line)",
              borderRadius: 8,
              marginTop: 10,
              overflow: "hidden",
              background: "var(--surface2)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: progressPct !== null ? `${progressPct}%` : "45%",
                background: "var(--red)",
                borderRadius: 6,
                transition: "width 0.3s ease",
                animation:
                  progressPct !== null ? undefined : "a2m-slide 1.2s ease-in-out infinite",
              }}
            />
          </div>
          <style>{`@keyframes a2m-slide { 0% { transform: translateX(-100%);} 100% { transform: translateX(220%);} }`}</style>
        </div>
      )}

      {result && stage === "done" && (
        <div style={{ marginTop: 16 }}>
          <p className="field-label">Your MP3</p>
          <audio controls src={result.url} style={{ width: "100%", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <a href={result.url} download={result.name} className="btn btn-primary btn-sm">
              Download MP3
            </a>
            <span className="font-mono2" style={{ fontSize: "0.74rem", color: "var(--text2)" }}>
              {formatBytes(result.size)} · {result.info} · saved as {result.name}
            </span>
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
