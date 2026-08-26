/**
 * Per-collection document builders shared by the `.md` endpoints and
 * /llms-full.txt, so a page's markdown rendering is identical wherever it
 * appears. Descriptions always come from existing frontmatter.
 */

import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { canonical, type MarkdownDoc } from './markdownExport';

export type Game = CollectionEntry<'games'>;
export type Studio = CollectionEntry<'studios'>;
export type Person = CollectionEntry<'people'>;
export type News = CollectionEntry<'news'>;
export type Post = CollectionEntry<'vlog'>;
export type Guide = CollectionEntry<'guides'>;

export const gameUrl = (g: Game) => canonical(`games/${g.id}`);
export const studioUrl = (s: Studio) => canonical(`studios/${s.id}`);
export const personUrl = (p: Person) => canonical(`people/${p.id}`);
export const newsUrl = (n: News) => canonical(`news/${n.id}`);
/**
 * The vlog collection renders at three URL shapes. Kept in step with
 * src/utils/content.ts — if one changes, both change.
 */
export const postUrl = (p: Post) =>
  p.data.series
    ? canonical(`series/${p.data.series.id}/${p.id}`)
    : p.data.kind === 'article'
      ? canonical(`articles/${p.id}`)
      : canonical(`vlog/${p.id}`);

/** Guides nested under a game slug render beneath that game. */
export const guideUrlFor = (g: Guide, gameSlugs: Set<string>) => {
  const [first, ...rest] = g.id.split('/');
  return rest.length && gameSlugs.has(first)
    ? canonical(`games/${g.id}`)
    : canonical(`guides/${g.id}`);
};

export async function gameDoc(game: Game): Promise<MarkdownDoc> {
  const d = game.data;
  const studio = d.studio ? await getEntry(d.studio) : null;
  const designers = await Promise.all(d.designers.map((ref) => getEntry(ref)));

  return {
    title: d.title,
    description: d.description,
    url: gameUrl(game),
    date: d.pubDate,
    updated: d.updatedDate,
    tags: d.tags,
    extra: {
      format: d.format,
      tier: d.tier,
      status: d.status,
      solo: d.solo ? 'yes' : undefined,
      miniatureAgnostic: d.miniatureAgnostic ? 'yes' : undefined,
      currentEdition: d.currentEdition,
      releaseYear: d.releaseYear ? String(d.releaseYear) : undefined,
      playerCount: d.playerCount,
      modelCount: d.modelCount,
      boardSize: d.boardSize,
      pointsScale: d.pointsScale,
      gameLength: d.gameLength,
      costToStart: d.costToStart,
      studio: studio ? `${studio.data.name} (${canonical(`studios/${studio.id}`)})` : undefined,
      designers: designers.length ? designers.map((p) => p!.data.name).join(', ') : undefined,
      verdict: d.verdict,
      officialUrl: d.officialUrl,
      rulesUrl: d.rulesUrl,
      storeUrl: d.storeUrl,
    },
    body: game.body ?? '',
  };
}

export function studioDoc(studio: Studio): MarkdownDoc {
  const d = studio.data;
  return {
    title: d.name,
    description: d.description,
    url: studioUrl(studio),
    date: d.pubDate,
    updated: d.updatedDate,
    extra: {
      founded: d.founded ? String(d.founded) : undefined,
      headquarters: d.headquarters,
      officialUrl: d.officialUrl,
      storeUrl: d.storeUrl,
    },
    body: studio.body ?? '',
  };
}

export async function personDoc(person: Person): Promise<MarkdownDoc> {
  const d = person.data;
  const studios = await Promise.all(d.studios.map((ref) => getEntry(ref)));
  return {
    title: d.name,
    description: d.bio,
    url: personUrl(person),
    date: d.pubDate,
    updated: d.updatedDate,
    extra: {
      roles: d.roles.length ? d.roles.join(', ') : undefined,
      studios: studios.length ? studios.map((s) => s!.data.name).join(', ') : undefined,
      websiteUrl: d.websiteUrl,
    },
    body: person.body ?? '',
  };
}

export function newsDoc(item: News): MarkdownDoc {
  const d = item.data;
  return {
    title: d.title,
    description: d.description,
    url: newsUrl(item),
    date: d.pubDate,
    updated: d.updatedDate,
    extra: {
      kind: d.kind,
      source: d.source,
      sourceUrl: d.sourceUrl,
      sourceName: d.sourceName,
    },
    body: item.body ?? '',
  };
}

