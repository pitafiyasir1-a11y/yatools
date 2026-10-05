import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YATools — Free Online Tools",
    short_name: "YATools",
    description:
      "Free online tools for screenshots, audio, documents, and everyday work. No sign-up.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e5",
    theme_color: "#e0263c",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
