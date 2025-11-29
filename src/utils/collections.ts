import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;
type Project = CollectionEntry<'projects'>;

/**
 * Filter out draft posts
 */
export function filterDrafts<T extends { data: { draft?: boolean } }>(items: T[]): T[] {
  return items.filter(item => !item.data.draft);
}

/**
 * Sort posts by publication date (newest first by default)
 */
export function sortByDate<T extends { data: { pubDate: Date } }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const diff = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    return order === 'desc' ? diff : -diff;
  });
}

/**
 * Group posts by a specific field (category, tag, etc.)
 */
export function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string | string[]
): Map<string, T[]> {
  const map = new Map<string, T[]>();

  items.forEach(item => {
    const keys = keyFn(item);
    const keyArray = Array.isArray(keys) ? keys : [keys];

    keyArray.forEach(key => {
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(item);
    });
  });

  return map;
}

/**
 * Group posts by category
 */
export function groupByCategory(posts: BlogPost[]): Map<string, BlogPost[]> {
  return groupBy(posts, post => post.data.category);
}

/**
 * Group posts by tags
 */
export function groupByTags(posts: BlogPost[]): Map<string, BlogPost[]> {
  return groupBy(posts, post => post.data.tags);
}

/**
 * Get published posts sorted by date (combines filterDrafts + sortByDate)
 */
export function getPublishedPosts(posts: BlogPost[], order: 'asc' | 'desc' = 'desc'): BlogPost[] {
  return sortByDate(filterDrafts(posts), order);
}

/**
 * Get posts for a specific project
 */
export function getProjectPosts(
  posts: BlogPost[],
  projectSlug: string,
  order: 'asc' | 'desc' = 'desc'
): BlogPost[] {
  const filtered = posts.filter(post => post.data.project === projectSlug);
  return sortByDate(filterDrafts(filtered), order);
}

/**
 * Get unique categories with post counts, sorted by count
 */
export function getCategoriesWithCounts(posts: BlogPost[]): { name: string; count: number; posts: BlogPost[] }[] {
  const grouped = groupByCategory(posts);
  return Array.from(grouped.entries())
    .map(([name, categoryPosts]) => ({
      name,
      count: categoryPosts.length,
      posts: sortByDate(categoryPosts),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get unique tags with post counts, sorted by count
 */
export function getTagsWithCounts(posts: BlogPost[]): { name: string; count: number; posts: BlogPost[] }[] {
  const grouped = groupByTags(posts);
  return Array.from(grouped.entries())
    .map(([name, tagPosts]) => ({
      name,
      count: tagPosts.length,
      posts: sortByDate(tagPosts),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get the most recent post from a list
 */
export function getLatestPost(posts: BlogPost[]): BlogPost | undefined {
  return sortByDate(posts, 'desc')[0];
}

/**
 * Get unique category names sorted alphabetically
 */
export function getUniqueCategories(posts: BlogPost[]): string[] {
  return [...new Set(posts.map(post => post.data.category))].sort();
}

/**
 * Get unique tag names sorted alphabetically
 */
export function getUniqueTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>();
  posts.forEach(post => post.data.tags.forEach(tag => tags.add(tag)));
  return [...tags].sort();
}
