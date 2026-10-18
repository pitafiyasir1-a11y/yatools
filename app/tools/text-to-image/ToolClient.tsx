"use client";

import { useEffect, useRef, useState } from "react";

type BgMode = "solid" | "gradient";
type GradientDir = "vertical" | "horizontal" | "diagonal";
type Align = "left" | "center" | "right";
type TextEffect = "none" | "shadow" | "glow" | "outline" | "extrude";
type Pattern = "none" | "dots" | "grid" | "diagonal-lines";

const FONTS: { label: string; family: string; weight: number }[] = [
  { label: "Bangers (poster)", family: '"Bangers", cursive', weight: 400 },
  { label: "Impact (heavy)", family: "Impact, sans-serif", weight: 400 },
  { label: "Arial Black", family: '"Arial Black", sans-serif', weight: 900 },
  { label: "DM Sans (bold)", family: '"DM Sans", sans-serif', weight: 800 },
  { label: "Trebuchet MS", family: '"Trebuchet MS", sans-serif', weight: 700 },
  { label: "Verdana", family: "Verdana, sans-serif", weight: 700 },
  { label: "Georgia (serif)", family: "Georgia, serif", weight: 700 },
  { label: "Palatino (elegant)", family: '"Palatino Linotype", Palatino, serif', weight: 700 },
  { label: "Courier New (typewriter)", family: '"Courier New", monospace', weight: 700 },
  { label: "DM Mono", family: '"DM Mono", monospace', weight: 500 },
];

const SIZES: { id: string; label: string; w: number; h: number }[] = [
  { id: "square", label: "Square 1080 × 1080", w: 1080, h: 1080 },
  { id: "portrait", label: "Portrait 1080 × 1350", w: 1080, h: 1350 },
  { id: "story", label: "Story 1080 × 1920", w: 1080, h: 1920 },
  { id: "landscape", label: "Landscape 1200 × 630", w: 1200, h: 630 },
  { id: "youtube", label: "YouTube 1280 × 720", w: 1280, h: 720 },
  { id: "banner", label: "Wide banner 1920 × 640", w: 1920, h: 640 },
];

const GRAD_DIRS: { id: GradientDir; label: string }[] = [
  { id: "vertical", label: "↓ Vertical" },
  { id: "horizontal", label: "→ Horizontal" },
  { id: "diagonal", label: "↘ Diagonal" },
];

const ALIGNS: { id: Align; label: string }[] = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
];

const EFFECTS: { id: TextEffect; label: string }[] = [
  { id: "none", label: "None" },
  { id: "shadow", label: "Shadow" },
  { id: "glow", label: "Neon glow" },
  { id: "outline", label: "Outline" },
  { id: "extrude", label: "3D depth" },
];

const PATTERNS: { id: Pattern; label: string }[] = [
  { id: "none", label: "None" },
  { id: "dots", label: "Dots" },
  { id: "grid", label: "Grid" },
  { id: "diagonal-lines", label: "Diagonal lines" },
];

interface TemplateDef {
  id: string;
  name: string;
  swatch: string; // css background for the thumbnail
  headline: string;
  subtext: string;
  hFont: number;
  hSize: number;
  hColor: string;
  sFont: number;
  sSize: number;
  sColor: string;
  bgMode: BgMode;
  bg1: string;
  bg2: string;
  gradDir: GradientDir;
  effect: TextEffect;
  effectColor: string;
  align: Align;
  padding: number;
  letterSpacing: number;
  lineHeight: number;
  pattern: Pattern;
  patternColor: string;
  divider: boolean;
  dividerColor: string;
}

