import CertificateMakerClient from "./ToolClient";
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

const tool = toolBySlug("certificate-maker")!;

export const metadata = pageMeta({
  title: "Novelty Certificate Maker — Create Fun Certificates",
  description:
    "Make fun novelty certificates online: add a name, achievement, date, and signature, pick from 8 styles, download as PDF, PNG, or JPG. Free, 10 per day.",
  path: "/tools/certificate-maker",
  keywords: [
    "novelty certificate maker free",
    "fun certificate generator",
    "fake award certificate",
    "gag gift certificate maker",
    "certificate template download",
  ],
});

const faqs = [
  {
    q: "Is this an official certificate?",
    a: "No. This is a novelty certificate — not an official credential. It has no academic, legal, or professional value. It is for fun, jokes, parties, and personal use only.",
  },
  {
    q: "Can I use this for a job application or qualification?",
    a: "Absolutely not. Presenting a novelty certificate as a real qualification can have serious consequences, from losing a job offer to legal trouble. For real credentials, always go through accredited schools, universities, or certification bodies.",
  },
  {
    q: "What formats can I download my certificate in?",
    a: "PDF (best for printing), PNG (high-quality image), and JPG (smaller file, easy to share on WhatsApp or social media).",
  },
  {
    q: "How many certificates can I make?",
    a: "10 free certificates per day per IP address. The counter resets daily, and you don't need an account.",
  },
  {
    q: "What can I put on the certificate?",
    a: "Any recipient name, achievement text, date, and signature line you like. Tip: avoid using the names or logos of real universities or institutions — the certificate should never look like it's from an organization it isn't.",
  },
  {
    q: "Is my name stored anywhere?",
    a: "No. Your inputs are sent only to generate the certificate file and are not kept. Feel free to use nicknames if you prefer.",
  },
];

export default function CertificateMakerPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/certificate-maker" },
          { name: "Certificate Maker", path: "/tools/certificate-maker" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Certificate Maker" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Novelty <em>Certificate Maker</em>
            </>
          }
          tagline="Create fun novelty certificates in seconds — add a name, achievement, date, and signature, pick from 8 styles, and download as PDF, PNG, or JPG."
        />

        <div className="notice notice-warn" style={{ marginBottom: 20 }}>
          <strong>Novelty certificate — not an official credential.</strong> It has no academic,
          legal, or professional value. For fun and personal use only.
        </div>

        <CertificateMakerClient />
        <PrivacyNote>
          Your name and details are used only to generate the certificate file — nothing is stored
          or reused.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your award</em></>} />
        <Steps
          steps={[
            {
              title: "Fill in the details",
              text: "Enter the recipient's name, what they achieved, the date, and a signature line. A nickname or a joke title works perfectly here.",
            },
            {
              title: "Pick a style and format",
              text: "Choose from 8 certificate styles — from Modern to Golden Elegant — then decide whether you want a PDF for printing, a PNG for quality, or a JPG for easy sharing.",
            },
            {
              title: "Generate and download",
              text: "Hit the button, wait a few seconds, and your certificate is ready to download, open full-size, or print. 10 free certificates per day, no account needed.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Fun, <em>with honesty</em></>}
          sub="The important ground rules for this tool."
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
              t: "Novelty only",
              d: "Every certificate made here is a novelty item. It is not an official credential and carries no academic, legal, or professional value — don't present it as one.",
            },
            {
              t: "8 styles to choose from",
              d: "Modern, Dark Background, Green, Classic, Red and Yellow, Golden Elegant, Blue Simple, and Golden and Green — each with its own look for a different kind of joke or celebration.",
            },
            {
              t: "10 per day, free",
              d: "Everyone gets 10 free certificates per day per IP address — plenty for a party, an office awards night, or a family game night. No sign-up, no payment.",
            },
            {
              t: "Made for sharing",
              d: "Download as a JPG to drop into a WhatsApp group, a PNG for a crisp social post, or a PDF to print and frame as a gag gift. Kids' reading challenges and pet awards are all-time classics.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Examples" title={<>Typical <em>use cases</em></>} />
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
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>party-awards.txt</span>
            </div>
            <pre>{`Office farewell party:
"World's Best Coffee Maker"
"Most Likely to Reply-All"
Golden Elegant style, printed.`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>kids-achievements.txt</span>
            </div>
            <pre>{`Summer reading challenge:
"Super Reader — 20 Books!"
Classic style, JPG,
framed on the bedroom wall.`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Certificate maker <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={tool.related} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
