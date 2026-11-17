"use client";

import { useState } from "react";
import { PrintStyles } from "../doc-convert-parts";

type Exp = { role: string; company: string; dates: string; desc: string };
type Edu = { degree: string; school: string; year: string };

const EMPTY_EXP: Exp = { role: "", company: "", dates: "", desc: "" };
const EMPTY_EDU: Edu = { degree: "", school: "", year: "" };

const EXAMPLE = {
  name: "Ayesha Khan",
  title: "Frontend Developer",
  email: "ayesha.khan@example.com",
  phone: "+92 300 1234567",
  location: "Lahore, Pakistan",
  link: "linkedin.com/in/ayeshakhan",
  summary:
    "Frontend developer with 3 years of experience building fast, accessible web apps with React and TypeScript. Shipped features used by 50,000+ people and cut page load times by 40%.",
  exp: [
    {
      role: "Frontend Developer",
      company: "TechBridge Labs",
      dates: "2023 — Present",
      desc: "Build and maintain customer-facing React apps; led the migration to TypeScript across 4 products.",
    },
    {
      role: "Junior Web Developer",
      company: "PixelWorks Studio",
      dates: "2022 — 2023",
      desc: "Built marketing sites and landing pages; improved Lighthouse scores from 62 to 94 average.",
    },
  ],
  edu: [{ degree: "BS Computer Science", school: "University of the Punjab", year: "2022" }],
  skills: "React, TypeScript, JavaScript, HTML, CSS, Next.js, Git, Figma",
};

