import ResumeBuilderClient from "./ToolClient";
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

const tool = toolBySlug("resume-builder")!;

export const metadata = pageMeta({
  title: "Resume Builder Free No Sign Up - Make a Professional CV Online",
  description:
    "Resume builder free, no sign-up: fill in your details and get a clean, professional resume with live preview. Download as PDF. 100% in-browser, private.",
  path: "/tools/resume-builder",
  keywords: [
    "resume builder free no sign up",
    "resume builder free",
    "free resume maker",
    "cv maker online free",
    "make a resume online free",
    "resume builder no sign up",
  ],
});

const faqs = [
  {
    q: "Is this resume builder really free with no sign-up?",
    a: "Yes. There is no account, no trial, and no paywall. Fill in the form, preview your resume live, and download it as a PDF through your browser's print dialog. Everything runs on your device.",
  },
  {
    q: "How do I download my resume as a PDF?",
    a: "Press “Download as PDF”. Your browser's print dialog opens — choose “Save as PDF” as the destination. Only the resume itself prints, not the rest of the page.",
  },
  {
    q: "What should I put in the summary?",
    a: "Two or three sentences: what you do, how much experience you have, and one concrete achievement with a number. Example: “Frontend developer with 3 years of experience. Shipped features used by 50,000+ people and cut load times by 40%.”",
  },
  {
    q: "How many jobs should I list?",
    a: "Your two most recent roles are enough for most applications. Hiring managers skim — one or two lines per job, each starting with what you did and, when you can, the result.",
  },
  {
    q: "Is my information private?",
    a: "Yes. The builder runs entirely in your browser. Your name, email, and work history are never uploaded, stored, or sent anywhere.",
  },
  {
    q: "Can I use this resume anywhere in the world?",
    a: "Yes. The layout is a standard international one-page resume — name, title, contact, summary, experience, education, skills — accepted by employers everywhere. Use your local phone format and location.",
  },
];

export default function ResumeBuilderPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Resume Builder", path: "/tools/resume-builder" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Resume Builder" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free <em>Resume Builder</em> — No Sign Up
            </>
          }
          tagline="Build a clean, professional resume in minutes: fill in your details, watch the live preview, and download it as a PDF."
        />

        <ResumeBuilderClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your resume details are never uploaded, stored, or
          sent anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>resume builder</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A good resume is one page, easy to scan, and full of specifics. This free resume builder
            keeps it simple: your name and title at the top, contact details, a short summary, your
            most recent experience, education, and skills. As you type, the preview on the right
            updates instantly, so what you see is exactly what prints. No templates locked behind a
            paywall, no account to create, no watermark on the PDF.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The download uses your browser&apos;s print-to-PDF, which keeps the layout crisp on any
            device and any operating system. One tip that matters more than design: put numbers in
            your experience lines. “Built React apps” is forgettable; “Built React apps used by
            50,000 people” is not.
          </p>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your resume</em></>} />
        <Steps
          steps={[
            {
              title: "Fill in your details",
              text: "Name, title, contact, summary, experience, education, and skills. Use “Fill with example” to see the format first.",
            },
            {
              title: "Check the live preview",
              text: "The resume on the right updates as you type — that is exactly what your PDF will look like.",
            },
            {
              title: "Download as PDF",
              text: "Press “Download as PDF” and choose “Save as PDF” in the print dialog. Send it anywhere.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Resume <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["text-to-pdf", "certificate-maker", "word-counter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
