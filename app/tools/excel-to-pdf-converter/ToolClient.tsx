"use client";

import { useState } from "react";
import type { WorkSheet } from "xlsx";
import { DropZone, HonestLabel, PrintStyles } from "../doc-convert-parts";

const PRINT_ROOT = "excel-to-pdf-print-root";
const MAX_ROWS = 400;
const MAX_COLS = 26;

type Wb = { Sheets: Record<string, WorkSheet>; SheetNames: string[] };

export default function ExcelToPdfClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [sheets, setSheets] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [rows, setRows] = useState<string[][]>([]);
  const [truncated, setTruncated] = useState(false);
  const [workbook, setWorkbook] = useState<Wb | null>(null);

  const reset = () => {
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
      // Drop trailing fully-empty rows for a cleaner table.
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

  const print = () => window.print();

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <PrintStyles rootId={PRINT_ROOT} />
      <HonestLabel>
        Converted with your browser's built-in print engine — click “Print / Save as PDF” and
        choose <strong>“Save as PDF”</strong> in the print dialog. Sheets print as clean tables;
        charts, images, and complex cell formatting won't carry over.
      </HonestLabel>

      {sheets.length === 0 && (
        <DropZone
          accept=".xlsx,.xls,.csv"
          label={loading ? "Reading your spreadsheet…" : "Drop a spreadsheet here, or click to choose one"}
          hint="Excel .xlsx / .xls and .csv files. Runs 100% in your browser — your file is never uploaded."
          onFile={handleFile}
          disabled={loading}
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
              This sheet is large — the preview and PDF show the first {MAX_ROWS} rows and{" "}
              {MAX_COLS} columns. The rest stays in your original file.
            </div>
          )}

          {/* Print root — the ONLY thing visible in print media. */}
          <div id={PRINT_ROOT} style={{ marginBottom: 16 }}>
            <div
              style={{
                border: "1px solid var(--line)",
                borderRadius: 12,
                overflow: "auto",
                maxHeight: 420,
                background: "#fff",
              }}
            >
              <SheetTable rows={rows} />
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button type="button" className="btn btn-primary" onClick={print}>
              Print / Save as PDF
            </button>
            <button type="button" className="btn" onClick={reset}>
              Convert another file
            </button>
          </div>
        </>
      )}

      {error && <div className="notice" style={{ marginTop: 14 }}>{error}</div>}
    </div>
  );
}

/** Clean, readable HTML table for a sheet's values. */
export function SheetTable({ rows }: { rows: string[][] }) {
  if (!rows.length) {
    return (
      <p style={{ padding: 24, color: "var(--muted)", fontSize: "0.9rem" }}>
        This sheet is empty.
      </p>
    );
  }
  return (
    <table
      className="sheet-table"
      style={{
        borderCollapse: "collapse",
        width: "100%",
        fontSize: "0.82rem",
        lineHeight: 1.5,
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
                    border: "1px solid var(--line)",
                    padding: "8px 10px",
                    textAlign: "left",
                    background: "#f2f2f2",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c}
                </th>
              ) : (
                <td
                  key={ci}
                  style={{
                    border: "1px solid var(--line)",
                    padding: "7px 10px",
                    verticalAlign: "top",
                    wordBreak: "break-word",
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
