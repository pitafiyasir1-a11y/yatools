import Link from "next/link";
import type { Metadata } from "next";
import {
  SITE,
  TOOLS,
  pageMeta,
  orgJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  type ToolCategory,
} from "@/lib/site";

const UR_DESCRIPTION =
  "YATools — مفت آن لائن ٹولز: اسکرین شاٹ، آڈیو سے متن، اردو وائس اوور، ہینڈ رائٹنگ اور مزید 14 مفید ٹولز۔ بغیر اکاؤنٹ، بغیر فیس — براہِ راست براؤزر میں۔";

const base = pageMeta({
  title: "YATools — مفت آن لائن ٹولز",
  description: UR_DESCRIPTION,
  path: "/ur",
});

export const metadata: Metadata = {
  ...base,
  alternates: {
    canonical: `${SITE.url}/ur`,
    languages: { en: "/", ur: "/ur" },
  },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "اردو", path: "/ur" },
];

const CATEGORY_UR: Record<ToolCategory, string> = {
  "Screenshots & PDF": "اسکرین شاٹ اور PDF",
  "Audio & Speech": "آڈیو اور آواز",
  "Urdu Tools": "اردو ٹولز",
  "Developer Tools": "ڈیویلپر ٹولز",
  "AI Tools": "اے آئی ٹولز",
  "Everyday Utilities": "روزمرہ کے مفید ٹولز",
};

const DESC_UR: Record<string, string> = {
  "website-screenshot":
    "کسی بھی ویب پیج کا مکمل اسکرین شاٹ بنائیں — صرف لنک پیسٹ کریں، تصویر ڈاؤن لوڈ کریں۔",
  "audio-to-text":
    "آڈیو فائل اپ لوڈ کریں اور درست تحریر حاصل کریں — لیکچرز اور انٹرویوز کے لیے۔",
  "text-to-speech":
    "متن کو قدرتی آواز میں بدلیں — اردو وائس اوور اور ویڈیو نیریشن کے لیے۔",
  "urdu-handwriting":
    "ٹائپ شدہ متن کو خوبصورت ہاتھ کی لکھائی میں بدلیں اور تصویر ڈاؤن لوڈ کریں۔",
  "wikipedia-to-pdf":
    "ویکیپیڈیا کا کوئی بھی مضمون صاف ستھری PDF میں محفوظ کریں۔",
  "n8n-workflow-search": "ہزاروں تیار n8n آٹومیشن ٹیمپلیٹس تلاش کریں۔",
  "ai-image-generator": "صرف لکھ کر تصاویر بنائیں — تھمب نیلز اور پوسٹس کے لیے۔",
  "movie-tv-search": "فلموں اور ڈراموں کی ریٹنگ، کاسٹ اور معلومات تلاش کریں۔",
  "qr-code-generator": "لنکس، متن یا وائی فائی کے لیے فوری QR کوڈ بنائیں۔",
  "word-counter": "الفاظ، حروف اور پڑھنے کا اندازاً وقت شمار کریں۔",
  "json-formatter": "JSON کو ترتیب دیں، چیک کریں اور منیفائی کریں۔",
  "password-generator": "مضبوط اور محفوظ پاس ورڈ بنائیں — سب کچھ آپ کے ڈیوائس پر۔",
  "case-converter": "متن کو ایک کلک میں مختلف کیسز میں بدلیں۔",
  "color-picker": "رنگ منتخب کریں اور HEX، RGB کوڈ فوری کاپی کریں۔",
};

const faqs = [
  {
    q: "کیا YATools واقعی مفت ہے؟",
    a: "جی ہاں۔ تمام ٹولز مفت ہیں — کوئی اکاؤنٹ بنانے یا ادائیگی کی ضرورت نہیں۔ کچھ ٹولز پر روزانہ مناسب استعمال کی حد ہوتی ہے تاکہ سروس سب کے لیے تیز رہے۔",
  },
  {
    q: "کیا میری فائلیں محفوظ رہتی ہیں؟",
    a: "جی ہاں۔ آپ کی اپ لوڈ کردہ فائلیں صرف پروسیسنگ کے لیے استعمال ہوتی ہیں اور ہمارے پاس محفوظ نہیں کی جاتیں۔",
  },
  {
    q: "کیا ٹولز اردو زبان سمجھتے ہیں؟",
    a: "جی ہاں۔ کئی ٹولز اردو سپورٹ کرتے ہیں — اردو ٹیکسٹ ٹو اسپیچ، اردو ہینڈ رائٹنگ، اور ویکیپیڈیا ٹو PDF اردو مضامین کے ساتھ بھی کام کرتا ہے۔",
  },
  {
    q: "کیا مجھے کچھ انسٹال کرنا ہوگا؟",
    a: "نہیں۔ تمام ٹولز آپ کے براؤزر میں چلتے ہیں — موبائل اور کمپیوٹر دونوں پر، بغیر کسی ایپ کے۔",
  },
];

