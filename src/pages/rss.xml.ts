import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts } from '../utils/collections';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('blog');
  const posts = getPublishedPosts(allPosts).slice(0, 50);

  return rss({
    title: 'The Hobbinomicon',
    description: 'Miniature painting, terrain building, tabletop RPGs, and hobby content',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      categories: [
        post.data.category,
        ...(post.data.tags || []),
      ].filter(Boolean),
    })),
    customData: '<language>en-us</language>',
  });
}
