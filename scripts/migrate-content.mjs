#!/usr/bin/env node
/**
 * Phase 1 of the 2026-08 re-architecture: move every post to its new home and
 * set the frontmatter the new collections require.
 *
 * Driven entirely by roadmap/rebuild/url-map-posts.csv. The CSV decides what
 * moves where; this script never guesses a destination. Frontmatter it adds is
 * mechanical — `topic` from tags, `hub` from tags, `game` from the CSV column,
 * `videoTitle` from the existing title. Anything requiring judgement is left as
 * a {/* MATT *\/} flag rather than invented, and listed at the end.
 *
 * Moves use `git mv`, so history follows the file and `git status` shows a
 * rename rather than a delete plus an add.
 *
 * Usage:
 *   node scripts/migrate-content.mjs --dry-run    # report, touch nothing
 *   node scripts/migrate-content.mjs              # do it
 *
 * Idempotent: a file already at its destination is skipped, so a partial run
 * can be finished by running again.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CSV = join(ROOT, 'roadmap', 'rebuild', 'url-map-posts.csv');
const DRY = process.argv.includes('--dry-run');

const notes = [];   // {file, note} — surfaces as {/* MATT */} flags
const log = [];

/* ---------------------------------------------------------------- CSV ---- */

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); field = ''; if (row.some(f => f !== '')) rows.push(row); row = []; }
    else if (c !== '\r') field += c;
  }
  row.push(field);
  if (row.some(f => f !== '')) rows.push(row);
  const header = rows.shift();
  return rows.map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

/* -------------------------------------------------------- frontmatter ---- */

function splitFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('no frontmatter');
  return { fm: m[1], body: m[2] };
}

