"use client";

import { useRef, useState } from "react";

type PageSize = "a4" | "letter" | "fit";
type Orientation = "portrait" | "landscape" | "auto";
type Margin = "none" | "small" | "large";

type ImgItem = {
  id: number;
  name: string;
  dataUrl: string;
  mime: string;
  w: number;
  h: number;
};

const MARGINS: { v: Margin; label: string; mm: number }[] = [
  { v: "none", label: "No margin", mm: 0 },
  { v: "small", label: "Small (10mm)", mm: 10 },
  { v: "large", label: "Large (20mm)", mm: 20 },
];

let nextId = 1;

function loadImage(file: File): Promise<ImgItem> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas unavailable"));
        return;
      }
      // JPEG cannot store transparency: flatten onto white first.
      if (file.type === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0);
      const mime = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
      const dataUrl = canvas.toDataURL(mime, 0.92);
      URL.revokeObjectURL(url);
      resolve({ id: nextId++, name: file.name, dataUrl, mime, w, h });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`"${file.name}" could not be read as an image.`));
    };
    img.src = url;
  });
}

export default function ImageToPdfClient() {
  const [items, setItems] = useState<ImgItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [margin, setMargin] = useState<Margin>("small");
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList | File[]) => {
    setError(null);
    const valid = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );
    if (valid.length === 0) {
      setError("No usable images found. Upload JPG, PNG, or WebP files.");
      return;
    }
    for (const f of valid) {
      try {
        const item = await loadImage(f);
        setItems((prev) => [...prev, item]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An image failed to load.");
      }
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const build = async () => {
    if (items.length === 0) {
      setError("Add at least one image first.");
      return;
    }
    setError(null);
    setBuilding(true);
    try {
      // jsPDF is heavy: load it only when the user builds the PDF.
      const { jsPDF } = await import("jspdf");
      const mm = MARGINS.find((m) => m.v === margin)!.mm;

      // Decide the first page so the constructor has a valid size.
      const first = items[0];
      const firstLandscape =
        orientation === "landscape" || (orientation === "auto" && first.w > first.h);
      let format: string | number[] = "a4";
      if (pageSize === "letter") format = "letter";
      if (pageSize === "fit") {
        // jsPDF custom size in mm; 1px ≈ 0.264583mm at 96dpi.
        format = [first.w * 0.264583, first.h * 0.264583];
      }
      const doc = new jsPDF({
        unit: "mm",
        format,
        orientation: pageSize === "fit" ? (first.w >= first.h ? "landscape" : "portrait") : firstLandscape ? "landscape" : "portrait",
        hotfixes: ["px_scaling"],
      });

      items.forEach((item, idx) => {
        const landscape = orientation === "landscape" || (orientation === "auto" && item.w > item.h);
        let pageW: number;
        let pageH: number;
        if (pageSize === "fit") {
          pageW = item.w * 0.264583;
          pageH = item.h * 0.264583;
        } else {
          const base = pageSize === "letter" ? { w: 215.9, h: 279.4 } : { w: 210, h: 297 };
          pageW = landscape ? base.h : base.w;
          pageH = landscape ? base.w : base.h;
        }
        const m = pageSize === "fit" ? 0 : mm;
        const maxW = pageW - m * 2;
        const maxH = pageH - m * 2;
        // Image dims in mm (96dpi pixels → mm), scaled down to fit, never up.
        const imgWmm = item.w * 0.264583;
        const imgHmm = item.h * 0.264583;
        const scale = Math.min(maxW / imgWmm, maxH / imgHmm, 1);
        const outW = imgWmm * scale;
        const outH = imgHmm * scale;
        const x = (pageW - outW) / 2;
        const y = (pageH - outH) / 2;

        if (idx > 0) doc.addPage([pageW, pageH], pageW >= pageH ? "landscape" : "portrait");
        doc.addImage(item.dataUrl, item.mime === "image/jpeg" ? "JPEG" : "PNG", x, y, outW, outH);
      });

      doc.save("images.pdf");
    } catch {
      setError("PDF creation failed in your browser. Try refreshing or using smaller images.");
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => inputRef.current?.click()}
        style={{ width: "100%" }}
      >
        + Add images (JPG, PNG, WebP)
      </button>
      <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "10px 0 0" }}>
        One image per page. Everything happens on your device — nothing is uploaded.
      </p>

      {items.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 10,
            marginTop: 18,
          }}
        >
          {items.map((item, i) => (
            <div key={item.id} className="card" style={{ padding: 8, background: "var(--surface)" }}>
              <img
                src={item.dataUrl}
                alt={item.name}
                style={{
                  width: "100%",
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "2px solid var(--line)",
                  display: "block",
                }}
              />
              <div
                className="font-mono2"
                style={{
                  fontSize: "0.65rem",
                  color: "var(--muted)",
                  marginTop: 6,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {i + 1} · {item.name}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move earlier"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move later"
                >
                  →
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setItems((prev) => prev.filter((p) => p.id !== item.id))}
                  aria-label={`Remove ${item.name}`}
                  style={{ marginLeft: "auto" }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginTop: 18,
        }}
      >
        <div>
          <label className="field-label" htmlFor="ip-size">Page size</label>
          <select
            id="ip-size"
            className="select"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
          >
            <option value="a4">A4</option>
            <option value="letter">Letter (US)</option>
            <option value="fit">Fit to image</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="ip-orient">Orientation</label>
          <select
            id="ip-orient"
            className="select"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            disabled={pageSize === "fit"}
          >
            <option value="auto">Auto (from image)</option>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="ip-margin">Margin</label>
          <select
            id="ip-margin"
            className="select"
            value={margin}
            onChange={(e) => setMargin(e.target.value as Margin)}
            disabled={pageSize === "fit"}
          >
            {MARGINS.map((m) => (
              <option key={m.v} value={m.v}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={build}
        disabled={building || items.length === 0}
        style={{ marginTop: 18 }}
      >
        {building ? "Building PDF…" : `Download PDF (${items.length} page${items.length === 1 ? "" : "s"})`}
      </button>

      {error && (
        <div className="notice" style={{ marginTop: 14 }}>
          {error}
        </div>
      )}
    </div>
  );
}
