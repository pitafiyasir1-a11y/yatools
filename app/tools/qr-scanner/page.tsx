import QrScannerClient from "./ToolClient";
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
  slug: "qr-scanner",
  name: "QR Code Scanner",
  tagline: "Decode QR codes from photos or your live camera.",
  description:
    "Scan QR codes online: upload an image or use your live camera. Decodes instantly in your browser — free, private, no app needed.",
  category: "Everyday Utilities",
  keyword: "qr code scanner online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["qr-code-generator", "word-counter", "image-converter"],
};

export const metadata = pageMeta({
  title: "QR Code Scanner Online Free — Scan QR from Image or Camera",
  description:
    "Scan QR codes online for free: upload a photo or use your live camera. Instant decoding in your browser — no app, no sign-up, fully private.",
  path: "/tools/qr-scanner",
  keywords: [
    "qr code scanner online",
    "scan qr code from image",
    "qr code reader online free",
    "decode qr code camera",
  ],
});

const faqs = [
  {
    q: "How do I scan a QR code online?",
    a: "Two ways: upload a photo or screenshot that contains the code, or switch to the Live camera tab and scan a frame. The decoded text appears instantly with a copy button.",
  },
  {
    q: "Do I need to install an app?",
    a: "No. This scanner runs entirely in your web browser — on phones, tablets, and desktops. On mobile, the camera tab works like a built-in scanner app.",
  },
  {
    q: "The code won't scan. What should I try?",
    a: "Get closer so the code fills a good part of the frame, hold steady, and make sure it's evenly lit with no glare. Damaged or very tiny codes scan better from a screenshot than a shaky photo — zoom in and screenshot it first.",
  },
  {
    q: "Is it free?",
    a: "Yes — unlimited scans, no sign-up, no ads-in-your-face. Decoding runs on your device, so there's no server cost per scan.",
  },
  {
    q: "Is my scanned data private?",
    a: "Completely. The image is decoded inside your browser with the jsQR library. Your camera feed and photos are never uploaded, recorded, or stored anywhere.",
  },
  {
    q: "What can I do with the decoded text?",
    a: "The decoded text or URL is shown in full with a one-click copy button. If it's a link, paste it into your browser; if it's Wi-Fi credentials or contact info, copy it into the right app.",
  },
];

export default function QrScannerPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/qr-scanner" },
          { name: "QR Code Scanner", path: "/tools/qr-scanner" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "QR Code Scanner" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              QR Code <em>Scanner</em>
            </>
          }
          tagline="Decode QR codes from a photo or straight through your camera — free, instant, and private. No app needed."
        />

        <QrScannerClient />
        <PrivacyNote>
          Decoding runs 100% in your browser with jsQR. Your camera feed and images never leave your device.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>scan</em></>}
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
              t: "Image upload",
              d: "JPG, PNG, WebP — photos, screenshots, downloads. Images are downscaled for decoding; QR codes don't need megapixels.",
            },
            {
              t: "Live camera",
              d: "Uses your device camera with your permission. Works best with the code filling a good part of the frame, steady and glare-free.",
            },
            {
              t: "QR codes only",
              d: "This decodes QR codes. Other barcode types (EAN, Code128, Data Matrix) are not supported — upload only QR images.",
            },
            {
              t: "Privacy",
              d: "No accounts, no uploads, no tracking of what you scan. The camera stops the moment you leave the camera tab.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>decoded</em></>} />
        <Steps
          steps={[
            {
              title: "Pick your source",
              text: "Upload an image containing a QR code, or open the Live camera tab and grant camera permission.",
            },
            {
              title: "Scan",
              text: "Uploads decode automatically. With the camera, point at the code and hit “Scan this frame” when it's in view.",
            },
            {
              title: "Copy the result",
              text: "The decoded text or link appears instantly. Copy it with one click, or paste a URL straight into your browser.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When a scanner <em>helps</em></>}
          sub="Your phone camera app can't do all of these."
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
              t: "Codes in screenshots",
              d: "A QR code inside a screenshot, PDF, or document your camera can't reach? Upload it and decode without printing.",
            },
            {
              t: "Desktop scanning",
              d: "No phone handy — or the code is on your phone's own screen? Scan it on your desktop with the camera tab.",
            },
            {
              t: "Check before you scan",
              d: "Suspicious code in an email? Decode it here first to see where the link actually points before opening it.",
            },
            {
              t: "Copy long URLs",
              d: "QR-encoded links can be long and typo-prone. Decode once, copy exactly, and paste it where it belongs.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>QR scanner <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["qr-code-generator", "image-converter", "word-counter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
