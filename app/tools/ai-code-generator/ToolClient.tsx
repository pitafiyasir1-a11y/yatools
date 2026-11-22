"use client";

import { useState } from "react";

const LANGUAGES = [
  { value: "Python", label: "Python" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "HTML/CSS", label: "HTML / CSS" },
  { value: "SQL", label: "SQL" },
  { value: "Java", label: "Java" },
];

const MAX_LEN = 1000;

type Status = "idle" | "loading" | "ready" | "error";

export default function AiCodeGeneratorClient() {
  const [task, setTask] = useState("");
  const [language, setLanguage] = useState("Python");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    const t = task.trim();
    if (!t) {
      setStatus("error");
      setError("Describe the code you need first.");
      return;
    }
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
              content: `Write ${language} code for this task: ${t}\n\nReturn ONLY the code with one short comment at the top. No explanation, no markdown fences, no extra text.`,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error(`AI service returned ${res.status}. Please try again in a moment.`);
      let out = (await res.text()).trim();
      if (!out) throw new Error("The AI returned an empty result. Please try again.");
      // Strip markdown fences if the model added them anyway.
      out = out.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
      setCode(out);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed — select the code manually instead.");
    }
  };

  const busy = status === "loading";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6 md:p-8">
        <div className="flex items-end justify-between mb-2">
          <label className="field-label !mb-0" htmlFor="code-task">
            Describe what the code should do
          </label>
          <span className="font-mono2 text-xs" style={{ color: "var(--muted)" }}>
            {task.length}/{MAX_LEN}
          </span>
        </div>
        <textarea
          id="code-task"
          className="textarea"
          value={task}
          onChange={(e) => setTask(e.target.value.slice(0, MAX_LEN))}
          placeholder="e.g. a function that checks if a string is a palindrome, or a login form with username and password…"
          rows={4}
        />

        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="field-label" htmlFor="code-lang">
              Language
            </label>
            <select
              id="code-lang"
              className="select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn btn-primary w-full" onClick={generate} disabled={busy}>
              {busy ? "Generating…" : "Generate code"}
            </button>
          </div>
        </div>

        {status === "loading" && (
          <div className="result-box mt-6 text-center">
            <p className="font-bold">Generating code…</p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Please keep this tab open.
            </p>
          </div>
        )}

        {status === "error" && error && (
          <div className="notice notice-warn mt-6">
            <strong>Something went wrong.</strong> {error}
          </div>
        )}
      </div>

      {status === "ready" && code && (
        <div className="card p-4 md:p-5 mt-6">
          <div className="code-window mt-0">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span className="font-mono2 text-xs ml-2" style={{ color: "#a9a7a0" }}>
                {language}
              </span>
            </div>
            <pre>
              <code>{code}</code>
            </pre>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="btn btn-primary" onClick={copy}>
              {copied ? "Copied!" : "Copy code"}
            </button>
            <button className="btn" onClick={generate} disabled={busy}>
              Regenerate
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            AI code can contain bugs — always read it, test it, and never run
            code you do not understand on important data.
          </p>
        </div>
      )}
    </div>
  );
}
