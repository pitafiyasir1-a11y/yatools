"use client";

import { useMemo, useState } from "react";

type CaseId =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "alternating";

const CASES: { id: CaseId; label: string; example: string }[] = [
  { id: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
  { id: "lower", label: "lowercase", example: "hello world" },
  { id: "title", label: "Title Case", example: "Hello World" },
  { id: "sentence", label: "Sentence case", example: "Hello world" },
  { id: "camel", label: "camelCase", example: "helloWorld" },
  { id: "pascal", label: "PascalCase", example: "HelloWorld" },
  { id: "snake", label: "snake_case", example: "hello_world" },
  { id: "kebab", label: "kebab-case", example: "hello-world" },
  { id: "alternating", label: "aLtErNaTiNg", example: "hElLo WoRlD" },
];

function wordsOf(text: string): string[] {
  return text
    .split(/[^a-zA-Z0-9]+/)
    .filter((w) => w.length > 0);
}

function convert(text: string, id: CaseId): string {
  switch (id) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.toLowerCase().replace(/(^|[\s'"“‘(\[{])(\S)/g, (_, p1: string, p2: string) => p1 + p2.toUpperCase());
    case "sentence": {
      const lowered = text.toLowerCase();
      return lowered.replace(/(^\s*[a-z])|([.!?…]\s*[a-z])/g, (m) => m.toUpperCase());
    }
    case "camel": {
      const w = wordsOf(text);
      return w
        .map((word, i) =>
          i === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");
    }
    case "pascal": {
      const w = wordsOf(text);
      return w.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
    }
    case "snake":
      return wordsOf(text).map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return wordsOf(text).map((w) => w.toLowerCase()).join("-");
    case "alternating": {
      let upper = false;
      return [...text]
        .map((ch) => {
          if (!/[a-zA-Z]/.test(ch)) return ch;
          upper = !upper;
          return upper ? ch.toUpperCase() : ch.toLowerCase();
        })
        .join("");
    }
  }
}

export default function CaseConverterClient() {
  const [text, setText] = useState("");
  const [active, setActive] = useState<CaseId>("title");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => convert(text, active), [text, active]);
  const wordCount = useMemo(
    () => (text.trim() === "" ? 0 : text.trim().split(/\s+/).length),
    [text]
  );

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <label className="neu-label" htmlFor="cc-input">
        Your text
      </label>
      <textarea
        id="cc-input"
        className="neu-textarea"
        style={{ minHeight: 130 }}
        placeholder="Type or paste text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <p className="neu-label" style={{ marginTop: 18 }}>
        Choose a case
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {CASES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`neu-chip${active === c.id ? " neu-chip-active" : ""}`}
            onClick={() => setActive(c.id)}
            title={c.example}
            aria-pressed={active === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <p className="neu-label" style={{ margin: 0 }}>
          Result · {CASES.find((c) => c.id === active)?.label}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="neu-btn neu-btn-sm" onClick={copy} disabled={!output}>
            {copied ? "Copied!" : "Copy result"}
          </button>
          <button
            type="button"
            className="neu-btn neu-btn-sm"
            onClick={() => setText("")}
            disabled={!text}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="result-box" aria-live="polite" style={{ minHeight: 110 }}>
        {output ? (
          <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "1.02rem" }}>
            {output}
          </p>
        ) : (
          <p style={{ color: "var(--muted)" }}>Your converted text will appear here…</p>
        )}
      </div>
      <p className="font-mono2" style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 10 }}>
        Input: {text.length.toLocaleString()} characters · {wordCount.toLocaleString()} words
      </p>
    </div>
  );
}
