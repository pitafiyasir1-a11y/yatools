/**
 * GET /api/v1/alldl?url=
 * Universal downloader. Primary: ahm7 /api/alldl?url=, adapted defensively to
 *   { links: string[], message: string | null, supportedPlatforms: string[] }.
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

type DownloadResult = {
  links: string[];
  message: string | null;
  supportedPlatforms: string[];
};

/**
 * Defensive mapping of the ahm7 alldl payload.
 * Observed live shape: { links: string[], success: boolean, message: string,
 *   supportedPlatforms: string[], note?: string }.
 * success=false with a message means "unsupported platform" — surfaced as
 * data, not as an error, so the client can show the honest message.
 */
function adaptAlldl(payload: unknown): DownloadResult {
  const out: DownloadResult = { links: [], message: null, supportedPlatforms: [] };
  if (typeof payload !== "object" || payload === null) return out;
  const p = payload as {
    links?: unknown;
    message?: unknown;
    supportedPlatforms?: unknown;
  };
  if (Array.isArray(p.links)) {
    out.links = p.links.filter((l): l is string => typeof l === "string" && l.length > 0);
  }
  if (typeof p.message === "string" && p.message.trim()) out.message = p.message.trim();
  if (Array.isArray(p.supportedPlatforms)) {
    out.supportedPlatforms = p.supportedPlatforms.filter(
      (s): s is string => typeof s === "string" && s.length > 0
    );
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
    // ({ success, message, links, supportedPlatforms }) — only a
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
