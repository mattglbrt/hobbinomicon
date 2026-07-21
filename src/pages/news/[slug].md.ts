import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from '../../utils/markdownExport';
import { newsDoc, type News } from '../../utils/geoContent';

/** Markdown rendering of a News item: /news/deathbringer-backerkit-live.md */
export async function getStaticPaths() {
  const items = await getCollection('news', ({ data }) => !data.draft);
  return items.map((item) => ({ params: { slug: item.id }, props: { item } }));
}

export const GET: APIRoute = ({ props }) =>
  textResponse(renderMarkdownDoc(newsDoc((props as { item: News }).item)));
