import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderMarkdownDoc, textResponse } from '../../utils/markdownExport';
import { gameDoc, type Game } from '../../utils/geoContent';

/** Markdown rendering of a directory game page: /games/kal-arath.md */
export async function getStaticPaths() {
  const games = await getCollection('games', ({ data }) => !data.draft);
  return games.map((game) => ({ params: { slug: game.id }, props: { game } }));
}

export const GET: APIRoute = async ({ props }) =>
  textResponse(renderMarkdownDoc(await gameDoc((props as { game: Game }).game)));
