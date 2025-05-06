import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify"; // ✅ New import for Netlify deployment

export default defineConfig({
  site: "https://hobbinomicon.com", // ✅ Keep your site URL
  output: "server",                 // ✅ Switch to server mode for dynamic pages
  adapter: netlify(),                // ✅ Tell Astro to use Netlify server adapter
  integrations: [
    tailwind(),
    sitemap(),
  ],
});
