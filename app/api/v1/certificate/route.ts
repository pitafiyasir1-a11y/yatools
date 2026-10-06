/**
 * POST /api/v1/certificate
 * Body: { name, date, signature, details, templateId, format? }
 *   name:        string, 1–100 chars (required)
 *   date:        non-empty string (required)
 *   signature:   string, 1–100 chars (required)
 *   details:     string, 1–500 chars (required)
 *   templateId:  integer 1–8 (required)
 *   format:      "pdf" | "jpg" | "png" (default "pdf")
 * Primary: yatools POST /api/certificate → { success:true, renderUrl, template, format, fields }.
 * No free fallback exists for certificates → 502 CERT_UNAVAILABLE on upstream failure.
 * No SSRF surface: the body contains no URLs and is never fetched.
 */

import { checkRateLimit } from "@/lib/proxy/rate-limit";
import { UPSTREAM, TIMEOUTS, okJson, errJson, rateLimited } from "@/lib/proxy/upstream";

export const runtime = "nodejs";

const RATE_LIMIT = 10;
const FORMATS = ["pdf", "jpg", "png"] as const;

type CertBody = {
  name?: unknown;
  date?: unknown;
  signature?: unknown;
  details?: unknown;
  templateId?: unknown;
  format?: unknown;
};

export async function POST(req: Request): Promise<Response> {
  const { allowed, retryAfterSec } = checkRateLimit("certificate", RATE_LIMIT, req);
  if (!allowed) return rateLimited("certificate", retryAfterSec ?? 86_400);

  let body: CertBody;
  try {
    body = (await req.json()) as CertBody;
  } catch {
    return errJson("BAD_JSON", "The request body must be valid JSON.", 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  // Optional: the frontend labels the signature line optional, so default it.
  const signature = typeof body.signature === "string" ? body.signature.trim() : "";
  const details = typeof body.details === "string" ? body.details.trim() : "";
  const templateId =
    typeof body.templateId === "number" && Number.isInteger(body.templateId)
      ? body.templateId
      : NaN;
  const format = typeof body.format === "string" ? body.format.toLowerCase() : "pdf";

  if (!body.name || !body.date || !body.details || body.templateId === undefined) {
    return errJson(
      "MISSING_FIELDS",
      "Required fields: name, date, details, templateId.",
      400,
    );
  }
  if (name.length < 1 || name.length > 100) {
    return errJson("BAD_FIELD", "name must be 1–100 characters.", 400);
  }
  if (date.length < 1) {
    return errJson("BAD_FIELD", "date must be a non-empty string.", 400);
  }
  // Signature is optional — validate length only when provided.
  if (signature.length > 100) {
    return errJson("BAD_FIELD", "signature must be at most 100 characters.", 400);
  }
  if (details.length < 1 || details.length > 500) {
    return errJson("BAD_FIELD", "details must be 1–500 characters.", 400);
  }
  if (!Number.isInteger(templateId) || templateId < 1 || templateId > 8) {
    return errJson("BAD_FIELD", "templateId must be an integer from 1 to 8.", 400);
  }
  if (!(FORMATS as readonly string[]).includes(format)) {
    return errJson("BAD_FIELD", "format must be one of: pdf, jpg, png.", 400);
  }

  try {
    const res = await fetch(`${UPSTREAM}/api/certificate`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ name, date, signature, details, templateId, format, returnUrl: true }),
      signal: AbortSignal.timeout(TIMEOUTS.certificate),
    });
    const json = (await res.json()) as {
      success?: unknown;
      renderUrl?: unknown;
      template?: unknown;
      format?: unknown;
      fields?: unknown;
    };
    if (!res.ok || json.success !== true || typeof json.renderUrl !== "string") {
      throw new Error("upstream certificate failed");
    }
    return okJson(
      { renderUrl: json.renderUrl, template: json.template, format: json.format, fields: json.fields },
      "yatools",
    );
  } catch {
    // No free fallback for certificate generation — honest failure.
    return errJson(
      "CERT_UNAVAILABLE",
      "Certificate generation is temporarily unavailable. Please try again later.",
      502,
    );
  }
}
