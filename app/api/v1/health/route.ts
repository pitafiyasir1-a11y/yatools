/**
 * GET /api/v1/health
 *
 * Smoke-test endpoint: lists the /api/v1/* proxy routes and a timestamp.
 * No rate limiting — used by uptime checks and the build smoke test.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ROUTES = [
  "/api/v1/websnap",
  "/api/v1/transcribe",
  "/api/v1/voices",
  "/api/v1/tts",
  "/api/v1/hand",
  "/api/v1/wikipdf",
  "/api/v1/n8n",
  "/api/v1/tti",
  "/api/v1/msearch",
  "/api/v1/health",
];

export async function GET(): Promise<Response> {
  return Response.json({
    ok: true,
    routes: ROUTES,
    timestamp: new Date().toISOString(),
  });
}
