/**
 * POST /api/v1/tts
 * Body: { voiceIndex: number, text: string (1–1950 chars), pitch?: -100..100, rate?: -100..100 }
 * Primary: ahm7 /api/tts → audio/mpeg bytes.
 *
 * NOTE: there is no server-side TTS fallback. On upstream failure this route
 * returns 502 JSON and the CLIENT implements the browser speechSynthesis
 * fallback.
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, errJson, rateLimited, binaryHeaders } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 30;
const MAX_TEXT = 1950;

type TtsBody = {
  voiceIndex?: unknown;
  text?: unknown;
  pitch?: unknown;
  rate?: unknown;
};

function asInt(v: unknown, min: number, max: number): number | undefined {
  if (typeof v !== "number" || !Number.isInteger(v)) return undefined;
  if (v < min || v > max) return undefined;
  return v;
}

export async function POST(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("tts", RATE_LIMIT, req);
  if (!allowed) return rateLimited("tts", retryAfterSec ?? 86_400);

  let body: TtsBody;
  try {
    body = (await req.json()) as TtsBody;
  } catch {
    return errJson("BAD_JSON", "The request body must be valid JSON.", 400);
  }

  const voiceIndex = asInt(body.voiceIndex, 0, 100_000);
  const text = typeof body.text === "string" ? body.text : "";
  const pitch = body.pitch === undefined ? undefined : asInt(body.pitch, -100, 100);
  const rate = body.rate === undefined ? undefined : asInt(body.rate, -100, 100);

  if (voiceIndex === undefined) {
    return errJson("BAD_VOICE", "Please choose a valid voice.", 400);
  }
  if (text.length < 1 || text.length > MAX_TEXT) {
    return errJson(
      "BAD_TEXT",
      `Please enter between 1 and ${MAX_TEXT} characters of text.`,
      400,
    );
  }
  if (body.pitch !== undefined && pitch === undefined) {
    return errJson("BAD_PITCH", "Pitch must be a whole number between -100 and 100.", 400);
  }
  if (body.rate !== undefined && rate === undefined) {
    return errJson("BAD_RATE", "Rate must be a whole number between -100 and 100.", 400);
  }

  // Do not log the text content (it may be private user writing).
  try {
    const res = await fetch(`${UPSTREAM}/api/tts`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({ voiceIndex, text, pitch, rate }),
      signal: AbortSignal.timeout(TIMEOUTS.tts),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const bytes = await res.arrayBuffer();
    if (bytes.byteLength < 512) throw new Error("empty audio");
    return new Response(bytes, {
      headers: binaryHeaders("ahm7", false, "audio/mpeg"),
    });
  } catch {
    return errJson(
      "TTS_DOWN",
      "The voice service is unreachable right now — the page will offer your browser's built-in voice instead.",
      502,
    );
  }
}
