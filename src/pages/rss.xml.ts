import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getHeroImageUrl } from '../utils/getHeroImage';
import { getAllVlogEntries, getGuides, guideUrlWith, vlogUrl } from '../utils/content';

/**
 * The main feed carries guides, vlogs, articles and series episodes together,
 * newest first. One feed for the whole site: a subscriber asked for the site,
 * not for a collection.
 */
export async function GET(context: APIContext) {
  const gameSlugs = new Set((await getCollection('games')).map((g) => g.id));
  const [vlogEntries, guides] = await Promise.all([getAllVlogEntries(), getGuides()]);

  const items = [
    ...guides.map((g) => ({
      title: g.data.title,
      pubDate: g.data.pubDate,
      description: g.data.description,
      link: guideUrlWith(g, gameSlugs),
      categories: ['Guide', g.data.topic, ...(g.data.tags ?? [])].filter(Boolean),
      image: getHeroImageUrl(g.data.heroImage, g.data.youtubeId),
    })),
    ...vlogEntries.map((p) => ({
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.description,
      link: vlogUrl(p),
      categories: [
        p.data.series ? 'Series' : p.data.kind === 'article' ? 'Article' : 'Vlog',
        ...(p.data.tags ?? []),
      ].filter(Boolean),
      image: getHeroImageUrl(p.data.heroImage, p.data.youtubeId),
    })),
  ]
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
    .slice(0, 50);

  const siteUrl = context.site!.toString().replace(/\/$/, '');

  return rss({
    title: 'The Hobbinomicon',
    description:
      'Indie wargames worth playing and how to paint them. Guides, directory news, and the daily hobby vlog.',
    site: context.site!,
    items: items.map(({ image, ...item }) => ({
      ...item,
      enclosure: {
        url: image.startsWith('http') ? image : `${siteUrl}${image}`,
        length: 0,
        type: 'image/jpeg',
      },
    })),
    customData: '<language>en-us</language>',
  });
}
