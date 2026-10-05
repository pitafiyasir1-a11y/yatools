import Link from "next/link";
import { SITE, pageMeta, orgJsonLd, breadcrumbJsonLd } from "@/lib/site";

export const metadata = pageMeta({
  title: "About YATools",
  description:
    "YATools by Yasir Abbas — free online tools for everyone, with API tools powered by the AHM7xMakki platform. Genuinely useful tools with honest limits.",
  path: "/about",
  keywords: ["about yatools", "yasir abbas", "free online tools"],
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
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
      <JsonLd data={orgJsonLd()} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="wrap py-10 md:py-14">
        <Crumbs items={crumbs} />
        <div className="max-w-3xl">
          <p className="eyebrow mt-6">
            <span className="dot" /> About
          </p>
          <h1 className="hero-title mt-4">
            About <em>YATools</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            Free tools for everyone — built by {SITE.owner}, with honest
            limits and no fine print.
          </p>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <h2>What this is</h2>
          <p>
            YATools is a collection of free online tools for everyday work:
            website screenshots, audio transcription, text to speech, Urdu
            handwriting, Wikipedia to PDF, and more — 36 tools in total. 24
            run entirely in your browser; 12 are powered through our API
            proxy by the{" "}
            <a
              href="https://ahm7xmakki.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              AHM7xMakki platform
            </a>
            .
          </p>

          <h2>Why it exists</h2>
          <p>
            Most &ldquo;free&rdquo; tool sites are ad mazes with fake download
            buttons. YATools was started by {SITE.owner} on a simple premise:
            a tool should do exactly what it says, load fast, and not waste
            your time. No accounts, no paywalls on basic features, no dark
            patterns.
          </p>

          <h2>Honest limits</h2>
          <p>
            Free doesn&apos;t mean infinite. API-backed tools have{" "}
            <Link href="/developers/rate-limits">daily fair-use quotas</Link>{" "}
            so the service stays fast for everyone, and every tool that has a
            fallback uses one — if a provider is down, you get the backup, not
            a dead page. We&apos;d rather tell you the real limits up front
            than surprise you later.
          </p>

          <h2>What we won&apos;t do</h2>
          <ul>
            <li>No fake &ldquo;unlimited everything&rdquo; claims.</li>
            <li>No selling your data — there&apos;s barely any to sell (see the{" "}
            <Link href="/privacy">privacy policy</Link>).</li>
            <li>
              No pretending AI outputs are perfect — transcriptions have
              errors, voices mispronounce things, and we say so on the tin.
            </li>
          </ul>

          <p>
            Want a tool we don&apos;t have, or found something broken?{" "}
            <Link href="/contact">Get in touch</Link> — real requests drive
            the roadmap. Developers can also start with the{" "}
            <Link href="/developers">API quickstart</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
