/**
 * GET /api/v1/websnap?url=[&info=1]
 * Screenshot a public URL. Primary: yatools /api/websnap.
 * Fallback chain: Microlink -> mShots -> thum.io (all third-party).
 * Binary route: PNG/JPEG bytes with X-Provider / X-Fallback-Used headers.
 *
 * With ?info=1 the route instead returns the upstream's documented
 * action=info metadata ({ contentType, sizeBytes }) as JSON — primary
 * only, since the fallback services expose no metadata endpoint.
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { assertSafeUrl, fetchUpstream } from "@/lib/proxy/ssrf";
import {
  UPSTREAM,
  TIMEOUTS,
  okJson,
  errJson,
  rateLimited,
  binaryHeaders,
} from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 20;

const MIN_IMAGE_BYTES = 1024;

function looksLikeImage(res: Response, bytes: ArrayBuffer): boolean {
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  return ct.startsWith("image/") && bytes.byteLength >= MIN_IMAGE_BYTES;
}

/** Fetch bytes via fetchUpstream; returns null on any failure. */
async function tryBytes(
  url: string,
  timeoutMs: number,
): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  try {
    const res = await fetchUpstream(url, {}, timeoutMs);
    if (!res.ok) return null;
    const bytes = await res.arrayBuffer();
    const ct = (res.headers.get("content-type") || "image/png").split(";")[0].trim();
    if (!ct.toLowerCase().startsWith("image/") || bytes.byteLength < MIN_IMAGE_BYTES) {
      return null;
    }
    return { bytes, contentType: ct };
  } catch {
    return null;
  }
}

async function viaMicrolink(encUrl: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  try {
    const meta = await fetchUpstream(
      `https://api.microlink.io/?url=${encUrl}&screenshot=true&meta=false`,
      { headers: { accept: "application/json" } },
      25_000,
    );
    if (!meta.ok) return null; // includes 429 — just skip this fallback
    const json = (await meta.json()) as {
      status?: string;
      data?: { screenshot?: { url?: string } };
    };
    const shotUrl = json?.data?.screenshot?.url;
    if (typeof shotUrl !== "string" || !shotUrl) return null;
    return await tryBytes(shotUrl, 25_000);
  } catch {
    return null;
  }
}

async function viaMShots(encUrl: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  // mShots generates lazily: it may return a tiny placeholder the first
  // time, then the real shot on a retry a few seconds later.
  for (let attempt = 0; attempt < 3; attempt++) {
    const got = await tryBytes(`https://s0.wp.com/mshots/v1/${encUrl}?w=1280`, 25_000);
    if (got && got.bytes.byteLength > 10_000) return got;
    if (attempt < 2) await new Promise((r) => setTimeout(r, 3000));
  }
  return null;
}

async function viaThumio(encUrl: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  return tryBytes(`https://image.thum.io/get/width/800/crop/1000/${encUrl}`, 25_000);
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url")?.trim();

  if (!rawUrl) {
    return errJson("MISSING_URL", "Please enter a website URL to screenshot.", 400, "yatools");
  }
  if (rawUrl.length > 2048) {
    return errJson("URL_TOO_LONG", "That URL is too long to process.", 400, "yatools");
  }

  const { allowed, retryAfterSec } = checkRateLimit("websnap", RATE_LIMIT, req);
  if (!allowed) return rateLimited("websnap", retryAfterSec ?? 86_400);

  let safeUrl: URL;
  try {
    safeUrl = await assertSafeUrl(rawUrl);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "That URL isn't allowed.";
    return errJson("UNSAFE_URL", msg, 400, "yatools");
  }

  // Metadata check: upstream action=info returns JSON without the binary —
  // lets callers validate a URL and inspect size before a full capture.
  if (searchParams.get("info") === "1") {
    try {
      const res = await fetchUpstream(
        `${UPSTREAM}/api/websnap?action=info&url=${encodeURIComponent(safeUrl.toString())}`,
        { headers: { accept: "application/json" } },
        TIMEOUTS.websnap,
      );
      const json = (await res.json()) as {
        ok?: unknown;
        contentType?: unknown;
        sizeBytes?: unknown;
      };
      if (!res.ok || json.ok !== true) throw new Error("info failed");
      return okJson(
        {
          url: safeUrl.toString(),
          contentType:
            typeof json.contentType === "string" ? json.contentType : "image/png",
          sizeBytes:
            typeof json.sizeBytes === "number" ? json.sizeBytes : null,
        },
        "yatools",
      );
    } catch {
      return errJson(
        "INFO_FAILED",
        "Couldn't check that URL right now — try the capture anyway, or try again later.",
        502,
        "yatools",
      );
    }
  }

  // 1) Primary: yatools screenshot.
  try {
    const res = await fetchUpstream(
      `${UPSTREAM}/api/websnap?action=screenshot&url=${encodeURIComponent(safeUrl.toString())}`,
      {},
      TIMEOUTS.websnap,
    );
    if (res.ok) {
      const bytes = await res.arrayBuffer();
      if (looksLikeImage(res, bytes)) {
        // Pass through the upstream content type (it may serve JPEG, not PNG).
        const ct = (res.headers.get("content-type") || "image/png").split(";")[0].trim();
        return new Response(bytes, {
          headers: binaryHeaders("yatools", false, ct),
        });
      }
    }
  } catch {
    // fall through to fallbacks
  }

  // 2) Fallback chain (third-party services — user URL is sent to them).
  const encUrl = encodeURIComponent(safeUrl.toString());
  const fallbacks: Array<[string, (enc: string) => Promise<{ bytes: ArrayBuffer; contentType: string } | null>]> = [
    ["microlink", viaMicrolink],
    ["mshots", viaMShots],
    ["thumio", viaThumio],
  ];

  for (const [provider, fn] of fallbacks) {
    const got = await fn(encUrl);
    if (got) {
      return new Response(got.bytes, {
        headers: binaryHeaders(provider, true, got.contentType),
      });
    }
  }

  return errJson(
    "SCREENSHOT_FAILED",
    "We couldn't capture that page right now — it may be blocking screenshots. Please try again later.",
    502,
    "yatools",
    true,
  );
}
