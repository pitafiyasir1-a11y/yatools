"use client";

import { useState } from "react";
import { copyText } from "../copy-text";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Block dangerous URL schemes in links/images. The URL arrives HTML-escaped
 * (escapeHtml runs first), so entity-based tricks (&#58;, &colon;) are already
 * neutralized — we only need to normalize whitespace/control chars (browsers
 * strip them before parsing, which defeats a naive protocol check) and then
 * allow only safe schemes plus relative URLs.
 */
function safeUrl(u: string): string | null {
  const t = u.replace(/[\t\n\r\f\v\0 ]/g, "").trim();
  if (!t) return null;
  const m = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(t);
  if (!m) return t; // relative URL — safe
  const scheme = m[1].toLowerCase();
  return scheme === "http" || scheme === "https" || scheme === "mailto" || scheme === "tel"
    ? t
    : null;
}

function inlineMd(s: string): string {
  let t = escapeHtml(s);
  // Inline code first so * and [] inside code stay literal
  t = t.replace(/`([^`\n]+)`/g, (_, c: string) => `<code>${c}</code>`);
  // Images before links: ![alt](src)
  t = t.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, alt: string, src: string) => {
      const ok = safeUrl(src);
      return ok ? `<img src="${ok}" alt="${alt}">` : alt;
    }
  );
  // Links: [text](url)
  t = t.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, text: string, url: string) => {
      const ok = safeUrl(url);
      return ok ? `<a href="${ok}">${text}</a>` : text;
    }
  );
  // Bold **text** and __text__
  t = t.replace(/(\*\*|__)([^*_]+?)\1/g, "<strong>$2</strong>");
  // Italic *text* and _text_
  t = t.replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\w)/g, "$1<em>$2</em>");
  t = t.replace(/(^|[^_\w])_([^_\n]+?)_(?!\w)/g, "$1<em>$2</em>");
  // Strikethrough
  t = t.replace(/~~([^~\n]+?)~~/g, "<del>$1</del>");
  return t;
}

export function mdToHtml(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let listType: "ul" | "ol" | null = null;
  let inCode = false;
  let codeBuf: string[] = [];
  let para: string[] = [];
  let bq: string[] = [];

  const flushList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = null;
    }
  };
  const flushPara = () => {
    if (para.length) {
      html += `<p>${para.map(inlineMd).join("<br>")}</p>`;
      para = [];
    }
  };
  const flushBq = () => {
    if (bq.length) {
      html += `<blockquote>${bq.map(inlineMd).join("<br>")}</blockquote>`;
      bq = [];
    }
  };

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      if (inCode) {
        html += `<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`;
        codeBuf = [];
        inCode = false;
      } else {
        flushPara();
        flushList();
        flushBq();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      flushPara();
      flushList();
      flushBq();
      html += `<h${h[1].length}>${inlineMd(h[2])}</h${h[1].length}>`;
      continue;
    }
    if (/^>\s?/.test(line)) {
      flushPara();
      flushList();
      bq.push(line.replace(/^>\s?/, ""));
      continue;
    }
    flushBq();
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
      flushPara();
      flushList();
      html += "<hr>";
      continue;
    }
    const ul = /^\s*[-*]\s+(.*)$/.exec(line);
    const ol = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (ul || ol) {
      flushPara();
      const type = ul ? "ul" : "ol";
      const item = ul ? ul[1] : ol![1];
      if (listType !== type) {
        flushList();
        html += `<${type}>`;
        listType = type;
      }
      html += `<li>${inlineMd(item)}</li>`;
      continue;
    }
    if (/^\s*$/.test(line)) {
      flushPara();
      flushList();
      continue;
    }
    para.push(line);
  }
  flushPara();
  flushList();
  flushBq();
  return html;
}

const SAMPLE = `# Hello, Markdown

Type on the left — the **HTML preview** renders live on the right.

## Features

- **Bold**, *italic*, and \`inline code\`
- [Links](https://yatools-xyv3.vercel.app/)
- Blockquotes:

> Simple English beats jargon, every time.

1. Numbered lists work too
2. So do code blocks:

\`\`\`
function hello() {
  return "world";
}
\`\`\`
`;

export default function MarkdownClient() {
  const [md, setMd] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [showHtml, setShowHtml] = useState(false);

  const html = mdToHtml(md);

  const copy = async () => {
    if (!html) return;
    setCopyError(false);
    const ok = await copyText(html);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } else {
      setCopyError(true);
    }
  };

  return (
    <div className="card" style={{ padding: 22, marginTop: 24 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <button className={`tab ${!showHtml ? "tab-active" : ""}`} onClick={() => setShowHtml(false)}>
          Live preview
        </button>
        <button className={`tab ${showHtml ? "tab-active" : ""}`} onClick={() => setShowHtml(true)}>
          HTML source
        </button>
        <span style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={copy} disabled={!html}>
          {copied ? "Copied!" : "Copy HTML"}
        </button>
      </div>
      {copyError && (
        <p role="alert" style={{ color: "var(--red-dark)", fontSize: "0.82rem", marginBottom: 12 }}>
          Copy didn&apos;t work in this browser — open the HTML source tab, select all, and copy manually.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <div>
          <label className="field-label" htmlFor="md-in">Markdown</label>
          <textarea
            id="md-in"
            className="textarea input-mono"
            rows={18}
            value={md}
            onChange={(e) => setMd(e.target.value)}
            placeholder="# Write Markdown here…"
          />
        </div>
        <div>
          <span className="field-label">{showHtml ? "Generated HTML" : "Preview"}</span>
          {showHtml ? (
            <textarea
              className="textarea input-mono"
              rows={18}
              readOnly
              value={html}
              placeholder="HTML appears here…"
            />
          ) : (
            <div
              className="card"
              style={{
                minHeight: 320,
                maxHeight: 480,
                overflowY: "auto",
                padding: 18,
                background: "var(--surface)",
                lineHeight: 1.7,
              }}
              dangerouslySetInnerHTML={{ __html: html || "<p style='color:var(--muted)'>Nothing to preview yet.</p>" }}
            />
          )}
        </div>
      </div>
      <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 10 }}>
        Supports headings, <strong>bold</strong>, <em>italic</em>, links, images, lists, code blocks, blockquotes and horizontal rules — rendered entirely in your browser.
      </p>
    </div>
  );
}
