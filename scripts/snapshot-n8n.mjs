/**
 * Pre-build snapshot of n8n templates for the /api/v1/n8n fallback path.
 *
 * Fetches pages 1–3 of `?endpoint=templates&limit=100` from ahm7 and writes
 * lib/n8n-cache-{1..4}.json as { fetchedAt, templates: [] } parts.
 * (Split into parts: single merged file exceeds deploy-upload arg limits.)
 *
 * Fully non-fatal: every failure is caught and the script always exits 0
 * (package.json wires it as `prebuild` with `|| true` too).
 */

import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const UPSTREAM = "https://ahm7xmakki.com";
const PAGES = [1, 2, 3];
const LIMIT = 100;
const PARTS = 4;
const LIB = join(dirname(fileURLToPath(import.meta.url)), "..", "lib");

async function main() {
  const templates = [];

  for (const page of PAGES) {
    try {
      const res = await fetch(
        `${UPSTREAM}/api/n8n?endpoint=templates&limit=${LIMIT}&page=${page}`,
        { headers: { accept: "application/json" }, signal: AbortSignal.timeout(20_000) },
      );
      if (!res.ok) break;
      const json = await res.json();
      const batch = Array.isArray(json?.templates) ? json.templates : [];
      templates.push(...batch);
      if (batch.length < LIMIT) break; // no more pages
    } catch {
      break; // upstream down — keep whatever we already have
    }
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
}

try {
  await main();
} catch {
  // Never fail the build because the snapshot failed.
}
process.exit(0);