const TEMPLATES: TemplateDef[] = [
  {
    id: "neon-nights",
    name: "Neon Nights",
    swatch: "radial-gradient(circle at 50% 40%, #1a0533 0%, #05010f 70%)",
    headline: "NEON\nNIGHTS",
    subtext: "the city never sleeps",
    hFont: 1, hSize: 170, hColor: "#00f0ff",
    sFont: 3, sSize: 44, sColor: "#ff2ec4",
    bgMode: "solid", bg1: "#05010f", bg2: "#05010f", gradDir: "diagonal",
    effect: "glow", effectColor: "#00f0ff",
    align: "center", padding: 90, letterSpacing: 6, lineHeight: 1.15,
    pattern: "dots", patternColor: "rgba(0,240,255,0.12)",
    divider: false, dividerColor: "#00f0ff",
  },
  {
    id: "golden-luxury",
    name: "Golden Luxury",
    swatch: "linear-gradient(135deg, #0d0d0d 0%, #1a1410 100%)",
    headline: "LUXURY",
    subtext: "est. 2026 — timeless elegance",
    hFont: 7, hSize: 150, hColor: "#d4af37",
    sFont: 7, sSize: 40, sColor: "#a8894a",
    bgMode: "solid", bg1: "#0d0d0d", bg2: "#0d0d0d", gradDir: "diagonal",
    effect: "shadow", effectColor: "rgba(212,175,55,0.35)",
    align: "center", padding: 100, letterSpacing: 14, lineHeight: 1.2,
    pattern: "none", patternColor: "#ffffff",
    divider: true, dividerColor: "#d4af37",
  },
  {
    id: "bold-impact",
    name: "Bold Impact",
    swatch: "linear-gradient(135deg, #e0263c 0%, #a3152a 100%)",
    headline: "MAKE IT\nPOP.",
    subtext: "loud designs for loud ideas",
    hFont: 1, hSize: 180, hColor: "#ffffff",
    sFont: 2, sSize: 42, sColor: "#ffe1e6",
    bgMode: "gradient", bg1: "#e0263c", bg2: "#8f1023", gradDir: "diagonal",
    effect: "extrude", effectColor: "#5c0a18",
    align: "center", padding: 80, letterSpacing: 2, lineHeight: 1.1,
    pattern: "diagonal-lines", patternColor: "rgba(255,255,255,0.07)",
    divider: false, dividerColor: "#ffffff",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    swatch: "linear-gradient(135deg, #ffffff 0%, #f4f1ea 100%)",
    headline: "Less,\nbut better.",
    subtext: "simplicity is the ultimate sophistication",
    hFont: 3, hSize: 120, hColor: "#141210",
    sFont: 3, sSize: 38, sColor: "#6b6560",
    bgMode: "solid", bg1: "#faf8f3", bg2: "#faf8f3", gradDir: "diagonal",
    effect: "none", effectColor: "#000000",
    align: "left", padding: 110, letterSpacing: 0, lineHeight: 1.25,
    pattern: "none", patternColor: "#000000",
    divider: true, dividerColor: "#141210",
  },
  {
    id: "ocean-drive",
    name: "Ocean Drive",
    swatch: "linear-gradient(160deg, #0a3d91 0%, #00c6ff 100%)",
    headline: "DIVE IN",
    subtext: "fresh ideas, deep focus",
    hFont: 2, hSize: 160, hColor: "#ffffff",
    sFont: 5, sSize: 42, sColor: "#d6f2ff",
    bgMode: "gradient", bg1: "#0a3d91", bg2: "#00c6ff", gradDir: "diagonal",
    effect: "shadow", effectColor: "rgba(0,20,60,0.45)",
    align: "center", padding: 90, letterSpacing: 8, lineHeight: 1.15,
    pattern: "grid", patternColor: "rgba(255,255,255,0.08)",
    divider: false, dividerColor: "#ffffff",
  },
  {
    id: "sunset-pop",
    name: "Sunset Pop",
    swatch: "linear-gradient(135deg, #ff512f 0%, #dd2476 100%)",
    headline: "GOOD\nVIBES",
    subtext: "chase the light",
    hFont: 0, hSize: 170, hColor: "#fff7ed",
    sFont: 3, sSize: 44, sColor: "#ffe4d6",
    bgMode: "gradient", bg1: "#ff512f", bg2: "#dd2476", gradDir: "diagonal",
    effect: "glow", effectColor: "#ffd166",
    align: "center", padding: 90, letterSpacing: 4, lineHeight: 1.1,
    pattern: "dots", patternColor: "rgba(255,255,255,0.14)",
    divider: false, dividerColor: "#ffffff",
  },
  {
    id: "retro-cream",
    name: "Retro Cream",
    swatch: "linear-gradient(135deg, #f6f1e5 0%, #efe6d2 100%)",
    headline: "THROWBACK",
    subtext: "est. classics never fade",
    hFont: 0, hSize: 150, hColor: "#141210",
    sFont: 8, sSize: 40, sColor: "#8a5a2b",
    bgMode: "solid", bg1: "#f6f1e5", bg2: "#f6f1e5", gradDir: "diagonal",
    effect: "shadow", effectColor: "rgba(224,38,60,0.5)",
    align: "center", padding: 90, letterSpacing: 6, lineHeight: 1.15,
    pattern: "grid", patternColor: "rgba(20,18,16,0.05)",
    divider: true, dividerColor: "#e0263c",
  },
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    swatch: "radial-gradient(circle at 50% 30%, #2b1055 0%, #0b0620 75%)",
    headline: "DREAM\nBIG",
    subtext: "your vision, amplified",
    hFont: 1, hSize: 170, hColor: "#ff2ec4",
    sFont: 3, sSize: 42, sColor: "#b9a7ff",
    bgMode: "solid", bg1: "#0b0620", bg2: "#0b0620", gradDir: "diagonal",
    effect: "glow", effectColor: "#ff2ec4",
    align: "center", padding: 90, letterSpacing: 5, lineHeight: 1.12,
    pattern: "dots", patternColor: "rgba(255,46,196,0.10)",
    divider: false, dividerColor: "#ff2ec4",
  },
];

