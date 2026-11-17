"use client";

import { useMemo, useState } from "react";
import { PrintStyles } from "../doc-convert-parts";
import { CURRENCIES, formatMoney } from "../currency";

type Item = { desc: string; qty: string; rate: string };
const EMPTY_ITEM: Item = { desc: "", qty: "1", rate: "" };

const EXAMPLE_ITEMS: Item[] = [
  { desc: "Website design — homepage + 4 pages", qty: "1", rate: "450" },
  { desc: "Logo design (2 concepts, 2 revisions)", qty: "1", rate: "150" },
];

export default function InvoiceGeneratorClient() {
  const [bizName, setBizName] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizAddr, setBizAddr] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddr, setClientAddr] = useState("");
  const [invNo, setInvNo] = useState("INV-001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<Item[]>([{ ...EMPTY_ITEM }]);
  const [taxPct, setTaxPct] = useState("0");
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");

  const { subtotal, tax, total } = useMemo(() => {
    const sub = items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0), 0);
    const t = sub * ((parseFloat(taxPct) || 0) / 100);
    return { subtotal: sub, tax: t, total: sub + t };
  }, [items, taxPct]);

  const fillExample = () => {
    setBizName("Ayesha Khan — Freelance Designer");
    setBizEmail("ayesha.khan@example.com");
    setBizAddr("Lahore, Pakistan");
    setClientName("Northwind Traders");
    setClientEmail("accounts@northwind.example");
    setClientAddr("Karachi, Pakistan");
    setInvNo("INV-001");
    setDueDate(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
    setItems(EXAMPLE_ITEMS.map((i) => ({ ...i })));
    setTaxPct("0");
    setNotes("Payment due within 14 days. Thank you for your business!");
  };

  const clearAll = () => {
    setBizName(""); setBizEmail(""); setBizAddr("");
    setClientName(""); setClientEmail(""); setClientAddr("");
    setInvNo("INV-001"); setDueDate(""); setItems([{ ...EMPTY_ITEM }]);
    setTaxPct("0"); setNotes("");
  };

  const updateItem = (i: number, patch: Partial<Item>) =>
    setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  const input = "input";
  const f = (label: string, value: string, set: (v: string) => void, ph: string, id: string, type = "text") => (
    <div>
      <label className="field-label" htmlFor={id}>{label}</label>
      <input id={id} type={type} className={input} value={value} placeholder={ph} onChange={(e) => set(e.target.value)} autoComplete="off" />
    </div>
  );

  return (
    <div>
      <PrintStyles rootId="invoice-print" />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button type="button" className="btn btn-sm" onClick={fillExample}>Fill with example</button>
        <button type="button" className="btn btn-sm" onClick={clearAll}>Clear all</button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()} disabled={!bizName.trim() && !clientName.trim()} title="Open the print dialog — choose 'Save as PDF'">
          Download as PDF
        </button>
      </div>
      <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "-6px 0 16px", lineHeight: 1.6 }}>
        Download opens your browser&apos;s print dialog — choose “Save as PDF”. Amounts are formatted
        in the currency you pick. Everything stays on your device; nothing is uploaded.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, alignItems: "start" }}>
        <div className="card" style={{ padding: "clamp(16px, 3vw, 24px)" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: 14 }}>Invoice details</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label className="field-label" htmlFor="inv-cur">Currency</label>
              <select id="inv-cur" className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {f("Invoice #", invNo, setInvNo, "INV-001", "inv-no")}
              {f("Date", date, setDate, "", "inv-date", "date")}
              {f("Due date", dueDate, setDueDate, "", "inv-due", "date")}
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: "8px 0 0" }}>From (your business)</h3>
            {f("Business name", bizName, setBizName, "Your name or business", "inv-biz")}
            {f("Email", bizEmail, setBizEmail, "you@example.com", "inv-biz-email")}
            {f("Address", bizAddr, setBizAddr, "Street, City, Country", "inv-biz-addr")}
            <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: "8px 0 0" }}>Bill to (client)</h3>
            {f("Client name", clientName, setClientName, "Client or company", "inv-client")}
            {f("Client email", clientEmail, setClientEmail, "client@example.com", "inv-client-email")}
            {f("Client address", clientAddr, setClientAddr, "Street, City, Country", "inv-client-addr")}
          </div>

          <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: "20px 0 10px" }}>Line items</h3>
          {items.map((it, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 64px 100px", gap: 8, marginBottom: 10 }}>
              <input className="input" value={it.desc} placeholder="Description" onChange={(e) => updateItem(i, { desc: e.target.value })} aria-label="Description" />
              <input className="input" type="number" min={0} step="any" value={it.qty} placeholder="Qty" onChange={(e) => updateItem(i, { qty: e.target.value })} aria-label="Quantity" />
              <input className="input" type="number" min={0} step="any" value={it.rate} placeholder="Rate" onChange={(e) => updateItem(i, { rate: e.target.value })} aria-label="Rate" />
              {items.length > 1 && (
                <button type="button" className="btn btn-sm" style={{ gridColumn: "1 / -1" }} onClick={() => setItems(items.filter((_, j) => j !== i))}>Remove item</button>
              )}
            </div>
          ))}
          {items.length < 8 && (
            <button type="button" className="btn btn-sm" onClick={() => setItems([...items, { ...EMPTY_ITEM }])}>+ Add item</button>
          )}
          <div style={{ marginTop: 14 }}>
            {f("Tax (%)", taxPct, setTaxPct, "0", "inv-tax", "number")}
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="field-label" htmlFor="inv-notes">Notes (optional)</label>
            <textarea id="inv-notes" className="input" rows={2} value={notes} placeholder="e.g. Payment due within 14 days." onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <div>
          <p className="field-label">Live preview — this is what prints</p>
          <div
            id="invoice-print"
            style={{ background: "#fff", color: "#141210", border: "2.5px solid var(--ink)", borderRadius: 12, padding: "28px 30px", boxShadow: "5px 5px 0 var(--ink)", fontFamily: "var(--font-body, 'DM Sans', sans-serif)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "3px solid #141210", paddingBottom: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.1 }}>INVOICE</div>
                <div style={{ fontSize: "0.85rem", color: "#4c4636", marginTop: 4 }}>{invNo || "INV-001"}</div>
              </div>
              <div style={{ textAlign: "right", fontSize: "0.85rem", color: "#4c4636", lineHeight: 1.6 }}>
                {date && <div>Date: {date}</div>}
                {dueDate && <div>Due: {dueDate}</div>}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18, fontSize: "0.9rem", lineHeight: 1.6 }}>
              <div>
                <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>From</div>
                <strong>{bizName || "Your business"}</strong>
                {bizEmail && <div>{bizEmail}</div>}
                {bizAddr && <div>{bizAddr}</div>}
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Bill to</div>
                <strong>{clientName || "Client"}</strong>
                {clientEmail && <div>{clientEmail}</div>}
                {clientAddr && <div>{clientAddr}</div>}
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", marginBottom: 16 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #141210", textAlign: "left" }}>
                  <th style={{ padding: "6px 4px" }}>Description</th>
                  <th style={{ padding: "6px 4px", textAlign: "right" }}>Qty</th>
                  <th style={{ padding: "6px 4px", textAlign: "right" }}>Rate</th>
                  <th style={{ padding: "6px 4px", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.filter((i) => i.desc || i.rate).map((it, i) => {
                  const amt = (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #d8cdb2" }}>
                      <td style={{ padding: "6px 4px" }}>{it.desc}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right" }}>{it.qty}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right" }}>{formatMoney(parseFloat(it.rate) || 0, currency)}</td>
                      <td style={{ padding: "6px 4px", textAlign: "right" }}>{formatMoney(amt, currency)}</td>
                    </tr>
                  );
                })}
                {items.every((i) => !i.desc && !i.rate) && (
                  <tr><td colSpan={4} style={{ padding: "10px 4px", color: "#8a8168" }}>Add a line item above — it shows here.</td></tr>
                )}
              </tbody>
            </table>
            <div style={{ marginLeft: "auto", width: 220, fontSize: "0.92rem", lineHeight: 1.9 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><strong>{formatMoney(subtotal, currency)}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tax ({parseFloat(taxPct) || 0}%)</span><strong>{formatMoney(tax, currency)}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #141210", paddingTop: 6, marginTop: 4, fontSize: "1.05rem" }}><span>Total due</span><strong style={{ color: "#e0263c" }}>{formatMoney(total, currency)}</strong></div>
            </div>
            {notes && <p style={{ fontSize: "0.85rem", color: "#4c4636", marginTop: 18, lineHeight: 1.6 }}>{notes}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
