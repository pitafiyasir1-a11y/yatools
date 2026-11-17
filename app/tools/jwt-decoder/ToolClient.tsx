"use client";

import { useMemo, useState } from "react";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzU2ODk2MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function b64urlDecode(input: string): string {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function fmtDate(ts: number): string {
  const d = new Date(ts * 1000);
  if (Number.isNaN(d.getTime())) return "invalid timestamp";
  return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

type Decoded = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
};

export default function JwtDecoderClient() {
  const [token, setToken] = useState("");

  const result = useMemo((): { decoded: Decoded | null; error: string | null } => {
    const t = token.trim();
    if (!t) return { decoded: null, error: null };
    const parts = t.split(".");
    if (parts.length !== 3) {
      return { decoded: null, error: "A JWT has three parts separated by dots: header.payload.signature — this one doesn't." };
    }
    try {
      const header = JSON.parse(b64urlDecode(parts[0])) as Record<string, unknown>;
      const payload = JSON.parse(b64urlDecode(parts[1])) as Record<string, unknown>;
      if (typeof header !== "object" || header === null || Array.isArray(header)) {
        throw new Error("header is not a JSON object");
      }
      if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
        throw new Error("payload is not a JSON object");
      }
      return { decoded: { header, payload, signature: parts[2] }, error: null };
    } catch {
      return { decoded: null, error: "Could not decode — the header or payload is not valid base64url JSON. Check you pasted the whole token." };
    }
  }, [token]);

  const d = result.decoded;
  const alg = d ? String(d.header.alg ?? "—") : "";
  const exp = d && typeof d.payload.exp === "number" ? d.payload.exp : null;
  const iat = d && typeof d.payload.iat === "number" ? d.payload.iat : null;
  const nowSec = Math.floor(Date.now() / 1000);
  const expired = exp !== null && exp < nowSec;

  const pre = (obj: Record<string, unknown>) => (
    <pre
      style={{
        fontFamily: "var(--font-mono, 'DM Mono', monospace)",
        fontSize: "0.85rem",
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        background: "var(--paper2, #efe7d6)",
        border: "2px solid var(--line)",
        borderRadius: 10,
        padding: 14,
        margin: 0,
      }}
    >
      {JSON.stringify(obj, null, 2)}
    </pre>
  );

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setToken(SAMPLE)}
        >
          Try a sample token
        </button>
        <button type="button" className="btn btn-sm" onClick={() => setToken("")}>
          Clear
        </button>
      </div>

      <label className="field-label" htmlFor="jwt-input">Paste your JWT</label>
      <textarea
        id="jwt-input"
        className="input input-mono"
        rows={4}
        value={token}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIi..."
        onChange={(e) => setToken(e.target.value)}
        spellCheck={false}
        style={{ resize: "vertical", lineHeight: 1.6, wordBreak: "break-all" }}
      />

      <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 12, lineHeight: 1.6 }}>
        Honest note: this tool only <strong>decodes</strong> — it does <strong>not verify the
        signature</strong>. Anyone can read a JWT; a token is trustworthy only if its signature
        checks out on the server with the secret key. Never paste a real production token here, and
        never share a token publicly.
      </p>

      {result.error && (
        <div className="notice" style={{ marginTop: 16 }}>
          {result.error}
        </div>
      )}

      {d && (
        <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="badge badge-blue">alg: {alg}</span>
            {alg.toLowerCase() === "none" && (
              <span className="badge badge-red">alg “none” — unsigned token, trust nothing in it</span>
            )}
            {exp !== null && (
              <span className={`badge ${expired ? "badge-red" : "badge-green"}`}>
                {expired ? "expired" : "not expired"} · exp {fmtDate(exp)}
              </span>
            )}
            {iat !== null && <span className="badge">issued {fmtDate(iat)}</span>}
          </div>
          <div>
            <p className="field-label">Header</p>
            {pre(d.header)}
          </div>
          <div>
            <p className="field-label">Payload</p>
            {pre(d.payload)}
          </div>
          <div>
            <p className="field-label">Signature (not verified — shown, not checked)</p>
            <pre
              style={{
                fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                fontSize: "0.85rem",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                background: "var(--paper2, #efe7d6)",
                border: "2px solid var(--line)",
                borderRadius: 10,
                padding: 14,
                margin: 0,
              }}
            >
              {d.signature}
            </pre>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
              The signature proves the token wasn&apos;t tampered with — but only the server holding
              the secret can check it. This page never sees your secret and never checks the
              signature.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
