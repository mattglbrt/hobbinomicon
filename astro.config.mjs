// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './src/utils/remarkReadingTime.ts';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

// Build a map of URL paths to their lastmod dates by walking content collections
function getCollectionDates() {
  const dates = new Map();

  function processDir(dir, urlPrefix) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        processDir(fullPath, urlPrefix + entry.name + '/');
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        const updatedMatch = content.match(/updatedDate:\s*['"]?(\d{4}-\d{2}-\d{2})/);
        const pubMatch = content.match(/pubDate:\s*['"]?(\d{4}-\d{2}-\d{2})/);

        const date = updatedMatch?.[1] || pubMatch?.[1];
        if (date) {
          // Strip /index suffix to match Astro 6 slug behavior
          const slug = (urlPrefix + entry.name.replace(/\.mdx?$/, '')).replace(/\/index$/, '');
          dates.set(`/${slug}/`, new Date(date));
        }
      }
    }
  }

  processDir('./src/content/blog', 'blog/');
  processDir('./src/content/games', 'games/');
  processDir('./src/content/studios', 'studios/');
  processDir('./src/content/people', 'people/');
  processDir('./src/content/news', 'news/');
  processDir('./src/content/projects', 'projects/');

  return dates;
}

const contentDates = getCollectionDates();

// https://astro.build/config
export default defineConfig({
  site: 'https://hobbinomicon.com',
  output: 'static',
  trailingSlash: 'always',
  adapter: netlify({ imageCDN: false }),
  // Inline all stylesheets so we don't get CLS from deferred CSS arriving
  // after first paint. The site CSS bundle is ~64KB unminified (~12KB Brotli),
  // small enough that the per-page inlining cost is preferable to the
  // beasties-based critical-CSS extraction (which kept missing classes and
  // causing 0.7+ CLS on long-form pages).
  build: {
    inlineStylesheets: 'always',
  },
  image: {
    layout: 'constrained',
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const excludePatterns = [
          '/contact-success/',
          '/secret-toad/',
          '/404/',
        ];
        if (excludePatterns.some(pattern => page.includes(pattern))) return false;
        // Exclude paginated index pages (e.g. /blog/2/, /vlogs/3/) — keep page 1.
        if (/\/(blog|vlogs)\/\d+\/$/.test(page)) return false;
        return true;
      },
      serialize: (item) => {
        // Match the URL pathname against the content date map
        const url = new URL(item.url);
        const date = contentDates.get(url.pathname);
        if (date) {
          return {
            ...item,
            lastmod: date.toISOString(),
          };
        }
        return item;
      },
    }),
  ],
});
