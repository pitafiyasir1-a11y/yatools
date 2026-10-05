import Link from "next/link";

const POPULAR = [
  { label: "Website Screenshot", href: "/tools/website-screenshot" },
  { label: "Text to Speech", href: "/tools/text-to-speech" },
  { label: "AI Image Generator", href: "/tools/ai-image-generator" },
  { label: "QR Code Generator", href: "/tools/qr-code-generator" },
  { label: "Word Counter", href: "/tools/word-counter" },
  { label: "JSON Formatter", href: "/tools/json-formatter" },
];

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[70vh] items-center justify-center pt-24 pb-20">
      <div className="max-w-xl text-center">
        <span className="eyebrow">
          <span className="dot" aria-hidden="true" />
          404 — not found
        </span>
        <h1 className="hero-title mt-5 mb-4">
          That page <em>doesn&rsquo;t exist</em>.
        </h1>
        <p className="mb-8 text-lg leading-relaxed" style={{ color: "var(--text2)" }}>
          The link may be broken, or the page may have moved. Head back home or
          jump straight into one of the popular tools below — they all work.
        </p>
        <div className="mb-8 flex flex-wrap justify-center gap-2.5">
          {POPULAR.map((t) => (
            <Link key={t.href} href={t.href} className="neu-chip no-underline">
              {t.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="neu-btn neu-btn-primary no-underline">
            Back to home
          </Link>
          <Link href="/#tools" className="neu-btn no-underline">
            Browse all tools
          </Link>
        </div>
        <p className="font-mono2 mt-8 text-xs" style={{ color: "var(--muted)" }}>
          If you followed a link from our site that landed here,{" "}
          <Link href="/contact" className="underline" style={{ color: "var(--red-dark)" }}>
            let us know
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
