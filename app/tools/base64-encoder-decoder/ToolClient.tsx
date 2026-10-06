"use client";

import { useState } from "react";
import { copyText } from "../copy-text";

type Mode = "encode" | "decode" | "file";

export function toB64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function fromB64(s: string): string {
  const cleaned = s.replace(/\s+/g, "");
  const bin = atob(cleaned);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export default function Base64Client() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [fileInfo, setFileInfo] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const output = (() => {
    if (mode === "file") return "";
    if (!input) return "";
    try {
      return mode === "encode" ? toB64(input) : fromB64(input);
    } catch {
      return "";
    }
  })();

  const decode = () => {
    setError("");
    if (!input.trim()) {
      setError("Paste some Base64 text first.");
      return;
    }
    try {
      fromB64(input);
    } catch {
      setError("That doesn't look like valid Base64 — check for typos or stray characters.");
    }
  };

  const handleFile = async (f: File | undefined) => {
    setError("");
    setFileInfo("");
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("Files are limited to 5 MB so the page stays fast.");
      return;
    }
    const buf = await f.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let bin = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    setFileInfo(`data:${f.type || "application/octet-stream"};base64,${btoa(bin)}`);
    setInput("");
  };

  const copy = async (text: string) => {
    if (!text) return;
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } else {
      setError("Copy failed — select the text manually.");
    }
  };

  const result = mode === "file" ? fileInfo : output;

  return (
    <div className="card" style={{ padding: 22, marginTop: 24 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {(
          [
            ["encode", "Text → Base64"],
            ["decode", "Base64 → Text"],
            ["file", "File → Base64"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            className={`tab ${mode === m ? "tab-active" : ""}`}
            onClick={() => {
              setMode(m);
              setError("");
              setInput("");
              setFileInfo("");
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "file" ? (
        <div>
          <label className="field-label" htmlFor="b64-file">
            Pick a file (max 5 MB)
          </label>
          <input
            id="b64-file"
            type="file"
            className="input"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 8 }}>
            The file is read in your browser and encoded as a data URI — handy for embedding images in CSS or HTML.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          <div>
            <label className="field-label" htmlFor="b64-in">
              {mode === "encode" ? "Text to encode" : "Base64 to decode"}
            </label>
            <textarea
              id="b64-in"
              className="textarea input-mono"
              rows={8}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              onBlur={mode === "decode" ? decode : undefined}
              placeholder={
                mode === "encode" ? "Type or paste text — even emoji works…" : "Paste Base64 here…"
              }
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="btn" onClick={() => { setInput("Hello, YATools! 👋"); setError(""); }}>
                Sample
              </button>
              <button className="btn" onClick={() => { setInput(""); setError(""); setFileInfo(""); }}>
                Clear
              </button>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="field-label" htmlFor="b64-out">Result</label>
              <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                {result ? `${result.length} chars` : ""}
              </span>
            </div>
            <textarea
              id="b64-out"
              className="textarea input-mono"
              rows={8}
              readOnly
              value={mode === "decode" && error ? "" : result}
              placeholder="Result appears live as you type…"
            />
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" onClick={() => copy(result)} disabled={!result}>
                {copied ? "Copied!" : "Copy result"}
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === "file" && fileInfo && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label className="field-label">Data URI</label>
            <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{fileInfo.length} chars</span>
          </div>
          <textarea className="textarea input-mono" rows={6} readOnly value={fileInfo} />
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => copy(fileInfo)}>
            {copied ? "Copied!" : "Copy data URI"}
          </button>
        </div>
      )}

      {error && (
        <div className="notice" style={{ marginTop: 14 }}>
          {error}
        </div>
      )}
    </div>
  );
}
