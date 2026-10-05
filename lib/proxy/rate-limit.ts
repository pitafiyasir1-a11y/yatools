/**
 * In-memory per-IP, per-tool daily rate limiter.
 *
 * NOTE: memory is per serverless instance — this is a coarse, best-effort
 * guard (it stops casual abuse, not a determined flood). Vercel Hobby
 * instances are short-lived, so a persistent store (Upstash etc.) would be
 * needed for strict enforcement; that is intentionally out of scope for v1.
 */

type Counter = { date: string; count: number };

const counters = new Map<string, Counter>();

function todayKey(): string {
  // UTC calendar day; close enough for a daily cap.
  return new Date().toISOString().slice(0, 10);
}

/** Best-effort client IP: trusts x-forwarded-for (set by Vercel/ proxies). */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export function checkRateLimit(
  tool: string,
  limit: number,
  req: Request,
): { allowed: boolean; retryAfterSec?: number } {
  const key = `${tool}:${getClientIp(req)}:${todayKey()}`;
  const entry = counters.get(key);

  // Lazy cleanup: drop stale entries occasionally to bound memory.
  if (counters.size > 50_000 && Math.random() < 0.01) {
    const today = todayKey();
    for (const k of Array.from(counters.keys())) {
      if (counters.get(k)?.date !== today) counters.delete(k);
    }
  }

  const count = entry && entry.date === todayKey() ? entry.count : 0;
  if (count >= limit) {
    const now = new Date();
    const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    return { allowed: false, retryAfterSec: Math.ceil((tomorrow.getTime() - now.getTime()) / 1000) };
  }

  counters.set(key, { date: todayKey(), count: count + 1 });
  return { allowed: true };
}
