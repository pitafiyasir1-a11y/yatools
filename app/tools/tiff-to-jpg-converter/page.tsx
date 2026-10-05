import TiffToJpgClient from "./ToolClient";
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
import { softwareAppJsonLd } from "../_conv-shared/seo";

const tool: ToolDef = {
  slug: "tiff-to-jpg-converter",
  name: "TIFF to JPG Converter",
  tagline: "A free TIFF to JPG converter: turn TIFF scans and photos — even multi-page — into shareable JPGs.",
  description:
    "Free online TIFF to JPG converter: turn .tif/.tiff scans (even multi-page) into shareable JPGs in your browser. No upload, no sign-up.",
  category: "Everyday Utilities",
  keyword: "tiff to jpg",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "jpg-to-png-converter",
    "png-to-jpg-converter",
    "image-converter"
],
};

export const metadata = pageMeta({
  title: "TIFF to JPG Converter - Convert TIFF Scans Free Online",
  description:
    "TIFF to JPG converter, free online: turn TIFF scans and photos — even multi-page files — into shareable JPGs in your browser. No watermarks, ever. Try it now!",
  path: "/tools/tiff-to-jpg-converter",
  keywords: [
    "TIFF to JPG",
    "TIFF to JPG converter",
    "convert TIFF to JPG",
    "TIF to JPEG",
    "TIFF to JPG high quality",
  ],
});

const faqs = [
  {
    q: "What is a TIFF file, and why convert it?",
    a: "TIFF is a high-quality, often uncompressed image format used by scanners, cameras, and print shops. The files are huge and many apps can't open them. JPG is universally supported and far smaller — perfect for sharing, emailing, or uploading.",
  },
  {
    q: "My TIFF has multiple pages. How does that work?",
    a: "Scanners often pack every scanned page into one multi-page TIFF. This tool lists all pages — pick the one you want from the page selector and convert it to its own JPG. Convert each page you need, one at a time.",
  },
  {
    q: "Will I lose quality converting TIFF to JPG?",
    a: "A little — JPG is a lossy format. At the default 92% quality the difference is invisible for scans and photos, while the file typically shrinks 5–20×. If you need pixel-perfect archival copies, keep the original TIFF.",
  },
  {
    q: "One of my pages won't convert. Why?",
    a: "TIFF has dozens of proprietary compression flavors, and a few rare ones can't be decoded in a browser. If a page fails, open it in a desktop app (even free ones like IrfanView or GIMP) and re-export it as an uncompressed TIFF, then try again.",
  },
  {
    q: "Is my TIFF uploaded anywhere?",
    a: "No. The UTIF decoding engine runs entirely in your browser. Your scans never leave your device — which matters, since scans are often sensitive documents.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert a TIFF to JPG",
  description: "Turn a TIFF scan into a shareable JPG with YATools' free converter.",
  step: [
    {
      "@type": "HowToStep",
      name: "Upload your TIFF",
      text: "Drop a .tif or .tiff file (up to 100 MB) onto the tool. It stays in your browser — nothing is uploaded.",
    },
    {
      "@type": "HowToStep",
      name: "Pick a page and quality",
      text: "For multi-page TIFFs, choose the page to convert from the selector, and set the JPG quality (92% is the sweet spot).",
    },
    {
      "@type": "HowToStep",
      name: "Convert and download",
      text: "Hit Convert, preview the result, then download the JPG — usually dramatically smaller than the original TIFF.",
    },
  ],
};

export default function TiffToJpgPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={howToJsonLd} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/tiff-to-jpg-converter" },
          { name: "TIFF to JPG Converter", path: "/tools/tiff-to-jpg-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "TIFF to JPG Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free TIFF to <em>JPG Converter</em> Online
            </>
          }
          tagline="A free TIFF to JPG converter: turn TIFF scans and photos — even multi-page — into shareable JPGs."
        />

        <TiffToJpgClient />
        <PrivacyNote>
          Decoding runs 100% in your browser with the UTIF engine. Your scans are never uploaded, stored, or seen by anyone but you.
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
              t: "Inputs",
              d: ".tif / .tiff files up to 100 MB — single or multi-page, from scanners, cameras, or design apps.",
            },
            {
              t: "Multi-page support",
              d: "Every page in the TIFF is listed. Pick the page you need and convert it to its own JPG — no desktop software required.",
            },
            {
              t: "Output",
              d: "Standard JPG with an adjustable quality slider (default 92%). Transparent areas become white — JPG has no alpha channel.",
            },
            {
              t: "Honest limits",
              d: "A few rare proprietary TIFF compressions can't be decoded in any browser. If a page fails, re-export it as uncompressed TIFF and retry.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>shareable</em> JPG</>} />
        <Steps
          steps={[
            {
              title: "Drop in your TIFF",
              text: "Choose a .tif or .tiff file up to 100 MB. It never leaves your browser — decoding happens on your device.",
            },
            {
              title: "Pick a page & quality",
              text: "For multi-page TIFFs, select the page to convert. Set JPG quality — 92% is the sweet spot for scans.",
            },
            {
              title: "Convert & download",
              text: "Hit Convert, check the preview, then download the JPG with exact dimensions and file size shown.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When JPG beats <em>TIFF</em></>}
          sub="TIFF is for archiving. JPG is for everything else."
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
              t: "Share scanned documents",
              d: "A 40 MB scanned contract becomes a 2 MB JPG you can actually email or attach to a form.",
            },
            {
              t: "Upload to websites",
              d: "Most upload forms, CMSs and marketplaces don't accept TIFF. Convert once and upload anywhere.",
            },
            {
              t: "Split multi-page scans",
              d: "Turn each page of a scanned TIFF into its own JPG — handy for sending individual pages to different people.",
            },
            {
              t: "Phone-friendly archives",
              d: "TIFFs won't open in most phone galleries. JPGs open everywhere, so your scans are viewable on any device.",
            },
            {
              t: "Print-shop prep",
              d: "Need a quick proof of a TIFF for a client? A 92%-quality JPG shows exactly what the scan looks like at a tenth of the size.",
            },
            {
              t: "Private by default",
              d: "Scans are often sensitive — IDs, contracts, medical records. Converting locally means they never touch a server.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>TIFF to JPG <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["jpg-to-png-converter", "png-to-jpg-converter", "image-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
