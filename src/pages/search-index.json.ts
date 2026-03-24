import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts, groupByTags } from '../utils/collections';
import { getTagDisplay } from '../utils/tags';

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('blog');
  const publishedPosts = getPublishedPosts(allPosts);

  const categories = [...new Set(publishedPosts.map(post => post.data.category))].sort();

  const tagsMap = groupByTags(publishedPosts);
  const topTags = Array.from(tagsMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8)
    .map(([tag]) => ({ tag, display: getTagDisplay(tag) }));

  const searchIndex = publishedPosts.map(post => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    searchText: [
      post.data.title,
      post.data.description,
      post.data.category,
      ...post.data.tags
    ].join(' ').toLowerCase()
  }));

  return new Response(JSON.stringify({ searchIndex, categories, topTags }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
