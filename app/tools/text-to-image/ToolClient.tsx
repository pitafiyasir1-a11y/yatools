"use client";

import { useEffect, useRef, useState } from "react";

type BgMode = "solid" | "gradient";
type GradientDir = "vertical" | "horizontal" | "diagonal";
type Align = "left" | "center" | "right";

const FONTS: { label: string; family: string; weight: number }[] = [
  { label: "Bangers (poster)", family: '"Bangers", cursive', weight: 400 },
  { label: "DM Sans (bold)", family: '"DM Sans", sans-serif', weight: 800 },
  { label: "DM Mono", family: '"DM Mono", monospace', weight: 500 },
  { label: "Georgia (serif)", family: "Georgia, serif", weight: 700 },
  { label: "Impact (heavy)", family: "Impact, sans-serif", weight: 400 },
  { label: "Trebuchet MS", family: '"Trebuchet MS", sans-serif', weight: 700 },
];

const SIZES: { id: string; label: string; w: number; h: number }[] = [
  { id: "square", label: "Square 1080 × 1080", w: 1080, h: 1080 },
  { id: "landscape", label: "Landscape 1200 × 630", w: 1200, h: 630 },
  { id: "portrait", label: "Portrait 1080 × 1350", w: 1080, h: 1350 },
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

/** Simple word-wrap that fits text inside maxWidth. */
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

export default function TextToImageClient() {
  const [text, setText] = useState("Make it\nPOP.");
  const [fontIdx, setFontIdx] = useState(0);
  const [fontSize, setFontSize] = useState(120);
  const [textColor, setTextColor] = useState("#141210");
  const [bgMode, setBgMode] = useState<BgMode>("solid");
  const [bg1, setBg1] = useState("#f6f1e5");
  const [bg2, setBg2] = useState("#e0263c");
  const [gradDir, setGradDir] = useState<GradientDir>("diagonal");
  const [padding, setPadding] = useState(80);
  const [align, setAlign] = useState<Align>("center");
  const [sizeId, setSizeId] = useState("square");
  const [downloading, setDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const size = SIZES.find((s) => s.id === sizeId)!;
  const font = FONTS[fontIdx];

  useEffect(() => {
    let cancelled = false;
    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        await document.fonts.load(`${font.weight} ${fontSize}px ${font.family}`);
      } catch {
        /* fall back to whatever is available */
      }
      if (cancelled) return;
      canvas.width = size.w;
      canvas.height = size.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background.
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

      // Text.
      ctx.fillStyle = textColor;
      ctx.font = `${font.weight} ${fontSize}px ${font.family}`;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      const maxWidth = Math.max(50, size.w - padding * 2);
      const lines = wrapLines(ctx, text || " ", maxWidth);
      const lineHeight = fontSize * 1.22;
      const blockH = lines.length * lineHeight;
      let y = size.h / 2 - blockH / 2 + lineHeight / 2;
      const x = align === "center" ? size.w / 2 : align === "left" ? padding : size.w - padding;
      for (const line of lines) {
        ctx.fillText(line, x, y);
        y += lineHeight;
      }
    };
    draw();
    return () => {
      cancelled = true;
    };
  }, [text, font, fontSize, textColor, bgMode, bg1, bg2, gradDir, padding, align, size]);

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

  const colorInput = (
    id: string,
    value: string,
    onChange: (v: string) => void
  ) => (
    <input
      id={id}
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        height: 46,
        border: "1px solid var(--line)",
        borderRadius: 11,
        background: "var(--surface)",
        cursor: "pointer",
        padding: 4,
      }}
    />
  );

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {/* Controls */}
        <div>
          <label className="field-label" htmlFor="tti-text">
            Your text
          </label>
          <textarea
            id="tti-text"
            className="textarea"
            style={{ minHeight: 110, marginBottom: 16 }}
            placeholder="Type something worth framing…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <label className="field-label" htmlFor="tti-font">
                Font
              </label>
              <select
                id="tti-font"
                className="select"
                value={fontIdx}
                onChange={(e) => setFontIdx(Number(e.target.value))}
              >
                {FONTS.map((f, i) => (
                  <option key={f.label} value={i}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="tti-size-id">
                Canvas size
              </label>
              <select
                id="tti-size-id"
                className="select"
                value={sizeId}
                onChange={(e) => setSizeId(e.target.value)}
              >
                {SIZES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="field-label" htmlFor="tti-fontsize">
            Text size — {fontSize}px
          </label>
          <input
            id="tti-fontsize"
            type="range"
            min={24}
            max={220}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--red)", marginBottom: 16 }}
          />

          <div style={{ marginBottom: 16 }}>
            <span className="field-label">Alignment</span>
            <div
              style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
              role="group"
              aria-label="Text alignment"
            >
              {ALIGNS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`btn btn-sm${align === a.id ? " btn-primary" : ""}`}
                  aria-pressed={align === a.id}
                  onClick={() => setAlign(a.id)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <label className="field-label" htmlFor="tti-tc">
                Text color
              </label>
              {colorInput("tti-tc", textColor, setTextColor)}
            </div>
            <div>
              <label className="field-label" htmlFor="tti-bg1">
                {bgMode === "solid" ? "Background" : "Gradient start"}
              </label>
              {colorInput("tti-bg1", bg1, setBg1)}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <span className="field-label">Background style</span>
            <div
              style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
              role="group"
              aria-label="Background style"
            >
              <button
                type="button"
                className={`btn btn-sm${bgMode === "solid" ? " btn-primary" : ""}`}
                aria-pressed={bgMode === "solid"}
                onClick={() => setBgMode("solid")}
              >
                Solid
              </button>
              <button
                type="button"
                className={`btn btn-sm${bgMode === "gradient" ? " btn-primary" : ""}`}
                aria-pressed={bgMode === "gradient"}
                onClick={() => setBgMode("gradient")}
              >
                Gradient
              </button>
            </div>
          </div>

          {bgMode === "gradient" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <label className="field-label" htmlFor="tti-bg2">
                  Gradient end
                </label>
                {colorInput("tti-bg2", bg2, setBg2)}
              </div>
              <div>
                <label className="field-label" htmlFor="tti-gdir">
                  Direction
                </label>
                <select
                  id="tti-gdir"
                  className="select"
                  value={gradDir}
                  onChange={(e) => setGradDir(e.target.value as GradientDir)}
                >
                  {GRAD_DIRS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <label className="field-label" htmlFor="tti-pad">
            Padding — {padding}px
          </label>
          <input
            id="tti-pad"
            type="range"
            min={0}
            max={160}
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--red)" }}
          />
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 6 }}>
            Long lines wrap automatically inside the padding. Press Enter for manual line breaks.
          </p>
        </div>

        {/* Preview */}
        <div>
          <p className="field-label">Live preview</p>
          <div
            className="result-box"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              background: "var(--surface)",
            }}
          >
            <canvas
              ref={canvasRef}
              aria-label="Poster preview"
              style={{
                maxWidth: "100%",
                maxHeight: 480,
                border: "1px solid var(--line)",
                borderRadius: 12,
                display: "block",
              }}
            />
          </div>
          <p
            className="font-mono2"
            style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 10 }}
          >
            Exports at {size.w} × {size.h} px PNG
          </p>
          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={download}
              disabled={downloading}
            >
              {downloading ? "Preparing…" : "Download PNG"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
