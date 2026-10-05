import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("merge-pdf-files-free")!;

export const metadata = pageMeta({
  title: "How to Merge PDF Files Free (3 Easy Methods)",
  description:
    "Merge PDF files for free with 3 easy methods: a free online merger, macOS Preview, or your iPhone. Step-by-step guide — no sign-up, no watermarks.",
  path: `/blog/${post.slug}`,
  keywords: [
    "merge pdf files free",
    "combine pdf files online",
    "merge pdf mac preview",
    "merge pdf iphone",
    "join pdf files",
  ],
});

const faqs = [
  {
    q: "Is merging PDFs free?",
    a: "Yes. All three methods in this guide are completely free — the online merger costs nothing and needs no account, and Preview and the iPhone Files app are built into your devices.",
  },
  {
    q: "Is it safe to merge PDFs online?",
    a: "For ordinary documents, yes — pick a tool that doesn't ask for an account and processes files without keeping them. For sensitive documents (contracts, IDs, medical records), prefer an offline method like macOS Preview or your iPhone so the files never leave your device.",
  },
  {
    q: "Will merging change the quality of my PDFs?",
    a: "No. Merging only joins the pages of your files into one document — text, images, and layout stay exactly as they were. If your merged file is too big to email, that's a separate job: compress the images or re-export at a lower quality before merging.",
  },
  {
    q: "How many PDFs can I merge at once?",
    a: "It depends on the tool. Online mergers usually handle a handful of files comfortably; if you have dozens, merge them in smaller batches and then merge the results. Very large files may also be slower on phones.",
  },
  {
    q: "Can I merge JPG or PNG images into a PDF?",
    a: "Merge tools work with PDF files, so convert your images first. The fastest way: on iPhone, select the photos in the Files or Photos app and choose Create PDF / Print to PDF; on a computer, print the images to PDF. Then merge the resulting PDFs with Method 1.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function MergePdfPost() {
  return (
    <>
      <JsonLd data={articleJsonLd(post, "Merge PDF files for free with 3 easy methods: a free online merger, macOS Preview, or your iPhone. Step-by-step guide — no sign-up, no watermarks.")} />
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
          How to Merge PDF Files for <em>Free</em> (3 Easy Methods)
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
            Sooner or later everyone needs to combine PDFs: a job application split
            across a CV and a cover letter, receipts scattered across a dozen files,
            or chapters of a report that have to become one document. One file is
            easier to email, harder to lose, and looks far more professional than
            five attachments named <em>scan_final_v2.pdf</em>. Merging takes less
            than a minute — here are three free methods, easiest first.
          </p>

          <h2>Method 1: Use a free online PDF merger (fastest)</h2>
          <p>
            An online merger is the quickest option on any device — computer, tablet,
            or phone — and you install nothing.
          </p>
          <ol>
            <li>
              Open the{" "}
              <Link href="/tools/merge-pdf">free Merge PDF tool on YATools</Link>.
            </li>
            <li>Add your PDF files — drag and drop them or click to browse.</li>
            <li>
              <strong>Arrange the order.</strong> Drag the files into the sequence you
              want the pages to appear. This is the step people skip and regret.
            </li>
            <li>Click Merge, then download your single combined PDF.</li>
          </ol>
          <p>
            No sign-up, no watermark stamped on your file. One honest caveat:
            password-protected PDFs can't be merged until you remove the password
            with the owner's permission, because the merger can't read locked files.
          </p>

          <h2>Method 2: Merge PDFs with Preview on Mac (built-in)</h2>
          <p>
            Every Mac already has a PDF merger — it's called Preview, and it's been
            there since day one.
          </p>
          <ol>
            <li>Open the first PDF in Preview.</li>
            <li>Choose <strong>View → Thumbnails</strong> to show the sidebar.</li>
            <li>
              Drag your other PDF files into the thumbnail sidebar, in the order you
              want them. You can also drag individual pages up and down to reorder.
            </li>
            <li>
              Choose <strong>File → Export as PDF</strong> and save your merged file.
            </li>
          </ol>
          <p>
            This method is ideal for sensitive documents because nothing is uploaded
            anywhere — everything happens on your Mac.
          </p>

          <h2>Method 3: Merge PDFs on iPhone (built-in)</h2>
          <p>Your iPhone can do it too, straight from the Files app:</p>
          <ol>
            <li>Open the <strong>Files</strong> app and go to the folder with your PDFs.</li>
            <li>Tap the <strong>•••</strong> menu, then <strong>Select</strong>.</li>
            <li>Tap the PDFs you want to merge, in the order you want them.</li>
            <li>
              Tap <strong>•••</strong> at the bottom and choose{" "}
              <strong>Create PDF</strong>.
            </li>
          </ol>
          <p>
            The merged PDF is saved in the same folder. On Windows and Android there
            is no equally simple built-in option — for those, Method 1 (the online
            merger) is genuinely the fastest path.
          </p>

          <h2>Get the page order right before you merge</h2>
          <p>
            The single most common merging mistake is wrong page order — a cover
            letter landing after the CV, or chapter 3 before chapter 2. Before you
            merge, rename your files with numbers (<em>01-cover.pdf</em>,{" "}
            <em>02-cv.pdf</em>) so the order is obvious at a glance, then double-check
            the preview order in the merger before downloading.
          </p>

          <h2>What merging can't do (honest limits)</h2>
          <ul>
            <li>
              <strong>It won't shrink your file.</strong> Merging joins pages; it
              doesn't compress anything. A 40MB merged file is still 40MB.
            </li>
            <li>
              <strong>It won't make scanned PDFs searchable.</strong> If your pages
              are photos of paper, they stay photos of paper — merging doesn't add
              text recognition.
            </li>
            <li>
              <strong>Mixed page sizes stay mixed.</strong> Merging an A4 document
              with a US Letter one keeps both sizes in the result, which can look
              odd when printed.
            </li>
          </ul>
          <h2>A 60-second pre-merge checklist</h2>
          <p>
            Run through this before you hit Merge and you'll avoid 90% of
            do-overs:
          </p>
          <ul>
            <li>
              <strong>Order:</strong> files numbered and arranged (cover letter
              before CV, chapters in sequence).
            </li>
            <li>
              <strong>Orientation:</strong> open each PDF and check nothing is
              sideways or upside-down — merging won't fix rotation.
            </li>
            <li>
              <strong>Duplicates:</strong> make sure the same file isn't added
              twice; it's the most common merging mistake after wrong order.
            </li>
            <li>
              <strong>Size:</strong> if the total is over ~25MB and you're
              emailing it, compress the image-heavy files first.
            </li>
          </ul>
          <h2>After merging: the 10-second quality check</h2>
          <p>
            Open the merged file and flip through it quickly: check the page
            count matches what you expect, the first and last pages are correct,
            and any links or bookmarks still work. Catching a mistake now takes
            seconds; catching it after you've sent the file to a client takes a
            very awkward email.
          </p>
          <p>
            If your goal is one tidy, emailable file, the usual winning combo is:
            compress any image-heavy PDFs first, then merge. For turning raw text
            into a PDF before merging, try the{" "}
            <Link href="/tools/text-to-pdf">Text to PDF tool</Link>, and for saving
            articles as PDFs, the{" "}
            <Link href="/tools/wikipedia-to-pdf">Wikipedia to PDF tool</Link>.
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
              Merge your PDFs in <em>seconds</em>
            </h2>
            <p className="sec-sub">
              Free online merger — drop your files, arrange the order, download one PDF.
            </p>
          </div>
          <Link href="/tools/merge-pdf" className="btn btn-primary">
            Open Merge PDF →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>Merge PDF <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["text-to-pdf", "wikipedia-to-pdf", "website-screenshot"]} />
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
