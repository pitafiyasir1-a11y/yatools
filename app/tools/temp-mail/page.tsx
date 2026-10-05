import TempMailClient from "./ToolClient";
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
  slug: "temp-mail",
  name: "Temporary Email",
  tagline: "Disposable inboxes for sign-ups, minus the spam.",
  description:
    "Free temporary email generator. Create a disposable address in one click and read incoming mail — receive-only, no sign-up, addresses expire automatically.",
  category: "Everyday Utilities",
  keyword: "temporary email generator",
  badge: "API",
  badgeColor: "blue",
  api: "/api/v1/mail",
  related: ["qr-code-generator", "password-generator", "word-counter"],
};

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Temporary Email — YATools",
    url: `${SITE.url}/tools/temp-mail`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Get a free temporary email address online — a disposable inbox for sign-ups and verification codes. Receive-only, no sign-up needed, auto-expiry. Try it now!",
  };
}

export const metadata = pageMeta({
  title: "Temporary Email Generator - Free Disposable Inbox Online",
  description:
    "Get a free temporary email address online — a disposable inbox for sign-ups and verification codes. Receive-only, no sign-up needed, auto-expiry. Try it now!",
  path: "/tools/temp-mail",
  keywords: [
    "temporary email generator",
    "temporary email",
    "disposable email",
    "temp mail",
    "fake email",
  ],
});

const faqs = [
  {
    q: "What is a temporary email address?",
    a: "A throwaway inbox you can use instead of your real address — handy for one-time sign-ups, downloads, and free trials that demand an email. You can read incoming mail here, and the address expires on its own.",
  },
  {
    q: "Can I send emails from it?",
    a: "No — this is receive-only by design. There's no compose or reply function, which is also what keeps the service abuse-resistant.",
  },
  {
    q: "How long does an address last?",
    a: "Addresses expire automatically after a short period. Treat every temp address as short-lived: grab your verification code and move on.",
  },
  {
    q: "Is it safe to use for important accounts?",
    a: "Absolutely not. Never use a temporary address for account recovery, banking, work email, or anything you can't afford to lose — you cannot recover access, and anyone who knows the address can read its inbox.",
  },
  {
    q: "Why didn't my verification email arrive?",
    a: "Some sites block disposable domains outright, and some mail is simply slow. Wait a minute, hit Check inbox again, and check whether the site accepts temp addresses at all — many don't.",
  },
  {
    q: "Is there a usage limit?",
    a: "Yes — 20 mail actions per day per visitor. That's plenty for normal one-off sign-ups and keeps the free service abuse-resistant.",
  },
  {
    q: "How do I get a disposable email for sign-ups?",
    a: "Click generate on this page to create a random address instantly, paste it into the sign-up form, and read the incoming verification mail right here.",
  },

];

export default function TempMailPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Temporary Email", path: "/tools/temp-mail" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Temporary Email" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Temporary <em>Email</em> Online
            </>
          }
          tagline="A free temporary email generator: a disposable inbox in one click — perfect for sign-ups that don't deserve your real address."
        />

        <TempMailClient />
        <PrivacyNote>
          We don&apos;t ask for any personal details to create an address. Inbox contents come
          from the mail provider through our proxy and are never stored by us — but remember,
          anyone with the address can read its mail.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Temporary Email</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A temporary email gives you a throwaway inbox for the sign-ups, downloads, and free trials that demand an address but do not deserve your real one. One click on this free tool creates a random disposable address; incoming mail lands in the inbox panel and auto-refreshes, so verification codes and download links appear without ever touching your personal inbox. It is receive-only by design — no sending, no replies — which keeps the service simple and abuse-resistant.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Use it wisely and it is a genuine privacy shield: one-off registrations, beta waitlists, forum accounts, and gated content. Never use it for anything you cannot afford to lose — password recovery, banking, work accounts — because addresses expire automatically and anyone who knows the address can read its mail. Some sites block disposable domains outright; that is their policy, not a bug. The service allows 20 mail actions per day per visitor, plenty for normal one-off use.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>clean inbox</em></>} />
        <Steps
          steps={[
            {
              title: "Generate an address",
              text: "One click creates a random disposable address — add a custom name first if you want something memorable.",
            },
            {
              title: "Use it anywhere",
              text: "Paste the address into the sign-up form, download gate, or trial that asked for your email.",
            },
            {
              title: "Read the mail",
              text: "Incoming messages land in the inbox panel and auto-refresh every 30 seconds. Open, copy your code, and discard the address when done.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Using temp mail <em>wisely</em></>}
          sub="Disposable email is a shield for your real inbox — here's how to hold it right."
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
              t: "Perfect for one-off sign-ups",
              d: "Free trials, ebook downloads, forum accounts, beta waitlists — anywhere you'd rather not hand over your real address.",
            },
            {
              t: "Never for recovery",
              d: "Password resets, 2FA backup, banking, and work accounts must use an address you permanently control. A temp inbox can't do that job.",
            },
            {
              t: "Assume it's public",
              d: "Temp addresses are guessable and readable by anyone who knows them. Never receive passwords, personal documents, or sensitive codes through one.",
            },
            {
              t: "Some sites say no",
              d: "Many services block disposable domains at sign-up. If a site rejects the address, that's their policy — use a real address or skip the service.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Temp mail <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["qr-code-generator", "password-generator", "word-counter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
