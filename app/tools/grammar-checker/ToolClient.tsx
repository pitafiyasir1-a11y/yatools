"use client";

import { useMemo, useState } from "react";

const MAX_CHARS = 10000;

type LTMatch = {
  message: string;
  shortMessage?: string;
  replacements: { value: string }[];
  offset: number;
  length: number;
  context: { text: string; offset: number; length: number };
  rule: { id: string; description?: string };
};

const SAMPLE =
  "This are a example of a sentence with a few mistakes. Their is also a problem with grammer, and this sentence have an error too.";

export default function GrammarCheckerClient() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("en-US");
  const [matches, setMatches] = useState<LTMatch[]>([]);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ words: number; chars: number } | null>(null);

  const overLimit = text.length > MAX_CHARS;

  const check = async () => {
    const t = text.trim();
    if (!t) {
      setError("Paste or type some text first.");
      return;
    }
    if (t.length > MAX_CHARS) {
      setError(`The free API accepts up to ${MAX_CHARS.toLocaleString()} characters per check — your text is ${t.length.toLocaleString()}. Split it and check one part at a time.`);
      return;
    }
    setBusy(true);
    setError(null);
    setChecked(false);
    try {
      const body = new URLSearchParams({ text: t, language: lang });
      const res = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`LanguageTool answered ${res.status}`);
      const data = await res.json();
      const found: LTMatch[] = (data.matches ?? []).filter(
        (m: LTMatch) => Array.isArray(m.replacements) && m.replacements.length > 0
      );
      setMatches(found);
      setStats({ words: t.split(/\s+/).filter(Boolean).length, chars: t.length });
      setChecked(true);
    } catch {
      setError("Checking failed — the free LanguageTool service may be busy or unreachable. Wait a moment and try again.");
    } finally {
      setBusy(false);
    }
  };

  const applyOne = (match: LTMatch, replacement: string) => {
    const o = match.offset;
    const l = match.length;
    const delta = replacement.length - l;
    const newText = text.slice(0, o) + replacement + text.slice(o + l);
    setText(newText);
    setMatches((prev) =>
      prev
        .filter((m) => m !== match && !(m.offset < o + l && m.offset + m.length > o))
        .map((m) => (m.offset > o ? { ...m, offset: m.offset + delta } : m))
    );
  };

  const applyAll = () => {
    let newText = text;
    const sorted = [...matches].sort((a, b) => b.offset - a.offset);
    for (const m of sorted) {
      newText = newText.slice(0, m.offset) + m.replacements[0].value + newText.slice(m.offset + m.length);
    }
    setText(newText);
    setMatches([]);
  };

  const fixedCount = useMemo(() => (checked ? stats : null), [checked, stats]);

  const renderContext = (m: LTMatch) => {
    const ctx = m.context.text;
    const start = m.context.offset;
    const end = start + m.context.length;
    return (
      <span style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: "0.85rem" }}>
        {ctx.slice(0, start)}
        <mark style={{ background: "rgba(224,38,60,0.25)", color: "inherit", padding: "0 2px", borderRadius: 3 }}>
          {ctx.slice(start, end)}
        </mark>
        {ctx.slice(end)}
      </span>
    );
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12, alignItems: "end" }}>
        <div>
          <label className="field-label" htmlFor="gc-lang">English variant</label>
          <select id="gc-lang" className="input" value={lang} onChange={(e) => setLang(e.target.value)} style={{ minWidth: 170 }}>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
          </select>
        </div>
        <button type="button" className="btn btn-sm" onClick={() => { setText(SAMPLE); setMatches([]); setChecked(false); setError(null); }}>
          Try a sample
        </button>
        <button type="button" className="btn btn-sm" onClick={() => { setText(""); setMatches([]); setChecked(false); setError(null); setStats(null); }}>
          Clear
        </button>
      </div>

      <label className="field-label" htmlFor="gc-text">Your text</label>
      <textarea
        id="gc-text"
        className="input"
        rows={8}
        value={text}
        placeholder="Paste your essay, email, cover letter, or anything else — up to 10,000 characters."
        onChange={(e) => { setText(e.target.value); setChecked(false); setMatches([]); }}
        style={{ resize: "vertical", lineHeight: 1.6 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        <span style={{ fontSize: "0.8rem", color: overLimit ? "var(--red)" : "var(--muted)" }}>
          {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
          {overLimit ? " — over the free API limit" : ""}
        </span>
        <button type="button" className="btn btn-primary btn-sm" onClick={check} disabled={busy || !text.trim() || overLimit}>
          {busy ? "Checking…" : "Check grammar"}
        </button>
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 12, lineHeight: 1.6 }}>
        Honest note: checking uses LanguageTool&apos;s free public API — your text is sent to
        LanguageTool for checking and is not stored by YATools. The free tier accepts up to 10,000
        characters per check and has fair-use rate limits; if it&apos;s busy, wait a moment and try
        again. Suggestions are advisory, not always right — read each one before applying it.
      </p>

      {error && (
        <div className="notice" style={{ marginTop: 16 }}>
          {error}
        </div>
      )}

      {checked && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <p className="field-label" style={{ margin: 0 }}>
              {matches.length === 0
                ? "No issues found — looks clean!"
                : `${matches.length} issue${matches.length === 1 ? "" : "s"} found`}
              {fixedCount ? ` · ${fixedCount.words} words, ${fixedCount.chars} characters` : ""}
            </p>
            {matches.length > 0 && (
              <button type="button" className="btn btn-sm" onClick={applyAll}>
                Apply all fixes
              </button>
            )}
          </div>
          {matches.map((m, i) => (
            <div key={`${m.offset}-${i}`} className="card" style={{ padding: 16, marginBottom: 10 }}>
              <div style={{ fontSize: "0.92rem", fontWeight: 700, marginBottom: 6 }}>{m.message}</div>
              <div style={{ marginBottom: 10 }}>{renderContext(m)}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {m.replacements.slice(0, 4).map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className="btn btn-sm"
                    onClick={() => applyOne(m, r.value)}
                    title="Click to replace the highlighted text"
                  >
                    {r.value}
                  </button>
                ))}
              </div>
              {m.rule?.description && (
                <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 8 }}>{m.rule.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
