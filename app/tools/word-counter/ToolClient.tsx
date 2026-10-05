"use client";

import { useMemo, useState } from "react";

const SAMPLE =
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs!\n\nHow vexingly quick daft zebras jump. Sphinx of black quartz, judge my vow.";

function analyze(text: string) {
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const sentences =
    trimmed === "" ? 0 : trimmed.split(/[.!?…]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs =
    trimmed === "" ? 0 : trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length;
  return { chars, charsNoSpaces, words, sentences, paragraphs, minutes: words / 200 };
}

function readingTime(minutes: number): string {
  if (minutes <= 0) return "—";
  const totalSeconds = Math.round(minutes * 60);
  if (totalSeconds < 60) return `${totalSeconds} sec`;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return s === 0 ? `${m} min` : `${m} min ${s} sec`;
}

export default function WordCounterClient() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const stats = useMemo(() => analyze(text), [text]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const cards: { label: string; value: string; hint: string }[] = [
    { label: "Words", value: stats.words.toLocaleString(), hint: "space-separated tokens" },
    { label: "Characters", value: stats.chars.toLocaleString(), hint: "including spaces" },
    {
      label: "Characters (no spaces)",
      value: stats.charsNoSpaces.toLocaleString(),
      hint: "letters & symbols only",
    },
    { label: "Sentences", value: stats.sentences.toLocaleString(), hint: "split on . ! ? …" },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString(), hint: "blocks split by newlines" },
    { label: "Reading time", value: readingTime(stats.minutes), hint: "at 200 words / minute" },
  ];

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <button type="button" className="neu-btn neu-btn-sm" onClick={() => setText(SAMPLE)}>
          Load sample
        </button>
        <button
          type="button"
          className="neu-btn neu-btn-sm"
          onClick={() => setText("")}
          disabled={!text}
        >
          Clear
        </button>
        <button type="button" className="neu-btn neu-btn-sm" onClick={copy} disabled={!text}>
          {copied ? "Copied!" : "Copy text"}
        </button>
      </div>
      <label className="neu-label" htmlFor="wc-input">
        Your text
      </label>
      <textarea
        id="wc-input"
        className="neu-textarea neu-input-mono"
        style={{ minHeight: 200 }}
        placeholder="Type or paste your text here — counts update live as you type…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12,
          marginTop: 18,
        }}
        aria-live="polite"
      >
        {cards.map((c) => (
          <div
            key={c.label}
            className="neu-card"
            style={{ padding: "14px 16px", boxShadow: "3px 3px 0 var(--ink)" }}
          >
            <div className="font-display" style={{ fontSize: "1.7rem", lineHeight: 1 }}>
              {c.value}
            </div>
            <div
              className="font-mono2"
              style={{
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--red-dark)",
                marginTop: 6,
              }}
            >
              {c.label}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 4 }}>{c.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
