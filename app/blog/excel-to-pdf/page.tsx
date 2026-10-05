import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("excel-to-pdf-converter")!;

export const metadata = pageMeta({
  title: "Excel to PDF: Convert Spreadsheets, Keep Formatting",
  description:
    "Convert Excel to PDF without cut-off columns or tiny text: print-to-PDF page setup — fit to page, landscape, print areas — in Excel and Google Sheets.",
  path: `/blog/${post.slug}`,
  keywords: [
    "excel to pdf",
    "convert spreadsheet to pdf",
    "excel print to pdf fit to page",
    "google sheets download as pdf",
  ],
});

const faqs = [
  {
    q: "Why does my Excel-to-PDF output cut off columns?",
    a: "Because the PDF is a photo of the print layout, and the print layout doesn't match your screen view. Fix it with File → Print → Settings → Fit Sheet on One Page, or set a scaling percentage and preview before saving. Landscape orientation also buys a lot of room for wide tables.",
  },
  {
    q: "How do I convert a Google Sheet to PDF for free?",
    a: "File → Download → PDF Document (.pdf). In the export dialog, set the paper size, orientation, scale (Fit to width is usually what you want), and which sheets to include. You can also add headers/footers with page numbers and the file name.",
  },
  {
    q: "Can I convert Excel to PDF on my phone?",
    a: "Yes — the free Excel mobile app lets you share or export a sheet as PDF, and the Google Sheets app does the same. But page setup (fit-to-page, print areas) is much easier on a desktop, so prepare the layout there first if the result matters.",
  },
  {
    q: "How do I make column headers repeat on every PDF page?",
    a: "In Excel: Page Layout tab → Print Titles → Rows to repeat at top, and select your header row. In Google Sheets: File → Download → PDF → under the headers section, check 'Repeat row headers on each page'. This is the single biggest readability upgrade for multi-page sheets.",
  },
  {
    q: "Why doesn't YATools have an Excel-to-PDF tool?",
    a: "Because spreadsheet-to-PDF conversion is really print-layout rendering, and the only engines that do it faithfully are the ones inside Excel, Sheets, and LibreOffice. There is no genuine free in-browser converter we could ship that wouldn't just mangle your columns. The built-in Export menu is already the right tool.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function ExcelToPdfPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd(
          post,
          "Convert Excel to PDF without cut-off columns or tiny text: print-to-PDF page setup — fit to page, landscape, print areas — in Excel and Google Sheets."
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
          Excel to PDF: Convert Spreadsheets Without <em>Losing</em> Formatting
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
            Exporting a Word document to PDF is easy (see{" "}
            <Link href="/blog/word-to-pdf">our Word→PDF guide</Link>) because a
            Word page already looks like a printed page. Spreadsheets are a
            different animal: your data is a grid that scrolls forever, and a
            PDF is a fixed stack of pages. That mismatch is the source of
            every classic spreadsheet-to-PDF disaster — cut-off columns, text
            shrunk to ant size, headers that appear once and vanish.
          </p>
          <p>
            The fix isn&apos;t a better converter. It&apos;s understanding that
            &ldquo;converting Excel to PDF&rdquo; is really <em>printing</em>
            to PDF — and treating page setup as the main event.
          </p>

          <h2>The mental model: you&apos;re printing, not converting</h2>
          <p>
            When Excel makes a PDF, it renders your sheet exactly as it would
            look coming out of a printer: margins, page breaks, scaling, the
            lot. If the Print Preview looks wrong, the PDF will look wrong in
            exactly the same way. So the workflow is always:
          </p>
          <ul>
            <li>
              <strong>Open Print Preview first</strong> (Ctrl+P / Cmd+P) — never
              export blind.
            </li>
            <li>Fix the layout problems you see.</li>
            <li>Then choose PDF as the printer/destination.</li>
          </ul>
          <p>
            This one habit eliminates 90% of broken spreadsheet PDFs. Every
            method below — desktop, web, phone — flows through this preview.
          </p>

          <h2>Excel desktop: the reliable path</h2>
          <p>
            With the spreadsheet open, press <strong>Ctrl+P</strong> (or File →
            Print) and set the destination to <strong>Microsoft Print to
            PDF</strong> — or use <strong>File → Export → Create PDF/XPS</strong>
            for more options. Before you hit print, get these settings right:
          </p>
          <ul>
            <li>
              <strong>Scaling: Fit Sheet on One Page.</strong> In the Settings
              dropdown, this is the single most important control. It shrinks
              your sheet to fit one page wide and tall. For wide tables,
              &ldquo;Fit All Columns on One Page&rdquo; keeps everything
              readable while allowing multiple pages downward.
            </li>
            <li>
              <strong>Orientation: Landscape.</strong> Tables are wider than
              they are tall; portrait orientation is the #1 cause of cut-off
              columns. Flip it.
            </li>
            <li>
              <strong>Print Area.</strong> Select just the cells you want, then
              Page Layout → Print Area → Set Print Area. Stops stray columns
              and blank pages with invisible formatting.
            </li>
            <li>
              <strong>Print Titles.</strong> Page Layout → Print Titles → Rows
              to repeat at top, and pick your header row. Now every page of a
              long sheet carries its column labels.
            </li>
            <li>
              <strong>Margins and gridlines.</strong> Narrow margins buy space;
              ticking &ldquo;Gridlines&rdquo; under Sheet Options prints the
              cell borders you see on screen (off by default in print).
            </li>
          </ul>

          <h2>Google Sheets: free, no Excel needed</h2>
          <p>
            <strong>File → Download → PDF Document (.pdf)</strong> opens an
            export dialog with the same concepts:
          </p>
          <ul>
            <li>
              <strong>Scale: Fit to width</strong> — usually the right choice
              for tables.
            </li>
            <li>
              <strong>Orientation:</strong> Landscape for anything with more
              than a few columns.
            </li>
            <li>
              <strong>Repeat row headers on each page</strong> — the Sheets
              equivalent of Print Titles.
            </li>
            <li>
              <strong>Which sheets:</strong> current sheet, all sheets, or a
              specific cell range. Pick a range to avoid exporting scratch
              tabs.
            </li>
            <li>
              Headers and footers can stamp page numbers, the workbook title,
              and date on every page automatically.
            </li>
          </ul>

          <h2>LibreOffice Calc: the free offline route</h2>
          <p>
            LibreOffice is free and opens XLSX files. In Calc, select your
            data range, then <strong>Format → Print Ranges → Define</strong> to
            set the print area, and use the <strong>Export Directly as
            PDF</strong> toolbar button. Check the Page Preview (View → Page
            Break Preview) first — dragging page-break lines in that view is
            the fastest way to tame a big sheet.
          </p>

          <h2>The classic disasters (and their one-line fixes)</h2>
          <ul>
            <li>
              <strong>Columns cut off on the right</strong> → Landscape +
              &ldquo;Fit all columns on one page&rdquo;.
            </li>
            <li>
              <strong>Text shrunk to unreadable</strong> → You forced too much
              onto one page. Allow &ldquo;Fit to 1 page wide by N pages
              tall&rdquo; instead of 1×1.
            </li>
            <li>
              <strong>Page 2+ has no headers</strong> → Print Titles / Repeat
              row headers.
            </li>
            <li>
              <strong>Random blank pages at the end</strong> → Set an explicit
              Print Area; stray formatting on distant cells creates phantom
              pages.
            </li>
            <li>
              <strong>####### in cells</strong> → A column is too narrow for
              the number. Widen it before exporting — the PDF will show the
              same error text.
            </li>
          </ul>

          <h2>Why we won&apos;t ship a fake converter</h2>
          <p>
            Spreadsheet-to-PDF is print rendering, and the only engines that
            do it faithfully live inside Excel, Sheets, and LibreOffice.
            There&apos;s no genuine free in-browser XLSX-to-PDF renderer —
            any site offering one is running your financial spreadsheets
            through their server farm. If you wouldn&apos;t email the file to
            a stranger, don&apos;t upload it to a converter. The Export menu
            is already the right tool, and it&apos;s private.
          </p>

          <h2>After the export: keep the PDF useful</h2>
          <p>
            A clean PDF deserves good handling — and that&apos;s where tools
            that genuinely run in your browser help.{" "}
            <Link href="/tools/merge-pdf">Merge PDF</Link> combines sheets
            exported separately into one report,{" "}
            <Link href="/tools/compress-pdf">Compress PDF</Link> shrinks the
            file for email or uploads, and{" "}
            <Link href="/tools/text-to-pdf">Text to PDF</Link> builds a clean
            cover page or summary from plain text. If you ever need the
            reverse trip — pulling editable text <em>out</em> of a PDF —{" "}
            <Link href="/tools/pdf-to-jpg">PDF to JPG</Link> turns pages into
            images you can drop into a presentation.
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
            <p className="sec-label">Exported — now combine your report</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Merge PDFs <em>privately</em>
            </h2>
            <p className="sec-sub">
              Stitch multiple exported sheets into one report — nothing is uploaded.
            </p>
          </div>
          <Link href="/tools/merge-pdf" className="btn btn-primary">
            Open Merge PDF →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>Excel to PDF <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["merge-pdf", "compress-pdf", "text-to-pdf"]} />
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
