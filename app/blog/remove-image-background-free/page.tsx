import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("remove-image-background-free")!;

export const metadata = pageMeta({
  title: "How to Remove an Image Background for Free",
  description:
    "Remove an image background for free right in your browser — no uploads, no sign-up. Step-by-step guide plus tips for clean edges and honest limits.",
  path: `/blog/${post.slug}`,
  keywords: [
    "remove image background free",
    "background remover online",
    "transparent background maker",
    "remove bg from photo",
    "cut out image background",
  ],
});

const faqs = [
  {
    q: "Is the background remover really free?",
    a: "Yes — upload a photo, remove the background, and download the transparent PNG without paying or signing up. The AI model runs on your own device, which is exactly why it can be free: there's no server bill per image.",
  },
  {
    q: "Are my photos uploaded anywhere?",
    a: "No. The whole process — the AI model download and the background removal itself — happens in your browser on your device. Your photos never leave your computer or phone, which also makes it safe for private or client images.",
  },
  {
    q: "Why is the first removal slow?",
    a: "The first run downloads the AI model (around 85MB). After that it's cached in your browser, so later removals start much faster. If you're on a slow connection, start it once and let it finish in the background.",
  },
  {
    q: "What images work best?",
    a: "Clear subjects with good contrast against the background: a person against a wall, a product on a table, a pet in daylight. Busy backgrounds, hair and fur edges, and transparent objects like glass are the hardest cases for any background remover.",
  },
  {
    q: "What format should I download?",
    a: "PNG — it's the format that keeps transparency. JPEG doesn't support transparent backgrounds at all, so downloading as JPG would fill the removed area with a solid color and defeat the purpose.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function RemoveBackgroundPost() {
  return (
    <>
      <JsonLd data={articleJsonLd(post, "Remove an image background for free right in your browser — no uploads, no sign-up. Step-by-step guide plus tips for clean edges and honest limits.")} />
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
          How to Remove an Image Background for <em>Free</em>
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
            Product photos on clean backgrounds, profile pictures without the
            messy room behind you, YouTube thumbnails with a cut-out subject —
            background removal used to mean Photoshop skills or a paid app. Now an
            AI model does it in one click, and on YATools it runs entirely on your
            own device.
          </p>

          <h2>Step-by-step: remove a background on YATools</h2>
          <ol>
            <li>
              Open the{" "}
              <Link href="/tools/background-remover">free Background Remover</Link>{" "}
              and upload your photo — JPG, PNG, or WebP, up to about 10MB.
            </li>
            <li>
              Click <strong>Remove background</strong>. On your first ever run, the
              tool downloads the AI model (around 85MB) — this is a one-time wait,
              and it's cached in your browser afterwards.
            </li>
            <li>
              Wait a few seconds while the model separates your subject from the
              background.
            </li>
            <li>
              Preview the result and <strong>download the PNG</strong>. PNG keeps
              the transparency; downloading as JPG would fill the background with
              a solid color.
            </li>
          </ol>
          <p>
            No account, no watermark, and your photo is never uploaded anywhere —
            the AI runs locally in your browser tab.
          </p>

          <h2>Tips for clean edges</h2>
          <p>
            The AI is good, but it isn't magic. These five things separate a crisp
            cut-out from a ragged one:
          </p>
          <ul>
            <li>
              <strong>Contrast is everything.</strong> A dark subject on a light
              background (or vice versa) gives the model a clear boundary to find.
            </li>
            <li>
              <strong>Use good light.</strong> Well-lit, sharp photos cut out far
              better than dark, blurry, or noisy ones.
            </li>
            <li>
              <strong>One clear subject.</strong> A single person, product, or pet
              works best. Crowded group shots confuse the model about what to keep.
            </li>
            <li>
              <strong>Watch the hair and fur.</strong> Fine hair against a busy
              background is the hardest case for every background remover. A
              simpler background behind the head helps enormously.
            </li>
            <li>
              <strong>Start with a decent size.</strong> Tiny thumbnails don't give
              the model enough detail to find precise edges — use the largest
              version of the photo you have (within the ~10MB limit).
            </li>
          </ul>

          <h2>Honest limits (what it can't do well)</h2>
          <ul>
            <li>
              <strong>Transparent and reflective objects.</strong> Glass, water,
              and chrome confuse the model — it can't reliably tell where the
              object ends and the background begins.
            </li>
            <li>
              <strong>Wispy edges.</strong> Flyaway hair, fur, smoke, and lace may
              come out slightly rough. For a perfect result on those, expect minor
              manual touch-ups in an editor.
            </li>
            <li>
              <strong>First run needs patience.</strong> That ~85MB model download
              on a slow connection takes a while. It's once-only, but plan for it.
            </li>
            <li>
              <strong>Big files.</strong> Images over ~10MB need to be shrunk
              first — run them through the{" "}
              <Link href="/tools/image-compressor">Image Compressor</Link> or{" "}
              <Link href="/tools/image-resizer">Image Resizer</Link> and try again.
            </li>
          </ul>

          <h2>When the result isn't perfect: what to try</h2>
          <p>
            If the cut-out comes back rough, don't just re-run the same photo —
            change the input:
          </p>
          <ul>
            <li>
              <strong>Use a larger original.</strong> The model finds cleaner
              edges with more pixels to work with. Phone "optimized" or
              chat-compressed copies are the worst inputs.
            </li>
            <li>
              <strong>Simplify the background and re-shoot</strong> if you can. A
              product photo taken against a plain wall will beat any amount of
              post-processing on a cluttered one.
            </li>
            <li>
              <strong>Crop tight first.</strong> Removing irrelevant background
              area before processing gives the model less to get wrong — and a
              smaller file processes faster.
            </li>
            <li>
              <strong>Touch up the edges.</strong> For hero images, open the PNG
              in any free editor (Photopea, Canva, GIMP) and clean the last few
              rough spots manually. AI gets you 95% of the way in seconds; the
              final 5% is still a human job.
            </li>
          </ul>

          <h2>Background remover vs manual cut-out: which to use</h2>
          <p>
            <strong>Use the AI remover</strong> for people, pets, products, cars —
            anything with a clear outline — and whenever speed matters more than
            pixel-perfection (thumbnails, listings, slides, social posts).
          </p>
          <p>
            <strong>Cut out manually</strong> (pen tool in Photopea or GIMP) when
            the subject is glass, jewelry, smoke, lace, or backlit hair, or when
            the image is going on a billboard-sized print. Manual work is slow but
            has no "hard cases." A good rule: AI first, always — then decide if
            the result is good enough or needs ten minutes of hand cleanup.
          </p>

          <h2>What to do with your cut-out</h2>
          <p>
            A transparent PNG is a building block, not a finished product. Common
            next steps: drop it onto a branded background for a product listing,
            layer it into a thumbnail or poster, or use it as a sticker-style
            profile picture. If the file is too heavy for where it's going, the{" "}
            <Link href="/tools/image-converter">Image Converter</Link> can take
            it to WebP (which keeps transparency at a fraction of PNG's size) —
            just remember WebP transparency needs a viewer that supports it.
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
              Erase a background <em>free</em>
            </h2>
            <p className="sec-sub">
              On-device AI — your photo never leaves your browser. No sign-up, no watermark.
            </p>
          </div>
          <Link href="/tools/background-remover" className="btn btn-primary">
            Open Background Remover →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>Background remover <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["image-compressor", "image-converter", "ai-image-generator"]} />
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
