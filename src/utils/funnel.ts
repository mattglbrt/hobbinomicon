import type { CollectionEntry } from 'astro:content';

type Game = CollectionEntry<'games'>;

export interface FunnelSuggestion {
  game: Game;
  /** Short "why" line, e.g. "Skirmish · Mini-agnostic · Low model count" */
  reason: string;
  /** True when the game came from `relatedGames`; false when scored. */
  editorial: boolean;
}

/**
 * The "if you like X, try Y" funnel.
 *
 * Editorial picks (`relatedGames` in frontmatter) always come first and are
 * never filtered — if Matt says try it, we say try it. Remaining slots are
 * filled by scoring the rest of the directory.
 *
 * Scoring leans on the structured fields rather than tags alone. Game tags are
 * ad-hoc (`grimdark`, `bounty-hunters`, `mage-knight`) while `format`/`solo`/
 * `miniatureAgnostic` are filled in consistently, and on a ten-game corpus a
 * shared `fantasy` tag means almost nothing — five of ten games carry it.
 */

const FORMAT_LABELS: Record<string, string> = {
  ttrpg: 'TTRPG',
  skirmish: 'Skirmish',
  'large-scale-army': 'Large-scale army',
  'mass-battle': 'Mass battle',
  boardgame: 'Board game',
  narrative: 'Narrative',
};

const WEIGHTS = {
  format: 4,
  solo: 3,
  miniAgnostic: 3,
  tier: 1,
  cost: 1,
  /** Multiplier on a shared tag's inverse-document-frequency score. */
  tagScale: 2.5,
  /** Ceiling on any single tag, so a one-off tag can't outrank format. */
  tagCap: 3,
};

/**
 * Below this, a game has nothing meaningful in common and is dropped rather
 * than padded in. A bare format match (4) clears it; coincidence does not.
 * Showing nothing beats shipping a non-sequitur.
 */
const MIN_SCORE = 3;

/**
 * First dollar figure in a free-text cost string:
 *   "$0+" → 0 · "~$120 starter + rules free" → 120 · "$60–$100" → 60
 * Returns null when there is no number to find (e.g. "$5 PDF" → 5, "free" → null).
 */
function parseCost(cost?: string): number | null {
  if (!cost) return null;
  const match = cost.match(/\$\s*([\d,]+)/);
  if (!match) return null;
  const value = Number(match[1].replace(/,/g, ''));
  return Number.isFinite(value) ? value : null;
}

/** Rough price bands, so "both cheap" and "both expensive" read as a signal. */
function costBand(cost?: string): number | null {
  const value = parseCost(cost);
  if (value === null) return null;
  if (value <= 20) return 0;
  if (value <= 80) return 1;
  if (value <= 200) return 2;
  return 3;
}

/** Turn a slug tag into something readable: `low-model-count` → `Low model count`. */
function prettyTag(tag: string): string {
  const spaced = tag.replace(/-/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Inverse document frequency per tag, capped. A tag on one game out of ten is
 * a much stronger "you'll like this" than one on half the directory.
 */
function buildTagWeights(games: Game[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const game of games) {
    for (const tag of game.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  const total = games.length;
  const weights = new Map<string, number>();
  for (const [tag, count] of counts) {
    const idf = WEIGHTS.tagScale * Math.log(total / count);
    weights.set(tag, Math.min(WEIGHTS.tagCap, idf));
  }
  return weights;
}

interface Scored {
  game: Game;
  score: number;
  reason: string;
}

function score(
  source: Game,
  candidate: Game,
  tagWeights: Map<string, number>
): Scored {
  let total = 0;
  // Reason parts in the order they should read, most distinctive first.
  const shared: { label: string; rank: number }[] = [];

  if (source.data.format === candidate.data.format) {
    total += WEIGHTS.format;
    shared.push({
      label: FORMAT_LABELS[candidate.data.format] ?? candidate.data.format,
      rank: 2,
    });
  }

  if (source.data.solo && candidate.data.solo) {
    total += WEIGHTS.solo;
    shared.push({ label: 'Solo-friendly', rank: 1 });
  }

  if (source.data.miniatureAgnostic && candidate.data.miniatureAgnostic) {
    total += WEIGHTS.miniAgnostic;
    shared.push({ label: 'Mini-agnostic', rank: 1 });
  }

  const sharedTags = candidate.data.tags.filter((tag) =>
    source.data.tags.includes(tag)
  );
  for (const tag of sharedTags) {
    const weight = tagWeights.get(tag) ?? 0;
    total += weight;
    // Rank by weight so a rare, telling tag beats a generic one in the reason.
    shared.push({ label: prettyTag(tag), rank: 3 - weight / WEIGHTS.tagCap });
  }

  if (source.data.tier === candidate.data.tier) {
    total += WEIGHTS.tier;
  }

  const sourceBand = costBand(source.data.costToStart);
  const candidateBand = costBand(candidate.data.costToStart);
  if (sourceBand !== null && candidateBand !== null && sourceBand === candidateBand) {
    total += WEIGHTS.cost;
    shared.push({ label: sourceBand === 0 ? 'Cheap to start' : 'Similar cost', rank: 4 });
  }

  const reason = shared
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3)
    .map((part) => part.label)
    .join(' · ');

  return { game: candidate, score: total, reason };
}

/**
 * Build the funnel list for a game page.
 *
 * @param source     the game being viewed
 * @param allGames   the full games collection (drafts included; filtered here)
 * @param related    `relatedGames` already resolved to entries
 * @param limit      how many suggestions to return
 */
export function getFunnelSuggestions(
  source: Game,
  allGames: Game[],
  related: Game[],
  limit = 3
): FunnelSuggestion[] {
  const published = allGames.filter((g) => !g.data.draft);

  const picks: FunnelSuggestion[] = [];
  const used = new Set<string>([source.id]);

  // Editorial picks first — no scoring, no out-of-print filter, no threshold.
  const tagWeights = buildTagWeights(published);
  for (const game of related) {
    if (game.data.draft || used.has(game.id)) continue;
    used.add(game.id);
    picks.push({
      game,
      reason: score(source, game, tagWeights).reason,
      editorial: true,
    });
  }

  if (picks.length >= limit) return picks.slice(0, limit);

  // Fill the rest by score. Out-of-print games are skipped here: pointing a
  // reader at something they cannot buy is a dead end, and Matt can still list
  // one by hand above if the recommendation is worth making anyway.
  const scored = published
    .filter((g) => !used.has(g.id) && g.data.status !== 'oop')
    .map((g) => score(source, g, tagWeights))
    .filter((s) => s.score >= MIN_SCORE)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Stable, meaningful tiebreak: pinned games, then alphabetical.
      if (a.game.data.pinned !== b.game.data.pinned) return a.game.data.pinned ? -1 : 1;
      return a.game.data.title.localeCompare(b.game.data.title);
    });

  for (const item of scored) {
    if (picks.length >= limit) break;
    picks.push({ game: item.game, reason: item.reason, editorial: false });
  }

  return picks;
}
