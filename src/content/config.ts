import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
    campaign: z.string().optional(),
    // Party the character currently belongs to (for Dramatis Personae)
    party: z.string().optional(),
    // Resource type for categorizing resource pages
    resourceType: z.enum(['hub', 'guide', 'article', 'checklist']).optional(),
    // Campaign type for categorizing campaign pages (hub = overview, episode = individual session, settlement = sub-campaign tracker)
    campaignType: z.enum(['hub', 'episode', 'settlement']).optional(),
    // Episode/chapter number for ordering campaign episodes
    episodeNumber: z.number().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
    game: z.string().optional(),
  }),
});

export const collections = { blog, projects };
