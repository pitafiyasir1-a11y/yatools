import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("pdf-to-excel")!;

export const metadata = pageMeta({
  title: "PDF to Excel: Extract Tables from PDFs Free",
  description:
    "Extract tables from PDFs into Excel for free: Google Sheets import, LibreOffice, and Tabula explained — plus why table extraction is hard. Read the guide.",
  path: `/blog/${post.slug}`,
  keywords: [
    "pdf to excel free",
    "extract tables from pdf",
    "convert pdf table to excel",
    "pdf to xlsx free online",
  ],
});

const faqs = [
  {
    q: "Is there a truly free PDF to Excel converter?",
    a: "Yes — several. Google Sheets (open the PDF via Drive), LibreOffice Calc (free desktop app), and Tabula (a free desktop tool built specifically for table extraction) all convert PDF tables to spreadsheets without charging per file. Which one works best depends on how clean the PDF's tables are.",
  },
  {
    q: "Will the numbers land in the right cells?",
    a: "Often, but not always. Clean tables with clear rows and columns convert well. Merged cells, wrapped text, multi-line cells, and columns that visually align but have no borders confuse converters — expect to re-check and realign cells after importing any table.",
  },
  {
    q: "Can I convert a scanned PDF (a photo of a table) to Excel?",
    a: "Not directly — a scan is an image with no text for a converter to read. You need OCR first: turn the image into text, then rebuild the table. Our Image to Text tool extracts text from images in your browser, which you can then paste into a spreadsheet.",
  },
  {
    q: "What if my PDF has multiple tables across many pages?",
    a: "Split the PDF down to just the pages you need first, then convert page by page — most tools handle one table at a time more reliably. Our Split PDF tool pulls out selected pages in your browser before you convert.",
  },
  {
    q: "Why doesn't YATools have a PDF to Excel tool?",
    a: "Because there's no reliable free client-side engine that extracts tables properly. Real table extraction means detecting row and column structure from fixed-position text — heavy server-side work, or desktop software like Tabula. We won't ship a fake button that just dumps garbled text and calls it Excel.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function PdfToExcelPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd(
          post,
          "Extract tables from PDFs into Excel for free: Google Sheets import, LibreOffice, and Tabula explained — plus why table extraction is hard."
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
          PDF to Excel: Extract <em>Tables</em> from PDFs Free
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
            Invoices, bank statements, reports, price lists — so much of the
            world&apos;s data lives trapped in PDF tables. You need it in
            Excel: sortable, filterable, ready for formulas. Search
            &ldquo;PDF to Excel&rdquo; and a hundred sites promise a one-click
            miracle. The honest truth is more interesting: real table
            extraction is genuinely difficult, but three free methods actually
            work. Here&apos;s how to pick the right one for your file.
          </p>

          <h2>Why table extraction is so hard</h2>
          <p>
            Here&apos;s the core problem: a PDF has no concept of a table. A
            spreadsheet knows exactly which cell every value belongs to. A PDF
            just knows that the character &ldquo;7&rdquo; sits 312 pixels from
            the left edge and 145 from the top. There are no rows, no columns,
            no cells — only a pile of positioned characters.
          </p>
          <p>
            An extractor has to play detective: look at where characters line
            up vertically and guess column boundaries, look at horizontal bands
            and guess rows. Clean tables with visible borders make this easy.
            But merged header cells, wrapped text that spans two visual lines,
            missing borders, or columns that merely <em>look</em> aligned defeat
            even good software. Numbers land in the wrong cells. Rows merge.
            Totals float off to nowhere.
          </p>
          <p>
            That&apos;s the real reason most &ldquo;free PDF to Excel&rdquo;
            sites give you junk output: good extraction is heavy, server-side
            work, and the free tiers are rarely good at it. It&apos;s also why
            we don&apos;t offer a fake &ldquo;convert&rdquo; button here —
            there is no honest client-side engine for this, and anything we
            could run in your browser would just extract raw text lines and
            mislabel it as a spreadsheet.
          </p>

          <h2>Method 1: Google Sheets (fastest genuinely free path)</h2>
          <p>
            Upload the PDF to Google Drive, right-click it, and choose{" "}
            <strong>Open with → Google Sheets</strong>. Google parses the file
            and drops the data into a spreadsheet — then go to{" "}
            <strong>File → Download → Microsoft Excel (.xlsx)</strong>. No
            extra account, no page limits, and Google&apos;s parsing handles
            simple tables surprisingly well.
          </p>
          <p>
            Two caveats: Google guesses the structure, so check merged cells
            and multi-line values before trusting the result. And it works on
            text-based PDFs — scans with no text layer get you an empty sheet.
            For anything financial, verify every total by hand afterward.
          </p>

          <h2>Method 2: LibreOffice (free desktop, fully private)</h2>
          <p>
            LibreOffice — free, open-source, no account — opens PDFs in Draw
            and lets you copy table content into Calc. The workflow: open the
            PDF, select the table region, copy, paste into a Calc spreadsheet,
            then use <strong>Data → Text to Columns</strong> to split pasted
            lines into proper cells. It&apos;s manual, but everything happens
            on your machine, which is the option for sensitive documents.
          </p>
          <p>
            Calc&apos;s text-to-columns wizard is the unsung hero here: it
            handles tab- and space-separated pasted data better than most web
            tools. If a table pastes as one long column, that wizard turns it
            into a grid in seconds.
          </p>

          <h2>Method 3: Tabula (the tool built for exactly this)</h2>
          <p>
            Tabula is a free, open-source desktop program built for one job:
            pulling tables out of PDFs. You download it, open your PDF, draw a
            box around the table, and it extracts the rows and columns for
            export to CSV or Excel. Because <em>you</em> draw the table
            boundary, it dodges the biggest failure mode of automatic
            extractors — misdetected table regions.
          </p>
          <p>
            For reports with big, clean tables (government data, financial
            filings), Tabula is the most accurate free option. The tradeoff:
            it&apos;s a Java desktop app you install, and it only works on
            text-based PDFs, not scans. For a recurring monthly-statement
            extraction, the ten minutes to set it up pay for themselves fast.
          </p>

          <h2>Scanned tables need OCR first</h2>
          <p>
            If your PDF is a scan — a photographed invoice, a fax, a phone
            scan — none of the methods above work, because there&apos;s no text
            to extract. You need OCR (optical character recognition) first to
            turn the image into text.
          </p>
          <p>
            The clean workflow: rasterize the page to an image with our{" "}
            <Link href="/tools/pdf-to-jpg">PDF to JPG</Link> or{" "}
            <Link href="/tools/pdf-to-png-converter">PDF to PNG</Link> tool (PNG is
            sharper for text), then run it through our{" "}
            <Link href="/tools/image-to-text">Image to Text</Link> tool to pull
            the text out in your browser. Then paste that text into a
            spreadsheet and split it into columns. It&apos;s manual, but for a
            one-off scanned invoice it beats retyping everything by hand.
          </p>

          <h2>Prep work: isolate the pages first</h2>
          <p>
            Most converters behave better when you feed them only the pages
            that matter. A 40-page report with one table on page 27 will trip
            up automatic tools; just page 27 converts cleanly. Our{" "}
            <Link href="/tools/split-pdf">Split PDF</Link> tool pulls out the
            pages you need right in your browser — nothing uploaded — before
            you run the conversion.
          </p>
          <p>
            And if the file is bloated from embedded images, give it a{" "}
            <Link href="/tools/compress-pdf">Compress PDF</Link> pass first:
            smaller files upload to Google Drive faster and process more
            reliably in every tool on this page.
          </p>

          <h2>The cleanup step nobody mentions</h2>
          <p>
            Whatever method you use, budget five minutes for cleanup. Open the
            result next to the original PDF and spot-check: do the row counts
            match? Do totals still total? Are dates real dates or text that
            looks like dates? The classic failure — a cell that should contain
            &ldquo;1,250&rdquo; arriving as &ldquo;1&rdquo; in one cell and
            &ldquo;250&rdquo; in the next — is easy to catch if you look, and
            expensive if you don&apos;t. This is the real skill in PDF→Excel:
            not the conversion, but the verification.
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
            <p className="sec-label">Prepping a scanned PDF for extraction?</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Rasterize pages <em>first</em>
            </h2>
            <p className="sec-sub">
              Turn PDF pages into sharp images in your browser, then OCR them — the first step for scanned tables.
            </p>
          </div>
          <Link href="/tools/pdf-to-png-converter" className="btn btn-primary">
            Open PDF to PNG →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>PDF to Excel <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["pdf-to-jpg", "image-to-text", "split-pdf", "compress-pdf"]} />
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
