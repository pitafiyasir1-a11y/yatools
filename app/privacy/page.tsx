import Link from "next/link";
import { SITE, pageMeta, breadcrumbJsonLd } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "What YATools collects (nothing account-based), how uploads are handled, and the cookieless analytics we use. Plain language, no legal fog.",
  path: "/privacy",
  keywords: ["yatools privacy", "privacy policy", "data collection"],
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
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
            <span className="dot" /> Legal
          </p>
          <h1 className="hero-title mt-4">
            Privacy <em>policy</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            Plain language, no legal fog. Last updated: 2026-10-05.
          </p>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <h2>What we collect</h2>
          <p>
            Almost nothing. YATools has <strong>no accounts</strong>, so there
            is nothing account-based to collect — no names, no passwords, no
            profiles. You open a tool, you use it, you leave.
          </p>

          <h2>Uploads and processing</h2>
          <p>
            Tools like Audio to Text or Website Screenshot need to process your
            input on a server. When you use them, your upload is proxied to our
            own secure processing infrastructure for{" "}
            <strong>real-time processing only</strong> and is{" "}
            <strong>not stored by us</strong> afterwards. We don&apos;t keep
            copies of your audio, URLs, or generated files on our servers.
          </p>
          <p>
            The six client-side tools (QR codes, word counting, JSON
            formatting, passwords, case conversion, color picking) never send
            anything anywhere — everything happens in your browser.
          </p>

          <h2>IP addresses and rate limiting</h2>
          <p>
            To keep the free API tools usable for everyone, we count requests
            per tool per IP address to enforce{" "}
            <Link href="/developers/rate-limits">daily fair-use quotas</Link>.
            IP addresses are used <strong>only for rate limiting</strong> —
            nothing else. They are never tied to an identity, never shared,
            never sold, and the counters are discarded as days roll over.
          </p>

          <h2>Analytics</h2>
          <p>
            We don&apos;t currently run any analytics service on YATools —
            no cookies, no trackers, no fingerprinting. If we ever add
            privacy-friendly analytics in the future, this page will be
            updated first.
          </p>

          <h2>Local storage</h2>
          <p>
            Your theme preference (light/dark) is saved in your browser&apos;s
            localStorage so the site remembers it. That&apos;s it — nothing
            else is stored on your device by us.
          </p>

          <h2>Contacting us</h2>
          <p>
            If you email us at{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, we&apos;ll use
            your address only to reply. We don&apos;t add you to any list —
            there is no list.
          </p>

          <h2>Changes</h2>
          <p>
            If this policy changes in a meaningful way, we&apos;ll update the
            date at the top of this page. Questions?{" "}
            <Link href="/contact">Contact us</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
