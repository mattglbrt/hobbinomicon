import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from '../../utils/markdownExport';
import { guideDoc, type Guide } from '../../utils/geoContent';

/**
 * Markdown rendering of a guide: /guides/how-to-paint-x.md
 *
 * The GEO twin of the guide page. Same exclusion as the HTML route — guides
 * nested under a game render under /games/ and have their own .md there.
 */
export async function getStaticPaths() {
  const games = new Set((await getCollection('games')).map((g) => g.id));
  const guides = await getCollection('guides', ({ data }) => !data.draft);
  return guides
    .filter((g) => {
      const [first, ...rest] = g.id.split('/');
      return !(rest.length && games.has(first));
    })
    .map((guide) => ({ params: { slug: guide.id }, props: { guide, games: [...games] } }));
}

export const GET: APIRoute = ({ props }) => {
  const { guide, games } = props as { guide: Guide; games: string[] };
  return textResponse(renderMarkdownDoc(guideDoc(guide, new Set(games))));
};
