/**
 * Directory facets: the one place that turns game frontmatter into filter
 * values. The directory component, the facet landing pages, game-page facet
 * chips and /games/index.json all read from here, so a bucket boundary only
 * ever changes in one file.
 *
 * Some facets are stored (players, sessionMinutes, prices, minis, scale —
 * drafted 2026-10 by scripts/draft-game-facets.mjs). The rest are derived so
 * there's one source each: setting from tags, solo from `solo`, mini-agnostic
 * from `miniatureAgnostic`, staff pick from `pinned`, coverage from the vlog
 * and guide collections.
 *
 * A game with a field missing simply matches none of that facet's values.
 * That's deliberate: a guess would put it in the wrong result set.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

type Game = CollectionEntry<'games'>;

export interface FacetValue { value: string; label: string }
export interface Facet { key: string; label: string; values: FacetValue[] }

export const FACETS: Facet[] = [
  {
    key: 'type', label: 'Type', values: [
      { value: 'skirmish', label: 'Skirmish' },
      { value: 'army', label: 'Army' },
      { value: 'narrative', label: 'Narrative' },
      { value: 'boardgame', label: 'Board game' },
    ],
  },
  {
    key: 'players', label: 'Players', values: [
      { value: 'solo', label: 'Solo' },
      { value: '2', label: '2 players' },
      { value: '3plus', label: '3+ players' },
      { value: 'coop', label: 'Co-op' },
    ],
  },
  {
    key: 'minis', label: 'Minis', values: [
      { value: 'agnostic', label: 'Mini-agnostic' },
      { value: 'proxy-friendly', label: 'Proxy-friendly' },
      { value: 'own-line', label: 'Own line' },
      { value: 'print-and-play', label: 'Print / STL' },
    ],
  },
  {
    key: 'price', label: 'Price to start', values: [
      { value: 'free', label: 'Free rules' },
      { value: 'under-30', label: 'Under $30' },
      { value: '30-75', label: '$30 to $75' },
      { value: '75plus', label: '$75+' },
    ],
  },
  {
    key: 'length', label: 'Game length', values: [
      { value: 'under-60', label: 'Under an hour' },
      { value: '60-120', label: '1 to 2 hours' },
      { value: '120plus', label: '2 hours+' },
    ],
  },
  {
    key: 'setting', label: 'Setting', values: [
      { value: 'fantasy', label: 'Fantasy' },
      { value: 'grimdark', label: 'Grimdark' },
      { value: 'sci-fi', label: 'Sci-fi' },
      { value: 'horror', label: 'Horror' },
      { value: 'historical', label: 'Historical' },
      { value: 'modern', label: 'Modern' },
      { value: 'post-apoc', label: 'Post-apocalyptic' },
      { value: 'weird', label: 'Weird war' },
    ],
  },
  {
    key: 'scale', label: 'Scale', values: [
      { value: 'warband', label: 'Warband' },
      { value: 'platoon', label: 'Platoon' },
      { value: 'rank-and-flank', label: 'Rank and flank' },
      { value: 'mass-battle', label: 'Mass battle' },
    ],
  },
  {
    key: 'status', label: 'Status', values: [
      { value: 'active', label: 'In print' },
      { value: 'kickstarter', label: 'Crowdfunding' },
      { value: 'announced', label: 'Coming soon' },
      { value: 'oop', label: 'Out of print' },
    ],
  },
  {
    key: 'publisher', label: 'Publisher', values: [
      { value: 'indie', label: 'Indie' },
      { value: 'big', label: 'Big publisher' },
    ],
  },
  {
    key: 'coverage', label: 'On the Hobbinomicon', values: [
      { value: 'videos', label: 'Has videos' },
      { value: 'guides', label: 'Has guides' },
      { value: 'staff-pick', label: 'Staff pick' },
    ],
  },
];

export const facetLabel = (key: string, value: string) =>
  FACETS.find((f) => f.key === key)?.values.find((v) => v.value === value)?.label ?? value;

// Tags that mean a setting. Several tags can map to one setting.
const SETTING_TAGS: Record<string, string> = {
  fantasy: 'fantasy',
  grimdark: 'grimdark',
  'sci-fi': 'sci-fi', cyberpunk: 'sci-fi', 'dim-future': 'sci-fi',
  horror: 'horror',
  historical: 'historical', 'dark-ages': 'historical', wwii: 'historical',
  modern: 'modern',
  'post-apocalyptic': 'post-apoc',
  'weird-war': 'weird', dieselpunk: 'weird',
};

/** What it costs to get a game on the table. For a mini-agnostic game that's
 *  the rules; otherwise the cheapest box if there is one. */
export function startCost(g: Game): number | undefined {
  const { rulesPriceUsd, starterPriceUsd, miniatureAgnostic } = g.data;
  if (miniatureAgnostic) return rulesPriceUsd;
  return starterPriceUsd ?? rulesPriceUsd;
}

