/**
 * Pre-build snapshot of n8n templates for the /api/v1/n8n fallback path.
 *
 * Fetches pages 1–3 of `?endpoint=templates&limit=100` and writes
 * lib/n8n-cache-{1..4}.json as { fetchedAt, templates: [] } parts.
 * (Split into parts: single merged file exceeds deploy-upload arg limits.)
 *
 * Upstream order (fixed 2026-11-14): freeapi.pro FIRST, ahm7 second.
 * ahm7's API has been down since the 2026-11-14 audit (POSTs 405, n8n 502),
 * so fetching only from ahm7 wrote EMPTY cache files on every Vercel build —
 * which is exactly why the static-import fix (commit 5f7ba94) still returned
 * N8N_UNAVAILABLE live: the imports worked, but the data was 0 templates.
 * freeapi.pro n8n is verified live (2026-11-14, 10,757 templates total).
 *
 * NEVER overwrite a non-empty cache with an empty fetch: if both upstreams
 * fail, the existing files are left untouched so the last good snapshot
 * keeps serving. Fully non-fatal: every failure is caught and the script
 * always exits 0 (package.json wires it as `prebuild` with `|| true` too).
 */

import { writeFileSync, mkdirSync, rmSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const UPSTREAMS = ["https://freeapi.pro", "https://ahm7xmakki.com"];
const PAGES = [1, 2, 3];
const LIMIT = 100;
const PARTS = 4;
const LIB = join(dirname(fileURLToPath(import.meta.url)), "..", "lib");

async function fetchFrom(base) {
  const templates = [];
  for (const page of PAGES) {
    try {
      const res = await fetch(
        `${base}/api/n8n?endpoint=templates&limit=${LIMIT}&page=${page}`,
        {
          headers: {
            accept: "application/json",
            // Cloudflare fronts freeapi.pro: a bare script UA gets 403.
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          signal: AbortSignal.timeout(20_000),
        },
      );
      if (!res.ok) break;
      const json = await res.json();
      const batch = Array.isArray(json?.templates) ? json.templates : [];
      templates.push(...batch);
      if (batch.length < LIMIT) break; // no more pages
    } catch {
      break; // upstream down — try the next base
    }
  }
  return templates;
}

function existingCount() {
  let n = 0;
  for (let i = 1; i <= PARTS; i++) {
    try {
      const part = JSON.parse(readFileSync(join(LIB, `n8n-cache-${i}.json`), "utf8"));
      if (Array.isArray(part?.templates)) n += part.templates.length;
    } catch {
      /* missing/unreadable part counts as 0 */
    }
  }
  return n;
}

async function main() {
  let templates = [];
  for (const base of UPSTREAMS) {
    templates = await fetchFrom(base);
    if (templates.length) break;
  }

  // Guard: never clobber a good cache with an empty fetch (this is what
  // emptied the snapshot on every Vercel build while ahm7 was down).
  if (!templates.length) {
    console.log(
      `snapshot-n8n: both upstreams failed; keeping existing cache (${existingCount()} templates).`,
    );
    return;
  }

  const fetchedAt = new Date().toISOString();
  mkdirSync(LIB, { recursive: true });
  const per = Math.max(1, Math.ceil(templates.length / PARTS));
  for (let i = 0; i < PARTS; i++) {
    const part = { fetchedAt, templates: templates.slice(i * per, (i + 1) * per) };
    writeFileSync(join(LIB, `n8n-cache-${i + 1}.json`), JSON.stringify(part), "utf8");
  }
  // Remove any legacy single-file snapshot so the route never reads stale data.
  try { rmSync(join(LIB, "n8n-cache.json"), { force: true }); } catch { /* ignore */ }
  console.log(`snapshot-n8n: wrote ${templates.length} templates in ${PARTS} parts.`);
}

try {
  await main();
} catch {
  // Never fail the build because the snapshot failed.
}
process.exit(0);
