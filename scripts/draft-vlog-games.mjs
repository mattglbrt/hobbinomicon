#!/usr/bin/env node
/**
 * Draft `games: [...]` on every vlog: which directory games the video covers.
 * Feeds "Recently covered games" on the homepage and the directory's default
 * sort.
 *
 * Evidence, strongest first. Every source is recorded in the report so the
 * review can see why a game was linked:
 *
 *   map     src/data/game-videos.json (hand-curated, keyed by youtubeId)
 *   series  the vlog's series has a `game`
 *   tag     a vlog tag equal to a game slug (what vlog/[slug].astro already
 *           uses for "same game" related posts)
 *   legacy  a stray `game:` key the schema never read (4 files)
 *   title   the game's title or an alias appears in the video title
 *
 * Title matches on common English words (Pillage, Sludge, Rapture...) are
 * listed in the report as "possible" but NOT written: a vlog called
 * "Pillage the hobby shelf" isn't about Pillage.
 *
 * Only touches vlogs with no `games` key, so hand edits survive a re-run.
 * A vlog with no evidence gets nothing written (the schema default is []).
 *
 *   node scripts/draft-vlog-games.mjs           # dry run, prints summary
 *   node scripts/draft-vlog-games.mjs --write   # frontmatter + report
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const VLOG = 'src/content/vlog';
const GAMES = 'src/content/games';
const SERIES = 'src/content/series';
const REPORT = 'roadmap/rebuild/phase1-vlog-games-review.md';
const WRITE = process.argv.includes('--write');

const FENCE = /^---(?=\r?$)/m;
const readFm = (file) => {
  const text = fs.readFileSync(file, 'utf8');
  return { text, parts: text.split(FENCE), fm: parseYaml(text.split(FENCE)[1]) || {} };
};
const mdx = (dir) => fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
const slugOf = (f) => f.replace(/\.mdx?$/, '');

// Words that are game titles and also ordinary English. Title hits on these
// are reported, never written.
const AMBIGUOUS = new Set([
  'pillage', 'sludge', 'rapture', 'carnivore', 'brethren', 'infinity', 'saga',
  'hobgoblin', 'midgard', 'verrotwood', 'last mile', 'the doomed', 'omen tide',
  'warcry', 'greathelm', 'scrapjacks', 'moonstone',
]);

// ---------------------------------------------------------------- indexes

const games = new Map(); // slug -> { title, names[] }
for (const f of mdx(GAMES)) {
  const { fm } = readFm(path.join(GAMES, f));
  const names = [fm.title, ...(fm.aliases || [])]
    .filter(Boolean)
    .map((n) => n.toLowerCase().trim())
    // Short aliases ("KoW", "MCP") collide with ordinary words in titles.
    .filter((n) => n.replace(/[^a-z0-9]/g, '').length >= 5 || /\s/.test(n));
  games.set(slugOf(f), { title: fm.title, names: [...new Set(names)], draft: !!fm.draft });
}

const byVideo = new Map(); // youtubeId -> Set(slug)
for (const [slug, vids] of Object.entries(JSON.parse(fs.readFileSync('src/data/game-videos.json', 'utf8')))) {
  for (const v of vids) {
    if (!byVideo.has(v.id)) byVideo.set(v.id, new Set());
    byVideo.get(v.id).add(slug);
  }
}

const seriesGame = new Map();
for (const f of mdx(SERIES)) {
  const { fm } = readFm(path.join(SERIES, f));
  if (fm.game) seriesGame.set(slugOf(f), fm.game);
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const nameRe = new Map(
  [...games].flatMap(([slug, g]) => g.names.map((n) => [`${slug}\u0000${n}`, new RegExp(`(^|[^a-z0-9])${escape(n)}($|[^a-z0-9])`, 'i')])),
);

// ---------------------------------------------------------------- main

const rows = [];
let written = 0;

for (const f of mdx(VLOG).sort()) {
  const full = path.join(VLOG, f);
  const { text, parts, fm } = readFm(full);
  if ('games' in fm) continue;

  const found = new Map(); // slug -> Set(source)
  const possible = new Map();
  const add = (slug, src, into = found) => {
    if (!games.has(slug)) return;
    if (!into.has(slug)) into.set(slug, new Set());
    into.get(slug).add(src);
  };

  if (fm.youtubeId && byVideo.has(fm.youtubeId)) for (const s of byVideo.get(fm.youtubeId)) add(s, 'map');
  if (fm.series && seriesGame.has(fm.series)) add(seriesGame.get(fm.series), 'series');
  for (const t of fm.tags || []) add(t, 'tag');
  if (typeof fm.game === 'string') add(fm.game, 'legacy');

  const title = String(fm.title || '');
  for (const [key, re] of nameRe) {
    const [slug, name] = key.split('\u0000');
    if (!re.test(title)) continue;
    add(slug, `title: "${name}"`, AMBIGUOUS.has(name) && !found.has(slug) ? possible : found);
  }
  for (const s of found.keys()) possible.delete(s);

  rows.push({ slug: slugOf(f), title, date: fm.pubDate, found, possible });

  if (WRITE && found.size) {
    const eol = text.includes('\r\n') ? '\r\n' : '\n';
    const line = `games: [${[...found.keys()].sort().join(', ')}]${eol}`;
    // End of the frontmatter. parts[1] ends with the newline before the fence.
    parts[1] = parts[1].replace(/\r?\n?$/, eol) + line;
    fs.writeFileSync(full, parts.join('---'));
    written++;
  }
}

// ---------------------------------------------------------------- report

const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const cell = (s) => String(s).replace(/\|/g, '\\|');
const linked = rows.filter((r) => r.found.size);
const titleOnly = linked.filter((r) => [...r.found.values()].every((src) => [...src].every((x) => x.startsWith('title'))));
const possible = rows.filter((r) => r.possible.size);

const md = [
  '# Phase 1 vlog → game review', '',
  `Drafted by \`scripts/draft-vlog-games.mjs\` on ${new Date().toISOString().slice(0, 10)}. ` +
  `${rows.length} vlogs checked, ${linked.length} linked to at least one game. ` +
  'Fix a link by editing `games:` in the vlog; a re-run never touches a vlog that already has the key.', '',
  `## Title match only (${titleOnly.length}): weakest evidence, check these first`, '',
  '| Vlog | Date | Title | Linked | Why |', '|---|---|---|---|---|',
  ...titleOnly.map((r) => `| ${r.slug} | ${day(r.date)} | ${cell(r.title)} | ${[...r.found.keys()].join(', ')} | ${cell([...r.found.values()].flatMap((s) => [...s]).join('; '))} |`),
  '', `## Possible, not written (${possible.length}): title uses a game name that's also a common word`, '',
  '| Vlog | Title | Maybe |', '|---|---|---|',
  ...possible.map((r) => `| ${r.slug} | ${cell(r.title)} | ${[...r.possible.keys()].join(', ')} |`),
  '', `## Linked from curated data (${linked.length - titleOnly.length})`, '',
  '| Vlog | Date | Linked | Sources |', '|---|---|---|---|',
  ...linked.filter((r) => !titleOnly.includes(r)).map((r) =>
    `| ${r.slug} | ${day(r.date)} | ${[...r.found.keys()].join(', ')} | ${cell([...r.found].map(([s, src]) => `${s}: ${[...src].join(', ')}`).join('; '))} |`),
  '',
];

const perGame = {};
for (const r of linked) for (const s of r.found.keys()) perGame[s] = (perGame[s] || 0) + 1;
md.push('## Videos per game', '', Object.entries(perGame).sort((a, b) => b[1] - a[1]).map(([s, n]) => `${s} ${n}`).join(' · '), '');

if (WRITE && written) fs.writeFileSync(REPORT, md.join('\n'));

console.log(`${rows.length} vlogs without games:. Linked ${linked.length} (${titleOnly.length} on title alone), ` +
  `${possible.length} possible-only, ${rows.length - linked.length} with no game.`);
console.log(`Games covered: ${Object.keys(perGame).length}.`);
console.log(WRITE ? `Wrote ${written} files${written ? `; report -> ${REPORT}` : ''}.` : 'Dry run. --write to update frontmatter.');
