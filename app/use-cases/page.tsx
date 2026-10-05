import Link from "next/link";
import { SITE, USE_CASES, pageMeta, breadcrumbJsonLd } from "@/lib/site";

export const metadata = pageMeta({
  title: "Use-case guides",
  description:
    "Practical guides for getting real work done with YATools: client-ready screenshots, voice-note transcription, Urdu voiceovers, and offline study packs.",
  path: "/use-cases",
  keywords: ["yatools guides", "online tools tutorials", "free tools use cases"],
});

const crumbs = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Guides", path: "/use-cases" },
]);

export default function UseCasesIndex() {
  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <nav aria-label="Breadcrumb" style={{ fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        <Link href="/" style={{ textDecoration: "underline" }}>Home</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">Guides</span>
      </nav>

      <p className="eyebrow">Guides</p>
      <h1 className="sec-title">
        Get real work done with <em>YATools</em>
      </h1>
      <p className="sec-sub">
        Short, practical guides — no fluff. Each one walks through a real
        task from start to finish using the free tools on this site.
      </p>

      <div className="tool-grid" style={{ marginTop: "2rem" }}>
        {USE_CASES.map((u) => (
          <Link
            key={u.slug}
            href={`/use-cases/${u.slug}`}
            className="card card-hover"
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                letterSpacing: "0.02em",
              }}
            >
              {u.title}
            </h2>
            <p style={{ marginTop: "0.5rem" }}>{u.description}</p>
            <span
              className="btn btn-sm"
              style={{ marginTop: "1rem", display: "inline-block" }}
            >
              Read guide →
            </span>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: "2.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.3rem",
            letterSpacing: "0.02em",
          }}
        >
          Prefer to explore the tools directly?
        </h2>
        <p style={{ marginTop: "0.5rem" }}>
          All 36 tools are free, with no signup. Start with the most popular
          ones and learn by doing.
        </p>
        <Link
          href="/#tools"
          className="btn btn-primary"
          style={{ marginTop: "1rem", display: "inline-block" }}
        >
          Browse all tools
        </Link>
      </div>

      <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        Built by {SITE.owner} · {SITE.name} guides
      </p>
    </div>
  );
}
