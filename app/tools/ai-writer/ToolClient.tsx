"use client";

import { useState } from "react";

const MODES = [
  {
    value: "essay",
    label: "Essay",
    instruction: "Write an essay",
  },
  {
    value: "email",
    label: "Email",
    instruction: "Write an email",
  },
  {
    value: "story",
    label: "Story",
    instruction: "Write a short story",
  },
  {
    value: "caption",
    label: "Caption",
    instruction: "Write a social media caption",
  },
  {
    value: "product",
    label: "Product description",
    instruction: "Write a product description",
  },
];

const TONES = [
  { value: "formal", label: "Formal", hint: "in a formal, professional tone" },
  { value: "friendly", label: "Friendly", hint: "in a warm, friendly tone" },
  { value: "short", label: "Short", hint: "as briefly as possible, under 80 words" },
];

const MAX_LEN = 1000;

type Status = "idle" | "loading" | "ready" | "error";

export default function AiWriterClient() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("essay");
  const [tone, setTone] = useState("friendly");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const write = async () => {
    const t = topic.trim();
    if (!t) {
      setStatus("error");
      setError("Describe what you want written first.");
      return;
    }
    const m = MODES.find((x) => x.value === mode)!;
    const tn = TONES.find((x) => x.value === tone)!;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `${m.instruction} about the following topic, ${tn.hint}. Write clean, ready-to-use text with no preamble and no explanation of what you did.\n\nTopic: ${t}`,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error(`AI service returned ${res.status}. Please try again in a moment.`);
      const out = (await res.text()).trim();
      if (!out) throw new Error("The AI returned an empty result. Please try again.");
      setOutput(out);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed — select the text manually instead.");
    }
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yatools-ai-writing.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const busy = status === "loading";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6 md:p-8">
        <div className="flex items-end justify-between mb-2">
          <label className="field-label !mb-0" htmlFor="writer-topic">
            What should it be about?
          </label>
          <span className="font-mono2 text-xs" style={{ color: "var(--muted)" }}>
            {topic.length}/{MAX_LEN}
          </span>
        </div>
        <textarea
          id="writer-topic"
          className="textarea"
          value={topic}
          onChange={(e) => setTopic(e.target.value.slice(0, MAX_LEN))}
          placeholder="e.g. a thank-you email to a client after a delayed delivery, or an essay on why reading matters…"
          rows={4}
        />

        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="field-label" htmlFor="writer-mode">
              What to write
            </label>
            <select
              id="writer-mode"
              className="select"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              {MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="writer-tone">
              Tone
            </label>
            <select
              id="writer-tone"
              className="select"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn btn-primary w-full mt-5" onClick={write} disabled={busy}>
          {busy ? "Writing…" : "Write it"}
        </button>

        {status === "loading" && (
          <div className="result-box mt-6 text-center">
            <p className="font-bold">Writing…</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Longer pieces take a little longer — please keep this tab open.
            </p>
          </div>
        )}

        {status === "error" && error && (
          <div className="notice notice-warn mt-6">
            <strong>Something went wrong.</strong> {error}
          </div>
        )}
      </div>

      {status === "ready" && output && (
        <div className="card p-6 md:p-8 mt-6">
          <p className="sec-label">Your draft</p>
          <p className="mt-3" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
            {output}
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button className="btn btn-primary" onClick={copy}>
              {copied ? "Copied!" : "Copy text"}
            </button>
            <button className="btn" onClick={download}>
              Download .txt
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            AI writing is a first draft, not a finished piece — edit it in your
            own voice and check facts, names, and numbers before sending or
            submitting it.
          </p>
        </div>
      )}
    </div>
  );
}
