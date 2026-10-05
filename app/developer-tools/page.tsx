import { pageMeta } from "@/lib/site";
import HubPage, { type HubConfig } from "../hubs/HubPage";

export const metadata = pageMeta({
  title: "Free Developer Tools Online — JSON, Base64 & More",
  description:
    "Free developer tools online: JSON formatter, Base64 encoder, password generator, color picker, and more. Fast, private, no sign-up — try them free now.",
  path: "/developer-tools",
  keywords: [
    "free developer tools online",
    "json formatter online",
    "base64 encoder decoder",
    "password generator online",
    "online dev tools",
  ],
});

const config: HubConfig = {
  path: "/developer-tools",
  hubName: "Developer Tools",
  title: "Free Developer Tools Online",
  description:
    "Free online developer tools: format JSON, encode Base64, generate passwords, pick colors, convert units, and handle everyday text tasks.",
  intro: [
    "Free developer tools online are the quick utilities programmers reach for dozens of times a day: pasting messy JSON to format and validate it, encoding a string to Base64, generating a strong password, or checking what a color looks like. This collection puts those utilities one click away, with no sign-up and no clutter.",
    "Everything sensitive here runs entirely in your browser. That matters for developer tools more than anywhere else: pasting an API key, a token, or production data into a random website is a real security risk. These tools never send your input to a server — what you paste stays on your machine.",
    "Alongside the code-focused tools you'll find everyday text utilities developers use constantly: word counter, case converter, URL and HTML encoders, Unix timestamp converter, lorem ipsum generator, slug generator, and Markdown converters. Simple jobs, done instantly, without opening an IDE.",
  ],
  slugs: [
    "json-formatter",
    "password-generator",
    "word-counter",
    "case-converter",
    "color-picker",
    "unit-converter",
    "base64-encoder-decoder",
    "url-encoder-decoder",
    "html-encoder-decoder",
    "unix-timestamp-converter",
    "lorem-ipsum-generator",
    "slug-generator",
    "markdown-to-html-converter",
    "html-to-markdown-converter",
  ],
  chooseTitle: "How to choose the right developer tool",
  chooseIntro:
    "Developer tools are single-purpose by design. Identify your data type first, then pick the tool.",
  choose: [
    {
      title: "Validating vs. formatting JSON",
      body: "The JSON formatter does both: it validates your JSON and shows you exactly where the error is, then pretty-prints it so the structure is readable. Always validate before blaming your code.",
    },
    {
      title: "Encoding is not encryption",
      body: "Base64, URL encoding, and HTML encoding change how data looks, not who can read it. They are safe for formatting and transport — never use them to 'protect' secrets or passwords.",
    },
    {
      title: "Generate passwords, don't invent them",
      body: "The password generator creates long, random passwords that humans can't guess. Pair it with a password manager — a generated password you can't remember is useless without one.",
    },
    {
      title: "Timestamps and timezones",
      body: "The Unix timestamp converter turns epoch seconds into a readable date and back. Remember that timestamps are always in UTC — your local time display depends on your device's timezone setting.",
    },
  ],
  faqs: [
    {
      q: "Are these developer tools free?",
      a: "Yes. Every developer tool on this page is free with no sign-up and no usage limits. They run in your browser, so there is nothing to pay for and no account to create.",
    },
    {
      q: "Is it safe to paste API keys or secrets here?",
      a: "These tools process everything locally in your browser and never send your input to a server, so pasting sensitive data is far safer here than on a typical online tool. Still, avoid pasting live production secrets anywhere you don't fully trust, as a habit.",
    },
    {
      q: "What is the difference between Base64 encoding and encryption?",
      a: "Base64 encoding just represents data in a different format — anyone can decode it instantly. Encryption uses a key to actually hide the data. Use encoding for formatting and transport, encryption for secrecy.",
    },
    {
      q: "How do I make a URL-safe slug from a title?",
      a: "The slug generator lowercases your title, replaces spaces and special characters with hyphens, and strips anything that doesn't belong in a URL. The result works in web addresses, file names, and IDs.",
    },
  ],
};

export default function DeveloperToolsPage() {
  return <HubPage config={config} />;
}
