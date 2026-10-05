"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "loading" | "done" | "error";
type Mode = "upload" | "youtube" | "dictate";

const MAX_BYTES = 25 * 1024 * 1024;

const LANGUAGES = [
  { value: "auto", label: "Auto-detect" },
  { value: "en", label: "English" },
  { value: "ur", label: "Urdu" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

const DICTATE_LANGS = [
  { value: "en-US", label: "English (US)" },
  { value: "ur-PK", label: "Urdu (Pakistan)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "ar-SA", label: "Arabic" },
  { value: "hi-IN", label: "Hindi" },
];

/* Minimal structural typing for the Web Speech API (Chrome/Edge only). */
interface RecResultItem {
  transcript: string;
}
interface RecResult {
  isFinal: boolean;
  length: number;
  [index: number]: RecResultItem;
}
interface RecEvent {
  results: { length: number; [index: number]: RecResult };
}
interface RecInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: RecEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type RecCtor = new () => RecInstance;

declare global {
  interface Window {
    SpeechRecognition?: RecCtor;
    webkitSpeechRecognition?: RecCtor;
  }
}

function getSpeechRecognition(): RecCtor | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

interface TranscribeOk {
  ok: true;
  data: { text: string; language?: string; model?: string; srt?: string };
}
interface TranscribeErr {
  ok: false;
  error?: { code?: string; message?: string };
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Could not read the file."));
    r.readAsDataURL(file);
  });
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 500);
}

