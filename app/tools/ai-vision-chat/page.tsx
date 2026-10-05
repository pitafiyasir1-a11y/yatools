import AiVisionChatClient from "./ToolClient";
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
  SITE,
} from "@/lib/site";

const tool = toolBySlug("ai-vision-chat")!;

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Vision Chat — YATools",
    url: `${SITE.url}/tools/ai-vision-chat`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Chat with AI about any image free online — upload a photo, ask questions, get descriptions, and follow up in context. Private, no sign-up needed. Try now!",
  };
}

export const metadata = pageMeta({
  title: "AI Vision Chat - Ask Questions About Images Free Online",
  description:
    "Chat with AI about any image free online — upload a photo, ask questions, get descriptions, and follow up in context. Private, no sign-up needed. Try now!",
  path: "/tools/ai-vision-chat",
  keywords: [
    "AI vision chat",
    "image chat AI",
    "AI image analyzer",
    "visual AI chat",
    "image understanding AI",
  ],
});

const faqs = [
  {
    q: "What can I ask about my image?",
    a: "Almost anything you can see: describe the scene, read text on signs or documents, identify objects, plants, or landmarks, transcribe handwriting, or ask what someone is doing. Keep questions to what's visible in the image for the best answers.",
  },
  {
    q: "What image formats and sizes are supported?",
    a: "JPG, PNG, WebP, and GIF up to 5MB. If your photo is larger, compress it or take a screenshot of the part you care about before uploading.",
  },
  {
    q: "Is my image stored or used for training?",
    a: "Your image is sent to the AI vision API only to generate the answer to your question. It is not stored by YATools. Don't upload sensitive photos — IDs, credit cards, private documents, or anything you wouldn't share.",
  },
  {
    q: "Can I ask follow-up questions about the same image?",
    a: "Yes. After the first answer, the image stays loaded — just type another question and hit Ask. Each follow-up is answered with the same image in context.",
  },
  {
    q: "How accurate are the answers?",
    a: "Very good for everyday photos — scenes, objects, readable text. The AI can still misread small or blurry text, miscount objects, or misidentify obscure things. Treat answers as a smart best guess and double-check anything important.",
  },
  {
    q: "How many questions can I ask?",
    a: "10 free questions per day per IP address — a fair-use limit so the free tier stays available for everyone. The counter resets daily, no account needed.",
  },
  {
    q: "Can I upload an image and ask AI questions for free?",
    a: "Yes. Upload any photo, ask your question in plain language, and get an answer in seconds — follow-ups about the same image keep the context.",
  },

];

export default function AiVisionChatPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/ai-vision-chat" },
          { name: "AI Vision Chat", path: "/tools/ai-vision-chat" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "AI Vision Chat" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free AI Vision <em>Chat</em> Online
            </>
          }
          tagline="A free AI vision chat: upload any photo and ask AI questions about it — get descriptions, details, and follow-up answers."
        />

        <AiVisionChatClient />
        <PrivacyNote>
          Your image is sent to the AI vision API only to answer your question — it is not stored
          by YATools. Avoid uploading sensitive personal photos.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>AI Vision Chat</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            AI vision chat lets you have a conversation about a picture: upload any image and ask the AI questions about what it sees. This free online tool describes scenes, reads visible text, identifies objects, and answers follow-up questions about the same image — like chatting with someone who is looking at the photo with you. Shoppers ask what style a piece of furniture is, students get diagrams explained, travelers translate signs in photos, and curious minds simply explore what the AI notices.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The chat keeps context across follow-ups, so you can drill deeper with questions like what is in the background or what does the small text say. Answers are generated by an AI vision model and are usually accurate for clear, well-lit images, but you should double-check anything critical — tiny text, fine details, and unusual objects can be misread. Your images are processed to answer your questions and are not stored or used for training.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your answer</em></>} />
        <Steps
          steps={[
            {
              title: "Upload a photo",
              text: "Drop any JPG, PNG, WebP, or GIF up to 5MB. You'll see a thumbnail so you know exactly which image the AI is looking at.",
            },
            {
              title: "Ask your question",
              text: "Type what you want to know — “What's in this photo?”, “Read the text on the sign”, or “What breed is this dog?”. Hit Ask (or press Enter).",
            },
            {
              title: "Chat with follow-ups",
              text: "The answer appears in a chat thread. The image stays loaded, so ask follow-ups — “Zoom in on the top left?” — without re-uploading.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>What vision chat <em>is good at</em></>}
          sub="Honest notes on strengths, limits, and staying safe."
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
              t: "Reading text in photos",
              d: "Signs, menus, labels, receipts, whiteboards, and documents — the AI reads visible text well and can translate or summarize it on request.",
            },
            {
              t: "Describing and identifying",
              d: "Scenes, objects, plants, animals, landmarks, and people’s activities. Great for accessibility descriptions or satisfying curiosity about a photo.",
            },
            {
              t: "Not always right",
              d: "Small or blurry text gets misread, similar objects get confused, and counting can be off. Treat answers as a smart guess — verify anything that matters.",
            },
            {
              t: "Keep it clean",
              d: "Don't upload IDs, credit cards, medical records, or other sensitive images. The photo leaves your device to be analyzed, so share only what you're comfortable sharing.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Examples" title={<>Typical <em>use cases</em></>} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>menu-photo.txt</span>
            </div>
            <pre>{`Photo of a restaurant menu:
"Translate this to English and
tell me the cheapest dish."
→ full translation + pick.`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>garden-question.txt</span>
            </div>
            <pre>{`Photo of a plant:
"What is this plant and how
do I care for it?"
→ identification + care tips.`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>AI vision chat <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["ai-image-generator", "image-to-text", "movie-tv-search"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
