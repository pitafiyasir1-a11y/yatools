"use client";

import { useState } from "react";

const KNOWN_PLATFORMS = [
  "YouTube",
  "TikTok",
  "Instagram",
  "Facebook",
  "Snapchat",
  "SoundCloud",
  "Reddit",
  "Twitter",
  "Douyin",
  "SnackVideo",
  "CapCut",
];

type ApiOk = {
  ok: true;
  data: { links: string[]; message: string | null; supportedPlatforms: string[] };
};
type ApiErr = { ok: false; error: { code: string; message: string } };

function shortHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.slice(0, 40);
  }
}

export default function UniversalDownloaderClient() {
  const [url, setUrl] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<string[]>(KNOWN_PLATFORMS);

  const fetchLinks = async () => {
    const target = url.trim();
    if (!target) {
      setError("Please paste a video or audio page URL first.");
      return;
    }
    setWorking(true);
    setError(null);
    setLinks([]);
    setMessage(null);
    try {
      const res = await fetch(`/api/v1/alldl?url=${encodeURIComponent(target)}`);
      const json = (await res.json()) as ApiOk | ApiErr;
      if (!json.ok) throw new Error(json.error.message);
      setLinks(json.data.links ?? []);
      setMessage(json.data.message ?? null);
      if (json.data.supportedPlatforms?.length) {
        setPlatforms(json.data.supportedPlatforms);
      }
      if (!json.data.links?.length && !json.data.message) {
        setMessage("No downloadable files were found for that URL.");
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div
        className="notice"
        style={{ marginBottom: 18, borderColor: "var(--red)" }}
        role="note"
      >
        <strong>Use this responsibly.</strong> Only download content you own or have the right to
        save. Respect each platform&apos;s Terms of Service — many sites prohibit downloading, and
        some videos are protected by copyright.
      </div>

      <label className="neu-label" htmlFor="ud-url">
        Video or audio page URL
      </label>
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "stretch",
          marginBottom: 8,
        }}
      >
        <input
          id="ud-url"
          className="neu-input neu-input-mono"
          style={{ flex: "1 1 260px" }}
          placeholder="https://www.youtube.com/watch?v=…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchLinks()}
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          className="neu-btn neu-btn-primary"
          onClick={fetchLinks}
          disabled={working}
        >
          {working ? "Fetching…" : "Get download links"}
        </button>
      </div>
      <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 4 }}>
        Works with links from the platforms below — support varies per site and can change without
        notice. Limit: 10 lookups per day.
      </p>

      {error && (
        <div className="notice" style={{ borderColor: "var(--red)", marginTop: 16 }}>
          <strong>Heads up:</strong> {error}
        </div>
      )}

      {message && !error && (
        <div
          className="notice"
          style={{
            marginTop: 16,
            borderColor: links.length ? "var(--ink)" : "var(--red)",
          }}
        >
          {message}
        </div>
      )}

      {links.length > 0 && !/unsupported platform/i.test(message ?? "") && (
        <div style={{ marginTop: 18 }}>
          <p className="neu-label">
            {links.length} {links.length === 1 ? "file" : "files"} found
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {links.map((l, i) => (
              <div
                key={`${l}-${i}`}
                className="neu-card"
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <span
                  className="font-mono2"
                  style={{ fontSize: "0.78rem", color: "var(--text2)" }}
                >
                  File {i + 1} · {shortHost(l)}
                </span>
                <a
                  href={l}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-btn neu-btn-sm neu-btn-primary"
                >
                  Open / download ↓
                </a>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 10 }}>
            Links open in a new tab — save the file from there. Links may expire; if one is dead,
            fetch fresh links.
          </p>
        </div>
      )}

      <div style={{ marginTop: 22 }}>
        <p className="neu-label">Platforms the service reports</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {platforms.map((p) => (
            <span key={p} className="neu-chip font-mono2" style={{ fontSize: "0.7rem" }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
