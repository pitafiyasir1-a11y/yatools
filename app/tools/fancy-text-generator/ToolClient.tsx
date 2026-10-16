"use client";

import { useMemo, useState } from "react";
import { copyText } from "../copy-text";

/** Unicode math-alphanumeric style maps. Each maps A-Z, a-z, 0-9 to styled codepoints. */
type StyleDef = { key: string; label: string; upper: number; lower: number; digit: number | null };

const STYLES: StyleDef[] = [
  { key: "bold", label: "Bold", upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce },
  { key: "italic", label: "Italic", upper: 0x1d434, lower: 0x1d44e, digit: null },
  { key: "bold-italic", label: "Bold Italic", upper: 0x1d468, lower: 0x1d482, digit: null },
  { key: "script", label: "Script", upper: 0x1d49c, lower: 0x1d4b6, digit: null },
  { key: "bold-script", label: "Bold Script", upper: 0x1d4d0, lower: 0x1d4ea, digit: null },
  { key: "fraktur", label: "Fraktur", upper: 0x1d504, lower: 0x1d51e, digit: null },
  { key: "double-struck", label: "Double-struck", upper: 0x1d538, lower: 0x1d552, digit: 0x1d7d8 },
  { key: "monospace", label: "Monospace", upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 },
  { key: "sans-bold", label: "Sans Bold", upper: 0x1d5a0, lower: 0x1d5ba, digit: 0x1d7ec },
  { key: "sans-italic", label: "Sans Italic", upper: 0x1d608, lower: 0x1d622, digit: null },
  { key: "sans-bold-italic", label: "Sans Bold Italic", upper: 0x1d63c, lower: 0x1d656, digit: null },
  { key: "circled", label: "Circled", upper: 0x24b6, lower: 0x24d0, digit: 0x2460 },
];

function stylize(text: string, style: StyleDef): string {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code >= 65 && code <= 90) {
      out += String.fromCodePoint(style.upper + (code - 65));
    } else if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(style.lower + (code - 97));
    } else if (code >= 48 && code <= 57 && style.digit !== null) {
      // Circled digits are ①-⑨ then ⓪ — handle the offset quirk.
      if (style.key === "circled") {
        out += code === 48 ? "⓪" : String.fromCodePoint(style.digit + (code - 49));
      } else {
        out += String.fromCodePoint(style.digit + (code - 48));
      }
    } else {
      out += ch;
    }
  }
  return out;
}

const SAMPLE = "YATools";

export default function FancyTextGeneratorClient() {
  const [text, setText] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const results = useMemo(
    () => STYLES.map((s) => ({ ...s, output: stylize(text, s) })),
    [text]
  );

  const copy = async (key: string, value: string) => {
    const ok = await copyText(value);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1600);
    }
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <label className="field-label" htmlFor="ftg-input">
        Your text
      </label>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <input
          id="ftg-input"
          className="input input-mono"
          style={{ flex: "1 1 260px" }}
          placeholder="Type something — e.g. YATools"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={120}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="button" className="btn btn-sm" onClick={() => setText(SAMPLE)}>
          Sample
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setText("")}
          disabled={!text}
        >
          Clear
        </button>
      </div>

      {!text ? (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "18px 0 0" }}>
          Type above to see your text in {STYLES.length} fancy Unicode styles — perfect for
          Instagram bios, TikTok names, and WhatsApp status.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
            marginTop: 6,
          }}
          aria-live="polite"
        >
          {results.map((r) => (
            <div
              key={r.key}
              className="card"
              style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}
            >
              <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                <div
                  className="font-mono2"
                  style={{
                    fontSize: "0.62rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--red-dark)",
                    marginBottom: 6,
                  }}
                >
                  {r.label}
                </div>
                <div
                  style={{
                    fontSize: "1.15rem",
                    lineHeight: 1.4,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {r.output}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm"
                style={{ flex: "0 0 auto" }}
                onClick={() => copy(r.key, r.output)}
              >
                {copiedKey === r.key ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
      <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 16, marginBottom: 0 }}>
        These are real Unicode characters — they work anywhere text works: bios, comments,
        captions, and messages. No fonts to install.
      </p>
    </div>
  );
}
