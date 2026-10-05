import ImageToPdfClient from "./ToolClient";
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
} from "@/lib/site";

const tool: ToolDef = {
  slug: "image-to-pdf",
  name: "Image to PDF",
  tagline: "Turn JPG, PNG, and WebP images into a single PDF.",
  description:
    "Combine multiple images into one PDF document. Choose page size, orientation, and margins — all in your browser, free.",
  category: "Screenshots & PDF",
  keyword: "jpg to pdf online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["text-to-pdf", "pdf-to-jpg", "merge-pdf"],
};

export const metadata = pageMeta({
  title: "JPG to PDF Online Free — Convert Images to PDF",
  description:
    "Convert JPG, PNG, and WebP images to PDF for free. Reorder pages, pick A4/Letter/fit-to-image, set margins — all in your browser.",
  path: "/tools/image-to-pdf",
  keywords: [
    "jpg to pdf online",
    "image to pdf converter",
    "png to pdf free",
    "convert photos to pdf",
  ],
});

const faqs = [
  {
    q: "How do I convert JPG to PDF?",
    a: "Add your images, drag or use the arrows to order them (one image per page), pick a page size and margins, then download. The whole thing runs in your browser — nothing is uploaded.",
  },
  {
    q: "Can I change the order of the images?",
    a: "Yes. Thumbnails appear in the order they'll land in the PDF. Use the arrow buttons on each thumbnail to move images earlier or later before building the file.",
  },
  {
    q: "What page sizes are supported?",
    a: "A4 and US Letter, with portrait, landscape, or auto orientation (auto matches each image's shape). “Fit to image” makes every page exactly the size of its image — handy for documents that shouldn't be cropped or scaled.",
  },
  {
    q: "Will my photos lose quality?",
    a: "JPEG photos are embedded at high quality (92%), and PNG/WebP images are kept as PNG — sharp, no extra compression. Pages are never upscaled beyond the image's own pixels, so nothing looks worse than the original.",
  },
  {
    q: "Is it free, and do my photos stay private?",
    a: "Completely free — no sign-up, no watermark, no limits on images. And yes, everything runs locally in your browser tab; your photos never leave your device.",
  },
  {
    q: "Can I convert WebP images to PDF?",
    a: "Yes. WebP files are accepted alongside JPG and PNG. They're converted to PNG internally before being placed in the PDF, so transparency and quality are preserved.",
  },
];

export default function ImageToPdfPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/image-to-pdf" },
          { name: "Image to PDF", path: "/tools/image-to-pdf" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Image to PDF" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Image to <em>PDF</em>
            </>
          }
          tagline="Turn photos and scans into a proper PDF — pick page size, orientation, and margins, all free in your browser."
        />

        <ImageToPdfClient />
        <PrivacyNote>
          Images are converted with jsPDF on your device. Nothing is uploaded, stored, or seen by anyone but you.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>convert</em></>}
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
              d: "JPG, JPEG, PNG, and WebP. One image becomes one page; add as many as you like — the PDF grows page by page.",
            },
            {
              t: "Output",
              d: "A standard .pdf: A4 or Letter pages, or “fit to image” for pages that match each photo exactly.",
            },
            {
              t: "Quality",
              d: "JPEGs embed at 92% quality; PNG/WebP stay lossless. Images are scaled down to fit, never upscaled beyond their pixels.",
            },
            {
              t: "Limits",
              d: "No file count cap, no watermark, no sign-up. Very large photos are resized by the browser before embedding, which keeps memory in check.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your PDF</em></>} />
        <Steps
          steps={[
            {
              title: "Add your images",
              text: "Upload JPG, PNG, or WebP files. Thumbnails appear in the order they'll become pages — rearrange them if needed.",
            },
            {
              title: "Choose layout",
              text: "Pick A4, Letter, or fit-to-image page size, set orientation, and add margins. Fit-to-image keeps scans at their exact size.",
            },
            {
              title: "Download the PDF",
              text: "Hit the download button. Your browser builds the PDF locally and saves it — one image per page, in your order.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When images-to-PDF <em>helps</em></>}
          sub="A PDF is easier to send, print, and archive."
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
              t: "Phone scans of documents",
              d: "Photographed receipts, certificates, or ID cards become one tidy PDF you can attach to emails and forms.",
            },
            {
              t: "Portfolio & assignments",
              d: "Students and designers: bundle artwork photos or assignment pages into a single file for submission.",
            },
            {
              t: "Photo albums",
              d: "Turn event photos into a shareable PDF album that anyone can open — no photo app required on the other end.",
            },
            {
              t: "Signed paperwork",
              d: "Photograph each signed page of a contract, order them, and export a single PDF to file or send to the other party.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Image to PDF <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["text-to-pdf", "image-compressor", "image-resizer"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
