#!/usr/bin/env node
/**
 * Rebuild GAME-REVIEW.md, Matt's one checklist for every game in the directory
 * (local only, gitignored).
 *
 * Under each game: the directory specs as they stand in the frontmatter (what
 * the cards and filters show), anything that's missing, and the guesses
 * scripts/draft-game-facets.mjs flagged in roadmap/rebuild/phase1-facet-review.md.
 * One pass per game covers both the page read and the spec check.
 *
 * Ticks survive a rebuild (matched on the .mdx filename), so run it again
 * whenever games are added or specs are fixed:
 *
 *   node scripts/game-review.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const GAMES = 'src/content/games';
const OUT = 'GAME-REVIEW.md';
const FLAGS = 'roadmap/rebuild/phase1-facet-review.md';
const SITE = 'https://hobbinomicon.com';

// Ticks already in the checklist, by filename.
const ticked = new Set();
if (fs.existsSync(OUT)) {
  for (const m of fs.readFileSync(OUT, 'utf8').matchAll(/^- \[[xX]\] .*?`([^`]+\.mdx?)`/gm)) ticked.add(m[1]);
}

// Flagged guesses from the Phase 1 report. "No playerCount"-style flags are
// dropped: the Missing line below is computed live, so it stays right after a fix.
const flags = new Map();
if (fs.existsSync(FLAGS)) {
  const text = fs.readFileSync(FLAGS, 'utf8');
  const section = text.split('## Needs a look')[1]?.split('\n## ')[0] ?? '';
  for (const line of section.split('\n')) {
    const cells = line.split(' | ');
    if (cells.length < 4 || !line.startsWith('| ') || line.startsWith('| Game') || line.startsWith('|---')) continue;
    const slug = cells[0].replace(/^\|\s*/, '').trim();
    const why = cells[3].replace(/\s*\|\s*$/, '').split('<br>').map((s) => s.trim())
      .filter((s) => s && !/no (playerCount|gameLength|costToStart)/.test(s));
    if (why.length) flags.set(slug, why);
  }
}

const usd = (n) => (n === 0 ? 'free' : `$${n}`);
function specs(d) {
  const out = [];
  if (d.players) {
    const { min, max, coop } = d.players;
    out.push(`${max === undefined ? `${min}+` : min === max ? min : `${min}–${max}`} players${coop ? ', co-op' : ''}${d.solo ? ', solo' : ''}`);
  }
  if (d.sessionMinutes) out.push(d.sessionMinutes.min === d.sessionMinutes.max ? `${d.sessionMinutes.min} min` : `${d.sessionMinutes.min}–${d.sessionMinutes.max} min`);
  if (d.rulesPriceUsd !== undefined) out.push(`rules ${usd(d.rulesPriceUsd)}`);
  if (d.starterPriceUsd !== undefined) out.push(`starter ${usd(d.starterPriceUsd)}`);
  out.push(d.miniatureAgnostic ? 'mini-agnostic' : d.minis ? d.minis.replace(/-/g, ' ') : 'minis: not set');
  if (d.scale) out.push(d.scale.replace(/-/g, ' '));
  return out.join(' · ');
}
function missing(d) {
  const m = [];
  if (!d.players) m.push('players');
  if (!d.sessionMinutes) m.push('length');
  if (d.rulesPriceUsd === undefined) m.push('price');
  if (!d.miniatureAgnostic && !d.minis && d.format !== 'ttrpg') m.push('minis');
  if (!d.scale && d.format !== 'ttrpg') m.push('scale');
  return m;
}

const games = fs.readdirSync(GAMES).filter((f) => /\.mdx?$/.test(f)).map((file) => {
  const fm = parseYaml(fs.readFileSync(path.join(GAMES, file), 'utf8').split(/^---(?=\r?$)/m)[1]);
  return { file, slug: file.replace(/\.mdx?$/, ''), d: fm, date: new Date(fm.pubDate).toISOString().slice(0, 10) };
});

function entry({ file, slug, d }, live) {
  const tags = [d.status === 'oop' ? 'oop' : null, d.notPlayed ? 'take coming soon' : null].filter(Boolean);
  const head = live ? `[${d.title}](${SITE}/games/${slug}/)` : d.title;
  const lines = [`- [${ticked.has(file) ? 'x' : ' '}] ${head} · \`${file}\`${tags.length ? ` · ${tags.join(' · ')}` : ''}`];
  lines.push(`  - Specs: ${specs(d)}`);
  const miss = missing(d);
  if (miss.length) lines.push(`  - Missing: ${miss.join(', ')}`);
  if (flags.has(slug)) lines.push(`  - Check: ${flags.get(slug).join(' · ')}`);
  return lines.join('\n');
}

const live = games.filter((g) => !g.d.draft).sort((a, b) => b.date.localeCompare(a.date) || a.d.title.localeCompare(b.d.title));
const drafts = games.filter((g) => g.d.draft).sort((a, b) => a.d.title.localeCompare(b.d.title));
const byDate = new Map();
for (const g of live) byDate.set(g.date, [...(byDate.get(g.date) ?? []), g]);

const done = live.filter((g) => ticked.has(g.file)).length;
const md = [
  '# Game page review',
  '',
  'Local only (gitignored). Rebuilt by `node scripts/game-review.mjs`, which keeps your ticks.',
  '',
  `**${live.length} live games, ${done} ticked.** Tick a game once you've read the live page **and** the Specs line is right.`,
  'Specs are what the directory cards and filters show. Fix one by editing that field in the game\'s `.mdx`',
  '(`players`, `sessionMinutes`, `rulesPriceUsd`, `starterPriceUsd`, `minis`, `scale`). **Check** lines are the',
  'script\'s guesses that most need your eye; **Missing** fields mean the game drops out of that filter.',
  '',
];
for (const [date, list] of byDate) {
  md.push(`## ${date} (${list.length})`, '', ...list.map((g) => entry(g, true)), '');
}
md.push(`## Drafts, not on the site (${drafts.length})`, '', ...drafts.map((g) => entry(g, false)), '');
fs.writeFileSync(OUT, md.join('\n'));

const flagged = live.filter((g) => flags.has(g.slug)).length;
const gaps = live.filter((g) => missing(g.d).length).length;
console.log(`${OUT}: ${live.length} live (${done} ticked), ${flagged} with Check lines, ${gaps} with Missing fields, ${drafts.length} drafts.`);
