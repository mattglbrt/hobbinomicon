import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts } from '../utils/collections';
import { getHeroImageUrl } from '../utils/getHeroImage';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('blog');
  const posts = getPublishedPosts(allPosts).slice(0, 50);
  const siteUrl = context.site!.toString().replace(/\/$/, '');

  return rss({
    title: 'The Hobbinomicon',
    description: 'Miniature painting, terrain building, tabletop RPGs, and hobby content',
    site: context.site!,
    items: posts.map((post) => {
      const imageUrl = getHeroImageUrl(post.data.heroImage, post.data.youtubeId);
      const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.id}/`,
        categories: [
          post.data.category,
          ...(post.data.tags || []),
        ].filter(Boolean),
        enclosure: {
          url: fullImageUrl,
          length: 0,
          type: 'image/jpeg',
        },
      };
    }),
    customData: '<language>en-us</language>',
  });
}
