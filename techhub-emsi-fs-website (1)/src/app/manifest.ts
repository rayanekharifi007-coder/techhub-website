import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechHub EMSI Fès",
    short_name: "TechHub",
    description: "Where Tech Meets Ideas.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    orientation: "portrait",
    background_color: "#0b0d10",
    theme_color: "#0b0d10",
    categories: ["education", "productivity", "developer"],
    shortcuts: [
      {
        name: "Projects",
        short_name: "Projects",
        url: "/projects",
      },
      {
        name: "Events",
        short_name: "Events",
        url: "/events",
      },
      {
        name: "Playground",
        short_name: "Play",
        url: "/techhub-playground",
      },
    ],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
