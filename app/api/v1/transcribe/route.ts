/**
 * POST /api/v1/transcribe
 * Body (upload mode): { audio: <data URL>, filename?, mime?, language?, model?, translate?, timestamps? }
 * Body (YouTube mode): { youtube: "https://youtube.com/watch?v=..." | "https://youtu.be/...", translate? }
 * Upload mode ONLY for files (no direct download mode besides YouTube, which
 * the upstream fetches itself). Synchronous forward to yatools.
 *
 * Upstream docs (https://ahm7xmakki.com/transcribe): translate and timestamps
 * are the STRING "1". Models: turbo | accurate | english.
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
  youtube?: unknown;
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

/** Upstream expects the string "1"/"0" for flag params — normalize booleans. */
function asFlag(v: unknown): "1" | "0" | undefined {
  if (v === undefined || v === null) return undefined;
  if (v === "1" || v === 1 || v === true) return "1";
  if (v === "0" || v === 0 || v === false) return "0";
  if (typeof v === "string" && v.trim().toLowerCase() === "true") return "1";
  return undefined;
}

/** Only genuine YouTube watch/share URLs are accepted for YouTube mode. */
function asYouTubeUrl(v: unknown): string | null {
  if (typeof v !== "string") return null;
  let u: URL;
  try {
    u = new URL(v.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  const host = u.hostname.toLowerCase();
  const okHost =
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtu.be" ||
    host === "www.youtu.be";
  if (!okHost) return null;
  // The upstream fetches the video itself — we only validate the shape.
  return u.toString().slice(0, 500);
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

  const { audio, youtube, filename, mime, language, model, translate, timestamps } = body;

  const fwd: Record<string, unknown> = {};
  const optTranslate = asFlag(translate);
  if (optTranslate !== undefined) fwd.translate = optTranslate;

  const ytUrl = asYouTubeUrl(youtube);
  if (ytUrl) {
    // YouTube mode: the upstream fetches the video's audio itself.
    fwd.youtube = ytUrl;
  } else {
    // Upload mode.
    if (youtube !== undefined) {
      return errJson(
        "BAD_YOUTUBE_URL",
        "That doesn't look like a YouTube watch or share link.",
        400,
      );
    }
    if (typeof audio !== "string" || !audio.startsWith("data:audio/")) {
      return errJson(
        "MISSING_AUDIO",
        "Please provide an audio file as a data URL (audio/*), or a YouTube link.",
        400,
      );
    }
    // Defensive size check on the data URL itself (content-length may be absent).
    if (audio.length > MAX_BODY_BYTES + 128) {
      return errJson("FILE_TOO_LARGE", "That audio file is too large — please keep uploads under 25 MB.", 400);
    }
    fwd.audio = audio;
    const optFilename = asOptionalString(filename);
    const optMime = asOptionalString(mime);
    const optLanguage = asOptionalString(language);
    const optModel = asOptionalString(model);
    if (optFilename) fwd.filename = optFilename.slice(0, 255);
    if (optMime) fwd.mime = optMime.slice(0, 100);
    if (optLanguage) fwd.language = optLanguage.slice(0, 20);
    if (optModel) fwd.model = optModel.slice(0, 60);
    const optTimestamps = asFlag(timestamps);
    if (optTimestamps !== undefined) fwd.timestamps = optTimestamps;
  }

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
    "yatools",
  );
}
