/**
 * POST /api/v1/tti
 * Body: { prompt: string (1–500 chars), ratio?: one of the supported ratios }
 * Primary: yatools POST /api/tti → { ok:true, data:{ imageUrl }, provider:"yatools" }.
 * Fallback: Pollinations (free, no key) → { ok:true, data:{ imageUrl }, provider:"pollinations", fallbackUsed:true }.
 * The fallback imageUrl is directly usable as an <img> src.
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, okJson, errJson, rateLimited } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 10;

const RATIOS = [
  "1:1",
  "16:9",
  "9:16",
  "4:3",
  "3:4",
  "2:1",
  "1:2",
  "3:2",
  "2:3",
  "4:5",
  "5:4",
] as const;

type TtiBody = { prompt?: unknown; ratio?: unknown };

export async function POST(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("tti", RATE_LIMIT, req);
  if (!allowed) return rateLimited("tti", retryAfterSec ?? 86_400);

  let body: TtiBody;
  try {
    body = (await req.json()) as TtiBody;
  } catch {
    return errJson("BAD_JSON", "The request body must be valid JSON.", 400);
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const ratio = typeof body.ratio === "string" ? body.ratio : "1:1";

  if (prompt.length < 1 || prompt.length > 500) {
    return errJson("BAD_PROMPT", "Please enter a prompt between 1 and 500 characters.", 400);
  }
  if (!(RATIOS as readonly string[]).includes(ratio)) {
    return errJson("BAD_RATIO", `Ratio must be one of: ${RATIOS.join(", ")}.`, 400);
  }

  // 1) Primary: yatools (PixelSter). Shape: { success, imageUrl, code, prompt, ratio, model }.
  try {
    const res = await fetch(`${UPSTREAM}/api/tti`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ prompt, ratio }),
      signal: AbortSignal.timeout(TIMEOUTS.tti),
    });
    const json = (await res.json()) as { success?: unknown; imageUrl?: unknown };
    if (!res.ok || json.success !== true || typeof json.imageUrl !== "string") {
      throw new Error("upstream tti failed");
    }
    return okJson({ imageUrl: json.imageUrl }, "yatools");
  } catch {
    // 2) Fallback: Pollinations.ai (free, no key). URL is directly renderable.
    const seed = Math.floor(Math.random() * 1_000_000);
    const pollinationsUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
      `?model=flux&nologo=true&seed=${seed}`;
    return okJson({ imageUrl: pollinationsUrl }, "pollinations", true);
  }
}
