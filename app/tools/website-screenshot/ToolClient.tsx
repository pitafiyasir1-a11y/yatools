"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

function normalizeUrl(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  const withProto = /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

function fileNameFor(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/[^a-z0-9.-]/gi, "-");
    return `screenshot-${host}.png`;
  } catch {
    return "screenshot.png";
  }
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

const HISTORY_KEY = "yatools-websnap-history";
const HISTORY_MAX = 10;

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr)
      ? arr.filter((u): u is string => typeof u === "string").slice(0, HISTORY_MAX)
      : [];
  } catch {
    return [];
  }
}

function saveHistory(items: string[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, HISTORY_MAX)));
  } catch {
    /* storage unavailable — non-fatal */
  }
}

/** Human-readable names for the render services behind /api/v1/websnap. */
function providerLabel(provider: string): string {
  switch (provider) {
    case "ahm7":
      return "ahm7xmakki.com";
    case "microlink":
      return "Microlink";
    case "mshots":
      return "mShots";
    case "thumio":
      return "thum.io";
    default:
      return provider;
  }
}

interface ErrorBody {
  ok?: boolean;
  error?: { code?: string; message?: string };
}

export default function ToolClient() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [capturedUrl, setCapturedUrl] = useState("");
  const [providerInfo, setProviderInfo] = useState<{
    provider: string;
    fallback: boolean;
  } | null>(null);
  const [info, setInfo] = useState<{
    contentType: string;
    sizeBytes: number | null;
  } | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [copiedApi, setCopiedApi] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [imgUrl]);

  async function checkInfo() {
    const target = normalizeUrl(url);
    if (!target) {
      setError("Enter a valid URL, e.g. https://example.com");
      setStatus("error");
      return;
    }
    setInfoLoading(true);
    setInfo(null);
    try {
      const res = await fetch(
        `/api/v1/websnap?url=${encodeURIComponent(target)}&info=1`
      );
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        data?: { contentType?: string; sizeBytes?: number | null };
        error?: { message?: string };
      } | null;
      if (!res.ok || !data || data.ok !== true || !data.data) {
        throw new Error(
          data?.error?.message || "Couldn't check that URL right now."
        );
      }
      setInfo({
        contentType: data.data.contentType || "image/png",
        sizeBytes:
          typeof data.data.sizeBytes === "number" ? data.data.sizeBytes : null,
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Couldn't check that URL right now."
      );
      setStatus("error");
    } finally {
      setInfoLoading(false);
    }
  }

  function apiUrlFor(target: string): string {
    return `/api/v1/websnap?url=${encodeURIComponent(target)}`;
  }

  async function copyApiUrl() {
    if (!capturedUrl) return;
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${apiUrlFor(capturedUrl)}`
      );
      setCopiedApi(true);
      setTimeout(() => setCopiedApi(false), 2000);
    } catch {
      setError("Copy was blocked by the browser — copy the URL manually.");
      setStatus("error");
    }
  }

  function pushHistory(target: string) {
    setHistory((prev) => {
      const next = [target, ...prev.filter((u) => u !== target)].slice(
        0,
        HISTORY_MAX
      );
      saveHistory(next);
      return next;
    });
  }

  function clearHistory() {
    setHistory([]);
    saveHistory([]);
  }

  async function capture() {
    const target = normalizeUrl(url);
    if (!target) {
      setError("Enter a valid URL, e.g. https://example.com");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    setProviderInfo(null);
    setInfo(null);
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl("");
    try {
      const res = await fetch(
        `/api/v1/websnap?url=${encodeURIComponent(target)}`
      );
      const ct = res.headers.get("content-type") || "";
      if (ct.startsWith("image/")) {
        const blob = await res.blob();
        setImgUrl(URL.createObjectURL(blob));
        setCapturedUrl(target);
        setProviderInfo({
          provider: res.headers.get("X-Provider") || "unknown",
          fallback: res.headers.get("X-Fallback-Used") === "1",
        });
        pushHistory(target);
        setStatus("done");
      } else {
        const data = (await res.json().catch(() => null)) as ErrorBody | null;
        throw new Error(
          data?.error?.message ||
            "The screenshot service returned an unexpected response."
        );
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl mb-1">Capture a website</h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Paste any public URL below. The page renders in a real browser and you
        get a full-page PNG.
      </p>

      <label className="field-label" htmlFor="ws-url">
        Page URL
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="ws-url"
          type="url"
          inputMode="url"
          placeholder="https://example.com"
          className="input input-mono flex-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") capture();
          }}
          disabled={status === "loading"}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={capture}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Capturing…" : "Capture"}
        </button>
        <button
          type="button"
          className="btn"
          onClick={checkInfo}
          disabled={status === "loading" || infoLoading}
        >
          {infoLoading ? "Checking…" : "Check file info"}
        </button>
      </div>
      {info && (
        <p
          className="font-mono2 text-xs mt-3"
          style={{ color: "var(--muted)" }}
        >
          Expected output: {info.contentType}
          {info.sizeBytes !== null && ` · about ${formatBytes(info.sizeBytes)}`}
        </p>
      )}
      <p
        className="font-mono2 text-xs mt-3"
        style={{ color: "var(--muted)" }}
      >
        Primary renderer: ahm7xmakki.com · automatic fallbacks: Microlink →
        mShots → thum.io. Your URL is sent to whichever service renders the
        capture.
      </p>

      {status === "loading" && (
        <div className="result-box mt-6 text-center">
          <p className="font-bold">Capturing… (can take ~20s)</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Rendering the page in a real browser. Please keep this tab open.
          </p>
        </div>
      )}

      {status === "error" && error && (
        <div className="notice notice-warn mt-6" role="alert">
          <strong>Capture failed.</strong> {error}
        </div>
      )}

      {status === "done" && imgUrl && (
        <div className="mt-6">
          <div className="result-box !border-solid overflow-hidden !p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt={`Full-page screenshot of ${capturedUrl}`}
              className="w-full rounded-lg"
              style={{ border: "2px solid var(--line)" }}
            />
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <a
              href={imgUrl}
              download={fileNameFor(capturedUrl)}
              className="btn btn-primary"
            >
              Download PNG
            </a>
            <a
              href={imgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Open full size
            </a>
            <button type="button" className="btn" onClick={copyApiUrl}>
              {copiedApi ? "Copied!" : "Copy API URL"}
            </button>
          </div>
          <p
            className="font-mono2 text-xs mt-3 break-all"
            style={{ color: "var(--muted)" }}
          >
            {capturedUrl}
          </p>
          {providerInfo && (
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="badge badge-blue">
                Powered by {providerLabel(providerInfo.provider)}
                {providerInfo.fallback ? " (fallback)" : ""}
              </span>
              <span
                className="font-mono2 text-xs"
                style={{ color: "var(--muted)" }}
              >
                Your URL was sent to {providerLabel(providerInfo.provider)} to
                render this capture.
              </span>
            </div>
          )}
        </div>
      )}

      {status === "idle" && (
        <div className="result-box mt-6 text-center">
          <p style={{ color: "var(--muted)" }}>
            Your screenshot will appear here.
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-xl">Recent captures</h3>
            <button
              type="button"
              className="btn btn-sm"
              onClick={clearHistory}
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <button
                key={h}
                type="button"
                className="tab"
                title={h}
                onClick={() => {
                  setUrl(h);
                }}
              >
                {(() => {
                  try {
                    return new URL(h).hostname;
                  } catch {
                    return h;
                  }
                })()}
              </button>
            ))}
          </div>
          <p
            className="font-mono2 text-xs mt-2"
            style={{ color: "var(--muted)" }}
          >
            Saved in this browser only — click one to load it, then hit
            Capture to re-run.
          </p>
        </div>
      )}
    </div>
  );
}
