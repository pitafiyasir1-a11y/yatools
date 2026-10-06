/**
 * GET /api/v1/voices
 * Lists available TTS voices. Primary: yatools /api/voices.
 * Cache layers: in-memory (1h TTL) -> persistent lib/voices-cache.json snapshot.
 * A stale voice list beats none, so the file snapshot is served on cold
 * starts when the primary is unreachable.
 */

import fs from "node:fs";
import path from "node:path";
import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, okJson, errJson, rateLimited } from "@/lib/proxy/upstream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = 120;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1h
const FILE_CACHE = path.join(process.cwd(), "lib", "voices-cache.json");

function readFileCache(): { at: number; data: unknown } | null {
  // Multi-part snapshot (lib/voices-cache-1.json + -2.json): the single
  // merged file exceeds deploy-upload arg limits, so it ships split.
  try {
    const p1 = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "lib", "voices-cache-1.json"), "utf8"),
    ) as { at?: unknown; data?: Record<string, unknown> };
    const p2 = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "lib", "voices-cache-2.json"), "utf8"),
    ) as { data?: Record<string, unknown> };
    if (typeof p1.at === "number" && p1.data && p2.data) {
      return { at: p1.at, data: { ...p1.data, ...p2.data } };
    }
  } catch {
    // parts missing — fall through to legacy single-file attempt
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE_CACHE, "utf8")) as {
      at?: unknown;
      data?: unknown;
    };
    if (typeof parsed.at === "number" && parsed.data) {
      return { at: parsed.at, data: parsed.data };
    }
    return null;
  } catch {
    return null;
  }
}

function writeFileCache(entry: { at: number; data: unknown }): void {
  try {
    const d = (entry.data ?? {}) as Record<string, unknown>;
    const part1 = { at: entry.at, data: { success: d.success, total: d.total, voices: d.voices } };
    const part2 = { data: { grouped: d.grouped } };
    const dir = process.cwd();
    fs.writeFileSync(path.join(dir, "lib", "voices-cache-1.json.tmp"), JSON.stringify(part1));
    fs.writeFileSync(path.join(dir, "lib", "voices-cache-2.json.tmp"), JSON.stringify(part2));
    fs.renameSync(path.join(dir, "lib", "voices-cache-1.json.tmp"), path.join(dir, "lib", "voices-cache-1.json"));
    fs.renameSync(path.join(dir, "lib", "voices-cache-2.json.tmp"), path.join(dir, "lib", "voices-cache-2.json"));
  } catch {
    // best-effort: a failed snapshot write must never break the request
  }
}

// Seed memory from the persistent snapshot so cold starts with a dead
// primary still serve the last known voice list.
let cache: { at: number; data: unknown } | null = readFileCache();

export async function GET(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("voices", RATE_LIMIT, req);
  if (!allowed) return rateLimited("voices", retryAfterSec ?? 86_400);

  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return okJson(cache.data, "cache");
  }

  try {
    const res = await fetch(`${UPSTREAM}/api/voices`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUTS.voices),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const json = (await res.json()) as unknown;
    cache = { at: now, data: json };
    writeFileCache(cache);
    return okJson(json, "yatools");
  } catch {
    // Serve a stale entry if we have one — a stale voice list beats none.
    const stale = cache ?? readFileCache();
    if (stale) {
      cache = stale;
      return okJson(stale.data, "cache", true);
    }
    return errJson(
      "VOICES_DOWN",
      "The voice list is unavailable right now. Please try again later.",
      502,
    );
  }
}
