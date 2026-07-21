import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from '../../utils/markdownExport';
import { studioDoc, type Studio } from '../../utils/geoContent';

/** Markdown rendering of a directory studio page: /studios/castle-grief.md */
export async function getStaticPaths() {
  const studios = await getCollection('studios', ({ data }) => !data.draft);
  return studios.map((studio) => ({ params: { slug: studio.id }, props: { studio } }));
}

export const GET: APIRoute = ({ props }) =>
  textResponse(renderMarkdownDoc(studioDoc((props as { studio: Studio }).studio)));
