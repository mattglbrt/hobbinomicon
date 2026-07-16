import { getCollection, type CollectionEntry } from 'astro:content';
import { getPublishedPosts } from './collections';
import collectionsData from '../data/video-collections.json';

export type VideoCollectionMeta = {
  slug: string;
  title: string;
  description: string;
  series: boolean;
  playlistUrl: string | null;
  videoIds: string[];
};

type Post = CollectionEntry<'blog'>;

const DATA = collectionsData as VideoCollectionMeta[];

async function youtubePostMap(): Promise<Map<string, Post>> {
  const posts = getPublishedPosts(await getCollection('blog'));
  const map = new Map<string, Post>();
  for (const p of posts) if (p.data.youtubeId) map.set(p.data.youtubeId, p);
  return map;
}

/**
 * Each collection resolved to its on-site posts, in the curated order from
 * video-collections.json (best-first, or chronological for series). Videos
 * without a matching post are dropped (they still live on the YouTube playlist).
 */
export async function getVideoCollections() {
  const map = await youtubePostMap();
  return DATA.map((c) => ({
    ...c,
    posts: c.videoIds
      .map((id) => map.get(id))
      .filter((p): p is Post => Boolean(p)),
  })).filter((c) => c.posts.length > 0);
}

export async function getVideoCollection(slug: string) {
  return (await getVideoCollections()).find((c) => c.slug === slug) || null;
}

export function videoCollectionSlugs(): string[] {
  return DATA.map((c) => c.slug);
}

/** youtubeId → the collection it belongs to (first wins), for post back-links. */
export function collectionByVideoId(): Map<string, { slug: string; title: string }> {
  const map = new Map<string, { slug: string; title: string }>();
  for (const c of DATA) {
    for (const id of c.videoIds) {
      if (!map.has(id)) map.set(id, { slug: c.slug, title: c.title });
    }
  }
  return map;
}

/**
 * The demoted archive: video posts whose youtubeId isn't in any collection
 * (date-titled dailies, one-off fragments), newest first.
 */
export async function getArchivePosts(): Promise<Post[]> {
  const inCollection = new Set<string>();
  for (const c of DATA) for (const id of c.videoIds) inCollection.add(id);
  const posts = getPublishedPosts(await getCollection('blog'));
  return posts
    .filter((p) => p.data.youtubeId && !inCollection.has(p.data.youtubeId))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
