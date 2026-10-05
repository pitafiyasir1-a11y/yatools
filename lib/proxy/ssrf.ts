/**
 * SSRF protection for user-supplied URLs (websnap etc.).
 *
 * Every outbound fetch to a user-supplied URL goes through
 * `assertSafeUrl` (DNS-checked) and `fetchUpstream` (manual redirect
 * following that re-validates every hop), so a redirect can't smuggle the
 * request into private network space.
 */

import dns from "node:dns";

const BLOCKED_V4: Array<[number, number]> = [
  [ip4("10.0.0.0"), 8], // 10/8
  [ip4("172.16.0.0"), 12], // 172.16/12
  [ip4("192.168.0.0"), 16], // 192.168/16
  [ip4("127.0.0.0"), 8], // loopback
  [ip4("169.254.0.0"), 16], // link-local (cloud metadata)
  [ip4("0.0.0.0"), 8], // "this network"
];

function ip4(addr: string): number {
  const parts = addr.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function isV4Blocked(ip: string): boolean {
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return false;
  const n = ip4(ip);
  return BLOCKED_V4.some(([base, bits]) => {
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (n & mask) === (base & mask);
  });
}

function isV6Blocked(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1") return true; // loopback
  if (lower.startsWith("fe80:")) return true; // link-local fe80::/10 (close enough)
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // fc00::/7 unique-local
  if (lower === "::" || lower === "::ffff:0.0.0.0") return true;
  // IPv4-mapped IPv6 — check the embedded v4 address too.
  const mapped = lower.match(/::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mapped && isV4Blocked(mapped[1])) return true;
  return false;
}

function isIpBlocked(ip: string): boolean {
  return isV4Blocked(ip) || isV6Blocked(ip);
}

/**
 * Validate that `raw` is a safe public http(s) URL.
 * Throws an Error with a friendly message when it isn't.
 */
export async function assertSafeUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http:// and https:// URLs are allowed.");
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost")) {
    throw new Error("Local URLs are not allowed.");
  }

  let records: Array<{ address: string }>;
  try {
    records = await dns.promises.lookup(host, { all: true });
  } catch {
    throw new Error("Couldn't resolve that domain.");
  }
  if (!records.length) {
    throw new Error("Couldn't resolve that domain.");
  }
  for (const r of records) {
    if (isIpBlocked(r.address)) {
      throw new Error("That URL points to a private or local address, which isn't allowed.");
    }
  }
  return url;
}

/**
 * Fetch a URL with manual redirect following.
 * Every redirect target is re-validated with `assertSafeUrl` so a
 * malicious redirect can't land on an internal address.
 * Throws on timeout / network error / too many redirects.
 */
export async function fetchUpstream(
  url: URL | string,
  init: RequestInit = {},
  timeoutMs = 25_000,
  maxRedirects = 5,
): Promise<Response> {
  let current = url instanceof URL ? url : await assertSafeUrl(url);

  for (let hop = 0; hop <= maxRedirects; hop++) {
    const res = await fetch(current.toString(), {
      ...init,
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });

    const status = res.status;
    if (status >= 300 && status < 400) {
      const loc = res.headers.get("location");
      // Drain so the connection can be reused.
      try {
        await res.arrayBuffer();
      } catch {
        /* ignore */
      }
      if (!loc) throw new Error("Redirect with no location.");
      if (hop === maxRedirects) throw new Error("Too many redirects.");
      // Relative redirects resolve against the current URL.
      const next = new URL(loc, current.toString());
      current = await assertSafeUrl(next.toString());
      continue;
    }
    return res;
  }
  throw new Error("Too many redirects.");
}
