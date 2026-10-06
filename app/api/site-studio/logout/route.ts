import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/admin-auth";

export async function POST() {
  const c = clearAuthCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(c.name, "", c.opts as Record<string, unknown>);
  return res;
}
