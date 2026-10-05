"use client";

import { useMemo, useState } from "react";

const SAMPLE = `# My First PDF
Generated in the browser with YATools.

## What this shows
Lines that start with "# " become large headings, and "## " lines become sub-headings. Everything else flows as normal body text.

Use the options above to change the document title, font size, and alignment. Try center or justify to see the difference. When you're happy, hit Download PDF — no upload, no waiting, no watermark.`;

const ALIGNMENTS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "justify", label: "Justify" },
] as const;

type Align = (typeof ALIGNMENTS)[number]["value"];

// A4 at 1-inch margins: printable width 159.2mm, height 246.2mm
function estimatePages(text: string, fontSize: number, detectHeadings: boolean): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  const charW = fontSize * 0.352778 * 0.52; // avg char width in mm (helvetica)
  const charsPerLine = Math.max(10, Math.floor(159.2 / charW));
  const bodyLineH = fontSize * 0.352778 * 1.3;
  const linesPerPage = Math.max(1, Math.floor(246.2 / bodyLineH));
  let lines = 0;
  for (const raw of trimmed.split("\n")) {
    const isHeading = detectHeadings && /^#{1,2}\s/.test(raw);
    const content = raw.replace(/^#{1,2}\s/, "");
    const wrapped = Math.max(1, Math.ceil(content.length / charsPerLine));
    lines += isHeading ? wrapped * 1.5 : wrapped;
  }
  return Math.max(1, Math.ceil(lines / linesPerPage));
}

export default function TextToPdfClient() {
  const [text, setText] = useState("");
  const [docTitle, setDocTitle] = useState("My Document");
  const [fontSize, setFontSize] = useState(12);
  const [align, setAlign] = useState<Align>("left");
  const [detectHeadings, setDetectHeadings] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [actualPages, setActualPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const estimate = useMemo(
    () => estimatePages(text, fontSize, detectHeadings),
    [text, fontSize, detectHeadings]
  );

  const generate = async () => {
    if (text.trim() === "") {
      setError("Add some text first — there's nothing to turn into a PDF yet.");
      return;
    }
    setError(null);
    setGenerating(true);
    try {
      // Dynamic import keeps jsPDF out of the SSR bundle and the initial page load.
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const margin = 25.4;
      const maxW = 210 - margin * 2;
      const pageBottom = 297 - margin;
      let y = margin + 4;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageBottom) {
          doc.addPage();
          y = margin + 4;
        }
      };

      // Document title (optional, rendered once on page 1)
      if (docTitle.trim() !== "") {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSize + 6);
        const titleLines = doc.splitTextToSize(docTitle.trim(), maxW);
        const h = (fontSize + 6) * 0.352778 * 1.25;
        ensureSpace(titleLines.length * h);
        doc.text(titleLines, margin, y, { align: "center", maxWidth: maxW });
        y += titleLines.length * h + 6;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, margin + maxW, y);
        y += 6;
      }

      const headingLine = (level: 1 | 2, content: string) => {
        const size = level === 1 ? fontSize + 6 : fontSize + 3;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(content, maxW);
        const h = size * 0.352778 * 1.3;
        ensureSpace(lines.length * h + 2);
        y += 2; // breathing room above headings
        doc.text(lines, margin, y, { align: "left", maxWidth: maxW });
        y += lines.length * h + 2;
      };

      const bodyLine = (content: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        const lines = content === "" ? [""] : doc.splitTextToSize(content, maxW);
        const h = fontSize * 0.352778 * 1.3;
        ensureSpace(lines.length * h);
        doc.text(lines, margin, y, { align, maxWidth: maxW });
        y += lines.length * h;
      };

      for (const raw of text.split("\n")) {
        if (detectHeadings && /^#\s/.test(raw)) {
          headingLine(1, raw.replace(/^#\s/, "").trim());
        } else if (detectHeadings && /^##\s/.test(raw)) {
          headingLine(2, raw.replace(/^##\s/, "").trim());
        } else {
          bodyLine(raw.trim());
        }
      }

      const fileName = `${(docTitle.trim() || "document")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "document"}.pdf`;
      doc.save(fileName);
      setActualPages(doc.getNumberOfPages());
    } catch {
      setError(
        "PDF generation failed in your browser. Try refreshing the page or using a Chromium-based browser."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <label className="neu-label" htmlFor="ttp-title">
            Document title
          </label>
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
          <label className="neu-label" htmlFor="ttp-size">
            Font size · {fontSize}pt
          </label>
          <select
            id="ttp-size"
            className="neu-select"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          >
            {[10, 11, 12, 14, 16].map((s) => (
              <option key={s} value={s}>
                {s} pt
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="neu-label" htmlFor="ttp-align">
            Alignment
          </label>
          <select
            id="ttp-align"
            className="neu-select"
            value={align}
            onChange={(e) => setAlign(e.target.value as Align)}
          >
            {ALIGNMENTS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <label
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.92rem" }}
        >
          <input
            type="checkbox"
            checked={detectHeadings}
            onChange={(e) => setDetectHeadings(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: "var(--red)" }}
          />
          Detect headings{" "}
          <span className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
            lines starting with # or ##
          </span>
        </label>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button type="button" className="neu-btn neu-btn-sm" onClick={() => setText(SAMPLE)}>
            Load sample
          </button>
          <button
            type="button"
            className="neu-btn neu-btn-sm"
            onClick={() => setText("")}
            disabled={!text}
          >
            Clear
          </button>
        </div>
      </div>

      <label className="neu-label" htmlFor="ttp-text">
        Your text
      </label>
      <textarea
        id="ttp-text"
        className="neu-textarea neu-input-mono"
        style={{ minHeight: 240 }}
        placeholder="Type or paste your text here… Start a line with # for a heading."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <button
          type="button"
          className="neu-btn neu-btn-primary"
          onClick={generate}
          disabled={generating || text.trim() === ""}
        >
          {generating ? "Building PDF…" : "Download PDF"}
        </button>
        <div className="font-mono2" style={{ fontSize: "0.75rem", color: "var(--text2)" }} aria-live="polite">
          {estimate === 0
            ? "A4 · no pages yet"
            : `A4 · ≈ ${estimate} page${estimate === 1 ? "" : "s"} estimated`}
          {actualPages !== null && text.trim() !== "" && ` · last export: ${actualPages} page${actualPages === 1 ? "" : "s"}`}
        </div>
      </div>

      {error && (
        <div className="notice" style={{ marginTop: 14 }}>
          {error}
        </div>
      )}
    </div>
  );
}
