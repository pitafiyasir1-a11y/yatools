import Link from "next/link";
import { pageMeta, breadcrumbJsonLd } from "@/lib/site";

export const metadata = pageMeta({
  title: "Rate Limits & Fair Use",
  description:
    "Daily API quotas per tool for the YATools /api/v1/* proxy, what happens when you hit a 429, and the fair-use policy.",
  path: "/developers/rate-limits",
  keywords: ["yatools rate limits", "api quota", "fair use policy", "429 retry"],
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Developers", path: "/developers" },
  { name: "Rate Limits", path: "/developers/rate-limits" },
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
  { tool: "Client-side tools", route: "—", limit: "Unlimited" },
];

const BODY_429 = `// HTTP 429 — also carries a Retry-After header (seconds)
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
            Rate limits &amp; <em>fair use</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            YATools is free, so quotas keep it fast for everyone. Here are the
            exact numbers and what happens when you hit them.
          </p>
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
            with the normalized error shape:
          </p>
        </div>

        <div className="max-w-3xl mt-4">
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span className="ml-2 text-xs opacity-70">429 response</span>
            </div>
            <pre>{BODY_429}</pre>
          </div>
        </div>

        <div className="prose-neu max-w-3xl mt-8">
          <p>
            The response includes a{" "}
            <span className="font-mono2 text-sm">Retry-After</span> header with
            the number of seconds until the quota resets. The correct behavior
            is simple: back off, show the user a friendly message, and retry
            after the reset — don&apos;t hammer the endpoint.
          </p>

          <h2>Fair-use policy</h2>
          <ul>
            <li>
              <strong>Personal projects, side projects, and small apps</strong>{" "}
              are exactly what the API is for.
            </li>
            <li>
              <strong>No automated scraping.</strong> Don&apos;t crawl the API
              in loops, don&apos;t parallelize requests to dodge quotas, and
              don&apos;t resell API access as your own service.
            </li>
            <li>
              <strong>Cache aggressively.</strong> Screenshots, PDFs, and
              generated images don&apos;t change — store them instead of
              re-requesting.
            </li>
            <li>
              <strong>Abuse gets blocked.</strong> IPs that ignore 429s or
              show bot-like patterns may be rate-limited harder or blocked
              entirely, without warning.
            </li>
          </ul>
          <p>
            Need more than the quotas allow for a legitimate project?{" "}
            <Link href="/contact">Talk to us</Link> before building workarounds
            — we&apos;d rather find an arrangement than play whack-a-mole.
          </p>
          <p>
            See also: the <Link href="/developers/errors">error reference</Link>{" "}
            and the <Link href="/developers">API quickstart</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
