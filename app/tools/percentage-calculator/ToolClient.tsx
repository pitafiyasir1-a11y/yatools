"use client";

import { useMemo, useState } from "react";

type Mode = "percent-of" | "what-percent" | "change";

const MODES: { key: Mode; label: string; hint: string }[] = [
  { key: "percent-of", label: "X% of Y", hint: "What is 20% of 150?" },
  { key: "what-percent", label: "X is what % of Y", hint: "30 is what % of 150?" },
  { key: "change", label: "% increase / decrease", hint: "From 120 to 150 = ?" },
];

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  const rounded = Math.round(n * 100) / 100;
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export default function PercentageCalculatorClient() {
  const [mode, setMode] = useState<Mode>("percent-of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const result = useMemo(() => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (mode === "percent-of") {
      if (isNaN(x) || isNaN(y)) return null;
      const val = (x / 100) * y;
      return { main: fmt(val), expl: `${fmt(x)}% of ${fmt(y)}` };
    }
    if (mode === "what-percent") {
      if (isNaN(x) || isNaN(y) || y === 0) return null;
      const val = (x / y) * 100;
      return { main: `${fmt(val)}%`, expl: `${fmt(x)} is ${fmt(val)}% of ${fmt(y)}` };
    }
    // change
    if (isNaN(x) || isNaN(y) || x === 0) return null;
    const diff = y - x;
    const pct = (diff / Math.abs(x)) * 100;
    const dir = diff > 0 ? "increase" : diff < 0 ? "decrease" : "no change";
    return {
      main: `${diff === 0 ? "0" : fmt(Math.abs(pct))}%`,
      expl: `${fmt(x)} → ${fmt(y)} is a ${dir}`,
      sub: `difference: ${diff > 0 ? "+" : ""}${fmt(diff)}`,
      up: diff > 0,
      down: diff < 0,
    };
  }, [mode, a, b]);

  const labels =
    mode === "percent-of"
      ? { a: "Percentage (%)", b: "Of value", pa: "e.g. 20", pb: "e.g. 150" }
      : mode === "what-percent"
        ? { a: "Value", b: "Total value", pa: "e.g. 30", pb: "e.g. 150" }
        : { a: "Original value", b: "New value", pa: "e.g. 120", pb: "e.g. 150" };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`btn btn-sm${mode === m.key ? " btn-primary" : ""}`}
            onClick={() => {
              setMode(m.key);
              setA("");
              setB("");
            }}
            aria-pressed={mode === m.key}
            title={m.hint}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: -10, marginBottom: 14 }}>
        {MODES.find((m) => m.key === mode)!.hint}
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 180px" }}>
          <label className="field-label" htmlFor="pc-a">
            {labels.a}
          </label>
          <input
            id="pc-a"
            type="number"
            step="any"
            className="input input-mono"
            placeholder={labels.pa}
            value={a}
            onChange={(e) => setA(e.target.value)}
            inputMode="decimal"
            autoComplete="off"
          />
        </div>
        <div style={{ flex: "1 1 180px" }}>
          <label className="field-label" htmlFor="pc-b">
            {labels.b}
          </label>
          <input
            id="pc-b"
            type="number"
            step="any"
            className="input input-mono"
            placeholder={labels.pb}
            value={b}
            onChange={(e) => setB(e.target.value)}
            inputMode="decimal"
            autoComplete="off"
          />
        </div>
      </div>

      {result ? (
        <div
          className="card"
          style={{
            padding: "20px 24px",
            marginTop: 18,
            textAlign: "center",
            borderColor:
              mode === "change"
                ? result.up
                  ? "#16a34a"
                  : result.down
                    ? "#dc2626"
                    : "var(--line)"
                : "var(--red)",
            borderWidth: 2,
          }}
          aria-live="polite"
        >
          <div
            className="font-mono2"
            style={{
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted)",
              marginBottom: 8,
            }}
          >
            Answer
          </div>
          <div
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 6vw, 3rem)",
              lineHeight: 1,
              color:
                mode === "change"
                  ? result.up
                    ? "#16a34a"
                    : result.down
                      ? "#dc2626"
                      : "var(--text)"
                  : "var(--text)",
            }}
          >
            {result.main}
          </div>
          <div style={{ fontSize: "0.9rem", color: "var(--text2)", marginTop: 8 }}>
            {result.expl}
          </div>
          {result.sub && (
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>
              {result.sub}
            </div>
          )}
        </div>
      ) : (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "18px 0 0" }}>
          Enter both numbers above — the answer appears instantly.
        </p>
      )}
    </div>
  );
}
