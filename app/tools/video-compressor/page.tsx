import VideoCompressorClient from "./ToolClient";
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
import { softwareAppJsonLd } from "../_conv-shared/seo";

const tool: ToolDef = {
  slug: "video-compressor",
  name: "Video Compressor",
  tagline: "A free video compressor for Discord: shrink MP4, WebM, and MOV clips to fit Discord's 10 MB upload limit — in your browser, no watermark.",
  description:
    "Video compressor for Discord: shrink a video under Discord's 10 MB free upload limit — free online, in your browser. MP4, WebM, MOV in; smaller H.264 MP4 out. No sign-up, no watermark.",
  category: "Everyday Utilities",
  keyword: "video compressor for discord",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "video-to-gif-converter",
    "mp4-to-mp3-converter",
    "image-compressor"
],
};

export const metadata = pageMeta({
  title: "Video Compressor for Discord — Free Online, No Sign-Up",
  description:
    "Video compressor for Discord: shrink clips under Discord's 10 MB free upload limit in your browser. MP4, WebM, MOV — no upload, no sign-up, no watermark.",
  path: "/tools/video-compressor",
  keywords: [
    "video compressor for discord",
    "video compressor to 10mb",
    "compress video for discord",
    "compress video online free",
    "video compressor",
    "compress video",
    "video size reducer",
    "compress MP4",
    "shrink video",
  ],
});

const faqs = [
  {
    q: "How do I compress a video for Discord?",
    a: "Discord caps free uploads at 10 MB. Drop your clip in, pick a lower resolution (720p or 480p) and a higher CRF (30–34), then compress — the tool shows the exact before/after size, so re-run with stronger settings until it reads under 10 MB. Nitro members get 50–500 MB, so less squeezing is needed.",
  },
  {
    q: "How much smaller can this video compressor make my file?",
    a: "It depends on the source. An already-tightly-compressed MP4 might shrink 10–30%, while an uncompressed screen recording can drop 70–90%. The tool shows you the exact before/after sizes, so you always know what you got.",
  },
  {
    q: "Will compression reduce my video quality?",
    a: "Some, yes — that's how compression works. The CRF slider controls the trade-off: 18 is near-lossless, 26 is the balanced default, and 34 gives maximum shrinkage for sharing. You can re-run with different settings until it looks right to you.",
  },
  {
    q: "Why does encoding take so long?",
    a: "Video encoding is heavy math, and your browser is doing all of it on your device — no server farm in the cloud. Large videos with the 'slow' preset can take several minutes. Keep the tab open and let it finish; the progress bar shows exactly how far it's got.",
  },
  {
    q: "Is my video uploaded anywhere?",
    a: "No. The entire video engine runs inside your browser with ffmpeg.wasm. Your video never leaves your device, which is exactly why the first load downloads a ~30 MB engine file — after that it's instant.",
  },
  {
    q: "Is there a file size limit?",
    a: "Yes — about 100 MB per video. Browser memory is finite, and encoding needs working room. If your video is bigger, trim it into parts first, then compress each part.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to compress a video for Discord",
  description:
    "Shrink a video under Discord's 10 MB upload limit in your browser with YATools' free video compressor.",
  step: [
    {
      "@type": "HowToStep",
      name: "Upload your video",
      text: "Drop an MP4, WebM or MOV file (up to ~100 MB) onto the tool. Nothing is uploaded — it stays in your browser.",
    },
    {
      "@type": "HowToStep",
      name: "Choose your settings",
      text: "Pick a compression level (CRF), a speed preset, and an output resolution. For Discord's 10 MB limit, try 720p or 480p with CRF 30–34.",
    },
    {
      "@type": "HowToStep",
      name: "Compress and download",
      text: "Hit Compress video, keep the tab open while it encodes, then download your smaller MP4 with the before/after sizes shown.",
    },
  ],
};

export default function VideoCompressorPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={howToJsonLd} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/video-compressor" },
          { name: "Video Compressor", path: "/tools/video-compressor" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Video Compressor" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Video <em>Compressor</em> for Discord
            </>
          }
          tagline="A free video compressor for Discord: shrink MP4, WebM, and MOV clips to fit Discord's 10 MB upload limit — in your browser, no watermark."
        />

        <VideoCompressorClient />
        <PrivacyNote>
          Encoding runs 100% in your browser with ffmpeg.wasm. Your video is never uploaded, stored, or seen by anyone but you.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>compress</em></>}
          sub="Straightforward limits, stated plainly."
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
              t: "Inputs",
              d: "MP4, WebM, MOV, MKV and AVI up to ~100 MB. Files are read straight from your device — nothing is uploaded first.",
            },
            {
              t: "Output",
              d: "Always H.264 MP4 (yuv420p) with AAC audio — the most compatible video format on the planet. Plays everywhere.",
            },
            {
              t: "Honest speed",
              d: "Encoding runs on your CPU, in your browser. Small clips finish in seconds; big 4K videos can take several minutes. The progress bar is real — it's read from the encoder's own logs.",
            },
            {
              t: "No fake promises",
              d: "An already-compressed video won't shrink much, and we'll tell you so — the before/after sizes are shown on every run, and if the result is bigger, we say why.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>smaller</em> video</>} />
        <Steps
          steps={[
            {
              title: "Drop in your video",
              text: "Choose an MP4, WebM or MOV file up to ~100 MB. It never leaves your browser — compression happens on your device.",
            },
            {
              title: "Pick quality & resolution",
              text: "Set the compression level (CRF 18–34), a speed preset, and optionally downscale to 1080p, 720p or 480p. Aiming for Discord? Try 720p with CRF 30–34.",
            },
            {
              title: "Compress & download",
              text: "Keep the tab open while the encoder works, then download your smaller MP4 with exact before/after sizes.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When a smaller video <em>saves the day</em></>}
          sub="Big videos are a pain. Small ones just work."
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
              t: "Discord uploads",
              d: "Discord caps free uploads at 10 MB. Compress a clip with a higher CRF and a 720p or 480p downscale until the before/after size reads under 10 MB — then it sends first time.",
            },
            {
              t: "Upload faster",
              d: "A smaller file uploads in a fraction of the time — handy on slow connections or when you're on mobile data.",
            },
            {
              t: "Free up phone storage",
              d: "Re-encode old 4K clips to 1080p or 720p at a sensible CRF and reclaim gigabytes without losing anything you'd notice.",
            },
            {
              t: "Course & tutorial videos",
              d: "Talking-head tutorials compress beautifully. Shrink hours of lessons so students can stream them without buffering.",
            },
            {
              t: "Portfolio & job applications",
              d: "Recruiters won't download a 500 MB showreel. A compressed MP4 under 25 MB attaches cleanly to any application portal.",
            },
            {
              t: "Private by default",
              d: "Compressing sensitive footage — client work, family videos — locally means it never touches a third-party server at all.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Video compressor <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["video-to-gif-converter", "mp4-to-mp3-converter", "image-compressor"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
