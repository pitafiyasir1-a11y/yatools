/**
 * GET /api/v1/alldl?url=
 * Universal downloader. Primary: ahm7 /api/alldl?url=.
 *
 * The live upstream answers:
 *   { success, links: string[], note, mediaInfo: {...}, message?, supportedPlatforms? }
 * The `links` array is only ever two promo-spam links ("follow our channels"),
 * so it is NEVER passed through. The real payload is `mediaInfo`:
 *   { title, author, thumbnail, duration, videoUrl, audioUrl, coverImage,
 *     musicUrl, qualities (null | {quality, url}[]), platform, originalUrl, ... }
 * success=false with a message (e.g. TikTok currently) is surfaced honestly
 * as data, not as an error.
 *
 * No free keyless fallback exists for multi-platform downloading, so when the
 * upstream is down we fail honestly instead of faking results.
 *
 * Strict quota: 10 requests per IP per day (abuse-prone endpoint).
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { assertSafeUrl } from "@/lib/proxy/ssrf";
import { UPSTREAM, TIMEOUTS, okJson, errJson, rateLimited } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 10;
const MAX_URL_LEN = 2000;

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

type DownloadResult = {
  /** Upstream-reported status; false means the platform lookup failed. */
  success: boolean;
  message: string | null;
  supportedPlatforms: string[];
  /** Null when the upstream has no media for the URL. */
  media: MediaResult | null;
};

const nonEmptyString = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : null;

const nonEmptyHttpUrl = (v: unknown): string | null => {
  const s = nonEmptyString(v);
  if (!s) return null;
  // Only hand the client URLs it can actually fetch/open.
  if (!/^https?:\/\//i.test(s)) return null;
  return s;
};

/**
 * Defensive mapping of the ahm7 alldl payload.
 * The promo `links` array is deliberately dropped — it is not media.
 */
function adaptAlldl(payload: unknown): DownloadResult {
  const out: DownloadResult = {
    success: false,
    message: null,
    supportedPlatforms: [],
    media: null,
  };
  if (typeof payload !== "object" || payload === null) return out;
  const p = payload as {
    success?: unknown;
    message?: unknown;
    supportedPlatforms?: unknown;
    mediaInfo?: unknown;
  };

  out.success = p.success === true;
  out.message = nonEmptyString(p.message);
  if (Array.isArray(p.supportedPlatforms)) {
    out.supportedPlatforms = p.supportedPlatforms.filter(
      (s): s is string => typeof s === "string" && s.length > 0
    );
  }

  const mi = p.mediaInfo;
  if (typeof mi === "object" && mi !== null) {
    const m = mi as Record<string, unknown>;
    const qualities: QualityOption[] = [];
    if (Array.isArray(m.qualities)) {
      for (const q of m.qualities) {
        if (typeof q !== "object" || q === null) continue;
        const entry = q as Record<string, unknown>;
        const quality =
          nonEmptyString(entry.quality) ?? nonEmptyString(entry.label);
        const url = nonEmptyHttpUrl(entry.url);
        if (quality && url) qualities.push({ quality, url });
      }
    }
    out.media = {
      title: nonEmptyString(m.title),
      author: nonEmptyString(m.author) ?? nonEmptyString(m.uploader),
      thumbnail: nonEmptyHttpUrl(m.thumbnail),
      duration: nonEmptyString(m.duration),
      platform: nonEmptyString(m.platform),
      videoUrl: nonEmptyHttpUrl(m.videoUrl),
      audioUrl: nonEmptyHttpUrl(m.audioUrl),
      coverImage: nonEmptyHttpUrl(m.coverImage),
      musicUrl: nonEmptyHttpUrl(m.musicUrl),
      qualities,
    };
  }

  return out;
}

export async function GET(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("alldl", RATE_LIMIT, req);
  if (!allowed) return rateLimited("alldl", retryAfterSec ?? 86_400);

  const { searchParams } = new URL(req.url);
  const rawUrl = (searchParams.get("url") ?? "").trim();

  if (!rawUrl) {
    return errJson("MISSING_URL", "Please paste a video or audio page URL.", 400);
  }
  if (rawUrl.length > MAX_URL_LEN) {
    return errJson("URL_TOO_LONG", "That URL is too long. Please use a shorter link.", 400);
  }

  let target: URL;
  try {
    target = await assertSafeUrl(rawUrl);
  } catch (e) {
    return errJson(
      "UNSAFE_URL",
      e instanceof Error ? e.message : "That URL isn't allowed.",
      400
    );
  }

  try {
    const res = await fetch(
      `${UPSTREAM}/api/alldl?url=${encodeURIComponent(target.toString())}`,
      {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUTS.alldl),
      }
    );
    // The upstream answers 200 AND 4xx/5xx with the same JSON shape
    // ({ success, message, mediaInfo, links, supportedPlatforms }) — only a
    // non-JSON body means the service itself is down.
    const text = await res.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error("upstream returned non-JSON");
    }
    return okJson(adaptAlldl(json), "ahm7");
  } catch {
    return errJson(
      "ALLDL_DOWN",
      "The download service is unavailable right now. Please try again in a moment.",
      502,
      "ahm7"
    );
  }
}
