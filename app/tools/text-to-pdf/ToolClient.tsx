"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Align = "left" | "center" | "justify";
type BlockKind = "h1" | "h2" | "h3" | "p" | "bullets";
type PageSize = "a4" | "letter";

interface Block {
  id: number;
  kind: BlockKind;
  text: string;
  align: Align;
  bold: boolean;
  italic: boolean;
  fontSize: number;
}

const KIND_LABEL: Record<BlockKind, string> = {
  h1: "H1",
  h2: "H2",
  h3: "H3",
  p: "¶",
  bullets: "•",
};

const PAGE_DIMS: Record<PageSize, { w: number; h: number; label: string }> = {
  a4: { w: 210, h: 297, label: "A4" },
  letter: { w: 215.9, h: 279.4, label: "Letter" },
};

const newBlock = (id: number, kind: BlockKind = "p", text = ""): Block => ({
  id,
  kind,
  text,
  align: "left",
  bold: false,
  italic: false,
  fontSize: 12,
});

const SAMPLE_TEXT: { kind: BlockKind; text: string }[] = [
  { kind: "h1", text: "My First PDF" },
  { kind: "p", text: "Built entirely in your browser with YATools — no upload, no watermark." },
  { kind: "h2", text: "What this shows" },
  {
    kind: "p",
    text: "Click any block to select it, then use the toolbar above to restyle it. Headings, bold, italic, alignment, and font size all update the live preview instantly.",
  },
  { kind: "h3", text: "Try the toolbar" },
  {
    kind: "bullets",
    text: "Select a block, then hit B or I for bold/italic\nSwitch alignment between left, center, and justify\nPress Enter inside a paragraph to split it into two blocks",
  },
  {
    kind: "p",
    text: "When you're happy, set a filename and page size below, then hit Download PDF.",
  },
];

/** Rough page estimate so the UI can show "≈ N pages" live. */
function estimatePages(blocks: Block[], pageSize: PageSize): number {
  const content = blocks.filter((b) => b.text.trim() !== "");
  if (content.length === 0) return 0;
  const { w, h } = PAGE_DIMS[pageSize];
  const printableW = w - 50.8;
  const printableH = h - 50.8;
  let lines = 0;
  for (const b of content) {
    const size = b.kind === "h1" ? b.fontSize + 6 : b.kind === "h2" ? b.fontSize + 3 : b.kind === "h3" ? b.fontSize + 1 : b.fontSize;
    const charW = size * 0.352778 * 0.52;
    const charsPerLine = Math.max(10, Math.floor(printableW / charW));
    const weight = b.kind === "p" ? 1 : 1.5;
    for (const line of b.text.split("\n")) {
      lines += Math.max(1, Math.ceil(Math.max(1, line.length) / charsPerLine)) * weight;
    }
    lines += 0.5; // block spacing
  }
  const linesPerPage = Math.max(1, Math.floor(printableH / (12 * 0.352778 * 1.3)));
  return Math.max(1, Math.ceil(lines / linesPerPage));
}

function sanitizeFileName(name: string): string {
  const clean =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "document";
  return `${clean}.pdf`;
}

const pt = (v: number) => `${(v * 1.3333).toFixed(1)}px`;

