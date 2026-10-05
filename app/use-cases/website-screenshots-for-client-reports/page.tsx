import Link from "next/link";
import {
  pageMeta,
  breadcrumbJsonLd,
  faqJsonLd,
  toolBySlug,
  type ToolDef,
} from "@/lib/site";

export const metadata = pageMeta({
  title: "Website Screenshots for Client Reports",
  description:
    "How freelancers and agencies capture full-page website screenshots for client reports in seconds — no extensions, no manual cropping.",
  path: "/use-cases/website-screenshots-for-client-reports",
  keywords: [
    "website screenshot for client report",
    "full page screenshot",
    "freelancer client reporting",
    "website screenshot tool",
  ],
});

const crumbs = [
  { name: "Home", path: "/" },
  {
    name: "Website Screenshots for Client Reports",
    path: "/use-cases/website-screenshots-for-client-reports",
  },
];

const faqs = [
  {
    q: "Is the Website Screenshot tool free?",
    a: "Yes. It is free to use and needs no account or sign-up. Fair-use daily limits apply so the service stays fast for everyone — see the rate limits page for details.",
  },
  {
    q: "Can I capture pages that require a login?",
    a: "No. The tool captures publicly reachable pages only. For dashboards or anything behind a login, use your browser's built-in screenshot feature instead, since only your browser has your session.",
  },
  {
    q: "What do the screenshots look like?",
    a: "You get a full-page PNG captured at the page's rendered width — the whole page top to bottom, not just what's visible on screen. That makes them ideal for design reviews and before/after comparisons.",
  },
  {
    q: "Can I use these screenshots in paid client work?",
    a: "Yes, as captures of pages you have the right to show — typically your client's own site or your own work. If the site belongs to someone else, make sure you have their permission before sharing captures externally.",
  },
];

const related: ToolDef[] = ["website-screenshot", "wikipedia-to-pdf"]
  .map(toolBySlug)
  .filter((t): t is ToolDef => Boolean(t));

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

