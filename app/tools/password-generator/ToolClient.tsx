"use client";

import { useCallback, useEffect, useState } from "react";
import { copyText } from "../copy-text";

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~",
} as const;

const AMBIGUOUS = new Set(["I", "l", "1", "O", "0"]);

type OptKey = keyof typeof SETS;

/** Crypto-random int in [0, max) without modulo bias. */
function randomInt(max: number): number {
  const range = 4294967296;
  const limit = range - (range % max);
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0]!;
  } while (x >= limit);
  return x % max;
}

function strengthOf(entropy: number): { label: string; color: string; width: string } {
  if (entropy < 40) return { label: "Weak", color: "var(--red)", width: "20%" };
  if (entropy < 60) return { label: "Fair", color: "#e08a00", width: "40%" };
  if (entropy < 80) return { label: "Good", color: "#b8a800", width: "60%" };
  if (entropy < 100) return { label: "Strong", color: "var(--green)", width: "80%" };
  return { label: "Excellent", color: "var(--green)", width: "100%" };
}

export default function PasswordGeneratorClient() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState<Record<OptKey, boolean>>({
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
  });
  const [noAmbiguous, setNoAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const activeSets = (Object.keys(SETS) as OptKey[]).filter((k) => opts[k]);

  const generate = useCallback(() => {
    if (activeSets.length === 0) {
      setPassword("");
      return;
    }
    let pool = activeSets.map((k) => SETS[k]).join("");
    if (noAmbiguous) pool = [...pool].filter((ch) => !AMBIGUOUS.has(ch)).join("");
    if (!pool) {
      setPassword("");
      return;
    }
    // Guarantee at least one character from each selected set, then shuffle.
    const chars: string[] = activeSets.map((k) => {
      let s: string = SETS[k];
      if (noAmbiguous) s = [...s].filter((ch) => !AMBIGUOUS.has(ch)).join("");
      return s[randomInt(s.length)]!;
    });
    while (chars.length < length) chars.push(pool[randomInt(pool.length)]!);
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [chars[i], chars[j]] = [chars[j]!, chars[i]!];
    }
    setPassword(chars.join(""));
  }, [activeSets.join(","), length, noAmbiguous]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    generate();
  }, [generate]);

  const poolSize = (() => {
    let pool = activeSets.map((k) => SETS[k]).join("");
    if (noAmbiguous) pool = [...pool].filter((ch) => !AMBIGUOUS.has(ch)).join("");
    return new Set(pool).size;
  })();
  const entropy = password ? Math.round(password.length * Math.log2(Math.max(poolSize, 2))) : 0;
  const strength = strengthOf(entropy);

  const copy = async () => {
    if (!password) return;
    setCopyError(false);
    const ok = await copyText(password);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } else {
      setCopyError(true);
    }
  };

  const toggle = (k: OptKey) => setOpts((o) => ({ ...o, [k]: !o[k] }));

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <label className="field-label" htmlFor="pw-out">
        Your password
      </label>
      <div
        className="code-window"
        style={{ marginBottom: 18 }}
        aria-live="polite"
      >
        <pre
          id="pw-out"
          style={{
            fontSize: "1.05rem",
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            minHeight: 60,
            color: password ? "#e8ff47" : "#77756e",
          }}
        >
          {password || "Select at least one character set."}
        </pre>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <button type="button" className="btn btn-primary" onClick={generate} disabled={activeSets.length === 0}>
          ⟳ Generate
        </button>
        <button type="button" className="btn" onClick={copy} disabled={!password}>
          {copied ? "Copied!" : "Copy password"}
        </button>
      </div>
      {copyError && (
        <p role="alert" style={{ color: "var(--red-dark)", fontSize: "0.82rem", marginBottom: 16 }}>
          Copy didn&apos;t work in this browser — select the password above and copy it manually.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
        <div>
          <label className="field-label" htmlFor="pw-len">
            Length: <strong style={{ color: "var(--text)" }}>{length}</strong> characters
          </label>
          <input
            id="pw-len"
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--red)", height: 32 }}
          />
          <div
            className="font-mono2"
            style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--muted)" }}
          >
            <span>6</span>
            <span>64</span>
          </div>
        </div>

        <div>
          <p className="field-label">Character sets</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(
              [
                ["upper", "Uppercase (A–Z)"],
                ["lower", "Lowercase (a–z)"],
                ["digits", "Digits (0–9)"],
                ["symbols", "Symbols (!@#$…)"],
              ] as [OptKey, string][]
            ).map(([k, label]) => (
              <label
                key={k}
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.92rem" }}
              >
                <input
                  type="checkbox"
                  checked={opts[k]}
                  onChange={() => toggle(k)}
                  style={{ width: 18, height: 18, accentColor: "var(--red)" }}
                />
                {label}
              </label>
            ))}
            <label
              style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.92rem" }}
            >
              <input
                type="checkbox"
                checked={noAmbiguous}
                onChange={(e) => setNoAmbiguous(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--red)" }}
              />
              Exclude ambiguous (Il1O0)
            </label>
          </div>
        </div>

        <div>
          <p className="field-label">Strength</p>
          {password ? (
            <>
              <div
                style={{
                  height: 14,
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  background: "var(--surface2)",
                  overflow: "hidden",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: strength.width,
                    background: strength.color,
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              <p style={{ fontWeight: 800, color: strength.color }}>{strength.label}</p>
              <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 4 }}>
                ≈ {entropy} bits of entropy · {poolSize} possible characters
              </p>
            </>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>—</p>
          )}
        </div>
      </div>
    </div>
  );
}
