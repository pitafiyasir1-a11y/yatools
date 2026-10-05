"use client";

import { useState } from "react";

const RATIOS = [
  { value: "1:1", label: "1:1 — Square (posts, profile)" },
  { value: "16:9", label: "16:9 — Widescreen (thumbnails, slides)" },
  { value: "9:16", label: "9:16 — Vertical (reels, stories)" },
  { value: "4:3", label: "4:3 — Classic photo" },
  { value: "3:4", label: "3:4 — Portrait" },
  { value: "2:1", label: "2:1 — Panorama" },
  { value: "1:2", label: "1:2 — Tall banner" },
  { value: "3:2", label: "3:2 — Photo print" },
  { value: "2:3", label: "2:3 — Poster" },
  { value: "4:5", label: "4:5 — Portrait post" },
  { value: "5:4", label: "5:4 — Landscape post" },
];

const MAX_PROMPT = 500;

type Status = "idle" | "loading" | "ready" | "error";

export default function AiImageClient() {
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [viaFallback, setViaFallback] = useState(false);

  const generate = async () => {
    const p = prompt.trim();
    if (!p) {
      setStatus("error");
      setError("Describe the image you want first.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/v1/tti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p, ratio }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.ok === false) {
        throw new Error(
          data?.error?.message || "Image generation failed. Please try again."
        );
      }
      setImageUrl(data.data.imageUrl);
      setViaFallback(Boolean(data.fallbackUsed));
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(
        e instanceof Error
          ? e.message
          : "Image generation failed. Please try again."
      );
    }
  };

  const download = async () => {
    if (!imageUrl) return;
    try {
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error("download fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "yatools-ai-image.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch {
      // direct download blocked (cross-origin) — open the full image instead
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    }
  };

  const busy = status === "loading";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="neu-card p-6 md:p-8">
        <div className="flex items-end justify-between mb-2">
          <label className="neu-label !mb-0" htmlFor="ai-prompt">
            Describe your image
          </label>
          <span
            className="font-mono2 text-xs"
            style={{ color: "var(--muted)" }}
          >
            {prompt.length}/{MAX_PROMPT}
          </span>
        </div>
        <textarea
          id="ai-prompt"
          className="neu-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, MAX_PROMPT))}
          placeholder="A cozy mountain cabin at dusk, warm lights in the windows, snow falling, cinematic style…"
          rows={5}
        />

        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="neu-label" htmlFor="ai-ratio">
              Aspect ratio
            </label>
            <select
              id="ai-ratio"
              className="neu-select"
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
            >
              {RATIOS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="neu-btn neu-btn-primary w-full"
              onClick={generate}
              disabled={busy}
            >
              {busy ? "Generating…" : "Generate image"}
            </button>
          </div>
        </div>

        {status === "loading" && (
          <div className="result-box mt-6 text-center">
            <p className="font-bold">Generating… (up to ~45s)</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              AI image generation takes a little while — please keep this tab
              open.
            </p>
          </div>
        )}

        {status === "error" && error && (
          <div className="notice notice-warn mt-6">
            <strong>Something went wrong.</strong> {error}
          </div>
        )}
      </div>

      {status === "ready" && imageUrl && (
        <div className="neu-card p-4 md:p-5 mt-6">
          <img
            src={imageUrl}
            alt={prompt.trim() || "AI generated image"}
            className="w-full rounded-lg border-2"
            style={{ borderColor: "var(--ink)" }}
          />
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
            <div className="flex flex-wrap gap-3">
              <button className="neu-btn neu-btn-primary" onClick={download}>
                Download
              </button>
              <button
                className="neu-btn"
                onClick={generate}
                disabled={busy}
              >
                New variation
              </button>
            </div>
            {viaFallback && (
              <span className="neu-badge neu-badge-green self-start sm:self-auto">
                Pollinations fallback
              </span>
            )}
          </div>
          <p
            className="text-xs mt-3"
            style={{ color: "var(--muted)" }}
          >
            AI-generated image — free for personal and commercial use, but it
            may be imperfect. Review details before publishing.
          </p>
        </div>
      )}
    </div>
  );
}
