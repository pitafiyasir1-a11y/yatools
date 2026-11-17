"use client";

import { useMemo, useState } from "react";
import { CURRENCIES, formatMoney } from "../currency";

type YearRow = { year: number; interest: number; principal: number; balance: number };

export default function EmiCalculatorClient() {
  const [amount, setAmount] = useState("500000");
  const [rate, setRate] = useState("12");
  const [tenure, setTenure] = useState("5");
  const [tenureUnit, setTenureUnit] = useState<"years" | "months">("years");
  const [currency, setCurrency] = useState("USD");

  const result = useMemo(() => {
    const P = parseFloat(amount) || 0;
    const annual = parseFloat(rate) || 0;
    const n = tenureUnit === "years" ? Math.round((parseFloat(tenure) || 0) * 12) : Math.round(parseFloat(tenure) || 0);
    if (P <= 0 || n <= 0) return null;
    const r = annual / 1200; // monthly rate
    let emi: number;
    if (r === 0) {
      emi = P / n;
    } else {
      const f = Math.pow(1 + r, n);
      emi = (P * r * f) / (f - 1);
    }
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;
    // Year-by-year amortisation
    const rows: YearRow[] = [];
    let balance = P;
    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const principal = Math.min(emi - interest, balance);
      yearInterest += interest;
      yearPrincipal += principal;
      balance = Math.max(0, balance - principal);
      if (m % 12 === 0 || m === n) {
        rows.push({ year: Math.ceil(m / 12), interest: yearInterest, principal: yearPrincipal, balance });
        yearInterest = 0;
        yearPrincipal = 0;
      }
    }
    return { emi, totalPayable, totalInterest, months: n, rows };
  }, [amount, rate, tenure, tenureUnit]);

  const fmt = (v: number) => formatMoney(v, currency);

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <div>
          <label className="field-label" htmlFor="emi-cur">Currency</label>
          <select id="emi-cur" className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="emi-amt">Loan amount</label>
          <input
            id="emi-amt"
            type="number"
            min={0}
            step="any"
            className="input input-mono"
            value={amount}
            placeholder="e.g. 500000"
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="emi-rate">Interest rate (% per year)</label>
          <input
            id="emi-rate"
            type="number"
            min={0}
            step="any"
            className="input input-mono"
            value={rate}
            placeholder="e.g. 12"
            onChange={(e) => setRate(e.target.value)}
            inputMode="decimal"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="emi-tenure">Loan tenure</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              id="emi-tenure"
              type="number"
              min={0}
              step="any"
              className="input input-mono"
              value={tenure}
              placeholder="e.g. 5"
              onChange={(e) => setTenure(e.target.value)}
              inputMode="decimal"
              autoComplete="off"
              style={{ flex: 1 }}
            />
            <select className="input" value={tenureUnit} onChange={(e) => setTenureUnit(e.target.value as "years" | "months")} style={{ width: 110 }}>
              <option value="years">years</option>
              <option value="months">months</option>
            </select>
          </div>
        </div>
      </div>

      {result ? (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <div className="card" style={{ padding: "18px 20px", textAlign: "center", borderColor: "var(--red)", borderWidth: 2 }}>
              <div className="font-mono2" style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 6 }}>Monthly EMI</div>
              <div className="font-display" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", lineHeight: 1 }}>{fmt(result.emi)}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text2)", marginTop: 6 }}>every month for {result.months} months</div>
            </div>
            <div className="card" style={{ padding: "18px 20px", textAlign: "center" }}>
              <div className="font-mono2" style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 6 }}>Total interest</div>
              <div className="font-display" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", lineHeight: 1 }}>{fmt(result.totalInterest)}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text2)", marginTop: 6 }}>
                {((result.totalInterest / (parseFloat(amount) || 1)) * 100).toFixed(1)}% of the loan amount
              </div>
            </div>
            <div className="card" style={{ padding: "18px 20px", textAlign: "center" }}>
              <div className="font-mono2" style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 6 }}>Total payable</div>
              <div className="font-display" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", lineHeight: 1 }}>{fmt(result.totalPayable)}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text2)", marginTop: 6 }}>principal + interest</div>
            </div>
          </div>

          <p className="field-label" style={{ marginTop: 20 }}>Year-by-year breakdown</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--ink)", textAlign: "left" }}>
                  <th style={{ padding: "8px 6px" }}>Year</th>
                  <th style={{ padding: "8px 6px", textAlign: "right" }}>Interest paid</th>
                  <th style={{ padding: "8px 6px", textAlign: "right" }}>Principal paid</th>
                  <th style={{ padding: "8px 6px", textAlign: "right" }}>Balance left</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.year} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "8px 6px" }}>Year {row.year}</td>
                    <td style={{ padding: "8px 6px", textAlign: "right" }}>{fmt(row.interest)}</td>
                    <td style={{ padding: "8px 6px", textAlign: "right" }}>{fmt(row.principal)}</td>
                    <td style={{ padding: "8px 6px", textAlign: "right" }}>{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 12, lineHeight: 1.6 }}>
            EMI uses the standard reducing-balance formula. Early payments are mostly interest; the
            principal share grows each year. Actual bank offers add processing fees and may use
            different rounding — treat this as an estimate, not a bank quote.
          </p>
        </div>
      ) : (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "18px 0 0" }}>
          Enter a loan amount and a tenure above — the EMI appears instantly.
        </p>
      )}
    </div>
  );
}
