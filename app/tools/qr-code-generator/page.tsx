import QrToolClient from "./ToolClient";
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
  toolBySlug,
} from "@/lib/site";

const tool = toolBySlug("qr-code-generator")!;

export const metadata = pageMeta({
  title: "Free QR Code Generator — Create QR Codes Online",
  description:
    "Generate free QR codes for URLs, text, Wi-Fi, email & SMS right in your browser. Add a center logo, style dots and corner eyes, custom colors with a contrast check, high-res PNG/SVG download. No sign-up.",
  path: "/tools/qr-code",
  keywords: [
    "free qr code generator",
    "qr code maker online",
    "create qr code for wifi",
    "qr code generator no signup",
    "qr code with logo",
    "custom qr code styles",
  ],
});

const faqs = [
  {
    q: "Is this QR code generator really free?",
    a: "Yes — unlimited codes, no sign-up, no watermarks, no expiry. The code encodes your text or URL directly, so it keeps working as long as the link itself stays live.",
  },
  {
    q: "Do my QR codes expire?",
    a: "No. Unlike some services that route scans through their own short links, YATools encodes your content straight into the code. Nothing is stored anywhere, so there is nothing to expire.",
  },
  {
    q: "Can I add my logo to the QR code?",
    a: "Yes — upload any image and it is composited into the center on a white rounded backdrop, auto-sized to at most 20% of the code so it stays scannable. When a logo is added, error correction is automatically bumped to at least Medium (15%) so the covered modules can be recovered. Always test-scan once before printing.",
  },
  {
    q: "Do styled codes (dots, round eyes, colors) still scan?",
    a: "On modern phones, yes — dot and rounded module styles and round or rounded corner eyes all scan fine as long as contrast stays strong. The tool warns you if your foreground/background contrast is too low. Inverted (light-on-dark) codes fail on many cameras, so stick to dark on light.",
  },
  {
    q: "Which error correction level should I choose?",
    a: "Error correction lets a code stay scannable even when part of it is damaged or covered. Low (7%) is fine for clean screens and prints; Medium (15%) is a good default and the minimum when you add a logo. Pick Quartile (25%) or High (30%) if the code will be small, printed on textured surfaces, or partially obscured — higher levels make the code denser, so keep the content short.",
  },
  {
    q: "What is the quiet zone and how big should it be?",
    a: "The quiet zone is the blank margin around the code that scanners use to find it. The standard is 4 modules and that is the default here; exports below 4 modules may scan poorly on prints or at a distance. Keep it at 4 or higher for anything that leaves the screen.",
  },
  {
    q: "What download size should I pick?",
    a: "512 px is fine for screens and messaging apps, 1024 px covers most printing, and 2048 px stays sharp on posters and large signage. SVG is vector, so it scales infinitely without losing sharpness — ideal for print designers.",
  },
  {
    q: "Is my data private?",
    a: "Completely. The QR code is generated inside your browser with a built-in encoder — your text, URLs, Wi-Fi passwords, and any logo you upload never leave your device.",
  },
];

export default function QrCodePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={webAppJsonLd({ ...tool, slug: "qr-code", name: "QR Code Generator" })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/qr-code" },
          { name: "QR Code Generator", path: "/tools/qr-code" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs
          trail={[
            { name: "Home", href: "/" },
            { name: "QR Code Generator" },
          ]}
        />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              QR Code <em>Generator</em>
            </>
          }
          tagline="Create crisp, scannable QR codes for links, text, Wi-Fi credentials, emails, and phone numbers — with your logo in the center, styled dots and corner eyes, and full color control. Instantly, in your browser."
        />

        <QrToolClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your text, URLs, and Wi-Fi passwords are never
          uploaded or stored anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your code</em></>} />
        <Steps
          steps={[
            {
              title: "Enter your content",
              text: "Paste a URL, type plain text, or fill in the Wi-Fi, email, SMS, or phone fields. The QR code updates live as you type.",
            },
            {
              title: "Tune the design",
              text: "Pick square, rounded, or dot module styles, restyle the corner eyes, set custom colors with a live contrast check, adjust the quiet-zone margin, and drop your logo into the center — the preview updates instantly.",
            },
            {
              title: "Download & share",
              text: "Save as high-res PNG (up to 2048 px) for print and screens, or as SVG for infinitely scalable vector output. Test-scan with your phone first, especially after styling.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Tips for <em>scannable codes</em></>}
          sub="Small choices that decide whether a code scans on the first try or not at all."
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
              t: "Shorter scans faster",
              d: "Long URLs make dense codes. Use a short link when the code will be printed small — fewer modules means easier scanning.",
            },
            {
              t: "Logos need Medium+",
              d: "A center logo covers up modules, so the tool auto-bumps error correction to Medium (15%) when you add one. Keep the content short and the logo at its default size for maximum reliability.",
            },
            {
              t: "Watch the contrast meter",
              d: "The tool warns you when your color pair is too low-contrast to scan. A dark code on a light background is the safest combo; inverted codes fail on many cameras.",
            },
            {
              t: "Keep a quiet zone",
              d: "Leave a clear margin around the code (4 modules is the standard and the default). Scanners need the blank border to find the code — shrink it only for on-screen use.",
            },
            {
              t: "Medium is the sweet spot",
              d: "Medium (15%) error correction survives smudges and small print defects without bloating the code like High does — and it is the minimum for logo codes.",
            },
            {
              t: "Wi-Fi codes join instantly",
              d: "The Wi-Fi format encodes SSID, security type, and password — guests scan once and connect, no typing long passwords.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Examples" title={<>What you can <em>encode</em></>} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>wifi-payload.txt</span>
            </div>
            <pre>{`WIFI:T:WPA;S:CoffeeShop_Guest;P:espresso123;H:false;;

Scan → phone joins the network
without typing the password.`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>link-payload.txt</span>
            </div>
            <pre>{`https://yatools.vercel.app/tools/qr-code

Print on a flyer, menu, or business
card → scanners land on your page.`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>QR code <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["password-generator", "color-picker", "website-screenshot"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
