"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = `YATools contact — ${name.trim() || "website visitor"}`;
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What would you like to tell us?"
          className="textarea"
          rows={6}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Open mail app
      </button>
      <p className="notice text-sm">
        This opens your own email app with the subject and message prefilled —
        nothing is sent automatically, and we never see the form until you hit
        send.
      </p>
    </form>
  );
}