function fmGet(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!m) return undefined;
  return m[1].trim().replace(/^["'](.*)["']$/, '$1');
}

function fmGetArray(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(\\[.*\\])\\s*$`, 'm'));
  if (!m) return [];
  try { return JSON.parse(m[1].replace(/'/g, '"')); } catch { return []; }
}

/** Insert or replace a key, keeping the rest of the block byte-stable. */
function fmSet(fm, key, rendered) {
  const re = new RegExp(`^${key}:.*$`, 'm');
  if (re.test(fm)) return fm.replace(re, `${key}: ${rendered}`);
  return `${fm}\n${key}: ${rendered}`;
}

function fmDrop(fm, key) {
  return fm.replace(new RegExp(`^${key}:.*\\n?`, 'm'), '');
}

const q = (s) => JSON.stringify(String(s));

/* ------------------------------------------------------------ mapping ---- */

/**
 * tags -> guides.topic. First match in this order wins; the order encodes
 * specificity, so a post tagged both `terrain` and `painting` files under
 * terrain, which is what it is actually about.
 */
const TOPIC_BY_TAG = [
  ['solo-rpg', 'solo-rpg'],
  ['buying-selling', 'buying-and-selling'],
  ['airbrushing', 'airbrushing'],
  ['sculpting', 'sculpting-casting-3d-printing'],
  ['resin-casting', 'sculpting-casting-3d-printing'],
  ['3d-printing', 'sculpting-casting-3d-printing'],
  ['kitbashing', 'kitbashing'],
  ['terrain', 'basing-and-terrain'],
  ['basing', 'basing-and-terrain'],
  ['unboxing', 'review'],
  ['review', 'review'],
  ['painting', 'painting'],
];

/** Titles that announce a how-to-start guide regardless of tags. */
const GETTING_STARTED = /^(how to (start|get started)|getting started|starting )/i;

function pickTopic(tags, title) {
  if (GETTING_STARTED.test(title)) return { topic: 'getting-started' };
  for (const [tag, topic] of TOPIC_BY_TAG) {
    if (tags.includes(tag)) return { topic };
  }
  // Every promote-guide row is a tutorial by definition, so painting is the
  // safe floor — but say so, rather than let a silent default stand.
  return { topic: 'painting', uncertain: true };
}

function pickHub(tags) {
  if (tags.includes('warmachine')) return 'warmachine';
  if (tags.includes('warhammer') || tags.includes('necromunda')) return 'warhammer';
  return undefined;
}

/** `system` reserves the future /warhammer/{system}/ slug. */
function pickSystem(tags, hub) {
  if (hub !== 'warhammer') return undefined;
  if (tags.includes('necromunda')) return 'necromunda';
  return undefined;   // 40k vs Old World needs a human eye
}

/** Episode number from the title, or undefined when it is not stated. */
function pickEpisode(title) {
  const m =
    title.match(/\b(?:episode|ep\.?|part)\s*#?(\d+)/i) ??
    title.match(/\bpart(\d+)/i);
  return m ? parseInt(m[1], 10) : undefined;
}

/* --------------------------------------------------------------- run ----- */

const rows = parseCsv(readFileSync(CSV, 'utf8'));
const gameSlugs = new Set(
  execFileSync('ls', [join(ROOT, 'src', 'content', 'games')], { encoding: 'utf8' })
    .split('\n').filter(Boolean).map(f => f.replace(/\.mdx?$/, ''))
);

const SOURCE_ROOT = join(ROOT, 'src', 'content');

/** Old URL -> the file that currently backs it. */
function sourcePath(oldUrl) {
  const rel = oldUrl.replace(/^\/blog\//, '').replace(/\/$/, '');
  for (const base of ['blog', 'vlog']) {
    const p = join(SOURCE_ROOT, base, `${rel}.mdx`);
    if (existsSync(p)) return p;
  }
  return null;
}

/** New URL + action -> the file that should back it. */
function destPath(row) {
  const slug = row.new_url.replace(/^\//, '').replace(/\/$/, '');
  switch (row.action) {
    case 'promote-guide':                       // /guides/{slug}/
      return join(SOURCE_ROOT, 'guides', `${slug.replace(/^guides\//, '')}.mdx`);
    case 'keep-resource':                       // /games/mage-knight/{x}/
      return join(SOURCE_ROOT, 'guides', `${slug.replace(/^games\//, '')}.mdx`);
    case 'series':                              // /series/{series}/{slug}/
      return join(SOURCE_ROOT, 'vlog', `${slug.split('/').pop()}.mdx`);
    case 'keep-article':                        // /articles/{slug}/
      return join(SOURCE_ROOT, 'vlog', `${slug.replace(/^articles\//, '')}.mdx`);
    case 'vlog':                                // /vlog/{slug}/
      return join(SOURCE_ROOT, 'vlog', `${slug.replace(/^vlog\//, '')}.mdx`);
    default:
      throw new Error(`unknown action: ${row.action}`);
  }
}

function transform(row, src, destRel) {
  let { fm, body } = splitFrontmatter(src);
  const title = fmGet(fm, 'title') ?? '';
  const tags = fmGetArray(fm, 'tags');
  const game = gameSlugs.has(row.game) ? row.game : null;
  if (row.game && !game) {
    // Named in the CSV but the directory has no entry yet. A dangling
    // reference() fails the build, so it is left off and recorded.
    log.push(`  no games entry for "${row.game}" — game: omitted on ${destRel}`);
  }

  if (row.action === 'promote-guide' || row.action === 'keep-resource') {
    const isResource = row.action === 'keep-resource';
    const { topic, uncertain } = isResource
      ? { topic: 'getting-started' }
      : pickTopic(tags, title);
    const hub = isResource ? undefined : pickHub(tags);

    if (title) fm = fmSet(fm, 'videoTitle', q(title));
    fm = fmSet(fm, 'topic', q(topic));
    if (game) fm = fmSet(fm, 'game', q(game));
    if (hub) fm = fmSet(fm, 'hub', q(hub));
    const system = pickSystem(tags, hub);
    if (system) fm = fmSet(fm, 'system', q(system));
    fm = fmSet(fm, 'difficulty', q('beginner'));
    fm = fmSet(fm, 'legacySlug', q(row.old_url.replace(/^\/|\/$/g, '')));

    // `category` was the blog collection's shelf label (Videos / Articles);
    // the collection itself carries that now. `featured` is false on every
    // promoted post, so it goes too. Everything else — project, resourceType,
    // hideRelatedPosts — holds real data and is kept, which is why the guides
    // schema carries those fields.
    fm = fmDrop(fm, 'category');
    fm = fmDrop(fm, 'featured');

    if (uncertain) {
      notes.push({ file: destRel, note: `topic guessed as "painting" — tags were [${tags.join(', ')}]. Confirm or change.` });
    }
    if (hub === 'warhammer' && !system) {
      notes.push({ file: destRel, note: 'hub: warhammer but system is unset — 40k, the-old-world or spearhead?' });
    }
  }

  if (row.action === 'series') {
    const seriesSlug = row.new_url.split('/')[2];
    const episode = pickEpisode(title);
    fm = fmSet(fm, 'series', q(seriesSlug));
    if (episode !== undefined) fm = fmSet(fm, 'episode', String(episode));
    else notes.push({ file: destRel, note: `episode number not stated in the title ("${title}") — set \`episode\` by hand.` });
  }

  if (row.action === 'keep-article') {
    fm = fmSet(fm, 'kind', q('article'));
  }

  fm = fm.replace(/\n{3,}/g, '\n\n').replace(/\n+$/, '');
  return `---\n${fm}\n---\n${body}`;
}

let moved = 0, skipped = 0, missing = 0;

for (const row of rows) {
  const dest = destPath(row);
  const destRel = relative(ROOT, dest);

  if (existsSync(dest)) { skipped++; continue; }

  const src = sourcePath(row.old_url);
  if (!src) {
    console.error(`  MISSING SOURCE  ${row.old_url}`);
    missing++;
    continue;
  }

  const content = transform(row, readFileSync(src, 'utf8'), destRel);

  if (DRY) { moved++; continue; }

  mkdirSync(dirname(dest), { recursive: true });
  try {
    execFileSync('git', ['mv', relative(ROOT, src), relative(ROOT, dest)], { cwd: ROOT });
  } catch {
    renameSync(src, dest);          // untracked file: plain move
  }
  writeFileSync(dest, content);
  moved++;
}

/* --------------------------------------------------- restored pages ------ */

/**
 * The six resource pages restored from 48d6f7c in Phase 0. They predate
 * url-map-posts.csv, and url-map-legacy-404s.csv maps them at existing hubs
 * and game pages — i.e. fold the content and 301 the URL. That was written
 * before Matt restored them, and it contradicts non-negotiable 8: nothing is
 * deleted from the index. So each keeps a page of its own.
 *
 * Two destinations come straight from the legacy CSV. The other four are
 * placed here and flagged, because the CSV names a hub rather than a page for
 * them. A resource page that is a directory of links is a list article, so
 * /articles/ is where they go.
 */
const RESTORED = [
  { file: 'warriors-of-athena-figure-list',
    dest: 'guides/mage-knight/warriors-of-athena-figure-list.mdx',
    topic: 'getting-started',
    fromCsv: true },
  { file: 'solo-coop-gaming-resources',
    dest: 'guides/solo-coop-gaming-resources.mdx',
    topic: 'solo-rpg',
    fromCsv: true },
  { file: 'painting-references-maximus-infinity',
    dest: 'guides/painting-references-maximus-infinity.mdx',
    topic: 'painting',
    game: 'infinity',
    note: 'legacy map sent this to /games/infinity/, which folds the page away. Kept as its own guide instead. Move it if you would rather the reference photos lived on the Infinity game page.' },
  { file: 'trench-crusade-resources',
    dest: 'vlog/trench-crusade-resources.mdx',
    kind: 'article',
    note: 'legacy map says "content already merged into game page" and 301s to /games/trench-crusade/. Kept as /articles/trench-crusade-resources/ so the URL survives. Confirm, or say the word and it folds into the game page with a 301.' },
  { file: 'warmachine-resources',
    dest: 'vlog/warmachine-resources.mdx',
    kind: 'article',
    note: 'legacy map says "content → hub" and 301s to /warmachine/. Kept as /articles/warmachine-resources/ so the URL survives. The Warmachine hub lands in Phase 4; decide then whether this folds into it.' },
  { file: 'chainmail-miniatures-checklist',
    dest: 'vlog/chainmail-miniatures-checklist.mdx',
    kind: 'article',
    note: 'legacy map offers /games/graveyard/ or a /games/chainmail/ entry. Kept as /articles/chainmail-miniatures-checklist/ — a checklist is a list article. A Chainmail game entry would be better still if you want one.' },
];

for (const r of RESTORED) {
  const src = join(SOURCE_ROOT, 'blog', 'resources', `${r.file}.mdx`);
  const dest = join(SOURCE_ROOT, r.dest);
  const destRel = relative(ROOT, dest);
  if (!existsSync(src) || existsSync(dest)) { skipped++; continue; }

  let { fm, body } = splitFrontmatter(readFileSync(src, 'utf8'));
  fm = fmDrop(fm, 'category');
  fm = fmDrop(fm, 'featured');
  fm = fmSet(fm, 'legacySlug', q(`blog/resources/${r.file}`));
  if (r.topic) fm = fmSet(fm, 'topic', q(r.topic));
  if (r.topic) fm = fmSet(fm, 'difficulty', q('beginner'));
  if (r.game) fm = fmSet(fm, 'game', q(r.game));
  if (r.kind) fm = fmSet(fm, 'kind', q(r.kind));
  fm = fm.replace(/\n{3,}/g, '\n\n').replace(/\n+$/, '');

  if (r.note) notes.push({ file: destRel, note: r.note });

  if (DRY) { moved++; continue; }
  mkdirSync(dirname(dest), { recursive: true });
  try { execFileSync('git', ['mv', relative(ROOT, src), relative(ROOT, dest)], { cwd: ROOT }); }
  catch { renameSync(src, dest); }
  writeFileSync(dest, `---\n${fm}\n---\n${body}`);
  moved++;
}

/* ------------------------------------------------------------ notes ------ */

if (!DRY && notes.length) {
  for (const { file, note } of notes) {
    const p = join(ROOT, file);
    if (!existsSync(p)) continue;
    const s = readFileSync(p, 'utf8');
    const [, fm, body] = s.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    writeFileSync(p, `---\n${fm}\n---\n\n{/* MATT: ${note} */}\n\n${body.replace(/^\n+/, '')}`);
  }
}

console.log(`\n${DRY ? 'DRY RUN — ' : ''}migrate-content`);
console.log(`  ${moved} moved, ${skipped} already in place, ${missing} missing source`);
if (log.length) {
  console.log(`\n  notes:`);
  console.log([...new Set(log)].join('\n'));
}
if (notes.length) {
  console.log(`\n  ${notes.length} MATT flag${notes.length === 1 ? '' : 's'}:`);
  for (const { file, note } of notes) console.log(`    ${file}\n      ${note}`);
}
if (missing) process.exit(1);
