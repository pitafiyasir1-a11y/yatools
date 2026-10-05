import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("powerpoint-to-pdf")!;

export const metadata = pageMeta({
  title: "PowerPoint to PDF: Export PPTX Without Losing Formatting",
  description:
    "Export PowerPoint to PDF without losing formatting: the built-in Export in PowerPoint and Google Slides, with font and page-size settings. Get it right today.",
  path: `/blog/${post.slug}`,
  keywords: [
    "powerpoint to pdf free",
    "export pptx to pdf",
    "save powerpoint as pdf",
    "ppt to pdf without losing formatting",
  ],
});

const faqs = [
  {
    q: "How do I save a PowerPoint as a PDF for free?",
    a: "In PowerPoint: File → Export → Create PDF/XPS Document. In Google Slides: File → Download → PDF Document. In the free PowerPoint mobile app: Share → Export → PDF. All of these are built in and free — no converter website needed.",
  },
  {
    q: "Why does my PDF look different from my slides?",
    a: "Almost always fonts or slide size. If the viewing computer lacks your fonts, text reflows or substitutes — fix it by exporting with fonts embedded. If slides were built at one aspect ratio and exported at another, content stretches — set Design → Slide Size before exporting.",
  },
  {
    q: "Can I include speaker notes in the exported PDF?",
    a: "Yes. In the export dialog, choose the Notes Pages layout (PowerPoint desktop: Options → Publish What → Notes Pages; Google Slides: File → Print settings → choose to include notes). Each slide prints with its notes below it — perfect for handouts.",
  },
  {
    q: "Will animations and videos survive in the PDF?",
    a: "No. PDFs are static pages: animated builds become their final state, and embedded videos become a still frame (sometimes a broken icon). If motion matters, keep the PPTX. For a PDF, freeze the important frames as separate slides before exporting.",
  },
  {
    q: "Why doesn't YATools have a PowerPoint to PDF tool?",
    a: "Because the built-in export in PowerPoint and Google Slides already does it perfectly, on your own machine, for free. A web converter would just upload your deck to a server and run the same conversion worse — with privacy risk and formatting risk added. We don't ship tools that are worse than what's already in your apps.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function PowerpointToPdfPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd(
          post,
          "Export PowerPoint to PDF without losing formatting: the built-in Export in PowerPoint and Google Slides, with font and page-size settings."
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
          PowerPoint to PDF: Export PPTX <em>Without Losing</em> Formatting
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
            You finished the deck. Now you need to send it somewhere it will
            look <em>exactly</em> the same on every screen: email, a job
            application, a printer, an archive. That&apos;s what PDF is for.
            The good news is that the correct way to export PowerPoint to PDF
            is already sitting in your apps — built in, free, and better than
            any converter website. The only skill is using the right settings.
          </p>

          <h2>The correct path: built-in export (nothing to download)</h2>
          <p>
            You don&apos;t need a converter site, an upload, or an account.
            Every major presentation app converts PPTX to PDF itself:
          </p>
          <ul>
            <li>
              <strong>PowerPoint desktop:</strong> File → Export →{" "}
              <strong>Create PDF/XPS Document</strong>. This gives you the most
              control — quality settings, what to include, font embedding.
            </li>
            <li>
              <strong>Google Slides:</strong> File → Download →{" "}
              <strong>PDF Document (.pdf)</strong>. Fewer options, but fast and
              free in the browser.
            </li>
            <li>
              <strong>PowerPoint mobile (free app):</strong> Share → Export →
              PDF. Handy when the deck lives on your phone.
            </li>
          </ul>
          <p>
            This is also why we deliberately don&apos;t offer a
            &ldquo;PowerPoint to PDF converter&rdquo; here. A web tool would
            just upload your deck to somebody&apos;s server and run the same
            export — slower, with worse font handling, and with your
            presentation (client data, salary figures, unreleased product
            shots) sitting on a stranger&apos;s disk. Your apps do it better
            and privately. We don&apos;t ship tools that are worse than what
            you already have.
          </p>

          <h2>The two settings that prevent formatting disasters</h2>
          <p>
            <strong>1. Embed the fonts.</strong> The number-one cause of
            &ldquo;it looks different on their computer&rdquo; is fonts the
            recipient doesn&apos;t have installed. PowerPoint substitutes
            something close, text reflows, and your careful layout breaks. In
            the export dialog, open <strong>Options</strong> and look for the
            font setting — PowerPoint desktop embeds fonts in the PDF by
            default in the Standard quality mode, but check it. In Google
            Slides, stick to standard web fonts (Arial, Roboto, Georgia) so
            substitutions never bite.
          </p>
          <p>
            <strong>2. Set the slide size first.</strong> A deck built in
            16:9 and exported at 4:3 (or vice versa) comes out stretched or
            letterboxed. Go to <strong>Design → Slide Size</strong> and confirm
            the aspect ratio <em>before</em> exporting. Exporting the wrong
            size is a one-click fix upstream and an unfixable mess downstream.
          </p>

          <h2>Quality setting: Standard vs Minimum Size</h2>
          <p>
            PowerPoint&apos;s export dialog offers two publishing options, and
            picking the wrong one is the second most common mistake:
          </p>
          <ul>
            <li>
              <strong>Standard (publishing online and printing)</strong> — full
              resolution, crisp images. Use this for anything anyone will
              read, print, or present from.
            </li>
            <li>
              <strong>Minimum Size (publishing online)</strong> — compressed
              images, much smaller file. Use this only for email attachments
              with strict size limits.
            </li>
          </ul>
          <p>
            If your Standard export is too big to email, compress images{" "}
            <em>inside</em> PowerPoint first (select a picture → Picture Format
            → Compress Pictures) rather than defaulting to Minimum Size — you
            keep control of the quality.
          </p>

          <h2>What doesn&apos;t survive the trip to PDF</h2>
          <p>
            Know the losses before you promise the PDF: animations and slide
            transitions flatten to their final state — a five-step build
            becomes one finished slide. Embedded videos become a still frame,
            occasionally a dead icon. Narration and timings vanish. If the
            motion tells the story, keep the PPTX. If the PDF is the
            deliverable, duplicate the build into separate slides so every
            stage appears as its own page.
          </p>
          <p>
            Speaker notes are the exception — they can come along. In the
            export options choose the Notes Pages layout and each slide prints
            with its notes underneath, which is exactly what you want for
            handouts and reviewers.
          </p>

          <h2>Exporting from LibreOffice Impress and Keynote</h2>
          <p>
            Not everyone uses PowerPoint, and the built-in path exists there
            too. <strong>LibreOffice Impress</strong> (free, open-source):
            File → Export As → Export as PDF — with options for quality and
            selecting specific slides. <strong>Apple Keynote</strong>: File →
            Export To → PDF, with a choice of slide layouts (slides only,
            slides with notes, handout grid). Both are free-to-you and keep
            the file entirely on your machine.
          </p>
          <p>
            The font rule applies everywhere: if you built the deck with a
            font that isn&apos;t on the recipient&apos;s machine, export with
            embedding turned on (LibreOffice has an explicit &ldquo;Embed
            standard fonts&rdquo; option in the PDF export dialog). Keynote
            embeds fonts automatically. And in Google Slides, since the fonts
            live in the cloud, a PDF downloaded from Slides will render with
            the correct fonts for any viewer — one of the few cases where the
            web version is the <em>safer</em> choice.
          </p>

          <h2>The print-to-PDF fallback</h2>
          <p>
            On any device, <strong>File → Print</strong> and choosing a PDF
            printer (Microsoft Print to PDF on Windows, Save as PDF on macOS,
            Print → Save as PDF on Android, the system share sheet on iPhone)
            works when the export menu is hiding. It produces the same visual
            result for slide decks with one tradeoff: print-to-PDF can
            flatten or drop some interactivity (hyperlinks sometimes survive,
            sometimes don&apos;t) and usually offers fewer quality options.
            Keep it as the backup, not the default — the dedicated Export
            dialog gives you more control over fonts, size, and notes.
          </p>

          <h2>Quick pre-export checklist</h2>
          <p>
            Run through this before you export and you&apos;ll almost never get
            a bad PDF:
          </p>
          <ul>
            <li>Slide size set and consistent across the deck (Design → Slide Size).</li>
            <li>Fonts you used are embedded, or switched to universal ones.</li>
            <li>Animated builds duplicated as static slides if they matter.</li>
            <li>Speaker notes filled in — they&apos;re easier to add now than after.</li>
            <li>Hidden slides removed (they export unless you exclude them).</li>
            <li>Quality set to Standard unless email size forces Minimum.</li>
          </ul>
          <p>
            Two minutes with this list prevents the classic embarrassments:
            the stretched logo, the substituted font that broke the title, the
            hidden &ldquo;TODO fix this&rdquo; slide that shipped to the
            client.
          </p>

          <h2>After exporting: shrink, merge, or build onward</h2>
          <p>
            Exported PDFs are often larger than they need to be. Once you have
            yours, everything else is free and runs in your browser:
          </p>
          <ul>
            <li>
              <Link href="/tools/compress-pdf">Compress PDF</Link> — shrink a
              bloated export for email without visible quality loss.
            </li>
            <li>
              <Link href="/tools/merge-pdf">Merge PDF</Link> — combine the
              deck&apos;s PDF with handouts, agendas, or reports into one
              document.
            </li>
            <li>
              <Link href="/tools/text-to-pdf">Text to PDF</Link> — need a title
              page or appendix from scratch? Build clean PDF pages right in
              your browser and merge them in.
            </li>
            <li>
              <Link href="/blog/excel-to-pdf">Excel to PDF guide</Link> — the
              same export discipline for spreadsheets, including the page setup
              that stops cut-off columns.
            </li>
          </ul>
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
            <p className="sec-label">Need a PDF from scratch?</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Build clean PDFs <em>in your browser</em>
            </h2>
            <p className="sec-sub">
              Our Text to PDF tool creates PDFs from plain text — no upload, no sign-up.
            </p>
          </div>
          <Link href="/tools/text-to-pdf" className="btn btn-primary">
            Open Text to PDF →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>PowerPoint to PDF <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["text-to-pdf", "merge-pdf", "compress-pdf", "image-to-pdf"]} />
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
