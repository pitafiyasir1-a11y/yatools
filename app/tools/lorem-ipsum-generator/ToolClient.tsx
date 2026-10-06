"use client";

import { useState } from "react";
import { copyText } from "../copy-text";

const PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Unit = "paragraphs" | "sentences" | "words";

export default function LoremClient() {
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState(3);
  const [startLorem, setStartLorem] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [text, setText] = useState("");

  const sentences = PARAGRAPHS.flatMap((p) =>
    p.split(/(?<=[.!?])\s+/).filter((s) => s.trim())
  );
  const words = PARAGRAPHS.flatMap((p) => p.split(/\s+/));

  const generate = () => {
    const n = Math.max(1, Math.min(100, count));
    let out = "";
    if (unit === "paragraphs") {
      const picked = shuffle(PARAGRAPHS);
      const ps: string[] = [];
      for (let i = 0; i < n; i++) ps.push(picked[i % picked.length]);
      if (startLorem && !ps[0].startsWith("Lorem ipsum")) {
        ps[0] = "Lorem ipsum dolor sit amet, " + ps[0].charAt(0).toLowerCase() + ps[0].slice(1);
      }
      out = ps.join("\n\n");
    } else if (unit === "sentences") {
      const picked = shuffle(sentences);
      const ss: string[] = [];
      for (let i = 0; i < n; i++) ss.push(picked[i % picked.length]);
      out = ss.join(" ");
    } else {
      const picked = shuffle(words);
      const ws: string[] = [];
      for (let i = 0; i < n; i++) ws.push(picked[i % picked.length]);
      out = ws.join(" ");
    }
    setText(out);
  };

  const copy = async () => {
    if (!text) return;
    setCopyError(false);
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } else {
      setCopyError(true);
    }
  };

  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;

  return (
    <div className="card" style={{ padding: 22, marginTop: 24 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {(
          [
            ["paragraphs", "Paragraphs"],
            ["sentences", "Sentences"],
            ["words", "Words"],
          ] as [Unit, string][]
        ).map(([u, label]) => (
          <button key={u} className={`tab ${unit === u ? "tab-active" : ""}`} onClick={() => setUnit(u)}>
            {label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          alignItems: "flex-end",
          marginBottom: 14,
        }}
      >
        <div>
          <label className="field-label" htmlFor="lorem-count">
            How many?
          </label>
          <input
            id="lorem-count"
            type="number"
            min={1}
            max={100}
            className="input"
            style={{ width: 110 }}
            value={count}
            onChange={(e) => {
              const n = Number(e.target.value);
              setCount(Number.isFinite(n) ? Math.max(1, Math.min(100, Math.round(n))) : 1);
            }}
          />
        </div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: "0.9rem" }}>
          <input
            type="checkbox"
            checked={startLorem}
            onChange={(e) => setStartLorem(e.target.checked)}
          />
          Start with “Lorem ipsum…”
        </label>
        <button className="btn btn-primary" onClick={generate}>
          Generate
        </button>
        <button
          className="btn"
          onClick={() => {
            setText("");
            setCopied(false);
          }}
        >
          Clear
        </button>
      </div>

      {text ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
              {wordCount} words · {charCount} characters
            </span>
            <button className="btn" onClick={copy}>
              {copied ? "Copied!" : "Copy text"}
            </button>
          </div>
          {copyError && (
            <p role="alert" style={{ color: "var(--red-dark)", fontSize: "0.82rem", marginTop: 8 }}>
              Copy didn&apos;t work in this browser — select the text above and copy it manually.
            </p>
          )}
          <div
            className="card"
            style={{
              marginTop: 10,
              padding: 18,
              maxHeight: 380,
              overflowY: "auto",
              background: "var(--surface)",
            }}
          >
            {text.split("\n\n").map((p, i) => (
              <p key={i} style={{ marginBottom: 14, lineHeight: 1.7, color: "var(--text2)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Pick a unit and a count, then hit Generate. Placeholder text appears here, ready to copy into your designs.
        </p>
      )}
    </div>
  );
}
