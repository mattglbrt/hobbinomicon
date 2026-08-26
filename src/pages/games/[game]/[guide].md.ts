import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from '../../../utils/markdownExport';
import { guideDoc, type Guide } from '../../../utils/geoContent';

/** Markdown rendering of a game-nested guide: /games/mage-knight/meta.md */
export async function getStaticPaths() {
  const games = new Set((await getCollection('games')).map((g) => g.id));
  const guides = await getCollection('guides', ({ data }) => !data.draft);

  return guides.flatMap((guide) => {
    const [first, ...rest] = guide.id.split('/');
    if (!rest.length || !games.has(first)) return [];
    return [
      {
        params: { game: first, guide: rest.join('/') },
        props: { guide, games: [...games] },
      },
    ];
  });
}

export const GET: APIRoute = ({ props }) => {
  const { guide, games } = props as { guide: Guide; games: string[] };
  return textResponse(renderMarkdownDoc(guideDoc(guide, new Set(games))));
};
