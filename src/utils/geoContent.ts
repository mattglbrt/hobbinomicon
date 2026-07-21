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
export type Post = CollectionEntry<'blog'>;

export const gameUrl = (g: Game) => canonical(`games/${g.id}`);
export const studioUrl = (s: Studio) => canonical(`studios/${s.id}`);
export const personUrl = (p: Person) => canonical(`people/${p.id}`);
export const newsUrl = (n: News) => canonical(`news/${n.id}`);
export const postUrl = (p: Post) => canonical(`blog/${p.id}`);

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
      youtube: d.youtubeId ? `https://www.youtube.com/watch?v=${d.youtubeId}` : undefined,
    },
    body: post.body ?? '',
  };
}

/**
 * Everything the GEO outputs index, already filtered for drafts and sorted.
 * Blog posts are split by their folder prefix: `vlogs/` is the daily vlog
 * archive, `resources/` and `articles/` are the written long-form.
 */
export async function getGeoContent() {
  const [games, studios, people, news, posts] = await Promise.all([
    getCollection('games', ({ data }) => !data.draft),
    getCollection('studios', ({ data }) => !data.draft),
    getCollection('people', ({ data }) => !data.draft),
    getCollection('news', ({ data }) => !data.draft),
    getCollection('blog', ({ data }) => !data.draft),
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
    resources: byDate(posts.filter((p) => p.id.startsWith('resources/'))),
    articles: byDate(posts.filter((p) => p.id.startsWith('articles/'))),
    vlogs: byDate(posts.filter((p) => p.id.startsWith('vlogs/'))),
  };
}
