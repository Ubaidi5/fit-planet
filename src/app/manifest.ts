import type { MetadataRoute } from "next";

/** Lets members add Fit Planet to their home screen; the pass opens like an app */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fit Planet",
    short_name: "Fit Planet",
    description: "One pass for every gym on the planet.",
    start_url: "/app/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#eef0ec",
    theme_color: "#eef0ec",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
