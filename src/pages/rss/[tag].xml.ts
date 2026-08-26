import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { groupTaggedItems } from '../../utils/content';
import { getHeroImageUrl } from '../../utils/getHeroImage';
import { getTagDisplay } from '../../utils/tags';

export async function getStaticPaths() {
  const tagsMap = await groupTaggedItems();
  return Array.from(tagsMap.keys()).map((tag) => ({ params: { tag } }));
}

export async function GET(context: APIContext) {
  const { tag } = context.params;
  const tagPosts = ((await groupTaggedItems()).get(tag!) ?? []).slice(0, 50);

  const tagDisplay = getTagDisplay(tag!);
  const siteUrl = context.site!.toString().replace(/\/$/, '');

  return rss({
    title: `${tagDisplay} | The Hobbinomicon`,
    description: `Posts tagged "${tagDisplay}" on The Hobbinomicon`,
    site: context.site!,
    items: tagPosts.map((post) => {
      const imageUrl = getHeroImageUrl(post.heroImage, post.youtubeId);
      const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;

      return {
        title: post.title,
        pubDate: post.pubDate,
        description: post.description,
        link: post.href,
        categories: [post.kind, ...(post.tags || [])].filter(Boolean),
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
