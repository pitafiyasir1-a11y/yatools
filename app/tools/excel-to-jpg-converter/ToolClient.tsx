"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { WorkSheet } from "xlsx";
import { DropZone, HonestLabel, downloadBlob } from "../doc-convert-parts";

const MAX_ROWS = 400;
const MAX_COLS = 26;

type Wb = { Sheets: Record<string, WorkSheet>; SheetNames: string[] };
type SheetImg = { name: string; blob: Blob; url: string };

export default function ExcelToJpgClient() {
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [sheets, setSheets] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [rows, setRows] = useState<string[][]>([]);
  const [truncated, setTruncated] = useState(false);
  const [workbook, setWorkbook] = useState<Wb | null>(null);
  const [quality, setQuality] = useState(0.9);
  const [images, setImages] = useState<SheetImg[]>([]);
  const tableWrapRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setImages([]);
    setError(null);
    setFileName("");
    setSheets([]);
    setRows([]);
    setTruncated(false);
    setActive(0);
    setWorkbook(null);
  };

  const renderSheet = (wb: Wb, idx: number) => {
    import("xlsx").then((XLSX) => {
      const ws = wb.Sheets[wb.SheetNames[idx]];
      const data: unknown[][] = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: "",
        raw: false,
      });
      const trimmed = data
        .slice(0, MAX_ROWS)
        .map((r) => r.slice(0, MAX_COLS).map((c) => String(c)));
      while (trimmed.length && trimmed[trimmed.length - 1].every((c) => c === "")) {
        trimmed.pop();
      }
      setRows(trimmed);
      setTruncated(data.length > MAX_ROWS || (data[0]?.length ?? 0) > MAX_COLS);
      setActive(idx);
    }).catch(() => {
      setError("That sheet couldn't be rendered. Try a different sheet or file.");
    });
  };

  const handleFile = async (f: File) => {
    const ok =
      /\.(xlsx|xls|csv)$/i.test(f.name) ||
      f.type.includes("spreadsheet") ||
      f.type === "text/csv";
    if (!ok) {
      setError("That is not a spreadsheet — please choose an .xlsx, .xls, or .csv file.");
      return;
    }
    reset();
    setLoading(true);
    setError(null);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.read(await f.arrayBuffer(), { type: "array" }) as unknown as Wb;
      if (!wb.SheetNames.length) throw new Error("empty");
      setFileName(f.name.replace(/\.(xlsx|xls|csv)$/i, ""));
      setSheets([...wb.SheetNames]);
      setWorkbook(wb);
      renderSheet(wb, 0);
    } catch {
      setError(
        "That file couldn't be read. It may be corrupted, password-protected, or in an unsupported format."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectSheet = (idx: number) => {
    if (workbook) renderSheet(workbook, idx);
  };

  const captureSheet = async (wb: Wb, idx: number): Promise<SheetImg> => {
    // Render the sheet's table into the staging node, then capture it.
    const XLSX = await import("xlsx");
    const html2canvas = (await import("html2canvas")).default;
    const ws = wb.Sheets[wb.SheetNames[idx]];
    const data: unknown[][] = XLSX.utils.sheet_to_json(ws, {
      header: 1,
      defval: "",
      raw: false,
    });
    const trimmed = data
      .slice(0, MAX_ROWS)
      .map((r) => r.slice(0, MAX_COLS).map((c) => String(c)));
    while (trimmed.length && trimmed[trimmed.length - 1].every((c) => c === "")) {
      trimmed.pop();
    }
    // Flush synchronously so the staging table is painted before html2canvas
    // reads it — a setTimeout guess can capture the previous sheet on slow
    // devices.
    flushSync(() => {
      setRows(trimmed);
      setActive(idx);
    });
    const node = tableWrapRef.current;
    if (!node) throw new Error("staging missing");
    const canvas = await html2canvas(node, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
    });
    const blob = await new Promise<Blob>((res, rej) =>
      canvas.toBlob(
        (b) => (b ? res(b) : rej(new Error("encode failed"))),
        "image/jpeg",
        quality
      )
    );
    const name = wb.SheetNames[idx];
    return { name, blob, url: URL.createObjectURL(blob) };
  };

  const convertActive = async () => {
    if (!workbook) return;
    setConverting(true);
    setError(null);
    try {
      const img = await captureSheet(workbook, active);
      setImages((prev) => {
        const next = prev.filter((p) => p.name !== img.name);
        prev.filter((p) => p.name === img.name).forEach((p) => URL.revokeObjectURL(p.url));
        return [...next, img];
      });
    } catch {
      setError("Capture failed in your browser. Try a smaller sheet or a Chromium-based browser.");
    } finally {
      setConverting(false);
    }
  };

  const convertAll = async () => {
    if (!workbook) return;
    setConverting(true);
    setError(null);
    try {
      const out: SheetImg[] = [];
      for (let i = 0; i < sheets.length; i++) {
        out.push(await captureSheet(workbook, i));
      }
      setImages((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url));
        return out;
      });
    } catch {
      setError("Capture failed in your browser. Try a smaller sheet or a Chromium-based browser.");
    } finally {
      setConverting(false);
    }
  };

  const downloadOne = (p: SheetImg) =>
    downloadBlob(p.blob, `${fileName || "sheet"}-${p.name}.jpg`);

  const busy = loading || converting;

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <HonestLabel>
        Each sheet becomes a JPG image of its data table — great for sharing or embedding, but
        the numbers in a JPG can't be edited or copied into a spreadsheet.
      </HonestLabel>

      {sheets.length === 0 && (
        <DropZone
          accept=".xlsx,.xls,.csv"
          label={loading ? "Reading your spreadsheet…" : "Drop a spreadsheet here, or click to choose one"}
          hint="Excel .xlsx / .xls and .csv files. Runs 100% in your browser — your file is never uploaded."
          onFile={handleFile}
          disabled={busy}
        />
      )}

      {sheets.length > 0 && (
        <>
          <div className="notice notice-ok" style={{ marginBottom: 16 }}>
            <strong>{fileName}</strong> loaded — {sheets.length} sheet
            {sheets.length === 1 ? "" : "s"} found.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {sheets.map((s, i) => (
              <button
                key={s}
                type="button"
                className="btn btn-sm"
                style={
                  i === active
                    ? { background: "var(--red)", color: "#fff", borderColor: "var(--red)" }
                    : undefined
                }
                onClick={() => selectSheet(i)}
              >
                {s}
              </button>
            ))}
          </div>

          {truncated && (
            <div className="notice" style={{ marginBottom: 16 }}>
              This sheet is large — the image shows the first {MAX_ROWS} rows and {MAX_COLS}{" "}
              columns. The rest stays in your original file.
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "end", marginBottom: 16 }}>
            <div>
              <label className="field-label" htmlFor="etj-quality">
                JPG quality
              </label>
              <select
                id="etj-quality"
                className="input"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={busy}
              >
                <option value={0.7}>Medium (smaller file)</option>
                <option value={0.9}>High (recommended)</option>
                <option value={0.98}>Maximum (larger file)</option>
              </select>
            </div>
            <button type="button" className="btn btn-primary" onClick={convertActive} disabled={busy}>
              {converting ? "Capturing…" : `Convert “${sheets[active]}” to JPG`}
            </button>
            {sheets.length > 1 && (
              <button type="button" className="btn" onClick={convertAll} disabled={busy}>
                Convert all sheets
              </button>
            )}
            <button type="button" className="btn" onClick={reset}>
              Start over
            </button>
          </div>

          {images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 12,
                marginBottom: 8,
              }}
            >
              {images.map((p) => (
                <div key={p.name} style={{ textAlign: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={`Sheet ${p.name} as JPG`}
                    style={{
                      width: "100%",
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      display: "block",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={() => downloadOne(p)}
                  >
                    {p.name} ↓
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Off-screen staging node for html2canvas captures. */}
          <div
            ref={tableWrapRef}
            aria-hidden="true"
            style={{
              position: "fixed",
              left: -99999,
              top: 0,
              width: 1000,
              background: "#fff",
              pointerEvents: "none",
            }}
          >
            <SheetTable rows={rows} />
          </div>
        </>
      )}

      {error && <div className="notice" style={{ marginTop: 14 }}>{error}</div>}
    </div>
  );
}

/** Clean, readable HTML table for a sheet's values. */
function SheetTable({ rows }: { rows: string[][] }) {
  if (!rows.length) {
    return (
      <p style={{ padding: 24, color: "var(--muted)", fontSize: "0.9rem" }}>
        This sheet is empty.
      </p>
    );
  }
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        fontSize: "0.82rem",
        lineHeight: 1.5,
        background: "#fff",
      }}
    >
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri}>
            {r.map((c, ci) =>
              ri === 0 ? (
                <th
                  key={ci}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px 10px",
                    textAlign: "left",
                    background: "#f2f2f2",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    color: "#111",
                  }}
                >
                  {c}
                </th>
              ) : (
                <td
                  key={ci}
                  style={{
                    border: "1px solid #ddd",
                    padding: "7px 10px",
                    verticalAlign: "top",
                    wordBreak: "break-word",
                    color: "#111",
                  }}
                >
                  {c}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
