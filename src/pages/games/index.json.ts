import type { APIRoute } from 'astro';
import { getDirectory } from '../../utils/facets';

/**
 * /games/index.json — the directory as data: one record per live game with
 * its facet values and sort keys. Built from the same getDirectory() the
 * pages use, so it can't disagree with them. For search and anything outside
 * the site that wants the list; the directory page itself filters the HTML it
 * already has and doesn't fetch this. Budget: under 100 KB.
 */
export const GET: APIRoute = async () => {
  const games = (await getDirectory()).map(({ game, facets, coveredAt, coverage, cost }) => ({
    slug: game.id,
    title: game.data.title,
    url: `/games/${game.id}/`,
    description: game.data.description,
    image: game.data.thumbnailImage || game.data.heroImage || null,
    facets: Object.fromEntries(Object.entries(facets).filter(([, v]) => v.length)),
    costUsd: cost ?? null,
    coveredAt: coveredAt.toISOString().slice(0, 10),
    latestCoverage: coverage[0]
      ? { kind: coverage[0].kind, title: coverage[0].title, date: coverage[0].date.toISOString().slice(0, 10), url: coverage[0].href }
      : null,
  }));
  return new Response(JSON.stringify({ count: games.length, games }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
