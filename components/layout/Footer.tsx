import Link from "next/link";
import { TOOLS } from "@/lib/site";

const RESOURCES = [
  { label: "Developer API", href: "/developers" },
  { label: "Rate Limits", href: "/developers/rate-limits" },
  { label: "Error Codes", href: "/developers/errors" },
  { label: "Changelog", href: "/developers/changelog" },
  { label: "Guides", href: "/#use-cases" },
  { label: "Urdu Version", href: "/ur" },
];

const LEGAL = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-mono2 mb-4 text-xs font-medium uppercase"
      style={{ color: "#b9b0a0", letterSpacing: "0.08em" }}
    >
      {children}
    </h3>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm no-underline hover:underline"
        style={{ color: "#f2ede1" }}
      >
        {label}
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        background: "#141210",
        color: "#f2ede1",
        borderTop: "3px solid #141210",
      }}
    >
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span
              className="font-display inline-flex h-10 w-10 items-center justify-center rounded-xl text-2xl text-white"
              style={{
                background: "#e0263c",
                border: "2.5px solid #f2ede1",
                transform: "rotate(-4deg)",
                lineHeight: 1,
                paddingTop: "2px",
              }}
            >
              Y
            </span>
            <span className="font-display text-3xl" style={{ lineHeight: 1, paddingTop: "4px" }}>
              YATools
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#b9b0a0" }}>
            A collection of free online tools for screenshots, audio, documents, Urdu
            content, and developers. No signups, no cards — just tools that work.
          </p>
          <p className="mt-3 text-sm" style={{ color: "#b9b0a0" }}>
            Built by Yasir Abbas.
          </p>
        </div>

        <nav aria-label="Tools">
          <FooterHeading>Tools</FooterHeading>
          <ul className="m-0 flex flex-col gap-2.5 p-0" style={{ listStyle: "none" }}>
            {TOOLS.map((t) => (
              <FooterLink key={t.slug} href={`/tools/${t.slug}`} label={t.name} />
            ))}
          </ul>
        </nav>

        <nav aria-label="Resources">
          <FooterHeading>Resources</FooterHeading>
          <ul className="m-0 flex flex-col gap-2.5 p-0" style={{ listStyle: "none" }}>
            {RESOURCES.map((r) => (
              <FooterLink key={r.href + r.label} href={r.href} label={r.label} />
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <FooterHeading>Legal</FooterHeading>
          <ul className="m-0 flex flex-col gap-2.5 p-0" style={{ listStyle: "none" }}>
            {LEGAL.map((c) => (
              <FooterLink key={c.href + c.label} href={c.href} label={c.label} />
            ))}
          </ul>
        </nav>
      </div>

      <div style={{ borderTop: "2px solid #2e2a22" }}>
        <div className="wrap flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="m-0 text-sm" style={{ color: "#b9b0a0" }}>
            &copy; 2026 YATools &middot; Free tools, no strings attached.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm no-underline hover:underline" style={{ color: "#b9b0a0" }}>
              Privacy
            </Link>
            <Link href="/terms" className="text-sm no-underline hover:underline" style={{ color: "#b9b0a0" }}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
