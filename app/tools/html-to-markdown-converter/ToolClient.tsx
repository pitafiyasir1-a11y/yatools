"use client";

import { useState } from "react";
import { copyText } from "../copy-text";

function childrenMd(el: Element, depth: number): string {
  return Array.from(el.childNodes)
    .map((n) => nodeToMd(n, depth))
    .join("");
}

function nodeToMd(node: Node, depth: number): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").replace(/\s+/g, " ");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  switch (tag) {
    case "h1":
      return `\n\n# ${el.textContent?.trim()}\n\n`;
    case "h2":
      return `\n\n## ${el.textContent?.trim()}\n\n`;
    case "h3":
      return `\n\n### ${el.textContent?.trim()}\n\n`;
    case "h4":
      return `\n\n#### ${el.textContent?.trim()}\n\n`;
    case "h5":
      return `\n\n##### ${el.textContent?.trim()}\n\n`;
    case "h6":
      return `\n\n###### ${el.textContent?.trim()}\n\n`;
    case "p":
    case "div":
    case "section":
    case "article":
      return `\n\n${childrenMd(el, depth).trim()}\n\n`;
    case "br":
      return "\n";
    case "hr":
      return "\n\n---\n\n";
    case "strong":
    case "b":
      return `**${childrenMd(el, depth)}**`;
    case "em":
    case "i":
      return `*${childrenMd(el, depth)}*`;
    case "code": {
      const parent = el.parentElement?.tagName.toLowerCase();
      if (parent === "pre") return el.textContent ?? "";
      return `\`${el.textContent ?? ""}\``;
    }
    case "pre":
      return `\n\n\`\`\`\n${(el.textContent ?? "").trim()}\n\`\`\`\n\n`;
    case "a": {
      const href = el.getAttribute("href") ?? "";
      const text = childrenMd(el, depth).trim() || href;
      return href ? `[${text}](${href})` : text;
    }
    case "img": {
      const src = el.getAttribute("src") ?? "";
      const alt = el.getAttribute("alt") ?? "";
      return src ? `![${alt}](${src})` : "";
    }
    case "ul": {
      const items = Array.from(el.children)
        .filter((c) => c.tagName.toLowerCase() === "li")
        .map((li) => `${"  ".repeat(depth)}- ${childrenMd(li, depth + 1).trim()}`)
        .join("\n");
      return depth > 0 ? `\n${items}\n` : `\n\n${items}\n\n`;
    }
    case "ol": {
      const items = Array.from(el.children)
        .filter((c) => c.tagName.toLowerCase() === "li")
        .map((li, i) => `${"  ".repeat(depth)}${i + 1}. ${childrenMd(li, depth + 1).trim()}`)
        .join("\n");
      return depth > 0 ? `\n${items}\n` : `\n\n${items}\n\n`;
    }
    case "li":
      return childrenMd(el, depth);
    case "blockquote": {
      const inner = childrenMd(el, depth).trim().replace(/\n/g, "\n> ");
      return depth > 0 ? `\n> ${inner}\n` : `\n\n> ${inner}\n\n`;
    }
    case "script":
    case "style":
    case "head":
      return "";
    default:
      return childrenMd(el, depth);
  }
}

export function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const raw = childrenMd(doc.body, 0);
  return raw
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const SAMPLE = `<h2>Pasta Recipe</h2>
<p>This is a <strong>simple</strong> recipe with <a href="https://example.com">more tips</a>.</p>
<ul>
<li>Boil water</li>
<li>Add <em>pasta</em></li>
<li>Drain and serve</li>
</ul>
<blockquote>Tip: salt the water!</blockquote>`;

export default function HtmlToMdClient() {
  const [html, setHtml] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const md =
    typeof window === "undefined" ? "" : html.trim() ? htmlToMarkdown(html) : "";

  const copy = async () => {
    if (!md) return;
    setCopyError(false);
    const ok = await copyText(md);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } else {
      setCopyError(true);
    }
  };

  return (
    <div className="card" style={{ padding: 22, marginTop: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <div>
          <label className="field-label" htmlFor="htm-in">Paste HTML</label>
          <textarea
            id="htm-in"
            className="textarea input-mono"
            rows={14}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<h1>Paste HTML here…</h1>"
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn" onClick={() => setHtml(SAMPLE)}>
              Sample
            </button>
            <button className="btn" onClick={() => setHtml("")}>
              Clear
            </button>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="field-label">Markdown</span>
            <button className="btn btn-primary" onClick={copy} disabled={!md}>
              {copied ? "Copied!" : "Copy Markdown"}
            </button>
          </div>
          {copyError && (
            <p role="alert" style={{ color: "var(--red-dark)", fontSize: "0.82rem", marginTop: 6 }}>
              Copy didn&apos;t work in this browser — select the Markdown below and copy it manually.
            </p>
          )}
          <textarea
            className="textarea input-mono"
            rows={14}
            readOnly
            value={md}
            placeholder="Markdown appears live as you paste…"
            style={{ marginTop: 4 }}
          />
        </div>
      </div>
      <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 10 }}>
        Converts headings, links, images, lists, <strong>bold</strong>, <em>italic</em>, code blocks and blockquotes.
        Scripts, styles and page chrome are dropped. Conversion runs entirely in your browser.
      </p>
    </div>
  );
}
