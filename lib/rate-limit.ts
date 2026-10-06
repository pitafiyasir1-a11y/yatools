/* In-memory sliding-window rate limiter for the admin API.
   NOTE: on Vercel serverless each function instance keeps its own counters,
   so this blunts brute force per instance rather than eliminating it globally.
   Combined with the strong password, hidden route, and noindex, it is the
   right cheap layer for a single-owner admin. */

const buckets = new Map<string, number[]>();
const MAX_BUCKETS = 5000;

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    const oldest = hits[0] ?? now;
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > MAX_BUCKETS) {
    // Bound memory: drop the oldest bucket.
    const first = buckets.keys().next();
    if (!first.done) buckets.delete(first.value);
  }
  return { ok: true, retryAfterSec: 0 };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function rateLimitedResponse(retryAfterSec: number) {
  return new Response(JSON.stringify({ error: "Too many attempts. Try again later." }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfterSec),
    },
  });
}