/** Word-wrap that fits text inside maxWidth. */
function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const out: string[] = [];
  for (const rawLine of text.split("\n")) {
    const words = rawLine.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    out.push(line);
  }
  return out;
}

/** Draw one line of text honoring letter-spacing (manual, cross-browser). */
function drawSpacedLine(
  ctx: CanvasRenderingContext2D,
  line: string,
  cx: number,
  y: number,
  align: Align,
  spacing: number
) {
  if (!spacing || line.length <= 1) {
    ctx.fillText(line, cx, y);
    return;
  }
  const widths = [...line].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (line.length - 1);
  let x: number;
  if (align === "center") x = cx - total / 2;
  else if (align === "left") x = cx;
  else x = cx - total;
  const prevAlign = ctx.textAlign;
  ctx.textAlign = "left";
  [...line].forEach((ch, i) => {
    ctx.fillText(ch, x, y);
    x += widths[i] + spacing;
  });
  ctx.textAlign = prevAlign;
}

/** Stroke version of drawSpacedLine (for outline effect). */
function strokeSpacedLine(
  ctx: CanvasRenderingContext2D,
  line: string,
  cx: number,
  y: number,
  align: Align,
  spacing: number
) {
  if (!spacing || line.length <= 1) {
    ctx.strokeText(line, cx, y);
    return;
  }
  const widths = [...line].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (line.length - 1);
  let x: number;
  if (align === "center") x = cx - total / 2;
  else if (align === "left") x = cx;
  else x = cx - total;
  const prevAlign = ctx.textAlign;
  ctx.textAlign = "left";
  [...line].forEach((ch, i) => {
    ctx.strokeText(ch, x, y);
    x += widths[i] + spacing;
  });
  ctx.textAlign = prevAlign;
}

