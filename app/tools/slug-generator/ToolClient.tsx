"use client";

import { useState } from "react";

type Separator = "-" | "_";

export function slugify(s: string, sep: Separator, maxLen: number): string {
  let t = s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
  // Replace anything that isn't a letter, number, or the chosen separator with it
  t = t.replace(/[^a-z0-9]+/g, sep);
  t = t.replace(new RegExp(`\\${sep}{2,}`, "g"), sep);
  t = t.replace(new RegExp(`^\\${sep}+|\\${sep}+$`, "g"), "");
  if (maxLen > 0) t = t.slice(0, maxLen).replace(new RegExp(`\\${sep}+$`), "");
  return t;
}

export default function SlugClient() {
  const [title, setTitle] = useState("");
  const [sep, setSep] = useState<Separator>("-");
  const [maxLen, setMaxLen] = useState(0);
  const [copied, setCopied] = useState(false);

  const slug = title ? slugify(title, sep, maxLen) : "";

  const copy = async () => {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="card" style={{ padding: 22, marginTop: 24 }}>
      <label className="field-label" htmlFor="slug-in">
        Paste your title or headline
      </label>
      <textarea
        id="slug-in"
        className="textarea"
        rows={3}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setCopied(false);
        }}
        placeholder="10 Best Free Online Tools for Developers in 2026!"
        autoFocus
      />

      <div
        style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end", margin: "14px 0" }}
      >
        <div>
          <span className="field-label">Separator</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className={`tab ${sep === "-" ? "tab-active" : ""}`} onClick={() => setSep("-")}>
              Hyphen (-)
            </button>
            <button className={`tab ${sep === "_" ? "tab-active" : ""}`} onClick={() => setSep("_")}>
              Underscore (_)
            </button>
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="slug-max">
            Max length (0 = no limit)
          </label>
          <input
            id="slug-max"
            type="number"
            min={0}
            max={200}
            className="input"
            style={{ width: 110 }}
            value={maxLen}
            onChange={(e) => setMaxLen(Math.max(0, Number(e.target.value)))}
          />
        </div>
        <button
          className="btn"
          onClick={() => setTitle("10 Best Free Online Tools for Developers in 2026!")}
        >
          Sample
        </button>
      </div>

      <label className="field-label" htmlFor="slug-out">Your slug — updates as you type</label>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        <input
          id="slug-out"
          className="input input-mono"
          readOnly
          value={slug}
          placeholder="your-url-slug-appears-here"
          style={{ flex: 1, fontSize: "1rem" }}
          onFocus={(e) => e.target.select()}
        />
        <button className="btn btn-primary" onClick={copy} disabled={!slug}>
          {copied ? "Copied!" : "Copy slug"}
        </button>
      </div>
      {slug && (
        <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 8 }}>
          example.com/blog/<span className="font-mono2">{slug}</span>
        </p>
      )}
    </div>
  );
}
