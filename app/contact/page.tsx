import Link from "next/link";
import { SITE, pageMeta, breadcrumbJsonLd } from "@/lib/site";
import ContactForm from "./contact-form";

export const metadata = pageMeta({
  title: "Contact Us",
  description:
    "Get in touch with the YATools team — bug reports, tool requests, API questions, or just feedback. We read everything.",
  path: "/contact",
  keywords: ["contact yatools", "yatools support", "report bug", "tool request"],
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
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
            <span className="dot" /> Say hello
          </p>
          <h1 className="hero-title mt-4">
            Contact <em>us</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            Bug reports, tool requests, API questions, or feedback — we read
            everything.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6 mt-10 max-w-5xl">
          <div className="neu-card p-6 md:p-8 md:col-span-3">
            <h2 className="sec-title mb-6">Send a message</h2>
            <ContactForm />
          </div>
          <div className="md:col-span-2">
            <div className="neu-card p-6 md:p-8">
              <p className="sec-label">Email us directly</p>
              <h2 className="font-extrabold text-lg mb-2 break-all">
                {SITE.email}
              </h2>
              <p className="text-[var(--text2)] text-sm leading-7 mb-6">
                Prefer your own mail app? Write to us directly — same inbox,
                no form needed.
              </p>
              <a
                href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                  "Hello YATools"
                )}`}
                className="neu-btn"
              >
                Email us
              </a>
            </div>
            <div className="notice mt-6 text-sm">
              <strong>Tool request?</strong> Tell us what the tool should do
              and who it&apos;s for — the roadmap is driven by real requests.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
