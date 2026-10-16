"use client";

import { useMemo, useState } from "react";

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  dayOfWeekBorn: string;
  nextBirthdayIn: { days: number; date: string };
  nextMilestone: string | null;
};

function calculateAge(birthISO: string, now: Date): AgeResult | null {
  const birth = new Date(birthISO + "T00:00:00");
  if (isNaN(birth.getTime()) || birth > now) return null;

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86_400_000);
  const dayOfWeekBorn = birth.toLocaleDateString("en-US", { weekday: "long" });

  // Next birthday
  const thisYear = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  const nextBday = thisYear >= new Date(now.toDateString()) ? thisYear : new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
  const nextBirthdayIn = Math.ceil((nextBday.getTime() - new Date(now.toDateString()).getTime()) / 86_400_000);

  // Next round milestone (every 10k days is fun)
  const next10k = Math.ceil((totalDays + 1) / 10000) * 10000;
  const nextMilestone =
    next10k - totalDays <= 365
      ? `${next10k.toLocaleString()} days old in ${next10k - totalDays} days`
      : null;

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalHours: totalDays * 24,
    dayOfWeekBorn,
    nextBirthdayIn: {
      days: nextBirthdayIn,
      date: nextBday.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    },
    nextMilestone,
  };
}

export default function AgeCalculatorClient() {
  const todayISO = new Date().toISOString().slice(0, 10);
  const [birth, setBirth] = useState("");
  const result = useMemo(
    () => (birth ? calculateAge(birth, new Date()) : null),
    [birth]
  );

  const cards: { label: string; value: string; hint: string }[] = result
    ? [
        {
          label: "Total days",
          value: result.totalDays.toLocaleString(),
          hint: "days lived so far",
        },
        {
          label: "Total weeks",
          value: result.totalWeeks.toLocaleString(),
          hint: "full weeks lived",
        },
        {
          label: "Total hours",
          value: result.totalHours.toLocaleString(),
          hint: "approximate hours",
        },
        {
          label: "Born on",
          value: result.dayOfWeekBorn,
          hint: "day of the week",
        },
        {
          label: "Next birthday",
          value: result.nextBirthdayIn.days === 0 ? "Today! 🎉" : `${result.nextBirthdayIn.days.toLocaleString()} days`,
          hint: result.nextBirthdayIn.date,
        },
        ...(result.nextMilestone
          ? [{ label: "Milestone", value: "🎯", hint: result.nextMilestone }]
          : []),
      ]
    : [];

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <label className="field-label" htmlFor="ac-birth">
        Your date of birth
      </label>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
        <input
          id="ac-birth"
          type="date"
          className="input"
          style={{ flex: "1 1 220px", maxWidth: 320 }}
          value={birth}
          max={todayISO}
          onChange={(e) => setBirth(e.target.value)}
        />
        {birth && (
          <button type="button" className="btn btn-sm" onClick={() => setBirth("")}>
            Clear
          </button>
        )}
      </div>

      {!birth ? (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "18px 0 0" }}>
          Pick your birthdate above to see your exact age — years, months, days, plus fun stats
          like total hours lived and your next birthday countdown.
        </p>
      ) : !result ? (
        <p role="alert" style={{ color: "var(--red-dark)", fontSize: "0.9rem", margin: "18px 0 0" }}>
          That date is in the future — pick a birthdate in the past.
        </p>
      ) : (
        <>
          <div
            className="card"
            style={{
              padding: "20px 24px",
              marginTop: 14,
              textAlign: "center",
              borderColor: "var(--red)",
            }}
            aria-live="polite"
          >
            <div
              className="font-mono2"
              style={{
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--red-dark)",
                marginBottom: 8,
              }}
            >
              Your exact age
            </div>
            <div className="font-display" style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", lineHeight: 1.2 }}>
              {result.years} <span style={{ fontSize: "0.55em", color: "var(--muted)" }}>years</span>{" "}
              {result.months} <span style={{ fontSize: "0.55em", color: "var(--muted)" }}>months</span>{" "}
              {result.days} <span style={{ fontSize: "0.55em", color: "var(--muted)" }}>days</span>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 12,
              marginTop: 14,
            }}
          >
            {cards.map((c) => (
              <div key={c.label} className="card" style={{ padding: "14px 16px" }}>
                <div className="font-display" style={{ fontSize: "1.35rem", lineHeight: 1.2 }}>
                  {c.value}
                </div>
                <div
                  className="font-mono2"
                  style={{
                    fontSize: "0.62rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--red-dark)",
                    marginTop: 6,
                  }}
                >
                  {c.label}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 4 }}>{c.hint}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
