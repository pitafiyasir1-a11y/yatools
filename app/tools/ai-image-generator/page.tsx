import Link from "next/link";
import {
  SITE,
  pageMeta,
  toolBySlug,
  breadcrumbJsonLd,
  faqJsonLd,
  type ToolDef,
} from "@/lib/site";
import ToolClient from "./ToolClient";

const tool = toolBySlug("ai-image-generator")!;

export const metadata = pageMeta({
  title: "Free AI Image Generator - Create Stunning Art Online",
  description:
    "Generate AI images free online — describe anything in words and get high-quality art with no watermark and no sign-up. Powered by free AI models. Try now!",
  path: "/tools/ai-image-generator",
  keywords: [
    "AI image generator",
    "text to image AI",
    "AI art generator",
    "image creation AI",
    "AI picture maker",
  ],
});

const FAQS = [
  {
    q: "Is this AI image generator really free?",
    a: "Yes. It is free for personal and commercial use, with no signup and no watermark on the images. Fair use applies: 10 generations per day keeps it free for everyone.",
  },
  {
    q: "How long does generation take?",
    a: "Typically 30\u201360 seconds. Keep the tab open while it works — the tool waits up to about 90 seconds for the image before timing out.",
  },
  {
    q: "The image doesn't quite match my prompt. Is that normal?",
    a: "Yes — it is AI-generated, so results can be imperfect, especially hands, text, and fine details. Being specific (subject, style, colors, lighting, composition) helps a lot, and \u201cNew variation\u201d rolls the dice again on the same prompt.",
  },
  {
    q: "Can I use the images commercially?",
    a: "Yes — personal and commercial use are both fine. As with any AI output, avoid passing them off as photographs of real people or events, and review details before publishing.",
  },
  {
    q: "What happens if the main generator is down?",
    a: "The request is served by a free fallback generator (Pollinations.ai) instead. A \u201cPollinations fallback\u201d badge on the result tells you which engine produced your image.",
  },
  {
    q: "Can I generate real people or brand logos?",
    a: "You can try, but likenesses of real people and trademarked logos usually come out inaccurate — that is a general limit of AI image generation, not just this tool.",
  },
  {
    q: "Is there a free AI image generator with no watermark?",
    a: "Yes. Images generated here download clean with no watermark and no attribution requirement, free for personal projects.",
  },
  {
    q: "How do I write a good AI image prompt?",
    a: "Be specific: describe the subject, setting, lighting, mood, and art style. 'A cozy cabin in snow at dusk, warm window light, digital painting' beats 'cabin' every time.",
  },

];

const STEPS = [
  {
    title: "Describe your image",
    text: "Write a detailed prompt: subject, style, lighting, mood. Longer, specific prompts give noticeably better results.",
  },
  {
    title: "Pick an aspect ratio",
    text: "Choose 16:9 for thumbnails, 9:16 for reels, 1:1 for posts — 11 ratios cover every common format.",
  },
  {
    title: "Generate and download",
    text: "Hit Generate, wait about a minute, then download the image — or roll a new variation of the same prompt.",
  },
];

const RATIOS =
  "1:1, 16:9, 9:16, 4:3, 3:4, 2:1, 1:2, 3:2, 2:3, 4:5, 5:4";

const PARAMS = [
  {
    name: "prompt",
    type: "string",
    required: "Yes",
    desc: "Text description of the image. 1\u2013500 characters — specific prompts (subject, style, lighting) give the best results.",
  },
  {
    name: "ratio",
    type: "string",
    required: "No",
    desc: `Aspect ratio, default "1:1". One of: ${RATIOS}.`,
  },
  {
    name: "response",
    type: "JSON",
    required: "\u2014",
    desc: "{ ok:true, provider, fallbackUsed, data:{ imageUrl } } — the image URL can be used directly in an <img> tag.",
  },
  {
    name: "provider",
    type: "string",
    required: "\u2014",
    desc: "\u201cahm7\u201d (PixelSter) or \u201cpollinations\u201d (Pollinations.ai fallback). fallbackUsed flags the fallback.",
  },
  {
    name: "generation",
    type: "\u2014",
    required: "\u2014",
    desc: "Typically 30\u201360 seconds; the endpoint allows up to ~90 seconds per image.",
  },
  {
    name: "rate limit",
    type: "\u2014",
    required: "\u2014",
    desc: "10 generations per day per IP. Exceeding it returns HTTP 429 with a Retry-After header.",
  },
];

