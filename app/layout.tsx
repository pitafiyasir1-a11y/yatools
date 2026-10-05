import type { Metadata } from "next";
import { Bangers, DM_Sans, DM_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { SITE } from "@/lib/site";

const display = Bangers({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700", "800"],
});
const mono = DM_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Free Online Tools for Screenshots, Audio, Documents & Developers`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — Free Online Tools`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Free Online Tools`,
    description: SITE.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Set theme before paint to avoid flash; default is light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('yatools-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
        <style>{`.skip-link{position:absolute;left:-9999px;top:0;z-index:100;background:var(--red);color:#fff;font-weight:700;padding:10px 18px;border-radius:0 0 10px 0}.skip-link:focus{left:0}`}</style>
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
