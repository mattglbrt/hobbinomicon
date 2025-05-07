import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://hobbinomicon.com",
  output: "server",
  adapter: netlify(),
  integrations: [
    tailwind(),
    sitemap(),
  ],
});