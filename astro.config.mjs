import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://hobbinomicon.com", // <- Your real or Netlify site URL here!
  integrations: [
    tailwind(),
    sitemap(),
  ],
});
