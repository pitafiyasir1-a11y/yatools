/**
 * /api/v1/hand — GET (query params) or POST (JSON body) passthrough of
 * text/font/color/size/paper/style/lang/rtl/page/format/brand/download
 * to yatools /api/hand → image bytes.
 *
 * Secondary path only: the primary handwriting renderer is client-side
 * canvas; this route exists as a backup when the client needs it.
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, errJson, rateLimited, binaryHeaders } from "@/lib/proxy/upstream";

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

  try {
    const res = await fetch(`${UPSTREAM}/api/hand?${params.toString()}`, {
      headers: { accept: "image/*" },
      signal: AbortSignal.timeout(TIMEOUTS.hand),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const ct = (res.headers.get("content-type") || "image/png").split(";")[0].trim().toLowerCase();
    if (!ct.startsWith("image/")) throw new Error("not an image");
    const bytes = await res.arrayBuffer();
    if (bytes.byteLength < 512) throw new Error("empty image");
    return new Response(bytes, { headers: binaryHeaders("yatools", false, ct) });
  } catch {
    return errJson(
      "HAND_DOWN",
      "The handwriting service is unavailable right now. Please try again later.",
      502,
    );
  }
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
