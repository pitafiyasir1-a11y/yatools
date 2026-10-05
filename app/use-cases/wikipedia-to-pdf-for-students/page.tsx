import Link from "next/link";
import {
  pageMeta,
  breadcrumbJsonLd,
  faqJsonLd,
  toolBySlug,
  type ToolDef,
} from "@/lib/site";

export const metadata = pageMeta({
  title: "Wikipedia to PDF for Students",
  description:
    "Build offline study packs by converting Wikipedia articles into clean, printable PDFs — plus how to pick good articles and share them properly.",
  path: "/use-cases/wikipedia-to-pdf-for-students",
  keywords: [
    "wikipedia to pdf for studying",
    "offline study material",
    "wikipedia article download",
    "study pack pdf",
  ],
});

const crumbs = [
  { name: "Home", path: "/" },
  {
    name: "Wikipedia to PDF for Students",
    path: "/use-cases/wikipedia-to-pdf-for-students",
  },
];

const faqs = [
  {
    q: "Is the PDF text selectable?",
    a: "Yes. You get real, selectable text — not a flat image — so you can search within the document, copy quotes, and highlight on any PDF reader.",
  },
  {
    q: "Are images, formatting, and links included?",
    a: "The article is converted with clean formatting and working links so you can follow references later. It is laid out for comfortable reading and printing.",
  },
  {
    q: "Can I share the PDFs with classmates?",
    a: "Yes. Wikipedia content is published under the CC BY-SA license, which allows sharing as long as you give attribution — include the article title, a link to the original, and a note that it is CC BY-SA licensed.",
  },
  {
    q: "Which languages work?",
    a: "Any Wikipedia language edition, including Urdu Wikipedia. Just paste the article URL from whichever edition you want.",
  },
];

const related: ToolDef[] = ["wikipedia-to-pdf", "urdu-handwriting"]
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
    <div className="neu-card px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
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
          className="neu-card neu-card-hover flex flex-col gap-3 p-5 no-underline"
        >
          <div className="flex items-center justify-between">
            <span className={`neu-badge neu-badge-${t.badgeColor}`}>
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
            <span className="dot" /> Use case · Students
          </p>
          <h1 className="hero-title mt-4">
            Wikipedia to PDF for <em>students</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            Load-shedding, hostel Wi-Fi, long commutes — studying
            shouldn&apos;t depend on a live connection. Build an offline study
            pack instead.
          </p>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <p>
            Wikipedia is the starting point for half of all student research,
            and it has one weakness: it needs the internet. Between
            load-shedding, unreliable hostel Wi-Fi, and data limits, a page you
            could open last night might not load during tomorrow&apos;s study
            session. Converting articles to clean PDFs fixes that permanently —
            download once, read anywhere, on any device, forever.
          </p>

          <h2>Build your study pack in 3 steps</h2>
          <h3>1. Pick your articles deliberately</h3>
          <p>
            Start from your syllabus, not from random browsing: one article per
            topic, plus the key biographies, events, or concepts your course
            keeps referencing. Skim the references section before committing —
            an article with solid citations is worth ten without.
          </p>
          <h3>2. Convert with the Wikipedia to PDF tool</h3>
          <p>
            Paste each article URL into the{" "}
            <Link href="/tools/wikipedia-to-pdf">Wikipedia to PDF</Link> tool
            and download the PDF. The output is formatted for reading — proper
            headings, clean text, working links — not a raw browser printout
            with ads and sidebars.
          </p>
          <h3>3. Organize by subject</h3>
          <p>
            Save PDFs into folders by subject and rename files clearly, e.g.{" "}
            <span className="font-mono2 text-sm">
              physics-thermodynamics.pdf
            </span>
            . A study pack you can&apos;t find things in is just a pile of
            files — spend the five minutes organizing and future-you will be
            grateful during exam week.
          </p>

          <h2>Study smarter with your pack</h2>
          <ul>
            <li>
              <strong>Read offline and highlight.</strong> Any PDF reader lets
              you highlight and annotate — your notes live on the article
              itself instead of scattered across notebooks.
            </li>
            <li>
              <strong>Pair reading with writing.</strong> After each article,
              summarize it in your own words. The{" "}
              <Link href="/tools/urdu-handwriting">Urdu Handwriting</Link> tool
              can turn typed summaries into neat handwritten-style notes if
              that format helps you revise.
            </li>
            <li>
              <strong>Print selectively.</strong> Don&apos;t print everything —
              print the two or three articles you keep reopening. Paper is for
              the hard stuff.
            </li>
            <li>
              <strong>Refresh before exams.</strong> Wikipedia changes; an
              article you saved in October might be better by March.
              Re-download your core topics a week before exams.
            </li>
          </ul>

          <h2>Use good sources — and give credit</h2>
          <p>
            Not every Wikipedia article is equal. Before adding one to your
            pack, check the references section and watch for
            &ldquo;citation needed&rdquo; flags — heavily cited articles are
            far more trustworthy. And when you share your pack with classmates
            (which you should), include attribution: Wikipedia content is
            published under the <strong>CC BY-SA</strong> license, so add the
            article title, a link to the original, and a note that it&apos;s CC
            BY-SA licensed. It takes ten seconds and it&apos;s the right thing
            to do.
          </p>

          <h2>Frequently asked questions</h2>
        </div>

        <div className="max-w-3xl mt-2">
          <FaqList items={faqs} />
        </div>

        <div className="max-w-3xl mt-10">
          <div className="neu-card p-6 md:p-8">
            <h2 className="sec-title">Start your study pack today</h2>
            <p className="sec-sub mb-6">
              Paste a Wikipedia URL, download a clean PDF. Free, no sign-up.
            </p>
            <Link
              href="/tools/wikipedia-to-pdf"
              className="neu-btn neu-btn-primary"
            >
              Open Wikipedia to PDF
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mt-12">
          <p className="sec-label">Try these tools</p>
          <RelatedTools tools={related} />
        </div>
      </div>
    </>
  );
}
