"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Align = "left" | "center" | "justify";
type BlockKind =
  | "h1"
  | "h2"
  | "h3"
  | "p"
  | "bullets"
  | "numbered"
  | "quote"
  | "checklist"
  | "divider"
  | "pagebreak";
type PageSize = "a4" | "letter" | "legal" | "a5";
type FontFamily = "helvetica" | "times" | "courier";
type MarginPreset = "narrow" | "normal" | "wide" | "custom";
type PageNumFormat = "off" | "plain" | "pageof" | "dash";
type StampKind = "none" | "DRAFT" | "APPROVED" | "PAID" | "IN REVIEW" | "REJECTED";
type WatermarkPattern = "diagonal" | "repeat";

interface Block {
  id: number;
  kind: BlockKind;
  text: string;
  align: Align;
  bold: boolean;
  italic: boolean;
  fontSize: number;
}

interface DocSettings {
  fontFamily: FontFamily;
  landscape: boolean;
  marginPreset: MarginPreset;
  marginCustom: number;
  lineSpacing: number;
  paraSpacing: number;
  bgEnabled: boolean;
  bgColor: string;
  textColor: string;
  indentFirst: number;
  headerText: string;
  headerAlign: Align;
  footerText: string;
  pageNumbers: PageNumFormat;
  watermarkText: string;
  watermarkOpacity: number;
  watermarkPattern: WatermarkPattern;
  stamp: StampKind;
  author: string;
  subject: string;
  keywords: string;
}

const DEFAULT_SETTINGS: DocSettings = {
  fontFamily: "helvetica",
  landscape: false,
  marginPreset: "normal",
  marginCustom: 20,
  lineSpacing: 1.3,
  paraSpacing: 3,
  bgEnabled: false,
  bgColor: "#fdf6e3",
  textColor: "#141210",
  indentFirst: 0,
  headerText: "",
  headerAlign: "center",
  footerText: "",
  pageNumbers: "off",
  watermarkText: "",
  watermarkOpacity: 0.15,
  watermarkPattern: "diagonal",
  stamp: "none",
  author: "",
  subject: "",
  keywords: "",
};

const KIND_LABEL: Record<BlockKind, string> = {
  h1: "H1",
  h2: "H2",
  h3: "H3",
  p: "¶",
  bullets: "•",
  numbered: "1.",
  quote: "❝",
  checklist: "☑",
  divider: "―",
  pagebreak: "PB",
};

const PAGE_DIMS: Record<PageSize, { w: number; h: number; label: string }> = {
  a4: { w: 210, h: 297, label: "A4" },
  letter: { w: 215.9, h: 279.4, label: "Letter" },
  legal: { w: 215.9, h: 355.6, label: "Legal" },
  a5: { w: 148, h: 210, label: "A5" },
};

const MARGIN_MM: Record<Exclude<MarginPreset, "custom">, number> = {
  narrow: 12.7,
  normal: 25.4,
  wide: 38.1,
};

const STAMP_COLORS: Record<Exclude<StampKind, "none">, string> = {
  DRAFT: "#b8860b",
  APPROVED: "#1e7a3c",
  PAID: "#1e7a3c",
  "IN REVIEW": "#1663c7",
  REJECTED: "#e0263c",
};

const FONT_CSS: Record<FontFamily, string> = {
  helvetica: "'DM Sans', Arial, sans-serif",
  times: "Georgia, 'Times New Roman', serif",
  courier: "'DM Mono', 'Courier New', monospace",
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
  { kind: "p", text: "Built entirely in your browser with YATools — no upload, no watermark unless you add one yourself." },
  { kind: "h2", text: "What this shows" },
  {
    kind: "p",
    text: "Click any block to select it, then use the toolbar to restyle it. Headings, lists, quotes, checklists, bold, italic, alignment, and font size all update the live preview instantly.",
  },
  { kind: "h3", text: "Try the toolbar" },
  {
    kind: "bullets",
    text: "Select a block, then hit B or I for bold/italic\nSwitch alignment between left, center, and justify\nPress Enter inside a paragraph to split it into two blocks",
  },
  { kind: "checklist", text: "[x] Open Advanced PDF settings\n[ ] Add a watermark and page numbers\n[ ] Download the finished PDF" },
  {
    kind: "p",
    text: "When you're happy, set a filename below, open Advanced PDF settings for fonts, margins, headers, watermarks and more, then hit Download PDF.",
  },
];

const TEMPLATES: { name: string; title: string; blocks: { kind: BlockKind; text: string }[] }[] = [
  {
    name: "Formal letter",
    title: "Business Letter",
    blocks: [
      { kind: "p", text: "Dear Sir/Madam," },
      { kind: "p", text: "I am writing to…" },
      { kind: "p", text: "Thank you for your time and consideration. I look forward to your reply." },
      { kind: "p", text: "Yours faithfully,\nYour Name" },
    ],
  },
  {
    name: "Meeting notes",
    title: "Meeting Notes",
    blocks: [
      { kind: "h1", text: "Meeting Notes" },
      { kind: "p", text: "Date: \nAttendees: " },
      { kind: "h2", text: "Discussion points" },
      { kind: "bullets", text: "Point one\nPoint two" },
      { kind: "h2", text: "Action items" },
      { kind: "checklist", text: "[ ] First task — owner, deadline\n[ ] Second task — owner, deadline" },
    ],
  },
  {
    name: "Simple report",
    title: "Report",
    blocks: [
      { kind: "h1", text: "Report Title" },
      { kind: "h2", text: "Summary" },
      { kind: "p", text: "A short summary of what this report covers." },
      { kind: "h2", text: "Findings" },
      { kind: "numbered", text: "First finding\nSecond finding\nThird finding" },
      { kind: "h2", text: "Conclusion" },
      { kind: "p", text: "What the findings mean and what happens next." },
    ],
  },
];

