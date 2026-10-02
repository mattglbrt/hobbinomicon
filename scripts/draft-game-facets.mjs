#!/usr/bin/env node
/**
 * Draft the directory facet fields on every game from its display strings.
 *
 *   playerCount  -> players { min, max, coop }
 *   gameLength   -> sessionMinutes { min, max }
 *   costToStart  -> rulesPriceUsd, starterPriceUsd
 *   format/tier/tags -> minis, scale
 *
 * A DRAFT, for Matt to review in the diff and in the report this writes to
 * roadmap/rebuild/phase1-facet-review.md. Anything the parser can't read
 * cleanly is left unset (a missing facet just means the game doesn't match
 * that filter) and listed in the report rather than guessed at.
 *
 * Only adds fields a game doesn't already have, so it is safe to re-run and
 * never overwrites a value Matt has corrected by hand.
 *
 *   node scripts/draft-game-facets.mjs          # dry run, report only
 *   node scripts/draft-game-facets.mjs --write  # write frontmatter too
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const GAMES = 'src/content/games';
const REPORT = 'roadmap/rebuild/phase1-facet-review.md';
const WRITE = process.argv.includes('--write');

// Rough, fixed rates. Facet bands are $30 and $75 wide, so a few cents of
// drift never moves a game between bands.
const TO_USD = { $: 1, '£': 1.27, '€': 1.08 };

// Scale can't be read off a string. Skirmish games default to warband and
// army games to mass battle; these are the hand calls, all marked (verify).
const SCALE_OVERRIDES = {
  'a-song-of-ice-and-fire': 'rank-and-flank',
  'conquest-last-argument-of-kings': 'rank-and-flank',
  'kings-of-war': 'rank-and-flank',
  'oathmark': 'rank-and-flank',
  'argatoria': 'rank-and-flank',
  'bolt-action': 'platoon',
  'konflikt-47': 'platoon',
  'full-spectrum-dominance': 'platoon',
  'warmachine': 'platoon',
};

// ---------------------------------------------------------------- parsers

const DASH = '(?:–|—|-|to|or)';

function parsePlayers(raw) {
  if (!raw) return { flag: 'no playerCount' };
  const s = raw.toLowerCase();
  const coop = /co-?op/.test(s);
  const head = s.split('(')[0];
  let m;
  if ((m = head.match(new RegExp(`(\\d+)\\s*${DASH}\\s*(\\d+)(\\+)?`)))) {
    const out = { min: +m[1], coop };
    if (!m[3]) out.max = +m[2];
    return { value: out };
  }
  if ((m = head.match(/(\d+)\s*(\+|or more)/))) return { value: { min: +m[1], coop } };
  if ((m = head.match(/^\s*(\d+)\s*$/)) || (m = head.match(/^\s*(\d+)\b/))) {
    return { value: { min: +m[1], max: +m[1], coop } };
  }
  // "Solo or co-op (2–4)": the range is in the parenthetical.
  if ((m = s.match(new RegExp(`\\((\\d+)\\s*${DASH}\\s*(\\d+)\\)`))) && /solo/.test(head)) {
    return { value: { min: 1, max: +m[2], coop }, flag: `solo, ${m[1]}–${m[2]} in brackets: drafted 1–${m[2]}` };
  }
  // "Solo or co-op", "Head-to-head, co-op or solo": no numbers at all.
  if (/solo/.test(s)) return { value: { min: 1, coop }, flag: 'no numbers; drafted min 1, open max' };
  return { flag: `unreadable: "${raw}"` };
}

const UNIT = '(min(?:ute)?s?|hrs?|hours?)';
const toMin = (n, unit) => (/^h/.test(unit) ? n * 60 : n);
const WORDS = { an: 1, a: 1, one: 1, two: 2, three: 3 };

function parseLength(raw) {
  if (!raw) return { flag: 'no gameLength' };
  let s = raw.toLowerCase().split('(')[0].split(',')[0];
  s = s.replace(/\b(an|a|one|two|three)\s+(hours?|hrs?)/g, (_, w, u) => `${WORDS[w]} ${u}`);
  let m;
  // "60–120 min", "~90 min–2 hr", "1.5 to 2 hrs"
  const range = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${UNIT}?\\s*(?:–|—|-|to)\\s*(\\d+(?:\\.\\d+)?)\\s*${UNIT}`);
  if ((m = s.match(range))) {
    const lo = toMin(+m[1], m[2] || m[4]);
    const hi = toMin(+m[3], m[4]);
    return { value: { min: Math.round(lo), max: Math.round(hi) } };
  }
  const single = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${UNIT}(\\+)?`);
  if ((m = s.match(single))) {
    const n = Math.round(toMin(+m[1], m[2]));
    if (/under/.test(s)) return { value: { min: Math.round(n / 2), max: n }, flag: `"under": drafted ${Math.round(n / 2)}–${n}` };
    if (m[3]) return { value: { min: n, max: n * 2 }, flag: `open-ended: drafted ${n}–${n * 2}` };
    return { value: { min: n, max: n } };
  }
  return { flag: `not a time: "${raw}"` };
}

// A quickstart is never "free rules", so these only match the full rules.
const FREE_RULES = /(free rules|rules free|rules (and|,) cards free|rules, cards .*free|free core rules|core rules free|free pdf rules|rules pdf free|^free pdf\b|^\$0\b|pay what you want)/;
const BOX = /box|starter|\bset\b|core game|teams?\b|warband|embergard/;
const RULES = /pdf|rule|book|hardcover|paperback|digital|supplement/;

// Each amount is read by the words next to it: what follows it up to the
// next separator, or failing that what precedes it. "$15 PDF" is rules,
// "$99 one-player starter set" is a box, a bare "~$400" is both.
function amounts(raw) {
  const s = raw.toLowerCase();
  return [...raw.matchAll(/([$£€])\s?(\d+(?:[.,]\d+)?)/g)].map((m) => {
    const end = m.index + m[0].length;
    const after = s.slice(end).split(/[;,+(]|\bor\b|[$£€]/)[0];
    const before = s.slice(0, m.index).split(/[;,+)]|\bor\b/).pop();
    const kind = (ctx) => (BOX.test(ctx) ? 'box' : RULES.test(ctx) ? 'rules' : null);
    return {
      usd: +m[2].replace(',', '') * TO_USD[m[1]],
      kind: kind(after) || kind(before) || 'both',
      converted: m[1] !== '$',
    };
  });
}
const roundUsd = (n) => (Number.isInteger(n) ? n : n < 30 ? Math.round(n * 100) / 100 : Math.round(n));
const minUsd = (list) => (list.length ? roundUsd(Math.min(...list.map((a) => a.usd))) : undefined);

function parseCost(raw) {
  if (!raw) return { flag: 'no costToStart' };
  const s = raw.toLowerCase();
  const flags = [];
  const amts = amounts(raw);
  if (amts.some((a) => a.converted)) flags.push('converted from £/€');
  if (/pay what you want/.test(s)) flags.push('pay what you want: drafted as free');

  const rulesAmts = amts.filter((a) => a.kind !== 'box');
  const boxAmts = amts.filter((a) => a.kind !== 'rules');
  const value = {};

  if (FREE_RULES.test(s)) value.rulesPriceUsd = 0;
  else if (rulesAmts.length) value.rulesPriceUsd = minUsd(rulesAmts);
  else if (boxAmts.length) {
    // "£88 Third Season Edition box": the rules only come in the box.
    value.rulesPriceUsd = minUsd(boxAmts);
    flags.push('rules only in the box');
  } else return { flag: `no amount: "${raw}"` };

  const starter = minUsd(boxAmts.filter((a) => a.usd > 0));
  if (starter != null) value.starterPriceUsd = starter;
  if (amts.some((a) => a.kind === 'both' && a.usd > 0)) flags.push('bare amount, read as rules + box');
  if (/under/.test(s)) flags.push('"under": price is a ceiling');
  if (/starter rules free/.test(s)) flags.push('only the starter rules are free (verify)');
  return { value, flag: flags.join('; ') || undefined };
}

function draftMinis(fm) {
  if (fm.miniatureAgnostic) return {};
  if (fm.format === 'ttrpg') return {};
  const tags = fm.tags || [];
  if (fm.tier === 'big') return { value: 'own-line' };
  if (tags.includes('3d-printable')) return { value: 'print-and-play', flag: 'from 3d-printable tag (verify)' };
  if (tags.includes('kitbash-friendly')) return { value: 'proxy-friendly', flag: 'from kitbash-friendly tag (verify)' };
  return { value: 'own-line', flag: 'indie + not agnostic: guessed own-line (verify)' };
}

function draftScale(slug, fm) {
  if (SCALE_OVERRIDES[slug]) return { value: SCALE_OVERRIDES[slug], flag: 'hand call (verify)' };
  if (fm.format === 'army') return { value: 'mass-battle' };
  if (fm.format === 'ttrpg') return {};
  return { value: 'warband' };
}

// ---------------------------------------------------------------- yaml out

function yamlLines(add) {
  const out = [];
  if ('rulesPriceUsd' in add) out.push(`rulesPriceUsd: ${add.rulesPriceUsd}`);
  if ('starterPriceUsd' in add) out.push(`starterPriceUsd: ${add.starterPriceUsd}`);
  if (add.players) {
    const p = add.players;
    const parts = [`min: ${p.min}`];
    if (p.max != null) parts.push(`max: ${p.max}`);
    if (p.coop) parts.push('coop: true');
    out.push(`players: { ${parts.join(', ')} }`);
  }
  if (add.sessionMinutes) out.push(`sessionMinutes: { min: ${add.sessionMinutes.min}, max: ${add.sessionMinutes.max} }`);
  if (add.minis) out.push(`minis: ${add.minis}`);
  if (add.scale) out.push(`scale: ${add.scale}`);
  return out;
}

// ---------------------------------------------------------------- main

const rows = [];
let written = 0;

for (const file of fs.readdirSync(GAMES).filter((f) => /\.mdx?$/.test(f)).sort()) {
  const slug = file.replace(/\.mdx?$/, '');
  const full = path.join(GAMES, file);
  const text = fs.readFileSync(full, 'utf8');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  // Lookahead, not \r?$, so the fence lines keep their CRLF on rejoin.
  const parts = text.split(/^---(?=\r?$)/m);
  const fm = parseYaml(parts[1]);

  const add = {};
  const flags = [];
  const note = (field, r) => r.flag && flags.push(`${field}: ${r.flag}`);

  if (fm.players == null) { const r = parsePlayers(fm.playerCount); if (r.value) add.players = r.value; note('players', r); }
  if (fm.sessionMinutes == null) { const r = parseLength(fm.gameLength); if (r.value) add.sessionMinutes = r.value; note('length', r); }
  if (fm.rulesPriceUsd == null) { const r = parseCost(fm.costToStart); if (r.value) Object.assign(add, r.value); note('price', r); }
  if (fm.minis == null) { const r = draftMinis(fm); if (r.value) add.minis = r.value; note('minis', r); }
  if (fm.scale == null) { const r = draftScale(slug, fm); if (r.value) add.scale = r.value; note('scale', r); }

  const lines = yamlLines(add);
  rows.push({ slug, fm, add, lines, flags });

  if (WRITE && lines.length) {
    // Insert just before the top-level `tags:` line (every game has one);
    // fall back to the end of the frontmatter.
    const block = lines.join(eol) + eol;
    let body = parts[1];
    const idx = body.search(/^tags:/m);
    body = idx >= 0 ? body.slice(0, idx) + block + body.slice(idx) : body.replace(/\r?\n?$/, eol) + block;
    parts[1] = body;
    fs.writeFileSync(full, parts.join('---'));
    written++;
  }
}

// ---------------------------------------------------------------- report

const cell = (s) => String(s ?? '').replace(/\|/g, '\\|');
const live = rows.filter((r) => !r.fm.draft);
const flagged = live.filter((r) => r.flags.length);
const md = [];
md.push('# Phase 1 facet review', '');
md.push(`Drafted by \`scripts/draft-game-facets.mjs\` on ${new Date().toISOString().slice(0, 10)}. ` +
  `${live.length} live games (drafts listed at the end). Fix a value by editing the game's frontmatter; ` +
  're-running the script never overwrites a field that is already set.', '');
md.push('Price rule: `rulesPriceUsd` is the full rules (0 = free; a quickstart does not count). ' +
  '`starterPriceUsd` is the cheapest box to play from nothing, and is blank when the answer is "+ minis you own". ' +
  '£ and € are converted at fixed rates (1.27, 1.08).', '');
md.push(`## Needs a look (${flagged.length})`, '');
md.push('| Game | Source strings | Drafted | Why |', '|---|---|---|---|');
for (const r of flagged) {
  const src = [r.fm.playerCount, r.fm.gameLength, r.fm.costToStart].map((x) => x ?? '—').join(' · ');
  md.push(`| ${r.slug} | ${cell(src)} | ${cell(r.lines.join('<br>'))} | ${cell(r.flags.join('<br>'))} |`);
}
md.push('', `## Clean drafts (${live.length - flagged.length})`, '');
md.push('| Game | Source strings | Drafted |', '|---|---|---|');
for (const r of live.filter((x) => !x.flags.length)) {
  const src = [r.fm.playerCount, r.fm.gameLength, r.fm.costToStart].map((x) => x ?? '—').join(' · ');
  md.push(`| ${r.slug} | ${cell(src)} | ${cell(r.lines.join('<br>'))} |`);
}
md.push('', `Drafts (not reviewed, they build no page): ${rows.filter((r) => r.fm.draft).map((r) => r.slug).join(', ')}`, '');
// The report is the record of what was guessed and why, so only a run that
// drafts something writes it. A re-run over finished files would otherwise
// replace it with an empty one.
const drafted = rows.some((r) => r.lines.length);
if (WRITE && drafted) fs.writeFileSync(REPORT, md.join('\n'));

const count = (k) => live.filter((r) => k in r.add || r.fm[k] != null).length;
console.log(`${live.length} live games. Drafted: players ${count('players')}, length ${count('sessionMinutes')}, ` +
  `rules price ${count('rulesPriceUsd')}, starter ${count('starterPriceUsd')}, minis ${count('minis')}, scale ${count('scale')}.`);
console.log(`${flagged.length} flagged for review -> ${REPORT}`);
console.log(WRITE ? `Wrote ${written} files.` : 'Dry run. --write to update frontmatter.');
