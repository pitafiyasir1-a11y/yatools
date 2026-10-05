import Link from "next/link";
import {
  SITE,
  pageMeta,
  toolBySlug,
  breadcrumbJsonLd,
  faqJsonLd,
  type ToolDef,
} from "@/lib/site";
import ToolClient from "./ToolClient";

const tool = toolBySlug("movie-tv-search")!;

export const metadata = pageMeta({
  title: "Movie & TV Search — Free Online | YATools",
  description:
    "Search movies and TV shows free: ratings, release years, posters, and details. Find your next watch in seconds — no signup needed.",
  path: "/tools/movie-tv-search",
  keywords: [
    "movie search",
    "tv show search",
    "movie ratings lookup",
    "find movies online",
    "cinesearch",
  ],
});

const FAQS = [
  {
    q: "Where does the movie and TV data come from?",
    a: "Results come from a movie and TV database index. When that index is unreachable, the tool falls back to TVMaze (CC BY-SA) data — in that case results are TV shows only, and the page tells you so.",
  },
  {
    q: "Why do I sometimes only see TV shows?",
    a: "That is fallback mode: the main index was temporarily down, so results are served TV-only from TVMaze. Movie results return automatically once the main index is back — no action needed.",
  },
  {
    q: "Are the ratings accurate?",
    a: "Ratings come from the source databases and shift over time as more people vote. Treat them as a useful guide for picking what to watch — not as a final verdict on quality.",
  },
  {
    q: "Can I watch movies or shows here?",
    a: "No. This is a search and discovery tool — the \u201cView details\u201d link takes you to the title's page on the source database for cast, synopsis, and more.",
  },
  {
    q: "Is it free? Do I need an account?",
    a: "Yes, it is free, and no account is needed — 50 searches per day keeps it fast for everyone.",
  },
];

const STEPS = [
  {
    title: "Type a title",
    text: "Enter a movie or show name — partial titles work, so \u201cDune\u201d is enough.",
  },
  {
    title: "Browse the results",
    text: "Compare posters, release years, types, and ratings to make sure you found the right title.",
  },
  {
    title: "Open details",
    text: "Follow \u201cView details\u201d for the full cast, synopsis, and more on the source page.",
  },
];

const PARAMS = [
  {
    name: "q",
    type: "string",
    required: "Yes",
    desc: "Movie or TV show title; partial titles work. Max 100 characters.",
  },
  {
    name: "response",
    type: "JSON",
    required: "\u2014",
    desc: "{ ok:true, provider, fallbackUsed, data:{ results:[{ title, type, year, rating, image, url }], tvOnly? } }.",
  },
  {
    name: "provider",
    type: "string",
    required: "\u2014",
    desc: "\u201cahm7\u201d (movies + TV) or \u201ctvmaze\u201d (TV-only fallback). tvOnly:true marks fallback results.",
  },
  {
    name: "data credit",
    type: "\u2014",
    required: "\u2014",
    desc: "Fallback data is © TVMaze, licensed CC BY-SA — link back when reusing it.",
  },
  {
    name: "rate limit",
    type: "\u2014",
    required: "\u2014",
    desc: "50 searches per day per IP. Exceeding it returns HTTP 429 with a Retry-After header.",
  },
];

const JS_EXAMPLE = `// Search movies and TV shows
const res = await fetch(
  \`/api/v1/msearch?q=\${encodeURIComponent("Dune")}\`
);
const { data, provider } = await res.json();
for (const r of data.results) {
  console.log(r.title, r.year, r.type, r.rating);
}
// provider "tvmaze" → data.tvOnly is true: TV shows only (fallback mode)`;

const CURL_EXAMPLE = `curl "https://yatools.vercel.app/api/v1/msearch?q=Breaking%20Bad"`;

const USE_CASES = [
  {
    title: "Plan movie night",
    text: "Check ratings and runtimes before committing two hours to a film nobody has heard of.",
  },
  {
    title: "Identify a title fast",
    text: "Half-remember a show from years ago? A partial title search usually finds it in seconds.",
  },
  {
    title: "Research for content",
    text: "Grab posters, release years, and ratings when writing reviews, articles, or video scripts.",
  },
  {
    title: "Settle trivia debates",
    text: "Look up exact release years and cast lists to end \u201cwait, which year was that?\u201d arguments.",
  },
  {
    title: "Avoid the duds",
    text: "A quick ratings check separates genuine hidden gems from well-marketed disappointments.",
  },
];

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Tools", path: "/tools" },
  { name: tool.name, path: `/tools/${tool.slug}` },
];

