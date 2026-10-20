"use client";

import { useRef, useState } from "react";
import { downloadBlob } from "../doc-convert-parts";

const TEMPLATES = [
  { id: 1, name: "Modern" },
  { id: 2, name: "Dark Background" },
  { id: 3, name: "Green" },
  { id: 4, name: "Classic" },
  { id: 5, name: "Red and Yellow" },
  { id: 6, name: "Golden Elegant" },
  { id: 7, name: "Blue Simple" },
  { id: 8, name: "Golden and Green" },
];

const FORMATS = [
  { value: "pdf", label: "PDF — best for printing" },
  { value: "png", label: "PNG — high quality image" },
  { value: "jpg", label: "JPG — small file size" },
];

const MAX_NAME = 100;
const MAX_DETAILS = 500;
const MAX_SIGNATURE = 100;

// A4 landscape at 150 DPI.
const W = 1754;
const H = 1240;

interface Theme {
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  accent2: string;
}

const THEMES: Record<number, Theme> = {
  1: { bg: "#f6f1e5", ink: "#141210", muted: "#6b6257", accent: "#e0263c", accent2: "#141210" },
  2: { bg: "#141210", ink: "#f6f1e5", muted: "#b8ab98", accent: "#e0263c", accent2: "#d9a441" },
  3: { bg: "#f4f8f1", ink: "#17301c", muted: "#5d7263", accent: "#1e7a3c", accent2: "#7fb069" },
  4: { bg: "#fdfbf5", ink: "#1c2a4a", muted: "#68738c", accent: "#b08d2f", accent2: "#1c2a4a" },
  5: { bg: "#fff8e6", ink: "#5b1a1a", muted: "#8a6d5a", accent: "#e0263c", accent2: "#e9a400" },
  6: { bg: "#fbf6e9", ink: "#3a2c07", muted: "#8a7648", accent: "#b8860b", accent2: "#d4af37" },
  7: { bg: "#f2f7fd", ink: "#10243e", muted: "#5d728c", accent: "#1663c7", accent2: "#7db3e8" },
  8: { bg: "#f7f6ec", ink: "#22331c", muted: "#6d7263", accent: "#1e7a3c", accent2: "#c9a227" },
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function prettyDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const month = MONTHS[parseInt(m[2], 10) - 1] ?? "";
  return `${parseInt(m[3], 10)} ${month} ${m[1]}`;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Shrink the font (from startPx down) until text fits maxWidth. Returns the size used. */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFor: (px: number) => string,
  startPx: number,
  minPx: number,
  maxWidth: number
): number {
  let px = startPx;
  ctx.font = fontFor(px);
  while (px > minPx && ctx.measureText(text).width > maxWidth) {
    px -= 4;
    ctx.font = fontFor(px);
  }
  return px;
}

