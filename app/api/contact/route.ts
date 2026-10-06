import { NextResponse } from "next/server";
import { rateLimit, clientIp, rateLimitedResponse } from "@/lib/rate-limit";

/* Public contact form -> Yasir's inbox.
   Server-side forward via FormSubmit's free AJAX endpoint (no API key needed):
   the message lands in yasirpitafi77556@gmail.com with the visitor's address
   as reply-to. First-ever submission triggers a one-time activation email
   that the inbox owner must confirm; afterwards delivery is automatic.
   Provider is isolated here — swap this fetch for Resend/SMTP later if needed. */

const DEST = "yasirpitafi77556@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  // 5 submissions per 10 minutes per IP.
  const rl = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!rl.ok) return rateLimitedResponse(rl.retryAfterSec);

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    message?: string;
    website?: string; // honeypot
  } | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot: bots fill this invisible field; humans never see it.
  // Pretend success so bots can't probe the filter.
  if (body.website) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (name.length < 2 || name.length > 80)
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email) || email.length > 120)
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (message.length < 10 || message.length > 5000)
    return NextResponse.json(
      { error: "Message must be between 10 and 5000 characters." },
      { status: 400 }
    );

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${DEST}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // FormSubmit's AJAX endpoint requires the request to look like it
        // comes from a real web page; without this it rejects the send.
        Referer: "https://yatools-tan.vercel.app/contact",
        Origin: "https://yatools-tan.vercel.app",
      },
      body: JSON.stringify({
        name,
        email,
        _replyto: email,
        _subject: `YATools contact — ${name}`,
        _template: "table",
        _captcha: "false",
        message,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await res.json().catch(() => null)) as {
      success?: string;
      message?: string;
    } | null;
    if (!res.ok || !data) throw new Error("forward failed");
    if (data.success === "true") return NextResponse.json({ ok: true });
    // One-time state: the inbox owner hasn't clicked FormSubmit's activation
    // link yet. Surface it distinctly so we know, not the visitor.
    if (data.message?.toLowerCase().includes("activation")) {
      return NextResponse.json(
        { error: "CONTACT_NOT_ACTIVATED" },
        { status: 502 }
      );
    }
    throw new Error("forward failed");
  } catch {
    return NextResponse.json(
      {
        error:
          "Couldn't send your message right now. Please try again in a minute, or email us directly.",
      },
      { status: 502 }
    );
  }
}
