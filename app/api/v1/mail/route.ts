/**
 * GET /api/v1/mail?action=create|inbox|read|delete&...
 * Temporary email. Primary: ahm7 /api/mail (GET only), adapted defensively.
 *
 * Upstream action shapes (from the live /api/mail index):
 *   create: ?action=create            (optional &name=yourname)
 *   inbox:  ?action=inbox&mail=x@y.z
 *   read:   ?action=read&mail=x@y.z&id=42
 *   delete: ?action=delete&mail=x@y.z&id=42
 * Receive-only: there is no send action and none is exposed here.
 *
 * Strict quota: 20 requests per IP per day (abuse-prone endpoint).
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, okJson, errJson, rateLimited } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 20;

const ACTIONS = ["create", "inbox", "read", "delete"] as const;
type Action = (typeof ACTIONS)[number];

function asRecord(payload: unknown): Record<string, unknown> {
  return typeof payload === "object" && payload !== null
    ? (payload as Record<string, unknown>)
    : {};
}

function str(v: unknown): string | null {
  if (typeof v === "string" && v.trim()) return v.trim();
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return null;
}

function firstString(p: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const s = str(p[k]);
    if (s) return s;
  }
  return null;
}

type MailMessage = {
  id: string;
  from: string | null;
  subject: string | null;
  date: string | null;
  preview: string | null;
};

/** Defensive extraction of a message list from unknown upstream shapes. */
function adaptMessages(payload: unknown): MailMessage[] {
  const p = asRecord(payload);
  const listKeys = ["messages", "inbox", "mails", "emails", "data"];
  let list: unknown[] = [];
  for (const k of listKeys) {
    const v = p[k];
    if (Array.isArray(v)) {
      list = v;
      break;
    }
  }
  return list.map((m) => {
    const r = asRecord(m);
    return {
      id: firstString(r, ["id", "_id", "mid"]) ?? "",
      from: firstString(r, ["from", "sender", "fromAddress"]),
      subject: firstString(r, ["subject", "title"]),
      date: firstString(r, ["date", "time", "createdAt", "receivedAt"]),
      preview: firstString(r, ["preview", "snippet", "body", "text"]),
    };
  });
}

/**
 * Normalize the upstream payload per action. Returns null when the payload
 * is an upstream error shape ({ error: "..." }), letting the caller turn it
 * into a clean 502.
 */
function adapt(action: Action, payload: unknown): Record<string, unknown> | null {
  const p = asRecord(payload);
  const upstreamError = str(p.error);
  if (upstreamError) return null;

  switch (action) {
    case "create":
      return { address: firstString(p, ["address", "mail", "email"]) };
    case "inbox": {
      const messages = adaptMessages(payload);
      return { address: firstString(p, ["address", "mail", "email"]), messages };
    }
    case "read": {
      const msg = asRecord(p.message ?? p.data ?? p);
      return {
        message: {
          id: firstString(msg, ["id", "_id", "mid"]),
          from: firstString(msg, ["from", "sender", "fromAddress"]),
          subject: firstString(msg, ["subject", "title"]),
          date: firstString(msg, ["date", "time", "createdAt", "receivedAt"]),
          body: firstString(msg, ["body", "text", "content", "html", "message"]),
        },
      };
    }
    case "delete":
      return {
        deleted:
          p.success === true ||
          p.deleted === true ||
          str(p.status)?.toLowerCase() === "ok" ||
          str(p.message)?.toLowerCase().includes("delet") === true,
      };
  }
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(v);
}

function cleanName(v: string): string | null {
  const n = v.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  if (!n || n.length > 32) return null;
  return n;
}

export async function GET(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("mail", RATE_LIMIT, req);
  if (!allowed) return rateLimited("mail", retryAfterSec ?? 86_400);

  const { searchParams } = new URL(req.url);
  const action = (searchParams.get("action") ?? "").trim().toLowerCase();

  if (!ACTIONS.includes(action as Action)) {
    return errJson(
      "BAD_ACTION",
      "Unknown action. Use create, inbox, read, or delete.",
      400
    );
  }
  const act = action as Action;

  // Build the upstream query string with strict per-action validation.
  const upstream = new URLSearchParams({ action: act });
  if (act === "create") {
    const nameRaw = (searchParams.get("name") ?? "").trim();
    if (nameRaw) {
      const name = cleanName(nameRaw);
      if (!name) {
        return errJson(
          "BAD_NAME",
          "The name may only use letters, numbers, dots, dashes, and underscores (max 32 characters).",
          400
        );
      }
      upstream.set("name", name);
    }
  } else {
    const mail = (searchParams.get("mail") ?? "").trim().toLowerCase();
    if (!isValidEmail(mail)) {
      return errJson("BAD_ADDRESS", "Please provide a valid email address.", 400);
    }
    if (mail.length > 254) {
      return errJson("BAD_ADDRESS", "That email address is too long.", 400);
    }
    upstream.set("mail", mail);
    if (act === "read" || act === "delete") {
      const id = (searchParams.get("id") ?? "").trim();
      if (!id || id.length > 64 || !/^[A-Za-z0-9._-]+$/.test(id)) {
        return errJson("BAD_ID", "Please provide a valid message id.", 400);
      }
      upstream.set("id", id);
    }
  }

  let res: Response;
  try {
    res = await fetch(`${UPSTREAM}/api/mail?${upstream.toString()}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUTS.mail),
    });
  } catch {
    return errJson(
      "MAIL_DOWN",
      "The mail service is slow or unavailable right now. Please try again in a moment.",
      502,
      "ahm7"
    );
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  // The upstream may answer non-2xx with a JSON body ({ error: "..." }) —
  // only a non-JSON body means the service itself is down.
  if (!contentType.includes("json")) {
    return errJson(
      "MAIL_DOWN",
      "The mail service is slow or unavailable right now. Please try again in a moment.",
      502,
      "ahm7"
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return errJson(
      "MAIL_DOWN",
      "The mail service returned an unreadable response. Please try again.",
      502,
      "ahm7"
    );
  }

  const data = adapt(act, json);
  if (!data) {
    const msg = str(asRecord(json).error) || "The mail service reported an error.";
    return errJson("MAIL_ERROR", msg, 502, "ahm7");
  }
  return okJson(data, "ahm7");
}