export default function ResumeBuilderClient() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [summary, setSummary] = useState("");
  const [exp, setExp] = useState<Exp[]>([{ ...EMPTY_EXP }]);
  const [edu, setEdu] = useState<Edu[]>([{ ...EMPTY_EDU }]);
  const [skills, setSkills] = useState("");

  const fillExample = () => {
    setName(EXAMPLE.name);
    setTitle(EXAMPLE.title);
    setEmail(EXAMPLE.email);
    setPhone(EXAMPLE.phone);
    setLocation(EXAMPLE.location);
    setLink(EXAMPLE.link);
    setSummary(EXAMPLE.summary);
    setExp(EXAMPLE.exp.map((e) => ({ ...e })));
    setEdu(EXAMPLE.edu.map((e) => ({ ...e })));
    setSkills(EXAMPLE.skills);
  };

  const clearAll = () => {
    setName(""); setTitle(""); setEmail(""); setPhone(""); setLocation(""); setLink("");
    setSummary(""); setExp([{ ...EMPTY_EXP }]); setEdu([{ ...EMPTY_EDU }]); setSkills("");
  };

  const updateExp = (i: number, patch: Partial<Exp>) =>
    setExp(exp.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  const updateEdu = (i: number, patch: Partial<Edu>) =>
    setEdu(edu.map((e, j) => (j === i ? { ...e, ...patch } : e)));

  const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const contact = [email, phone, location, link].filter(Boolean).join("  ·  ");
  const filledExp = exp.filter((e) => e.role || e.company);
  const filledEdu = edu.filter((e) => e.degree || e.school);

  const input = "input";
  const field = (label: string, value: string, set: (v: string) => void, ph: string, id: string) => (
    <div>
      <label className="field-label" htmlFor={id}>{label}</label>
      <input id={id} className={input} value={value} placeholder={ph} onChange={(e) => set(e.target.value)} autoComplete="off" />
    </div>
  );

  return (
    <div>
      <PrintStyles rootId="resume-print" />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button type="button" className="btn btn-sm" onClick={fillExample}>Fill with example</button>
        <button type="button" className="btn btn-sm" onClick={clearAll}>Clear all</button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => window.print()}
          disabled={!name.trim()}
          title={name.trim() ? "Open the print dialog — choose 'Save as PDF'" : "Enter your name first"}
        >
          Download as PDF
        </button>
      </div>
      <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "-6px 0 16px", lineHeight: 1.6 }}>
        Download opens your browser&apos;s print dialog — choose “Save as PDF”. Everything stays on
        your device; nothing is uploaded.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, alignItems: "start" }}>
        {/* Form */}
        <div className="card" style={{ padding: "clamp(16px, 3vw, 24px)" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: 14 }}>Your details</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {field("Full name", name, setName, "e.g. Ayesha Khan", "rb-name")}
            {field("Job title", title, setTitle, "e.g. Frontend Developer", "rb-title")}
            {field("Email", email, setEmail, "you@example.com", "rb-email")}
            {field("Phone", phone, setPhone, "+92 300 1234567", "rb-phone")}
            {field("Location", location, setLocation, "City, Country", "rb-loc")}
            {field("Website / LinkedIn (optional)", link, setLink, "linkedin.com/in/you", "rb-link")}
            <div>
              <label className="field-label" htmlFor="rb-summary">Professional summary</label>
              <textarea id="rb-summary" className="input" rows={3} value={summary} placeholder="2–3 sentences about what you do and what you've achieved." onChange={(e) => setSummary(e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="rb-skills">Skills (comma separated)</label>
              <input id="rb-skills" className="input" value={skills} placeholder="React, TypeScript, Figma, Git" onChange={(e) => setSkills(e.target.value)} autoComplete="off" />
            </div>
          </div>

          <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: "20px 0 10px" }}>Experience</h3>
          {exp.map((e, i) => (
            <div key={i} style={{ display: "grid", gap: 10, padding: 12, border: "2px solid var(--line)", borderRadius: 10, marginBottom: 10 }}>
              <input className="input" value={e.role} placeholder="Job title" onChange={(ev) => updateExp(i, { role: ev.target.value })} aria-label="Job title" />
              <input className="input" value={e.company} placeholder="Company" onChange={(ev) => updateExp(i, { company: ev.target.value })} aria-label="Company" />
              <input className="input" value={e.dates} placeholder="Dates, e.g. 2023 — Present" onChange={(ev) => updateExp(i, { dates: ev.target.value })} aria-label="Dates" />
              <textarea className="input" rows={2} value={e.desc} placeholder="What did you do there? One or two lines." onChange={(ev) => updateExp(i, { desc: ev.target.value })} aria-label="Description" />
              {exp.length > 1 && (
                <button type="button" className="btn btn-sm" onClick={() => setExp(exp.filter((_, j) => j !== i))}>Remove</button>
              )}
            </div>
          ))}
          {exp.length < 3 && (
            <button type="button" className="btn btn-sm" onClick={() => setExp([...exp, { ...EMPTY_EXP }])}>+ Add experience</button>
          )}

          <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: "20px 0 10px" }}>Education</h3>
          {edu.map((e, i) => (
            <div key={i} style={{ display: "grid", gap: 10, padding: 12, border: "2px solid var(--line)", borderRadius: 10, marginBottom: 10 }}>
              <input className="input" value={e.degree} placeholder="Degree, e.g. BS Computer Science" onChange={(ev) => updateEdu(i, { degree: ev.target.value })} aria-label="Degree" />
              <input className="input" value={e.school} placeholder="School / university" onChange={(ev) => updateEdu(i, { school: ev.target.value })} aria-label="School" />
              <input className="input" value={e.year} placeholder="Year, e.g. 2022" onChange={(ev) => updateEdu(i, { year: ev.target.value })} aria-label="Year" />
              {edu.length > 1 && (
                <button type="button" className="btn btn-sm" onClick={() => setEdu(edu.filter((_, j) => j !== i))}>Remove</button>
              )}
            </div>
          ))}
          {edu.length < 2 && (
            <button type="button" className="btn btn-sm" onClick={() => setEdu([...edu, { ...EMPTY_EDU }])}>+ Add education</button>
          )}
        </div>

        {/* Live preview */}
        <div>
          <p className="field-label">Live preview — this is what prints</p>
          <div
            id="resume-print"
            style={{ background: "#fff", color: "#141210", border: "2.5px solid var(--ink)", borderRadius: 12, padding: "28px 30px", boxShadow: "5px 5px 0 var(--ink)", fontFamily: "var(--font-body, 'DM Sans', sans-serif)" }}
          >
            <div style={{ borderBottom: "3px solid #141210", paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ fontSize: "1.7rem", fontWeight: 800, lineHeight: 1.1 }}>{name || "Your Name"}</div>
              {title && <div style={{ fontSize: "1rem", color: "#e0263c", fontWeight: 700, marginTop: 4 }}>{title}</div>}
              {contact && <div style={{ fontSize: "0.8rem", color: "#4c4636", marginTop: 6 }}>{contact}</div>}
            </div>
            {summary && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Summary</div>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "#1b1712" }}>{summary}</p>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Experience</div>
              {filledExp.length ? filledExp.map((e, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <strong style={{ fontSize: "0.95rem" }}>{e.role}{e.company ? ` — ${e.company}` : ""}</strong>
                    <span style={{ fontSize: "0.82rem", color: "#4c4636", whiteSpace: "nowrap" }}>{e.dates}</span>
                  </div>
                  {e.desc && <p style={{ fontSize: "0.88rem", lineHeight: 1.55, color: "#1b1712", marginTop: 2 }}>{e.desc}</p>}
                </div>
              )) : <p style={{ fontSize: "0.88rem", color: "#8a8168" }}>Add a job above — it shows here.</p>}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Education</div>
              {filledEdu.length ? filledEdu.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: "0.92rem" }}><strong>{e.degree}</strong>{e.school ? ` — ${e.school}` : ""}</span>
                  <span style={{ fontSize: "0.82rem", color: "#4c4636" }}>{e.year}</span>
                </div>
              )) : <p style={{ fontSize: "0.88rem", color: "#8a8168" }}>Add your education above.</p>}
            </div>
            {skillList.length > 0 && (
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {skillList.map((s) => (
                    <span key={s} style={{ fontSize: "0.8rem", border: "1.5px solid #141210", borderRadius: 20, padding: "2px 10px" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
