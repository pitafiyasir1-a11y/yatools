import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("how-to-convert-heic-to-jpg-on-windows")!;

export const metadata = pageMeta({
  title: "How to Convert iPhone HEIC to JPG on Windows",
  description:
    "Convert iPhone HEIC to JPG on Windows free: our in-browser converter plus the Windows Photos HEIF extension route. Private, no uploads — step by step.",
  path: `/blog/${post.slug}`,
  keywords: [
    "convert heic to jpg windows",
    "heic to jpg windows 10",
    "heic to jpg windows 11 free",
    "open heic on windows",
  ],
});

const faqs = [
  {
    q: "How do I convert HEIC to JPG on Windows 10 or 11 for free?",
    a: "The fastest free way: open YATools' HEIC to JPG Converter in your browser, drop in the HEIC files, and download JPGs — no install, no upload. Alternatively, install the HEIF Image Extensions from the Microsoft Store to open HEIC in Photos and export as JPG.",
  },
  {
    q: "Why can't Windows open HEIC files by default?",
    a: "HEIC uses the HEVC video codec for compression, and Microsoft doesn't bundle the HEVC/HEIF codecs with Windows due to licensing costs. The free HEIF Image Extensions add HEIC image support; full HEVC video support is a separate paid extension.",
  },
  {
    q: "Can Windows Photos convert HEIC to JPG?",
    a: "Yes, once the HEIF Image Extensions are installed. Open the HEIC photo in Photos, then save or export it as JPG. Without the extension, Photos can't open the file at all.",
  },
  {
    q: "Is it safe to upload HEIC photos to online converters?",
    a: "Only if you're comfortable with a stranger's server holding your photos. For personal pictures, prefer a converter that runs in your browser — the file never leaves your PC — or an offline desktop method.",
  },
  {
    q: "How do I stop my iPhone from creating HEIC files?",
    a: "On the iPhone: Settings → Camera → Formats → Most Compatible. New photos save as JPG. This doesn't convert existing HEIC photos, and transfers via USB or AirDrop to Windows still benefit from a converter for the old files.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function HowToConvertHeicToJpgOnWindowsPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd(
          post,
          "Convert iPhone HEIC to JPG on Windows free: our in-browser converter plus the Windows Photos HEIF extension route. No uploads, step by step."
        )}
      />
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
          How to Convert iPhone HEIC to JPG on Windows
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
            You plugged your iPhone into your Windows PC, copied the photos
            over — and now a chunk of them won&apos;t open. They&apos;re HEIC
            files, and Windows doesn&apos;t understand them out of the box.
            Here&apos;s how to convert iPhone HEIC to JPG on Windows, free,
            with three methods ranked by convenience.
          </p>

          <h2>Why Windows can&apos;t open HEIC files</h2>
          <p>
            HEIC is Apple&apos;s efficient photo format (default on iPhone
            since iOS 11), and it leans on the HEVC codec for compression.
            Microsoft doesn&apos;t bundle the HEVC/HEIF codecs with Windows
            because of licensing costs — so Photos, File Explorer previews,
            and most desktop apps just show a broken icon. It&apos;s not your
            files; it&apos;s a missing codec.
          </p>

          <h2>Method 1: In-browser converter (fastest, no install)</h2>
          <p>
            Open our <Link href="/tools/heic-to-jpg-converter">HEIC to JPG
            Converter</Link> in Edge or Chrome on your Windows PC, drag in
            the HEIC files from File Explorer, and download the JPGs. The
            conversion runs entirely on your machine with the heic2any
            engine — nothing is uploaded, which matters when the photos are
            personal. There&apos;s a quality slider (default 92% is the sweet
            spot), files up to 100MB are fine, and there&apos;s no sign-up or
            watermark.
          </p>
          <p>
            This is the method to reach for on a work computer where you
            can&apos;t install software, or when you just have a handful of
            photos. Need PNG instead of JPG? The{" "}
            <Link href="/tools/heic-to-png-converter">HEIC to PNG Converter</Link> works
            identically.
          </p>

          <h2>Method 2: HEIF Image Extensions + Windows Photos</h2>
          <p>
            If you convert HEIC files regularly, install Microsoft&apos;s{" "}
            <strong>HEIF Image Extensions</strong> from the Microsoft Store
            (free). After installing, Windows Photos opens HEIC files
            natively — you can view them, and export or save-as JPG from
            there. File Explorer even starts showing thumbnails.
          </p>
          <p>
            Two caveats: this adds image support, not HEVC <em>video</em>
            support (that&apos;s a separate, paid extension), and it requires
            admin rights to install from the Store — a non-starter on locked-
            down office PCs, where Method 1 is the answer.
          </p>

          <h2>Method 3: Copy as JPG from the iPhone itself</h2>
          <p>
            You can sidestep conversion at transfer time. When copying via
            USB, iPhones can auto-convert: on the iPhone go to{" "}
            <strong>Settings → Photos → Transfer to Mac or PC → Automatic</strong>.
            With Automatic enabled, HEIC photos transfer as JPG. This
            doesn&apos;t help photos already on your PC, and it slightly
            reduces quality versus converting the originals yourself — but
            for casual snapshots it&apos;s zero effort.
          </p>
          <p>
            For the long term, <strong>Settings → Camera → Formats → Most
            Compatible</strong> makes the iPhone shoot JPG natively. You lose
            HEIC&apos;s storage savings, but you gain universal compatibility.
          </p>

          <h2>Batch-converting a whole folder</h2>
          <p>
            A phone backup can mean hundreds of HEIC files, and converting
            them one by one is miserable. The practical workflow: sort File
            Explorer by type so all .heic files group together, then work
            through them in chunks of 20–30 in the browser converter —
            drag, download, move to a &ldquo;converted&rdquo; folder, repeat.
            It sounds tedious, but a batch of 25 takes about two minutes,
            and the rhythm is fast once you&apos;re going.
          </p>
          <p>
            If you chose Method 2 (HEIF extensions installed), you get a
            nicer option: select multiple HEIC files in Photos and export
            them together. And whatever method you use, keep the original
            HEIC files archived in a separate folder. Storage is cheap;
            re-converting from the original at higher quality later beats
            regretting a deleted original.
          </p>

          <h2>Edge cases: Live Photos, bursts, and videos</h2>
          <p>
            A few iPhone quirks to know about. <strong>Live Photos</strong>{" "}
            are actually a HEIC still plus a short .mov video — converters
            handle the still image; the video half needs separate handling
            (it usually transfers as .mov already). <strong>Burst
            shots</strong> save as a stack where only the picked
            &ldquo;best&rdquo; shot may transfer as HEIC. And{" "}
            <strong>.hevc videos</strong> (.mov files with HEVC compression)
            are a different problem entirely — that&apos;s video conversion,
            not photo conversion, and needs a video tool rather than a HEIC
            converter.
          </p>

          <h2>After converting: tidy up</h2>
          <p>
            Converted JPGs from a modern iPhone are 3–5MB each — fine
            individually, painful in bulk. Before emailing or uploading,
            run them through our{" "}
            <Link href="/tools/image-compressor">Image Compressor</Link> to
            shrink them with no visible quality loss. Converting other odd
            formats along the way? The{" "}
            <Link href="/tools/image-converter">Image Converter</Link> handles
            those, and <Link href="/tools/image-to-pdf">Image to PDF</Link>{" "}
            bundles a set of photos into one clean PDF for sharing or
            printing.
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
            <p className="sec-label">No install needed</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Convert HEIC on <em>Windows</em> now
            </h2>
            <p className="sec-sub">
              Free in-browser converter — works in Edge and Chrome, photos never leave your PC.
            </p>
          </div>
          <Link href="/tools/heic-to-jpg-converter" className="btn btn-primary">
            Open HEIC to JPG →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>HEIC on Windows <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["image-compressor", "image-converter", "image-resizer", "image-to-pdf"]} />
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
