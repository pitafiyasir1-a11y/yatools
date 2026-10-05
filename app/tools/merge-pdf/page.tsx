import MergePdfClient from "./ToolClient";
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
  slug: "merge-pdf",
  name: "Merge PDF",
  tagline: "Combine multiple PDFs into one, in your chosen order.",
  description:
    "Merge multiple PDF files into a single PDF document, in the order you choose. Files are combined right in your browser — nothing is uploaded.",
  category: "Screenshots & PDF",
  keyword: "merge pdf online free",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["split-pdf", "rotate-pdf", "text-to-pdf"],
};

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Merge PDF — YATools",
    url: `${SITE.url}/tools/merge-pdf`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Merge PDF files free online — combine multiple PDFs into one document in your chosen order. In-browser, private, no sign-up needed. Try it free right now!",
  };
}

export const metadata = pageMeta({
  title: "Merge PDF Online Free - Combine PDF Files into One",
  description:
    "Merge PDF files free online — combine multiple PDFs into one document in your chosen order. In-browser, private, no sign-up needed. Try it free right now!",
  path: "/tools/merge-pdf",
  keywords: [
    "merge pdf online free",
    "merge PDF",
    "combine PDF",
    "join PDF files",
    "PDF merger",
  ],
});

const faqs = [
  {
    q: "Is this PDF merger really free?",
    a: "Yes. There are no limits on the number of files, no sign-up, and no watermarks. Merging happens entirely in your browser, so it costs us nothing to run — which is why it can stay free.",
  },
  {
    q: "Is my PDF uploaded to a server?",
    a: "No. Your files never leave your device. The merge runs inside your browser tab using the pdf-lib library, and the combined file is downloaded straight to your computer. Safe for contracts, bank statements, and other sensitive documents.",
  },
  {
    q: "Can I change the order of the PDFs before merging?",
    a: "Yes — that is the whole point of the list. Drag files up and down (or use the arrow buttons) to set the exact order. The top file becomes the first pages of the merged PDF.",
  },
  {
    q: "What if one of my PDFs is password-protected?",
    a: "Password-protected PDFs can't be merged until the password is removed, because the browser can't read their pages. Open the file in your PDF reader with the password and re-save or print it to a new PDF without a password, then merge.",
  },
  {
    q: "How many PDFs can I merge at once?",
    a: "There is no fixed limit, but very large files use a lot of browser memory. If the merge stalls, try combining fewer files at a time and then merging those results.",
  },
  {
    q: "Does merging change my PDF quality?",
    a: "No. Pages are copied as-is — text, images, and formatting are preserved exactly. The merged file is simply all the original pages glued together in your order.",
  },
  {
    q: "How do I merge PDF files for free without uploading them?",
    a: "Drop your PDFs here, arrange the order, and merge — the files combine entirely in your browser and are never sent to a server.",
  },

];

export default function MergePdfPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/merge-pdf" },
          { name: "Merge PDF", path: "/tools/merge-pdf" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Merge PDF" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Merge <em>PDF</em> Online
            </>
          }
          tagline="A free PDF merger: combine multiple PDFs into one document in the exact order you choose — in your browser."
        />

        <MergePdfClient />
        <PrivacyNote>
          Files are merged on your device with pdf-lib. Nothing is uploaded, stored, or seen by anyone but you.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Merge PDF</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            Merging PDFs combines several documents into one file, in the order you decide. Drop your PDFs into this free online tool, drag them into the right sequence, and download a single merged document in seconds. Job seekers bundle a resume with certificates, students combine assignment chapters, accountants merge monthly statements, and anyone assembling a report stops juggling five attachments.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The merge happens entirely in your browser using a real PDF engine — your files are never uploaded to a server, which matters for contracts, financial records, and personal documents. Page quality is preserved exactly as in the originals: merging rearranges pages rather than re-rendering them. If one of your PDFs is password-protected you will need to unlock it first, since the tool cannot and will not bypass document security.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>merge</em></>}
          sub="Straightforward limits, stated plainly."
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
              t: "Input",
              d: ".pdf files, any size your browser can hold in memory. Very large files (hundreds of MB) may be slow or fail — merge those in smaller batches.",
            },
            {
              t: "Output",
              d: "One combined .pdf with all pages preserved exactly as they were — text, images, and layout untouched.",
            },
            {
              t: "Encrypted files",
              d: "Password-protected PDFs are rejected. Remove the password first (with the password you know), then merge.",
            },
            {
              t: "No limits",
              d: "No file-count cap, no account, no watermark. Just note that merging dozens of huge files can run your browser out of memory.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>one PDF</em></>} />
        <Steps
          steps={[
            {
              title: "Add your PDFs",
              text: "Click the button and pick two or more PDF files. They appear in a numbered list in the order you added them.",
            },
            {
              title: "Arrange the order",
              text: "Drag files up and down — or use the arrow buttons — until the list matches the order you want in the final document.",
            },
            {
              title: "Merge & download",
              text: "Hit the merge button. Your browser stitches the pages together and offers the combined PDF for download.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When merging <em>helps</em></>}
          sub="One document beats a zip of five."
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
              t: "Job applications",
              d: "Resume, cover letter, and certificates in one file — recruiters open a single attachment instead of three.",
            },
            {
              t: "Invoices & receipts",
              d: "Combine a month of receipts into one PDF for your accountant or tax filing. One upload, done.",
            },
            {
              t: "Study material",
              d: "Merge lecture slides, notes, and past papers into a single study pack you can search and scroll through.",
            },
            {
              t: "Legal & contracts",
              d: "Gather signed pages, annexures, and scans into one contract document — without sending sensitive files to a random website.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Merge PDF <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["split-pdf", "rotate-pdf", "text-to-pdf"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