function drawCertificate(args: {
  templateId: number;
  name: string;
  details: string;
  date: string;
  signature: string;
}): HTMLCanvasElement {
  const { templateId, name, details, date, signature } = args;
  const t = THEMES[templateId] ?? THEMES[1];
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");
  const serif = (px: number, weight = 400, italic = false) =>
    `${italic ? "italic " : ""}${weight} ${px}px Georgia, 'Times New Roman', serif`;
  const sans = (px: number, weight = 400) =>
    `${weight} ${px}px 'DM Sans', Arial, sans-serif`;

  // Background
  ctx.fillStyle = t.bg;
  ctx.fillRect(0, 0, W, H);

  // Borders: thick accent outer, thin inner
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 10;
  ctx.strokeRect(36, 36, W - 72, H - 72);
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 64, W - 128, H - 128);

  // Corner diamonds
  ctx.fillStyle = t.accent2;
  for (const [cx, cy] of [
    [64, 64],
    [W - 64, 64],
    [64, H - 64],
    [W - 64, H - 64],
  ] as const) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-11, -11, 22, 22);
    ctx.restore();
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Eyebrow
  ctx.fillStyle = t.accent;
  ctx.font = sans(30, 700);
  ctx.fillText("Y A T O O L S", W / 2, 168);

  // Title
  ctx.fillStyle = t.ink;
  ctx.font = serif(118, 700);
  ctx.fillText("CERTIFICATE", W / 2, 268);
  ctx.font = serif(44, 400, true);
  ctx.fillStyle = t.muted;
  ctx.fillText("of Achievement", W / 2, 352);

  // Divider with center diamond
  ctx.strokeStyle = t.accent2;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 330, 424);
  ctx.lineTo(W / 2 - 34, 424);
  ctx.moveTo(W / 2 + 34, 424);
  ctx.lineTo(W / 2 + 330, 424);
  ctx.stroke();
  ctx.save();
  ctx.translate(W / 2, 424);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = t.accent;
  ctx.fillRect(-13, -13, 26, 26);
  ctx.restore();

  // Presented to
  ctx.fillStyle = t.muted;
  ctx.font = sans(32, 400);
  ctx.fillText("This certificate is proudly presented to", W / 2, 500);

  // Recipient name (auto-fit)
  ctx.fillStyle = t.ink;
  fitFont(ctx, name, (px) => serif(px, 700), 108, 44, W - 360);
  ctx.fillText(name, W / 2, 596);

  // Name underline
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 380, 664);
  ctx.lineTo(W / 2 + 380, 664);
  ctx.stroke();

  // Details (wrapped, auto-fit, max 4 lines)
  ctx.fillStyle = t.ink;
  let detailPx = 40;
  ctx.font = serif(detailPx, 400, true);
  let lines = wrapText(ctx, details, W - 440);
  while (lines.length > 4 && detailPx > 26) {
    detailPx -= 2;
    ctx.font = serif(detailPx, 400, true);
    lines = wrapText(ctx, details, W - 440);
  }
  if (lines.length > 4) {
    lines = lines.slice(0, 4);
    lines[3] = lines[3].replace(/[\s,;:.]*$/, "") + "…";
  }
  const lineH = detailPx * 1.35;
  lines.forEach((ln, i) => {
    ctx.fillText(ln, W / 2, 738 + i * lineH);
  });

  // Bottom row: date (left), seal (center), signature (right)
  const baseY = H - 196;
  ctx.textAlign = "left";
  ctx.fillStyle = t.ink;
  ctx.font = serif(38, 400);
  ctx.fillText(prettyDate(date), 190, baseY);
  ctx.strokeStyle = t.muted;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(190, baseY + 44);
  ctx.lineTo(520, baseY + 44);
  ctx.stroke();
  ctx.fillStyle = t.muted;
  ctx.font = sans(24, 400);
  ctx.fillText("DATE", 190, baseY + 82);

  if (signature) {
    ctx.textAlign = "right";
    ctx.fillStyle = t.ink;
    ctx.font = serif(38, 400, true);
    ctx.fillText(signature, W - 190, baseY);
    ctx.strokeStyle = t.muted;
    ctx.beginPath();
    ctx.moveTo(W - 520, baseY + 44);
    ctx.lineTo(W - 190, baseY + 44);
    ctx.stroke();
    ctx.fillStyle = t.muted;
    ctx.font = sans(24, 400);
    ctx.fillText("SIGNATURE", W - 190, baseY + 82);
  }

  // Seal: ribbon + medallion
  const sealX = W / 2;
  const sealY = baseY + 10;
  ctx.fillStyle = t.accent;
  ctx.beginPath();
  ctx.moveTo(sealX - 34, sealY + 30);
  ctx.lineTo(sealX - 58, sealY + 118);
  ctx.lineTo(sealX - 12, sealY + 96);
  ctx.lineTo(sealX, sealY + 122);
  ctx.lineTo(sealX + 12, sealY + 96);
  ctx.lineTo(sealX + 58, sealY + 118);
  ctx.lineTo(sealX + 34, sealY + 30);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sealX, sealY, 64, 0, Math.PI * 2);
  ctx.fillStyle = t.accent2;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = t.bg;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = t.bg;
  ctx.font = serif(52, 700);
  ctx.textAlign = "center";
  ctx.fillText("★", sealX, sealY + 4);

  return canvas;
}

type Status = "idle" | "ready" | "error";

