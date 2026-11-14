/**
 * GET /api/v1/mail?action=create|inbox|read|delete&...
 * Temporary email. Primary: yatools /api/mail (GET only), adapted defensively.
 *
 * Upstream action shapes (from the live /api/mail index):
 *   create: ?action=create            (optional &name=yourname)
 *   inbox:  ?action=inbox&mail=x@y.z
 *   read:   ?action=read&mail=x@y.z&id=42
 *   delete: ?action=delete&mail=x@y.z&id=42
 * Receive-only: there is no send action and none is exposed here.
 *
 * Fallback: GuerrillaMail (api.guerrillamail.com — free, no key; verified live
 * 2026-11-14: create returns a real address, inbox lists messages, delete
 * works). Used when the primary is down (it returns 502 / times out as of
 * 2026-11-14). The GuerrillaMail session id is kept in an HttpOnly
 * first-party cookie (gm_sid, 1h) so the client needs no changes.
 *
 * Strict quota: 20 requests per IP per day (abuse-prone endpoint).
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, okJson, errJson, rateLimited } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 20;

const GM_BASE = "https://api.guerrillamail.com/ajax.php";

function gmSidCookie(sid: string): string {
  return `gm_sid=${sid}; Path=/api/v1/mail; Max-Age=3600; HttpOnly; SameSite=Lax`;
}

function getGmSid(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const m = /(?:^|;\s*)gm_sid=([A-Za-z0-9]+)/.exec(cookie);
  return m ? m[1] : null;
}

async function gmFetch(params: Record<string, string>): Promise<unknown | null> {
  const q = new URLSearchParams(params);
  try {
    const res = await fetch(`${GM_BASE}?${q.toString()}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  }
}

/** GuerrillaMail create → real disposable address + session id. */
async function gmCreate(): Promise<{ address: string; sid: string } | null> {
  const json = asRecord(await gmFetch({ f: "get_email_address" }));
  const address = str(json.email_addr);
  const sid = str(json.sid_token);
  if (!address || !sid) return null;
  return { address, sid };
}

/** GuerrillaMail inbox list (also carries each message's full body). */
async function gmList(sid: string): Promise<Record<string, unknown>[] | null> {
  const json = asRecord(await gmFetch({ f: "check_email", seq: "0", sid_token: sid }));
  const list = json.list;
  return Array.isArray(list) ? (list as Record<string, unknown>[]) : null;
}

function gmToMessage(r: Record<string, unknown>): MailMessage {
  const ts = typeof r.mail_timestamp === "number" && r.mail_timestamp > 0
    ? new Date(r.mail_timestamp * 1000).toISOString()
    : typeof r.mail_timestamp === "string" && /^\d+$/.test(r.mail_timestamp) && Number(r.mail_timestamp) > 0
      ? new Date(Number(r.mail_timestamp) * 1000).toISOString()
      : null;
  return {
    id: str(r.mail_id) ?? "",
    from: str(r.mail_from),
    subject: str(r.mail_subject),
    date: ts ?? str(r.mail_date),
    preview: str(r.mail_excerpt) ?? str(r.mail_body)?.slice(0, 200) ?? null,
  };
}

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

  // Primary first; on any primary failure, fall through to GuerrillaMail.
  let data: Record<string, unknown> | null = null;
  try {
    const res = await fetch(`${UPSTREAM}/api/mail?${upstream.toString()}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUTS.mail),
    });
    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    // The upstream may answer non-2xx with a JSON body ({ error: "..." }) —
    // only a non-JSON body means the service itself is down.
    if (contentType.includes("json")) {
      const json: unknown = await res.json().catch(() => null);
      if (json !== null) data = adapt(act, json);
    }
  } catch {
    data = null;
  }
  if (data) return okJson(data, "yatools");

  // Fallback: GuerrillaMail (free, no key). Create mints a fresh address and
  // stores its session id in an HttpOnly cookie; inbox/read/delete reuse it.
  if (act === "create") {
    const created = await gmCreate();
    if (!created) {
      return errJson(
        "MAIL_DOWN",
        "The mail service is slow or unavailable right now. Please try again in a moment.",
        502,
        "yatools",
        true,
      );
    }
    return new Response(
      JSON.stringify({
        ok: true,
        provider: "yatools",
        fallbackUsed: true,
        data: { address: created.address },
      }),
      {
        headers: {
          "content-type": "application/json",
          "Set-Cookie": gmSidCookie(created.sid),
        },
      },
    );
  }

  const sid = getGmSid(req);
  if (!sid) {
    return errJson(
      "MAIL_DOWN",
      "The mail service is slow or unavailable right now. Please try again in a moment.",
      502,
      "yatools",
      true,
    );
  }
  if (act === "inbox") {
    const list = await gmList(sid);
    if (!list) {
      return errJson("MAIL_DOWN", "The mail service is unavailable right now. Please try again in a moment.", 502, "yatools", true);
    }
    const mail = (searchParams.get("mail") ?? "").trim().toLowerCase();
    return okJson({ address: mail, messages: list.map(gmToMessage) }, "yatools", true);
  }
  if (act === "read") {
    const list = await gmList(sid);
    const id = (searchParams.get("id") ?? "").trim();
    const raw = list?.find((r) => str(r.mail_id) === id);
    if (!raw) {
      return errJson("MESSAGE_NOT_FOUND", "That message is no longer in the inbox.", 400, "yatools", true);
    }
    const m = gmToMessage(raw);
    return okJson(
      { message: { ...m, body: str(raw.mail_body) ?? m.preview ?? null } },
      "yatools",
      true,
    );
  }
  // delete
  const id = (searchParams.get("id") ?? "").trim();
  const delJson = asRecord(
    await gmFetch({ f: "del_email", "email_ids[]": id, sid_token: sid }),
  );
  const deletedIds = delJson.deleted_ids;
  const deleted =
    Array.isArray(deletedIds) && deletedIds.some((d) => String(d) === id);
  return okJson({ deleted }, "yatools", true);
}
