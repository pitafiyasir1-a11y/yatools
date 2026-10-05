import { SITE, toolBySlug, faqJsonLd } from "@/lib/site";
import { JsonLd } from "../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHead from "@/components/SectionHead";
import ToolCard from "@/components/ToolCard";
import Faq from "@/components/Faq";

export interface HubConfig {
  path: string; // e.g. "/pdf-tools"
  hubName: string; // e.g. "PDF Tools"
  title: string; // H1 text
  description: string; // short meta-style description used in JSON-LD
  intro: string[]; // 2-3 unique paragraphs
  slugs: string[]; // explicit tool slugs; missing ones are skipped gracefully
  chooseTitle: string;
  chooseIntro: string;
  choose: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
}

const OTHER_HUBS = [
  { name: "PDF Tools", path: "/pdf-tools" },
  { name: "Image Tools", path: "/image-tools" },
  { name: "Video Tools", path: "/video-tools" },
  { name: "Audio Tools", path: "/audio-tools" },
  { name: "Developer Tools", path: "/developer-tools" },
];

/**
 * Shared category-hub page: SEO intro copy, card grid of registered tools in
 * the hub's slug list, buying-guide section, FAQs, and JSON-LD
 * (FAQPage + CollectionPage/ItemList + BreadcrumbList).
 */
export default function HubPage({ config }: { config: HubConfig }) {
  const tools = config.slugs
    .map((slug) => toolBySlug(slug))
    .filter((t) => t != null);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${config.hubName} — Free Online`,
    description: config.description,
    url: `${SITE.url}${config.path}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        description: t.tagline,
        url: `${SITE.url}/tools/${t.slug}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={faqJsonLd(config.faqs)} />
      <JsonLd data={collectionJsonLd} />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: config.hubName, path: config.path },
          ]}
        />

        <h1
          className="m-0 mb-4"
          style={{
            color: "var(--text)",
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {config.title}
        </h1>

        <div
          className="mb-10"
          style={{ maxWidth: "62ch", color: "var(--text2)" }}
        >
          {config.intro.map((p, i) => (
            <p
              key={i}
              className="m-0 mb-4 text-[1.02rem] leading-relaxed"
            >
              {p}
            </p>
          ))}
        </div>

        <div className="mb-12">
          <SectionHead
            eyebrow="Browse tools"
            title={`All ${config.hubName}`}
            sub={`${tools.length} free ${config.hubName.toLowerCase()} — no sign-up, no installs, most run entirely in your browser.`}
          />
          <div className="tool-grid">
            {tools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>

        <div className="mb-12">
          <SectionHead eyebrow="Buying guide" title={config.chooseTitle} sub={config.chooseIntro} />
          <div className="card px-5 sm:px-7">
            {config.choose.map((item, i) => (
              <div
                key={i}
                className="faq-item"
                style={{ padding: "16px 0" }}
              >
                <h3
                  className="m-0 mb-1 text-[1.02rem] font-bold"
                  style={{ color: "var(--text)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="m-0 text-[0.98rem] leading-relaxed"
                  style={{ color: "var(--text2)" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <SectionHead
            eyebrow="Questions"
            title="Frequently asked questions"
            sub={`Quick answers about these ${config.hubName.toLowerCase()}.`}
          />
          <Faq faqs={config.faqs} />
        </div>

        <div>
          <SectionHead
            eyebrow="More categories"
            title="Explore other tool collections"
          />
          <div className="flex flex-wrap gap-3">
            {OTHER_HUBS.filter((h) => h.path !== config.path).map((h) => (
              <a
                key={h.path}
                href={h.path}
                className="card card-hover no-underline"
                style={{
                  padding: "12px 18px",
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                {h.name} &rarr;
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
