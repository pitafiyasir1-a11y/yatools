import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("qr-code-with-logo")!;

export const metadata = pageMeta({
  title: "How to Make a QR Code With Your Logo (Free)",
  description:
    "Make a QR code with your logo for free: generate a high-error-correction QR, add your logo the right way, and test it. Simple 3-step guide.",
  path: `/blog/${post.slug}`,
  keywords: [
    "qr code with logo",
    "custom qr code free",
    "qr code generator with logo",
    "branded qr code",
    "qr code error correction",
  ],
});

const faqs = [
  {
    q: "Will a QR code with a logo still scan?",
    a: "Yes — if you do it right. QR codes include built-in error correction that can recover up to 30% of damaged or covered data at the High setting. A small centered logo sits well within that budget, so scanners read the code normally.",
  },
  {
    q: "How big can the logo be?",
    a: "Keep it to about 20–30% of the QR code's width at most, and always leave a white margin (quiet zone) around the logo itself. Bigger logos eat into the error-correction budget and start causing failed scans, especially in poor light.",
  },
  {
    q: "Do I need a special QR generator for logos?",
    a: "No. Any generator that lets you pick High error correction works — generate the code, then place your logo over the center in any image editor. The generator doesn't need a logo feature; error correction does the heavy lifting.",
  },
  {
    q: "Can I put a logo on a Wi-Fi QR code too?",
    a: "Absolutely. The logo technique works the same whatever the QR contains — a link, Wi-Fi credentials, contact details. Just remember that Wi-Fi codes with long passwords create denser QR patterns, so keep the logo on the smaller side.",
  },
  {
    q: "Why does my logo QR code fail to scan?",
    a: "The usual suspects: the logo is too big, the code was generated at Low error correction, the logo has no white padding around it, or the printed code is too small/blurry. Regenerate at High correction, shrink the logo, and test before you print a thousand flyers.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function QrCodeLogoPost() {
  return (
    <>
      <JsonLd data={articleJsonLd(post, "Make a QR code with your logo for free: generate a high-error-correction QR, add your logo the right way, and test it. Simple 3-step guide.")} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />

        <p className="eyebrow">
          <span className="dot" aria-hidden="true" />
          QR code guides
        </p>
        <h1 className="hero-title" style={{ margin: "14px 0", maxWidth: 800 }}>
          How to Make a QR Code With Your <em>Logo</em> (Free)
        </h1>
        <p
          className="font-mono2"
          style={{
            fontSize: "0.75rem",
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 18,
          }}
        >
          {post.dateLabel} · {post.readTime} · YATools
        </p>
        <p className="sec-sub" style={{ fontSize: "1.08rem", maxWidth: 720 }}>
          {post.excerpt}
        </p>

        <article className="prose-neu" style={{ maxWidth: 760, marginTop: 32 }}>
          <p>
            You've seen them on coffee cups, business cards, and restaurant tables:
            QR codes with a brand logo sitting right in the middle — and they scan
            perfectly. It looks like magic, but it's just clever engineering. Here's
            how to make your own, free, in three steps.
          </p>

          <h2>Why a logo in the middle doesn't break the QR code</h2>
          <p>
            Every QR code carries <strong>error correction</strong> — redundant data
            that lets scanners reconstruct the code even when part of it is
            damaged, dirty, or covered up. At the <strong>High</strong> setting, up
            to 30% of the code can be obscured and it will still scan.
          </p>
          <p>
            A small centered logo covers far less than 30%, so the scanner simply
            reads around it. That's the entire trick: generate the QR at High error
            correction, and the logo becomes harmless decoration.
          </p>

          <h2>Step 1: Generate the QR code at High error correction</h2>
          <ol>
            <li>
              Open the{" "}
              <Link href="/tools/qr-code-generator">free QR Code Generator</Link>{" "}
              and enter your content — a link, text, Wi-Fi credentials, email, or
              phone number.
            </li>
            <li>
              <strong>Set error correction to High (30%).</strong> This is the one
              setting that matters for a logo QR. Lower settings leave no safety
              margin for the covered area.
            </li>
            <li>
              <strong>Keep the content short.</strong> A short URL makes a cleaner,
              less dense QR pattern with bigger modules — much more forgiving of a
              logo than a dense, tiny-patterned code. Use a short link if you can.
            </li>
            <li>Download the QR code image.</li>
          </ol>

          <h2>Step 2: Place your logo in the center</h2>
          <p>
            Open the QR image in any image editor — Canva, Photopea, PowerPoint, or
            even your phone's markup tool — and drop your logo in the middle:
          </p>
          <ul>
            <li>
              <strong>Size:</strong> keep the logo to about 20–30% of the QR
              code's width. Smaller is safer.
            </li>
            <li>
              <strong>Padding:</strong> give the logo a white background or white
              margin. Scanners need contrast around the logo edges; a logo floating
              directly on the black-and-white pattern confuses them.
            </li>
            <li>
              <strong>Shape:</strong> square or circular logos work best. Avoid
              wide banners that stretch across the code.
            </li>
            <li>
              <strong>Don't cover the corners.</strong> The three big squares in
              the corners are positioning markers — scanners need those untouched.
              A centered logo naturally avoids them.
            </li>
          </ul>

          <h2>Step 3: Test the scan before you use it</h2>
          <p>
            This step is non-negotiable. Scan the finished code with at least two
            different phones — an iPhone camera and an Android camera is a good
            pair — in normal room light, not just bright desk light.
          </p>
          <p>
            You can verify it reads correctly with the{" "}
            <Link href="/tools/qr-scanner">free QR Scanner</Link>: point it at
            your code and confirm it decodes to exactly the right link or text. If
            it struggles, shrink the logo or regenerate the code at High
            correction — don't ship a code that only scans "sometimes."
          </p>

          <h2>Common mistakes that break logo QR codes</h2>
          <ul>
            <li>
              <strong>Low error correction.</strong> The #1 cause of failures. If
              your generator doesn't offer a correction setting, assume it's too
              low for a logo.
            </li>
            <li>
              <strong>Logo too large.</strong> Covering 40–50% of the code blows
              past even High correction's 30% budget.
            </li>
            <li>
              <strong>No quiet zone.</strong> QR codes need a clear margin around
              the outside edge too — don't crop the code tight or let design
              elements touch its border.
            </li>
            <li>
              <strong>Printing too small.</strong> A logo QR on a business card
              should be at least 2 × 2 cm; smaller than that, phone cameras can't
              resolve the pattern reliably.
            </li>
            <li>
              <strong>Inverted colors.</strong> Light modules on a dark background
              scan poorly on many phones. Keep the classic dark-on-light look for
              anything important.
            </li>
          </ul>

          <h2>Static vs dynamic QR codes (pick the right kind)</h2>
          <p>
            One thing to know before you print: the QR codes from free generators
            like YATools are <strong>static</strong> — the link is baked into the
            pattern forever. If the URL changes or breaks, the printed code is
            dead and you reprint.
          </p>
          <p>
            <strong>Dynamic</strong> QR codes (paid services) point to a redirect
            you can edit later, and they track scan counts. For a menu, business
            card, or flyer that might outlive its URL, consider whether you need
            that flexibility <em>before</em> you print a thousand copies. For
            anything short-lived or permanent (your homepage, a Wi-Fi password),
            static is free and perfectly fine.
          </p>

          <h2>Design tips for printed QR codes</h2>
          <ul>
            <li>
              <strong>Size:</strong> at least 2 × 2 cm on business cards, bigger
              on posters — a code people can't comfortably frame with a phone
              camera won't get scanned.
            </li>
            <li>
              <strong>Contrast:</strong> dark code on a light background. Avoid
              placing the code over busy photos or gradients.
            </li>
            <li>
              <strong>Quiet zone:</strong> leave a clean margin around the whole
              code at least as wide as one of the corner squares. Don't let text
              or design elements touch its edges.
            </li>
            <li>
              <strong>Test the final print,</strong> not just the screen version.
              Ink spread on cheap paper and glare on glossy stock both make codes
              harder to read — scan a real printed copy before the full run.
            </li>
          </ul>

          <h2>Where logo QR codes actually help</h2>
          <p>
            A branded QR code earns its keep anywhere the code itself is part of
            the design: menus, packaging, event posters, business cards, and
            storefront windows. For purely functional uses — a Wi-Fi password on
            the fridge, an internal inventory label — skip the logo and keep the
            plain code: it scans faster and there's nothing to go wrong.
          </p>
        </article>

        <div
          className="neu-card"
          style={{
            marginTop: 36,
            padding: "clamp(20px, 4vw, 32px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: 760,
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <p className="sec-label">Try it now</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Generate your QR code <em>free</em>
            </h2>
            <p className="sec-sub">
              Links, text, Wi-Fi, email & more — with High error correction for logo overlays.
            </p>
          </div>
          <Link href="/tools/qr-code-generator" className="neu-btn neu-btn-primary">
            Open QR Generator →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>QR code <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["qr-code-generator", "password-generator", "color-picker"]} />
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="More guides" title={<>Keep <em>reading</em></>} />
        <div className="tool-grid">
          {morePosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="neu-card neu-card-hover"
              style={{ padding: 22, display: "block", textDecoration: "none", color: "inherit" }}
            >
              <div className="font-display" style={{ fontSize: "1.3rem", marginBottom: 8 }}>
                {p.title}
              </div>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 12 }}>
                {p.excerpt}
              </p>
              <span className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--red-dark)", fontWeight: 600 }}>
                {p.readTime} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
