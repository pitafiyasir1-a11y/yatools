import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("compress-images-without-losing-quality")!;

export const metadata = pageMeta({
  title: "How to Compress Images Without Losing Quality",
  description:
    "Compress images without visible quality loss: the right quality setting, the best format (WebP vs JPG vs PNG), and when to resize first. Free guide.",
  path: `/blog/${post.slug}`,
  keywords: [
    "compress images without losing quality",
    "reduce image size online",
    "image quality vs file size",
    "webp vs jpg",
    "compress jpg png",
  ],
});

const faqs = [
  {
    q: "What quality setting should I use when compressing?",
    a: "For photos, 70–85% quality in JPEG or WebP is the sweet spot: files get dramatically smaller with no difference you can see on a screen. Below about 50% you'll start noticing blocky artifacts around edges and text.",
  },
  {
    q: "Which format gives the smallest file: JPG, PNG, or WebP?",
    a: "For photos, WebP is usually smallest — roughly 25–35% smaller than an equivalent-quality JPEG. PNG is lossless, so it's best when you need perfect quality or transparency, but its files are much bigger. Use WebP for the web, JPEG for maximum compatibility, PNG for graphics and transparency.",
  },
  {
    q: "Will compressing an image twice make it worse?",
    a: "Yes — every lossy save throws away a little more detail, so quality degrades a bit each round. Always compress from the original file when you can, not from an already-compressed copy.",
  },
  {
    q: "Why did my compressed file get bigger?",
    a: "It happens when you force an already-optimized image into a less efficient format at high quality — for example, a tiny PNG saved as 100% JPEG. The honest fix is to check the before/after sizes (the YATools compressor shows them) and pick the smaller result.",
  },
  {
    q: "Do social media apps compress my photos anyway?",
    a: "Yes — WhatsApp, Instagram, and Facebook all recompress uploads. That's actually a reason to compress first: starting from a sensible size avoids double-compression artifacts and uploads much faster on slow connections.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function CompressImagesPost() {
  return (
    <>
      <JsonLd data={articleJsonLd(post, "Compress images without visible quality loss: the right quality setting, the best format (WebP vs JPG vs PNG), and when to resize first. Free guide.")} />
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
          Image guides
        </p>
        <h1 className="hero-title" style={{ margin: "14px 0", maxWidth: 800 }}>
          How to Compress Images Without <em>Losing Quality</em>
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
            A 4MB phone photo and a 300KB version of the same photo can look
            identical on a screen. The difference is just data your eyes can't see —
            and compression is the art of throwing away exactly that data. Here's
            how to do it properly, in about two minutes.
          </p>

          <h2>First: what "without losing quality" actually means</h2>
          <p>
            There are two kinds of compression. <strong>Lossless</strong> (PNG)
            keeps every pixel perfect but only shrinks files a little.{" "}
            <strong>Lossy</strong> (JPEG, WebP) discards fine detail your eyes
            barely notice, and can shrink a photo to a tenth of its size.
          </p>
          <p>
            "Without losing quality" really means <em>without losing visible
            quality</em>. Up to a point — around 70–85% quality for photos —
            nobody can tell the difference. Past that point, you get blocky
            artifacts, smeared textures, and halos around text. The skill is
            stopping before that line.
          </p>

          <h2>Step-by-step: compress an image on YATools</h2>
          <ol>
            <li>
              Open the{" "}
              <Link href="/tools/image-compressor">free Image Compressor</Link>{" "}
              and upload your JPG, PNG, WebP, or GIF. It never leaves your device —
              compression runs entirely in your browser.
            </li>
            <li>
              <strong>Set the quality slider to 80%</strong> as a starting point.
              Watch the before/after sizes and the percentage saved update live.
            </li>
            <li>
              <strong>Pick the output format.</strong> For photos, switch to WebP —
              it's typically 25–35% smaller than JPEG at the same visible quality.
              Keep PNG only if you need transparency or pixel-perfect graphics.
            </li>
            <li>
              Zoom into the preview: check faces, text, and sharp edges. If it
              looks clean, download. If you see artifacts, nudge quality up a bit.
            </li>
          </ol>

          <h2>The format matters more than the slider</h2>
          <p>
            Most people obsess over the quality number and ignore the format, but
            the format choice often saves more bytes:
          </p>
          <ul>
            <li>
              <strong>Photos → WebP or JPEG.</strong> WebP wins on size; JPEG wins
              on compatibility (older software, email clients).
            </li>
            <li>
              <strong>Logos, screenshots, graphics with text → PNG.</strong>{" "}
              Lossy formats smear sharp edges and text. If the PNG is still too
              big, reduce its dimensions first instead.
            </li>
            <li>
              <strong>Need transparency → PNG or WebP.</strong> JPEG can't do
              transparency at all — your transparent areas turn into a solid color.
            </li>
          </ul>
          <p>
            Switching between formats takes seconds with the{" "}
            <Link href="/tools/image-converter">Image Converter</Link> — try the
            same photo as JPEG, WebP, and PNG and compare the real file sizes.
          </p>

          <h2>Resize before you compress</h2>
          <p>
            A 4000-pixel-wide photo displayed at 800 pixels wide is carrying five
            times more pixels than anyone will ever see. Shrinking the dimensions
            first is the single biggest file-size win there is — often bigger than
            any quality setting.
          </p>
          <p>
            Rule of thumb: resize to the largest size the image will actually be
            shown at (800–1600px wide covers most web use), <em>then</em> compress.
            Use the <Link href="/tools/image-resizer">Image Resizer</Link> with the
            aspect-ratio lock on so nothing gets stretched.
          </p>

          <h2>When NOT to compress</h2>
          <ul>
            <li>
              <strong>Images headed for print.</strong> Print needs far more detail
              than screens — keep the original.
            </li>
            <li>
              <strong>Your only copy of a precious photo.</strong> Compress a copy,
              archive the original. Storage is cheap; memories aren't.
            </li>
            <li>
              <strong>Already-tiny files.</strong> Squeezing a 40KB thumbnail saves
              almost nothing and can visibly hurt it.
            </li>
            <li>
              <strong>Images with transparency you need to keep.</strong> Converting
              to JPEG silently kills the alpha channel.
            </li>
          </ul>

          <h2>Quality settings for common uses (cheat sheet)</h2>
          <p>
            Stop guessing — start from these and adjust by eye:
          </p>
          <ul>
            <li>
              <strong>Website hero / blog images:</strong> WebP at 75–80%. Big
              savings, flawless on screen.
            </li>
            <li>
              <strong>Thumbnails and avatars:</strong> JPEG or WebP at 65–75%.
              Small display size hides a lot.
            </li>
            <li>
              <strong>Email attachments and forms:</strong> JPEG at 70–80% for
              maximum compatibility with old systems.
            </li>
            <li>
              <strong>Images with text (screenshots, slides):</strong> PNG, or
              WebP at 85%+ — text shows artifacts first.
            </li>
            <li>
              <strong>Anything you'll edit again later:</strong> don't compress
              the working copy at all. Compress only the exported final.
            </li>
          </ul>

          <h2>Compressing images on your phone</h2>
          <p>
            Phone photos are the biggest offenders — a single shot can be 5–12MB.
            The YATools compressor works fine in a mobile browser: open it, upload
            from your camera roll, pick WebP at 80%, and download. Two minutes,
            and a photo that wouldn't send over email becomes a few hundred KB.
          </p>
          <p>
            One phone-specific tip: screenshots of chats and apps compress
            beautifully as PNG if you resize them to their display width first —
            a 1170px-wide iPhone screenshot shown at 400px wide is carrying three
            times the pixels it needs.
          </p>

          <h2>A quick workflow that works every time</h2>
          <p>
            For a photo going on a website, a form, or an email:{" "}
            <strong>resize</strong> to the display size → <strong>convert</strong>{" "}
            to WebP (or JPEG for compatibility) → <strong>compress</strong> at
            75–85% → check the preview → download. Thirty seconds, and a 4MB photo
            becomes a 200–300KB file nobody can tell apart from the original.
          </p>
        </article>

        <div
          className="card"
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
              Shrink your images <em>right now</em>
            </h2>
            <p className="sec-sub">
              Free compressor with a live quality slider and before/after sizes — 100% in your browser.
            </p>
          </div>
          <Link href="/tools/image-compressor" className="btn btn-primary">
            Open Image Compressor →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>Image compression <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["image-converter", "image-resizer", "background-remover"]} />
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="More guides" title={<>Keep <em>reading</em></>} />
        <div className="tool-grid">
          {morePosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card card-hover"
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