export default function ToolClient() {
  const [mode, setMode] = useState<Mode>("upload");

  /* ---- upload mode ---- */
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("auto");
  const [model, setModel] = useState<"turbo" | "accurate" | "english">("turbo");
  const [timestamps, setTimestamps] = useState(false);
  const [translate, setTranslate] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    text: string;
    srt?: string;
    language?: string;
    model?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  /* ---- youtube mode ---- */
  const [ytUrl, setYtUrl] = useState("");
  const [ytTranslate, setYtTranslate] = useState(false);
  const [ytStatus, setYtStatus] = useState<Status>("idle");
  const [ytError, setYtError] = useState("");
  const [ytResult, setYtResult] = useState<{
    text: string;
    srt?: string;
    language?: string;
  } | null>(null);

  /* ---- dictate mode ---- */
  const [srSupported, setSrSupported] = useState(false);
  useEffect(() => {
    setSrSupported(getSpeechRecognition() !== null);
  }, []);
  const [listening, setListening] = useState(false);
  const [dictateLang, setDictateLang] = useState("en-US");
  const [dictateText, setDictateText] = useState("");
  const [dictateError, setDictateError] = useState("");
  const recRef = useRef<RecInstance | null>(null);

  useEffect(() => {
    return () => {
      recRef.current?.stop();
    };
  }, []);

  function onFilePicked(f: File | null) {
    setResult(null);
    setError("");
    setStatus("idle");
    if (!f) {
      setFile(null);
      return;
    }
    if (f.size > MAX_BYTES) {
      setFile(null);
      setError(
        `That file is ${(f.size / 1024 / 1024).toFixed(1)} MB — the limit is 25 MB. Try a shorter clip.`
      );
      setStatus("error");
      return;
    }
    setFile(f);
  }

  async function transcribe() {
    if (!file) {
      setError("Choose an audio file first.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    setResult(null);
    try {
      const audio = await readAsDataURL(file);
      const payload: Record<string, string> = {
        audio,
        filename: file.name,
        mime: file.type || "audio/mpeg",
        model,
      };
      if (language !== "auto") payload.language = language;
      if (timestamps) payload.timestamps = "1";
      if (translate) payload.translate = "1";
      const res = await fetch("/api/v1/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as TranscribeOk | TranscribeErr;
      if (!data.ok) {
        const code = data.error?.code;
        if (code === "TRANSCRIBE_TIMEOUT") {
          throw new Error(
            "The audio took too long to process. Split it into shorter clips and transcribe each one."
          );
        }
        throw new Error(data.error?.message || "Transcription failed.");
      }
      setResult({
        text: data.data.text,
        srt: data.data.srt,
        language: data.data.language,
        model: data.data.model,
      });
      setStatus("done");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  }

  async function transcribeYouTube() {
    const url = ytUrl.trim();
    if (!url) {
      setYtError("Paste a YouTube link first.");
      setYtStatus("error");
      return;
    }
    setYtStatus("loading");
    setYtError("");
    setYtResult(null);
    try {
      const payload: Record<string, string> = { youtube: url };
      if (ytTranslate) payload.translate = "1";
      const res = await fetch("/api/v1/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as TranscribeOk | TranscribeErr;
      if (!data.ok) {
        const code = data.error?.code;
        if (code === "TRANSCRIBE_TIMEOUT") {
          throw new Error(
            "The video took too long to process. Try a shorter video."
          );
        }
        throw new Error(data.error?.message || "Transcription failed.");
      }
      setYtResult({
        text: data.data.text,
        srt: data.data.srt,
        language: data.data.language,
      });
      setYtStatus("done");
    } catch (e) {
      setYtError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
      setYtStatus("error");
    }
  }

  async function copyText(text?: string) {
    const t = text ?? result?.text;
    if (!t) return;
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy was blocked by the browser — select the text manually.");
    }
  }

  /* ---- dictation ---- */
  function startDictation() {
    const Ctor = getSpeechRecognition();
    if (!Ctor) return;
    setDictateError("");
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = dictateLang;
    rec.onresult = (e) => {
      let finalChunk = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalChunk += r[0].transcript;
      }
      if (finalChunk) {
        setDictateText((prev) =>
          (prev ? prev + " " : "") + finalChunk.trim()
        );
      }
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setDictateError(
          "Microphone access was blocked. Allow microphone permission and try again."
        );
      } else if (e.error !== "aborted") {
        setDictateError(`Dictation error: ${e.error}`);
      }
      setListening(false);
    };
    rec.onend = () => setListening(false);
    try {
      rec.start();
      recRef.current = rec;
      setListening(true);
    } catch {
      setDictateError("Could not start dictation in this browser.");
    }
  }

  function stopDictation() {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }

  return (
    <div>
      <h2 className="font-display text-3xl mb-1">Transcribe audio</h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Upload a recording, paste a YouTube link, or dictate straight into
        your microphone.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          className={`tab ${mode === "upload" ? "tab-active" : ""}`}
          onClick={() => setMode("upload")}
        >
          Upload file
        </button>
        <button
          type="button"
          className={`tab ${mode === "youtube" ? "tab-active" : ""}`}
          onClick={() => setMode("youtube")}
        >
          YouTube link
        </button>
        {srSupported && (
          <button
            type="button"
            className={`tab ${mode === "dictate" ? "tab-active" : ""}`}
            onClick={() => setMode("dictate")}
          >
            Dictate with microphone
          </button>
        )}
      </div>

      {mode === "upload" && (
        <div>
          <label className="field-label" htmlFor="at-file">
            Audio file (max 25 MB)
          </label>
          <label
            htmlFor="at-file"
            className="btn w-full !justify-start mb-2 cursor-pointer"
          >
            {file ? file.name : "Choose an audio file…"}
          </label>
          <input
            id="at-file"
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac"
            className="hidden"
            onChange={(e) => onFilePicked(e.target.files?.[0] || null)}
          />
          {file && (
            <p className="font-mono2 text-xs mb-4" style={{ color: "var(--muted)" }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "audio"}
            </p>
          )}

          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="field-label" htmlFor="at-lang">
                Language
              </label>
              <select
                id="at-lang"
                className="select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="at-model">
                Model
              </label>
              <select
                id="at-model"
                className="select"
                value={model}
                onChange={(e) =>
                  setModel(e.target.value as "turbo" | "accurate" | "english")
                }
              >
                <option value="turbo">Turbo — fast</option>
                <option value="accurate">Accurate — slower</option>
                <option value="english">English — tuned for English</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={timestamps}
                  onChange={(e) => setTimestamps(e.target.checked)}
                  className="w-5 h-5 accent-[#e0263c]"
                />
                <span className="text-sm font-semibold">
                  Include timestamps (.srt)
                </span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={translate}
                onChange={(e) => setTranslate(e.target.checked)}
                className="w-5 h-5 accent-[#e0263c]"
              />
              <span className="text-sm font-semibold">
                Translate to English
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                Get the transcript in English no matter what language is spoken.
              </span>
            </label>
          </div>

          <button
            type="button"
            className="btn btn-primary mt-6"
            onClick={transcribe}
            disabled={status === "loading" || !file}
          >
            {status === "loading" ? "Transcribing…" : "Transcribe"}
          </button>

          {status === "loading" && (
            <div className="result-box mt-6 text-center">
              <p className="font-bold">Transcribing…</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                This can take a while for longer files. Please keep this tab open.
              </p>
            </div>
          )}

          {status === "error" && error && (
            <div className="notice notice-warn mt-6" role="alert">
              <strong>Transcription failed.</strong> {error}
            </div>
          )}

          {status === "done" && result && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {result.language && (
                  <span className="badge badge-blue">
                    Detected: {result.language}
                  </span>
                )}
                {result.model && (
                  <span
                    className="font-mono2 text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    model: {result.model}
                  </span>
                )}
              </div>
              <div className="result-box !border-solid">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {result.text}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <button type="button" className="btn btn-sm" onClick={() => copyText()}>
                  {copied ? "Copied!" : "Copy text"}
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() =>
                    downloadBlob(result.text, "transcript.txt", "text/plain")
                  }
                >
                  Download .txt
                </button>
                {result.srt && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() =>
                      downloadBlob(result.srt as string, "transcript.srt", "text/plain")
                    }
                  >
                    Download .srt
                  </button>
                )}
              </div>
            </div>
          )}

          {status === "idle" && !error && (
            <div className="result-box mt-6 text-center">
              <p style={{ color: "var(--muted)" }}>
                Your transcript will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {mode === "youtube" && (
        <div>
          <label className="field-label" htmlFor="at-yturl">
            YouTube link
          </label>
          <input
            id="at-yturl"
            type="url"
            inputMode="url"
            className="input input-mono"
            placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…"
            value={ytUrl}
            onChange={(e) => setYtUrl(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
            The video&apos;s audio is fetched and transcribed — only use
            videos you have the right to transcribe.
          </p>

          <div className="mt-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ytTranslate}
                onChange={(e) => setYtTranslate(e.target.checked)}
                className="w-5 h-5 accent-[#e0263c]"
              />
              <span className="text-sm font-semibold">Translate to English</span>
            </label>
          </div>

          <button
            type="button"
            className="btn btn-primary mt-6"
            onClick={transcribeYouTube}
            disabled={ytStatus === "loading" || !ytUrl.trim()}
          >
            {ytStatus === "loading" ? "Transcribing…" : "Transcribe video"}
          </button>

          {ytStatus === "loading" && (
            <div className="result-box mt-6 text-center">
              <p className="font-bold">Fetching & transcribing…</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                This can take a while for longer videos. Please keep this tab
                open.
              </p>
            </div>
          )}

          {ytStatus === "error" && ytError && (
            <div className="notice notice-warn mt-6" role="alert">
              <strong>Transcription failed.</strong> {ytError}
            </div>
          )}

          {ytStatus === "done" && ytResult && (
            <div className="mt-6">
              {ytResult.language && (
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="badge badge-blue">
                    Detected: {ytResult.language}
                  </span>
                </div>
              )}
              <div className="result-box !border-solid">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {ytResult.text}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(ytResult.text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      setYtError(
                        "Copy was blocked by the browser — select the text manually."
                      );
                    }
                  }}
                >
                  {copied ? "Copied!" : "Copy text"}
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() =>
                    downloadBlob(ytResult.text, "transcript.txt", "text/plain")
                  }
                >
                  Download .txt
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "dictate" && srSupported && (
        <div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="at-dlang">
                Dictation language
              </label>
              <select
                id="at-dlang"
                className="select"
                value={dictateLang}
                onChange={(e) => setDictateLang(e.target.value)}
                disabled={listening}
              >
                {DICTATE_LANGS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-3 pb-1">
              {!listening ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={startDictation}
                >
                  Start dictation
                </button>
              ) : (
                <button
                  type="button"
                  className="btn"
                  onClick={stopDictation}
                >
                  Stop
                </button>
              )}
            </div>
          </div>

          <p className="font-mono2 text-xs mt-3" style={{ color: "var(--muted)" }}>
            Uses your browser&apos;s built-in speech recognition — Chrome and
            Edge only, not Firefox. Nothing is uploaded.
          </p>

          {listening && (
            <div className="notice mt-4" role="status">
              <strong>Listening…</strong> speak now, and your words will appear
              below.
            </div>
          )}
          {dictateError && (
            <div className="notice notice-warn mt-4" role="alert">
              {dictateError}
            </div>
          )}

          <label className="field-label mt-6" htmlFor="at-dtext">
            Dictated text
          </label>
          <textarea
            id="at-dtext"
            className="textarea"
            rows={8}
            placeholder="Your dictated words will appear here…"
            value={dictateText}
            onChange={(e) => setDictateText(e.target.value)}
          />
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              className="btn btn-sm"
              disabled={!dictateText}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(dictateText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  setDictateError(
                    "Copy was blocked by the browser — select the text manually."
                  );
                }
              }}
            >
              {copied ? "Copied!" : "Copy text"}
            </button>
            <button
              type="button"
              className="btn btn-sm"
              disabled={!dictateText}
              onClick={() =>
                downloadBlob(dictateText, "dictation.txt", "text/plain")
              }
            >
              Download .txt
            </button>
            <button
              type="button"
              className="btn btn-sm"
              disabled={!dictateText}
              onClick={() => setDictateText("")}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