const JS_EXAMPLE = `// Generate an AI image from a text prompt
const res = await fetch("/api/v1/tti", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "a lighthouse on a cliff at sunset, cinematic photo",
    ratio: "16:9",
  }),
});
const { data, provider, fallbackUsed } = await res.json();
// data.imageUrl → direct image URL
// provider: "ahm7" (PixelSter) or "pollinations" (fallback)
document.getElementById("art").src = data.imageUrl;`;

const CURL_EXAMPLE = `curl -X POST https://yatools.vercel.app/api/v1/tti \\
  -H "Content-Type: application/json" \\
  -d '{"prompt":"a lighthouse on a cliff at sunset","ratio":"16:9"}'`;

const USE_CASES = [
  {
    title: "YouTube thumbnails",
    text: "Generate bold 16:9 cover art that stands out in the feed — no designer needed.",
  },
  {
    title: "Reels and TikTok covers",
    text: "9:16 vertical art sized exactly for short-video covers and stories.",
  },
  {
    title: "Blog and social art",
    text: "1:1 and 4:5 images that make posts and articles look professionally illustrated.",
  },
  {
    title: "Presentation slides",
    text: "Custom 16:9 or 4:3 visuals instead of the same stock photos everyone else uses.",
  },
  {
    title: "Concepts and mockups",
    text: "Visualize a product idea, scene, or mood board in seconds before committing to production.",
  },
];

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Tools", path: "/tools" },
  { name: tool.name, path: `/tools/${tool.slug}` },
];

