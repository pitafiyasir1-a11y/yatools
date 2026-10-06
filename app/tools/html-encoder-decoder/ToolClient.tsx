"use client";

import { useState } from "react";
import { copyText } from "../copy-text";

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  copy: "©",
  reg: "®",
  trade: "™",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  laquo: "«",
  raquo: "»",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

export function encodeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function decodeHtml(s: string): string {
  return s.replace(
    /&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]+);/g,
    (m, entity: string) => {
      try {
        if (entity.startsWith("#x") || entity.startsWith("#X")) {
          return String.fromCodePoint(parseInt(entity.slice(2), 16));
        }
        if (entity.startsWith("#")) {
          return String.fromCodePoint(parseInt(entity.slice(1), 10));
        }
        return ENTITY_MAP[entity] ?? m;
      } catch {
        return m;
      }
    }
  );
}

export default function HtmlClient() {
  const [action, setAction] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const output = input ? (action === "encode" ? encodeHtml(input) : decodeHtml(input)) : "";

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
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className={`tab ${action === "encode" ? "tab-active" : ""}`} onClick={() => setAction("encode")}>
          Encode to entities
        </button>
        <button className={`tab ${action === "decode" ? "tab-active" : ""}`} onClick={() => setAction("decode")}>
          Decode entities
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <div>
          <label className="field-label" htmlFor="html-in">
            {action === "encode" ? "HTML / text to encode" : "Encoded text to decode"}
          </label>
          <textarea
            id="html-in"
            className="textarea input-mono"
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              action === "encode"
                ? '<p class="greeting">Tom & Jerry said "hi!"</p>'
                : "&lt;p&gt;Tom &amp; Jerry said &quot;hi!&quot;&lt;/p&gt;"
            }
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              className="btn"
              onClick={() =>
                setInput(
                  action === "encode"
                    ? '<a href="https://example.com">Tom & Jerry</a>'
                    : "&lt;a href=&quot;https://example.com&quot;&gt;Tom &amp; Jerry&lt;/a&gt;"
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
          <label className="field-label" htmlFor="html-out">Result</label>
          <textarea
            id="html-out"
            className="textarea input-mono"
            rows={8}
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
