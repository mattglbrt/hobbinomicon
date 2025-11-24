import type { CollectionEntry } from 'astro:content';

export function filterDrafts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return posts.filter(post => !post.data.draft);
}
