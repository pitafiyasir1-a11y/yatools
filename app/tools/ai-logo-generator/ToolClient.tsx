"use client";

import { useState } from "react";

const STYLES = [
  { value: "minimal", label: "Minimal", hint: "minimalist, clean lines, lots of white space, one accent color" },
  { value: "modern", label: "Modern", hint: "modern, sleek, professional, flat vector style" },
  { value: "vintage", label: "Vintage", hint: "vintage, retro, classic badge style, muted colors" },
  { value: "3d", label: "3D", hint: "3D rendered, glossy, dimensional, soft shadows" },
  { value: "mascot", label: "Mascot", hint: "friendly mascot character, playful, bold colors, cartoon style" },
  { value: "hand-drawn", label: "Hand-drawn", hint: "hand-drawn, sketch style, organic lines, artistic" },
];

const MAX_NAME = 60;
const MAX_DESC = 200;

type Status = "idle" | "loading" | "ready" | "error";

export default function AiLogoGeneratorClient() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [style, setStyle] = useState("modern");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generate = async () => {
    const n = name.trim();
    if (!n) {
      setStatus("error");
      setError("Type your business or brand name first.");
      return;
    }
    const s = STYLES.find((x) => x.value === style)!;
    const prompt = `Logo for a business named "${n}"${desc.trim() ? `, ${desc.trim()}` : ""}. ${s.hint} logo, simple, centered on a plain white background, no text other than the brand name if any.`;
    setStatus("loading");
    setError(null);
    try {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;
      // The free image API rate-limits at peak times (HTTP 503, "retry after 10s").
      // Try once, wait 10s, try once more before giving up.
      let check: Response | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        check = await fetch(url);
        if (check.ok) break;
        if (attempt === 0) await new Promise((r) => setTimeout(r, 10000));
      }
      if (!check || !check.ok) throw new Error(`Image service is busy right now (${check?.status ?? "no response"}). Please try again in a moment.`);
      const blob = await check.blob();
      if (!blob.type.startsWith("image/")) throw new Error("The image service returned an invalid response. Please try again.");
      setImageUrl(URL.createObjectURL(blob));
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  const download = async () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "yatools-logo.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const busy = status === "loading";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6 md:p-8">
        <label className="field-label" htmlFor="logo-name">
          Business / brand name
        </label>
        <input
          id="logo-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
          placeholder="Bean & Brew, Nova Fitness, TechNest…"
        />

        <label className="field-label mt-5" htmlFor="logo-desc">
          What does it do? <span style={{ color: "var(--muted)" }}>(optional)</span>
        </label>
        <input
          id="logo-desc"
          className="input"
          value={desc}
          onChange={(e) => setDesc(e.target.value.slice(0, MAX_DESC))}
          placeholder="a coffee shop, a fitness studio, a tech startup…"
        />

        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="field-label" htmlFor="logo-style">
              Logo style
            </label>
            <select
              id="logo-style"
              className="select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {STYLES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn btn-primary w-full" onClick={generate} disabled={busy}>
              {busy ? "Generating…" : "Generate logo"}
            </button>
          </div>
        </div>

        {status === "loading" && (
          <div className="result-box mt-6 text-center">
            <p className="font-bold">Generating your logo… (up to ~30s)</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              AI image generation takes a little while — please keep this tab open.
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
        <div className="card p-4 md:p-5 mt-6">
          <img
            src={imageUrl}
            alt={`AI generated logo for ${name.trim()}`}
            className="w-full rounded-lg border-2"
            style={{ borderColor: "var(--line)" }}
          />
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="btn btn-primary" onClick={download}>
              Download logo
            </button>
            <button className="btn" onClick={generate} disabled={busy}>
              New variation
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            AI-generated logo, 512×512, free with no watermark. Check that it
            does not resemble an existing trademark before using it commercially.
          </p>
        </div>
      )}
    </div>
  );
}
