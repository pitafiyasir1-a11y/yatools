import CompressPdfClient from "./ToolClient";
import {
  Breadcrumbs,
  ToolHero,
  Steps,
  FaqList,
  RelatedTools,
  PrivacyNote,
  SectionHead,
  ApiCta,
  JsonLd,
} from "../tool-parts";
import {
  pageMeta,
  faqJsonLd,
  webAppJsonLd,
  breadcrumbJsonLd,
  type ToolDef,
  SITE,
} from "@/lib/site";

const tool: ToolDef = {
  slug: "compress-pdf",
  name: "Compress PDF",
  tagline: "Shrink PDF file size by cleaning up its structure.",
  description:
    "Reduce PDF file size with honest structural compression: removes unused objects and strips metadata. Runs in your browser, free.",
  category: "Screenshots & PDF",
  keyword: "compress pdf online free",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["merge-pdf", "image-compressor", "image-to-pdf"],
};

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Compress PDF — YATools",
    url: `${SITE.url}/tools/compress-pdf`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Compress PDF file size free online with honest structural compression — remove bloat, strip metadata, keep quality. Fully private and in-browser. Try it now!",
  };
}

export const metadata = pageMeta({
  title: "Compress PDF Online Free - Reduce PDF File Size Fast",
  description:
    "Compress PDF file size free online with honest structural compression — remove bloat, strip metadata, keep quality. Fully private and in-browser. Try it now!",
  path: "/tools/compress-pdf",
  keywords: [
    "compress pdf online free",
    "compress PDF",
    "reduce PDF size",
    "shrink PDF",
    "PDF compressor",
  ],
});

const faqs = [
  {
    q: "How does this PDF compressor work?",
    a: "It rebuilds your PDF through pdf-lib's object model, which packs objects into compressed streams, and strips embedded metadata (author, creation date, editing history). That's it — no image recompression, no quality tricks.",
  },
  {
    q: "How much smaller will my PDF get?",
    a: "Honest answer: it depends. Exported-from-Word or bloated generator PDFs often shrink noticeably. Already-optimized PDFs shrink a little. Scanned or image-heavy PDFs barely change, because their bulk is compressed image data we don't touch. The tool shows you the before/after sizes so you can judge for yourself.",
  },
  {
    q: "Will compression hurt my PDF's quality?",
    a: "No. This compressor never recompresses images or downsamples anything — pages look exactly the same. It only removes structural waste and metadata. If the tool says it saved 0%, your pages are untouched either way.",
  },
  {
    q: "Why do scanned PDFs barely shrink?",
    a: "Scanned pages are essentially photos, and their size is dominated by JPEG-compressed image data. Structural cleanup can't touch that data. To shrink scans you need image recompression, which always trades quality — we chose not to do that silently.",
  },
  {
    q: "Is it free, and is my file private?",
    a: "Yes to both. Free with no limits, no sign-up, no watermark — and the compression runs 100% in your browser, so your file is never uploaded or stored anywhere.",
  },
  {
    q: "What if my PDF is password-protected?",
    a: "Encrypted PDFs can't be processed by the browser, so they're rejected. Unlock the file first with a password you know, then compress the unlocked copy.",
  },
  {
    q: "Why is my PDF so large and how do I shrink it?",
    a: "Large PDFs are usually full of uncompressed images or leftover editing data. Structural compression removes the bloat and strips metadata — text-heavy files can shrink dramatically.",
  },

];

export default function CompressPdfPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/compress-pdf" },
          { name: "Compress PDF", path: "/tools/compress-pdf" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Compress PDF" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Compress <em>PDF</em> Online
            </>
          }
          tagline="A free PDF compressor: shrink file size with honest structural compression — unused objects removed, metadata stripped."
        />

        <CompressPdfClient />
        <PrivacyNote>
          Compression runs on your device with pdf-lib. Nothing is uploaded, stored, or seen by anyone but you.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Compress PDF</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A PDF compressor shrinks bloated documents so they email cleanly and upload without errors. Drop your PDF into this free online tool and it applies honest structural compression: removing unused objects, stripping metadata, and cleaning up the file's internal structure — all in your browser, with your document never uploaded anywhere. Anyone who has bounced off a 25MB email attachment limit knows exactly why this exists.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Here is the honest part most compressors skip: results depend on what is inside. Text-heavy PDFs with embedded bloat can shrink dramatically, while scanned PDFs — which are really just stacks of page images — barely budge with structural compression and would need image downsampling instead. Your text and layout stay pixel-identical either way; nothing is re-rendered at lower quality. If your file barely shrinks, the tool tells you so rather than pretending otherwise.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Honest limits"
          title={<>What it does — and <em>doesn't</em></>}
          sub="No magic-ratio claims. Here's the truth about PDF compression."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {[
            {
              t: "Removes unused objects",
              d: "PDFs accumulate dead objects — deleted pages, old revisions, orphaned fonts. The rebuild drops them, which can noticeably shrink sloppy files.",
            },
            {
              t: "Strips metadata",
              d: "Author names, creation dates, editing history, and producer tags are removed. Small savings, but a nice privacy bonus.",
            },
            {
              t: "Won't shrink optimized PDFs much",
              d: "A PDF that was exported cleanly is already tight. Expect small or zero savings — the tool tells you the exact result so there's no guessing.",
            },
            {
              t: "Scanned PDFs barely change",
              d: "Scans are mostly compressed image data. This tool never recompresses images, so scans come out essentially the same size — quality fully preserved.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>smaller files</em></>} />
        <Steps
          steps={[
            {
              title: "Upload your PDF",
              text: "Choose the PDF you want to shrink. It stays on your device — the tool reads it locally in your browser.",
            },
            {
              title: "Run the compression",
              text: "The PDF is rebuilt with packed object streams and its metadata is stripped. This takes seconds, even for big files.",
            },
            {
              title: "Check the result",
              text: "See the exact before-and-after sizes. If the savings are worth it, download the smaller file; if not, keep the original.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When compression <em>helps</em></>}
          sub="Slim files travel better."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {[
            {
              t: "Beat email attachment limits",
              d: "Gmail and most mail servers cap attachments around 25 MB. Trimming a bloated 28 MB report down to 19 MB gets it through.",
            },
            {
              t: "Upload forms & portals",
              d: "Government and job portals often limit uploads to 2–5 MB. A quick compression pass can get your documents under the cap.",
            },
            {
              t: "Faster sharing on slow connections",
              d: "A smaller PDF uploads faster on mobile data and opens quicker on older phones — worth it before sending to a WhatsApp group.",
            },
            {
              t: "Strip metadata before sharing",
              d: "Removing author names and creation dates is also a privacy win when you're sharing a document beyond its original audience.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Compress PDF <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["merge-pdf", "image-compressor", "image-to-pdf"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
