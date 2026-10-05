import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { SITE } from "@/lib/site";

const FAVICON_DATA_URI = "data:image/png;base64,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";

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
    images: [
      {
        url: "https://yatools-xyv3.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — Free Online Tools`,
      },
    ],
  },
  icons: {
    icon: [{ url: FAVICON_DATA_URI, type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Free Online Tools`,
    description: SITE.description,
    images: ["https://yatools-xyv3.vercel.app/og-image.jpg"],
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
      <body className={`${body.variable} ${mono.variable}`}>
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