/** Parse imported .txt/.md text into blocks (light Markdown awareness). */
function parseImported(text: string, startId: number): Block[] {
  const out: Block[] = [];
  let id = startId;
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  let buf: string[] = [];
  let bufKind: BlockKind = "p";
  const flush = () => {
    if (buf.length === 0) return;
    out.push(newBlock(id++, bufKind, buf.join("\n")));
    buf = [];
    bufKind = "p";
  };
  for (const raw of lines) {
    const line = raw;
    const t = line.trim();
    if (t === "") {
      flush();
      continue;
    }
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(t)) {
      flush();
      out.push(newBlock(id++, "divider"));
      continue;
    }
    const h = t.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flush();
      out.push(newBlock(id++, h[1].length === 1 ? "h1" : h[1].length === 2 ? "h2" : "h3", h[2]));
      continue;
    }
    if (/^>\s?/.test(t)) {
      if (bufKind !== "quote") flush();
      bufKind = "quote";
      buf.push(t.replace(/^>\s?/, ""));
      continue;
    }
    if (/^[-*]\s+\[[ xX]\]\s+/.test(t)) {
      if (bufKind !== "checklist") flush();
      bufKind = "checklist";
      buf.push(t.replace(/^[-*]\s+/, ""));
      continue;
    }
    if (/^[-*•]\s+/.test(t)) {
      if (bufKind !== "bullets") flush();
      bufKind = "bullets";
      buf.push(t.replace(/^[-*•]\s+/, ""));
      continue;
    }
    if (/^\d+[.)]\s+/.test(t)) {
      if (bufKind !== "numbered") flush();
      bufKind = "numbered";
      buf.push(t.replace(/^\d+[.)]\s+/, ""));
      continue;
    }
    if (bufKind !== "p") flush();
    bufKind = "p";
    buf.push(line);
  }
  flush();
  return out.length ? out : [newBlock(id, "p", text.trim())];
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "").match(/^([0-9a-f]{6})$/i);
  if (!m) return [20, 18, 16];
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Blend fg over bg by alpha (0..1) — used for watermarks/muted text without GState. */
function blend(fg: [number, number, number], bg: [number, number, number], alpha: number): [number, number, number] {
  return [
    Math.round(fg[0] * alpha + bg[0] * (1 - alpha)),
    Math.round(fg[1] * alpha + bg[1] * (1 - alpha)),
    Math.round(fg[2] * alpha + bg[2] * (1 - alpha)),
  ];
}

