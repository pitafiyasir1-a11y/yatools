"use client";

import { useMemo, useState } from "react";
import { copyText } from "../copy-text";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function normalizeHex(raw: string): string | null {
  let h = raw.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(h)) h = [...h].map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return `#${h.toLowerCase()}`;
}

function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const p = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
  return `#${p(r)}${p(g)}${p(b)}`;
}

function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Relative luminance → pick readable text color. */
function textOn({ r, g, b }: Rgb): string {
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.55 ? "#141210" : "#ffffff";
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };
}

const PALETTES: { name: string; colors: string[] }[] = [
  { name: "Neubrutalist", colors: ["#f6f1e5", "#141210", "#e0263c", "#e8ff47", "#2e6df2"] },
  { name: "Sunset", colors: ["#ff6b6b", "#ffa07a", "#ffd93d", "#6bcb77", "#4d96ff"] },
  { name: "Ocean", colors: ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"] },
  { name: "Forest", colors: ["#1b4332", "#2d6a4f", "#74c69d", "#b7e4c7", "#d8f3dc"] },
  { name: "Pastel", colors: ["#ffc6ff", "#bdb2ff", "#a0c4ff", "#9bf6ff", "#caffbf"] },
  { name: "Warm paper", colors: ["#141210", "#4c4636", "#8a8168", "#d8cdb2", "#f6f1e5"] },
];

export default function ColorPickerClient() {
  const [hex, setHex] = useState("#e0263c");
  const [draft, setDraft] = useState("#e0263c");
  const [draftError, setDraftError] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const fg = useMemo(() => textOn(rgb), [rgb]);

  const tints = useMemo(
    () => [0.2, 0.4, 0.6, 0.8].map((t) => rgbToHex(mix(rgb, { r: 255, g: 255, b: 255 }, t))),
    [rgb]
  );
  const shades = useMemo(
    () => [0.2, 0.4, 0.6, 0.8].map((t) => rgbToHex(mix(rgb, { r: 0, g: 0, b: 0 }, t))),
    [rgb]
  );

  const commitDraft = () => {
    const ok = normalizeHex(draft);
    if (ok) {
      setHex(ok);
      setDraft(ok);
      setDraftError(false);
    } else {
      setDraftError(true);
    }
  };

  const copy = async (value: string, key: string) => {
    setCopyError(false);
    const ok = await copyText(value);
    if (ok) {
      setCopied(key);
      setTimeout(() => setCopied(null), 1400);
    } else {
      setCopyError(true);
    }
  };

  const values: { label: string; value: string; key: string }[] = [
    { label: "HEX", value: hex.toUpperCase(), key: "hex" },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, key: "rgb" },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, key: "hsl" },
  ];

  const swatch = (color: string, key: string, small = false) => (
    <button
      key={key}
      type="button"
      onClick={() => {
        const ok = normalizeHex(color);
        if (ok) {
          setHex(ok);
          setDraft(ok);
          setDraftError(false);
        }
      }}
      title={color}
      aria-label={`Use color ${color}`}
      style={{
        background: color,
        border: "1px solid var(--line)",
        borderRadius: 10,
        height: small ? 44 : 64,
        cursor: "pointer",
        
        transition: "transform 0.12s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-2px,-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    />
  );

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        <div>
          <div
            style={{
              background: hex,
              border: "1px solid var(--line)",
              borderRadius: 14,
              
              height: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              transition: "background 0.15s ease",
            }}
          >
            <span
              className="font-display"
              style={{ color: fg, fontSize: "1.6rem", letterSpacing: 1 }}
            >
              {hex.toUpperCase()}
            </span>
          </div>
          <label className="field-label" htmlFor="cp-visual">
            Pick a color
          </label>
          <input
            id="cp-visual"
            type="color"
            value={hex}
            onChange={(e) => {
              setHex(e.target.value);
              setDraft(e.target.value);
              setDraftError(false);
            }}
            style={{
              width: "100%",
              height: 52,
              border: "1px solid var(--line)",
              borderRadius: 11,
              background: "var(--surface)",
              cursor: "pointer",
              padding: 4,
              marginBottom: 14,
            }}
          />
          <label className="field-label" htmlFor="cp-hex">
            Or type a hex code
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              id="cp-hex"
              className="input input-mono"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setDraftError(false);
              }}
              onBlur={commitDraft}
              onKeyDown={(e) => e.key === "Enter" && commitDraft()}
              placeholder="#e0263c"
              spellCheck={false}
              style={draftError ? { borderColor: "var(--red)" } : undefined}
            />
            <button type="button" className="btn btn-sm" onClick={commitDraft}>
              Apply
            </button>
          </div>
          {draftError && (
            <p style={{ color: "var(--red-dark)", fontSize: "0.8rem", marginTop: 6 }}>
              That doesn&apos;t look like a hex color — try #e0263c or #e24.
            </p>
          )}
          <p className="font-mono2" style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 10 }}>
            Readable text on this color: {fg === "#ffffff" ? "white" : "near-black"}
          </p>
        </div>

        <div>
          <p className="field-label">Copy color codes</p>
          {copyError && (
            <p role="alert" style={{ color: "var(--red-dark)", fontSize: "0.82rem", marginBottom: 8 }}>
              Copy didn&apos;t work in this browser — select the code and copy it manually.
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {values.map((v) => (
              <div
                key={v.key}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  className="font-mono2"
                  style={{
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--red-dark)",
                    width: 44,
                  }}
                >
                  {v.label}
                </span>
                <code
                  className="input input-mono"
                  style={{
                    flex: 1,
                    border: "2px solid var(--line)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: "0.85rem",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  {v.value}
                </code>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => copy(v.value, v.key)}
                >
                  {copied === v.key ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>

          <p className="field-label">Tints</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
            {tints.map((c, i) => swatch(c, `tint-${i}`, true))}
          </div>
          <p className="field-label">Shades</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {shades.map((c, i) => swatch(c, `shade-${i}`, true))}
          </div>
        </div>
      </div>

      <hr className="sec-rule" style={{ margin: "24px 0" }} />
      <p className="field-label">Curated palettes — click any swatch to use it</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {PALETTES.map((p) => (
          <div key={p.name} className="card" style={{ padding: 14,  }}>
            <p className="font-mono2" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, color: "var(--text2)" }}>
              {p.name}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {p.colors.map((c) => swatch(c, `${p.name}-${c}`, true))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
