"use client";

import { useRef, useState, type ReactNode } from "react";

/** Drag-and-drop file picker used by the document converter tools. */
export function DropZone({
  accept,
  label,
  hint,
  onFile,
  disabled,
}: {
  accept: string;
  label: string;
  hint: string;
  onFile: (f: File) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) onFile(e.target.files[0]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className="btn"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
        }}
        style={{
          width: "100%",
          padding: "34px 18px",
          border: "2px dashed var(--line)",
          borderRadius: 14,
          background: dragging ? "color-mix(in srgb, var(--red) 7%, transparent)" : "transparent",
          color: "var(--text2)",
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {label}
      </button>
      <p
        className="font-mono2"
        style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "10px 0 0" }}
      >
        {hint}
      </p>
    </>
  );
}

/**
 * Print CSS that hides all site chrome and shows ONLY the document container
 * when the user converts via the browser's print engine (window.print()).
 */
export function PrintStyles({ rootId }: { rootId: string }) {
  return (
    <style>{`
      @media print {
        body * { visibility: hidden !important; }
        #${rootId}, #${rootId} * { visibility: visible !important; }
        #${rootId} {
          position: absolute !important;
          top: 0 !important; left: 0 !important;
          width: 100% !important;
          margin: 0 !important; padding: 0 !important;
        }
        /* The tool wraps the document in an on-screen scroll box (max-height +
           overflow:auto). In print that would clip the document to one viewport,
           so unbind it: the full document must flow onto the printed pages. */
        #${rootId} > div {
          max-height: none !important;
          overflow: visible !important;
          border: none !important;
          border-radius: 0 !important;
          background: #fff !important;
        }
        #${rootId} .docx-wrapper { background: #fff !important; padding: 0 !important; }
        #${rootId} .docx-wrapper > section.docx {
          box-shadow: none !important;
          margin: 0 auto !important;
          page-break-after: always;
        }
        #${rootId} table.sheet-table { page-break-inside: auto; }
        #${rootId} table.sheet-table tr { page-break-inside: avoid; }
      }
    `}</style>
  );
}

/** Prominent honesty banner — every converter states what it actually does. */
export function HonestLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="notice"
      style={{
        marginBottom: 18,
        borderLeft: "4px solid var(--red)",
        fontSize: "0.88rem",
      }}
    >
      <strong>Honest note: </strong>
      {children}
    </div>
  );
}

/** Trigger a browser download for a Blob with a sensible filename. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Build a real, downloadable PDF from rendered canvases (one canvas = one
 * document page or one sheet render). Each canvas is fitted to A4 width and
 * sliced vertically into A4 pages when taller than one page. Returns a Blob.
 * Used by Word to PDF / Excel to PDF so users get a direct .pdf download
 * instead of only the browser print dialog.
 */
export async function canvasesToPdfBlob(canvases: HTMLCanvasElement[]): Promise<Blob> {
  if (!canvases.length) throw new Error("nothing to convert");
  const { jsPDF } = await import("jspdf");
  const PAGE_W = 595.28; // A4 width, pt
  const PAGE_H = 841.89; // A4 height, pt
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  let firstPage = true;
  for (const canvas of canvases) {
    if (!canvas.width || !canvas.height) continue;
    const slicePx = Math.max(1, Math.floor(canvas.width * (PAGE_H / PAGE_W)));
    for (let y = 0; y < canvas.height; y += slicePx) {
      const h = Math.min(slicePx, canvas.height - y);
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = h;
      const ctx = slice.getContext("2d");
      if (!ctx) continue;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(canvas, 0, -y);
      const img = slice.toDataURL("image/jpeg", 0.92);
      if (!firstPage) pdf.addPage("a4", "portrait");
      firstPage = false;
      const imgH = (h / canvas.width) * PAGE_W;
      pdf.addImage(img, "JPEG", 0, 0, PAGE_W, imgH);
    }
  }
  if (firstPage) throw new Error("nothing to convert");
  return pdf.output("blob");
}
