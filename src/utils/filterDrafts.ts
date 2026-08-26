import type { CollectionEntry } from 'astro:content';

export function filterDrafts(posts: CollectionEntry<'vlog'>[]): CollectionEntry<'vlog'>[] {
  return posts.filter(post => !post.data.draft);
}
