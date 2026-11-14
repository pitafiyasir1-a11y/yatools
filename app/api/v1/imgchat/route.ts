/**
 * POST /api/v1/imgchat
 * Body: { image: data URL (png|jpeg|webp|gif), base64-decoded ≤ 5MB, userPrompt: 1–500 chars }
 * Primary: yatools POST /api/imgchat with { userPrompt, image } →
 *   { success:true, response:string }.
 * Fallback: freeapi.pro (same API shapes; verified live 2026-11-14 — returns a
 * real image description while ahm7 returns 502). 502 IMGCHAT_DOWN only when
 * both upstreams fail.
 * Privacy: the image is never written to disk and never logged; nothing leaves
 * the machine except the single upstream POST.
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { TIMEOUTS, okJson, errJson, rateLimited, fetchUpstream } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 10;
const MAX_BYTES = 5 * 1024 * 1024;
const DATA_URL_RE = /^data:image\/(png|jpeg|webp|gif);base64,/;

type ImgchatBody = { image?: unknown; userPrompt?: unknown };

export async function POST(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("imgchat", RATE_LIMIT, req);
  if (!allowed) return rateLimited("imgchat", retryAfterSec ?? 86_400);

  let body: ImgchatBody;
  try {
    body = (await req.json()) as ImgchatBody;
  } catch {
    return errJson("BAD_JSON", "The request body must be valid JSON.", 400);
  }

  const image = typeof body.image === "string" ? body.image : "";
  const userPrompt = typeof body.userPrompt === "string" ? body.userPrompt.trim() : "";

  if (!body.image || !body.userPrompt) {
    return errJson("MISSING_FIELDS", "Required fields: image, userPrompt.", 400);
  }
  if (!DATA_URL_RE.test(image)) {
    return errJson(
      "BAD_IMAGE",
      "image must be a data URL of type png, jpeg, webp or gif (base64).",
      400,
    );
  }
  const base64 = image.slice(image.indexOf(",") + 1);
  let byteLength: number;
  try {
    byteLength = Buffer.from(base64, "base64").byteLength;
  } catch {
    return errJson("BAD_IMAGE", "image could not be decoded as base64.", 400);
  }
  if (byteLength > MAX_BYTES) {
    return errJson("FILE_TOO_LARGE", "Image must be 5MB or smaller.", 400);
  }
  if (userPrompt.length < 1 || userPrompt.length > 500) {
    return errJson("BAD_FIELD", "userPrompt must be 1–500 characters.", 400);
  }

  try {
    const { res, fallbackUsed } = await fetchUpstream(`/api/imgchat`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ userPrompt, image }),
      timeoutMs: TIMEOUTS.imgchat,
    });
    const json = (await res.json()) as { success?: unknown; response?: unknown };
    if (json.success !== true || typeof json.response !== "string") {
      throw new Error("upstream imgchat failed");
    }
    return okJson({ response: json.response }, "yatools", fallbackUsed);
  } catch {
    // Both upstreams failed — honest failure.
    return errJson(
      "IMGCHAT_DOWN",
      "Image chat is temporarily unavailable. Please try again later.",
      502,
    );
  }
}
