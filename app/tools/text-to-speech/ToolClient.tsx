"use client";

import { useEffect, useRef, useState } from "react";

const MAX_CHARS = 12_000; // long text is split into ~900-char chunks client-side
const CHUNK_SIZE = 900;

type Status = "idle" | "loading" | "done" | "error";

/**
 * Split text at sentence boundaries into chunks of ~CHUNK_SIZE characters,
 * mirroring the upstream SpeechSter approach (parallel chunks, MP3 blobs
 * concatenated client-side — MP3 is a stream format, so plain concat works).
 */
function splitText(text: string, max: number): string[] {
  const sentences = text
    .split(/(?<=[.!?…\n])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    if ((current + " " + s).trim().length <= max) {
      current = (current + " " + s).trim();
      continue;
    }
    if (current) chunks.push(current);
    if (s.length <= max) {
      current = s;
    } else {
      // One giant sentence — hard-split it.
      for (let i = 0; i < s.length; i += max) {
        chunks.push(s.slice(i, i + max));
      }
      current = "";
    }
  }
  if (current) chunks.push(current);
  return chunks.length ? chunks : [text];
}

interface ApiVoice {
  index: number;
  name: string;
  gender: string;
  language: string;
}

interface VoicesOk {
  ok: true;
  data: {
    success?: boolean;
    total?: number;
    voices?: ApiVoice[];
    grouped?: Record<string, ApiVoice[]> | ApiVoice[];
  };
}
interface ApiErr {
  ok: false;
  error?: { code?: string; message?: string };
}

function groupVoices(
  voices: ApiVoice[],
  grouped: VoicesOk["data"]["grouped"]
): { label: string; voices: ApiVoice[] }[] {
  if (grouped && typeof grouped === "object" && !Array.isArray(grouped)) {
    const groups = Object.entries(grouped).filter(
      (e): e is [string, ApiVoice[]] => Array.isArray(e[1]) && e[1].length > 0
    );
    if (groups.length > 0)
      return groups.map(([label, vs]) => ({ label, voices: vs }));
  }
  const byLang = new Map<string, ApiVoice[]>();
  for (const v of voices) {
    const key = v.language || "Other";
    if (!byLang.has(key)) byLang.set(key, []);
    byLang.get(key)!.push(v);
  }
  return Array.from(byLang, ([label, vs]) => ({ label, voices: vs }));
}

