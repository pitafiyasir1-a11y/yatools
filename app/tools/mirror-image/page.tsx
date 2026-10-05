import MirrorImageClient from "./ToolClient";
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
  slug: "mirror-image",
  name: "Mirror Image",
  tagline: "Flip any photo horizontally or vertically.",
  description:
    "Mirror an image online for free. Flip photos horizontally or vertically with a live preview — great for fixing selfies and creating symmetric edits.",
  category: "Everyday Utilities",
  keyword: "mirror image online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["invert-image", "image-resizer", "image-converter"],
};

export const metadata = pageMeta({
  title: "Mirror Image Online — Free Horizontal & Vertical Flip Tool",
  description:
    "Mirror an image online for free. Flip photos horizontally or vertically with a live preview and PNG/JPG download. No sign-up, no upload — 100% in your browser.",
  path: "/tools/mirror-image",
  keywords: [
    "mirror image online",
    "flip image horizontally",
    "flip photo online free",
    "mirror photo left right",
  ],
});

const faqs = [
  {
    q: "What's the difference between horizontal and vertical mirroring?",
    a: "Horizontal mirroring swaps left and right — the way a bathroom mirror flips you. Vertical flipping swaps top and bottom, like turning the photo upside down and back. Pick Both to rotate the image a full 180°.",
  },
  {
    q: "Why would I mirror a photo?",
    a: "The classic reason is selfies: front cameras show you mirrored, and flipping the photo back matches what you see in the mirror. It's also used for symmetrical design edits, fixing text in mirrored screenshots, and creative double-exposure effects.",
  },
  {
    q: "Does mirroring reduce image quality?",
    a: "No. The flip is a pure pixel rearrangement at the original resolution — dimensions and sharpness are untouched. Only the format you choose (PNG or JPG) affects the final file.",
  },
  {
    q: "Is my photo uploaded anywhere?",
    a: "No. The flip happens entirely in your browser with the canvas engine. Your photo never leaves your device and nothing is stored.",
  },
];

export default function MirrorImagePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Mirror Image", path: "/tools/mirror-image" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Mirror Image" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Mirror Image <em>Online</em>
            </>
          }
          tagline="Flip any photo horizontally or vertically — live preview, lossless, and completely private."
        />

        <MirrorImageClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your photo is never uploaded, processed, or
          stored anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>perfect flip</em></>} />
        <Steps
          steps={[
            {
              title: "Upload a photo",
              text: "Drag and drop any image or click to browse. The original appears instantly next to the live mirrored preview.",
            },
            {
              title: "Pick a flip direction",
              text: "Choose horizontal, vertical, or both. The preview updates live, so you see exactly what you'll download.",
            },
            {
              title: "Download it",
              text: "Grab the mirrored photo as PNG for a lossless copy or JPG for a smaller file — at the original resolution.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>When <em>mirroring</em> comes in handy</>}
          sub="A simple flip fixes more everyday annoyances than you'd think."
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
              t: "Fix mirrored selfies",
              d: "Front cameras show a mirrored preview. Flip the saved photo horizontally to match the real-world view.",
            },
            {
              t: "Un-mirror screenshots",
              d: "Screenshots taken in mirrors or mirrored video calls read backwards — flip them to make text readable again.",
            },
            {
              t: "Symmetric design edits",
              d: "Mirror half of a design to build perfectly symmetrical patterns, logos, and thumbnails.",
            },
            {
              t: "Video thumbnails",
              d: "A flipped frame can change the reading direction of a thumbnail — subtle, but it affects where eyes land first.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Mirroring <em>questions</em></>} />
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
