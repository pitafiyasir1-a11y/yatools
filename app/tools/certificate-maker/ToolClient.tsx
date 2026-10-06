"use client";

import { useState } from "react";

const TEMPLATES = [
  { id: 1, name: "Modern" },
  { id: 2, name: "Dark Background" },
  { id: 3, name: "Green" },
  { id: 4, name: "Classic" },
  { id: 5, name: "Red and Yellow" },
  { id: 6, name: "Golden Elegant" },
  { id: 7, name: "Blue Simple" },
  { id: 8, name: "Golden and Green" },
];

const FORMATS = [
  { value: "pdf", label: "PDF — best for printing" },
  { value: "png", label: "PNG — high quality image" },
  { value: "jpg", label: "JPG — small file size" },
];

const MAX_NAME = 100; // matches /api/v1/certificate validation
const MAX_DETAILS = 500;
const MAX_SIGNATURE = 100;

type Status = "idle" | "loading" | "ready" | "error";

interface CertResult {
  renderUrl: string;
  template: string;
  format: string;
}

export default function CertificateMakerClient() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [signature, setSignature] = useState("");
  const [details, setDetails] = useState("");
  const [templateId, setTemplateId] = useState(1);
  const [format, setFormat] = useState("pdf");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CertResult | null>(null);
  const [downloading, setDownloading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const generate = async () => {
    if (!name.trim()) {
      setStatus("error");
      setError("Add the recipient's name first.");
      return;
    }
    if (!details.trim()) {
      setStatus("error");
      setError("Describe the achievement — that's what the certificate is for.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/v1/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          date: date || today,
          signature: signature.trim(),
          details: details.trim(),
          templateId,
          format,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.ok === false) {
        throw new Error(
          data?.error?.message || "Certificate generation failed. Please try again."
        );
      }
      setResult({
        renderUrl: data.data.renderUrl,
        template: data.data.template ?? String(templateId),
        format: data.data.format ?? format,
      });
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(
        e instanceof Error ? e.message : "Certificate generation failed. Please try again."
      );
    }
  };

  const download = async () => {
    if (!result?.renderUrl) return;
    setDownloading(true);
    try {
      const res = await fetch(result.renderUrl);
      if (!res.ok) throw new Error("download fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const ext = result.format === "pdf" ? "pdf" : result.format;
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch {
      window.open(result.renderUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
    setResult(null);
  };

  const busy = status === "loading";
  const isImage = result && (result.format === "png" || result.format === "jpg");

  return (
    <div className="max-w-3xl mx-auto">
      {status !== "ready" && (
        <div className="card p-6 md:p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="cert-name">
                Recipient name
              </label>
              <input
                id="cert-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
                placeholder="e.g. Ahmed Khan"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="cert-date">
                Date
              </label>
              <input
                id="cert-date"
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-end justify-between mb-2">
              <label className="field-label !mb-0" htmlFor="cert-details">
                Achievement details
              </label>
              <span className="font-mono2 text-xs" style={{ color: "var(--muted)" }}>
                {details.length}/{MAX_DETAILS}
              </span>
            </div>
            <textarea
              id="cert-details"
              className="textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value.slice(0, MAX_DETAILS))}
              placeholder="e.g. For winning the office cricket tournament 2026"
              rows={3}
            />
          </div>

          <div className="mt-4">
            <label className="field-label" htmlFor="cert-signature">
              Signature line (optional)
            </label>
            <input
              id="cert-signature"
              className="input"
              value={signature}
              onChange={(e) => setSignature(e.target.value.slice(0, MAX_SIGNATURE))}
              placeholder="e.g. Chief Fun Officer"
            />
          </div>

          <div className="mt-6">
            <span className="field-label">Pick a style</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={templateId === t.id}
                  onClick={() => setTemplateId(t.id)}
                  className="btn !px-3 !py-3 flex-col !gap-1"
                  style={{
                    background: templateId === t.id ? "var(--red)" : "var(--surface)",
                    color: templateId === t.id ? "#fff" : "inherit",
                  }}
                >
                  <span className="font-display" style={{ fontSize: "1.4rem", lineHeight: 1 }}>
                    {t.id}
                  </span>
                  <span className="font-mono2 text-xs text-center" style={{ lineHeight: 1.3 }}>
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="field-label" htmlFor="cert-format">
                File format
              </label>
              <select
                id="cert-format"
                className="select"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="btn btn-primary w-full"
                onClick={generate}
                disabled={busy}
              >
                {busy ? "Generating…" : "Generate certificate"}
              </button>
            </div>
          </div>

          {status === "loading" && (
            <div className="result-box mt-6 text-center">
              <p className="font-bold">Generating your certificate…</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                This usually takes a few seconds.
              </p>
            </div>
          )}

          {status === "error" && error && (
            <div className="notice notice-warn mt-6">
              <strong>Something went wrong.</strong> {error}
            </div>
          )}

          <p className="text-xs mt-5" style={{ color: "var(--muted)" }}>
            10 free certificates per day per IP address. Novelty certificates are for fun only —
            they are not official credentials.
          </p>
        </div>
      )}

      {status === "ready" && result && (
        <div className="card p-4 md:p-5">
          {isImage ? (
            <img
              src={result.renderUrl}
              alt={`Novelty certificate for ${name.trim()}`}
              className="w-full rounded-lg border-2"
              style={{ borderColor: "var(--line)" }}
            />
          ) : (
            <div className="result-box text-center !py-10">
              <p className="font-display" style={{ fontSize: "1.8rem" }}>
                Your certificate is ready
              </p>
              <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
                Style {result.template} · PDF · for {name.trim()}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
            <button
              className="btn btn-primary"
              onClick={download}
              disabled={downloading}
            >
              {downloading ? "Downloading…" : `Download ${result.format.toUpperCase()}`}
            </button>
            <a
              className="btn"
              href={result.renderUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open full size
            </a>
            <button className="btn sm:ml-auto" onClick={reset}>
              Make another
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            Novelty certificate — not an official credential. Has no academic, legal, or
            professional value.
          </p>
        </div>
      )}
    </div>
  );
}
