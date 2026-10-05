/**
 * GET /api/v1/wikipdf?query=
 * Wikipedia article → PDF bytes. Primary: ahm7 /api/wikipdf.
 * On failure: 502 JSON code WIKIPDF_DOWN — the CLIENT falls back to the
 * Wikipedia REST API client-side (browser print-to-PDF).
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, errJson, rateLimited, binaryHeaders } from "@/lib/proxy/upstream";

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

  try {
    const res = await fetch(
      `${UPSTREAM}/api/wikipdf?query=${encodeURIComponent(query)}`,
      {
        headers: { accept: "application/pdf, application/json" },
        signal: AbortSignal.timeout(TIMEOUTS.wikipdf),
      },
    );

    // Upstream returns 404 JSON {success:false,status:404,error} when the
    // article is missing — surface that as a friendly validation-style error.
    if (res.status === 404) {
      return errJson(
        "ARTICLE_NOT_FOUND",
        "We couldn't find that Wikipedia article. Check the title and try again.",
        400,
        "ahm7",
      );
    }
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const ct = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!ct.includes("pdf")) throw new Error("not a pdf");
    const bytes = await res.arrayBuffer();
    if (bytes.byteLength < 512 || !isPdf(bytes)) throw new Error("empty/invalid pdf");
    return new Response(bytes, {
      headers: binaryHeaders("ahm7", false, "application/pdf"),
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
