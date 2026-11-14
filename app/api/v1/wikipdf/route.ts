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
          headers: {
            accept: "application/pdf, application/json",
            // FIX 2026-11-14: this fetch sent NO User-Agent, so Cloudflare
            // 403'd the freeapi.pro attempt (bare script UA gets error 1010
            // — see lib/proxy/upstream.ts). Live check 2026-11-14 20:59 PKT
            // still returned WIKIPDF_DOWN after commit 5f7ba94 for this
            // reason. Same browser UA fetchUpstream() already sends.
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
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
        // FIX 2026-11-14: ahm7 answers GET /api/wikipdf with HTTP 200 + an
        // HTML page (not a PDF, not an error) — accepting any 200 broke the
        // whole cascade: the loop stopped here, the content-type check below
        // threw, and freeapi.pro + Wikipedia REST never ran. Only accept a
        // response that actually claims to be a PDF.
        const ct = (attempt.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
        if (ct.includes("pdf")) {
          res = attempt;
          fallbackUsed = base === FALLBACK_UPSTREAM;
          break;
        }
        // Not a PDF — fall through to the next base.
        continue;
      }
    }
    // Last resort: Wikipedia's own PDF renderer (official REST API, no key).
    // Verified live 2026-11-14 — returns the same PDF freeapi.pro serves.
    // Needed because both upstreams fail from Vercel's egress IPs even
    // though they answer fine elsewhere.
    if (!res) {
      try {
        const title = encodeURIComponent(query.replace(/ /g, "_"));
        const wiki = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/pdf/${title}`,
          {
            headers: {
              accept: "application/pdf",
              // Wikimedia's UA policy: identify the app + contact. A missing
              // or generic UA gets rate-limited/blocked from datacenter IPs
              // (found live 2026-11-14 — the no-UA fetch failed on Vercel
              // while a browser-UA curl worked).
              "user-agent":
                "YATools/1.0 (https://yatools-tan.vercel.app; contact yasirabbas@relianceengineering.com.pk)",
            },
            signal: AbortSignal.timeout(TIMEOUTS.wikipdf),
          },
        );
        if (wiki.status === 404) {
          return errJson(
            "ARTICLE_NOT_FOUND",
            "We couldn't find that Wikipedia article. Check the title and try again.",
            400,
            "yatools",
          );
        }
        if (wiki.ok) {
          res = wiki;
          fallbackUsed = true;
        }
      } catch {
        // fall through to the 502 below
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
