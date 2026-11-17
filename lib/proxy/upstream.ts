/**
 * Shared helpers for the /api/v1/* proxy routes.
 *
 * CONTRACT (JSON routes):
 *   success: { ok: true, provider, fallbackUsed, data: {...} }
 *   error:   { ok: false, provider, fallbackUsed, error: { code, message } }
 *   HTTP 400 = validation error, 429 = rate limit (+Retry-After), 502 = upstream+fallbacks failed.
 *
 * Binary routes (websnap, tts, hand, wikipdf) stream bytes with the correct
 * content-type and X-Provider / X-Fallback-Used headers; on error they return
 * the same JSON error shape (clients check the content-type).
 */

export const UPSTREAM =
  process.env.UPSTREAM_BASE || "https://ahm7xmakki.com";

/**
 * Fallback upstream — same operator, same API shapes, different deployment.
 * Verified live 2026-11-14 (real requests, not page loads): TTS returns real
 * MP3 (twice), alldl returns real YouTube links, n8n returns real templates,
 * imgchat returns a real image description, wikipdf returns a real 8-page PDF.
 * Cloudflare fronts freeapi.pro: POSTs need a browser-like User-Agent
 * (a bare script UA gets 403 error 1010), so fetchUpstream always sends one.
 *
 * ORDER FLIP (2026-11-18): ahm7xmakki.com now serves a "We have moved to
 * FreeAPI — freeapi.pro" page and its API returns 405 / 502 / empty bodies /
 * 200+HTML. freeapi.pro is now tried FIRST and ahm7 is the fallback.
 * (Stale Nov 14 note removed: freeapi.pro transcribe YouTube mode VERIFIED
 * working 2026-11-18 with a real "Me at the zoo" transcript.)
 */
export const FALLBACK_UPSTREAM = "https://freeapi.pro";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Try freeapi.pro first, then ahm7 as fallback. (Order flipped 2026-11-18:
 * ahm7 moved to freeapi.pro — see FALLBACK_UPSTREAM comment.) Returns the
 * first successful (2xx) response plus whether the fallback (ahm7) served
 * it. Throws the last error when both fail. A fresh timeout signal is
 * created per attempt so the fallback is not starved by the first
 * attempt's clock.
 */
export async function fetchUpstream(
  path: string,
  init: RequestInit & { timeoutMs?: number },
): Promise<{ res: Response; fallbackUsed: boolean }> {
  const { timeoutMs = 30_000, signal: _ignored, headers, ...rest } = init;
  const mergedHeaders: Record<string, string> = {
    "user-agent": BROWSER_UA,
    ...(headers as Record<string, string> | undefined),
  };
  let lastErr: unknown = new Error("all upstreams failed");
  for (const base of [FALLBACK_UPSTREAM, UPSTREAM]) {
    try {
      const res = await fetch(`${base}${path}`, {
        ...rest,
        headers: mergedHeaders,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok) return { res, fallbackUsed: base === UPSTREAM };
      lastErr = new Error(`upstream ${res.status} from ${base}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export const TIMEOUTS = {
  websnap: 25_000,
  transcribe: 55_000,
  tts: 30_000,
  voices: 15_000,
  hand: 30_000,
  wikipdf: 40_000,
  n8n: 20_000,
  tti: 90_000,
  msearch: 15_000,
  certificate: 40_000,
  imgchat: 60_000,
  alldl: 30_000,
  mail: 45_000,
} as const;

export function okJson(data: unknown, provider: string, fallbackUsed = false): Response {
  return Response.json({ ok: true, provider, fallbackUsed, data });
}

export function errJson(
  code: string,
  message: string,
  status: number,
  provider = "ahm7",
  fallbackUsed = false,
): Response {
  return Response.json(
    { ok: false, provider, fallbackUsed, error: { code, message } },
    { status },
  );
}

/** 429 + Retry-After for daily per-tool limits. */
export function rateLimited(tool: string, retryAfterSec: number): Response {
  return new Response(
    JSON.stringify({
      ok: false,
      provider: "yatools",
      fallbackUsed: false,
      error: {
        code: "RATE_LIMITED",
        message: "Daily limit reached for this tool — try again tomorrow.",
      },
      tool,
    }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "Retry-After": String(retryAfterSec),
      },
    },
  );
}

/** Headers for binary responses: X-Provider / X-Fallback-Used. */
export function binaryHeaders(
  provider: string,
  fallbackUsed: boolean,
  contentType: string,
): Record<string, string> {
  return {
    "content-type": contentType,
    "X-Provider": provider,
    "X-Fallback-Used": fallbackUsed ? "1" : "0",
  };
}

/** Friendly unknown-error message for users; logs nothing sensitive. */
export function friendlyError(prefix = "Something went wrong"): string {
  return `${prefix} Please try again in a moment.`;
}
