import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import { onRequest } from "./src/middleware/auth";

export default defineConfig({
  integrations: [tailwind()],
  middleware: {
    onRequest,
  },
});
