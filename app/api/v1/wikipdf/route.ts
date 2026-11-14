/**
 * GET /api/v1/wikipdf?query=
 * Wikipedia article → PDF bytes. Primary: yatools /api/wikipdf.
 * On failure: 502 JSON code WIKIPDF_DOWN — the CLIENT falls back to the
 * Wikipedia REST API client-side (browser print-to-PDF).
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, FALLBACK_UPSTREAM, TIMEOUTS, errJson, rateLimited, binaryHeaders } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 20;

export async function GET(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("wikipdf", RATE_LIMIT, req);
  if (!allowed) return rateLimited("wikipdf", retryAfterSec ?? 86_400);

  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("query") ?? "").trim();

  if (!query) {
    return errJson("MISSING_QUERY", "Please enter a Wikipedia article title.", 400);
  }
  if (query.length > 200) {
    return errJson("QUERY_TOO_LONG", "Please keep the article title under 200 characters.", 400);
  }

  // Primary upstream first, freeapi.pro fallback (same API shapes; verified
  // live 2026-11-14 — returns a real PDF while ahm7 returns 502). A 404 from
  // either base means the article itself is missing, so it is surfaced
  // immediately instead of trying the other base.
  try {
    let res: Response | null = null;
    let fallbackUsed = false;
    for (const base of [UPSTREAM, FALLBACK_UPSTREAM]) {
      const attempt = await fetch(
        `${base}/api/wikipdf?query=${encodeURIComponent(query)}`,
        {
          headers: { accept: "application/pdf, application/json" },
          signal: AbortSignal.timeout(TIMEOUTS.wikipdf),
        },
      );
      // Upstream returns 404 JSON {success:false,status:404,error} when the
      // article is missing — surface that as a friendly validation-style error.
      if (attempt.status === 404) {
        return errJson(
          "ARTICLE_NOT_FOUND",
          "We couldn't find that Wikipedia article. Check the title and try again.",
          400,
          "yatools",
        );
      }
      if (attempt.ok) {
        res = attempt;
        fallbackUsed = base === FALLBACK_UPSTREAM;
        break;
      }
    }
    if (!res) throw new Error("both upstreams failed");

    const ct = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!ct.includes("pdf")) throw new Error("not a pdf");
    const bytes = await res.arrayBuffer();
    if (bytes.byteLength < 512 || !isPdf(bytes)) throw new Error("empty/invalid pdf");
    return new Response(bytes, {
      headers: binaryHeaders("yatools", fallbackUsed, "application/pdf"),
    });
  } catch {
    return errJson(
      "WIKIPDF_DOWN",
      "The PDF service is unavailable right now — the page will offer an on-device alternative instead.",
      502,
    );
  }
}

/** Check the %PDF magic header. */
function isPdf(bytes: ArrayBuffer): boolean {
  const head = new Uint8Array(bytes.slice(0, 5));
  return head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46;
}