export default function TextToPdfClient() {
  const [blocks, setBlocks] = useState<Block[]>(() => [newBlock(1)]);
  const [activeId, setActiveId] = useState(1);
  const [docTitle, setDocTitle] = useState("My Document");
  const [fileName, setFileName] = useState("my-document");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [generating, setGenerating] = useState(false);
  const [lastPages, setLastPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(2);
  const taRefs = useRef(new Map<number, HTMLTextAreaElement>());

  const active = blocks.find((b) => b.id === activeId) ?? blocks[0];
  const hasContent = blocks.some((b) => b.text.trim() !== "");

  const estimate = useMemo(() => estimatePages(blocks, pageSize), [blocks, pageSize]);

  const updateBlock = (id: number, patch: Partial<Block>) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const insertBlockAfter = (afterId: number, block: Block) =>
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === afterId);
      const next = [...prev];
      next.splice(i + 1, 0, block);
      return next;
    });

  const addBlock = () => {
    const b = newBlock(nextId.current++);
    insertBlockAfter(active.id, b);
    setActiveId(b.id);
    requestAnimationFrame(() => taRefs.current.get(b.id)?.focus());
  };

  const deleteBlock = (id: number) => {
    setBlocks((prev) => {
      if (prev.length <= 1) return [newBlock(nextId.current++)];
      const i = prev.findIndex((b) => b.id === id);
      const next = prev.filter((b) => b.id !== id);
      const focusTarget = next[Math.max(0, i - 1)];
      setActiveId(focusTarget.id);
      requestAnimationFrame(() => {
        const el = taRefs.current.get(focusTarget.id);
        el?.focus();
        if (el) el.setSelectionRange(el.value.length, el.value.length);
      });
      return next;
    });
  };

  const splitBlock = (id: number, at: number) => {
    const b = blocks.find((x) => x.id === id);
    if (!b) return;
    const before = b.text.slice(0, at).replace(/\n$/, "");
    const after = b.text.slice(at).replace(/^\n/, "");
    const nb = newBlock(nextId.current++, "p", after);
    nb.align = b.align;
    nb.fontSize = b.fontSize;
    setBlocks((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const next = [...prev];
      next[i] = { ...b, text: before };
      next.splice(i + 1, 0, nb);
      return next;
    });
    setActiveId(nb.id);
    requestAnimationFrame(() => taRefs.current.get(nb.id)?.focus());
  };

  const onBlockKeyDown = (b: Block, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && b.kind !== "bullets") {
      e.preventDefault();
      splitBlock(b.id, e.currentTarget.selectionStart ?? b.text.length);
    } else if (e.key === "Backspace" && b.text === "" && blocks.length > 1) {
      e.preventDefault();
      deleteBlock(b.id);
    }
  };

  const loadSample = () => {
    const sample = SAMPLE_TEXT.map((s) => {
      const b = newBlock(nextId.current++, s.kind, s.text);
      return b;
    });
    setBlocks(sample);
    setActiveId(sample[0].id);
    setLastPages(null);
  };

  const clearAll = () => {
    const b = newBlock(nextId.current++);
    setBlocks([b]);
    setActiveId(b.id);
    setLastPages(null);
  };

  /* ---------------- PDF generation from the same block model ---------------- */
  const generate = async () => {
    if (!hasContent) {
      setError("Add some text first — there's nothing to turn into a PDF yet.");
      return;
    }
    setError(null);
    setGenerating(true);
    try {
      // Dynamic import keeps jsPDF out of the SSR bundle and the initial page load.
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: pageSize });
      const { w: pageW, h: pageH } = PAGE_DIMS[pageSize];
      const margin = 25.4;
      const maxW = pageW - margin * 2;
      const pageBottom = pageH - margin;
      let y = margin + 4;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageBottom) {
          doc.addPage();
          y = margin + 4;
        }
      };

      if (docTitle.trim() !== "") {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(active.fontSize + 6);
        const titleLines = doc.splitTextToSize(docTitle.trim(), maxW);
        const h = (active.fontSize + 6) * 0.352778 * 1.25;
        ensureSpace(titleLines.length * h);
        doc.text(titleLines, margin, y, { align: "center", maxWidth: maxW });
        y += titleLines.length * h + 6;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, margin + maxW, y);
        y += 6;
      }

      for (const b of blocks) {
        if (b.text.trim() === "") continue;
        const size =
          b.kind === "h1"
            ? b.fontSize + 6
            : b.kind === "h2"
              ? b.fontSize + 3
              : b.kind === "h3"
                ? b.fontSize + 1
                : b.fontSize;
        const isHeading = b.kind !== "p" && b.kind !== "bullets";
        const style =
          isHeading || b.bold
            ? b.italic
              ? "bolditalic"
              : "bold"
            : b.italic
              ? "italic"
              : "normal";
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
        const lineH = size * 0.352778 * 1.3;
        const align = b.align;

        if (b.kind === "bullets") {
          const items = b.text.split("\n").filter((l) => l.trim() !== "");
          y += 2;
          for (const item of items) {
            const lines = doc.splitTextToSize(item.trim(), maxW - 9);
            ensureSpace(lines.length * lineH);
            doc.text("•", margin + 2, y);
            doc.text(lines, margin + 9, y, { align, maxWidth: maxW - 9 });
            y += lines.length * lineH;
          }
          y += 2;
        } else {
          const lines = doc.splitTextToSize(b.text.trim(), maxW);
          if (isHeading) y += 2;
          ensureSpace(lines.length * lineH + (isHeading ? 2 : 0));
          doc.text(lines, margin, y, { align, maxWidth: maxW });
          y += lines.length * lineH + (isHeading ? 2 : 3);
        }
      }

      doc.save(sanitizeFileName(fileName));
      setLastPages(doc.getNumberOfPages());
    } catch {
      setError(
        "PDF generation failed in your browser. Try refreshing the page or using a Chromium-based browser."
      );
    } finally {
      setGenerating(false);
    }
  };

  const toolBtn = (on: boolean, label: string): React.CSSProperties => ({
    padding: "7px 11px",
    borderRadius: 9,
    border: "2px solid var(--ink)",
    background: on ? "var(--ink)" : "var(--surface)",
    color: on ? "var(--paper)" : "var(--text)",
    fontWeight: 800,
    fontSize: "0.8rem",
    cursor: "pointer",
    lineHeight: 1,
  });

  const previewBlocks: { kind: BlockKind; text: string; align: Align; bold: boolean; italic: boolean; fontSize: number }[] = hasContent
    ? blocks.filter((b) => b.text.trim() !== "")
    : SAMPLE_TEXT.map((s) => ({ ...s, align: "left" as Align, bold: false, italic: false, fontSize: 12 }));

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      {/* ------- Document options ------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <label className="neu-label" htmlFor="ttp-title">Document title</label>
          <input
            id="ttp-title"
            className="neu-input"
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="My Document"
            maxLength={120}
          />
        </div>
        <div>
          <label className="neu-label" htmlFor="ttp-filename">Filename</label>
          <input
            id="ttp-filename"
            className="neu-input neu-input-mono"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="my-document"
            maxLength={80}
          />
        </div>
        <div>
          <label className="neu-label" htmlFor="ttp-pagesize">Page size</label>
          <select
            id="ttp-pagesize"
            className="neu-select"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
          >
            <option value="a4">A4 (210 × 297 mm)</option>
            <option value="letter">Letter (8.5 × 11 in)</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "end", gap: 8 }}>
          <button type="button" className="neu-btn neu-btn-sm" onClick={loadSample}>
            Load sample
          </button>
          <button type="button" className="neu-btn neu-btn-sm" onClick={clearAll} disabled={!hasContent}>
            Clear
          </button>
        </div>
      </div>

      {/* ------- Editor + live preview ------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* Editor */}
        <div>
          <p className="neu-label">Editor — click a block, then style it</p>

          {/* Formatting toolbar */}
          <div
            role="toolbar"
            aria-label="Text formatting"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              alignItems: "center",
              border: "2.5px solid var(--ink)",
              borderRadius: 12,
              padding: 8,
              background: "var(--paper2)",
              marginBottom: 10,
              position: "sticky",
              top: 76,
              zIndex: 5,
            }}
          >
            {(["h1", "h2", "h3", "p", "bullets"] as BlockKind[]).map((k) => (
              <button
                key={k}
                type="button"
                title={k === "p" ? "Paragraph" : k === "bullets" ? "Bullet list" : `Heading ${k.slice(1)}`}
                style={toolBtn(active.kind === k, k)}
                aria-pressed={active.kind === k}
                onClick={() => updateBlock(active.id, { kind: k })}
              >
                {k === "p" ? "¶" : k === "bullets" ? "• List" : k.toUpperCase()}
              </button>
            ))}
            <span aria-hidden="true" style={{ width: 2, alignSelf: "stretch", background: "var(--ink)", opacity: 0.25 }} />
            <button
              type="button"
              title="Bold"
              style={{ ...toolBtn(active.bold, "B"), fontWeight: 900 }}
              aria-pressed={active.bold}
              onClick={() => updateBlock(active.id, { bold: !active.bold })}
            >
              B
            </button>
            <button
              type="button"
              title="Italic"
              style={{ ...toolBtn(active.italic, "I"), fontStyle: "italic" }}
              aria-pressed={active.italic}
              onClick={() => updateBlock(active.id, { italic: !active.italic })}
            >
              I
            </button>
            <span aria-hidden="true" style={{ width: 2, alignSelf: "stretch", background: "var(--ink)", opacity: 0.25 }} />
            {(["left", "center", "justify"] as Align[]).map((a) => (
              <button
                key={a}
                type="button"
                title={`Align ${a}`}
                style={toolBtn(active.align === a, a)}
                aria-pressed={active.align === a}
                onClick={() => updateBlock(active.id, { align: a })}
              >
                {a === "left" ? "Left" : a === "center" ? "Center" : "Justify"}
              </button>
            ))}
            <select
              aria-label="Font size"
              value={active.fontSize}
              onChange={(e) => updateBlock(active.id, { fontSize: Number(e.target.value) })}
              style={{
                border: "2px solid var(--ink)",
                borderRadius: 9,
                padding: "7px 8px",
                background: "var(--surface)",
                color: "var(--text)",
                fontWeight: 800,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              {[10, 11, 12, 14, 16].map((s) => (
                <option key={s} value={s}>{s} pt</option>
              ))}
            </select>
            <button type="button" className="neu-btn neu-btn-sm" onClick={addBlock} title="Add a new block below">
              + Block
            </button>
          </div>

          {/* Blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {blocks.map((b) => (
              <div
                key={b.id}
                onFocus={() => setActiveId(b.id)}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  border: b.id === activeId ? "2.5px solid var(--red)" : "2.5px solid var(--ink)",
                  borderRadius: 12,
                  background: "var(--surface)",
                  boxShadow: b.id === activeId ? "4px 4px 0 var(--ink)" : "3px 3px 0 var(--ink)",
                  padding: "8px 8px 8px 10px",
                  transition: "box-shadow 0.12s ease, border-color 0.12s ease",
                }}
              >
                <span
                  className="font-mono2"
                  aria-hidden="true"
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "var(--red-dark)",
                    paddingTop: 10,
                    minWidth: 30,
                  }}
                >
                  {KIND_LABEL[b.kind]}
                </span>
                <AutoTextarea
                  value={b.text}
                  placeholder={
                    b.kind === "bullets"
                      ? "One bullet per line…"
                      : b.kind === "h1"
                        ? "Main heading…"
                        : b.kind === "h2" || b.kind === "h3"
                          ? "Sub-heading…"
                          : "Write something… (Enter splits the block)"
                  }
                  onChange={(v) => updateBlock(b.id, { text: v })}
                  onKeyDown={(e) => onBlockKeyDown(b, e)}
                  inputRef={(el) => {
                    if (el) taRefs.current.set(b.id, el);
                    else taRefs.current.delete(b.id);
                  }}
                  fontSizePt={b.fontSize}
                  bold={b.kind !== "p" && b.kind !== "bullets" ? true : b.bold}
                />
                <button
                  type="button"
                  onClick={() => deleteBlock(b.id)}
                  title="Delete block"
                  aria-label="Delete block"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "var(--muted)",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    padding: "6px 4px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 10 }}>
            Tip: press <kbd className="font-mono2">Enter</kbd> inside a paragraph to split it;
            empty a block and hit <kbd className="font-mono2">Backspace</kbd> to remove it.
          </p>
        </div>

        {/* Live preview */}
        <div>
          <p className="neu-label">
            Live preview
            <span className="font-mono2" style={{ marginLeft: 8, color: "var(--muted)", textTransform: "none" }}>
              {PAGE_DIMS[pageSize].label}
            </span>
          </p>
          <div
            aria-live="polite"
            style={{
              border: "2.5px solid var(--ink)",
              borderRadius: 16,
              background: "var(--surface)",
              boxShadow: "8px 8px 0 var(--ink)",
              padding: "clamp(18px, 3vw, 30px)",
              minHeight: 320,
              position: "relative",
            }}
          >
            {!hasContent && (
              <span
                className="font-mono2"
                style={{
                  position: "absolute",
                  top: 10,
                  right: 12,
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: "var(--paper2)",
                  border: "2px solid var(--ink)",
                  borderRadius: 999,
                  padding: "3px 10px",
                  color: "var(--text2)",
                }}
              >
                Sample preview
              </span>
            )}
            {docTitle.trim() !== "" && (
              <>
                <div
                  style={{
                    fontSize: pt(active.fontSize + 6),
                    fontWeight: 800,
                    textAlign: "center",
                    lineHeight: 1.25,
                    marginBottom: 6,
                  }}
                >
                  {hasContent ? docTitle.trim() : "My First PDF"}
                </div>
                <hr style={{ border: "none", borderTop: "2px solid var(--line)", margin: "0 0 14px" }} />
              </>
            )}
            {previewBlocks.map((b, i) => {
              const sizePx = pt(
                b.kind === "h1" ? b.fontSize + 6 : b.kind === "h2" ? b.fontSize + 3 : b.kind === "h3" ? b.fontSize + 1 : b.fontSize
              );
              const isHeading = b.kind === "h1" || b.kind === "h2" || b.kind === "h3";
              const style: React.CSSProperties = {
                fontSize: sizePx,
                fontWeight: isHeading || b.bold ? 800 : 400,
                fontStyle: b.italic ? "italic" : "normal",
                textAlign: b.align,
                lineHeight: 1.5,
                margin: isHeading ? "14px 0 6px" : "0 0 10px",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
              };
              if (b.kind === "bullets") {
                return (
                  <ul key={i} style={{ ...style, paddingLeft: 22, listStyle: "disc" }}>
                    {b.text.split("\n").filter((l) => l.trim() !== "").map((l, j) => (
                      <li key={j} style={{ marginBottom: 4 }}>{l.trim()}</li>
                    ))}
                  </ul>
                );
              }
              const Tag = b.kind === "h1" ? "h3" : b.kind === "h2" ? "h4" : b.kind === "h3" ? "h5" : "p";
              return <Tag key={i} style={style}>{b.text}</Tag>;
            })}
            {!hasContent && (
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 14 }}>
                This is a sample so the preview never looks broken — start typing in the editor
                and your words take over instantly.
              </p>
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 16 }}>
            <button
              type="button"
              className="neu-btn neu-btn-primary"
              onClick={generate}
              disabled={generating || !hasContent}
            >
              {generating ? "Building PDF…" : "Download PDF"}
            </button>
            <div className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--text2)" }} aria-live="polite">
              {estimate === 0
                ? `${PAGE_DIMS[pageSize].label} · no pages yet`
                : `${PAGE_DIMS[pageSize].label} · ≈ ${estimate} page${estimate === 1 ? "" : "s"} estimated`}
              {lastPages !== null && hasContent && ` · last export: ${lastPages} page${lastPages === 1 ? "" : "s"}`}
            </div>
          </div>
          {error && (
            <div className="notice" style={{ marginTop: 14 }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Textarea that grows with its content. */
function AutoTextarea({
  value,
  placeholder,
  onChange,
  onKeyDown,
  inputRef,
  fontSizePt,
  bold,
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  inputRef: (el: HTMLTextAreaElement | null) => void;
  fontSizePt: number;
  bold: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(44, el.scrollHeight)}px`;
  }, [value, fontSizePt]);

  return (
    <textarea
      ref={(el) => {
        ref.current = el;
        inputRef(el);
      }}
      value={value}
      placeholder={placeholder}
      rows={1}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      style={{
        flex: 1,
        border: "none",
        outline: "none",
        resize: "none",
        overflow: "hidden",
        background: "transparent",
        color: "var(--text)",
        fontFamily: "inherit",
        fontSize: pt(fontSizePt),
        fontWeight: bold ? 800 : 400,
        lineHeight: 1.5,
        padding: "8px 2px",
        minHeight: 44,
      }}
    />
  );
}