export function gameFacets(g: Game, coverage: { videos: number; guides: number }): Record<string, string[]> {
  const d = g.data;
  const out: Record<string, string[]> = {};

  out.type = d.format === 'ttrpg' ? [] : [d.format];

  const players: string[] = [];
  if (d.solo || d.players?.min === 1) players.push('solo');
  if (d.players) {
    const { min, max } = d.players;
    if (min <= 2 && (max === undefined || max >= 2)) players.push('2');
    if (max === undefined || max >= 3) players.push('3plus');
    if (d.players.coop) players.push('coop');
  }
  out.players = players;

  out.minis = d.miniatureAgnostic ? ['agnostic'] : d.minis ? [d.minis] : [];

  const price: string[] = [];
  if (d.rulesPriceUsd === 0) price.push('free');
  const cost = startCost(g);
  if (cost !== undefined) price.push(cost < 30 ? 'under-30' : cost <= 75 ? '30-75' : '75plus');
  out.price = price;

  const length: string[] = [];
  if (d.sessionMinutes) {
    const { min, max } = d.sessionMinutes;
    if (min < 60) length.push('under-60');
    if (min <= 120 && max >= 60) length.push('60-120');
    if (max > 120) length.push('120plus');
  }
  out.length = length;

  out.setting = [...new Set(d.tags.map((t) => SETTING_TAGS[t]).filter(Boolean))];
  out.scale = d.scale ? [d.scale] : [];
  out.status = [d.status];
  out.publisher = [d.tier];

  const cov: string[] = [];
  if (coverage.videos) cov.push('videos');
  if (coverage.guides) cov.push('guides');
  if (d.pinned) cov.push('staff-pick');
  out.coverage = cov;

  return out;
}

export interface DirectoryGame {
  game: Game;
  facets: Record<string, string[]>;
  /** Newest of: the game page itself, its last update, its newest video. */
  coveredAt: Date;
  latestVideo?: { title: string; date: Date; href: string };
  cost?: number;
}

const newest = (dates: (Date | undefined)[]) =>
  new Date(Math.max(...dates.filter((d): d is Date => !!d).map((d) => d.getTime())));

let cache: DirectoryGame[] | null = null;

/** Every live game with its facets, newest coverage first. Cached per build. */
export async function getDirectory(): Promise<DirectoryGame[]> {
  if (cache) return cache;
  const [games, vlogs, guides] = await Promise.all([
    getCollection('games', ({ data }) => !data.draft),
    getCollection('vlog', ({ data }) => !data.draft),
    getCollection('guides', ({ data }) => !data.draft),
  ]);

  const videosByGame = new Map<string, CollectionEntry<'vlog'>[]>();
  for (const v of vlogs) {
    for (const ref of v.data.games) {
      if (!videosByGame.has(ref.id)) videosByGame.set(ref.id, []);
      videosByGame.get(ref.id)!.push(v);
    }
  }
  const guidesByGame = new Map<string, number>();
  for (const g of guides) {
    if (g.data.game) guidesByGame.set(g.data.game.id, (guidesByGame.get(g.data.game.id) ?? 0) + 1);
  }

  cache = games
    .map((game) => {
      const videos = (videosByGame.get(game.id) ?? []).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
      const v = videos[0];
      const latestVideo = v
        ? {
            title: v.data.title,
            date: v.data.pubDate,
            href: v.data.series ? `/series/${v.data.series.id}/${v.id}/` : v.data.kind === 'article' ? `/articles/${v.id}/` : `/vlog/${v.id}/`,
          }
        : undefined;
      return {
        game,
        facets: gameFacets(game, { videos: videos.length, guides: guidesByGame.get(game.id) ?? 0 }),
        coveredAt: newest([game.data.pubDate, game.data.updatedDate, v?.data.pubDate]),
        latestVideo,
        cost: startCost(game),
      };
    })
    .sort((a, b) => b.coveredAt.getTime() - a.coveredAt.getTime() || a.game.data.title.localeCompare(b.game.data.title));
  return cache;
}

/**
 * Settings with their own landing page at /games/setting/{value}/. Only the
 * ones with enough games to be worth a page (2026-10: post-apoc and weird have
 * two each); the rest are still filters. Add one here and it gets a page.
 */
export const SETTING_PAGES = ['fantasy', 'sci-fi', 'horror', 'grimdark', 'historical', 'modern'];

/** Facet values that have an indexable page of their own. */
const LANDING: Record<string, Record<string, string>> = {
  type: { skirmish: '/games/skirmish/', army: '/games/army/', narrative: '/games/narrative/' },
  players: { solo: '/games/solo/' },
  price: { free: '/games/free-rules/' },
  minis: { agnostic: '/games/mini-agnostic/' },
  status: { oop: '/games/graveyard/' },
  setting: Object.fromEntries(SETTING_PAGES.map((s) => [s, `/games/setting/${s}/`])),
};

/** Where a facet value links: its landing page if it has one (so internal
 *  links point at indexable URLs), else the filtered directory. */
export const facetHref = (key: string, value: string) =>
  LANDING[key]?.[value] ?? `/games/?${key}=${encodeURIComponent(value)}`;
