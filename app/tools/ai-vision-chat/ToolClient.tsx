"use client";

import { useRef, useState } from "react";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_PROMPT = 500; // matches /api/v1/imgchat validation (1–500 chars)

type Status = "idle" | "loading" | "error";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AiVisionChatClient() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const questionInput = useRef<HTMLTextAreaElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setError("That file isn't an image. Please choose a JPG, PNG, WebP, or GIF file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setStatus("error");
      setError(
        `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB — the limit is 5MB. Please compress it or pick a smaller one.`
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
      setImageName(file.name);
      setStatus("idle");
      setError(null);
      setMessages([]);
    };
    reader.onerror = () => {
      setStatus("error");
      setError("Couldn't read that image file. Please try a different one.");
    };
    reader.readAsDataURL(file);
  };

  const ask = async () => {
    const q = question.trim();
    if (!imageData) {
      setStatus("error");
      setError("Upload an image first, then ask your question.");
      return;
    }
    if (!q) {
      setStatus("error");
      setError("Type a question about the image first.");
      return;
    }
    setStatus("loading");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");
    try {
      const res = await fetch("/api/v1/imgchat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, userPrompt: q }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.ok === false) {
        throw new Error(
          data?.error?.message || "The AI couldn't answer that. Please try again."
        );
      }
      setMessages((prev) => [...prev, { role: "ai", text: String(data.data.response) }]);
      setStatus("idle");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "The AI couldn't answer that. Please try again.";
      setError(msg);
      setStatus("error");
      // Remove the optimistic user message on failure
      setMessages((prev) => {
        const next = [...prev];
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].role === "user") {
            next.splice(i, 1);
            break;
          }
        }
        return next;
      });
    }
  };

  const changeImage = () => {
    setImageData(null);
    setImageName(null);
    setMessages([]);
    setQuestion("");
    setError(null);
    setStatus("idle");
    if (fileInput.current) fileInput.current.value = "";
  };

  const busy = status === "loading";
  const hasConversation = messages.length > 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Upload card */}
      <div className="card p-6 md:p-8 mb-6">
        <span className="field-label">Your image</span>
        {!imageData ? (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="btn w-full !py-10 flex-col !gap-2 mt-1"
            style={{ borderStyle: "dashed" }}
          >
            <span className="font-display" style={{ fontSize: "1.7rem" }}>
              Drop an image, or click to browse
            </span>
            <span className="font-mono2 text-xs" style={{ color: "var(--muted)" }}>
              JPG, PNG, WebP, GIF · max 5MB
            </span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 items-start mt-1">
            <img
              src={imageData}
              alt="Uploaded image preview"
              className="rounded-lg border-2 shrink-0"
              style={{ borderColor: "var(--line)", maxWidth: 160, maxHeight: 160, objectFit: "cover" }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold break-words">{imageName}</p>
              <p className="font-mono2 text-xs mt-1" style={{ color: "var(--muted)" }}>
                Ready — ask as many questions as you like about this image.
              </p>
              <button className="btn !py-2 mt-3" onClick={changeImage}>
                Change image
              </button>
            </div>
          </div>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Upload an image"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {/* Conversation */}
      {hasConversation && (
        <div className="flex flex-col gap-3 mb-6" aria-live="polite">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "self-end max-w-[85%]" : "self-start max-w-[95%] w-full"}
            >
              {m.role === "user" ? (
                <div
                  className="card !shadow-none"
                  style={{ padding: "12px 16px", background: "var(--surface2)" }}
                >
                  <p className="font-mono2 text-xs mb-1" style={{ color: "var(--muted)" }}>
                    You
                  </p>
                  <p style={{ lineHeight: 1.6 }}>{m.text}</p>
                </div>
              ) : (
                <div className="card" style={{ padding: "16px 18px" }}>
                  <p className="font-mono2 text-xs mb-1" style={{ color: "var(--red-dark)" }}>
                    AI Vision
                  </p>
                  <p style={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{m.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {status === "loading" && (
        <div className="result-box text-center mb-6">
          <p className="font-bold">Looking at your image…</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            The AI is analyzing the photo and writing an answer.
          </p>
        </div>
      )}

      {/* Ask card */}
      <div className="card p-6 md:p-8">
        <div className="flex items-end justify-between mb-2">
          <label className="field-label !mb-0" htmlFor="vision-q">
            {hasConversation ? "Ask another question" : "Ask about the image"}
          </label>
          <span className="font-mono2 text-xs" style={{ color: "var(--muted)" }}>
            {question.length}/{MAX_PROMPT}
          </span>
        </div>
        <textarea
          id="vision-q"
          ref={questionInput}
          className="textarea"
          value={question}
          onChange={(e) => setQuestion(e.target.value.slice(0, MAX_PROMPT))}
          placeholder="What is happening in this photo? Read the text on the sign…"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask();
            }
          }}
        />
        <button className="btn btn-primary w-full mt-4" onClick={ask} disabled={busy}>
          {busy ? "Thinking…" : "Ask"}
        </button>
        <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>
          10 free questions per day per IP address. The image is sent to the AI vision API only to
          answer your question — it is not stored.
        </p>
      </div>

      {status === "error" && error && (
        <div className="notice notice-warn mt-6">
          <strong>Something went wrong.</strong> {error}
        </div>
      )}
    </div>
  );
}
