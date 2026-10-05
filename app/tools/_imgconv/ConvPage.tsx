import type { ReactNode } from "react";
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

export interface ConvPageSpec {
  tool: ToolDef;
  /** H1 content, e.g. <>HEIC to <em>JPG</em> Converter</> */
  heroTitle: ReactNode;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** Section 3: supported formats + real limits (4 cards). */
  formats: { t: string; d: string }[];
  /** Section 4: 3-step how-it-works (also feeds the HowTo JSON-LD). */
  steps: { title: string; text: string }[];
  /** Section 5: use cases (4–6 cards). */
  useCases: { t: string; d: string }[];
  /** Section 6: FAQ (4–6 Q&As, also feeds the FAQ JSON-LD). */
  faqs: { q: string; a: string }[];
  /** Privacy note under the tool UI. */
  privacyNote: string;
}

function howToJsonLd(tool: ToolDef, steps: { title: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use the ${tool.name}`,
    description: tool.description,
    totalTime: "PT1M",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.text,
    })),
  };
}

export function convPageMeta(spec: ConvPageSpec) {
  return pageMeta({
    title: spec.metaTitle,
    description: spec.metaDescription,
    path: `/tools/${spec.tool.slug}`,
    keywords: spec.keywords,
  });
}

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
} as const;

function CardGrid({ cards }: { cards: { t: string; d: string }[] }) {
  return (
    <div style={cardGrid}>
      {cards.map((c) => (
        <div key={c.t} className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
        </div>
      ))}
    </div>
  );
}

export default function ConvPage({
  spec,
  children,
}: {
  spec: ConvPageSpec;
  children: ReactNode;
}) {
  const { tool } = spec;
  return (
    <>
      <JsonLd data={faqJsonLd(spec.faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={howToJsonLd(tool, spec.steps)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: tool.name, path: `/tools/${tool.slug}` },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: tool.name }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={spec.heroTitle}
          tagline={spec.tagline}
        />

        {children}
        <PrivacyNote>{spec.privacyNote}</PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you get, <em>honestly</em></>}
          sub="Straightforward limits, stated plainly."
        />
        <CardGrid cards={spec.formats} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>converted</em></>} />
        <Steps steps={spec.steps} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When this <em>helps</em></>}
          sub="Real situations, not filler."
        />
        <CardGrid cards={spec.useCases} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>{tool.name.split(" ")[0]} converter <em>questions</em></>} />
        <FaqList faqs={spec.faqs} />

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
