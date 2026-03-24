// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import netlify from '@astrojs/netlify';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './src/utils/remarkReadingTime.ts';
import sitemap from '@astrojs/sitemap';
import Inline from '@playform/inline';
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
  output: 'static',
  trailingSlash: 'always',
  adapter: netlify({ imageCDN: false }),
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Besley',
      cssVariable: '--font-besley',
      display: 'optional',
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/besley-regular.woff2'] },
          { weight: 700, style: 'normal', src: ['./src/assets/fonts/besley-regular.woff2'] },
          { weight: 400, style: 'italic', src: ['./src/assets/fonts/besley-italic.woff2'] },
          { weight: 700, style: 'italic', src: ['./src/assets/fonts/besley-italic.woff2'] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'IM Fell DW Pica',
      cssVariable: '--font-imfell',
      display: 'optional',
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/imfell-regular.woff2'] },
          { weight: 400, style: 'italic', src: ['./src/assets/fonts/imfell-italic.woff2'] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Cinzel Decorative',
      cssVariable: '--font-cinzel',
      display: 'optional',
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/cinzel-decorative-regular.woff2'] },
          { weight: 700, style: 'normal', src: ['./src/assets/fonts/cinzel-decorative-bold.woff2'] },
        ],
      },
    },
  ],
  image: {
    layout: 'constrained',
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [
    mdx(),
    Inline(),
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
