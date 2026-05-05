import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
    generateId: ({ entry }) => {
      // Strip file extension and trailing /index to match Astro 5 slug behavior
      return entry.replace(/\.mdx?$/, '').replace(/\/index$/, '');
    },
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    youtubeId: z.string().optional(),
    youtubeTranscript: z.string().optional(),
    project: z.string().optional(),
    projectOrder: z.number().optional(),
    hideRelatedPosts: z.boolean().default(false),
    // Resource type for categorizing resource pages
    resourceType: z.enum(['hub', 'guide', 'article', 'checklist']).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
    game: z.string().optional(),
  }),
});

export const collections = { blog, projects };
