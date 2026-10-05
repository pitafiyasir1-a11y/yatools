import Link from "next/link";
import { pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { postBySlug, articleJsonLd, POSTS } from "../posts";

const post = postBySlug("unlock-pdf-guide")!;

export const metadata = pageMeta({
  title: "How to Unlock a PDF You Own: Legitimate Options Explained",
  description:
    "Locked out of your own PDF? Learn what PDF passwords actually do, the legitimate ways to regain access, and why random “unlocker” sites are risky.",
  path: `/blog/${post.slug}`,
  keywords: [
    "how to unlock a pdf",
    "locked pdf legitimate options",
    "pdf password explained",
    "open password protected pdf",
  ],
});

const faqs = [
  {
    q: "I set a PDF password and forgot it. What should I do first?",
    a: "Check your browser's saved passwords and any password manager — many people save PDF passwords without realizing it. Then try the password variations you'd normally use. If you exported the PDF yourself, re-exporting from the source document is usually faster than any recovery attempt.",
  },
  {
    q: "Someone sent me a locked PDF and I don't know the password. What now?",
    a: "Ask the sender. This is the legitimate path, and it's usually the fastest: a quick message gets you the password or an unlocked copy. There is no honest tool that can open someone else's protected document for you — that's what the password is for.",
  },
  {
    q: "Is it legal to remove a PDF password?",
    a: "Removing a password from a document you own or have explicit permission to unlock is fine. Removing protection from someone else's document without permission — or to bypass a paywall, license, or distribution restriction — is not. When in doubt, ask the document's owner.",
  },
  {
    q: "Why shouldn't I just upload my PDF to a free unlocker site?",
    a: "Because you hand a stranger your complete document. Free unlocker sites can keep copies, mine your files for personal data, or bundle the download with malware. For bank statements, contracts, ID scans, or anything sensitive, that risk is not worth it.",
  },
  {
    q: "What are the two kinds of PDF passwords?",
    a: "A user password locks the whole file — you can't open it without it. An owner password restricts actions like printing, copying text, or editing, while still letting you open and read the document. Many 'locked' PDFs people struggle with only have an owner password.",
  },
];

const morePosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

export default function UnlockPdfGuidePage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd(
          post,
          "Locked out of your own PDF? What PDF passwords actually do, the legitimate ways to regain access, and why random unlocker sites are risky."
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
          How to Unlock a PDF <em>You Own</em>
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
            It happens to everyone: you password-protected a PDF months ago and
            now can&apos;t remember the password, or someone emailed you a
            locked file with no password attached. Before you Google
            &ldquo;free PDF unlocker,&rdquo; it&apos;s worth understanding what
            you&apos;re dealing with — and which paths are legitimate.
          </p>

          <h2>What PDF passwords actually do</h2>
          <p>PDFs support two different kinds of password, and they lock different things:</p>
          <ul>
            <li>
              <strong>User password (open password).</strong> This locks the
              entire file. Without it, the document won&apos;t open at all —
              the content is encrypted. This is the password people usually
              mean when they say a PDF is &ldquo;locked.&rdquo;
            </li>
            <li>
              <strong>Owner password (permissions password).</strong> This
              restricts what you can <em>do</em> with the document: printing,
              copying text, or editing. You can still open and read the file,
              but those actions are blocked. Many frustrating &ldquo;locked
              PDFs&rdquo; only have this kind of restriction.
            </li>
          </ul>
          <p>
            Knowing which one you&apos;re facing matters, because the
            legitimate solutions are different — and for a true open password
            with strong encryption, there is no honest shortcut. That&apos;s
            the point of encryption.
          </p>

          <h2>Legitimate ways to regain access</h2>
          <p>
            This guide doesn&apos;t provide circumvention instructions — not
            because we&apos;re being difficult, but because bypassing someone
            else&apos;s document protection isn&apos;t a legitimate path.
            These are the paths that are:
          </p>
          <ul>
            <li>
              <strong>Use the password you set.</strong> Obvious, but try your
              usual variations first — with and without caps lock, the year
              you&apos;d append, the special character you&apos;d swap. Most
              &ldquo;forgotten&rdquo; passwords are one small variation away.
            </li>
            <li>
              <strong>Check your password manager.</strong> Browsers and
              password managers often save PDF passwords without you noticing.
              Search yours for the document name or the sender&apos;s name
              before trying anything else.
            </li>
            <li>
              <strong>Ask the document owner or sender.</strong> If someone
              sent you the file, a quick message gets you the password or an
              unlocked copy. It&apos;s the fastest legitimate route and the
              only one that respects the owner&apos;s intent.
            </li>
            <li>
              <strong>Re-export from the source app.</strong> If you created
              the PDF yourself — from Word, Google Docs, or a scanner app —
              open the original document and export a fresh PDF without a
              password. This beats every recovery trick.
            </li>
            <li>
              <strong>Check for other copies.</strong> The same document may
              exist unlocked in your email attachments, cloud drive version
              history, or the sent folder of whoever shared it.
            </li>
          </ul>

          <h2>Why random &ldquo;unlocker&rdquo; sites are risky</h2>
          <p>
            Search results for PDF unlocking are full of sites promising to
            crack any file in seconds. Here&apos;s what those sites don&apos;t
            advertise:
          </p>
          <ul>
            <li>
              <strong>File theft.</strong> You upload your complete document to
              a stranger&apos;s server. Bank statements, contracts, ID scans,
              medical records — once uploaded, you have no idea who keeps a
              copy or how it&apos;s mined.
            </li>
            <li>
              <strong>Malware.</strong> Free unlocker sites are a classic
              distribution channel for bundled adware and trojans in the
              &ldquo;desktop version&rdquo; downloads, and for malicious ads
              on the page itself.
            </li>
            <li>
              <strong>It often doesn&apos;t work.</strong> Many of these tools
              only strip the weaker owner password (which lets you print or
              copy but was never really &ldquo;locked&rdquo;), while claiming
              to crack real encryption. The honest ones say so; the rest just
              fail silently after taking your file.
            </li>
          </ul>
          <p>
            The pattern to notice: every &ldquo;free unlocker&rdquo; asks you
            to give up the one thing that matters — your document. A tool that
            processes files in your browser never needs to.
          </p>

          <h2>A note on legality</h2>
          <p>
            Removing a password from a document you own — or one whose owner
            gave you permission — is fine. Removing protection from someone
            else&apos;s document without permission, or to dodge a paywall,
            license term, or distribution restriction, is not. When in doubt,
            ask the document&apos;s owner. It&apos;s usually faster than any
            technical route anyway.
          </p>

          <h2>Once it&apos;s unlocked, work with it safely</h2>
          <p>
            With a legitimately unlocked copy in hand, you can get back to
            work without uploading your document anywhere:{" "}
            <Link href="/tools/merge-pdf">Merge PDF</Link> combines it with
            other files, <Link href="/tools/split-pdf">Split PDF</Link>{" "}
            pulls out just the pages you need, and{" "}
            <Link href="/tools/compress-pdf">Compress PDF</Link> shrinks
            bloated files — all three run 100% in your browser.
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
            <p className="sec-label">Your PDF is unlocked — now what?</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Work with it <em>privately</em>
            </h2>
            <p className="sec-sub">
              Merge, split, and compress your PDFs right in the browser — nothing is uploaded.
            </p>
          </div>
          <Link href="/tools/merge-pdf" className="neu-btn neu-btn-primary">
            Open Merge PDF →
          </Link>
        </div>

        <div style={{ maxWidth: 760, marginTop: 44 }}>
          <SectionHead label="FAQ" title={<>PDF unlocking <em>questions</em></>} />
          <FaqList faqs={faqs} />
        </div>

        <div style={{ marginTop: 44 }}>
          <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
          <RelatedTools slugs={["merge-pdf", "split-pdf", "compress-pdf"]} />
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
