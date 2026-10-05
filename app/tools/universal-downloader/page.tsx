import UniversalDownloaderClient from "./ToolClient";
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
  slug: "universal-downloader",
  name: "Universal Downloader",
  tagline: "Get download links for videos and audio.",
  description:
    "Free online video downloader. Paste a link from YouTube, TikTok, Instagram, Facebook, and more to get direct download links — for content you own or have the right to save.",
  category: "Everyday Utilities",
  keyword: "online video downloader",
  badge: "API",
  badgeColor: "blue",
  api: "/api/v1/alldl",
  related: ["website-screenshot", "audio-to-text", "text-to-speech"],
};

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Online Video Downloader — YATools",
    url: `${SITE.url}/tools/universal-downloader`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Get download links for videos and audio free online — paste a link from YouTube, TikTok, Instagram, and more. For content you own or have rights to. Try it now!",
  };
}

export const metadata = pageMeta({
  title: "Online Video Downloader - Save Videos & Audio Free",
  description:
    "Get download links for videos and audio free online — paste a link from YouTube, TikTok, Instagram, and more. For content you own or have rights to. Try it now!",
  path: "/tools/universal-downloader",
  keywords: [
    "online video downloader",
    "video downloader",
    "download videos online",
    "save video",
    "universal downloader",
  ],
});

const faqs = [
  {
    q: "Which sites does this work with?",
    a: "The service reports support for YouTube, TikTok, Instagram, Facebook, Snapchat, SoundCloud, Reddit, Twitter, Douyin, SnackVideo, and CapCut. Support varies per site and can change without notice — if a link returns nothing, that platform or video isn't currently supported.",
  },
  {
    q: "Is it legal to download videos?",
    a: "It depends on the content and the platform. Only download videos you own, that are explicitly free to download, or that you have permission to save. Many platforms prohibit downloading in their Terms of Service, and most videos are protected by copyright. When in doubt, don't download.",
  },
  {
    q: "Why did I get 'unsupported platform'?",
    a: "The service checks the link you pasted and only handles platforms it knows how to process. Private videos, login-walled content, live streams, and brand-new platform layouts often fail — that's the service being honest rather than giving you a broken file.",
  },
  {
    q: "Is there a daily limit?",
    a: "Yes — 10 lookups per day per visitor. Downloading is bandwidth-heavy on the provider's side, so the cap keeps the free service running for everyone.",
  },
  {
    q: "Do you store the links I fetch?",
    a: "No. Lookups go through our proxy to the provider and aren't saved. The download links themselves come from the provider and may expire — fetch fresh ones if a link goes dead.",
  },
  {
    q: "Can I download a video for offline viewing?",
    a: "Only content you own or have the right to save — your own uploads, freely licensed media, and public-domain material. Respect creators' rights and platform terms.",
  },
  {
    q: "Which sites does this work with?",
    a: "YouTube, TikTok, Instagram, Facebook, and more. Supported platforms change over time; unsupported links show a clear message instead of failing silently.",
  },

];

export default function UniversalDownloaderPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Universal Downloader", path: "/tools/universal-downloader" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Universal Downloader" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Universal <em>Downloader</em> Online
            </>
          }
          tagline="A free online video downloader: paste a link from YouTube, TikTok, Instagram, or Facebook and get direct download links."
        />

        <UniversalDownloaderClient />
        <PrivacyNote>
          Lookups pass through our proxy to the download provider and are never stored. We do
          not log the URLs you paste.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Online Video Downloader</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A universal downloader fetches direct download links for videos and audio from links you paste in. Drop a URL from YouTube, TikTok, Instagram, Facebook, or other supported platforms into this free online tool and get download options for the media — useful for saving your own uploads, archiving content you created, or keeping offline copies of freely licensed material for travel and study.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            An important boundary, stated plainly: only download content you own or have the right to save. Ripping copyrighted music, movies, or creators' work without permission violates their rights and platform terms — this tool is built for your own content and openly licensed media, not piracy. Availability varies by platform and link type; if you see an unsupported-platform message, that source cannot be fetched. Links are resolved on request and never stored.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>download link</em></>} />
        <Steps
          steps={[
            {
              title: "Paste a link",
              text: "Copy the page URL of a video or audio post from a supported platform and paste it into the box above.",
            },
            {
              title: "Fetch the files",
              text: "Our proxy asks the download service for available files. You'll see every direct link it returns — usually several quality options.",
            },
            {
              title: "Save the file",
              text: "Open a link in a new tab and save it from there. Links can expire, so download promptly or fetch fresh ones.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>An honest word about <em>downloading</em></>}
          sub="This tool is powerful, so here's the responsible-use version in plain language."
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
              t: "Your own content is the safe case",
              d: "Downloading your own uploads, Creative Commons media, or anything the creator marked downloadable is the intended use.",
            },
            {
              t: "Platform rules still apply",
              d: "Many platforms ban downloading in their Terms of Service. This tool doesn't override those rules — breaking them can get accounts restricted.",
            },
            {
              t: "Copyright is real",
              d: "Most videos you find online are copyrighted. Saving a copy for offline viewing may still infringe, depending on your country's law.",
            },
            {
              t: "No login-walled content",
              d: "Private videos, paid courses, and anything behind a login won't work — the service only sees what's publicly available.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Downloader <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["website-screenshot", "audio-to-text", "text-to-speech"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