function softwareAppJsonLd(t: ToolDef) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${t.name} — ${SITE.name}`,
    url: `${SITE.url}/tools/${t.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: t.description,
  };
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="code-window mt-4">
      <div className="code-bar">
        <span className="code-dot" style={{ background: "#ff5f57" }} />
        <span className="code-dot" style={{ background: "#febc2e" }} />
        <span className="code-dot" style={{ background: "#28c840" }} />
        <span
          className="font-mono2 text-xs ml-2"
          style={{ color: "#a9a7a0" }}
        >
          {label}
        </span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="card p-2 sm:p-4 mt-6">
      {faqs.map((f) => (
        <details key={f.q} className="faq-item">
          <summary className="faq-q">
            {f.q}
            <span aria-hidden="true">+</span>
          </summary>
          <p className="faq-a">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

function RelatedGrid({ related }: { related: ToolDef[] }) {
  return (
    <div className="tool-grid mt-6">
      {related.map((t) => (
        <Link
          key={t.slug}
          href={`/tools/${t.slug}`}
          className="card card-hover p-5 block"
        >
          <span className={`badge badge-${t.badgeColor}`}>
            {t.badge}
          </span>
          <h3 className="font-display text-2xl mt-3">{t.name}</h3>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {t.tagline}
          </p>
        </Link>
      ))}
    </div>
  );
}

const RELATED_SLUGS: string[] = ["image-to-text", "background-remover", "image-upscaler"];

export default function AiImageGeneratorPage() {
  const related = RELATED_SLUGS
    .map((s) => toolBySlug(s))
    .filter((t): t is ToolDef => Boolean(t));

  return (
    <main className="wrap py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppJsonLd(tool)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(crumbs)),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="font-mono2 text-xs mb-8 flex items-center gap-2"
        style={{ color: "var(--muted)" }}
      >
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/tools" className="hover:underline">
          Tools
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{tool.name}</span>
      </nav>

      <header className="text-center max-w-3xl mx-auto mb-10">
        <span className="eyebrow">
          <span className="dot" />
          Free tool
        </span>
        <h1 className="hero-title mt-5">
          Free AI Image <em>Generator</em> Online
        </h1>
        <p className="sec-sub mx-auto mt-4">A free AI image generator: describe anything in words and get high-quality AI art in seconds — no sign-up, no watermark.</p>
      </header>

      <section aria-label="AI image generator tool">
        <ToolClient />
        <p
          className="text-center text-sm mt-5"
          style={{ color: "var(--muted)" }}
        >
          Free AI generation — images are AI-generated and may be imperfect.
          10 generations per day per user.
        </p>
      </section>

            <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>AI Image Generator</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            An AI image generator turns a plain-English description into original artwork in seconds. Type a prompt like a misty mountain lake at sunrise, and this free online tool renders a high-quality image you can download immediately — no account, no credits, no watermark stamped across your art. Bloggers illustrate posts without stock-photo subscriptions, indie makers prototype game art and product mockups, and social creators produce scroll-stopping visuals for every post.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            The generator runs on free AI image models with an automatic fallback provider, so if the primary engine is busy your prompt still gets rendered. Generation usually takes under half a minute. For best results, be specific: name the subject, the setting, the lighting, and the style rather than a single vague word. The images are AI-generated originals, but avoid prompting for real people's likenesses or brand logos — those requests are blocked, and you should check licensing if you plan commercial use.
          </p>
        </div>
      </section>

<section className="mt-14">
        <p className="sec-label">How it works</p>
        <h2 className="sec-title">
          Three steps to <em>done</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-6">
              <div
                className="font-display text-4xl"
                style={{ color: "var(--red)" }}
              >
                {i + 1}
              </div>
              <h3 className="font-bold mt-2">{s.title}</h3>
              <p className="text-sm mt-1" style={{ color: "var(--text2)" }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">API parameters</p>
        <h2 className="sec-title">
          The <em>endpoint</em>
        </h2>
        <p className="sec-sub mt-2">
          The same generator behind this tool is available as{" "}
          <code className="font-mono2 text-sm">POST /api/v1/tti</code> with a
          JSON body.
        </p>
        <div className="card p-2 sm:p-4 mt-6 overflow-x-auto">
          <table className="param-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {PARAMS.map((r) => (
                <tr key={r.name}>
                  <td>
                    <code>{r.name}</code>
                  </td>
                  <td>
                    <code>{r.type}</code>
                  </td>
                  <td>{r.required}</td>
                  <td>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">Examples</p>
        <h2 className="sec-title">
          Try it in <em>code</em>
        </h2>
        <CodeBlock label="JavaScript — generate an image" code={JS_EXAMPLE} />
        <CodeBlock label="cURL — POST a prompt" code={CURL_EXAMPLE} />
      </section>

      <section className="mt-14">
        <p className="sec-label">Use cases</p>
        <h2 className="sec-title">
          What to <em>create</em>
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {USE_CASES.map((u) => (
            <div key={u.title} className="card p-6">
              <h3 className="font-bold">{u.title}</h3>
              <p className="text-sm mt-1" style={{ color: "var(--text2)" }}>
                {u.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">FAQ</p>
        <h2 className="sec-title">
          Questions, <em>answered</em>
        </h2>
        <FaqList faqs={FAQS} />
      </section>

      <section className="mt-14">
        <p className="sec-label">Related tools</p>
        <h2 className="sec-title">
          Keep <em>going</em>
        </h2>
        <RelatedGrid related={related} />
      </section>

      <section className="card p-6 md:p-8 mt-14 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div>
          <p className="sec-label">For developers</p>
          <h2 className="sec-title">
            Use the <em>Image API</em> in your own app
          </h2>
          <p className="sec-sub mt-2">
            One POST request turns a text prompt into an image URL — free,
            no key, eleven aspect ratios.
          </p>
        </div>
        <a
          className="btn btn-primary shrink-0"
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(
            "API access: AI Image Generator"
          )}`}
        >
          Request API access
        </a>
      </section>

      <div className="notice mt-12 max-w-3xl mx-auto">
        <strong>Private by design.</strong> Your prompt is sent to the image
        API only to generate your image. Prompts aren&apos;t tied to your
        identity and nothing is stored in an account.
      </div>
    </main>
  );
}
