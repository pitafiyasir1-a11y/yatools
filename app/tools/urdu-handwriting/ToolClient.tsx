"use client";

import { useEffect, useState } from "react";
import {
  Patrick_Hand,
  Caveat,
  Kalam,
  Noto_Nastaliq_Urdu,
  Gulzar,
  Noto_Naskh_Arabic,
  Lateef,
} from "next/font/google";

const fPatrick = Patrick_Hand({ subsets: ["latin"], weight: "400" });
const fCaveat = Caveat({ subsets: ["latin"], weight: "400" });
const fKalam = Kalam({ subsets: ["latin"], weight: "400" });
const fNastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic", "latin"], weight: "400" });
const fGulzar = Gulzar({ subsets: ["arabic", "latin"], weight: "400" });
const fNaskh = Noto_Naskh_Arabic({ subsets: ["arabic", "latin"], weight: "400" });
const fLateef = Lateef({ subsets: ["arabic", "latin"], weight: "400" });

const MAX_CHARS = 4000;

interface FontDef {
  key: string;
  label: string;
  cls: string;
  family: string;
  rtl: boolean;
  jitterBoost?: boolean;
}

const FONTS: FontDef[] = [
  { key: "neat", label: "Neat", cls: fPatrick.className, family: "Patrick Hand", rtl: false },
  { key: "default", label: "Default", cls: fCaveat.className, family: "Caveat", rtl: false },
  { key: "casual", label: "Casual", cls: fCaveat.className, family: "Caveat", rtl: false },
  { key: "messy", label: "Messy", cls: fCaveat.className, family: "Caveat", rtl: false, jitterBoost: true },
  { key: "formal", label: "Formal", cls: fPatrick.className, family: "Patrick Hand", rtl: false },
  { key: "kalam", label: "Kalam", cls: fKalam.className, family: "Kalam", rtl: false },
  { key: "cursive", label: "Cursive", cls: fCaveat.className, family: "Caveat", rtl: false },
  { key: "gloria", label: "Gloria", cls: fCaveat.className, family: "Caveat", rtl: false },
  { key: "reenie", label: "Reenie", cls: fCaveat.className, family: "Caveat", rtl: false },
  { key: "satisfy", label: "Satisfy", cls: fCaveat.className, family: "Caveat", rtl: false },
  { key: "urdu", label: "Urdu — Nastaliq (RTL)", cls: fNastaliq.className, family: "Noto Nastaliq Urdu", rtl: true },
  { key: "urdu2", label: "Urdu — Gulzar (RTL)", cls: fGulzar.className, family: "Gulzar", rtl: true },
  { key: "naskh", label: "Urdu — Naskh (RTL)", cls: fNaskh.className, family: "Noto Naskh Arabic", rtl: true },
  { key: "lateef", label: "Urdu — Lateef (RTL)", cls: fLateef.className, family: "Lateef", rtl: true },
];

const INKS = [
  { key: "blue", label: "Blue", hex: "#1e40c8" },
  { key: "black", label: "Black", hex: "#1a1712" },
  { key: "red", label: "Red", hex: "#d22630" },
  { key: "pink", label: "Pink", hex: "#c2437f" },
  { key: "green", label: "Green", hex: "#1e7a44" },
  { key: "darkblue", label: "Dark blue", hex: "#0e2a6e" },
  { key: "pencil", label: "Pencil", hex: "#6f6a5e" },
  { key: "custom", label: "Custom…", hex: "" },
];

/* A4 proportions */
const PAGE_W = 1240;
const PAGE_H = Math.round((PAGE_W * 297) / 210);
const MARGIN = { top: 130, bottom: 110, left: 120, right: 90 };

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    lines.push(line);
  }
  return lines;
}

interface DrawOpts {
  lines: string[];
  slots: number;
  lineHeight: number;
  family: string;
  size: number;
  ink: string;
  rtl: boolean;
  ruled: boolean;
  rough: boolean;
  jitterBoost: boolean;
}

