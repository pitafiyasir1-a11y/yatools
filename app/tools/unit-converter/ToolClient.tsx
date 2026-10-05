"use client";

import { useMemo, useState } from "react";

type CategoryId = "length" | "weight" | "temperature" | "data";

interface FactorUnit {
  kind: "factor";
  id: string;
  label: string;
  toBase: number; // multiply value by this to get base unit
}
interface FormulaUnit {
  kind: "formula";
  id: string;
  label: string;
  toC: (v: number) => number;
  fromC: (c: number) => number;
}
type Unit = FactorUnit | FormulaUnit;

const CATEGORIES: {
  id: CategoryId;
  label: string;
  note: string;
  baseUnit: string;
  units: Unit[];
}[] = [
  {
    id: "length",
    label: "Length",
    note: "Exact conversion factors to the metre.",
    baseUnit: "metres",
    units: [
      { kind: "factor", id: "mm", label: "Millimetres", toBase: 0.001 },
      { kind: "factor", id: "cm", label: "Centimetres", toBase: 0.01 },
      { kind: "factor", id: "m", label: "Metres", toBase: 1 },
      { kind: "factor", id: "km", label: "Kilometres", toBase: 1000 },
      { kind: "factor", id: "in", label: "Inches", toBase: 0.0254 },
      { kind: "factor", id: "ft", label: "Feet", toBase: 0.3048 },
      { kind: "factor", id: "yd", label: "Yards", toBase: 0.9144 },
      { kind: "factor", id: "mi", label: "Miles", toBase: 1609.344 },
    ],
  },
  {
    id: "weight",
    label: "Weight",
    note: "Exact conversion factors to the gram.",
    baseUnit: "grams",
    units: [
      { kind: "factor", id: "mg", label: "Milligrams", toBase: 0.001 },
      { kind: "factor", id: "g", label: "Grams", toBase: 1 },
      { kind: "factor", id: "kg", label: "Kilograms", toBase: 1000 },
      { kind: "factor", id: "oz", label: "Ounces", toBase: 28.349523125 },
      { kind: "factor", id: "lb", label: "Pounds", toBase: 453.59237 },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    note: "Proper formulas, not simple multipliers.",
    baseUnit: "°C",
    units: [
      { kind: "formula", id: "c", label: "Celsius (°C)", toC: (v) => v, fromC: (c) => c },
      {
        kind: "formula",
        id: "f",
        label: "Fahrenheit (°F)",
        toC: (v) => ((v - 32) * 5) / 9,
        fromC: (c) => (c * 9) / 5 + 32,
      },
      {
        kind: "formula",
        id: "k",
        label: "Kelvin (K)",
        toC: (v) => v - 273.15,
        fromC: (c) => c + 273.15,
      },
    ],
  },
  {
    id: "data",
    label: "Data",
    note: "1024-based (1 KB = 1024 B), as used by operating systems.",
    baseUnit: "bytes",
    units: [
      { kind: "factor", id: "b", label: "Bytes", toBase: 1 },
      { kind: "factor", id: "kb", label: "Kilobytes (KB)", toBase: 1024 },
      { kind: "factor", id: "mb", label: "Megabytes (MB)", toBase: 1024 ** 2 },
      { kind: "factor", id: "gb", label: "Gigabytes (GB)", toBase: 1024 ** 3 },
      { kind: "factor", id: "tb", label: "Terabytes (TB)", toBase: 1024 ** 4 },
    ],
  },
];

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const rounded = parseFloat(n.toPrecision(10));
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 10 });
}

function convertValue(value: number, from: Unit, to: Unit): number {
  const base =
    from.kind === "factor" ? value * from.toBase : from.toC(value);
  return to.kind === "factor" ? base / to.toBase : to.fromC(base);
}

export default function UnitConverterClient() {
  const [categoryId, setCategoryId] = useState<CategoryId>("length");
  const [raw, setRaw] = useState("1");
  const [fromId, setFromId] = useState("m");

  const category = CATEGORIES.find((c) => c.id === categoryId)!;
  const fromUnit = category.units.find((u) => u.id === fromId) ?? category.units[0];

  const switchCategory = (id: CategoryId) => {
    setCategoryId(id);
    const cat = CATEGORIES.find((c) => c.id === id)!;
    if (!cat.units.some((u) => u.id === fromId)) setFromId(cat.units[0].id);
  };

  const value = useMemo(() => {
    const n = parseFloat(raw.replace(/,/g, ""));
    return raw.trim() === "" || Number.isNaN(n) ? null : n;
  }, [raw]);

  const results = useMemo(() => {
    if (value === null) return null;
    return category.units.map((u) => ({
      unit: u,
      out: convertValue(value, fromUnit, u),
    }));
  }, [value, category, fromUnit]);

  const belowAbsoluteZero =
    categoryId === "temperature" &&
    results !== null &&
    results.some((r) => r.unit.id === "k" && r.out < 0);

  const swapToUnit = (id: string) => setFromId(id);

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }} role="tablist" aria-label="Unit category">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={categoryId === c.id}
            className={`neu-btn neu-btn-sm${categoryId === c.id ? " neu-btn-primary" : ""}`}
            onClick={() => switchCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          alignItems: "end",
        }}
      >
        <div>
          <label className="neu-label" htmlFor="uc-value">
            Value
          </label>
          <input
            id="uc-value"
            type="text"
            inputMode="decimal"
            className="neu-input neu-input-mono"
            placeholder="Enter a number…"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>
        <div>
          <label className="neu-label" htmlFor="uc-from">
            From unit
          </label>
          <select
            id="uc-from"
            className="neu-select"
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 10 }}>{category.note}</p>

      {belowAbsoluteZero && (
        <div className="notice" style={{ borderColor: "var(--red)", marginTop: 14 }}>
          <strong>Impossible temperature.</strong> That's below absolute zero (−273.15 °C), so it
          can't exist in reality — check your input.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12,
          marginTop: 18,
        }}
        aria-live="polite"
      >
        {results === null ? (
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Type a number above and every {category.label.toLowerCase()} conversion appears here
            instantly.
          </p>
        ) : (
          results.map(({ unit, out }) => (
            <button
              key={unit.id}
              type="button"
              onClick={() => swapToUnit(unit.id)}
              title={`Convert from ${unit.label}`}
              className="neu-card"
              style={{
                padding: "14px 16px",
                boxShadow: "3px 3px 0 var(--ink)",
                textAlign: "left",
                cursor: "pointer",
                background:
                  unit.id === fromId ? "var(--red-tint)" : undefined,
              }}
            >
              <div className="font-mono2" style={{ fontSize: "1.05rem", fontWeight: 500, lineHeight: 1.3 }}>
                {formatNumber(out)}
              </div>
              <div
                className="font-mono2"
                style={{
                  fontSize: "0.62rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: unit.id === fromId ? "var(--red-dark)" : "var(--muted)",
                  marginTop: 6,
                }}
              >
                {unit.label}
                {unit.id === fromId && " · input"}
              </div>
            </button>
          ))
        )}
      </div>
      {results !== null && (
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 12 }}>
          Tap any result card to make that unit the new input.
        </p>
      )}
    </div>
  );
}
