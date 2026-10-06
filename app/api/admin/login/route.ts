import { NextResponse } from "next/server";
import { adminConfigured, makeAuthCookie } from "@/lib/admin-auth";

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin password is not configured on the server." },
      { status: 503 }
    );
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    // Small delay to slow brute force.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const c = makeAuthCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(c.name, c.value, c.opts as Record<string, unknown>);
  return res;
}
