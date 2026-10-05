/**
 * GET /api/v1/n8n?endpoint=categories|templates[&category&complexity&triggerType&page&limit&q]
 * Primary: ahm7 /api/n8n. On failure: read the lib/n8n-cache-N.json part
 * files (written by scripts/snapshot-n8n.mjs via prebuild) and filter
 * in-memory. If still nothing: 502 N8N_UNAVAILABLE.
 *
 * Keyword search (q): the upstream API has no keyword parameter — it only
 * filters by category/complexity/triggerType. When q is present this route
 * searches the local snapshot full-text (name, description, tags,
 * category) instead of the primary, and the response is labelled
 * provider:"cache", fallbackUsed:true so the UI stays honest about it.
 */

import fs from "node:fs";
import path from "node:path";
import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, okJson, errJson, rateLimited } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 100;
const CACHE_FILE = path.join(process.cwd(), "lib", "n8n-cache.json");
const CACHE_PARTS = 4; // lib/n8n-cache-1.json … -4.json (split: deploy uploads cap single-arg size)

type Template = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  category?: unknown;
  complexity?: unknown;
  triggerType?: unknown;
  nodeCount?: unknown;
  downloadUrl?: unknown;
  githubPath?: unknown;
  tags?: unknown;
};

type Cache = { fetchedAt?: string; templates?: Template[] };

function countersEntries(counts: Map<string, number>): Array<[string, number]> {
  return Array.from(counts.entries());
}

function loadCache(): Template[] {
  const parts: Template[] = [];
  for (let i = 1; i <= CACHE_PARTS; i++) {
    try {
      const raw = fs.readFileSync(
        path.join(process.cwd(), "lib", `n8n-cache-${i}.json`),
        "utf8",
      );
      const parsed = JSON.parse(raw) as Cache;
      if (Array.isArray(parsed.templates)) parts.push(...parsed.templates);
    } catch {
      // part missing — fall through to legacy single-file attempt below
    }
  }
  if (parts.length > 0) return parts;
  try {
    const raw = fs.readFileSync(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Cache;
    return Array.isArray(parsed.templates) ? parsed.templates : [];
  } catch {
    // ENOENT or corrupt — snapshot hasn't run or failed; non-fatal here.
    return [];
  }
}

function matches(t: Template, filters: { category?: string; complexity?: string; triggerType?: string }): boolean {
  const ci = (v: unknown) => String(v ?? "").toLowerCase();
  if (filters.category && ci(t.category) !== filters.category) return false;
  if (filters.complexity && ci(t.complexity) !== filters.complexity) return false;
  if (filters.triggerType && ci(t.triggerType) !== filters.triggerType) return false;
  return true;
}

/**
 * Full-text keyword match over name, description, tags and category.
 * Every whitespace-separated token must appear somewhere (AND semantics).
 */
function matchesKeyword(t: Template, q: string): boolean {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;
  const tags = Array.isArray(t.tags) ? t.tags.map(String).join(" ") : "";
  const hay = `${t.name ?? ""} ${t.description ?? ""} ${tags} ${t.category ?? ""}`.toLowerCase();
  return tokens.every((tok) => hay.includes(tok));
}

function paginate(templates: Template[], page: number, limit: number) {
  const start = (page - 1) * limit;
  return {
    templates: templates.slice(start, start + limit),
    pagination: {
      page,
      limit,
      totalItems: templates.length,
      totalPages: Math.max(1, Math.ceil(templates.length / limit)),
    },
  };
}

export async function GET(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("n8n", RATE_LIMIT, req);
  if (!allowed) return rateLimited("n8n", retryAfterSec ?? 86_400);

  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint") ?? "templates";
  if (endpoint !== "categories" && endpoint !== "templates") {
    return errJson("BAD_ENDPOINT", "endpoint must be 'categories' or 'templates'.", 400);
  }

  const q = (searchParams.get("q") ?? "").trim().slice(0, 100);
  const filters = {
    category: searchParams.get("category")?.toLowerCase() ?? undefined,
    complexity: searchParams.get("complexity")?.toLowerCase() ?? undefined,
    triggerType: searchParams.get("triggerType")?.toLowerCase() ?? undefined,
  };
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") ?? "20") || 20),
  );
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  // Keyword search: upstream has no keyword parameter, so q is served from
  // the local snapshot (full-text over name/description/tags/category).
  // Labelled provider:"cache", fallbackUsed:true — the UI shows the
  // "snapshot" badge for these results.
  if (q && endpoint === "templates") {
    const templates = loadCache();
    if (!templates.length) {
      return errJson(
        "N8N_UNAVAILABLE",
        "Keyword search is unavailable right now — the local snapshot hasn't loaded. Try the category filters instead.",
        502,
        "ahm7",
        true,
      );
    }
    const hits = templates.filter(
      (t) => matches(t, filters) && matchesKeyword(t, q),
    );
    return okJson({ ...paginate(hits, page, limit), keyword: q }, "cache", true);
  }

  // Forward allow-listed params to upstream.
  const forward = new URLSearchParams();
  forward.set("endpoint", endpoint);
  for (const key of ["category", "complexity", "triggerType", "page", "limit"] as const) {
    const v = searchParams.get(key);
    if (v) forward.set(key, v.slice(0, 100));
  }

  // 1) Primary: ahm7.
  try {
    const res = await fetch(`${UPSTREAM}/api/n8n?${forward.toString()}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUTS.n8n),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const json = (await res.json()) as unknown;
    return okJson(json, "ahm7");
  } catch {
    // 2) Fallback: local snapshot.
    const templates = loadCache();
    if (templates.length) {
      if (endpoint === "categories") {
        const counts = new Map<string, number>();
        for (const t of templates) {
          const c = String(t.category ?? "Uncategorized");
          counts.set(c, (counts.get(c) ?? 0) + 1);
        }
        const categories = Array.from(countersEntries(counts))
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        return okJson({ categories }, "cache", true);
      }

      const filtered = templates.filter((t) => matches(t, filters));
      return okJson(paginate(filtered, page, limit), "cache", true);
    }
  }

  // 3) Nothing at all.
  return errJson(
    "N8N_UNAVAILABLE",
    "The workflow directory is offline right now. Browse workflows at n8n.io/workflows instead.",
    502,
    "ahm7",
    true,
  );
}
