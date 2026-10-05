import Link from "next/link";
import { pageMeta, breadcrumbJsonLd } from "@/lib/site";

export const metadata = pageMeta({
  title: "Changelog",
  description:
    "What shipped in YATools and when — version history for the tools and the developer API.",
  path: "/developers/changelog",
  keywords: ["yatools changelog", "release notes", "version history"],
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Developers", path: "/developers" },
  { name: "Changelog", path: "/developers/changelog" },
];

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
            <em>Changelog</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            What shipped, and when. Short and honest.
          </p>
        </div>

        <div className="max-w-3xl mt-10 space-y-5">
          <article className="card p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="badge badge-red">v1.2.0</span>
              <span className="font-mono2 text-xs text-[var(--muted)]">
                2026-10-06
              </span>
            </div>
            <h2 className="font-extrabold text-xl mb-3">Polish + 14 new tools + blog</h2>
            <div className="prose-neu">
              <ul>
                <li>
                  7 new PDF tools: Merge, Split, Compress, Rotate, Image to
                  PDF, PDF to JPG, and a QR Code Scanner — all in-browser.
                </li>
                <li>
                  7 more tools: Invert, Mirror, Crop, Text to Image, Image to
                  Text (OCR), Universal Downloader, and Temporary Email.
                </li>
                <li>
                  Upgrades: advanced QR generator (logo, styles, colors),
                  Text to PDF with live preview, Image Resizer with live
                  preview, Background Remover with real download progress.
                </li>
                <li>
                  Fixes: image compressor never returns a larger file;
                  movie results gained a "Watch direct" button.
                </li>
                <li>
                  New: official logo + favicon, Vercel Analytics, and the
                  YATools Blog (5 starter guides).
                </li>
                <li>
                  New <span className="font-mono2 text-sm">/api/v1/*</span>{" "}
                  endpoints: alldl, mail — same normalized errors and
                  fair-use quotas.
                </li>
              </ul>
            </div>
          </article>
          <article className="card p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="badge badge-red">v1.1.0</span>
              <span className="font-mono2 text-xs text-[var(--muted)]">
                2026-10-05
              </span>
            </div>
            <h2 className="font-extrabold text-xl mb-3">Expansion: 8 new tools</h2>
            <div className="prose-neu">
              <ul>
                <li>
                  2 new API tools: Certificate Maker (novelty certificates)
                  and AI Vision Chat (ask AI about your photos).
                </li>
                <li>
                  6 new in-browser tools: Text to PDF, Background Remover,
                  Image Compressor, Image Converter, Image Resizer, Unit
                  Converter — zero server cost, fully private.
                </li>
                <li>
                  New <span className="font-mono2 text-sm">/api/v1/*</span>{" "}
                  endpoints: certificate, imgchat — same normalized
                  errors and fair-use quotas.
                </li>
              </ul>
            </div>
          </article>
          <article className="card p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="badge badge-red">v1.0.0</span>
              <span className="font-mono2 text-xs text-[var(--muted)]">
                2026-10-05
              </span>
            </div>
            <h2 className="font-extrabold text-xl mb-3">Initial launch</h2>
            <div className="prose-neu">
              <ul>
                <li>
                  14 tools live: 8 API-backed with fallbacks, 6 running fully
                  in the browser.
                </li>
                <li>
                  Public <span className="font-mono2 text-sm">/api/v1/*</span>{" "}
                  proxy with normalized errors and fair-use quotas — no keys
                  required.
                </li>
                <li>
                  Developer docs: quickstart, rate limits, error reference.
                </li>
                <li>Urdu-localized homepage at /ur.</li>
              </ul>
            </div>
          </article>

          <div className="prose-neu">
            <p>
              Found a bug or want a tool?{" "}
              <Link href="/contact">Tell us</Link> — the roadmap is driven by
              what people actually ask for. Also see the{" "}
              <Link href="/developers">API quickstart</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
