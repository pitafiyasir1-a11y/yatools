import Link from "next/link";
import { pageMeta, breadcrumbJsonLd } from "@/lib/site";

export const metadata = pageMeta({
  title: "API Error Reference",
  description:
    "Every YATools API error code, its HTTP status, the normalized {ok, provider, fallbackUsed, error} shape, and how binary routes report failures.",
  path: "/developers/errors",
  keywords: ["yatools api errors", "error codes", "api error reference"],
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Developers", path: "/developers" },
  { name: "Errors", path: "/developers/errors" },
];

const CODES: { code: string; http: string; meaning: string }[] = [
  {
    code: "RATE_LIMITED",
    http: "429",
    meaning:
      "Daily quota for this tool exceeded. Respect the Retry-After header and try again after the reset.",
  },
  {
    code: "MISSING_URL / MISSING_QUERY / MISSING_TEXT",
    http: "400",
    meaning:
      "A required parameter is missing — url for websnap, q for search endpoints, text for tts/hand. The message names the problem.",
  },
  {
    code: "BAD_JSON",
    http: "400",
    meaning: "A POST route received a body that isn't valid JSON.",
  },
  {
    code: "BAD_PROMPT",
    http: "400",
    meaning:
      "The tti prompt is empty or longer than 500 characters. Shorten it and retry.",
  },
  {
    code: "BAD_RATIO / BAD_RATE / BAD_PITCH / BAD_VOICE",
    http: "400",
    meaning:
      "An option value is outside its allowed range — e.g. an unsupported aspect ratio or an unknown voice index.",
  },
  {
    code: "UNSAFE_URL",
    http: "400",
    meaning:
      "The URL failed SSRF validation (localhost, private IPs, metadata addresses). Use a public URL instead.",
  },
  {
    code: "URL_TOO_LONG / QUERY_TOO_LONG",
    http: "400",
    meaning: "The input string exceeds the maximum allowed length.",
  },
  {
    code: "FILE_TOO_LARGE",
    http: "400",
    meaning:
      "The upload exceeds the size cap (e.g. audio files must stay under 25 MB).",
  },
  {
    code: "TRANSCRIBE_TIMEOUT",
    http: "502",
    meaning:
      "Transcription took too long — the audio file is likely too large. Split it into shorter parts and retry.",
  },
  {
    code: "MISSING_FIELDS / MISSING_IMAGE",
    http: "400",
    meaning:
      "A POST route is missing required fields — e.g. certificate needs name, date, signature, details, templateId; vision chat needs an image and a question.",
  },
  {
    code: "BAD_FIELD / BAD_IMAGE",
    http: "400",
    meaning:
      "A field failed validation — e.g. templateId outside 1–8, or an image that isn't a PNG/JPEG/WebP/GIF data URL.",
  },
  {
    code: "TRANSCRIBE_DOWN / WIKIPDF_DOWN / N8N_UNAVAILABLE",
    http: "502",
    meaning:
      "The primary provider and its fallbacks all failed. Safe to retry once; if it persists, the provider is down.",
  },
  {
    code: "CERT_UNAVAILABLE / IMGCHAT_DOWN",
    http: "502",
    meaning:
      "Certificate generation or AI vision has no free fallback — the upstream API itself is unreachable. Retry later.",
  },
  {
    code: "ALLDL_DOWN / MAIL_DOWN",
    http: "502",
    meaning:
      "The downloader or temporary-mail upstream is unreachable (the mail service is intermittently degraded). Retry later; do not hammer the endpoint.",
  },
];

const SHAPE = `{
  "ok": false,
  "provider": "yatools",
  "fallbackUsed": false,
  "error": {
    "code": "MISSING_URL",
    "message": "Human-readable explanation of what went wrong."
  }
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
            Error <em>reference</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            One error shape for every endpoint. Learn it once, handle
            everything.
          </p>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <h2>The normalized shape</h2>
          <p>
            Every API failure — no matter which tool — returns JSON in this
            shape, with an HTTP status that matches the problem:
          </p>
        </div>

        <div className="max-w-3xl mt-4">
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span className="ml-2 text-xs opacity-70">error shape</span>
            </div>
            <pre>{SHAPE}</pre>
          </div>
        </div>

        <div className="prose-neu max-w-3xl mt-8">
          <p>
            <span className="font-mono2 text-sm">provider</span> names the
            backend that produced the error;{" "}
            <span className="font-mono2 text-sm">fallbackUsed</span> tells you
            whether a fallback was already tried before failing. On success
            the same envelope carries a{" "}
            <span className="font-mono2 text-sm">data</span> payload instead of{" "}
            <span className="font-mono2 text-sm">error</span> — see the{" "}
            <Link href="/developers">API quickstart</Link>.
          </p>

          <h2>Error codes</h2>
        </div>

        <div className="max-w-4xl mt-4 neu-card p-2 md:p-4 overflow-x-auto">
          <table className="param-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>HTTP</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {CODES.map((c) => (
                <tr key={c.code}>
                  <td>
                    <code>{c.code}</code>
                  </td>
                  <td>
                    <code>{c.http}</code>
                  </td>
                  <td>{c.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <h2>Binary routes return JSON errors</h2>
          <p>
            Endpoints that return files on success — screenshots, PDFs, audio,
            generated images — return{" "}
            <span className="font-mono2 text-sm">application/json</span> when
            they fail. Never assume a 200 means bytes and never assume bytes
            without checking:
          </p>
          <ul>
            <li>
              Check the{" "}
              <span className="font-mono2 text-sm">content-type</span> response
              header before parsing.
            </li>
            <li>
              If it contains{" "}
              <span className="font-mono2 text-sm">application/json</span>,
              parse the body as the normalized error shape above.
            </li>
            <li>
              Only treat the body as a file when the content-type is the
              expected media type (e.g.{" "}
              <span className="font-mono2 text-sm">image/png</span>).
            </li>
            <li>
              On success,{" "}
              <span className="font-mono2 text-sm">X-Provider</span> and{" "}
              <span className="font-mono2 text-sm">X-Fallback-Used</span>{" "}
              headers tell you which backend served the file.
            </li>
          </ul>
          <div className="notice mt-8">
            <strong>Retry guidance:</strong> retry once on 502 errors with a
            short delay. Don&apos;t retry 400s (fix the request instead) and
            don&apos;t retry 429s until the{" "}
            <span className="font-mono2 text-sm">Retry-After</span> window
            passes — see <Link href="/developers/rate-limits">rate limits</Link>
            .
          </div>
          <p className="mt-8">
            Back to the <Link href="/developers">API quickstart</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
