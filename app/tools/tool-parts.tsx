/* Shared presentational pieces for the client-side tool pages.
 * Self-contained: only depends on lib/site.ts (no @/components imports). */
import Link from "next/link";
import { TOOLS, toolBySlug, type ToolDef } from "@/lib/site";

/** Resolve a tool slug to its registry entry + public route. */
export function resolveTool(slug: string): { tool: ToolDef; href: string } | null {
  const t = toolBySlug(slug);
  return t ? { tool: t, href: `/tools/${t.slug}` } : null;
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function Breadcrumbs({ trail }: { trail: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
      <ol
        className="font-mono2"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
          listStyle: "none",
          margin: 0,
          padding: 0,
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--muted)",
        }}
      >
        {trail.map((t, i) => (
          <li key={t.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <span aria-hidden="true">/</span>}
            {t.href ? (
              <Link
                href={t.href}
                className="no-underline hover:underline"
                style={{ color: "var(--red-dark)" }}
              >
                {t.name}
              </Link>
            ) : (
              <span aria-current="page" style={{ color: "var(--text2)" }}>
                {t.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ToolHero({
  badge,
  badgeColor,
  title,
  tagline,
}: {
  badge: string;
  badgeColor: "red" | "green" | "blue" | "purple";
  title: React.ReactNode;
  tagline: string;
}) {
  return (
    <header style={{ marginBottom: 28, maxWidth: 760 }}>
      <div style={{ marginBottom: 14 }}>
        <span className={`badge badge-${badgeColor}`}>{badge}</span>
      </div>
      <h1 className="hero-title" style={{ marginBottom: 12, fontSize: "clamp(1.9rem, 4vw, 2.9rem)" }}>
        {title}
      </h1>
      <p className="sec-sub" style={{ fontSize: "1.05rem" }}>
        {tagline}
      </p>
      <p
        className="font-mono2"
        style={{
          marginTop: 14,
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--muted)",
        }}
      >
        Free tool · No sign-up · Private
      </p>
    </header>
  );
}

export function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14,
      }}
    >
      {steps.map((s, i) => (
        <div key={s.title} className="card" style={{ padding: 20 }}>
          <div
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "var(--red-tint)",
              color: "var(--red-dark)",
              fontWeight: 800,
              fontSize: "1rem",
              marginBottom: 12,
            }}
          >
            {i + 1}
          </div>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>{s.title}</h3>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{s.text}</p>
        </div>
      ))}
    </div>
  );
}

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="card" style={{ padding: "4px 22px" }}>
      {faqs.map((f) => (
        <details key={f.q} className="faq-item">
          <summary
            className="faq-q"
            style={{ listStyle: "none", cursor: "pointer" } as React.CSSProperties}
          >
            <span>{f.q}</span>
            <span aria-hidden="true" style={{ color: "var(--red)", fontWeight: 700, fontSize: "1.2rem", lineHeight: 1 }}>
              +
            </span>
          </summary>
          <div className="faq-a">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

export function RelatedTools({ slugs }: { slugs: string[] }) {
  const items = slugs
    .map(resolveTool)
    .filter((x): x is { tool: ToolDef; href: string } => x !== null);
  return (
    <div className="tool-grid">
      {items.map(({ tool, href }) => (
        <Link
          key={tool.slug}
          href={href}
          className="card card-hover"
          style={{ padding: 20, display: "block", textDecoration: "none", color: "inherit" }}
        >
          <span className={`badge badge-${tool.badgeColor}`} style={{ marginBottom: 12 }}>
            {tool.badge}
          </span>
          <div style={{ fontWeight: 700, fontSize: "1.02rem", marginBottom: 6, color: "var(--text)" }}>
            {tool.name}
          </div>
          <p style={{ color: "var(--text2)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: 14 }}>
            {tool.tagline}
          </p>
          <span
            className="font-mono2"
            style={{ fontSize: "0.72rem", color: "var(--red-dark)", fontWeight: 500 }}
          >
            Open tool →
          </span>
        </Link>
      ))}
    </div>
  );
}

export function PrivacyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="notice notice-ok" style={{ marginTop: 16 }}>
      <strong>Private by design.</strong> {children}
    </div>
  );
}

export function SectionHead({ label, title, sub }: { label: string; title: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p className="sec-label">{label}</p>
      <h2 className="sec-title">{title}</h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </div>
  );
}

export function ApiCta() {
  return (
    <div
      className="card"
      style={{
        padding: "clamp(20px, 4vw, 32px)",
        display: "flex",
        flexWrap: "wrap",
        gap: 18,
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--surface)",
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <p className="sec-label">For developers</p>
        <h2 className="sec-title" style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>
          Need this <em>programmatically?</em>
        </h2>
        <p className="sec-sub">
          YATools also exposes simple REST APIs for screenshots, audio, documents, and more — free
          tier included.
        </p>
      </div>
      <Link href="/developers" className="btn btn-primary">
        Explore the API →
      </Link>
    </div>
  );
}

export { TOOLS };
