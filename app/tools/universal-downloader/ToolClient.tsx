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

type QualityOption = { quality: string; url: string };

type MediaResult = {
  title: string | null;
  author: string | null;
  thumbnail: string | null;
  duration: string | null;
  platform: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  coverImage: string | null;
  musicUrl: string | null;
  qualities: QualityOption[];
};

type ApiOk = {
  ok: true;
  data: {
    success: boolean;
    message: string | null;
    supportedPlatforms: string[];
    media: MediaResult | null;
  };
};
type ApiErr = { ok: false; error: { code: string; message: string } };

/** Build a safe download filename from a media title. */
function safeFilename(title: string | null, ext: string): string {
  const base = (title ?? "video")
    .replace(/[^\p{L}\p{N}\s._-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${base || "video"}${ext}`;
}

/**
 * Download that really works: fetch the file, save it as a blob with a
 * sensible filename. Some hosts block cross-origin fetch — then fall back to
 * opening the file in a new tab so the user can save it from there.
 * Returns true when the direct save worked, false when the caller should show
 * the manual "open in new tab" fallback (window.open from an async context is
 * often popup-blocked, so we never pretend it succeeded).
 */
async function saveFile(
  fileUrl: string,
  filename: string,
  setBusy: (b: string | null) => void,
  setNote: (n: string | null) => void
): Promise<boolean> {
  setBusy(filename);
  setNote(null);
  try {
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    return true;
  } catch {
    const popup = window.open(fileUrl, "_blank", "noopener");
    setNote(
      popup
        ? "Your browser blocked the direct save — the file opened in a new tab. Use Save from there."
        : "Your browser blocked the direct save (and the popup). Use the “Open file in new tab” button below, then save it from there."
    );
    return false;
  } finally {
    setBusy(null);
  }
}

export default function UniversalDownloaderClient() {
  const [url, setUrl] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaResult | null>(null);
  const [platforms, setPlatforms] = useState<string[]>(KNOWN_PLATFORMS);
  const [selectedQuality, setSelectedQuality] = useState(0);
  const [busyFile, setBusyFile] = useState<string | null>(null);
  const [downloadNote, setDownloadNote] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const fetchMedia = async () => {
    const target = url.trim();
    if (!target) {
      setError("Please paste a video or audio page URL first.");
      return;
    }
    setWorking(true);
    setError(null);
    setMessage(null);
    setMedia(null);
    setDownloadNote(null);
    setFallbackUrl(null);
    setSelectedQuality(0);
    try {
      const res = await fetch(`/api/v1/alldl?url=${encodeURIComponent(target)}`);
      const json = (await res.json()) as ApiOk | ApiErr;
      if (!json.ok) throw new Error(json.error.message);
      const data = json.data;
      setMedia(data.media);
      setMessage(data.message);
      if (data.supportedPlatforms?.length) {
        setPlatforms(data.supportedPlatforms);
      }
      if (!data.success && !data.message) {
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

  const hasQualities = (media?.qualities?.length ?? 0) > 0;
  const chosenQuality = hasQualities
    ? media!.qualities[Math.min(selectedQuality, media!.qualities.length - 1)]
    : null;

  const downloadButtons: { label: string; fileUrl: string; filename: string }[] = [];
  if (media) {
    if (hasQualities && chosenQuality) {
      downloadButtons.push({
        label: `Download Video (${chosenQuality.quality})`,
        fileUrl: chosenQuality.url,
        filename: safeFilename(media.title, ".mp4"),
      });
    } else if (media.videoUrl) {
      downloadButtons.push({
        label: "Download Video",
        fileUrl: media.videoUrl,
        filename: safeFilename(media.title, ".mp4"),
      });
    }
    if (media.audioUrl) {
      downloadButtons.push({
        label: "Download Audio",
        fileUrl: media.audioUrl,
        filename: safeFilename(media.title, ".mp3"),
      });
    }
    // Some platforms return audio as a "music" file instead.
    if (!media.audioUrl && media.musicUrl) {
      downloadButtons.push({
        label: "Download Audio",
        fileUrl: media.musicUrl,
        filename: safeFilename(media.title, ".mp3"),
      });
    }
  }

  const imageSrc = media?.thumbnail ?? media?.coverImage ?? null;
  const metaLine = [media?.author, media?.duration].filter(Boolean).join(" · ");

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div
        className="notice"
        style={{ marginBottom: 18, borderColor: "var(--red)" }}
        role="note"
      >
        <strong>Use this responsibly.</strong> Only download content you own or have the right to
        save. Respect each platform&apos;s Terms of Service — many sites prohibit downloading, and
        some videos are protected by copyright.
      </div>

      <label className="field-label" htmlFor="ud-url">
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
          className="input input-mono"
          style={{ flex: "1 1 260px" }}
          placeholder="https://www.youtube.com/watch?v=…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchMedia()}
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={fetchMedia}
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
          style={{ marginTop: 16, borderColor: media ? "var(--line)" : "var(--red)" }}
        >
          {message}
        </div>
      )}

      {media && !error && (
        <div style={{ marginTop: 18 }}>
          <div
            className="card"
            style={{
              padding: "16px",
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {imageSrc && (
              <img
                src={imageSrc}
                alt={media.title ?? "Video thumbnail"}
                loading="lazy"
                style={{
                  width: "100%",
                  maxWidth: 240,
                  height: "auto",
                  borderRadius: 8,
                  border: "1px solid var(--line)",
                  flex: "0 0 auto",
                }}
                referrerPolicy="no-referrer"
              />
            )}
            <div style={{ flex: "1 1 220px", minWidth: 0 }}>
              {media.platform && (
                <span
                  className="tab font-mono2"
                  style={{ fontSize: "0.7rem", marginBottom: 10, display: "inline-block" }}
                >
                  {media.platform}
                </span>
              )}
              <h2
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.35,
                  margin: "0 0 6px",
                  overflowWrap: "anywhere",
                }}
              >
                {media.title ?? "Untitled media"}
              </h2>
              {metaLine && (
                <p style={{ fontSize: "0.85rem", color: "var(--text2)", margin: "0 0 14px" }}>
                  {metaLine}
                </p>
              )}

              {hasQualities && (
                <div style={{ marginBottom: 12 }}>
                  <label className="field-label" htmlFor="ud-quality">
                    Quality
                  </label>
                  <select
                    id="ud-quality"
                    className="input"
                    style={{ maxWidth: 260 }}
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(Number(e.target.value))}
                  >
                    {media.qualities.map((q, i) => (
                      <option key={`${q.quality}-${i}`} value={i}>
                        {q.quality}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {downloadButtons.length > 0 ? (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {downloadButtons.map((b) => (
                    <button
                      key={b.filename}
                      type="button"
                      className="btn btn-primary"
                      disabled={busyFile !== null}
                      onClick={() =>
                        saveFile(b.fileUrl, b.filename, setBusyFile, setDownloadNote).then(
                          (ok) => {
                            if (!ok) setFallbackUrl(b.fileUrl);
                          }
                        )
                      }
                    >
                      {busyFile === b.filename ? "Preparing download…" : `${b.label} ↓`}
                    </button>
                  ))}
                  {fallbackUrl && (
                    <a
                      href={fallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                    >
                      Open file in new tab ↗
                    </a>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: 0 }}>
                  The service found this page but no downloadable files were returned.
                </p>
              )}

              {downloadNote && (
                <p style={{ fontSize: "0.8rem", color: "var(--text2)", marginTop: 10 }}>
                  {downloadNote}
                </p>
              )}
            </div>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 10 }}>
            Links may expire — if a download fails, fetch fresh links. Some browsers block direct
            saves; then the file opens in a new tab instead.
          </p>
        </div>
      )}

      <div style={{ marginTop: 22 }}>
        <p className="field-label">Platforms the service reports</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {platforms.map((p) => (
            <span key={p} className="tab font-mono2" style={{ fontSize: "0.7rem" }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
