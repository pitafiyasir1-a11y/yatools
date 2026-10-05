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

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [imgUrl]);

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
      </div>
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
    </div>
  );
}
