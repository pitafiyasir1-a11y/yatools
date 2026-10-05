import PasswordGeneratorClient from "./ToolClient";
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
  SITE,
} from "@/lib/site";

const tool = toolBySlug("password-generator")!;

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Password Generator — YATools",
    url: `${SITE.url}/tools/password-generator`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Generate strong random passwords free online with crypto-grade randomness. Custom length, symbols, and memorable options. Nothing stored, ever. Try now!",
  };
}

export const metadata = pageMeta({
  title: "Password Generator - Create Strong Passwords Free Online",
  description:
    "Generate strong random passwords free online with crypto-grade randomness. Custom length, symbols, and memorable options. Nothing stored, ever. Try now!",
  path: "/tools/password-generator",
  keywords: [
    "password generator",
    "random password",
    "password maker",
    "secure password",
    "create password",
  ],
});

const faqs = [
  {
    q: "Are the generated passwords truly random?",
    a: "Yes. Passwords are generated with crypto.getRandomValues — the browser's cryptographically secure random number generator — with rejection sampling to avoid modulo bias. Each character is independently random, and every selected character set is guaranteed to appear at least once.",
  },
  {
    q: "Is my password sent anywhere?",
    a: "No. Generation happens entirely in your browser's memory; nothing is uploaded, logged, or transmitted. You can even disconnect from the internet after the page loads and it keeps working.",
  },
  {
    q: "What do the strength labels mean?",
    a: "Strength is estimated from entropy: password length × log₂ of the possible-character pool. Under 40 bits is Weak, 60+ is Good, and 100+ bits (e.g. 16+ characters from all four sets) is Excellent — far beyond what brute force can touch.",
  },
  {
    q: "What length should I use?",
    a: "16 characters from all four sets (≈105 bits of entropy) is a strong default for important accounts. For Wi-Fi or shared secrets people must type, 12 characters without ambiguous symbols is a good balance. Longer is always better if a password manager fills it in.",
  },
  {
    q: "Should I use the symbols option?",
    a: "Yes when the site allows it — symbols expand the character pool from 62 to 88+ characters, adding roughly 8 bits of entropy at the same length. Some older systems reject certain symbols; if a site complains, regenerate without symbols.",
  },
  {
    q: "How do I create a strong random password for free?",
    a: "Set the length to 16 or more characters, enable all character types, and generate — then save it in a password manager instead of reusing it anywhere.",
  },

];

export default function PasswordGeneratorPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/password-generator" },
          { name: "Password Generator", path: "/tools/password-generator" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Password Generator" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Password <em>Generator</em> Online
            </>
          }
          tagline="A free password generator: create strong, random passwords with crypto-grade randomness — nothing stored, ever."
        />

        <PasswordGeneratorClient />
        <PrivacyNote>
          Passwords are generated 100% in your browser with crypto.getRandomValues — they are never
          uploaded, stored, or transmitted. For important accounts, store them in a password manager
          and enable two-factor authentication.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Password Generator</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A password generator creates truly random passwords that no human would ever invent — and that is exactly the point. This free online tool uses your browser's cryptographic random number generator, the same grade of randomness operating systems use for security keys, to build passwords of any length with uppercase, lowercase, numbers, and symbols. Use a unique 16-plus-character password for every account and a password manager to remember them; that single habit defeats the vast majority of account-takeover attacks.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The strength meter labels each password so you can see the difference length makes — every extra character multiplies the guessing effort enormously. Prefer something typable? The memorable mode builds pronounceable passwords that are easier to dictate over the phone. Generation happens entirely on your device: your passwords are never sent anywhere, never logged, and never stored, which is precisely how a password tool should behave.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>strong password</em></>} />
        <Steps
          steps={[
            {
              title: "Set length & sets",
              text: "Drag the slider (6–64 characters) and toggle uppercase, lowercase, digits, and symbols. Excluding ambiguous characters is optional.",
            },
            {
              title: "Generate",
              text: "Each password uses crypto-grade randomness with no modulo bias, and always includes at least one character from every set you selected.",
            },
            {
              title: "Copy & store",
              text: "Copy it into a password manager. Never reuse passwords across sites — a breach on one site shouldn't unlock the rest.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>How <em>strength</em> works</>}
          sub="Honest numbers, not marketing — what actually makes a password hard to crack."
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
              t: "Entropy, not cleverness",
              d: "Strength = length × log₂(pool size). A random 16-character password from all sets has ~105 bits of entropy — no pattern to guess, no dictionary to try. That's what the meter measures.",
            },
            {
              t: "Length beats complexity",
              d: "Adding 2 characters helps more than adding symbols. A 20-character lowercase-only password (~94 bits) beats an 8-character mixed one (~53 bits). When in doubt, go longer.",
            },
            {
              t: "Unique per site",
              d: "The biggest real-world risk isn't guessing — it's credential stuffing from breaches. A unique random password per site, kept in a manager, neutralizes that completely.",
            },
            {
              t: "No modulo bias",
              d: "Naive random generators skew toward some characters. This tool uses rejection sampling on crypto.getRandomValues, so every character in the pool is equally likely.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Examples" title={<>Sensible <em>defaults</em></>} />
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
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>important-accounts.txt</span>
            </div>
            <pre>{`Length: 20 · all four sets on
≈ 131 bits of entropy → Excellent

Use for: email, banking, cloud,
password manager master password.`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>shared-secrets.txt</span>
            </div>
            <pre>{`Length: 12 · symbols off,
exclude ambiguous on
≈ 71 bits → Good, easy to read out

Use for: Wi-Fi, shared docs,
temporary access codes.`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Password <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["qr-code-generator", "base64-encoder-decoder", "word-counter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