export default function CertificateMakerClient() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [signature, setSignature] = useState("");
  const [details, setDetails] = useState("");
  const [templateId, setTemplateId] = useState(1);
  const [format, setFormat] = useState("pdf");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const generate = () => {
    if (!name.trim()) {
      setStatus("error");
      setError("Add the recipient's name first.");
      return;
    }
    if (!details.trim()) {
      setStatus("error");
      setError("Describe the achievement — that's what the certificate is for.");
      return;
    }
    setError(null);
    try {
      const canvas = drawCertificate({
        templateId,
        name: name.trim(),
        details: details.trim(),
        date: date || today,
        signature: signature.trim(),
      });
      canvasRef.current = canvas;
      setPreviewUrl(canvas.toDataURL("image/png"));
      setStatus("ready");
    } catch {
      setStatus("error");
      setError("Your browser couldn't draw the certificate. Try a Chromium-based browser.");
    }
  };

  const slug = () =>
    `certificate-${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "yatools"}`;

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    try {
      if (format === "pdf") {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 841.89, 595.28);
        pdf.save(`${slug()}.pdf`);
      } else {
        const type = format === "png" ? "image/png" : "image/jpeg";
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, 0.95));
        if (!blob) throw new Error("encode failed");
        downloadBlob(blob, `${slug()}.${format}`);
      }
    } catch {
      setError("The download failed in your browser. Try the PNG format instead.");
      setStatus("error");
    } finally {
      setDownloading(false);
    }
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
    setPreviewUrl(null);
    canvasRef.current = null;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {status !== "ready" && (
        <div className="card p-6 md:p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="cert-name">
                Recipient name
              </label>
              <input
                id="cert-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
                placeholder="e.g. Ahmed Khan"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="cert-date">
                Date
              </label>
              <input
                id="cert-date"
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-end justify-between mb-2">
              <label className="field-label !mb-0" htmlFor="cert-details">
                Achievement details
              </label>
              <span className="font-mono2 text-xs" style={{ color: "var(--muted)" }}>
                {details.length}/{MAX_DETAILS}
              </span>
            </div>
            <textarea
              id="cert-details"
              className="textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value.slice(0, MAX_DETAILS))}
              placeholder="e.g. For winning the office cricket tournament 2026"
              rows={3}
            />
          </div>

          <div className="mt-4">
            <label className="field-label" htmlFor="cert-signature">
              Signature line (optional)
            </label>
            <input
              id="cert-signature"
              className="input"
              value={signature}
              onChange={(e) => setSignature(e.target.value.slice(0, MAX_SIGNATURE))}
              placeholder="e.g. Chief Fun Officer"
            />
          </div>

          <div className="mt-6">
            <span className="field-label">Pick a style</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={templateId === t.id}
                  onClick={() => setTemplateId(t.id)}
                  className="btn !px-3 !py-3 flex-col !gap-1"
                  style={{
                    background: templateId === t.id ? "var(--red)" : "var(--surface)",
                    color: templateId === t.id ? "#fff" : "inherit",
                  }}
                >
                  <span className="font-display" style={{ fontSize: "1.4rem", lineHeight: 1 }}>
                    {t.id}
                  </span>
                  <span className="font-mono2 text-xs text-center" style={{ lineHeight: 1.3 }}>
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="field-label" htmlFor="cert-format">
                File format
              </label>
              <select
                id="cert-format"
                className="select"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn btn-primary w-full" onClick={generate}>
                Generate certificate
              </button>
            </div>
          </div>

          {status === "error" && error && (
            <div className="notice notice-warn mt-6">
              <strong>Something went wrong.</strong> {error}
            </div>
          )}

          <p className="text-xs mt-5" style={{ color: "var(--muted)" }}>
            Made instantly in your browser — nothing is uploaded and there are no daily
            limits. Novelty certificates are for fun only — they are not official credentials.
          </p>
        </div>
      )}

      {status === "ready" && previewUrl && (
        <div className="card p-4 md:p-5">
          <img
            src={previewUrl}
            alt={`Novelty certificate for ${name.trim()}`}
            className="w-full rounded-lg border-2"
            style={{ borderColor: "var(--line)" }}
          />
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
            <button className="btn btn-primary" onClick={download} disabled={downloading}>
              {downloading ? "Downloading…" : `Download ${format.toUpperCase()}`}
            </button>
            <a className="btn" href={previewUrl} target="_blank" rel="noopener noreferrer">
              Open full size
            </a>
            <button className="btn sm:ml-auto" onClick={reset}>
              Make another
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            Novelty certificate — not an official credential. Has no academic, legal, or
            professional value.
          </p>
        </div>
      )}
    </div>
  );
}
