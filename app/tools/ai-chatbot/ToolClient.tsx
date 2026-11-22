"use client";

import { useRef, useState } from "react";

type Role = "user" | "assistant";
type Msg = { role: Role; text: string };

const SYSTEM_PROMPT =
  "You are a helpful, friendly AI assistant. Answer clearly and briefly. If you do not know something, say so — never invent facts, links, or quotes.";

const MAX_LEN = 1000;

export default function AiChatbotClient() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi! I'm a free AI chatbot. Ask me anything — homework help, ideas, explanations, or a quick draft. No sign-up needed.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setError(null);
    const history: Msg[] = [...messages, { role: "user" as Role, text }];
    setMessages(history);
    setBusy(true);
    try {
      // Keep the last ~8 messages as context so the chat remembers the thread.
      const recent = history.slice(-8);
      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...recent.map((m) => ({ role: m.role, content: m.text })),
          ],
        }),
      });
      if (!res.ok) throw new Error(`AI service returned ${res.status}. Please try again in a moment.`);
      const reply = (await res.text()).trim();
      if (!reply) throw new Error("The AI returned an empty reply. Please try again.");
      setMessages([...history, { role: "assistant", text: reply }]);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6 md:p-8">
        <div
          className="overflow-y-auto pr-1"
          style={{ maxHeight: "420px" }}
          aria-live="polite"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className="mb-4 flex"
              style={{ justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
            >
              <div
                className="p-4"
                style={{
                  maxWidth: "85%",
                  borderRadius: "12px",
                  border: "2.5px solid var(--line)",
                  background:
                    m.role === "user" ? "var(--red-tint)" : "var(--surface)",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  fontSize: "0.95rem",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {busy && (
            <div className="mb-4 flex">
              <div
                className="p-4 font-bold"
                style={{
                  borderRadius: "12px",
                  border: "2.5px solid var(--line)",
                  background: "var(--surface)",
                }}
              >
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex items-end justify-between mb-2 mt-4">
          <label className="field-label !mb-0" htmlFor="ai-chat-input">
            Your message
          </label>
          <span className="font-mono2 text-xs" style={{ color: "var(--muted)" }}>
            {input.length}/{MAX_LEN}
          </span>
        </div>
        <textarea
          id="ai-chat-input"
          className="textarea"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask anything… (Enter to send, Shift+Enter for a new line)"
          rows={3}
        />
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button className="btn btn-primary flex-1" onClick={send} disabled={busy}>
            {busy ? "Thinking…" : "Send"}
          </button>
          <button
            className="btn"
            onClick={() => {
              setMessages([messages[0]]);
              setError(null);
            }}
            disabled={busy}
          >
            Clear chat
          </button>
        </div>

        {error && (
          <div className="notice notice-warn mt-6">
            <strong>Something went wrong.</strong> {error}
          </div>
        )}
      </div>
      <p className="text-center text-sm mt-4" style={{ color: "var(--muted)" }}>
        Free AI chat — answers come from a free AI text model, so they can be
        slow at peak times and are sometimes wrong. Double-check important facts.
      </p>
    </div>
  );
}