export default function ToolClient() {
  const [text, setText] = useState("");
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [groups, setGroups] = useState<{ label: string; voices: ApiVoice[] }[]>(
    []
  );
  const [voiceIndex, setVoiceIndex] = useState<number | "">("");
  const [pitch, setPitch] = useState(0);
  const [rate, setRate] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [chunkCount, setChunkCount] = useState(1);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [voicesFailed, setVoicesFailed] = useState(false);

  /* ---- fallback (speechSynthesis) state ---- */
  const [svVoices, setSvVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [svVoiceUri, setSvVoiceUri] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/voices");
        const data = (await res.json()) as VoicesOk | ApiErr;
        if (cancelled) return;
        if (!data.ok) throw new Error(data.error?.message || "Voices failed to load.");
        const voices = data.data.voices || [];
        setGroups(groupVoices(voices, data.data.grouped));
        if (voices.length > 0) setVoiceIndex(voices[0].index);
      } catch {
        if (!cancelled) setVoicesFailed(true);
      } finally {
        if (!cancelled) setVoicesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => {
      const vs = window.speechSynthesis.getVoices();
      setSvVoices(vs);
      if (!svVoiceUri && vs.length > 0) {
        const en = vs.find((v) => v.lang.toLowerCase().startsWith("en"));
        setSvVoiceUri((en || vs[0]).voiceURI);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function generate() {
    if (!text.trim()) {
      setError("Type some text first.");
      setStatus("error");
      return;
    }
    if (voiceIndex === "") {
      setError("Pick a voice first.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl("");
    setChunkCount(1);
    try {
      // Long text: split at sentence boundaries, fire all chunks in
      // parallel, concatenate the MP3 blobs into one file.
      const chunks = splitText(text.trim(), CHUNK_SIZE).slice(0, 30);
      setChunkCount(chunks.length);
      const blobs = await Promise.all(
        chunks.map(async (chunk) => {
          const res = await fetch("/api/v1/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ voiceIndex, text: chunk, pitch, rate }),
          });
          const ct = res.headers.get("content-type") || "";
          if (!ct.startsWith("audio/")) {
            const data = (await res.json().catch(() => null)) as ApiErr | null;
            throw new Error(
              data?.error?.message ||
                "The voice service could not generate audio right now."
            );
          }
          return res.blob();
        })
      );
      const merged = new Blob(blobs, { type: "audio/mpeg" });
      setAudioUrl(URL.createObjectURL(merged));
      setStatus("done");
    } catch (e) {
      setFallbackMode(true);
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  }

  function speakFallback() {
    if (!("speechSynthesis" in window) || !text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = svVoices.find((x) => x.voiceURI === svVoiceUri);
    if (v) u.voice = v;
    u.pitch = Math.min(2, Math.max(0, 1 + pitch / 200));
    u.rate = Math.min(2, Math.max(0.5, 1 + rate / 200));
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  }

  function stopFallback() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  return (
    <div>
      <h2 className="font-display text-3xl mb-1">Turn text into speech</h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Type up to {MAX_CHARS.toLocaleString()} characters, pick a voice, and
        generate an MP3. Long text is split into chunks automatically and
        merged into a single audio file.
      </p>

      {!fallbackMode && (
        <div>
          <div className="flex items-baseline justify-between">
            <label className="field-label" htmlFor="tts-text">
              Your text
            </label>
            <span
              className="font-mono2 text-xs"
              style={{
                color: text.length >= MAX_CHARS ? "var(--red)" : "var(--muted)",
              }}
            >
              {text.length}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            id="tts-text"
            className="textarea"
            rows={7}
            maxLength={MAX_CHARS}
            placeholder="Type or paste the text you want to hear…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            <div>
              <label className="field-label" htmlFor="tts-voice">
                Voice
              </label>
              <select
                id="tts-voice"
                className="select"
                value={voiceIndex}
                onChange={(e) =>
                  setVoiceIndex(e.target.value === "" ? "" : Number(e.target.value))
                }
                disabled={voicesLoading || voicesFailed}
              >
                {voicesLoading && <option value="">Loading voices…</option>}
                {voicesFailed && <option value="">Voices unavailable</option>}
                {!voicesLoading &&
                  !voicesFailed &&
                  groups.map((g) => (
                    <optgroup key={g.label} label={g.label}>
                      {g.voices.map((v) => (
                        <option key={v.index} value={v.index}>
                          {v.name} — {v.gender}
                          {v.language ? ` (${v.language})` : ""}
                        </option>
                      ))}
                    </optgroup>
                  ))}
              </select>
              {voicesFailed && (
                <p className="text-xs mt-2" style={{ color: "var(--red-dark)" }}>
                  Could not load the voice list — browser voice mode is
                  available below.
                </p>
              )}
            </div>
            <div>
              <label className="field-label" htmlFor="tts-pitch">
                Pitch: {pitch}
              </label>
              <input
                id="tts-pitch"
                type="range"
                min={-100}
                max={100}
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full accent-[#e0263c] mt-3"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="tts-rate">
                Speed: {rate}
              </label>
              <input
                id="tts-rate"
                type="range"
                min={-100}
                max={100}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-[#e0263c] mt-3"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              type="button"
              className="btn btn-primary"
              onClick={generate}
              disabled={status === "loading" || voicesLoading}
            >
              {status === "loading" ? "Generating…" : "Generate audio"}
            </button>
            {voicesFailed && (
              <button
                type="button"
                className="btn"
                onClick={() => setFallbackMode(true)}
              >
                Use browser voice
              </button>
            )}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            Daily limit: 30 generations. Long text counts as one generation
            per ~900-character chunk.
          </p>

          {status === "loading" && (
            <div className="result-box mt-6 text-center">
              <p className="font-bold">Generating audio…</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                Synthesizing your text. Long passages are generated in
                parallel chunks, then merged — this usually takes a few
                seconds.
              </p>
            </div>
          )}

          {status === "error" && error && (
            <div className="notice notice-warn mt-6" role="alert">
              <strong>Generation failed.</strong> {error}
            </div>
          )}

          {status === "done" && audioUrl && (
            <div className="mt-6">
              <div className="result-box !border-solid">
                <audio controls src={audioUrl} className="w-full">
                  Your browser does not support audio playback.
                </audio>
              </div>
              {chunkCount > 1 && (
                <p
                  className="font-mono2 text-xs mt-3"
                  style={{ color: "var(--muted)" }}
                >
                  {chunkCount} chunks generated in parallel and merged into
                  one MP3.
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href={audioUrl}
                  download="speech.mp3"
                  className="btn btn-primary"
                >
                  Download MP3
                </a>
              </div>
            </div>
          )}

          {status === "idle" && !error && (
            <div className="result-box mt-6 text-center">
              <p style={{ color: "var(--muted)" }}>
                Your audio will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {fallbackMode && (
        <div>
          <div className="notice notice-warn" role="alert">
            <strong>Browser voice (offline fallback)</strong> — the voice
            service could not generate audio, so your browser will read the
            text aloud instead. No download in this mode.
          </div>

          <label className="field-label mt-6" htmlFor="tts-fb-text">
            Text to read aloud
          </label>
          <textarea
            id="tts-fb-text"
            className="textarea"
            rows={6}
            maxLength={MAX_CHARS}
            placeholder="Type or paste the text…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="field-label" htmlFor="tts-fb-voice">
                Browser voice
              </label>
              <select
                id="tts-fb-voice"
                className="select"
                value={svVoiceUri}
                onChange={(e) => setSvVoiceUri(e.target.value)}
                disabled={svVoices.length === 0}
              >
                {svVoices.length === 0 && (
                  <option value="">No browser voices found</option>
                )}
                {svVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-3 pb-1">
              {!speaking ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={speakFallback}
                  disabled={!text.trim() || svVoices.length === 0}
                >
                  Read aloud
                </button>
              ) : (
                <button type="button" className="btn" onClick={stopFallback}>
                  Stop
                </button>
              )}
              <button
                type="button"
                className="btn"
                onClick={() => {
                  stopFallback();
                  setFallbackMode(false);
                  setStatus("idle");
                  setError("");
                }}
              >
                Try API again
              </button>
            </div>
          </div>

          {speaking && (
            <p className="font-mono2 text-xs mt-3" style={{ color: "var(--muted)" }}>
              Speaking…
            </p>
          )}
        </div>
      )}
    </div>
  );
}
