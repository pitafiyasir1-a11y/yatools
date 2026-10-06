import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

/* Simple single-owner auth for /admin. Stateless: the cookie holds
   sha256("yatools-admin-v1:" + ADMIN_PASSWORD), verifiable without a DB.
   Server-only. */

const COOKIE_NAME = "yatools_admin_auth";

function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`yatools-admin-v1:${pw}`).digest("hex");
}

export function adminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const actual = (await cookies()).get(COOKIE_NAME)?.value;
  if (!actual) return false;
  try {
    return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function makeAuthCookie(): { name: string; value: string; opts: object } {
  const expected = expectedToken()!;
  return {
    name: COOKIE_NAME,
    value: expected,
    opts: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  };
}

export function clearAuthCookie(): { name: string; opts: object } {
  return { name: COOKIE_NAME, opts: { path: "/", maxAge: 0 } };
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
