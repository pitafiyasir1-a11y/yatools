"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — invisible to humans
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!r.ok || !data.ok) {
        throw new Error(
          data.error === "CONTACT_NOT_ACTIVATED"
            ? "Our inbox is being connected right now — please email us directly and try the form again in a little while."
            : data.error || "Couldn't send your message."
        );
      }
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send your message.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="notice" role="status">
        <strong>Message sent.</strong> Thanks for reaching out — we read every
        message and usually reply within a couple of days.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="cf-name" className="field-label">
          Your name
        </label>
        <input
          id="cf-name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className="input"
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="cf-email" className="field-label">
          Your email
        </label>
        <input
          id="cf-email"
          type="email"
          required
          maxLength={120}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          className="input"
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="cf-message" className="field-label">
          Message
        </label>
        <textarea
          id="cf-message"
          required
          minLength={10}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What would you like to tell us?"
          className="textarea"
          rows={6}
        />
      </div>
      {/* Honeypot: hidden from humans, catches bots. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: "none" }}
      />
      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p className="notice text-sm">
        Your message goes straight to the YATools inbox — no email app needed,
        nothing to install.
      </p>
    </form>
  );
}
