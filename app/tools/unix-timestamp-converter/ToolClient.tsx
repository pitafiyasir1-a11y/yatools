"use client";

import { useEffect, useState } from "react";
import { copyText } from "../copy-text";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fmtLocal(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function fmtUTC(d: Date) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(
    d.getUTCHours()
  )}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}

function relativeTo(d: Date) {
  const diff = Date.now() - d.getTime();
  const abs = Math.abs(diff);
  const units: [number, string][] = [
    [1000 * 60 * 60 * 24 * 365, "year"],
    [1000 * 60 * 60 * 24 * 30, "month"],
    [1000 * 60 * 60 * 24, "day"],
    [1000 * 60 * 60, "hour"],
    [1000 * 60, "minute"],
    [1000, "second"],
  ];
  for (const [ms, name] of units) {
    if (abs >= ms) {
      const n = Math.floor(abs / ms);
      return `${n} ${name}${n > 1 ? "s" : ""} ${diff > 0 ? "ago" : "from now"}`;
    }
  }
  return "right now";
}

export default function TimestampClient() {
  const [now, setNow] = useState(() => Date.now());
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [copiedNow, setCopiedNow] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  type TsResult =
    | { ok: true; date: Date; assumed: string }
    | { ok: false; message: string }
    | null;

  const parsed: TsResult = (() => {
    const t = tsInput.trim();
    if (!t) return null;
    if (!/^-?\d+$/.test(t))
      return { ok: false, message: "Enter digits only — a timestamp is a plain integer." };
    const n = Number(t);
    // Milliseconds if it's a 12+ digit number (or negative equivalent)
    const ms = Math.abs(n) >= 1e11 ? n : n * 1000;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return { ok: false, message: "That value is out of range." };
    return { ok: true, date: d, assumed: Math.abs(n) >= 1e11 ? "milliseconds" : "seconds" };
  })();

  const dateToTs: TsResult = (() => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return { ok: false, message: "Pick a valid date and time." };
    return { ok: true, date: d, assumed: "date" };
  })();

  const nowDate = new Date(now);

  const copyNow = async () => {
    const ts = String(Math.floor(Date.now() / 1000));
    setTsInput(ts);
    const ok = await copyText(ts);
    setCopiedNow(ok ? "ok" : "fail");
    setTimeout(() => setCopiedNow("idle"), 2000);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div className="card" style={{ padding: 22, marginBottom: 14 }}>
        <span className="field-label">Right now — live</span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginTop: 8,
          }}
        >
          <div>
            <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Seconds</div>
            <div className="font-mono2" style={{ fontSize: "1.35rem", fontWeight: 800 }}>
              {Math.floor(now / 1000)}
            </div>
          </div>
          <div>
            <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Milliseconds</div>
            <div className="font-mono2" style={{ fontSize: "1.35rem", fontWeight: 800 }}>
              {now}
            </div>
          </div>
          <div>
            <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Your time</div>
            <div style={{ fontWeight: 700 }}>{fmtLocal(nowDate)}</div>
          </div>
          <div>
            <button
              className="btn"
              style={{ marginTop: 6 }}
              onClick={copyNow}
            >
              {copiedNow === "ok" ? "Copied!" : "Copy current timestamp"}
            </button>
            {copiedNow === "fail" && (
              <p role="alert" style={{ color: "var(--red-dark)", fontSize: "0.78rem", marginTop: 6 }}>
                Copy didn&apos;t work in this browser — the timestamp is also in the field below.
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <span className="field-label">Timestamp → date</span>
          <label className="field-label" htmlFor="ts-in" style={{ marginTop: 8 }}>
            Unix timestamp
          </label>
          <input
            id="ts-in"
            className="input input-mono"
            inputMode="numeric"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder="e.g. 1791369600"
          />
          <p style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 6 }}>
            Seconds or milliseconds are detected automatically.
          </p>
          {parsed && !parsed.ok && <div className="notice" style={{ marginTop: 8 }}>{parsed.message}</div>}
          {parsed && parsed.ok && (
            <div style={{ marginTop: 10 }}>
              <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                Detected as {parsed.assumed}
              </div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", marginTop: 4 }}>
                {fmtLocal(parsed.date)}
              </div>
              <div style={{ color: "var(--text2)", fontSize: "0.85rem" }}>{fmtUTC(parsed.date)}</div>
              <div className="font-mono2" style={{ color: "var(--red-dark)", fontSize: "0.85rem", marginTop: 4 }}>
                {relativeTo(parsed.date)}
              </div>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 22 }}>
          <span className="field-label">Date → timestamp</span>
          <label className="field-label" htmlFor="dt-in" style={{ marginTop: 8 }}>
            Pick a date and time
          </label>
          <input
            id="dt-in"
            type="datetime-local"
            className="input"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
          {dateToTs && !dateToTs.ok && (
            <div className="notice" style={{ marginTop: 8 }}>{dateToTs.message}</div>
          )}
          {dateToTs && dateToTs.ok && (
            <div style={{ marginTop: 10 }}>
              <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Seconds</div>
              <div className="font-mono2" style={{ fontWeight: 800, fontSize: "1.05rem" }}>
                {Math.floor(dateToTs.date.getTime() / 1000)}
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 6 }}>
                Milliseconds
              </div>
              <div className="font-mono2" style={{ fontWeight: 700 }}>
                {dateToTs.date.getTime()}
              </div>
              <div style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: 6 }}>
                {fmtUTC(dateToTs.date)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
