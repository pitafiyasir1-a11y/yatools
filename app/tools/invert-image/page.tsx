import InvertImageClient from "./ToolClient";
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
  slug: "invert-image",
  name: "Invert Image",
  tagline: "Flip any photo into its negative with one click.",
  description:
    "Invert image colors online for free. Upload a photo and flip every pixel to its opposite color — instant photo-negative effect, right in your browser.",
  category: "Everyday Utilities",
  keyword: "invert image colors online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["image-converter", "image-resizer", "background-remover"],
};

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Invert Image Colors — YATools",
    url: `${SITE.url}/tools/invert-image`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Invert image colors free online — turn any photo into its negative with one click. Instant, private, in-browser processing, no sign-up needed. Try it now!",
  };
}

export const metadata = pageMeta({
  title: "Invert Image Colors - Free Photo Negative Effect Online",
  description:
    "Invert image colors free online — turn any photo into its negative with one click. Instant, private, in-browser processing, no sign-up needed. Try it now!",
  path: "/tools/invert-image",
  keywords: [
    "invert image colors online",
    "invert image",
    "photo negative effect",
    "negative image maker",
    "invert colors",
  ],
});

const faqs = [
  {
    q: "What does inverting an image do?",
    a: "Inverting flips every color channel to its opposite: black becomes white, blue becomes orange, and so on. The result is the classic photographic negative effect — useful for dark-mode mockups, print negatives, and stylized edits.",
  },
  {
    q: "Will inverting reduce the quality of my image?",
    a: "No. The inversion happens pixel-by-pixel at the original resolution, so dimensions and sharpness stay the same. PNG download is lossless; JPG applies its usual mild compression.",
  },
  {
    q: "Should I download as PNG or JPG?",
    a: "Choose PNG when you want a perfect, lossless copy of the inverted image. Choose JPG for smaller files when you're sharing online or don't need transparency.",
  },
  {
    q: "Is my image uploaded anywhere?",
    a: "No. The inversion runs entirely on your device with the browser's canvas engine — your image never leaves your computer, and nothing is stored.",
  },
  {
    q: "Can I invert the same image twice to get the original back?",
    a: "Yes — inverting is a perfect round trip. Invert an inverted image and you get the exact original back (PNG to PNG).",
  },
  {
    q: "How do I make a photo negative online?",
    a: "Upload your photo and hit invert — the negative version renders instantly and you can download it as PNG or JPG.",
  },
  {
    q: "Will inverting twice restore my original photo?",
    a: "Yes, exactly. Inverting maps every color to its opposite, so applying it a second time returns every pixel to its original value — the round trip is pixel-perfect.",
  },
  {
    q: "Does inverting work on black-and-white photos?",
    a: "Yes, and the results are striking. Grayscale images invert cleanly into classic film-negative looks, which is why photographers use inversion to preview dramatic monochrome edits.",
  },

];

export default function InvertImagePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Invert Image", path: "/tools/invert-image" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Invert Image" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Invert Image <em>Colors</em> Online
            </>
          }
          tagline="A free invert-image tool: turn any photo into its negative in one click — private, in-browser, instant."
        />

        <InvertImageClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your image is never uploaded, processed, or
          stored anywhere.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Invert Image Colors</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            Inverting an image flips every pixel to its opposite color — turning a photo into its negative, like classic film. Upload any picture to this free online tool and get the inverted version instantly, right in your browser. Designers create striking negative-space artwork, educators demonstrate how film negatives work, and photographers preview dramatic alternate edits; some people even invert dark screenshots for easier reading.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The effect is perfectly reversible: invert the result a second time and you get your original back, pixel for pixel. Inverting does not reduce quality or change dimensions — it only remaps colors. Download the result as PNG for lossless quality or JPG for smaller files. Because the whole operation runs on your device, your photos are never uploaded, stored, or seen by anyone but you.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>negative</em></>} />
        <Steps
          steps={[
            {
              title: "Upload a photo",
              text: "Drag and drop any image (PNG, JPG, WebP, GIF, BMP) or click to browse. It opens instantly in the before/after viewer.",
            },
            {
              title: "Invert the colors",
              text: "Hit Invert colors and every pixel is flipped to its exact opposite — black to white, red to cyan — at full resolution.",
            },
            {
              title: "Download it",
              text: "Pick PNG for a lossless copy or JPG for a smaller file, then download the negative to your device.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>When <em>inversion</em> comes in handy</>}
          sub="The negative effect is more than a filter — people use it for real work."
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
              t: "Dark-mode previews",
              d: "Invert a light UI screenshot to rough out how it would look as a dark theme before touching any code.",
            },
            {
              t: "Print negatives",
              d: "Need a negative for screen printing, cyanotypes, or alternative photography? Invert once and print.",
            },
            {
              t: "Reading scanned text",
              d: "White text on dark scans is easier on the eyes for many readers — invert a dark scan and read comfortably.",
            },
            {
              t: "Stylized edits",
              d: "Negatives make striking thumbnails, posters, and social posts. Invert twice to return to the exact original.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Inversion <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["image-converter", "image-resizer", "mirror-image"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
