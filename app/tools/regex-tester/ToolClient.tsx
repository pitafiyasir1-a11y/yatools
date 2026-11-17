"use client";

import { useMemo, useState } from "react";

const FLAGS = [
  { key: "g", label: "g — global (all matches)", hint: "Find every match, not just the first" },
  { key: "i", label: "i — ignore case", hint: "Match upper and lower case alike" },
  { key: "m", label: "m — multiline", hint: "^ and $ match at line starts/ends" },
  { key: "s", label: "s — dotAll", hint: ". matches newlines too" },
  { key: "u", label: "u — unicode", hint: "Full Unicode mode" },
  { key: "y", label: "y — sticky", hint: "Match only from lastIndex" },
] as const;

type Seg = { text: string; match: boolean; index: number };

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b");
  const [flags, setFlags] = useState<string[]>(["g"]);
  const [testStr, setTestStr] = useState(
    "Contact us at hello@example.com or support@yatools-tan.vercel.app — not at not-an-email@."
  );

  const toggleFlag = (k: string) =>
    setFlags((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]));

  const result = useMemo(() => {
    if (!pattern) return { error: null as string | null, matches: [] as { text: string; index: number; groups: string[] }[], segments: [{ text: testStr, match: false, index: -1 }] as Seg[] };
    let re: RegExp;
    try {
      re = new RegExp(pattern, flags.join(""));
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Invalid regular expression", matches: [] as { text: string; index: number; groups: string[] }[], segments: [{ text: testStr, match: false, index: -1 }] as Seg[] };
    }
    const matches: { text: string; index: number; groups: string[] }[] = [];
    const ranges: { start: number; end: number }[] = [];
    try {
      const global = re.global || re.sticky;
      if (global) {
        let m: RegExpExecArray | null;
        let guard = 0;
        re.lastIndex = 0;
        while ((m = re.exec(testStr)) !== null && guard++ < 1000) {
          matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
          ranges.push({ start: m.index, end: m.index + m[0].length });
          if (m[0].length === 0) re.lastIndex++;
        }
      } else {
        const m = re.exec(testStr);
        if (m) {
          matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
          ranges.push({ start: m.index, end: m.index + m[0].length });
        }
      }
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Error running the pattern", matches: [] as { text: string; index: number; groups: string[] }[], segments: [{ text: testStr, match: false, index: -1 }] as Seg[] };
    }
    const segments: Seg[] = [];
    let pos = 0;
    let mi = 0;
    for (const r of ranges) {
      if (r.start > pos) segments.push({ text: testStr.slice(pos, r.start), match: false, index: -1 });
      if (r.end > r.start) {
        segments.push({ text: testStr.slice(r.start, r.end), match: true, index: mi });
        mi++;
      }
      pos = Math.max(pos, r.end);
    }
    if (pos < testStr.length) segments.push({ text: testStr.slice(pos), match: false, index: -1 });
    return { error: null as string | null, matches, segments };
  }, [pattern, flags, testStr]);

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <label className="field-label" htmlFor="rx-pattern">Pattern</label>
          <input
            id="rx-pattern"
            className="input input-mono"
            value={pattern}
            placeholder="e.g. \b\d{4}-\d{2}-\d{2}\b"
            onChange={(e) => setPattern(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div>
          <span className="field-label">Flags</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FLAGS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`btn btn-sm${flags.includes(f.key) ? " btn-primary" : ""}`}
                onClick={() => toggleFlag(f.key)}
                aria-pressed={flags.includes(f.key)}
                title={f.hint}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="rx-text">Test string</label>
          <textarea
            id="rx-text"
            className="input input-mono"
            rows={5}
            value={testStr}
            placeholder="Paste the text to test against…"
            onChange={(e) => setTestStr(e.target.value)}
            style={{ resize: "vertical", lineHeight: 1.6 }}
          />
        </div>
      </div>

      {result.error ? (
        <div className="notice" style={{ marginTop: 16 }}>
          Invalid pattern: {result.error}
        </div>
      ) : (
        <div style={{ marginTop: 18 }}>
          <p className="field-label">
            {result.matches.length === 0
              ? "No matches"
              : `${result.matches.length} match${result.matches.length === 1 ? "" : "es"}`}
            {!flags.includes("g") && !flags.includes("y") && result.matches.length > 0 ? " (first match only — turn on “g” for all)" : ""}
          </p>
          <div
            className="card"
            style={{ padding: 16, fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: "0.9rem", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word", background: "var(--paper2, #efe7d6)" }}
          >
            {result.segments.map((s, i) =>
              s.match ? (
                <mark key={i} style={{ background: "rgba(224,38,60,0.3)", color: "inherit", padding: "0 2px", borderRadius: 3 }}>
                  {s.text}
                </mark>
              ) : (
                <span key={i}>{s.text}</span>
              )
            )}
          </div>
          {result.matches.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <p className="field-label">Matches</p>
              <div style={{ display: "grid", gap: 8 }}>
                {result.matches.slice(0, 50).map((m, i) => (
                  <div key={i} className="card" style={{ padding: "10px 14px", fontSize: "0.88rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <code style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", wordBreak: "break-all" }}>{m.text || "(empty match)"}</code>
                      <span className="font-mono2" style={{ color: "var(--muted)", fontSize: "0.74rem" }}>at index {m.index}</span>
                    </div>
                    {m.groups.length > 0 && (
                      <div style={{ marginTop: 6, fontSize: "0.82rem", color: "var(--text2)" }}>
                        Groups: {m.groups.map((g, gi) => (
                          <code key={gi} style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", background: "var(--paper2, #efe7d6)", padding: "1px 6px", borderRadius: 4, marginRight: 4 }}>
                            ${gi + 1} = {g === undefined ? "undefined" : JSON.stringify(g)}
                          </code>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {result.matches.length > 50 && (
                  <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Showing first 50 of {result.matches.length} matches.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 14, lineHeight: 1.6 }}>
        This tester uses your browser&apos;s JavaScript regex engine — the same one Node.js uses.
        Patterns that work here work in JavaScript code; other languages (Python, Java, PCRE) differ
        slightly.
      </p>
    </div>
  );
}
