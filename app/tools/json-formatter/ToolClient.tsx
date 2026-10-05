"use client";

import { useState } from "react";

const SAMPLE = `{
  "name": "YATools",
  "free": true,
  "tools": ["qr-code", "word-counter", "json-formatter"],
  "meta": { "version": 1, "tags": null }
}`;

interface ParseIssue {
  message: string;
  line: number | null;
  col: number | null;
  lineText: string | null;
}

function locateError(input: string, err: unknown): ParseIssue {
  const raw = err instanceof Error ? err.message : String(err);
  // V8 / SpiderMonkey include "at position N" or "at line L column C"
  const posMatch = /at position (\d+)/.exec(raw) ?? /at line (\d+) column (\d+)/.exec(raw);
  let line: number | null = null;
  let col: number | null = null;
  if (posMatch) {
    if (posMatch[2] !== undefined) {
      line = Number(posMatch[1]);
      col = Number(posMatch[2]);
    } else {
      const pos = Math.min(Number(posMatch[1]), input.length);
      const upto = input.slice(0, pos);
      line = upto.split("\n").length;
      col = pos - upto.lastIndexOf("\n");
    }
  }
  const lineText =
    line !== null ? (input.split("\n")[line - 1] ?? null) : null;
  // Strip the noisy "in JSON at position N" tail for a cleaner message
  const message = raw.replace(/\s*in JSON at position \d+\s*/i, "").trim() || raw;
  return { message, line, col, lineText };
}

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [issue, setIssue] = useState<ParseIssue | null>(null);
  const [valid, setValid] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = (mode: "format" | "minify" | "validate") => {
    setIssue(null);
    setValid(false);
    if (!input.trim()) {
      setOutput("");
      setIssue({ message: "Nothing to check — paste some JSON first.", line: null, col: null, lineText: null });
      return;
    }
    try {
      const parsed: unknown = JSON.parse(input);
      if (mode === "validate") {
        setOutput("");
        setValid(true);
      } else if (mode === "format") {
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (err) {
      setOutput("");
      setIssue(locateError(input, err));
    }
  };

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
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <button type="button" className="neu-btn neu-btn-primary neu-btn-sm" onClick={() => run("format")}>
          Format
        </button>
        <button type="button" className="neu-btn neu-btn-sm" onClick={() => run("minify")}>
          Minify
        </button>
        <button type="button" className="neu-btn neu-btn-sm" onClick={() => run("validate")}>
          Validate
        </button>
        <button type="button" className="neu-btn neu-btn-sm" onClick={() => setInput(SAMPLE)}>
          Load sample
        </button>
        <button
          type="button"
          className="neu-btn neu-btn-sm"
          onClick={() => {
            setInput("");
            setOutput("");
            setIssue(null);
            setValid(false);
          }}
          disabled={!input && !output}
        >
          Clear
        </button>
      </div>

      <label className="neu-label" htmlFor="json-input">
        JSON input
      </label>
      <textarea
        id="json-input"
        className="neu-textarea neu-input-mono"
        style={{ minHeight: 190 }}
        placeholder='Paste JSON here, e.g. {"hello": "world"}'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
      />

      {valid && (
        <div className="notice notice-ok" style={{ marginTop: 14 }} role="status">
          <strong>Valid JSON.</strong> Structure parses cleanly — safe to use in your code or API
          calls.
        </div>
      )}

      {issue && (
        <div className="notice notice-warn" style={{ marginTop: 14 }} role="alert">
          <strong>
            Invalid JSON
            {issue.line !== null && issue.col !== null
              ? ` — line ${issue.line}, column ${issue.col}`
              : ""}
            :
          </strong>{" "}
          {issue.message}
          {issue.lineText !== null && (
            <div className="code-window" style={{ marginTop: 12 }}>
              <pre style={{ margin: 0 }}>
                <span className="tok-c">{`line ${issue.line}: `}</span>
                {issue.lineText}
                {"\n"}
                <span style={{ color: "var(--red)" }}>
                  {" ".repeat(`line ${issue.line}: `.length + (issue.col ?? 1) - 1)}^
                </span>
              </pre>
            </div>
          )}
        </div>
      )}

      {output && (
        <div style={{ marginTop: 14 }}>
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
              Result ({output.length.toLocaleString()} characters)
            </p>
            <button type="button" className="neu-btn neu-btn-sm" onClick={copy}>
              {copied ? "Copied!" : "Copy result"}
            </button>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>output.json</span>
            </div>
            <pre style={{ maxHeight: 420 }}>{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