function softwareAppJsonLd(t: ToolDef) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${t.name} — ${SITE.name}`,
    url: `${SITE.url}/tools/${t.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: t.description,
  };
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="code-window mt-4">
      <div className="code-bar">
        <span className="code-dot" style={{ background: "#ff5f57" }} />
        <span className="code-dot" style={{ background: "#febc2e" }} />
        <span className="code-dot" style={{ background: "#28c840" }} />
        <span
          className="font-mono2 text-xs ml-2"
          style={{ color: "#a9a7a0" }}
        >
          {label}
        </span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="neu-card p-2 sm:p-4 mt-6">
      {faqs.map((f) => (
        <details key={f.q} className="faq-item">
          <summary className="faq-q">
            {f.q}
            <span aria-hidden="true">+</span>
          </summary>
          <p className="faq-a">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

function RelatedGrid({ related }: { related: ToolDef[] }) {
  return (
    <div className="tool-grid mt-6">
      {related.map((t) => (
        <Link
          key={t.slug}
          href={`/tools/${t.slug}`}
          className="neu-card neu-card-hover p-5 block"
        >
          <span className={`neu-badge neu-badge-${t.badgeColor}`}>
            {t.badge}
          </span>
          <h3 className="font-display text-2xl mt-3">{t.name}</h3>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {t.tagline}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function MovieTvSearchPage() {
  const related = tool.related
    .map((s) => toolBySlug(s))
    .filter((t): t is ToolDef => Boolean(t));

  return (
    <main className="wrap py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppJsonLd(tool)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(crumbs)),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="font-mono2 text-xs mb-8 flex items-center gap-2"
        style={{ color: "var(--muted)" }}
      >
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/tools" className="hover:underline">
          Tools
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{tool.name}</span>
      </nav>

      <header className="text-center max-w-3xl mx-auto mb-10">
        <span className="eyebrow">
          <span className="dot" />
          Free tool
        </span>
        <h1 className="hero-title mt-5">
          CineSearch — Movie &amp; TV <em>Search</em>
        </h1>
        <p className="sec-sub mx-auto mt-4">
          {tool.tagline} Look up titles with ratings, years, and posters —
          plan your next watch in seconds.
        </p>
      </header>

      <section aria-label="Movie and TV search tool">
        <ToolClient />
        <p
          className="text-center text-sm mt-5"
          style={{ color: "var(--muted)" }}
        >
          Free for normal use — 50 searches per day. Poster, year, and rating
          shown where the source provides them.
        </p>
      </section>

      <section className="mt-14">
        <p className="sec-label">How it works</p>
        <h2 className="sec-title">
          Three steps to <em>done</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="neu-card p-6">
              <div
                className="font-display text-4xl"
                style={{ color: "var(--red)" }}
              >
                {i + 1}
              </div>
              <h3 className="font-bold mt-2">{s.title}</h3>
              <p className="text-sm mt-1" style={{ color: "var(--text2)" }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">API parameters</p>
        <h2 className="sec-title">
          The <em>endpoint</em>
        </h2>
        <p className="sec-sub mt-2">
          The same search behind this tool is available as{" "}
          <code className="font-mono2 text-sm">GET /api/v1/msearch</code>.
        </p>
        <div className="neu-card p-2 sm:p-4 mt-6 overflow-x-auto">
          <table className="param-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {PARAMS.map((r) => (
                <tr key={r.name}>
                  <td>
                    <code>{r.name}</code>
                  </td>
                  <td>
                    <code>{r.type}</code>
                  </td>
                  <td>{r.required}</td>
                  <td>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">Examples</p>
        <h2 className="sec-title">
          Try it in <em>code</em>
        </h2>
        <CodeBlock label="JavaScript — search titles" code={JS_EXAMPLE} />
        <CodeBlock label="cURL — one-liner" code={CURL_EXAMPLE} />
      </section>

      <section className="mt-14">
        <p className="sec-label">Use cases</p>
        <h2 className="sec-title">
          Made for <em>real work</em>
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {USE_CASES.map((u) => (
            <div key={u.title} className="neu-card p-6">
              <h3 className="font-bold">{u.title}</h3>
              <p className="text-sm mt-1" style={{ color: "var(--text2)" }}>
                {u.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">FAQ</p>
        <h2 className="sec-title">
          Questions, <em>answered</em>
        </h2>
        <FaqList faqs={FAQS} />
      </section>

      <section className="mt-14">
        <p className="sec-label">Related tools</p>
        <h2 className="sec-title">
          Keep <em>going</em>
        </h2>
        <RelatedGrid related={related} />
      </section>

      <section className="neu-card p-6 md:p-8 mt-14 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div>
          <p className="sec-label">For developers</p>
          <h2 className="sec-title">
            Use the <em>Movie &amp; TV API</em> in your own app
          </h2>
          <p className="sec-sub mt-2">
            One GET request returns posters, years, types, and ratings for
            any title — free for reasonable use.
          </p>
        </div>
        <a
          className="neu-btn neu-btn-primary shrink-0"
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(
            "API access: Movie & TV Search"
          )}`}
        >
          Request API access
        </a>
      </section>

      <div className="notice mt-12 max-w-3xl mx-auto">
        <strong>Private by design.</strong> Search queries go through our
        proxy to the title index. We don&apos;t store your searches or build
        a watch history.
      </div>
    </main>
  );
}