/** Rough page estimate so the UI can show "≈ N pages" live. */
function estimatePages(blocks: Block[], settings: DocSettings, pageSize: PageSize): number {
  const content = blocks.filter((b) => b.kind === "divider" || b.kind === "pagebreak" || b.text.trim() !== "");
  if (content.length === 0) return 0;
  const dims = PAGE_DIMS[pageSize];
  const pageW = settings.landscape ? dims.h : dims.w;
  const pageH = settings.landscape ? dims.w : dims.h;
  const margin = settings.marginPreset === "custom" ? settings.marginCustom : MARGIN_MM[settings.marginPreset];
  const printableW = pageW - margin * 2;
  const printableH = pageH - margin * 2;
  let lines = 0;
  let breaks = 0;
  for (const b of content) {
    if (b.kind === "pagebreak") {
      breaks++;
      continue;
    }
    if (b.kind === "divider") {
      lines += 1;
      continue;
    }
    const size = b.kind === "h1" ? b.fontSize + 6 : b.kind === "h2" ? b.fontSize + 3 : b.kind === "h3" ? b.fontSize + 1 : b.fontSize;
    const charW = size * 0.352778 * 0.52;
    const charsPerLine = Math.max(10, Math.floor(printableW / charW));
    const weight = b.kind === "p" || b.kind === "quote" ? 1 : 1.4;
    for (const line of b.text.split("\n")) {
      lines += Math.max(1, Math.ceil(Math.max(1, line.length) / charsPerLine)) * weight;
    }
    lines += 0.4;
  }
  const linesPerPage = Math.max(1, Math.floor(printableH / (12 * 0.352778 * settings.lineSpacing)));
  return Math.max(1, Math.ceil(lines / linesPerPage) + breaks);
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
  const [settings, setSettings] = useState<DocSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [lastPages, setLastPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(2);
  const taRefs = useRef(new Map<number, HTMLTextAreaElement>());
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof DocSettings>(k: K, v: DocSettings[K]) =>
    setSettings((prev) => ({ ...prev, [k]: v }));

  const active = blocks.find((b) => b.id === activeId) ?? blocks[0];
  const hasContent = blocks.some((b) => b.text.trim() !== "");
  const wordCount = useMemo(
    () =>
      blocks
        .map((b) => b.text)
        .join(" ")
        .split(/\s+/)
        .filter(Boolean).length,
    [blocks]
  );
  const charCount = useMemo(() => blocks.map((b) => b.text).join("\n").length, [blocks]);

  const estimate = useMemo(
    () => estimatePages(blocks, settings, pageSize),
    [blocks, settings, pageSize]
  );

  const updateBlock = (id: number, patch: Partial<Block>) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const insertBlockAfter = (afterId: number, block: Block) =>
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === afterId);
      const next = [...prev];
      next.splice(i + 1, 0, block);
      return next;
    });

  const addBlock = (kind: BlockKind = "p") => {
    const b = newBlock(nextId.current++, kind);
    insertBlockAfter(active.id, b);
    setActiveId(b.id);
    if (kind !== "divider" && kind !== "pagebreak") {
      requestAnimationFrame(() => taRefs.current.get(b.id)?.focus());
    }
  };

  const moveBlock = (id: number, dir: -1 | 1) =>
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

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
    if (e.key === "Enter" && !e.shiftKey && b.kind !== "bullets" && b.kind !== "numbered" && b.kind !== "checklist") {
      e.preventDefault();
      splitBlock(b.id, e.currentTarget.selectionStart ?? b.text.length);
    } else if (e.key === "Backspace" && b.text === "" && blocks.length > 1) {
      e.preventDefault();
      deleteBlock(b.id);
    }
  };

  const loadBlocks = (list: { kind: BlockKind; text: string }[], title?: string) => {
    const made = list.map((s) => newBlock(nextId.current++, s.kind, s.text));
    setBlocks(made);
    setActiveId(made[0].id);
    if (title) {
      setDocTitle(title);
      setFileName(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
    setLastPages(null);
  };

  const loadSample = () => loadBlocks(SAMPLE_TEXT);

  const loadTemplate = (name: string) => {
    const t = TEMPLATES.find((x) => x.name === name);
    if (t) loadBlocks(t.blocks, t.title);
  };

  const clearAll = () => {
    const b = newBlock(nextId.current++);
    setBlocks([b]);
    setActiveId(b.id);
    setLastPages(null);
  };

  const onImportFile = async (f: File) => {
    setError(null);
    try {
      const text = await f.text();
      if (!text.trim()) {
        setError("That file looks empty — nothing to import.");
        return;
      }
      const parsed = parseImported(text, nextId.current);
      nextId.current += parsed.length + 1;
      setBlocks(parsed);
      setActiveId(parsed[0].id);
      const base = f.name.replace(/\.(txt|md|markdown)$/i, "");
      if (base) {
        setDocTitle(base.replace(/[-_]+/g, " "));
        setFileName(base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "document");
      }
      setLastPages(null);
    } catch {
      setError("That file couldn't be read. Plain .txt and .md files work best.");
    }
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
      const { jsPDF } = await import("jspdf");
      const dims = PAGE_DIMS[pageSize];
      const pageW = settings.landscape ? dims.h : dims.w;
      const pageH = settings.landscape ? dims.w : dims.h;
      const doc = new jsPDF({
        unit: "mm",
        format: [pageW, pageH],
        orientation: settings.landscape ? "landscape" : "portrait",
      });
      doc.setProperties({
        title: docTitle.trim() || fileName,
        author: settings.author.trim(),
        subject: settings.subject.trim(),
        keywords: settings.keywords.trim(),
        creator: "YATools Text to PDF",
      });

      const margin =
        settings.marginPreset === "custom" ? settings.marginCustom : MARGIN_MM[settings.marginPreset];
      const maxW = pageW - margin * 2;
      const ink = hexToRgb(settings.textColor);
      const bgRgb: [number, number, number] = settings.bgEnabled ? hexToRgb(settings.bgColor) : [255, 255, 255];
      const muted = blend(ink, bgRgb, 0.62);
      const topStart = margin + (settings.headerText.trim() ? 7 : 0) + 4;
      const pageBottom = pageH - margin;
      let y = topStart;

      const paintBg = () => {
        if (settings.bgEnabled) {
          doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
          doc.rect(0, 0, pageW, pageH, "F");
        }
      };
      const newPage = () => {
        doc.addPage([pageW, pageH], settings.landscape ? "landscape" : "portrait");
        paintBg();
        y = topStart;
      };
      paintBg();

      const ensureSpace = (needed: number) => {
        if (y + needed > pageBottom) newPage();
      };

      if (docTitle.trim() !== "") {
        doc.setFont(settings.fontFamily, "bold");
        doc.setFontSize(18);
        doc.setTextColor(ink[0], ink[1], ink[2]);
        const titleLines = doc.splitTextToSize(docTitle.trim(), maxW);
        const h = 18 * 0.352778 * 1.25;
        ensureSpace(titleLines.length * h + 12);
        doc.text(titleLines, pageW / 2, y, { align: "center", maxWidth: maxW });
        y += titleLines.length * h + 6;
        doc.setDrawColor(muted[0], muted[1], muted[2]);
        doc.setLineWidth(0.4);
        doc.line(margin, y, margin + maxW, y);
        y += 7;
      }

      const styleFor = (b: Block): string => {
        const isHeading = b.kind === "h1" || b.kind === "h2" || b.kind === "h3";
        const bold = isHeading || b.bold;
        const italic = b.italic || b.kind === "quote";
        return bold ? (italic ? "bolditalic" : "bold") : italic ? "italic" : "normal";
      };
      const sizeFor = (b: Block): number =>
        b.kind === "h1"
          ? b.fontSize + 6
          : b.kind === "h2"
            ? b.fontSize + 3
            : b.kind === "h3"
              ? b.fontSize + 1
              : b.fontSize;

      for (const b of blocks) {
        if (b.kind === "pagebreak") {
          newPage();
          continue;
        }
        if (b.kind === "divider") {
          ensureSpace(8);
          y += 3;
          doc.setDrawColor(muted[0], muted[1], muted[2]);
          doc.setLineWidth(0.4);
          doc.line(margin, y, margin + maxW, y);
          y += 5 + settings.paraSpacing;
          continue;
        }
        if (b.text.trim() === "") continue;

        const size = sizeFor(b);
        const isHeading = b.kind === "h1" || b.kind === "h2" || b.kind === "h3";
        doc.setFont(settings.fontFamily, styleFor(b));
        doc.setFontSize(size);
        doc.setTextColor(ink[0], ink[1], ink[2]);
        const lineH = size * 0.352778 * settings.lineSpacing;
        const items = b.text.split("\n").filter((l) => l.trim() !== "");

        if (b.kind === "bullets" || b.kind === "numbered" || b.kind === "checklist") {
          y += 1;
          items.forEach((item, idx) => {
            const raw = item.trim();
            const checked = /^\[x\]\s*/i.test(raw);
            const clean = b.kind === "checklist" ? raw.replace(/^\[[ xX]\]\s*/, "") : raw;
            const indent = b.kind === "checklist" ? 9 : 9;
            const lines = doc.splitTextToSize(clean, maxW - indent);
            ensureSpace(lines.length * lineH);
            if (b.kind === "bullets") {
              doc.text("•", margin + 2, y);
            } else if (b.kind === "numbered") {
              doc.text(`${idx + 1}.`, margin + 1, y);
            } else {
              const s = Math.min(4.4, lineH * 0.62);
              const bx = margin + 1;
              const by = y - s - lineH * 0.14;
              doc.setDrawColor(ink[0], ink[1], ink[2]);
              doc.setLineWidth(0.35);
              doc.rect(bx, by, s, s);
              if (checked) {
                doc.setLineWidth(0.5);
                doc.line(bx + 0.8, by + s * 0.52, bx + s * 0.42, by + s - 0.8);
                doc.line(bx + s * 0.42, by + s - 0.8, bx + s - 0.7, by + 0.8);
              }
              doc.setDrawColor(ink[0], ink[1], ink[2]);
            }
            doc.text(lines, margin + indent, y, { align: "left", maxWidth: maxW - indent });
            y += lines.length * lineH;
          });
          y += 1 + settings.paraSpacing;
        } else if (b.kind === "quote") {
          const lines = doc.splitTextToSize(b.text.trim(), maxW - 8);
          ensureSpace(lines.length * lineH);
          const startY = y;
          doc.setTextColor(muted[0], muted[1], muted[2]);
          doc.text(lines, margin + 8, y, { align: "left", maxWidth: maxW - 8 });
          doc.setFillColor(muted[0], muted[1], muted[2]);
          doc.rect(margin, startY - lineH * 0.78, 1.1, lines.length * lineH + lineH * 0.3, "F");
          doc.setTextColor(ink[0], ink[1], ink[2]);
          y += lines.length * lineH + settings.paraSpacing;
        } else {
          const isPara = b.kind === "p";
          const indent = isPara && b.align === "left" ? settings.indentFirst : 0;
          const lines = doc.splitTextToSize(b.text.trim(), maxW - indent);
          if (isHeading) y += 2;
          ensureSpace(lines.length * lineH + (isHeading ? 2 : 0));
          if (indent > 0 && lines.length > 0) {
            // True first-line indent: line 1 starts further right, the rest at the margin.
            doc.text(lines[0], margin + indent, y, { align: "left", maxWidth: maxW - indent });
            if (lines.length > 1) {
              doc.text(lines.slice(1), margin, y + lineH, { align: "left", maxWidth: maxW });
            }
          } else {
            const opts: { align: Align; maxWidth: number } = { align: b.align, maxWidth: maxW };
            doc.text(lines, b.align === "left" ? margin : b.align === "center" ? pageW / 2 : margin, y, opts);
          }
          y += lines.length * lineH + (isHeading ? 2 : settings.paraSpacing);
        }
      }

      /* ---- Post-pass: header, footer, page numbers, watermark, stamp on every page ---- */
      const total = doc.getNumberOfPages();
      const wmText = settings.watermarkText.trim();
      const stampText = settings.stamp;
      for (let p = 1; p <= total; p++) {
        doc.setPage(p);

        if (wmText) {
          const wmBase = hexToRgb("#808080");
          const wmCol = blend(wmBase, bgRgb, settings.watermarkOpacity);
          doc.setTextColor(wmCol[0], wmCol[1], wmCol[2]);
          doc.setFont(settings.fontFamily, "bold");
          let fs = 64;
          doc.setFontSize(fs);
          const tw = doc.getTextWidth(wmText);
          const target = pageW * 0.82;
          if (tw > target) {
            fs = Math.max(14, Math.floor((fs * target) / tw));
            doc.setFontSize(fs);
          }
          if (settings.watermarkPattern === "diagonal") {
            doc.text(wmText, pageW / 2, pageH / 2, { align: "center", angle: 45 });
          } else {
            for (let gx = 1; gx <= 3; gx++) {
              for (let gy = 1; gy <= 3; gy++) {
                doc.text(wmText, (pageW / 4) * gx, (pageH / 4) * gy, { align: "center", angle: 45 });
              }
            }
          }
        }

        if (stampText !== "none") {
          const col = hexToRgb(STAMP_COLORS[stampText]);
          doc.setFont(settings.fontFamily, "bold");
          doc.setFontSize(13);
          const w = doc.getTextWidth(stampText) + 12;
          const sx = pageW - margin - w;
          const sy = Math.max(8, margin - 15);
          doc.setDrawColor(col[0], col[1], col[2]);
          doc.setLineWidth(0.7);
          doc.roundedRect(sx, sy, w, 10, 1.6, 1.6, "S");
          doc.setTextColor(col[0], col[1], col[2]);
          doc.text(stampText, sx + w / 2, sy + 6.9, { align: "center" });
        }

        if (settings.headerText.trim()) {
          doc.setFont(settings.fontFamily, "normal");
          doc.setFontSize(9);
          doc.setTextColor(muted[0], muted[1], muted[2]);
          const hx =
            settings.headerAlign === "left"
              ? margin
              : settings.headerAlign === "center"
                ? pageW / 2
                : pageW - margin;
          const ha: Align = settings.headerAlign === "justify" ? "left" : settings.headerAlign;
          doc.text(settings.headerText.trim(), hx, Math.max(9, margin - 6), { align: ha });
        }

        if (settings.footerText.trim()) {
          doc.setFont(settings.fontFamily, "normal");
          doc.setFontSize(9);
          doc.setTextColor(muted[0], muted[1], muted[2]);
          doc.text(settings.footerText.trim(), margin, pageH - Math.max(8, margin - 8), { align: "left" });
        }

        if (settings.pageNumbers !== "off") {
          const label =
            settings.pageNumbers === "plain"
              ? `${p}`
              : settings.pageNumbers === "pageof"
                ? `Page ${p} of ${total}`
                : `– ${p} –`;
          doc.setFont(settings.fontFamily, "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(muted[0], muted[1], muted[2]);
          doc.text(label, pageW / 2, pageH - Math.max(8, margin - 8), { align: "center" });
        }
      }

      doc.save(sanitizeFileName(fileName));
      setLastPages(total);
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
    border: "1px solid var(--line)",
    background: on ? "var(--text)" : "var(--surface)",
    color: on ? "var(--bg)" : "var(--text)",
    fontWeight: 800,
    fontSize: "0.8rem",
    cursor: "pointer",
    lineHeight: 1,
  });

  const dims = PAGE_DIMS[pageSize];
  const pageW = settings.landscape ? dims.h : dims.w;
  const pageH = settings.landscape ? dims.w : dims.h;
  const marginMm =
    settings.marginPreset === "custom" ? settings.marginCustom : MARGIN_MM[settings.marginPreset];
  const inkCss = settings.textColor;
  const bgCss = settings.bgEnabled ? settings.bgColor : "var(--surface)";

  const previewBlocks: Block[] = hasContent
    ? blocks.filter((b) => b.kind === "divider" || b.kind === "pagebreak" || b.text.trim() !== "")
    : SAMPLE_TEXT.map((s, i) => ({ ...newBlock(9000 + i, s.kind, s.text) }));

  const selStyle: React.CSSProperties = {
    border: "1px solid var(--line)",
    borderRadius: 9,
    padding: "7px 8px",
    background: "var(--surface)",
    color: "var(--text)",
    fontWeight: 700,
    fontSize: "0.82rem",
    width: "100%",
  };
  const rangeRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 };
  const colorInput: React.CSSProperties = {
    width: 46,
    height: 34,
    padding: 2,
    border: "1px solid var(--line)",
    borderRadius: 9,
    background: "var(--surface)",
    cursor: "pointer",
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={fileRef}
        type="file"
        accept=".txt,.md,.markdown,text/plain"
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) onImportFile(e.target.files[0]);
          e.target.value = "";
        }}
      />

      {/* ------- Document options ------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div>
          <label className="field-label" htmlFor="ttp-title">Document title</label>
          <input
            id="ttp-title"
            className="input"
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="My Document"
            maxLength={120}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="ttp-filename">Filename</label>
          <input
            id="ttp-filename"
            className="input input-mono"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="my-document"
            maxLength={80}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="ttp-pagesize">Page size</label>
          <select
            id="ttp-pagesize"
            className="select"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
          >
            <option value="a4">A4 (210 × 297 mm)</option>
            <option value="letter">Letter (8.5 × 11 in)</option>
            <option value="legal">Legal (8.5 × 14 in)</option>
            <option value="a5">A5 (148 × 210 mm)</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="ttp-template">Start from</label>
          <div style={{ display: "flex", gap: 8 }}>
            <select
              id="ttp-template"
              className="select"
              value=""
              onChange={(e) => {
                if (e.target.value === "sample") loadSample();
                else if (e.target.value) loadTemplate(e.target.value);
              }}
            >
              <option value="" disabled>
                Templates…
              </option>
              <option value="sample">Sample document</option>
              {TEMPLATES.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => fileRef.current?.click()}
              title="Import a .txt or .md file"
              style={{ whiteSpace: "nowrap" }}
            >
              ↑ Import TXT
            </button>
            <button type="button" className="btn btn-sm" onClick={clearAll} disabled={!hasContent}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* ------- Advanced PDF settings ------- */}
      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: 12,
          background: "var(--surface2)",
          marginBottom: 16,
        }}
      >
        <button
          type="button"
          onClick={() => setShowSettings((s) => !s)}
          aria-expanded={showSettings}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "12px 16px",
            fontWeight: 800,
            fontSize: "0.9rem",
            color: "var(--text)",
          }}
        >
          <span>⚙ Advanced PDF settings — fonts, margins, headers, watermarks, stamps & more</span>
          <span aria-hidden="true">{showSettings ? "▾" : "▸"}</span>
        </button>
        {showSettings && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 18,
              padding: "4px 16px 16px",
            }}
          >
            {/* Layout */}
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend className="field-label">Layout</legend>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={rangeRow}>
                  <button type="button" style={toolBtn(!settings.landscape, "Portrait")} onClick={() => set("landscape", false)}>
                    Portrait
                  </button>
                  <button type="button" style={toolBtn(settings.landscape, "Landscape")} onClick={() => set("landscape", true)}>
                    Landscape
                  </button>
                </div>
                <div>
                  <label className="field-label" htmlFor="ttp-margins">Margins</label>
                  <select
                    id="ttp-margins"
                    style={selStyle}
                    value={settings.marginPreset}
                    onChange={(e) => set("marginPreset", e.target.value as MarginPreset)}
                  >
                    <option value="narrow">Narrow (12.7 mm)</option>
                    <option value="normal">Normal (25.4 mm)</option>
                    <option value="wide">Wide (38.1 mm)</option>
                    <option value="custom">Custom…</option>
                  </select>
                </div>
                {settings.marginPreset === "custom" && (
                  <div style={rangeRow}>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      step={1}
                      value={settings.marginCustom}
                      onChange={(e) => set("marginCustom", Number(e.target.value))}
                      style={{ flex: 1 }}
                      aria-label="Custom margin in millimetres"
                    />
                    <span className="font-mono2" style={{ fontSize: "0.78rem" }}>{settings.marginCustom} mm</span>
                  </div>
                )}
                <div style={rangeRow}>
                  <input
                    id="ttp-bgenabled"
                    type="checkbox"
                    checked={settings.bgEnabled}
                    onChange={(e) => set("bgEnabled", e.target.checked)}
                  />
                  <label htmlFor="ttp-bgenabled" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    Page background
                  </label>
                  <input
                    type="color"
                    style={colorInput}
                    value={settings.bgColor}
                    disabled={!settings.bgEnabled}
                    onChange={(e) => set("bgColor", e.target.value)}
                    aria-label="Page background colour"
                  />
                </div>
                <div style={rangeRow}>
                  <label htmlFor="ttp-textcolor" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    Text colour
                  </label>
                  <input
                    id="ttp-textcolor"
                    type="color"
                    style={colorInput}
                    value={settings.textColor}
                    onChange={(e) => set("textColor", e.target.value)}
                  />
                  <span className="font-mono2" style={{ fontSize: "0.78rem" }}>{settings.textColor}</span>
                </div>
              </div>
            </fieldset>

            {/* Typography */}
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend className="field-label">Typography</legend>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label className="field-label" htmlFor="ttp-font">Font</label>
                  <select
                    id="ttp-font"
                    style={selStyle}
                    value={settings.fontFamily}
                    onChange={(e) => set("fontFamily", e.target.value as FontFamily)}
                  >
                    <option value="helvetica">Helvetica (clean sans)</option>
                    <option value="times">Times (classic serif)</option>
                    <option value="courier">Courier (typewriter mono)</option>
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="ttp-line">Line spacing — {settings.lineSpacing.toFixed(2)}×</label>
                  <input
                    id="ttp-line"
                    type="range"
                    min={1}
                    max={2}
                    step={0.05}
                    value={settings.lineSpacing}
                    onChange={(e) => set("lineSpacing", Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="ttp-para">Paragraph spacing — {settings.paraSpacing} mm</label>
                  <input
                    id="ttp-para"
                    type="range"
                    min={0}
                    max={12}
                    step={1}
                    value={settings.paraSpacing}
                    onChange={(e) => set("paraSpacing", Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="ttp-indent">First-line indent — {settings.indentFirst} mm</label>
                  <input
                    id="ttp-indent"
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={settings.indentFirst}
                    onChange={(e) => set("indentFirst", Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </fieldset>

            {/* Header & footer */}
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend className="field-label">Header, footer & page numbers</legend>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  className="input"
                  type="text"
                  value={settings.headerText}
                  onChange={(e) => set("headerText", e.target.value)}
                  placeholder="Header text (e.g. company or report name)"
                  maxLength={90}
                  aria-label="Header text"
                />
                <select
                  style={selStyle}
                  value={settings.headerAlign}
                  onChange={(e) => set("headerAlign", e.target.value as Align)}
                  aria-label="Header alignment"
                >
                  <option value="left">Header: left</option>
                  <option value="center">Header: centre</option>
                  <option value="right">Header: right</option>
                </select>
                <input
                  className="input"
                  type="text"
                  value={settings.footerText}
                  onChange={(e) => set("footerText", e.target.value)}
                  placeholder="Footer text (e.g. Confidential)"
                  maxLength={90}
                  aria-label="Footer text"
                />
                <select
                  style={selStyle}
                  value={settings.pageNumbers}
                  onChange={(e) => set("pageNumbers", e.target.value as PageNumFormat)}
                  aria-label="Page numbers"
                >
                  <option value="off">Page numbers: off</option>
                  <option value="plain">Page numbers: 1, 2, 3…</option>
                  <option value="pageof">Page numbers: Page 1 of 3</option>
                  <option value="dash">Page numbers: – 1 –</option>
                </select>
              </div>
            </fieldset>

            {/* Watermark, stamp, metadata */}
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend className="field-label">Watermark, stamp & document info</legend>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  className="input"
                  type="text"
                  value={settings.watermarkText}
                  onChange={(e) => set("watermarkText", e.target.value)}
                  placeholder="Watermark text (e.g. DRAFT)"
                  maxLength={40}
                  aria-label="Watermark text"
                />
                <div style={rangeRow}>
                  <input
                    type="range"
                    min={0.05}
                    max={0.4}
                    step={0.05}
                    value={settings.watermarkOpacity}
                    onChange={(e) => set("watermarkOpacity", Number(e.target.value))}
                    style={{ flex: 1 }}
                    aria-label="Watermark strength"
                  />
                  <span className="font-mono2" style={{ fontSize: "0.78rem" }}>
                    {Math.round(settings.watermarkOpacity * 100)}%
                  </span>
                </div>
                <select
                  style={selStyle}
                  value={settings.watermarkPattern}
                  onChange={(e) => set("watermarkPattern", e.target.value as WatermarkPattern)}
                  aria-label="Watermark pattern"
                >
                  <option value="diagonal">Watermark: one big diagonal</option>
                  <option value="repeat">Watermark: repeating grid</option>
                </select>
                <select
                  style={selStyle}
                  value={settings.stamp}
                  onChange={(e) => set("stamp", e.target.value as StampKind)}
                  aria-label="Status stamp"
                >
                  <option value="none">Status stamp: none</option>
                  <option value="DRAFT">Stamp: DRAFT</option>
                  <option value="APPROVED">Stamp: APPROVED</option>
                  <option value="PAID">Stamp: PAID</option>
                  <option value="IN REVIEW">Stamp: IN REVIEW</option>
                  <option value="REJECTED">Stamp: REJECTED</option>
                </select>
                <input
                  className="input"
                  type="text"
                  value={settings.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="Author (saved in PDF info)"
                  maxLength={90}
                  aria-label="PDF author metadata"
                />
                <input
                  className="input"
                  type="text"
                  value={settings.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  placeholder="Subject (saved in PDF info)"
                  maxLength={120}
                  aria-label="PDF subject metadata"
                />
                <input
                  className="input"
                  type="text"
                  value={settings.keywords}
                  onChange={(e) => set("keywords", e.target.value)}
                  placeholder="Keywords, comma separated"
                  maxLength={160}
                  aria-label="PDF keywords metadata"
                />
              </div>
            </fieldset>
          </div>
        )}
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
          <p className="field-label">Editor — click a block, then style it</p>

          {/* Formatting toolbar */}
          <div
            role="toolbar"
            aria-label="Text formatting"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              alignItems: "center",
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: 8,
              background: "var(--surface2)",
              marginBottom: 10,
              position: "sticky",
              top: 76,
              zIndex: 5,
            }}
          >
            {(["h1", "h2", "h3", "p", "bullets", "numbered", "quote", "checklist"] as BlockKind[]).map((k) => (
              <button
                key={k}
                type="button"
                title={
                  k === "p"
                    ? "Paragraph"
                    : k === "bullets"
                      ? "Bullet list"
                      : k === "numbered"
                        ? "Numbered list"
                        : k === "quote"
                          ? "Quote"
                          : k === "checklist"
                            ? "Checklist — start a line with [x] for a ticked box"
                            : `Heading ${k.slice(1)}`
                }
                style={toolBtn(active.kind === k, k)}
                aria-pressed={active.kind === k}
                onClick={() => updateBlock(active.id, { kind: k })}
              >
                {k === "p"
                  ? "¶"
                  : k === "bullets"
                    ? "• List"
                    : k === "numbered"
                      ? "1. List"
                      : k === "quote"
                        ? "❝ Quote"
                        : k === "checklist"
                          ? "☑ Tasks"
                          : k.toUpperCase()}
              </button>
            ))}
            <button type="button" style={toolBtn(false, "divider")} title="Insert a divider line below" onClick={() => addBlock("divider")}>
              ―
            </button>
            <button type="button" style={toolBtn(false, "break")} title="Insert a page break below" onClick={() => addBlock("pagebreak")}>
              ⤢ Break
            </button>
            <span aria-hidden="true" style={{ width: 2, alignSelf: "stretch", background: "var(--text)", opacity: 0.25 }} />
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
            <span aria-hidden="true" style={{ width: 2, alignSelf: "stretch", background: "var(--text)", opacity: 0.25 }} />
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
                border: "1px solid var(--line)",
                borderRadius: 9,
                padding: "7px 8px",
                background: "var(--surface)",
                color: "var(--text)",
                fontWeight: 800,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              {[10, 11, 12, 14, 16, 18].map((s) => (
                <option key={s} value={s}>{s} pt</option>
              ))}
            </select>
            <button type="button" className="btn btn-sm" onClick={() => addBlock("p")} title="Add a new block below">
              + Block
            </button>
          </div>

          {/* Blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {blocks.map((b) => (
              <div
                key={b.id}
                onFocus={() => setActiveId(b.id)}
                onClick={() => setActiveId(b.id)}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  border: b.id === activeId ? "1.5px solid var(--red)" : "1px solid var(--line)",
                  borderRadius: 12,
                  background: "var(--surface)",
                  boxShadow: b.id === activeId ? "var(--shadow)" : "var(--shadow-sm)",
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
                {b.kind === "divider" || b.kind === "pagebreak" ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 2px",
                      color: "var(--muted)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                    }}
                  >
                    {b.kind === "divider" ? (
                      <>
                        <span style={{ flex: 1, borderTop: "2px solid var(--line)" }} />
                        <span>DIVIDER</span>
                        <span style={{ flex: 1, borderTop: "2px solid var(--line)" }} />
                      </>
                    ) : (
                      <>
                        <span style={{ flex: 1, borderTop: "2px dashed var(--red)" }} />
                        <span style={{ color: "var(--red-dark)" }}>PAGE BREAK</span>
                        <span style={{ flex: 1, borderTop: "2px dashed var(--red)" }} />
                      </>
                    )}
                  </div>
                ) : (
                  <AutoTextarea
                    value={b.text}
                    placeholder={
                      b.kind === "bullets" || b.kind === "numbered"
                        ? "One item per line…"
                        : b.kind === "checklist"
                          ? "One task per line — start with [x] to tick it…"
                          : b.kind === "quote"
                            ? "A quote worth setting apart…"
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
                    bold={b.kind === "h1" || b.kind === "h2" || b.kind === "h3" ? true : b.bold}
                  />
                )}
                <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <button
                    type="button"
                    onClick={() => moveBlock(b.id, -1)}
                    title="Move block up"
                    aria-label="Move block up"
                    style={{ border: "none", background: "transparent", color: "var(--muted)", fontSize: "0.8rem", cursor: "pointer", padding: "2px 4px", lineHeight: 1 }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(b.id, 1)}
                    title="Move block down"
                    aria-label="Move block down"
                    style={{ border: "none", background: "transparent", color: "var(--muted)", fontSize: "0.8rem", cursor: "pointer", padding: "2px 4px", lineHeight: 1 }}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBlock(b.id)}
                    title="Delete block"
                    aria-label="Delete block"
                    style={{ border: "none", background: "transparent", color: "var(--muted)", fontSize: "1.05rem", cursor: "pointer", padding: "2px 4px", lineHeight: 1 }}
                  >
                    ×
                  </button>
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 10 }}>
            Tip: press <kbd className="font-mono2">Enter</kbd> inside a paragraph to split it;
            empty a block and hit <kbd className="font-mono2">Backspace</kbd> to remove it. In a
            checklist, start a line with <kbd className="font-mono2">[x]</kbd> for a ticked box.
          </p>
        </div>

        {/* Live preview */}
        <div>
          <p className="field-label">
            Live preview
            <span className="font-mono2" style={{ marginLeft: 8, color: "var(--muted)", textTransform: "none" }}>
              {PAGE_DIMS[pageSize].label}
              {settings.landscape ? " · landscape" : ""}
            </span>
          </p>
          <div
            aria-live="polite"
            style={{
              border: "1px solid var(--line)",
              borderRadius: 8,
              background: bgCss,
              aspectRatio: `${pageW} / ${pageH}`,
              padding: `${(marginMm / pageW) * 100}%`,
              minHeight: 320,
              position: "relative",
              overflow: "hidden",
              fontFamily: FONT_CSS[settings.fontFamily],
              color: inkCss,
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
                  background: "var(--surface2)",
                  border: "1px solid var(--line)",
                  borderRadius: 999,
                  padding: "3px 10px",
                  color: "var(--text2)",
                  zIndex: 3,
                }}
              >
                Sample preview
              </span>
            )}
            {settings.stamp !== "none" && (
              <span
                style={{
                  position: "absolute",
                  top: "4%",
                  right: "5%",
                  border: `2.5px solid ${STAMP_COLORS[settings.stamp]}`,
                  color: STAMP_COLORS[settings.stamp],
                  borderRadius: 8,
                  padding: "3px 12px",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  letterSpacing: "0.06em",
                  transform: "rotate(4deg)",
                  zIndex: 3,
                  background: "transparent",
                }}
              >
                {settings.stamp}
              </span>
            )}
            {settings.watermarkText.trim() !== "" && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <span
                  style={{
                    transform: "rotate(-45deg)",
                    fontWeight: 800,
                    fontSize: settings.watermarkPattern === "repeat" ? "1.3rem" : "3rem",
                    color: "#808080",
                    opacity: settings.watermarkOpacity,
                    whiteSpace: "nowrap",
                  }}
                >
                  {settings.watermarkPattern === "repeat"
                    ? `${settings.watermarkText.trim()} · ${settings.watermarkText.trim()} · ${settings.watermarkText.trim()}`
                    : settings.watermarkText.trim()}
                </span>
              </div>
            )}
            {settings.headerText.trim() !== "" && (
              <div
                style={{
                  position: "absolute",
                  top: "2.2%",
                  left: `${(marginMm / pageW) * 100}%`,
                  right: `${(marginMm / pageW) * 100}%`,
                  textAlign: settings.headerAlign === "justify" ? "left" : settings.headerAlign,
                  fontSize: "0.68rem",
                  opacity: 0.65,
                  zIndex: 2,
                }}
              >
                {settings.headerText.trim()}
              </div>
            )}
            {settings.footerText.trim() !== "" && (
              <div
                style={{
                  position: "absolute",
                  bottom: "2.2%",
                  left: `${(marginMm / pageW) * 100}%`,
                  fontSize: "0.68rem",
                  opacity: 0.65,
                  zIndex: 2,
                }}
              >
                {settings.footerText.trim()}
              </div>
            )}
            {settings.pageNumbers !== "off" && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "2.2%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: "0.68rem",
                  opacity: 0.65,
                  zIndex: 2,
                }}
              >
                {settings.pageNumbers === "plain" ? "1" : settings.pageNumbers === "pageof" ? "Page 1 of N" : "– 1 –"}
              </div>
            )}
            <div style={{ position: "relative", zIndex: 1 }}>
              {docTitle.trim() !== "" && (
                <>
                  <div
                    style={{
                      fontSize: pt(18),
                      fontWeight: 800,
                      textAlign: "center",
                      lineHeight: 1.25,
                      marginBottom: 6,
                    }}
                  >
                    {hasContent ? docTitle.trim() : "My First PDF"}
                  </div>
                  <hr style={{ border: "none", borderTop: "2px solid currentColor", opacity: 0.35, margin: "0 0 14px" }} />
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
                  fontStyle: b.italic || b.kind === "quote" ? "italic" : "normal",
                  textAlign: b.align,
                  lineHeight: settings.lineSpacing,
                  margin: isHeading ? "14px 0 6px" : `0 0 ${settings.paraSpacing * 1.4}px`,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                };
                if (b.kind === "divider") {
                  return <hr key={i} style={{ border: "none", borderTop: "1.5px solid currentColor", opacity: 0.5, margin: "12px 0" }} />;
                }
                if (b.kind === "pagebreak") {
                  return (
                    <div
                      key={i}
                      style={{
                        borderTop: "2px dashed var(--red)",
                        textAlign: "center",
                        fontSize: "0.62rem",
                        color: "var(--red-dark)",
                        fontWeight: 700,
                        paddingTop: 3,
                        margin: "10px 0",
                      }}
                    >
                      PAGE BREAK
                    </div>
                  );
                }
                if (b.kind === "bullets" || b.kind === "numbered") {
                  const items = b.text.split("\n").filter((l) => l.trim() !== "");
                  const listStyle: React.CSSProperties = { ...style, paddingLeft: 22 };
                  return b.kind === "bullets" ? (
                    <ul key={i} style={{ ...listStyle, listStyle: "disc" }}>
                      {items.map((l, j) => (
                        <li key={j} style={{ marginBottom: 3 }}>{l.trim()}</li>
                      ))}
                    </ul>
                  ) : (
                    <ol key={i} style={{ ...listStyle, listStyle: "decimal" }}>
                      {items.map((l, j) => (
                        <li key={j} style={{ marginBottom: 3 }}>{l.trim()}</li>
                      ))}
                    </ol>
                  );
                }
                if (b.kind === "checklist") {
                  return (
                    <div key={i} style={{ ...style, whiteSpace: "normal" }}>
                      {b.text
                        .split("\n")
                        .filter((l) => l.trim() !== "")
                        .map((l, j) => {
                          const checked = /^\[x\]\s*/i.test(l.trim());
                          const clean = l.trim().replace(/^\[[ xX]\]\s*/, "");
                          return (
                            <div key={j} style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 3 }}>
                              <span aria-hidden="true">{checked ? "☑" : "☐"}</span>
                              <span style={checked ? { opacity: 0.75 } : undefined}>{clean}</span>
                            </div>
                          );
                        })}
                    </div>
                  );
                }
                if (b.kind === "quote") {
                  return (
                    <blockquote
                      key={i}
                      style={{ ...style, borderLeft: "3.5px solid currentColor", opacity: 0.92, paddingLeft: 14, marginLeft: 2 }}
                    >
                      {b.text}
                    </blockquote>
                  );
                }
                const Tag = b.kind === "h1" ? "h3" : b.kind === "h2" ? "h4" : b.kind === "h3" ? "h5" : "p";
                return (
                  <Tag
                    key={i}
                    style={
                      b.kind === "p" && settings.indentFirst > 0
                        ? { ...style, textIndent: `${settings.indentFirst}mm` }
                        : style
                    }
                  >
                    {b.text}
                  </Tag>
                );
              })}
              {!hasContent && (
                <p style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: 14 }}>
                  This is a sample so the preview never looks broken — start typing in the editor
                  and your words take over instantly.
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 16 }}>
            <button
              type="button"
              className="btn btn-primary"
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
              {hasContent && ` · ${wordCount} words · ${charCount} chars`}
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
