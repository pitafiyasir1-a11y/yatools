import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("word-to-pdf-converter")!;

export const metadata = pageMeta({
  title: "Word to PDF: Free Ways to Convert DOCX to PDF",
  description:
    "Convert Word to PDF for free with the built-in Export in Word, Google Docs, and your phone — no shady converter sites, no watermark, no sign-up.",
  path: `/blog/${post.slug}`,
  keywords: [
    "word to pdf free",
    "convert docx to pdf",
    "save word as pdf",
    "word to pdf without word",
  ],
});

const faqs = [
  {
    q: "How do I convert Word to PDF without any software?",
    a: "Upload the DOCX to Google Drive, open it with Google Docs, then File → Download → PDF Document (.pdf). No installs, no accounts beyond Google, and it works from any browser on any device.",
  },
  {
    q: "Does exporting from Word to PDF change the formatting?",
    a: "It preserves the layout exactly as you see it in Print Layout view — which is the whole point of PDF. The one common surprise: fonts that aren't embedded may substitute on the recipient's device. Stick to common fonts or embed them (File → Options → Save → Embed fonts) if exact appearance matters.",
  },
  {
    q: "Can I convert a Word file to PDF on my phone?",
    a: "Yes. In the Word mobile app, open the document, tap the three-dot menu, and choose Share or Export → PDF. In the Google Docs app, open the file, tap the three dots, and choose Share & export → Save as → PDF.",
  },
  {
    q: "Will hyperlinks and bookmarks survive the conversion?",
    a: "Hyperlinks survive Word's built-in PDF export and Google Docs' download. Bookmarks created from heading styles survive too, as long as you export with 'Create bookmarks using headings' enabled (it's under Options in the Save As dialog on desktop Word).",
  },
  {
    q: "Why doesn't YATools offer a Word-to-PDF converter?",
    a: "Because the free options built into Word, Google Docs, and every phone are already better than anything we could ship. Rendering DOCX files faithfully requires a full document engine — there is no genuine free in-browser one. A site like ours could only offer you a worse copy of what your apps already do.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function WordToPdfPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd(
          post,
          "Convert Word to PDF for free with the built-in Export in Word, Google Docs, and your phone — no shady converter sites, no watermark, no sign-up."
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
          Office guides
        </p>
        <h1 className="hero-title" style={{ margin: "14px 0", maxWidth: 800 }}>
          Word to PDF: <em>Free</em> Ways to Convert DOCX to PDF
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
            Here&apos;s the good news: unlike the tricky reverse trip (PDF to
            Word, which we cover in{" "}
            <Link href="/blog/pdf-to-word">our PDF→Word guide</Link>),
            converting a Word document <em>to</em> PDF is something your
            software already does perfectly — for free. You don&apos;t need a
            converter site. You almost certainly don&apos;t need to install
            anything.
          </p>

          <h2>Method 1: Word&apos;s built-in export (desktop)</h2>
          <p>
            If you have Microsoft Word installed, this is the gold standard —
            and it takes ten seconds:
          </p>
          <ul>
            <li>
              <strong>File → Export → Create PDF/XPS</strong> — or{" "}
              <strong>File → Save As</strong> and pick PDF from the format
              dropdown. Same result.
            </li>
            <li>
              In the dialog, click <strong>Options</strong>: here you can
              choose whether to include headings as bookmarks, whether to
              export the whole document or just selected pages, and whether
              document properties travel with the file.
            </li>
            <li>
              For a smaller file, pick <strong>Minimum size (publishing
              online)</strong>. For print work, pick <strong>Standard
              (publishing online and printing)</strong>.
            </li>
          </ul>
          <p>
            Word renders the PDF from its own layout engine, so what you see in
            Print Layout view is exactly what you get. Hyperlinks survive.
            Heading bookmarks survive. Nothing is uploaded anywhere.
          </p>

          <h2>Method 2: Google Docs (no Word installed)</h2>
          <p>
            No Microsoft Office? No problem. Upload your .docx file to Google
            Drive (drag it into drive.google.com), open it with Google Docs,
            then <strong>File → Download → PDF Document (.pdf)</strong>.
          </p>
          <p>
            This works on Windows, Mac, Linux, and Chromebooks from any
            browser. One caveat: Docs reflows documents with its own engine, so
            check the downloaded PDF before sending it somewhere important —
            exotic fonts and complex tables can shift slightly.
          </p>

          <h2>Method 3: LibreOffice (free and offline)</h2>
          <p>
            LibreOffice Writer is free, open-source, and opens DOCX files
            natively. Hit the <strong>Export Directly as PDF</strong> button in
            the toolbar (or <strong>File → Export As → Export as PDF</strong>
            for options). It runs entirely offline — your document never
            leaves your machine — and costs nothing, ever.
          </p>

          <h2>Method 4: Your phone</h2>
          <ul>
            <li>
              <strong>Word mobile app:</strong> open the document, tap the
              three-dot menu, choose Export or Share → PDF.
            </li>
            <li>
              <strong>Google Docs app:</strong> open the file, tap the three
              dots, Share &amp; export → Save as → PDF.
            </li>
            <li>
              <strong>iPhone with Pages:</strong> Pages can open DOCX files and
              export them to PDF from the Share menu.
            </li>
          </ul>

          <h2>Why you should skip the converter sites</h2>
          <p>
            Word-to-PDF converter websites rank well in search, but ask
            yourself what they&apos;re adding: they take your document, convert
            it on their server with the same LibreOffice engine you could run
            yourself, and hand it back — sometimes with a watermark, a daily
            limit, or an email gate. Along the way they hold a copy of your
            file. For resumes, contracts, and anything with personal data,
            that&apos;s a bad trade when your own apps do it better and
            privately.
          </p>
          <p>
            We&apos;re honest about this because we don&apos;t offer a
            Word-to-PDF tool — and we won&apos;t fake one. There is no genuine
            free in-browser DOCX rendering engine that matches what Word and
            Docs already do. A button on our site would just be a worse copy
            of the Export menu you already have.
          </p>

          <h2>Building PDFs from scratch instead</h2>
          <p>
            If what you really need is a PDF and you&apos;re starting from
            plain content rather than a finished Word document, skip Word
            entirely:
          </p>
          <ul>
            <li>
              <Link href="/tools/text-to-pdf">Text to PDF</Link> — type or
              paste text and get a clean, formatted PDF in your browser.
            </li>
            <li>
              <Link href="/tools/image-to-pdf">Image to PDF</Link> — turn
              photos or scanned pages into a proper PDF document.
            </li>
          </ul>
          <p>
            And once you have your PDF, <Link href="/tools/merge-pdf">Merge
            PDF</Link> combines multiple PDFs into one file,{" "}
            <Link href="/tools/compress-pdf">Compress PDF</Link> shrinks it for
            email, and <Link href="/tools/pdf-to-jpg">PDF to JPG</Link> turns
            pages into images for slides and posts.
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
            <p className="sec-label">Got your PDF — make it smaller</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Shrink it <em>privately</em>
            </h2>
            <p className="sec-sub">
              Compress PDFs right in your browser before emailing — nothing is uploaded.
            </p>
          </div>
          <Link href="/tools/compress-pdf" className="btn btn-primary">
            Open Compress PDF →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>Word to PDF <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["text-to-pdf", "image-to-pdf", "merge-pdf", "compress-pdf"]} />
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