function drawPage(opts: DrawOpts): string {
  const canvas = document.createElement("canvas");
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const { lines, slots, lineHeight, family, size, ink, rtl, ruled, rough, jitterBoost } = opts;

  /* paper */
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  /* ruled lines + margin line */
  if (ruled) {
    ctx.strokeStyle = "#b7c9e6";
    ctx.lineWidth = 2;
    for (let i = 0; i < slots; i++) {
      const y = MARGIN.top + i * lineHeight;
      ctx.beginPath();
      ctx.moveTo(MARGIN.left - 24, y);
      ctx.lineTo(PAGE_W - MARGIN.right + 24, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(224,38,60,0.45)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(MARGIN.left - 30, MARGIN.top - 46);
    ctx.lineTo(MARGIN.left - 30, PAGE_H - MARGIN.bottom + 46);
    ctx.stroke();
  }

  /* text */
  ctx.fillStyle = ink;
  ctx.font = `${size}px "${family}"`;
  ctx.textBaseline = "alphabetic";
  (ctx as CanvasRenderingContext2D & { direction?: string }).direction = rtl
    ? "rtl"
    : "ltr";
  ctx.textAlign = rtl ? "right" : "left";

  const spaceW = ctx.measureText(" ").width;
  const jitterAmp = rough ? (jitterBoost ? 1.6 : 1) : 0;

  lines.forEach((line, li) => {
    const y = MARGIN.top + li * lineHeight;
    if (!line) return;
    if (jitterAmp === 0) {
      const x = rtl ? PAGE_W - MARGIN.right : MARGIN.left;
      ctx.fillText(line, x, y);
      return;
    }
    let x = rtl ? PAGE_W - MARGIN.right : MARGIN.left;
    for (const word of line.split(" ")) {
      const w = ctx.measureText(word).width;
      const jx = (Math.random() - 0.5) * 5 * jitterAmp;
      const jy = (Math.random() - 0.5) * 4 * jitterAmp;
      const rot = (Math.random() - 0.5) * 0.035 * jitterAmp;
      ctx.save();
      ctx.translate(x + jx, y + jy);
      ctx.rotate(rot);
      ctx.fillText(word, 0, 0);
      ctx.restore();
      x += rtl ? -(w + spaceW) : w + spaceW;
    }
  });

  return canvas.toDataURL("image/png");
}

type ApiStatus = "idle" | "loading" | "done" | "error";

export default function ToolClient() {
  const [text, setText] = useState("");
  const [fontKey, setFontKey] = useState("neat");
  const [inkKey, setInkKey] = useState("blue");
  const [customHex, setCustomHex] = useState("#1e40c8");
  const [size, setSize] = useState(40);
  const [paper, setPaper] = useState<"ruled" | "plain">("ruled");
  const [style, setStyle] = useState<"neat" | "rough">("neat");
  const [pages, setPages] = useState<string[]>([]);
  const [rendering, setRendering] = useState(false);

  const [apiStatus, setApiStatus] = useState<ApiStatus>("idle");
  const [apiImg, setApiImg] = useState("");
  const [apiError, setApiError] = useState("");

  const font = FONTS.find((f) => f.key === fontKey) || FONTS[0];
  const inkHex =
    inkKey === "custom"
      ? /^#[0-9a-fA-F]{6}$/.test(customHex)
        ? customHex
        : "#1e40c8"
      : INKS.find((i) => i.key === inkKey)?.hex || "#1e40c8";

  useEffect(() => {
    return () => {
      if (apiImg) URL.revokeObjectURL(apiImg);
    };
  }, [apiImg]);

  async function renderPages() {
    if (!text.trim()) return;
    setRendering(true);
    setPages([]);
    try {
      await document.fonts.load(`${size}px "${font.family}"`);
      await document.fonts.ready;

      const meas = document.createElement("canvas").getContext("2d");
      if (!meas) throw new Error("Canvas is not available in this browser.");
      meas.font = `${size}px "${font.family}"`;

      const contentW = PAGE_W - MARGIN.left - MARGIN.right;
      const contentH = PAGE_H - MARGIN.top - MARGIN.bottom;
      const lineHeight = Math.round(size * (font.rtl ? 2.1 : 1.8));
      const lines = wrapLines(meas, text, contentW);
      const slots = Math.max(1, Math.floor(contentH / lineHeight));

      const chunks: string[][] = [];
      for (let i = 0; i < lines.length; i += slots)
        chunks.push(lines.slice(i, i + slots));

      const urls = chunks.map((chunk) =>
        drawPage({
          lines: chunk,
          slots,
          lineHeight,
          family: font.family,
          size,
          ink: inkHex,
          rtl: font.rtl,
          ruled: paper === "ruled",
          rough: style === "rough",
          jitterBoost: !!font.jitterBoost,
        })
      );
      setPages(urls.filter(Boolean));
    } finally {
      setRendering(false);
    }
  }

  async function renderViaApi() {
    if (!text.trim()) return;
    setApiStatus("loading");
    setApiError("");
    if (apiImg) URL.revokeObjectURL(apiImg);
    setApiImg("");
    try {
      const body: Record<string, string> = {
        text,
        font: font.key,
        color: inkKey === "custom" ? inkHex : inkKey,
        size: String(size),
        paper,
        style,
      };
      if (font.rtl) {
        body.lang = "urdu";
        body.rtl = "1";
      }
      const res = await fetch("/api/v1/hand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const ct = res.headers.get("content-type") || "";
      if (ct.startsWith("image/")) {
        const blob = await res.blob();
        setApiImg(URL.createObjectURL(blob));
        setApiStatus("done");
      } else {
        const data = (await res.json().catch(() => null)) as {
          ok?: boolean;
          error?: { message?: string };
        } | null;
        throw new Error(
          data?.error?.message ||
            "The handwriting service returned an unexpected response."
        );
      }
    } catch (e) {
      setApiError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
      setApiStatus("error");
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl mb-1">Write it by hand</h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Rendered live in your browser — your text never leaves this page.
        {font.rtl && (
          <span className="badge badge-green ml-2">RTL</span>
        )}
      </p>

      <div className="flex items-baseline justify-between">
        <label className="field-label" htmlFor="hw-text">
          Your text
        </label>
        <span className="font-mono2 text-xs" style={{ color: "var(--muted)" }}>
          {text.length}/{MAX_CHARS}
        </span>
      </div>
      <textarea
        id="hw-text"
        className={`textarea ${font.cls}`}
        rows={6}
        maxLength={MAX_CHARS}
        dir={font.rtl ? "rtl" : "ltr"}
        placeholder={font.rtl ? "اپنا متن یہاں لکھیں…" : "Type the text you want handwritten…"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ fontSize: "1.15rem" }}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        <div>
          <label className="field-label" htmlFor="hw-font">
            Handwriting font
          </label>
          <select
            id="hw-font"
            className="select"
            value={fontKey}
            onChange={(e) => setFontKey(e.target.value)}
          >
            {FONTS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="hw-ink">
            Ink color
          </label>
          <div className="flex gap-2">
            <select
              id="hw-ink"
              className="select flex-1"
              value={inkKey}
              onChange={(e) => setInkKey(e.target.value)}
            >
              {INKS.map((i) => (
                <option key={i.key} value={i.key}>
                  {i.label}
                </option>
              ))}
            </select>
            <span
              className="input !w-14 !px-2 shrink-0"
              style={{ background: inkHex }}
              aria-hidden
            />
          </div>
          {inkKey === "custom" && (
            <input
              type="text"
              inputMode="text"
              className="input input-mono mt-2"
              value={customHex}
              onChange={(e) => setCustomHex(e.target.value)}
              placeholder="#1e40c8"
              aria-label="Custom hex color"
            />
          )}
        </div>
        <div>
          <label className="field-label" htmlFor="hw-size">
            Size: {size}px
          </label>
          <input
            id="hw-size"
            type="range"
            min={16}
            max={80}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-[#e0263c] mt-3"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="hw-paper">
            Paper
          </label>
          <select
            id="hw-paper"
            className="select"
            value={paper}
            onChange={(e) => setPaper(e.target.value as "ruled" | "plain")}
          >
            <option value="ruled">Ruled notebook</option>
            <option value="plain">Plain sheet</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="hw-style">
            Style
          </label>
          <select
            id="hw-style"
            className="select"
            value={style}
            onChange={(e) => setStyle(e.target.value as "neat" | "rough")}
          >
            <option value="neat">Neat</option>
            <option value="rough">Rough</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="button"
          className="btn btn-primary"
          onClick={renderPages}
          disabled={rendering || !text.trim()}
        >
          {rendering ? "Rendering…" : "Render handwriting"}
        </button>
        <button
          type="button"
          className="btn"
          onClick={renderViaApi}
          disabled={apiStatus === "loading" || !text.trim()}
        >
          {apiStatus === "loading" ? "Rendering…" : "Render via API instead"}
        </button>
      </div>

      {rendering && (
        <div className="result-box mt-6 text-center">
          <p className="font-bold">Rendering your handwriting…</p>
        </div>
      )}

      {!rendering && pages.length === 0 && apiStatus === "idle" && (
        <div className="result-box mt-6 text-center">
          <p style={{ color: "var(--muted)" }}>
            Your handwriting preview will appear here.
          </p>
        </div>
      )}

      {pages.length > 0 && (
        <div className="mt-6">
          <h3 className="font-display text-2xl mb-4">
            Preview — {pages.length} page{pages.length > 1 ? "s" : ""}
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {pages.map((src, i) => (
              <div key={i} className="card p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Handwritten page ${i + 1}`}
                  className="w-full rounded-lg"
                  style={{ border: "2px solid var(--line)" }}
                />
                <div className="flex items-center justify-between mt-3 px-1 pb-1">
                  <span
                    className="font-mono2 text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    Page {i + 1}
                  </span>
                  <a
                    href={src}
                    download={`handwriting-page-${i + 1}.png`}
                    className="btn btn-sm"
                  >
                    Download PNG
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {apiStatus === "error" && apiError && (
        <div className="notice notice-warn mt-6" role="alert">
          <strong>API render failed.</strong> {apiError}
        </div>
      )}

      {apiStatus === "done" && apiImg && (
        <div className="mt-6">
          <h3 className="font-display text-2xl mb-4">API render</h3>
          <div className="card p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={apiImg}
              alt="Handwriting rendered via API"
              className="w-full rounded-lg"
              style={{ border: "2px solid var(--line)" }}
            />
            <div className="mt-3 px-1 pb-1">
              <a
                href={apiImg}
                download="handwriting-api.png"
                className="btn btn-sm"
              >
                Download PNG
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
