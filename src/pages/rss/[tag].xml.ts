import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts, groupByTags } from '../../utils/collections';
import { getHeroImageUrl } from '../../utils/getHeroImage';
import { getTagDisplay } from '../../utils/tags';

export async function getStaticPaths() {
  const allPosts = await getCollection('blog');
  const publishedPosts = getPublishedPosts(allPosts);
  const tagsMap = groupByTags(publishedPosts);

  return Array.from(tagsMap.keys()).map((tag) => ({
    params: { tag },
  }));
}

export async function GET(context: APIContext) {
  const { tag } = context.params;
  const allPosts = await getCollection('blog');
  const publishedPosts = getPublishedPosts(allPosts);

  const tagPosts = publishedPosts
    .filter((post) => post.data.tags?.includes(tag!))
    .slice(0, 50);

  const tagDisplay = getTagDisplay(tag!);
  const siteUrl = context.site!.toString().replace(/\/$/, '');

  return rss({
    title: `${tagDisplay} - The Hobbinomicon`,
    description: `Posts tagged "${tagDisplay}" on The Hobbinomicon`,
    site: context.site!,
    items: tagPosts.map((post) => {
      const imageUrl = getHeroImageUrl(post.data.heroImage, post.data.youtubeId);
      const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
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
