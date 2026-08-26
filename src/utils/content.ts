import { getCollection, type CollectionEntry } from 'astro:content';

export type Vlog = CollectionEntry<'vlog'>;
export type Guide = CollectionEntry<'guides'>;
export type Series = CollectionEntry<'series'>;
export type Game = CollectionEntry<'games'>;

/**
 * Where things live after the 2026-08 re-architecture.
 *
 * One collection can render at three different URL shapes, so the mapping is
 * centralised here rather than rebuilt in each route. scripts/generate-redirects.mjs
 * applies the same rule for guides; if you change one, change both, or the
 * redirect map will point at URLs the build never produced.
 */

/** Game slugs, used to spot a guide nested under its game. */
let gameSlugCache: Set<string> | null = null;
async function gameSlugs(): Promise<Set<string>> {
  if (!gameSlugCache) {
    gameSlugCache = new Set((await getCollection('games')).map((g) => g.id));
  }
  return gameSlugCache;
}

/**
 * Most guides sit at /guides/{id}/. A guide nested in a directory named after
 * a game belongs to that game and renders under it — the 13 Mage Knight
 * resource pages are the reason this exists.
 */
export async function guideUrl(guide: Guide): Promise<string> {
  const [first, ...rest] = guide.id.split('/');
  if (rest.length && (await gameSlugs()).has(first)) return `/games/${guide.id}/`;
  return `/guides/${guide.id}/`;
}

/** Sync form, for when the game slugs are already to hand. */
export function guideUrlWith(guide: Guide, games: Set<string>): string {
  const [first, ...rest] = guide.id.split('/');
  if (rest.length && games.has(first)) return `/games/${guide.id}/`;
  return `/guides/${guide.id}/`;
}

/**
 * The vlog collection holds three things. `series` sends an entry to the
 * series hub, `kind: 'article'` to /articles/, everything else to /vlog/.
 */
export function vlogUrl(entry: Vlog): string {
  if (entry.data.series) return `/series/${entry.data.series.id}/${entry.id}/`;
  if (entry.data.kind === 'article') return `/articles/${entry.id}/`;
  return `/vlog/${entry.id}/`;
}

export const seriesUrl = (s: Series | string) =>
  `/series/${typeof s === 'string' ? s : s.id}/`;

/* ------------------------------------------------------------ accessors -- */

const published = <T extends { data: { draft?: boolean } }>(items: T[]) =>
  items.filter((i) => !i.data.draft);

const byDate = <T extends { data: { pubDate: Date } }>(items: T[]) =>
  [...items].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

/** Everything in the vlog collection, drafts removed, newest first. */
export async function getAllVlogEntries(): Promise<Vlog[]> {
  return byDate(published(await getCollection('vlog')));
}

/** The daily archive: no series, not an article. This is what /vlog/ lists. */
export async function getVlogs(): Promise<Vlog[]> {
  return (await getAllVlogEntries()).filter(
    (e) => !e.data.series && e.data.kind !== 'article'
  );
}

export async function getArticles(): Promise<Vlog[]> {
  return (await getAllVlogEntries()).filter((e) => e.data.kind === 'article');
}

/** Series episodes, oldest first — a campaign reads forwards. */
export async function getEpisodes(seriesId?: string): Promise<Vlog[]> {
  const eps = (await getAllVlogEntries()).filter((e) =>
    seriesId ? e.data.series?.id === seriesId : Boolean(e.data.series)
  );
  return eps.sort((a, b) => {
    const ea = a.data.episode, eb = b.data.episode;
    if (ea !== undefined && eb !== undefined) return ea - eb;
    if (ea !== undefined) return -1;
    if (eb !== undefined) return 1;
    return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
  });
}

export async function getGuides(): Promise<Guide[]> {
  return byDate(published(await getCollection('guides')));
}

export async function getSeries(): Promise<Series[]> {
  return published(await getCollection('series'));
}

export async function getGames(): Promise<Game[]> {
  return published(await getCollection('games'));
}

/* --------------------------------------------------------------- topics -- */

