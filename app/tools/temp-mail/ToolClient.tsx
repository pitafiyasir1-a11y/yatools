"use client";

import { useEffect, useState } from "react";

type MailOk = { ok: true; data: Record<string, unknown> };
type MailErr = { ok: false; error: { code: string; message: string } };
type MailRes = MailOk | MailErr;

type InboxMessage = {
  id: string;
  from: string | null;
  subject: string | null;
  date: string | null;
  preview: string | null;
};

type FullMessage = {
  id: string | null;
  from: string | null;
  subject: string | null;
  date: string | null;
  body: string | null;
};

const AUTO_REFRESH_MS = 30_000;

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/** Turn a possibly-HTML email body into safe plain text (no HTML rendering). */
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function callMail(params: string): Promise<MailRes> {
  const res = await fetch(`/api/v1/mail?${params}`);
  return (await res.json()) as MailRes;
}

export default function TempMailClient() {
  const [address, setAddress] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [full, setFull] = useState<FullMessage | null>(null);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const fail = (e: unknown) =>
    setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");

  const createAddress = async () => {
    setCreating(true);
    setError(null);
    try {
      const params = new URLSearchParams({ action: "create" });
      const clean = name.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 32);
      if (clean) params.set("name", clean);
      const json = await callMail(params.toString());
      if (!json.ok) throw new Error(json.error.message);
      const addr = str(json.data.address);
      if (!addr) throw new Error("The mail service didn't return an address. Please try again.");
      setAddress(addr);
      setMessages([]);
      setFull(null);
      setSelectedId(null);
      setLastChecked(null);
    } catch (e) {
      fail(e);
    } finally {
      setCreating(false);
    }
  };

  const refreshInbox = async (addr: string, silent = false) => {
    if (!silent) setLoadingInbox(true);
    if (!silent) setError(null);
    try {
      const json = await callMail(
        new URLSearchParams({ action: "inbox", mail: addr }).toString()
      );
      if (!json.ok) throw new Error(json.error.message);
      const list = Array.isArray(json.data.messages)
        ? (json.data.messages as InboxMessage[])
        : [];
      setMessages(list);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (e) {
      if (!silent) fail(e);
    } finally {
      if (!silent) setLoadingInbox(false);
    }
  };

  // Auto-refresh the inbox while an address is active.
  useEffect(() => {
    if (!address) return;
    refreshInbox(address, true);
    const t = setInterval(() => refreshInbox(address, true), AUTO_REFRESH_MS);
    return () => clearInterval(t);
  }, [address]);

  const openMessage = async (id: string) => {
    if (!address || !id) return;
    setSelectedId(id);
    setReading(true);
    setError(null);
    setFull(null);
    try {
      const json = await callMail(
        new URLSearchParams({ action: "read", mail: address, id }).toString()
      );
      if (!json.ok) throw new Error(json.error.message);
      const m = (json.data.message ?? {}) as Partial<FullMessage>;
      setFull({
        id: str(m.id),
        from: str(m.from),
        subject: str(m.subject),
        date: str(m.date),
        body: str(m.body),
      });
    } catch (e) {
      fail(e);
    } finally {
      setReading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!address || !id) return;
    setError(null);
    try {
      const json = await callMail(
        new URLSearchParams({ action: "delete", mail: address, id }).toString()
      );
      if (!json.ok) throw new Error(json.error.message);
      if (selectedId === id) {
        setSelectedId(null);
        setFull(null);
      }
      await refreshInbox(address, true);
    } catch (e) {
      fail(e);
    }
  };

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const discard = () => {
    setAddress(null);
    setMessages([]);
    setFull(null);
    setSelectedId(null);
    setLastChecked(null);
    setError(null);
  };

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div
        className="notice"
        style={{ marginBottom: 18, borderColor: "var(--red)" }}
        role="note"
      >
        <strong>Receive-only.</strong> Addresses expire automatically. Never use this for account
        recovery, banking, or anything important — you cannot recover access. Anyone who knows the
        address can read its inbox, so treat every message as public.
      </div>

      {!address ? (
        <div>
          <label className="neu-label" htmlFor="tm-name">
            Custom name (optional)
          </label>
          <div
            style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "stretch" }}
          >
            <input
              id="tm-name"
              className="neu-input neu-input-mono"
              style={{ flex: "1 1 200px" }}
              placeholder="e.g. yatools-test"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              maxLength={32}
            />
            <button
              type="button"
              className="neu-btn neu-btn-primary"
              onClick={createAddress}
              disabled={creating}
            >
              {creating ? "Creating…" : "Generate temporary address"}
            </button>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 8 }}>
            One click gives you a disposable inbox — no sign-up, no personal details. Fair-use
            limit: 20 mail actions per day.
          </p>
        </div>
      ) : (
        <div>
          <p className="neu-label">Your temporary address</p>
          <div
            className="result-box"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "space-between",
              padding: "14px 18px",
              marginBottom: 18,
            }}
          >
            <span
              className="font-mono2"
              style={{ fontSize: "1rem", fontWeight: 500, wordBreak: "break-all" }}
            >
              {address}
            </span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" className="neu-btn neu-btn-sm" onClick={copyAddress}>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                type="button"
                className="neu-btn neu-btn-sm"
                onClick={() => refreshInbox(address)}
                disabled={loadingInbox}
              >
                {loadingInbox ? "Checking…" : "↻ Check inbox"}
              </button>
              <button type="button" className="neu-btn neu-btn-sm" onClick={discard}>
                Discard
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div>
              <p className="neu-label">
                Inbox {messages.length > 0 && `(${messages.length})`}
                {lastChecked && (
                  <span
                    className="font-mono2"
                    style={{ textTransform: "none", letterSpacing: 0 }}
                  >
                    {" "}
                    · checked {lastChecked} · auto-refreshes every 30s
                  </span>
                )}
              </p>
              {messages.length === 0 ? (
                <div
                  className="result-box"
                  style={{ padding: 20, textAlign: "center", minHeight: 160 }}
                >
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    No messages yet. Use the address above on any sign-up form, then wait —
                    new mail appears here automatically.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {messages.map((m) => (
                    <button
                      key={m.id || `${m.from}-${m.date}`}
                      type="button"
                      onClick={() => m.id && openMessage(m.id)}
                      className="neu-card neu-card-hover"
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        width: "100%",
                        cursor: "pointer",
                        borderColor:
                          selectedId === m.id ? "var(--red)" : undefined,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: "0.92rem",
                          marginBottom: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.subject || "(no subject)"}
                      </div>
                      <div
                        className="font-mono2"
                        style={{ fontSize: "0.72rem", color: "var(--muted)" }}
                      >
                        {m.from || "unknown sender"}
                        {m.date ? ` · ${m.date}` : ""}
                      </div>
                      {m.preview && (
                        <div
                          style={{
                            fontSize: "0.82rem",
                            color: "var(--text2)",
                            marginTop: 6,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {m.preview}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="neu-label">Message</p>
              <div className="result-box" style={{ padding: 18, minHeight: 220 }}>
                {reading ? (
                  <p style={{ color: "var(--muted)" }}>Opening message…</p>
                ) : full ? (
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: 6 }}>
                      {full.subject || "(no subject)"}
                    </h3>
                    <p
                      className="font-mono2"
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--muted)",
                        marginBottom: 12,
                      }}
                    >
                      From: {full.from || "unknown"}
                      {full.date ? ` · ${full.date}` : ""}
                    </p>
                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontSize: "0.9rem",
                        lineHeight: 1.65,
                        maxHeight: 320,
                        overflowY: "auto",
                      }}
                    >
                      {full.body ? htmlToText(full.body) : "This message has no readable body."}
                    </div>
                    {full.id && (
                      <button
                        type="button"
                        className="neu-btn neu-btn-sm"
                        style={{ marginTop: 14 }}
                        onClick={() => deleteMessage(full.id!)}
                      >
                        Delete this message
                      </button>
                    )}
                  </div>
                ) : (
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    Select a message from the inbox to read it here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
          <strong>Heads up:</strong> {error}
        </div>
      )}
    </div>
  );
}
