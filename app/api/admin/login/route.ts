import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { adminConfigured, makeAuthCookie } from "@/lib/admin-auth";
import { rateLimit, clientIp, rateLimitedResponse } from "@/lib/rate-limit";

function passwordsMatch(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf-8");
  const bb = Buffer.from(b, "utf-8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin password is not configured on the server." },
      { status: 503 }
    );
  }
  // Brute-force throttle: 8 attempts per 10 minutes per IP.
  const rl = rateLimit(`site-studio-login:${clientIp(req)}`, 8, 10 * 60 * 1000);
  if (!rl.ok) return rateLimitedResponse(rl.retryAfterSec);

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!password || !passwordsMatch(password, expected)) {
    // Small delay to slow brute force further.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const c = makeAuthCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(c.name, c.value, c.opts as Record<string, unknown>);
  return res;
}
