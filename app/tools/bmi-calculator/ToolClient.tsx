"use client";

import { useMemo, useState } from "react";

type Unit = "metric" | "imperial";

function bmiCategory(bmi: number): { label: string; color: string; range: string } {
  if (bmi < 18.5)
    return { label: "Underweight", color: "#2563eb", range: "Below 18.5" };
  if (bmi < 25)
    return { label: "Normal", color: "#16a34a", range: "18.5 – 24.9" };
  if (bmi < 30)
    return { label: "Overweight", color: "#d97706", range: "25 – 29.9" };
  return { label: "Obese", color: "#dc2626", range: "30 and above" };
}

export default function BmiCalculatorClient() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLbs, setWeightLbs] = useState("");

  const bmi = useMemo(() => {
    if (unit === "metric") {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      if (!h || !w || h <= 0 || w <= 0) return null;
      return w / Math.pow(h / 100, 2);
    }
    const ft = parseFloat(heightFt);
    const inch = parseFloat(heightIn || "0");
    const w = parseFloat(weightLbs);
    if ((!ft && !inch) || !w || w <= 0) return null;
    const totalInches = (ft || 0) * 12 + (inch || 0);
    if (totalInches <= 0) return null;
    return (w / Math.pow(totalInches, 2)) * 703;
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLbs]);

  const cat = bmi !== null ? bmiCategory(bmi) : null;

  // Position on the 15–40 scale bar
  const markerPct = bmi !== null ? Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100)) : 0;

  const inputCls = "input";
  const numProps = { inputMode: "decimal" as const, autoComplete: "off" as const };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {(["metric", "imperial"] as Unit[]).map((u) => (
          <button
            key={u}
            type="button"
            className={`btn btn-sm${unit === u ? " btn-primary" : ""}`}
            onClick={() => setUnit(u)}
            aria-pressed={unit === u}
          >
            {u === "metric" ? "Metric (cm / kg)" : "Imperial (ft / lbs)"}
          </button>
        ))}
      </div>

      {unit === "metric" ? (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            <label className="field-label" htmlFor="bmi-hcm">
              Height (cm)
            </label>
            <input
              id="bmi-hcm"
              type="number"
              min="50"
              max="300"
              step="0.1"
              className={inputCls}
              placeholder="e.g. 170"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              {...numProps}
            />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <label className="field-label" htmlFor="bmi-wkg">
              Weight (kg)
            </label>
            <input
              id="bmi-wkg"
              type="number"
              min="10"
              max="500"
              step="0.1"
              className={inputCls}
              placeholder="e.g. 65"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              {...numProps}
            />
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 110px" }}>
            <label className="field-label" htmlFor="bmi-ft">
              Height (ft)
            </label>
            <input
              id="bmi-ft"
              type="number"
              min="1"
              max="9"
              className={inputCls}
              placeholder="5"
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              {...numProps}
            />
          </div>
          <div style={{ flex: "1 1 110px" }}>
            <label className="field-label" htmlFor="bmi-in">
              Height (in)
            </label>
            <input
              id="bmi-in"
              type="number"
              min="0"
              max="11"
              step="0.5"
              className={inputCls}
              placeholder="7"
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              {...numProps}
            />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <label className="field-label" htmlFor="bmi-lbs">
              Weight (lbs)
            </label>
            <input
              id="bmi-lbs"
              type="number"
              min="20"
              max="1100"
              step="0.1"
              className={inputCls}
              placeholder="e.g. 143"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
              {...numProps}
            />
          </div>
        </div>
      )}

      {!bmi ? (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "18px 0 0" }}>
          Enter your height and weight above — your BMI and category appear instantly.
        </p>
      ) : (
        <div aria-live="polite" style={{ marginTop: 20 }}>
          <div
            className="card"
            style={{
              padding: "20px 24px",
              textAlign: "center",
              borderColor: cat!.color,
              borderWidth: 2,
            }}
          >
            <div
              className="font-mono2"
              style={{
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted)",
                marginBottom: 8,
              }}
            >
              Your BMI
            </div>
            <div
              className="font-display"
              style={{ fontSize: "clamp(2rem, 6vw, 3rem)", lineHeight: 1, color: cat!.color }}
            >
              {bmi.toFixed(1)}
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", marginTop: 8, color: cat!.color }}>
              {cat!.label}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>
              Healthy range: 18.5 – 24.9
            </div>
          </div>

          {/* Scale bar */}
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                position: "relative",
                height: 14,
                borderRadius: 7,
                background:
                  "linear-gradient(to right, #2563eb 0%, #2563eb 14%, #16a34a 14%, #16a34a 40%, #d97706 40%, #d97706 60%, #dc2626 60%, #dc2626 100%)",
                opacity: 0.85,
              }}
              role="img"
              aria-label={`BMI ${bmi.toFixed(1)}, category ${cat!.label}`}
            >
              <div
                style={{
                  position: "absolute",
                  left: `${markerPct}%`,
                  top: -6,
                  width: 4,
                  height: 26,
                  borderRadius: 2,
                  background: "var(--text)",
                  transform: "translateX(-50%)",
                  boxShadow: "0 0 0 2px var(--bg)",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.72rem",
                color: "var(--muted)",
                marginTop: 6,
              }}
            >
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.72rem",
                marginTop: 2,
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              <span style={{ color: "#2563eb" }}>Underweight</span>
              <span style={{ color: "#16a34a" }}>Normal</span>
              <span style={{ color: "#d97706" }}>Overweight</span>
              <span style={{ color: "#dc2626" }}>Obese</span>
            </div>
          </div>
        </div>
      )}

      <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 18, marginBottom: 0 }}>
        BMI is a screening measure, not a diagnosis — it doesn&apos;t account for muscle mass, bone
        density, or body composition. Talk to a health professional for personal advice.
      </p>
    </div>
  );
}
