import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YATools — Free Online Tools",
    short_name: "YATools",
    description:
      "Free online tools for screenshots, audio, documents, and everyday work. No sign-up.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e0263c",
    icons: [
      { src: "/logo-icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
