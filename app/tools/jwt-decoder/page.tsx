import JwtDecoderClient from "./ToolClient";
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

const tool = toolBySlug("jwt-decoder")!;

export const metadata = pageMeta({
  title: "JWT Decoder Online - Decode JSON Web Tokens Free",
  description:
    "JWT decoder online: paste a JSON Web Token to see its decoded header and payload, with expiry shown. The signature is not verified — decoding only. 100% in-browser, private.",
  path: "/tools/jwt-decoder",
  keywords: [
    "jwt decoder online",
    "jwt decoder",
    "decode jwt token",
    "jwt.io alternative",
    "json web token decoder",
    "jwt parser free",
  ],
});

const faqs = [
  {
    q: "How do I decode a JWT?",
    a: "Paste the whole token (header.payload.signature) into the box. The header and payload decode instantly as JSON, with issued and expiry times shown in plain dates.",
  },
  {
    q: "Does this verify the signature?",
    a: "No — and that matters. Decoding only reads what's inside the token; anyone can read a JWT. A token is trustworthy only if its signature verifies on the server with the secret key. This page never sees your secret and never checks the signature.",
  },
  {
    q: "Is it safe to paste a real token here?",
    a: "Decoding happens entirely in your browser — nothing is uploaded. Still, a JWT can contain personal data and session credentials, so don't paste production tokens on a shared computer, and never share a token publicly.",
  },
  {
    q: "What does “alg none” mean?",
    a: "It means the token is unsigned — there is no signature at all. Nothing in it can be trusted, because anyone could have written it. Never accept an alg-none token in production.",
  },
  {
    q: "How do I know if a token is expired?",
    a: "The payload's “exp” claim is a Unix timestamp. This tool converts it to a readable date and shows an “expired” or “not expired” badge next to it.",
  },
  {
    q: "What if the token won't decode?",
    a: "A valid JWT has exactly three base64url parts separated by dots. If decoding fails, you likely pasted a partial token, extra whitespace, or quotes around it — paste the raw token with nothing else.",
  },
];

export default function JwtDecoderPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "JWT Decoder", path: "/tools/jwt-decoder" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "JWT Decoder" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free <em>JWT Decoder</em> Online
            </>
          }
          tagline="Paste a JSON Web Token and read its header and payload instantly — decoding only, signature never verified, nothing uploaded."
        />

        <JwtDecoderClient />
        <PrivacyNote>
          Decoding runs 100% in your browser — your token is never uploaded, stored, or sent
          anywhere. The signature is not verified here; only the server holding the secret can check
          it.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>JWT decoder</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A JSON Web Token is three base64url parts joined by dots: a header (algorithm and type),
            a payload (claims like who you are and when the token expires), and a signature. This
            free JWT decoder reads the first two parts and shows them as JSON, with the issued and
            expiry timestamps converted to readable dates and an expired badge when the token has
            run out.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The honest part: decoding is not verifying. A JWT&apos;s contents are readable by anyone
            — the signature is what makes it trustworthy, and only the server with the secret key
            can check that. This tool says so on the page rather than implying a decoded token is a
            valid one. Use it to debug your own tokens during development, and never paste a
            production token anywhere public.
          </p>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your claims</em></>} />
        <Steps
          steps={[
            {
              title: "Paste the token",
              text: "Copy the full JWT — header.payload.signature — and paste it into the box.",
            },
            {
              title: "Read header & payload",
              text: "Both parts decode instantly as JSON, with issued and expiry times as readable dates.",
            },
            {
              title: "Check the warnings",
              text: "An “expired” badge or an “alg none” warning tells you the token can't be trusted.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>JWT <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["base64-encoder-decoder", "json-formatter", "unix-timestamp-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
