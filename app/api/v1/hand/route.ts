/**
 * /api/v1/hand — GET (query params) or POST (JSON body) passthrough of
 * text/font/color/size/paper/style/lang/rtl/page/format/brand/download
 * to yatools /api/hand → image bytes.
 *
 * Primary: ahm7xmakki.com. Fallback: freeapi.pro (same API shapes; verified
 * live 2026-11-15 — returns a real 1240x1754 PNG while ahm7 returns 502).
 * A non-image or too-small response from one base falls through to the next
 * instead of short-circuiting the cascade.
 *
 * Secondary path only: the primary handwriting renderer is client-side
 * canvas; this route exists as a backup when the client needs it.
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import {
  UPSTREAM,
  FALLBACK_UPSTREAM,
  TIMEOUTS,
  errJson,
  rateLimited,
  binaryHeaders,
} from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 30;
const MAX_TEXT = 20_000;

const ALLOWED_PARAMS = [
  "text",
  "font",
  "color",
  "size",
  "paper",
  "style",
  "lang",
  "rtl",
  "page",
  "format",
  "brand",
  "download",
] as const;

/** Sanitise incoming params: allow-listed keys, string values, length caps. */
function pickParams(source: URLSearchParams | Record<string, unknown>): URLSearchParams {
  const out = new URLSearchParams();
  for (const key of ALLOWED_PARAMS) {
    let raw: unknown;
    if (source instanceof URLSearchParams) {
      const v = source.get(key);
      if (v === null) continue;
      raw = v;
    } else {
      raw = source[key];
    }
    if (typeof raw !== "string") continue;
    const cap = key === "text" ? MAX_TEXT : 100;
    const v = raw.slice(0, cap);
    if (v.length) out.set(key, v);
  }
  return out;
}

async function proxy(params: URLSearchParams): Promise<Response> {
  const text = params.get("text") ?? "";
  if (!text.trim()) {
    return errJson("MISSING_TEXT", "Please enter some text to render.", 400);
  }

  // FIX 2026-11-15: ahm7 /api/hand is down (502 HAND_DOWN, confirmed twice
  // by the daily health check) and this route used to try ahm7 only. Now it
  // loops ahm7 → freeapi.pro with a browser UA (Cloudflare 403s bare script
  // UAs on freeapi.pro) and validates each attempt is a real image before
  // accepting it, so a bad response falls through instead of ending the
  // cascade. Verified live 2026-11-15: freeapi.pro returns a real PNG.
  for (const base of [UPSTREAM, FALLBACK_UPSTREAM]) {
    try {
      const res = await fetch(`${base}/api/hand?${params.toString()}`, {
        headers: {
          accept: "image/*",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(TIMEOUTS.hand),
      });
      if (!res.ok) continue;
      const ct = (res.headers.get("content-type") || "image/png").split(";")[0].trim().toLowerCase();
      if (!ct.startsWith("image/")) continue;
      const bytes = await res.arrayBuffer();
      if (bytes.byteLength < 512) continue;
      return new Response(bytes, {
        headers: binaryHeaders("yatools", base === FALLBACK_UPSTREAM, ct),
      });
    } catch {
      // Try the next base.
      continue;
    }
  }
  return errJson(
    "HAND_DOWN",
    "The handwriting service is unavailable right now. Please try again later.",
    502,
  );
}

export async function GET(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("hand", RATE_LIMIT, req);
  if (!allowed) return rateLimited("hand", retryAfterSec ?? 86_400);
  return proxy(pickParams(new URL(req.url).searchParams));
}

export async function POST(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("hand", RATE_LIMIT, req);
  if (!allowed) return rateLimited("hand", retryAfterSec ?? 86_400);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return errJson("BAD_JSON", "The request body must be valid JSON.", 400);
  }
  return proxy(pickParams(body));
}
