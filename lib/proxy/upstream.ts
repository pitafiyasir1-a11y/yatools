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
