/**
 * POST /api/v1/transcribe
 * Body: { audio: <data URL>, filename?, mime?, language?, model?, translate?, timestamps? }
 * Upload mode ONLY (no YouTube/download mode). Synchronous forward to ahm7.
 *
 * NOTE: Vercel hobby function limits rule out true background jobs, so this
 * is synchronous. TRANSCRIBE_TIMEOUT (55s) may be hit by long audio files;
 * clients should suggest a shorter clip when the timeout fires.
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, okJson, errJson, rateLimited } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 10;
const MAX_BODY_BYTES = 25 * 1024 * 1024; // 25MB total request body

type TranscribeBody = {
  audio?: unknown;
  filename?: unknown;
  mime?: unknown;
  language?: unknown;
  model?: unknown;
  translate?: unknown;
  timestamps?: unknown;
};

function asOptionalString(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export async function POST(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("transcribe", RATE_LIMIT, req);
  if (!allowed) return rateLimited("transcribe", retryAfterSec ?? 86_400);

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return errJson("FILE_TOO_LARGE", "That audio file is too large — please keep uploads under 25 MB.", 400);
  }

  let body: TranscribeBody;
  try {
    body = (await req.json()) as TranscribeBody;
  } catch {
    return errJson("BAD_JSON", "The request body must be valid JSON.", 400);
  }

  const { audio, filename, mime, language, model, translate, timestamps } = body;

  if (typeof audio !== "string" || !audio.startsWith("data:audio/")) {
    return errJson(
      "MISSING_AUDIO",
      "Please provide an audio file as a data URL (audio/*).",
      400,
    );
  }
  // Defensive size check on the data URL itself (content-length may be absent).
  if (audio.length > MAX_BODY_BYTES + 128) {
    return errJson("FILE_TOO_LARGE", "That audio file is too large — please keep uploads under 25 MB.", 400);
  }

  const fwd: Record<string, unknown> = { audio };
  const optFilename = asOptionalString(filename);
  const optMime = asOptionalString(mime);
  const optLanguage = asOptionalString(language);
  const optModel = asOptionalString(model);
  if (optFilename) fwd.filename = optFilename.slice(0, 255);
  if (optMime) fwd.mime = optMime.slice(0, 100);
  if (optLanguage) fwd.language = optLanguage.slice(0, 20);
  if (optModel) fwd.model = optModel.slice(0, 60);
  if (translate !== undefined) fwd.translate = Boolean(translate);
  if (timestamps !== undefined) fwd.timestamps = Boolean(timestamps);

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(`${UPSTREAM}/api/transcribe`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(fwd),
      signal: AbortSignal.timeout(TIMEOUTS.transcribe),
    });
  } catch (e) {
    const timedOut = e instanceof Error && /timeout|aborted/i.test(e.name + e.message);
    // Deliberately do not log the request body (audio content).
    return errJson(
      timedOut ? "TRANSCRIBE_TIMEOUT" : "TRANSCRIBE_DOWN",
      timedOut
        ? "The transcription took too long — please try a shorter audio clip."
        : "The transcription service is unreachable right now. Please try again later.",
      502,
    );
  }

  let json: {
    text?: unknown;
    language?: unknown;
    model?: unknown;
    srt?: unknown;
  };
  try {
    json = (await upstreamRes.json()) as typeof json;
  } catch {
    return errJson(
      "TRANSCRIBE_DOWN",
      "The transcription service returned an unexpected response. Please try again later.",
      502,
    );
  }

  if (!upstreamRes.ok || typeof json.text !== "string") {
    return errJson(
      "TRANSCRIBE_DOWN",
      "The transcription service couldn't process that file. Please try a different format.",
      502,
    );
  }

  return okJson(
    {
      text: json.text,
      language: typeof json.language === "string" ? json.language : undefined,
      model: typeof json.model === "string" ? json.model : undefined,
      srt: typeof json.srt === "string" ? json.srt : undefined,
    },
    "ahm7",
  );
}
