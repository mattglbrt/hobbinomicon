// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

// Build a map of blog post slugs to their lastmod dates
function getBlogPostDates() {
  const dates = new Map();
  const blogDir = './src/content/blog';

  function processDir(dir, pathPrefix = '') {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        processDir(fullPath, pathPrefix + entry.name + '/');
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Extract dates from frontmatter
        const updatedMatch = content.match(/updatedDate:\s*(\d{4}-\d{2}-\d{2})/);
        const pubMatch = content.match(/pubDate:\s*(\d{4}-\d{2}-\d{2})/);

        const date = updatedMatch?.[1] || pubMatch?.[1];
        if (date) {
          // Build the slug from file path
          const slug = pathPrefix + entry.name.replace(/\.mdx?$/, '');
          dates.set(slug, new Date(date));
        }
      }
    }
  }

  processDir(blogDir);
  return dates;
}

const blogPostDates = getBlogPostDates();

// https://astro.build/config
export default defineConfig({
  site: 'https://hobbinomicon.com',
  integrations: [
    tailwind(),
    mdx(),
    sitemap({
      filter: (page) => {
        // Exclude low-value and private pages
        const excludePatterns = [
          '/contact-success/',
          '/secret-toad/',
          '/404/',
          '/blog/2/', '/blog/3/', '/blog/4/', '/blog/5/',
          '/blog/6/', '/blog/7/', '/blog/8/', '/blog/9/',
          '/blog/10/', '/blog/11/', '/blog/12/',
        ];
        return !excludePatterns.some(pattern => page.includes(pattern));
      },
      serialize: (item) => {
        // Extract slug from URL for blog posts
        const blogMatch = item.url.match(/\/blog\/(.+)\/$/);
        if (blogMatch) {
          const slug = blogMatch[1];
          const postDate = blogPostDates.get(slug);
          if (postDate) {
            return {
              ...item,
              lastmod: postDate.toISOString(),
            };
          }
        }

        // For non-blog pages, don't include lastmod (optional)
        return item;
      },
    }),
  ],
});