function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="card px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
      {items.map((item, i) => (
        <details key={i} className="faq-item" open={i === 0}>
          <summary className="faq-q" style={{ listStyle: "none" }}>
            <span>{item.q}</span>
            <span
              aria-hidden="true"
              className="font-mono2 text-xl leading-none font-bold"
              style={{ color: "var(--red)", flexShrink: 0 }}
            >
              +
            </span>
          </summary>
          <p className="faq-a">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

function RelatedTools({ tools }: { tools: ToolDef[] }) {
  return (
    <div className="tool-grid">
      {tools.map((t) => (
        <Link
          key={t.slug}
          href={`/tools/${t.slug}`}
          className="card card-hover flex flex-col gap-3 p-5 no-underline"
        >
          <div className="flex items-center justify-between">
            <span className={`badge badge-${t.badgeColor}`}>
              {t.badge}
            </span>
            <span
              aria-hidden="true"
              className="text-lg font-bold"
              style={{ color: "var(--red)" }}
            >
              &rarr;
            </span>
          </div>
          <div>
            <h3
              className="mb-1 text-lg font-extrabold"
              style={{ color: "var(--text)" }}
            >
              {t.name}
            </h3>
            <p
              className="m-0 text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {t.tagline}
            </p>
          </div>
          <div className="mt-auto pt-2">
            <span
              className="font-mono2 text-xs"
              style={{ color: "var(--muted)" }}
            >
              {t.api ?? "100% in-browser"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="wrap py-10 md:py-14">
        <Crumbs items={crumbs} />
        <div className="max-w-3xl">
          <p className="eyebrow mt-6">
            <span className="dot" /> Use case · Freelancers &amp; agencies
          </p>
          <h1 className="hero-title mt-4">
            Website screenshots for <em>client reports</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            Clients believe what they can see. Here is a fast, repeatable
            workflow for turning any live web page into a clean screenshot your
            clients will actually understand.
          </p>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <p>
            If you build websites for clients, you know the drill: every
            report, every handoff, and every &ldquo;can you just show me what
            changed?&rdquo; message needs a visual. Clients rarely read a
            paragraph about a redesigned hero section — but they instantly
            understand a screenshot of it. The problem is that capturing good
            screenshots by hand is slow, inconsistent, and full of browser
            chrome: bookmark bars, half-loaded fonts, and extensions peeking
            into the frame.
          </p>

          <h2>Why manual screenshots don&apos;t scale</h2>
          <ul>
            <li>
              <strong>Browser UI creeps in.</strong> Tabs, address bars, and OS
              notifications make reports look unprofessional.
            </li>
            <li>
              <strong>Long pages get chopped.</strong> You capture the top,
              scroll, capture again — and the two halves never line up.
            </li>
            <li>
              <strong>Every capture looks different.</strong> Different team
              members screenshot at different widths, so before/after
              comparisons are meaningless.
            </li>
            <li>
              <strong>Revisions mean rework.</strong> Every deploy forces you
              to redo the whole ritual, one scroll at a time.
            </li>
          </ul>
          <p>
            A dedicated screenshot tool removes all four problems at once: one
            URL in, one clean full-page image out, identical every time.
          </p>

          <h2>A 3-step workflow that takes under a minute</h2>
          <h3>1. Copy the final URL</h3>
          <p>
            Use the exact page your client will see — the live URL, not your
            staging link (unless the report is about staging). One rule: only
            capture pages you have the right to share. Your client&apos;s own
            site and your own work are fine; someone else&apos;s site needs
            their permission.
          </p>
          <h3>2. Generate the screenshot</h3>
          <p>
            Paste the URL into the{" "}
            <Link href="/tools/website-screenshot">Website Screenshot</Link>{" "}
            tool and download the full-page PNG. No extension to install, no
            account to create — the capture happens server-side, so what you
            get is the page as a neutral visitor sees it, not as your logged-in
            browser renders it.
          </p>
          <h3>3. Drop it into your report</h3>
          <p>
            Place the image in Google Docs, Notion, or your slide deck next to
            a one-line caption: what changed, and why it matters. That pairing
            — visual proof plus one sentence of context — is what separates a
            report clients skim from one they approve.
          </p>

          <h2>Full-page vs. viewport: pick the right one</h2>
          <p>
            <strong>Full-page</strong> captures are best for design reviews,
            before/after comparisons, and archiving a page exactly as it looked
            on a given date. <strong>Viewport</strong> captures (just the
            visible screen) work better when you need above-the-fold proof — a
            hero section, a new banner, a pricing table — without making the
            client scroll through an enormous image.
          </p>

          <h2>Tips that make your reports look professional</h2>
          <ul>
            <li>
              <strong>Keep one capture width</strong> across a whole report so
              pages look like they belong together.
            </li>
            <li>
              <strong>Annotate the important part.</strong> A simple arrow or
              circle drawn in any free image editor tells the client exactly
              where to look.
            </li>
            <li>
              <strong>Date your filenames</strong> — e.g.{" "}
              <span className="font-mono2 text-sm">
                client-homepage-2026-10-05.png
              </span>{" "}
              — so nobody confuses March&apos;s screenshot with October&apos;s.
            </li>
            <li>
              <strong>Re-capture after deploys</strong> so the report never
              shows stale UI the client already paid to change.
            </li>
            <li>
              <strong>Cite your sources properly.</strong> If a report
              references research, convert the source article with the{" "}
              <Link href="/tools/wikipedia-to-pdf">Wikipedia to PDF</Link>{" "}
              tool — a saved PDF survives link rot long after the live page
              changes.
            </li>
          </ul>

          <h2>Frequently asked questions</h2>
        </div>

        <div className="max-w-3xl mt-2">
          <FaqList items={faqs} />
        </div>

        <div className="max-w-3xl mt-10">
          <div className="card p-6 md:p-8">
            <h2 className="sec-title">Try it on your next report</h2>
            <p className="sec-sub mb-6">
              Paste a URL, download the screenshot, drop it in your report.
              Free, no sign-up.
            </p>
            <Link
              href="/tools/website-screenshot"
              className="btn btn-primary"
            >
              Open Website Screenshot
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mt-12">
          <p className="sec-label">Try these tools</p>
          <RelatedTools tools={related} />
          <p className="mt-8 text-sm text-[var(--muted)]">
            Building with code instead? The screenshot endpoint is also
            available over HTTP — see the{" "}
            <Link
              href="/developers"
              className="underline underline-offset-2 font-semibold"
            >
              API quickstart
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