export default function TextToImageClient() {
  const [headline, setHeadline] = useState("Make it\nPOP.");
  const [subtext, setSubtext] = useState("design studio in your browser");
  const [showSubtext, setShowSubtext] = useState(true);

  const [hFontIdx, setHFontIdx] = useState(1);
  const [hSize, setHSize] = useState(150);
  const [hColor, setHColor] = useState("#ffffff");

  const [sFontIdx, setSFontIdx] = useState(3);
  const [sSize, setSSize] = useState(44);
  const [sColor, setSColor] = useState("#ffe1e6");

  const [bgMode, setBgMode] = useState<BgMode>("gradient");
  const [bg1, setBg1] = useState("#e0263c");
  const [bg2, setBg2] = useState("#8f1023");
  const [gradDir, setGradDir] = useState<GradientDir>("diagonal");

  const [effect, setEffect] = useState<TextEffect>("extrude");
  const [effectColor, setEffectColor] = useState("#5c0a18");

  const [align, setAlign] = useState<Align>("center");
  const [padding, setPadding] = useState(80);
  const [letterSpacing, setLetterSpacing] = useState(2);
  const [lineHeight, setLineHeight] = useState(1.12);

  const [pattern, setPattern] = useState<Pattern>("diagonal-lines");
  const [patternColor, setPatternColor] = useState("rgba(255,255,255,0.07)");

  const [divider, setDivider] = useState(false);
  const [dividerColor, setDividerColor] = useState("#ffffff");

  const [sizeId, setSizeId] = useState("square");
  const [activeTemplate, setActiveTemplate] = useState<string | null>("bold-impact");
  const [downloading, setDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const size = SIZES.find((s) => s.id === sizeId)!;
  const hFont = FONTS[hFontIdx];
  const sFont = FONTS[sFontIdx];

  const applyTemplate = (t: TemplateDef) => {
    setHeadline(t.headline);
    setSubtext(t.subtext);
    setShowSubtext(true);
    setHFontIdx(t.hFont);
    setHSize(t.hSize);
    setHColor(t.hColor);
    setSFontIdx(t.sFont);
    setSSize(t.sSize);
    setSColor(t.sColor);
    setBgMode(t.bgMode);
    setBg1(t.bg1);
    setBg2(t.bg2);
    setGradDir(t.gradDir);
    setEffect(t.effect);
    setEffectColor(t.effectColor);
    setAlign(t.align);
    setPadding(t.padding);
    setLetterSpacing(t.letterSpacing);
    setLineHeight(t.lineHeight);
    setPattern(t.pattern);
    setPatternColor(t.patternColor);
    setDivider(t.divider);
    setDividerColor(t.dividerColor);
    setActiveTemplate(t.id);
  };

  const shuffle = () => {
    const pool = TEMPLATES.filter((t) => t.id !== activeTemplate);
    const t = pool[Math.floor(Math.random() * pool.length)];
    applyTemplate(t);
  };

  const markCustom = () => setActiveTemplate(null);

  useEffect(() => {
    let cancelled = false;
    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        await Promise.all([
          document.fonts.load(`${hFont.weight} ${hSize}px ${hFont.family}`),
          document.fonts.load(`${sFont.weight} ${sSize}px ${sFont.family}`),
        ]);
      } catch {
        /* fall back */
      }
      if (cancelled) return;
      canvas.width = size.w;
      canvas.height = size.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // ---- Background ----
      if (bgMode === "solid") {
        ctx.fillStyle = bg1;
        ctx.fillRect(0, 0, size.w, size.h);
      } else {
        let grad: CanvasGradient;
        if (gradDir === "vertical") grad = ctx.createLinearGradient(0, 0, 0, size.h);
        else if (gradDir === "horizontal") grad = ctx.createLinearGradient(0, 0, size.w, 0);
        else grad = ctx.createLinearGradient(0, 0, size.w, size.h);
        grad.addColorStop(0, bg1);
        grad.addColorStop(1, bg2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size.w, size.h);
      }

      // ---- Pattern overlay ----
      if (pattern !== "none") {
        ctx.save();
        ctx.fillStyle = patternColor;
        ctx.strokeStyle = patternColor;
        if (pattern === "dots") {
          const gap = Math.max(28, size.w / 34);
          const r = Math.max(2, size.w / 420);
          for (let y = gap / 2; y < size.h; y += gap) {
            for (let x = gap / 2; x < size.w; x += gap) {
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else if (pattern === "grid") {
          const gap = Math.max(40, size.w / 24);
          ctx.lineWidth = 1;
          for (let x = 0; x <= size.w; x += gap) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size.h); ctx.stroke();
          }
          for (let y = 0; y <= size.h; y += gap) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size.w, y); ctx.stroke();
          }
        } else {
          const gap = Math.max(36, size.w / 28);
          ctx.lineWidth = Math.max(2, size.w / 380);
          for (let x = -size.h; x < size.w + size.h; x += gap) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + size.h, size.h); ctx.stroke();
          }
        }
        ctx.restore();
      }

      const maxWidth = Math.max(50, size.w - padding * 2);
      const cx = align === "center" ? size.w / 2 : align === "left" ? padding : size.w - padding;

      // ---- Measure blocks ----
      ctx.font = `${hFont.weight} ${hSize}px ${hFont.family}`;
      const hLines = wrapLines(ctx, headline || " ", maxWidth);
      const hLineH = hSize * lineHeight;

      ctx.font = `${sFont.weight} ${sSize}px ${sFont.family}`;
      const sLines = showSubtext ? wrapLines(ctx, subtext || " ", maxWidth) : [];
      const sLineH = sSize * lineHeight;

      const dividerH = divider ? Math.max(6, size.w / 160) : 0;
      const gapAfterHeadline = showSubtext || divider ? hSize * 0.35 : 0;
      const gapAfterDivider = divider && showSubtext ? sSize * 0.5 : 0;

      const blockH =
        hLines.length * hLineH +
        gapAfterHeadline +
        dividerH +
        gapAfterDivider +
        sLines.length * sLineH;

      let y = size.h / 2 - blockH / 2;

      const paintLine = (
        line: string,
        lineCx: number,
        lineY: number,
        color: string,
        fontSpec: string,
        sizePx: number,
        spacing: number
      ) => {
        ctx.font = fontSpec;
        ctx.textAlign = align;
        ctx.textBaseline = "middle";
        ctx.save();
        if (effect === "shadow") {
          ctx.shadowColor = effectColor;
          ctx.shadowBlur = sizePx * 0.18;
          ctx.shadowOffsetX = sizePx * 0.045;
          ctx.shadowOffsetY = sizePx * 0.045;
          ctx.fillStyle = color;
          drawSpacedLine(ctx, line, lineCx, lineY, align, spacing);
        } else if (effect === "glow") {
          ctx.shadowColor = effectColor;
          ctx.shadowBlur = sizePx * 0.55;
          ctx.fillStyle = color;
          drawSpacedLine(ctx, line, lineCx, lineY, align, spacing);
          drawSpacedLine(ctx, line, lineCx, lineY, align, spacing);
        } else if (effect === "outline") {
          ctx.lineWidth = Math.max(2, sizePx * 0.055);
          ctx.strokeStyle = effectColor;
          ctx.lineJoin = "round";
          strokeSpacedLine(ctx, line, lineCx, lineY, align, spacing);
          ctx.fillStyle = color;
          drawSpacedLine(ctx, line, lineCx, lineY, align, spacing);
        } else if (effect === "extrude") {
          const depth = Math.max(3, Math.round(sizePx * 0.07));
          ctx.fillStyle = effectColor;
          for (let d = depth; d >= 1; d--) {
            const ox = align === "left" ? d : align === "right" ? -d : 0;
            ctx.save();
            ctx.translate(ox, d);
            drawSpacedLine(ctx, line, lineCx, lineY, align, spacing);
            ctx.restore();
          }
          ctx.fillStyle = color;
          drawSpacedLine(ctx, line, lineCx, lineY, align, spacing);
        } else {
          ctx.fillStyle = color;
          drawSpacedLine(ctx, line, lineCx, lineY, align, spacing);
        }
        ctx.restore();
      };

      // ---- Headline ----
      const hSpec = `${hFont.weight} ${hSize}px ${hFont.family}`;
      for (const line of hLines) {
        y += hLineH / 2;
        paintLine(line, cx, y, hColor, hSpec, hSize, letterSpacing);
        y += hLineH / 2;
      }

      // ---- Divider ----
      if (divider) {
        y += gapAfterHeadline;
        const dw = Math.min(size.w * 0.28, 260);
        const dx = align === "center" ? cx - dw / 2 : align === "left" ? cx : cx - dw;
        ctx.fillStyle = dividerColor;
        const dh = Math.max(4, size.w / 220);
        const dy = y - dh / 2;
        // rounded bar
        ctx.beginPath();
        const r = dh / 2;
        ctx.moveTo(dx + r, dy);
        ctx.lineTo(dx + dw - r, dy);
        ctx.arcTo(dx + dw, dy, dx + dw, dy + r, r);
        ctx.arcTo(dx + dw, dy + dh, dx + dw - r, dy + dh, r);
        ctx.lineTo(dx + r, dy + dh);
        ctx.arcTo(dx, dy + dh, dx, dy + r, r);
        ctx.arcTo(dx, dy, dx + r, dy, r);
        ctx.fill();
        y += dividerH + gapAfterDivider;
      } else if (showSubtext) {
        y += gapAfterHeadline;
      }

      // ---- Subtext ----
      const sSpec = `${sFont.weight} ${sSize}px ${sFont.family}`;
      for (const line of sLines) {
        y += sLineH / 2;
        paintLine(line, cx, y, sColor, sSpec, sSize, Math.max(0, letterSpacing * 0.6));
        y += sLineH / 2;
      }
    };
    draw();
    return () => {
      cancelled = true;
    };
  }, [
    headline, subtext, showSubtext,
    hFont, hSize, hColor, sFont, sSize, sColor,
    bgMode, bg1, bg2, gradDir,
    effect, effectColor, align, padding,
    letterSpacing, lineHeight, pattern, patternColor,
    divider, dividerColor, size,
  ]);

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) throw new Error("Export failed in this browser.");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `yatools-text-poster-${size.w}x${size.h}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } finally {
      setDownloading(false);
    }
  };

  const colorInput = (id: string, value: string, onChange: (v: string) => void) => (
    <input
      id={id}
      type="color"
      value={value.startsWith("#") ? value : "#ffffff"}
      onChange={(e) => { onChange(e.target.value); markCustom(); }}
      style={{
        width: "100%", height: 44, border: "1px solid var(--line)",
        borderRadius: 10, background: "var(--surface)", cursor: "pointer", padding: 3,
      }}
    />
  );

  const slider = (
    id: string, label: string, value: number, min: number, max: number,
    onChange: (v: number) => void, unit = "px"
  ) => (
    <div style={{ marginBottom: 14 }}>
      <label className="field-label" htmlFor={id}>
        {label} — {value}{unit}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => { onChange(Number(e.target.value)); markCustom(); }}
        style={{ width: "100%", accentColor: "var(--red)" }}
      />
    </div>
  );

  const chipGroup = <T extends string>(
    label: string,
    options: { id: T; label: string }[],
    value: T,
    onPick: (v: T) => void
  ) => (
    <div style={{ marginBottom: 14 }}>
      <span className="field-label">{label}</span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`btn btn-sm${value === o.id ? " btn-primary" : ""}`}
            aria-pressed={value === o.id}
            onClick={() => { onPick(o.id); markCustom(); }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      {/* Template gallery */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span className="field-label" style={{ marginBottom: 0 }}>Design templates</span>
          <button type="button" className="btn btn-sm" onClick={shuffle} title="Surprise me">
            Shuffle 🎲
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))",
            gap: 10,
          }}
        >
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t)}
              title={t.name}
              style={{
                border: activeTemplate === t.id ? "2.5px solid var(--red)" : "1px solid var(--line)",
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
                background: "var(--surface)",
                padding: 0,
              }}
            >
              <div
                style={{
                  height: 76,
                  background: t.swatch,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.hColor,
                  fontFamily: FONTS[t.hFont].family,
                  fontWeight: FONTS[t.hFont].weight,
                  fontSize: 22,
                  textShadow: t.effect === "glow" ? `0 0 12px ${t.effectColor}` : "none",
                  padding: "0 8px",
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                {t.name.split(" ")[0]}
              </div>
              <div style={{ padding: "7px 4px", fontSize: "0.72rem", fontWeight: 700 }}>
                {t.name}
              </div>
            </button>
          ))}
        </div>
        {activeTemplate === null && (
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}>
            Custom design — tweak anything below, or pick a template to start over.
          </p>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: 26,
        }}
      >
        {/* Controls */}
        <div>
          <label className="field-label" htmlFor="tti-headline">Headline</label>
          <textarea
            id="tti-headline"
            className="textarea"
            style={{ minHeight: 84, marginBottom: 12 }}
            placeholder="Your big headline…"
            value={headline}
            onChange={(e) => { setHeadline(e.target.value); markCustom(); }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <input
              id="tti-showsub"
              type="checkbox"
              checked={showSubtext}
              onChange={(e) => { setShowSubtext(e.target.checked); markCustom(); }}
              style={{ width: 18, height: 18, accentColor: "var(--red)" }}
            />
            <label htmlFor="tti-showsub" className="field-label" style={{ marginBottom: 0 }}>
              Show subtext line
            </label>
          </div>

          {showSubtext && (
            <>
              <label className="field-label" htmlFor="tti-subtext">Subtext</label>
              <textarea
                id="tti-subtext"
                className="textarea"
                style={{ minHeight: 56, marginBottom: 16 }}
                placeholder="Smaller supporting line…"
                value={subtext}
                onChange={(e) => { setSubtext(e.target.value); markCustom(); }}
              />
            </>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
            <div>
              <label className="field-label" htmlFor="tti-hfont">Headline font</label>
              <select
                id="tti-hfont" className="select" value={hFontIdx}
                onChange={(e) => { setHFontIdx(Number(e.target.value)); markCustom(); }}
              >
                {FONTS.map((f, i) => <option key={f.label} value={i}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="tti-sfont">Subtext font</label>
              <select
                id="tti-sfont" className="select" value={sFontIdx}
                onChange={(e) => { setSFontIdx(Number(e.target.value)); markCustom(); }}
              >
                {FONTS.map((f, i) => <option key={f.label} value={i}>{f.label}</option>)}
              </select>
            </div>
          </div>

          {slider("tti-hsize", "Headline size", hSize, 32, 260, setHSize)}
          {slider("tti-ssize", "Subtext size", sSize, 18, 120, setSSize)}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label className="field-label" htmlFor="tti-hc">Headline color</label>
              {colorInput("tti-hc", hColor, setHColor)}
            </div>
            <div>
              <label className="field-label" htmlFor="tti-sc">Subtext color</label>
              {colorInput("tti-sc", sColor, setSColor)}
            </div>
          </div>

          {chipGroup("Text effect", EFFECTS, effect, setEffect)}

          {effect !== "none" && (
            <div style={{ marginBottom: 16 }}>
              <label className="field-label" htmlFor="tti-ec">
                {effect === "glow" ? "Glow color" : effect === "outline" ? "Outline color" : effect === "extrude" ? "Depth color" : "Shadow color"}
              </label>
              {colorInput("tti-ec", effectColor, setEffectColor)}
            </div>
          )}

          {chipGroup("Alignment", ALIGNS, align, setAlign)}

          {slider("tti-spacing", "Letter spacing", letterSpacing, 0, 24, setLetterSpacing)}
          {slider("tti-lineheight", "Line height", Math.round(lineHeight * 100), 90, 180, (v) => setLineHeight(v / 100), "%")}
          {slider("tti-pad", "Padding", padding, 0, 200, setPadding)}

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, marginTop: 4 }}>
            <input
              id="tti-divider"
              type="checkbox"
              checked={divider}
              onChange={(e) => { setDivider(e.target.checked); markCustom(); }}
              style={{ width: 18, height: 18, accentColor: "var(--red)" }}
            />
            <label htmlFor="tti-divider" className="field-label" style={{ marginBottom: 0 }}>
              Accent divider bar
            </label>
          </div>
          {divider && (
            <div style={{ marginBottom: 16 }}>
              <label className="field-label" htmlFor="tti-dc">Divider color</label>
              {colorInput("tti-dc", dividerColor, setDividerColor)}
            </div>
          )}

          <div style={{ marginBottom: 4, marginTop: 18 }}>
            <span className="field-label">Background</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }} role="group" aria-label="Background style">
              {(["solid", "gradient"] as BgMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`btn btn-sm${bgMode === m ? " btn-primary" : ""}`}
                  aria-pressed={bgMode === m}
                  onClick={() => { setBgMode(m); markCustom(); }}
                >
                  {m === "solid" ? "Solid" : "Gradient"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label className="field-label" htmlFor="tti-bg1">{bgMode === "solid" ? "Background" : "Gradient start"}</label>
              {colorInput("tti-bg1", bg1, setBg1)}
            </div>
            {bgMode === "gradient" ? (
              <div>
                <label className="field-label" htmlFor="tti-bg2">Gradient end</label>
                {colorInput("tti-bg2", bg2, setBg2)}
              </div>
            ) : <div />}
          </div>

          {bgMode === "gradient" && (
            <div style={{ marginBottom: 16 }}>
              <label className="field-label" htmlFor="tti-gdir">Gradient direction</label>
              <select
                id="tti-gdir" className="select" value={gradDir}
                onChange={(e) => { setGradDir(e.target.value as GradientDir); markCustom(); }}
              >
                {GRAD_DIRS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </div>
          )}

          {chipGroup("Texture pattern", PATTERNS, pattern, setPattern)}
          {pattern !== "none" && (
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: -6, marginBottom: 14 }}>
              Pattern uses a subtle fixed tint matched to each template.
            </p>
          )}

          <div style={{ marginTop: 8 }}>
            <label className="field-label" htmlFor="tti-size-id">Canvas size</label>
            <select
              id="tti-size-id" className="select" value={sizeId}
              onChange={(e) => { setSizeId(e.target.value); markCustom(); }}
            >
              {SIZES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="field-label">Live preview</p>
          <div
            className="result-box"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16, background: "var(--surface)", position: "sticky", top: 16,
            }}
          >
            <canvas
              ref={canvasRef}
              aria-label="Poster preview"
              style={{
                maxWidth: "100%", maxHeight: 520,
                border: "1px solid var(--line)", borderRadius: 12, display: "block",
              }}
            />
          </div>
          <p className="font-mono2" style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 10 }}>
            Exports at {size.w} × {size.h} px PNG
          </p>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={download}
              disabled={downloading}
            >
              {downloading ? "Preparing…" : "Download PNG"}
            </button>
            <button type="button" className="btn" onClick={shuffle}>
              Surprise me 🎲
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
