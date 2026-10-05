/* Extra JSON-LD helpers for the dedicated converter pages:
 * SoftwareApplication (per the SEO blueprint) and HowTo. */
import { SITE } from "@/lib/site";

export function softwareAppJsonLd(
  tool: { slug: string; name: string; description: string },
  applicationCategory: "MultimediaApplication" | "UtilitiesApplication"
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.name} — ${SITE.name}`,
    url: `${SITE.url}/tools/${tool.slug}`,
    applicationCategory,
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: tool.description,
  };
}

export function howToJsonLd(
  tool: { name: string },
  steps: { title: string; text: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use the ${tool.name}`,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.text,
    })),
  };
}
