import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Renamed from `blog` in the 2026-08 re-architecture. Holds the daily vlog
// archive, the series episodes (which render under /series/{series}/) and the
// handful of essays (`kind: 'article'`, rendered under /articles/). One
// collection rather than three, because they share a template lineage and a
// schema; the routes tell them apart, not the loader.
const vlog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/vlog',
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
    // Optional since the re-architecture: the collection is the category now,
    // and /categories/ is retired in Phase 2. Existing values are left in
    // place rather than stripped.
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    youtubeId: z.string().optional(),
    youtubeTranscript: z.string().optional(),
    project: z.string().optional(),
    projectOrder: z.number().optional(),
    projectSection: z.string().optional(),
    hideRelatedPosts: z.boolean().default(false),
    // Resource type for categorizing resource pages
    resourceType: z.enum(['hub', 'guide', 'article', 'checklist']).optional(),

    // An essay rather than a video post. Routed at /articles/{slug}/.
    kind: z.enum(['vlog', 'article']).default('vlog'),

    // Campaign / live-play membership. Set together: an entry with `series`
    // renders at /series/{series}/{slug}/ instead of /vlog/{slug}/.
    series: reference('series').optional(),
    episode: z.number().optional(),
  }),
});

// Promoted from the vlog archive: the ~95 posts that are tutorials rather than
// diary entries. The split exists so Google, and a reader, can tell a recipe
// from a mail-day.
const guides = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/guides',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, '').replace(/\/index$/, ''),
  }),
  schema: z.object({
    // Search-intent title. `videoTitle` keeps the original YouTube one, which
    // is written for a thumbnail, not a <title>.
    title: z.string(),
    videoTitle: z.string().optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    youtubeId: z.string().optional(),

    topic: z.enum([
      'painting', 'basing-and-terrain', 'airbrushing',
      'sculpting-casting-3d-printing', 'kitbashing', 'solo-rpg',
      'getting-started', 'buying-and-selling', 'review',
    ]),

    // Drives the game page's guide sections and the on-ramp hubs.
    game: reference('games').optional(),
    hub: z.enum(['warmachine', 'warhammer']).optional(),

    // Which GW games this applies to, within the Warhammer hub. The values are
    // the future /warhammer/{system}/ slugs, chosen once now so splitting the
    // hub later is a template change and not a migration. Extend as games are
    // added.
    //
    // An array because a recipe is not always tied to one game: "How to Paint
    // Pale Orc Skin" is 40k, The Old World and Spearhead alike, and filing it
    // under one of them would hide it from the other two both on the hub today
    // and on the per-system pages later.
    system: z.array(z.enum([
      '40k', 'the-old-world', 'spearhead', 'age-of-sigmar',
      'kill-team', 'necromunda', 'other',
    ])).default([]),

    faction: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    timeMinutes: z.number().optional(),

    materials: z.array(z.object({
      name: z.string(),
      url: z.string().url().optional(),
      affiliate: z.boolean().default(false),
    })).default([]),

    // Feeds HowTo schema; the body elaborates.
    steps: z.array(z.string()).default([]),

    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),

    // Carried over from the blog schema rather than dropped on migration:
    // 16 promoted guides have `project`, 13 Mage Knight pages have
    // `resourceType`, and games.relatedProjects still points at project slugs.
    project: z.string().optional(),
    projectOrder: z.number().optional(),
    projectSection: z.string().optional(),
    resourceType: z.enum(['hub', 'guide', 'article', 'checklist']).optional(),
    hideRelatedPosts: z.boolean().default(false),

    // Where this lived before the re-architecture, without the leading slash.
    // Feeds scripts/generate-redirects.mjs, which dedupes against the url-map
    // CSVs, so setting it when the slug did not change is harmless.
    legacySlug: z.string().optional(),
  }),
});

// Campaign and live-play runs: Kingdom Death blind playthrough, Kal Arath.
// Episodes live in the vlog collection and point back here.
const series = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/series',
  }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    draft: z.boolean().default(false),

    game: reference('games').optional(),
    youtubePlaylist: z.string().url().optional(),
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
    // `large-scale-army` and `mass-battle` merged into `army` (2026-08): the
    // directory advertised three army-scale shelves and only ever filled one.
    format: z.enum(['skirmish', 'army', 'narrative', 'ttrpg', 'boardgame']),
    solo: z.boolean().default(false),
    miniatureAgnostic: z.boolean().default(false),
    tier: z.enum(['indie', 'big']),
    // On-ramp membership. The hub at /warmachine/ or /warhammer/ is a
    // marketing surface that pulls from this entry; the game page stays the
    // canonical entity.
    hub: z.enum(['warmachine', 'warhammer']).optional(),
    status: z.enum(['active', 'oop', 'kickstarter', 'announced']).default('active'),
    pinned: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    // Search aliases: alternate spellings, spacings, abbreviations, and common
    // misspellings, indexed (hidden) so e.g. "relic blade" finds "Relicblade".
    aliases: z.array(z.string()).default([]),

    // Funnel
    relatedGames: z.array(reference('games')).default([]),
    // Suppress the "if you like X, try Y" section entirely on this game's page.
    // For entries where the directory has no honest comparison to offer yet —
    // scored suggestions would be reaching. Clearing the flag (or adding
    // relatedGames) brings the section back.
    hideFunnel: z.boolean().default(false),
    // Slugs of former project series whose build posts now live on this game
    // page (the Projects section was retired; content relocated here).
    relatedProjects: z.array(z.string()).default([]),
    verdict: z.string().optional(),

    // Reference card links
    officialUrl: z.string().url().optional(),
    storeUrl: z.string().url().optional(),
    rulesUrl: z.string().url().optional(),
    discordUrl: z.string().url().optional(),
    subredditUrl: z.string().url().optional(),
    kickstarterUrl: z.string().url().optional(),
    facebookUrl: z.string().url().optional(),

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

    aliases: z.array(z.string()).default([]),
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
    facebookUrl: z.string().url().optional(),
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

    aliases: z.array(z.string()).default([]),
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
      'kickstarter', 'indie-game-news', 'release', 'errata',
      'announcement', 'interview', 'community', 'other',
    ]).default('other'),

    relatedGame: reference('games').optional(),
    relatedStudio: reference('studios').optional(),
    relatedPerson: reference('people').optional(),

    source: z.enum(['authored', 'curated', 'rss']).default('authored'),
    sourceUrl: z.string().url().optional(),
    sourceName: z.string().optional(),
  }),
});

export const collections = { vlog, guides, series, games, studios, people, news };
