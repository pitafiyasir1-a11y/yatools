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

export const metadata = pageMeta({
  title: "Online Video Downloader — Free Multi-Platform Download Links",
  description:
    "Free online video downloader. Paste a YouTube, TikTok, Instagram, or Facebook link to get direct download links. Only for content you own or have the right to save.",
  path: "/tools/universal-downloader",
  keywords: [
    "online video downloader",
    "download video from link",
    "tiktok video downloader",
    "youtube video download link",
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
];

export default function UniversalDownloaderPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
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
              Universal <em>Downloader</em>
            </>
          }
          tagline="Paste a video or audio link, get direct download links. Free — for content you own or have the right to save."
        />

        <UniversalDownloaderClient />
        <PrivacyNote>
          Lookups pass through our proxy to the download provider and are never stored. We do
          not log the URLs you paste.
        </PrivacyNote>

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
        <RelatedTools slugs={tool.related} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