const categories = Object.keys(CATEGORY_UR) as ToolCategory[];

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function Crumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        className="font-mono2 m-0 flex flex-wrap items-center gap-2 p-0 text-xs"
        style={{ listStyle: "none" }}
      >
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" style={{ color: "var(--muted)" }}>
                /
              </span>
            )}
            {i === items.length - 1 ? (
              <span aria-current="page" style={{ color: "var(--text)" }}>
                {item.name}
              </span>
            ) : (
              <Link
                href={item.path}
                className="no-underline hover:underline"
                style={{ color: "var(--muted)" }}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="card px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
      {items.map((item, i) => (
        <details key={i} className="faq-item" open={i === 0}>
          <summary className="faq-q" style={{ listStyle: "none" }}>
            <span>{item.q}</span>
            <span
              aria-hidden="true"
              className="font-mono2 text-xl leading-none font-bold"
              style={{ color: "var(--red)", flexShrink: 0 }}
            >
              +
            </span>
          </summary>
          <p className="faq-a">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <div dir="rtl" lang="ur">
      <JsonLd data={orgJsonLd()} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="wrap py-10 md:py-14">
        <Crumbs items={crumbs} />

        <div className="max-w-3xl">
          <p className="eyebrow mt-6">
            <span className="dot" /> مفت آن لائن ٹولز
          </p>
          <h1 className="hero-title mt-4">
            ہر روز کے کاموں کے لیے <em>مفت ٹولز</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            اسکرین شاٹس، آڈیو، دستاویزات، اردو مواد اور ڈیویلپر ٹولز — بغیر
            اکاؤنٹ اور بغیر فیس کے، براہِ راست آپ کے براؤزر میں۔
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="#tools" className="btn btn-primary">
              ٹولز دیکھیں
            </Link>
            <Link href="/" className="btn">
              English version
            </Link>
          </div>
        </div>

        <div id="tools" className="mt-14 space-y-12">
          {categories.map((cat) => (
            <section key={cat} aria-label={CATEGORY_UR[cat]}>
              <p className="sec-label">{CATEGORY_UR[cat]}</p>
              <div className="tool-grid">
                {TOOLS.filter((t) => t.category === cat).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="card card-hover p-5 no-underline block"
                  >
                    <span className="badge badge-green mb-3">
                      {t.badge}
                    </span>
                    <h2
                      className="font-extrabold text-lg text-[var(--text)] mb-1"
                      dir="ltr"
                      style={{ textAlign: "right" }}
                    >
                      {t.name}
                    </h2>
                    <p className="text-[var(--text2)] text-sm leading-7">
                      {DESC_UR[t.slug] ?? t.tagline}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-14">
          {[
            {
              t: "مکمل مفت",
              d: "تمام 14 ٹولز بغیر کسی فیس کے استعمال کریں۔",
            },
            {
              t: "بغیر اکاؤنٹ",
              d: "سائن اپ کی ضرورت نہیں — کھولیں اور فوراً استعمال کریں۔",
            },
            {
              t: "اردو سپورٹ",
              d: "اردو وائس اوور، ہینڈ رائٹنگ اور مزید اردو فیچرز۔",
            },
          ].map((f) => (
            <div key={f.t} className="card p-5">
              <h2 className="font-extrabold text-lg mb-1">{f.t}</h2>
              <p className="text-[var(--text2)] text-sm leading-7">{f.d}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mt-14">
          <p className="sec-label">اکثر پوچھے جانے والے سوالات</p>
          <h2 className="sec-title mb-6">سوالات و جوابات</h2>
          <FaqList items={faqs} />
        </div>

        <div className="max-w-3xl mt-12">
          <div className="card p-6 md:p-8 text-center">
            <h2 className="sec-title">آج ہی شروع کریں</h2>
            <p className="sec-sub mb-6 mx-auto">
              کوئی اکاؤنٹ نہیں، کوئی فیس نہیں — صرف مفید ٹولز۔
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="#tools" className="btn btn-primary">
                ٹولز آزمائیں
              </Link>
              <Link href="/contact" className="btn">
                رابطہ کریں
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
