/**
 * GET /api/v1/msearch?q=
 * Movie/TV search. Primary: ahm7 /api/msearch?q=, adapted defensively to
 *   { results: [{ title, type, year, rating, image, url }] }.
 * Fallback: TVMaze search/shows (TV-only) with an in-memory ~1req/2s throttle.
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, okJson, errJson, rateLimited } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 50;

type Result = {
  title: string;
  type: string | null;
  year: number | null;
  rating: number | null;
  image: string | null;
  url: string | null;
  imdbUrl: string | null;
  watchUrl: string | null;
  cast: string | null;
};

type MsearchItem = {
  title?: unknown;
  type?: unknown;
  year?: unknown;
  poster?: unknown;
  imdbUrl?: unknown;
  watchUrl?: unknown;
  cast?: unknown;
};

/**
 * Defensive best-effort mapping of the ahm7 msearch payload.
 * Observed live shape: { success, query, total_results, raw_count,
 * filtered_nm, results: [{ id, title, type, year, yearEnd, rank, cast,
 * poster, posterWidth, posterHeight, watchUrl, imdbUrl }] }.
 * If upstream ever changes shape, this degrades gracefully instead of 500s.
 */
function adaptMsearch(payload: unknown): Result[] {
  if (typeof payload !== "object" || payload === null) return [];
  const results = (payload as { results?: unknown }).results;
  if (!Array.isArray(results)) return [];
  return results
    .map((r): Result => {
      const item = r as MsearchItem;
      const title = typeof item.title === "string" ? item.title : "Untitled";
      // Keep IMDb and watch URLs separate so the UI can offer both buttons.
      const imdbUrl = typeof item.imdbUrl === "string" ? item.imdbUrl : null;
      const watchUrl = typeof item.watchUrl === "string" ? item.watchUrl : null;
      return {
        title,
        type: typeof item.type === "string" ? item.type : null,
        year: typeof item.year === "number" ? item.year : null,
        rating: null, // upstream exposes no rating for movies
        image: typeof item.poster === "string" ? item.poster : null,
        url: imdbUrl ?? watchUrl,
        imdbUrl,
        watchUrl,
        cast: typeof item.cast === "string" && item.cast.trim() ? item.cast.trim() : null,
      };
    })
    .filter((r) => r.title !== "Untitled" || r.url !== null);
}

// In-memory TVMaze throttle: max ~1 request per 2 seconds.
let lastTvmazeAt = 0;
const TVMAZE_MIN_GAP_MS = 2000;

type TvmazeHit = {
  show?: {
    name?: unknown;
    type?: unknown;
    premiered?: unknown;
    rating?: { average?: unknown };
    image?: { medium?: unknown; original?: unknown };
    url?: unknown;
  };
};

function adaptTvmaze(payload: unknown): Result[] {
  if (!Array.isArray(payload)) return [];
  return (payload as TvmazeHit[]).map((hit): Result => {
    const s = hit.show ?? {};
    const premiered = typeof s.premiered === "string" ? s.premiered : null;
    const rating =
      s.rating && typeof s.rating.average === "number" ? s.rating.average : null;
    const image =
      s.image && typeof s.image.medium === "string"
        ? s.image.medium
        : s.image && typeof s.image.original === "string"
          ? s.image.original
          : null;
    return {
      title: typeof s.name === "string" ? s.name : "Untitled",
      type: typeof s.type === "string" ? s.type : null,
      year: premiered ? Number(premiered.slice(0, 4)) || null : null,
      rating,
      image,
      url: typeof s.url === "string" ? s.url : null,
      imdbUrl: null, // TVMaze fallback carries no IMDb/watch links
      watchUrl: null,
      cast: null, // TVMaze fallback carries no cast list
    };
  });
}

async function viaTvmaze(q: string): Promise<Result[] | null> {
  const now = Date.now();
  const wait = TVMAZE_MIN_GAP_MS - (now - lastTvmazeAt);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastTvmazeAt = Date.now();

  try {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUTS.msearch),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    const results = adaptTvmaze(json);
    return results.length ? results : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("msearch", RATE_LIMIT, req);
  if (!allowed) return rateLimited("msearch", retryAfterSec ?? 86_400);

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    return errJson("MISSING_QUERY", "Please enter a movie or show title to search.", 400);
  }
  if (q.length > 100) {
    return errJson("QUERY_TOO_LONG", "Please keep your search under 100 characters.", 400);
  }

  // 1) Primary: ahm7.
  try {
    const res = await fetch(`${UPSTREAM}/api/msearch?q=${encodeURIComponent(q)}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUTS.msearch),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const json = (await res.json()) as unknown;
    const results = adaptMsearch(json);
    return okJson({ results }, "ahm7");
  } catch {
    // 2) Fallback: TVMaze (TV shows only).
    const tv = await viaTvmaze(q);
    if (tv) {
      return okJson({ results: tv, tvOnly: true }, "tvmaze", true);
    }
  }

  return errJson(
    "MSEARCH_DOWN",
    "Search is unavailable right now. Please try again in a moment.",
    502,
    "ahm7",
    true,
  );
}
