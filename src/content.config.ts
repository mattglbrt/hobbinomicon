import { defineCollection, reference, z } from 'astro:content';
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

const games = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/games',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    thumbnailImage: z.string().optional(),
    thumbnailImageAlt: z.string().optional(),
    logo: z.string().optional(),
    logoAlt: z.string().optional(),
    draft: z.boolean().default(false),

    // Identity
    studio: reference('studios').optional(),
    designers: z.array(reference('people')).default([]),
    currentEdition: z.string().optional(),
    releaseYear: z.number().optional(),

    // Quick specs (rendered as pill row at top of game page)
    playerCount: z.string().optional(),
    modelCount: z.string().optional(),
    boardSize: z.string().optional(),
    pointsScale: z.string().optional(),
    gameLength: z.string().optional(),
    costToStart: z.string().optional(),

    // Categorization
    format: z.enum(['ttrpg', 'skirmish', 'large-scale-army', 'mass-battle', 'boardgame']),
    solo: z.boolean().default(false),
    miniatureAgnostic: z.boolean().default(false),
    tier: z.enum(['indie', 'big']),
    status: z.enum(['active', 'oop', 'kickstarter', 'announced']).default('active'),
    tags: z.array(z.string()).default([]),

    // Funnel
    relatedGames: z.array(reference('games')).default([]),
    verdict: z.string().optional(),

    // Reference card links
    officialUrl: z.string().url().optional(),
    storeUrl: z.string().url().optional(),
    rulesUrl: z.string().url().optional(),
    discordUrl: z.string().url().optional(),
    subredditUrl: z.string().url().optional(),
    kickstarterUrl: z.string().url().optional(),

    podcasts: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
    })).default([]),
    creators: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
    })).default([]),
  }),
});

const studios = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/studios',
  }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    draft: z.boolean().default(false),

    founded: z.number().optional(),
    headquarters: z.string().optional(),

    officialUrl: z.string().url().optional(),
    storeUrl: z.string().url().optional(),
    discordUrl: z.string().url().optional(),
    kickstarterUrl: z.string().url().optional(),
    twitterUrl: z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
    youtubeUrl: z.string().url().optional(),
    patreonUrl: z.string().url().optional(),
  }),
});

const people = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/people',
  }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    draft: z.boolean().default(false),

    roles: z.array(z.enum([
      'designer', 'sculptor', 'painter', 'podcaster',
      'creator', 'writer', 'streamer',
    ])).default([]),
    studios: z.array(reference('studios')).default([]),

    websiteUrl: z.string().url().optional(),
    twitterUrl: z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
    youtubeUrl: z.string().url().optional(),
    twitchUrl: z.string().url().optional(),
    patreonUrl: z.string().url().optional(),
    blueskyUrl: z.string().url().optional(),
  }),
});

const news = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/news',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    draft: z.boolean().default(false),

    kind: z.enum([
      'kickstarter', 'release', 'errata', 'announcement',
      'interview', 'community', 'other',
    ]).default('other'),

    relatedGame: reference('games').optional(),
    relatedStudio: reference('studios').optional(),
    relatedPerson: reference('people').optional(),

    source: z.enum(['authored', 'curated', 'rss']).default('authored'),
    sourceUrl: z.string().url().optional(),
    sourceName: z.string().optional(),
  }),
});

export const collections = { blog, projects, games, studios, people, news };
