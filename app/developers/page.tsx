import Link from "next/link";
import { pageMeta, breadcrumbJsonLd, SITE } from "@/lib/site";

export const metadata = pageMeta({
  title: "API Quickstart for Developers",
  description:
    "Use every YATools API-backed tool over HTTP through the /api/v1/* proxy — no keys, no signup. Code examples, endpoint reference, and fair-use quotas.",
  path: "/developers",
  keywords: [
    "yatools api",
    "website screenshot api",
    "free api no key",
    "api quickstart",
  ],
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Developers", path: "/developers" },
];

const BASE = SITE.url;

const ENDPOINTS: {
  method: string;
  path: string;
  params: string;
  purpose: string;
}[] = [
  {
    method: "GET",
    path: "/api/v1/websnap",
    params: "url (required)",
    purpose: "Full-page website screenshot — returns PNG bytes.",
  },
  {
    method: "POST",
    path: "/api/v1/transcribe",
    params: "JSON: audio as data:audio/* data URL (required, ≤ 25 MB), language, timestamps",
    purpose: "Transcribe an uploaded audio file to text.",
  },
  {
    method: "POST",
    path: "/api/v1/tts",
    params: "JSON: text (required), voiceIndex, rate, pitch",
    purpose: "Convert text to spoken audio, including Urdu voices.",
  },
  {
    method: "GET / POST",
    path: "/api/v1/hand",
    params: "text (required), font, style, paper, lang …",
    purpose: "Render typed text as handwriting on ruled paper (PNG).",
  },
  {
    method: "GET",
    path: "/api/v1/wikipdf",
    params: "query — Wikipedia article URL or title (required)",
    purpose: "Convert a Wikipedia article to a clean, selectable-text PDF.",
  },
  {
    method: "GET",
    path: "/api/v1/n8n",
    params: "q, limit, category, complexity, triggerType, page",
    purpose: "Search n8n workflow templates by keyword.",
  },
  {
    method: "POST",
    path: "/api/v1/tti",
    params: "JSON: prompt, 1–500 chars (required), ratio",
    purpose: "Generate an AI image from a text prompt (POST only).",
  },
  {
    method: "GET",
    path: "/api/v1/msearch",
    params: "q (required)",
    purpose: "Search movies and TV shows — ratings, cast, posters.",
  },
  {
    method: "POST",
    path: "/api/v1/certificate",
    params: "JSON: name, date, signature, details, templateId 1–8 (required), format pdf|jpg|png",
    purpose: "Generate a novelty certificate (not an official credential).",
  },
  {
    method: "POST",
    path: "/api/v1/imgchat",
    params: "JSON: image as data:image/* data URL (required, ≤ 5 MB), userPrompt (required)",
    purpose: "Ask AI questions about an uploaded image.",
  },
];

const QUOTAS: { tool: string; route: string; limit: string }[] = [
  { tool: "Website Screenshot", route: "/api/v1/websnap", limit: "20 / day" },
  { tool: "Audio to Text", route: "/api/v1/transcribe", limit: "10 / day" },
  { tool: "Text to Speech", route: "/api/v1/tts", limit: "30 / day" },
  { tool: "Wikipedia to PDF", route: "/api/v1/wikipdf", limit: "20 / day" },
  { tool: "n8n Workflow Search", route: "/api/v1/n8n", limit: "100 / day" },
  { tool: "AI Image Generator", route: "/api/v1/tti", limit: "10 / day" },
  { tool: "Movie & TV Search", route: "/api/v1/msearch", limit: "50 / day" },
  { tool: "Certificate Maker", route: "/api/v1/certificate", limit: "10 / day" },
  { tool: "AI Vision Chat", route: "/api/v1/imgchat", limit: "10 / day" },
];

const CURL_SNIPPET = `# Full-page screenshot of any public URL
curl "${BASE}/api/v1/websnap?url=https://example.com" \\
  --output screenshot.png

# The response is a PNG. On error you get JSON instead:
# {"ok":false,"provider":"yatools","fallbackUsed":false,
#  "error":{"code":"RATE_LIMITED","message":"..."}}`;

const JS_SNIPPET = `const res = await fetch(
  "${BASE}/api/v1/websnap?url=" +
    encodeURIComponent("https://example.com")
);

const contentType = res.headers.get("content-type") ?? "";

if (!res.ok || contentType.includes("application/json")) {
  // Normalized error shape: { ok, provider, fallbackUsed, error: { code, message } }
  const body = await res.json();
  throw new Error(body.error.message);
}

const png = await res.blob(); // screenshot bytes`;

const PY_SNIPPET = `import requests

r = requests.get(
    "${BASE}/api/v1/websnap",
    params={"url": "https://example.com"},
    timeout=60,
)

if "application/json" in r.headers.get("content-type", ""):
    # Normalized error: {"ok": False, ..., "error": {"code": ..., "message": ...}}
    raise SystemExit(r.json()["error"]["message"])

with open("screenshot.png", "wb") as f:
    f.write(r.content)  # PNG bytes`;

const ENVELOPE_OK = `{
  "ok": true,
  "provider": "ahm7",
  "fallbackUsed": false,
  "data": { /* endpoint-specific payload */ }
}`;

const ENVELOPE_ERR = `{
  "ok": false,
  "provider": "yatools",
  "fallbackUsed": false,
  "error": {
    "code": "MISSING_URL",
    "message": "Human-readable explanation of what went wrong."
  }
}`;

const RATE_LIMITED_BODY = `// HTTP 429 — also carries a Retry-After header (seconds)
{
  "ok": false,
  "provider": "yatools",
  "fallbackUsed": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Daily limit reached for this tool — try again tomorrow."
  },
  "tool": "websnap"
}`;

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function Crumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        className="font-mono2 m-0 flex flex-wrap items-center gap-2 p-0 text-xs"
        style={{ listStyle: "none" }}
      >
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" style={{ color: "var(--muted)" }}>
                /
              </span>
            )}
            {i === items.length - 1 ? (
              <span aria-current="page" style={{ color: "var(--text)" }}>
                {item.name}
              </span>
            ) : (
              <Link
                href={item.path}
                className="no-underline hover:underline"
                style={{ color: "var(--muted)" }}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function CodeWindow({ title, code }: { title: string; code: string }) {
  return (
    <div className="code-window">
      <div className="code-bar">
        <span className="code-dot" style={{ background: "#ff5f57" }} />
        <span className="code-dot" style={{ background: "#febc2e" }} />
        <span className="code-dot" style={{ background: "#28c840" }} />
        <span className="ml-2 text-xs opacity-70">{title}</span>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="wrap py-10 md:py-14">
        <Crumbs items={crumbs} />
        <div className="max-w-3xl">
          <p className="eyebrow mt-6">
            <span className="dot" /> Developers
          </p>
          <h1 className="hero-title mt-4">
            API <em>quickstart</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            Every API-backed YATools tool is available over HTTP. No API keys,
            no signup — just call the endpoint.
          </p>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <h2>Base URL &amp; the deal</h2>
          <p>
            All browser calls go through{" "}
            <strong>
              <span className="font-mono2 text-sm">{BASE}/api/v1/*</span>
            </strong>{" "}
            — you never talk to upstream providers directly. That gives you one
            stable interface, normalized errors, and built-in fallback cascades
            when a provider is down.
          </p>
          <div className="notice mt-4">
            <strong>The service is free with fair-use limits.</strong> There
            are no keys to manage — usage is governed by{" "}
            <Link href="/developers/rate-limits">per-IP daily quotas</Link>{" "}
            instead. Personal projects, side projects, and small apps are
            exactly what the API is for.
          </div>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <h2>The response envelope</h2>
          <p>
            Every JSON endpoint returns the same envelope.{" "}
            <span className="font-mono2 text-sm">provider</span> names the
            backend that served the request (usually{" "}
            <span className="font-mono2 text-sm">ahm7</span>);{" "}
            <span className="font-mono2 text-sm">fallbackUsed</span> is{" "}
            <span className="font-mono2 text-sm">true</span> when a fallback
            cascade kicked in after the primary failed.
          </p>
        </div>

        <div className="max-w-3xl mt-4 grid gap-4">
          <CodeWindow title="success shape" code={ENVELOPE_OK} />
          <CodeWindow title="error shape" code={ENVELOPE_ERR} />
        </div>

        <div className="prose-neu max-w-3xl mt-8">
          <p>
            Endpoints that return <strong>files on success</strong> —
            screenshots, PDFs, audio, generated images — stream bytes with the
            correct content-type plus{" "}
            <span className="font-mono2 text-sm">X-Provider</span> and{" "}
            <span className="font-mono2 text-sm">X-Fallback-Used</span>{" "}
            headers. They return the JSON error shape only when they fail, so
            always check the{" "}
            <span className="font-mono2 text-sm">content-type</span> before
            parsing — see the{" "}
            <Link href="/developers/errors">error reference</Link>.
          </p>

          <h2>Your first call</h2>
          <p>
            Screenshot of <span className="font-mono2 text-sm">example.com</span>{" "}
            in three languages:
          </p>
        </div>

        <div className="max-w-3xl mt-4 grid gap-4">
          <CodeWindow title="cURL" code={CURL_SNIPPET} />
          <CodeWindow title="JavaScript" code={JS_SNIPPET} />
          <CodeWindow title="Python" code={PY_SNIPPET} />
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <h2>Endpoint reference</h2>
          <p>
            Eight proxy routes, one per API-backed tool. Query parameters go in
            the URL for GET routes; POST routes take a JSON body.
          </p>
        </div>

        <div className="max-w-5xl mt-4 neu-card p-2 md:p-4 overflow-x-auto">
          <table className="param-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Parameters</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={e.path}>
                  <td>
                    <code>{e.method}</code>
                  </td>
                  <td>
                    <code>{e.path}</code>
                  </td>
                  <td>{e.params}</td>
                  <td>{e.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <h2>Daily quotas</h2>
          <p>
            Limits apply <strong>per tool, per IP, per day</strong> (resets at
            midnight UTC). The six client-side tools — QR Code Generator, Word
            Counter, JSON Formatter, Password Generator, Case Converter, Color
            Picker — run entirely in your browser and have no limits at all.
          </p>
        </div>

        <div className="max-w-4xl mt-4 neu-card p-2 md:p-4 overflow-x-auto">
          <table className="param-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Route</th>
                <th>Limit (per IP / day)</th>
              </tr>
            </thead>
            <tbody>
              {QUOTAS.map((q) => (
                <tr key={q.tool}>
                  <td>
                    <strong>{q.tool}</strong>
                  </td>
                  <td>
                    <code>{q.route}</code>
                  </td>
                  <td>{q.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <h2>What happens on 429</h2>
          <p>
            Exceed a quota and the API returns{" "}
            <span className="font-mono2 text-sm">429 Too Many Requests</span>{" "}
            with a <span className="font-mono2 text-sm">Retry-After</span>{" "}
            header (seconds until the quota resets) and this body:
          </p>
        </div>

        <div className="max-w-3xl mt-4">
          <CodeWindow title="429 response" code={RATE_LIMITED_BODY} />
        </div>

        <div className="prose-neu max-w-3xl mt-8">
          <p>
            The correct behavior is simple: back off, show the user a friendly
            message, and retry after the reset — don&apos;t hammer the
            endpoint. Full details on the{" "}
            <Link href="/developers/rate-limits">rate limits</Link> page.
          </p>

          <h2>Keep reading</h2>
          <ul>
            <li>
              <Link href="/developers/rate-limits">
                Rate limits &amp; fair use
              </Link>{" "}
              — the numbers above in context, plus the fair-use policy.
            </li>
            <li>
              <Link href="/developers/errors">Error reference</Link> — every
              error code, the normalized shape, and how to handle binary-route
              failures.
            </li>
            <li>
              <Link href="/developers/changelog">Changelog</Link> — what
              shipped and when.
            </li>
          </ul>
          <div className="notice mt-8">
            <strong>Building something public?</strong> Quotas are per IP and
            designed for personal projects and small apps. If you need more,
            <Link href="/contact"> get in touch</Link> — we&apos;d rather talk
            than have you scrape.
          </div>
        </div>
      </div>
    </>
  );
}
