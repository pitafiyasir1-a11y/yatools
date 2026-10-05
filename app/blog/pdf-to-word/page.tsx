import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("pdf-to-word-converter")!;

export const metadata = pageMeta({
  title: "PDF to Word: Convert PDF to Editable Word Documents Free",
  description:
    "Convert PDF to editable Word documents for free: Google Docs, Word, and LibreOffice — plus why true PDF→Word is harder than it looks, and what to watch for.",
  path: `/blog/${post.slug}`,
  keywords: [
    "pdf to word free",
    "convert pdf to editable word",
    "pdf to docx free online",
    "pdf to word without losing formatting",
  ],
});

const faqs = [
  {
    q: "Is there a completely free PDF to Word converter?",
    a: "Yes: upload the PDF to Google Drive, open it with Google Docs, and download it as DOCX. It's free, has no page limits, and Google's reconstruction is among the best available. Desktop Microsoft Word and LibreOffice are also free-to-you options with no per-file cost.",
  },
  {
    q: "Will my formatting survive the conversion?",
    a: "Mostly, if the PDF is simple — single column, standard fonts, clear headings. Complex layouts (multi-column, tables nested in text boxes, unusual fonts) often come through with shifted columns or reflowed text. Expect to spend a few minutes cleaning up any document that matters.",
  },
  {
    q: "Can I convert a scanned PDF (a photo of pages) to Word?",
    a: "Not directly — a scanned PDF is an image, and converters need to run OCR (optical character recognition) on it first. If you have a scanner app or phone camera, scan the pages to text first, or use an OCR tool to extract the text before converting it into a Word document.",
  },
  {
    q: "Is it safe to upload my PDF to a free converter website?",
    a: "Not for anything sensitive. You're handing your complete document — contracts, resumes, invoices — to a stranger's server. For private documents, prefer tools that run on your own machine: desktop Word, LibreOffice, or Google's converter inside your own account.",
  },
  {
    q: "Why doesn't YATools have a PDF to Word tool?",
    a: "Because there's no genuine free client-side engine that does it well. Real PDF→Word conversion means reconstructing flowing paragraphs from fixed-position text fragments — server farms handle it, and free sites handle it by keeping your file. We'd rather point you at the honest options than ship a fake converter.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function PdfToWordPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd(
          post,
          "Convert PDF to editable Word documents for free: Google Docs, Word, and LibreOffice — plus why true PDF→Word is harder than it looks."
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
          PDF guides
        </p>
        <h1 className="hero-title" style={{ margin: "14px 0", maxWidth: 800 }}>
          PDF to Word: How to Convert PDFs to <em>Editable</em> Documents
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
            You&apos;ve got a PDF and you need to edit it — fix a typo, reuse
            the content, change the numbers. Every search result promises a
            &ldquo;free PDF to Word converter,&rdquo; but a surprising number of
            them produce mangled text, demand your email before downloading, or
            silently keep a copy of your file. Here&apos;s the honest rundown:
            what actually works, what it costs your formatting, and which free
            paths we recommend.
          </p>

          <h2>Why real PDF→Word is harder than it sounds</h2>
          <p>
            A Word document and a PDF store text in fundamentally different
            ways. Word keeps flowing paragraphs with styles; a PDF keeps
            individual characters placed at exact coordinates on a page. It
            doesn&apos;t know what a paragraph <em>is</em> — it just knows
            where each glyph sits.
          </p>
          <p>
            A real converter has to reverse-engineer that: guess which lines
            form paragraphs, which bold text is a heading, which blocks are a
            table, which columns are separate. Simple documents survive this
            well. Newsletters with floating text boxes, multi-column layouts,
            and embedded tables don&apos;t — that&apos;s why conversions
            sometimes come out with text in the wrong order or columns mashed
            together.
          </p>
          <p>
            This is also why there&apos;s no genuine free client-side
            (in-browser) engine for it. Good reconstruction is heavy,
            server-side work. That&apos;s why we don&apos;t offer a fake
            &ldquo;PDF to Word&rdquo; button here — anything we could run in
            your browser would just extract raw text lines and call it a
            conversion.
          </p>

          <h2>Method 1: Google Docs (best genuinely free option)</h2>
          <p>
            Upload the PDF to Google Drive, right-click it, and choose{" "}
            <strong>Open with → Google Docs</strong>. Google converts the file
            into an editable document — then go to{" "}
            <strong>File → Download → Microsoft Word (.docx)</strong>. That&apos;s
            it: no sign-up beyond the Google account you already have, no page
            limits, and Google&apos;s layout reconstruction is among the best
            free options available.
          </p>
          <p>
            Two tips: it works best on text-based PDFs (not scans), and
            downloading as DOCX sometimes preserves layout better than editing
            directly in Docs, because Docs reflows everything for the web.
          </p>

          <h2>Method 2: Microsoft Word&apos;s built-in converter</h2>
          <p>
            Desktop Word (the full app, not the web version) can open a PDF
            directly: <strong>File → Open</strong>, select your PDF, and Word
            converts it into an editable document with a warning that the
            layout might change. For documents with standard fonts and simple
            layouts, Word&apos;s converter is surprisingly faithful — and since
            it runs entirely on your machine, your file never leaves your
            computer.
          </p>
          <p>
            The catch: you need a Word license or the Microsoft 365 trial. If
            you already have it installed, this is the private, zero-upload
            option.
          </p>

          <h2>Method 3: LibreOffice (free, offline, private)</h2>
          <p>
            LibreOffice Writer — free, open-source, no account — opens PDFs and
            converts them for editing. It&apos;s not quite as polished as
            Word&apos;s converter on complex layouts, but it runs entirely
            offline and costs nothing forever. Download it once from
            libreoffice.org, open the PDF in Writer, and save as DOCX.
          </p>
          <p>
            This is the option we point privacy-conscious readers at: nothing
            is uploaded anywhere, ever.
          </p>

          <h2>Scanned PDFs need OCR first</h2>
          <p>
            If your PDF is just photos of pages — a phone scan, a fax, an old
            archive — converters see an image, not text. Running any converter
            on it will produce an empty or garbage Word file. You need OCR
            first: extract the text from the image, then build your Word
            document from that text.
          </p>
          <p>
            If you&apos;ve got a screenshot or photo of the page, our{" "}
            <Link href="/tools/image-to-text">Image to Text</Link> tool pulls
            the text out right in your browser — then paste it into a fresh
            document.
          </p>

          <h2>Before converting: clean up the PDF</h2>
          <p>
            Converters handle lean, well-organized PDFs far better than bloated
            ones. If your file has extra pages, scanned covers, or is hundreds
            of megabytes from embedded images, trim it first — all in your
            browser, nothing uploaded:
          </p>
          <ul>
            <li>
              <Link href="/tools/split-pdf">Split PDF</Link> — pull out only the
              pages you actually need converted.
            </li>
            <li>
              <Link href="/tools/compress-pdf">Compress PDF</Link> — shrink
              bloated files so converters process them faster and more
              reliably.
            </li>
            <li>
              <Link href="/tools/merge-pdf">Merge PDF</Link> — combine several
              source PDFs before converting them in one pass.
            </li>
          </ul>

          <h2>A word about &ldquo;free&rdquo; converter sites</h2>
          <p>
            Many top-ranking converter sites are free the way a timeshare
            seminar is free: the first file converts fine, then you hit a daily
            limit, a watermark, or an email gate. Worse, your document sits on
            their server — resumes, contracts, medical forms — with retention
            policies you&apos;ll never read. For anything sensitive, use the
            offline methods above. And if a site won&apos;t tell you how it
            makes money, you&apos;re the product.
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
            <p className="sec-label">Converted your doc — need a PDF instead?</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Make PDFs <em>from scratch</em>
            </h2>
            <p className="sec-sub">
              Our Text to PDF tool builds clean PDFs right in your browser — no upload, no sign-up.
            </p>
          </div>
          <Link href="/tools/text-to-pdf" className="btn btn-primary">
            Open Text to PDF →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>PDF to Word <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["merge-pdf", "split-pdf", "compress-pdf", "text-to-pdf"]} />
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
