"use client";

import { useState } from "react";
import { copyText } from "../copy-text";

type Action = "encode" | "decode";
type Mode = "component" | "full";

export default function UrlClient() {
  const [action, setAction] = useState<Action>("encode");
  const [mode, setMode] = useState<Mode>("component");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const output = (() => {
    if (!input) return "";
    try {
      if (action === "encode") {
        return mode === "component" ? encodeURIComponent(input) : encodeURI(input);
      }
      return decodeURIComponent(input);
    } catch {
      return "";
    }
  })();

  const copy = async () => {
    if (!output) return;
    setCopyError(false);
    const ok = await copyText(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } else {
      setCopyError(true);
    }
  };

  return (
    <div className="card" style={{ padding: 22, marginTop: 24 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {(
          [
            ["encode", "Encode"],
            ["decode", "Decode"],
          ] as [Action, string][]
        ).map(([a, label]) => (
          <button key={a} className={`tab ${action === a ? "tab-active" : ""}`} onClick={() => setAction(a)}>
            {label}
          </button>
        ))}
        <span style={{ color: "var(--line)", alignSelf: "center" }}>|</span>
        {(
          [
            ["component", "Component mode"],
            ["full", "Full URL mode"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button key={m} className={`tab ${mode === m ? "tab-active" : ""}`} onClick={() => setMode(m)}>
            {label}
          </button>
        ))}
      </div>
      <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 14 }}>
        {mode === "component"
          ? "Component mode escapes everything except letters, digits and - _ . ! ~ * ' ( ) — use it for query values and path segments."
          : "Full URL mode keeps the URL structure intact (:// ? & = stay as-is) — use it when pasting a whole link."}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <div>
          <label className="field-label" htmlFor="url-in">
            {action === "encode" ? "Text or URL to encode" : "Encoded text to decode"}
          </label>
          <textarea
            id="url-in"
            className="textarea input-mono"
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              action === "encode"
                ? "https://example.com/search?q=hello world & lang=en"
                : "hello%20world%21"
            }
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              className="btn"
              onClick={() =>
                setInput(
                  action === "encode"
                    ? "https://example.com/search?q=hello world&lang=en"
                    : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%2520world"
                )
              }
            >
              Sample
            </button>
            <button className="btn" onClick={() => setInput("")}>
              Clear
            </button>
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="url-out">Result</label>
          <textarea
            id="url-out"
            className="textarea input-mono"
            rows={6}
            readOnly
            value={output}
            placeholder="Result appears live as you type…"
          />
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={copy} disabled={!output}>
              {copied ? "Copied!" : "Copy result"}
            </button>
            {copyError && (
              <p role="alert" style={{ color: "var(--red-dark)", fontSize: "0.82rem", marginTop: 8 }}>
                Copy didn&apos;t work in this browser — select the result above and copy it manually.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