export function postDoc(post: Post): MarkdownDoc {
  const d = post.data;
  return {
    title: d.title,
    description: d.description,
    url: postUrl(post),
    date: d.pubDate,
    updated: d.updatedDate,
    tags: d.tags,
    extra: {
      category: d.category,
      series: d.series?.id,
      episode: d.episode !== undefined ? String(d.episode) : undefined,
      youtube: d.youtubeId ? `https://www.youtube.com/watch?v=${d.youtubeId}` : undefined,
    },
    body: post.body ?? '',
  };
}

/**
 * A guide's markdown rendering. Richer `extra` than a vlog's, because the
 * structured fields are the point of the collection — an LLM asked "how do I
 * paint X" should get the topic, the paints and the steps, not just prose.
 */
export function guideDoc(guide: Guide, gameSlugs: Set<string>): MarkdownDoc {
  const d = guide.data;
  return {
    title: d.title,
    description: d.description,
    url: guideUrlFor(guide, gameSlugs),
    date: d.pubDate,
    updated: d.updatedDate,
    tags: d.tags,
    extra: {
      topic: d.topic,
      game: d.game?.id,
      hub: d.hub,
      system: d.system,
      faction: d.faction,
      difficulty: d.difficulty,
      timeMinutes: d.timeMinutes ? String(d.timeMinutes) : undefined,
      videoTitle: d.videoTitle !== d.title ? d.videoTitle : undefined,
      materials: d.materials.length ? d.materials.map((m) => m.name).join(', ') : undefined,
      steps: d.steps.length ? d.steps.map((s, i) => `${i + 1}. ${s}`).join(' ') : undefined,
      youtube: d.youtubeId ? `https://www.youtube.com/watch?v=${d.youtubeId}` : undefined,
    },
    body: guide.body ?? '',
  };
}

/**
 * Everything the GEO outputs index, already filtered for drafts and sorted.
 * The vlog collection is split by what an entry is rather than where its file
 * sits: `series` makes it an episode, `kind: 'article'` an essay, neither a
 * vlog. Guides are their own collection and lead the output — they are the
 * pages worth citing.
 */
export async function getGeoContent() {
  const [games, studios, people, news, posts, guides, series] = await Promise.all([
    getCollection('games', ({ data }) => !data.draft),
    getCollection('studios', ({ data }) => !data.draft),
    getCollection('people', ({ data }) => !data.draft),
    getCollection('news', ({ data }) => !data.draft),
    getCollection('vlog', ({ data }) => !data.draft),
    getCollection('guides', ({ data }) => !data.draft),
    getCollection('series', ({ data }) => !data.draft),
  ]);

  // Tie-break on id. Date-only pubDates all parse to UTC midnight, so same-day
  // posts tie exactly and would otherwise fall back to the glob loader's
  // filesystem order — which differs between macOS and Netlify's Linux.
  //
  // Note this does NOT fix the wider ordering drift: ~192 posts carry
  // `pubDate: "YYYY-MM-DD HH:MM:SS"` with no timezone, which JS parses as
  // *local* time, so they resolve to different instants here vs. on Netlify.
  // Pre-existing and not specific to these outputs (it moves RSS and the blog
  // index too); sync-vlogs.js now writes proper ISO-with-Z, so it's legacy data.
  const byDate = <T extends { id: string; data: { pubDate: Date } }>(items: T[]) =>
    [...items].sort(
      (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id)
    );

  return {
    games: [...games].sort((a, b) => {
      if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
      return a.data.title.localeCompare(b.data.title);
    }),
    studios: [...studios].sort((a, b) => a.data.name.localeCompare(b.data.name)),
    people: [...people].sort((a, b) => a.data.name.localeCompare(b.data.name)),
    news: byDate(news),
    guides: byDate(guides),
    articles: byDate(posts.filter((p) => p.data.kind === 'article')),
    episodes: byDate(posts.filter((p) => Boolean(p.data.series))),
    series: [...series].sort((a, b) => a.data.name.localeCompare(b.data.name)),
    vlogs: byDate(posts.filter((p) => !p.data.series && p.data.kind !== 'article')),
    gameSlugs: new Set(games.map((g) => g.id)),
  };
}
