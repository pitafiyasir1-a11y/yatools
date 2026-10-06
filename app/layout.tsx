import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { SITE } from "@/lib/site";

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
    icon: [{ url: "/logo-icon.png", type: "image/png" }],
    shortcut: [{ url: "/logo-icon.png", type: "image/png" }],
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