/** Display names for guides.topic. The enum values are the URL slugs. */
export const TOPICS = {
  'painting': 'Painting',
  'basing-and-terrain': 'Basing & Terrain',
  'airbrushing': 'Airbrushing',
  'sculpting-casting-3d-printing': 'Sculpting, Casting & 3D Printing',
  'kitbashing': 'Kitbashing',
  'solo-rpg': 'Solo RPG',
  'getting-started': 'Getting Started',
  'buying-and-selling': 'Buying & Selling',
  'review': 'Reviews',
} as const;

export type Topic = keyof typeof TOPICS;

/**
 * One line per topic landing page, so each is a page rather than a bare list.
 * Written for a reader who arrived from a search, not for a crawler.
 */
export const TOPIC_INTROS: Record<Topic, string> = {
  'painting': 'Recipes, colour choices, and easy to follow techniques. Most of these are one model, start to finish, with the paints named.',
  'basing-and-terrain': 'Bases, boards, and the scenery that goes on them. Cheap materials, mostly, because a table full of terrain adds up fast.',
  'airbrushing': 'Everything to do with using an airbrush, especially what to do when it clogs.',
  'sculpting-casting-3d-printing': 'Making models rather than buying them: green stuff, moulds, and resin, and getting a printer to behave.',
  'kitbashing': 'Cutting models up and gluing them back together wrong on purpose.',
  'solo-rpg': 'Playing without a group. Oracles, journalling, and the kit that makes a solo session work.',
  'getting-started': 'How to start playing a game, from what to buy first to getting good.',
  'buying-and-selling': 'Buying, selling, and trading miniatures.',
  'review': 'First looks, unboxings, and whether the thing was worth the money.',
};

export const HUBS = { warmachine: 'Warmachine', warhammer: 'Warhammer' } as const;
export type Hub = keyof typeof HUBS;

/** Display names for guides.system, within the Warhammer hub. */
export const SYSTEMS = {
  '40k': 'Warhammer 40,000',
  'the-old-world': 'The Old World',
  'spearhead': 'Spearhead',
  'age-of-sigmar': 'Age of Sigmar',
  'kill-team': 'Kill Team',
  'necromunda': 'Necromunda',
  'other': 'Other Games Workshop',
} as const;

/* ---------------------------------------------------------------- tags --- */

export interface TaggedItem {
  id: string;
  href: string;
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
  heroImage?: string;
  youtubeId?: string;
  kind: 'Guide' | 'Vlog' | 'Article' | 'Series';
}

/**
 * Everything a tag page should list, across collections. Guides sort first
 * within a date tie so a tag page leads with the pages worth reading, then the
 * archive that mentions the same thing.
 */
export async function getTaggedItems(): Promise<TaggedItem[]> {
  const games = new Set((await getCollection('games')).map((g) => g.id));
  const [guides, entries] = await Promise.all([getGuides(), getAllVlogEntries()]);

  const rank = { Guide: 0, Article: 1, Series: 2, Vlog: 3 } as const;

  const items: TaggedItem[] = [
    ...guides.map((g) => ({
      id: g.id,
      href: guideUrlWith(g, games),
      title: g.data.title,
      description: g.data.description,
      pubDate: g.data.pubDate,
      tags: g.data.tags,
      heroImage: g.data.heroImage,
      youtubeId: g.data.youtubeId,
      kind: 'Guide' as const,
    })),
    ...entries.map((p) => ({
      id: p.id,
      href: vlogUrl(p),
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      tags: p.data.tags,
      heroImage: p.data.heroImage,
      youtubeId: p.data.youtubeId,
      kind: (p.data.series ? 'Series' : p.data.kind === 'article' ? 'Article' : 'Vlog') as
        | 'Series'
        | 'Article'
        | 'Vlog',
    })),
  ];

  return items.sort(
    (a, b) =>
      rank[a.kind] - rank[b.kind] || b.pubDate.valueOf() - a.pubDate.valueOf()
  );
}

/** tag -> everything carrying it. */
export async function groupTaggedItems(): Promise<Map<string, TaggedItem[]>> {
  const map = new Map<string, TaggedItem[]>();
  for (const item of await getTaggedItems()) {
    for (const tag of item.tags) {
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag)!.push(item);
    }
  }
  return map;
}
