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
import { guideUrlWith, vlogUrl } from './content';

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

/** One piece of Hobbinomicon coverage about a game: a video, a guide or a
 *  news post. "Recently covered" on the homepage and the directory's default
 *  sort both come from these (Matt, 10-02: guides and news count, not only
 *  videos). */
export interface Coverage {
  kind: 'video' | 'guide' | 'news';
  title: string;
  date: Date;
  href: string;
}

export const COVERAGE_LABEL: Record<Coverage['kind'], string> = {
  video: 'New video',
  guide: 'New guide',
  news: 'News',
};

export interface DirectoryGame {
  game: Game;
  facets: Record<string, string[]>;
  /** Newest coverage first. Empty for a game nothing has been made about. */
  coverage: Coverage[];
  /** Directory sort key: the newest of the page itself (added or updated)
   *  and its coverage, so a game just added to the directory counts too. */
  coveredAt: Date;
  cost?: number;
}

const newest = (dates: (Date | undefined)[]) =>
  new Date(Math.max(...dates.filter((d): d is Date => !!d).map((d) => d.getTime())));

let cache: DirectoryGame[] | null = null;

/** Every live game with its facets and coverage, newest first. Cached per build. */
export async function getDirectory(): Promise<DirectoryGame[]> {
  if (cache) return cache;
  const [games, vlogs, guides, news] = await Promise.all([
    getCollection('games', ({ data }) => !data.draft),
    getCollection('vlog', ({ data }) => !data.draft),
    getCollection('guides', ({ data }) => !data.draft),
    getCollection('news', ({ data }) => !data.draft),
  ]);
  const slugs = new Set(games.map((g) => g.id));

  const byGame = new Map<string, Coverage[]>();
  const add = (id: string | undefined, c: Coverage) => {
    if (!id || !slugs.has(id)) return;
    if (!byGame.has(id)) byGame.set(id, []);
    byGame.get(id)!.push(c);
  };
  for (const v of vlogs) {
    for (const ref of v.data.games) add(ref.id, { kind: 'video', title: v.data.title, date: v.data.pubDate, href: vlogUrl(v) });
  }
  for (const g of guides) {
    // A guide belongs to a game by `game`, or by living in the game's folder
    // (guides/frostgrave/...), which is what guideUrlWith() routes on.
    const id = g.data.game?.id ?? (slugs.has(g.id.split('/')[0]) && g.id.includes('/') ? g.id.split('/')[0] : undefined);
    add(id, { kind: 'guide', title: g.data.title, date: g.data.pubDate, href: guideUrlWith(g, slugs) });
  }
  for (const n of news) {
    add(n.data.relatedGame?.id, { kind: 'news', title: n.data.title, date: n.data.pubDate, href: `/news/${n.id}/` });
  }

  cache = games
    .map((game) => {
      const coverage = (byGame.get(game.id) ?? []).sort((a, b) => b.date.getTime() - a.date.getTime());
      return {
        game,
        facets: gameFacets(game, {
          videos: coverage.filter((c) => c.kind === 'video').length,
          guides: coverage.filter((c) => c.kind === 'guide').length,
        }),
        coverage,
        coveredAt: newest([game.data.pubDate, game.data.updatedDate, coverage[0]?.date]),
        cost: startCost(game),
      };
    })
    .sort((a, b) => b.coveredAt.getTime() - a.coveredAt.getTime() || a.game.data.title.localeCompare(b.game.data.title));
  return cache;
}

/**
 * Homepage "Recently covered": one card per game, by its newest video, guide
 * or news post. Everything from the last `days`; if that's fewer than `min`,
 * topped up with the next most recent regardless of age, so a quiet month
 * never empties the section.
 */
export async function getRecentlyCovered(limit = 8, days = 30, min = 6) {
  const covered = (await getDirectory())
    .filter((e) => e.coverage.length)
    .sort((a, b) => b.coverage[0].date.getTime() - a.coverage[0].date.getTime());
  const cutoff = Date.now() - days * 86_400_000;
  const recent = covered.filter((e) => e.coverage[0].date.getTime() >= cutoff);
  return (recent.length >= min ? recent : covered).slice(0, limit);
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
