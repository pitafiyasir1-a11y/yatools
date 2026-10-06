import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, clientIp, rateLimitedResponse } from "@/lib/rate-limit";

/* Public contact form -> Yasir's inbox.
   Server-side forward via Gmail SMTP (App Password in GMAIL_APP_PASSWORD):
   the message lands in yasirpitafi77556@gmail.com with the visitor's address
   as reply-to. No third-party form service, no activation dance, no IP
   blocking — Gmail SMTP works reliably from Vercel's servers. */

const DEST = "yasirpitafi77556@gmail.com";
const GMAIL_USER = process.env.GMAIL_USER || DEST;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Requires GMAIL_APP_PASSWORD (Gmail App Password) set as a Vercel env var.
// Redeploy trigger: env var added 2026-10-06.

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

  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) {
    return NextResponse.json(
      { error: "Email service is being set up. Please email us directly for now." },
      { status: 503 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: appPassword },
    });
    await transporter.sendMail({
      from: `"YATools Contact Form" <${GMAIL_USER}>`,
      to: DEST,
      replyTo: email,
      subject: `YATools contact — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
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
