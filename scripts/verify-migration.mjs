#!/usr/bin/env node
/**
 * The migration gate. Nothing ships until this is green.
 *
 * For every URL in the pre-rebuild sitemap it asserts one of two outcomes:
 *
 *   200  the URL still exists in dist/ and no forced rule shadows it
 *   301  exactly one redirect matches it, and the target exists in dist/
 *        and is not itself redirected
 *
 * Anything else — a 404, a 301 into a 404, a chain of two hops — fails the
 * run. That is the whole contract: every old URL resolves, in one hop, to a
 * page that exists.
 *
 * Usage:
 *   node scripts/verify-migration.mjs
 *   node scripts/verify-migration.mjs --urls roadmap/rebuild/some-other-list.txt
 *   node scripts/verify-migration.mjs --verbose     # print every row, not just failures
 *
 * Build with `npx astro build` first — `npm run build` fires the YouTube
 * prebuild, which this does not need and Netlify's IP block would fail anyway.
 *
 * Netlify rule precedence: netlify.toml is evaluated before _redirects, and
 * within each file the first match wins. A non-forced rule (301) is shadowed
 * by a real file at that path; a forced rule (301!) is not. The chain check
 * below is deliberately order-agnostic — it flags a target that matches any
 * live rule in either file — so a wrong assumption about file precedence can
 * only make this stricter, never laxer.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const VERBOSE = argv.includes('--verbose');
const URLS = resolve(ROOT, flag('--urls', 'roadmap/rebuild/old-sitemap-urls.txt'));

/* ------------------------------------------------------------- rules ---- */

/** One line of a _redirects file: from, to, status, and whether it's forced. */
function parseRedirectsFile(text, origin) {
  const rules = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;

    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;

    const [from, to, status = '301'] = parts;
    if (!from.startsWith('/')) continue;

    rules.push({
      from,
      to,
      status: parseInt(status, 10) || 301,
      forced: status.endsWith('!'),
      origin,
    });
  }
  return rules;
}

/** The [[redirects]] tables in netlify.toml. Flat enough to read by hand. */
function parseNetlifyToml(text) {
  const rules = [];
  const blocks = text.split(/\[\[redirects\]\]/).slice(1);
  for (const block of blocks) {
    const upToNextTable = block.split(/\n\[\[?[a-z]/i)[0];
    const get = (key) => upToNextTable.match(new RegExp(`^\\s*${key}\\s*=\\s*"([^"]*)"`, 'm'))?.[1];
    const from = get('from');
    const to = get('to');
    if (!from || !to) continue;

    const status = parseInt(upToNextTable.match(/^\s*status\s*=\s*(\d+)/m)?.[1] ?? '301', 10);
    const forced = /^\s*force\s*=\s*true/m.test(upToNextTable);
    rules.push({ from, to, status, forced, origin: 'netlify.toml' });
  }
  return rules;
}

/**
 * Netlify path matching. Our rules use only the trailing splat; :params are
 * supported so a future hand-added rule does not silently fail to match here
 * while matching in production.
 *
 * Trailing slashes are normalised, because Netlify normalises them. Checked
 * against the live site rather than assumed: /tags/age-of-sigmar/ 301s to
 * /tags/warhammer/ off a rule written as /tags/age-of-sigmar with no slash.
 * That matters because the 496 hand-written tag rules only carry the bare
 * form, and treating the two as distinct reported the canonical slashed URL
 * of every retired tag as a 404. (02-…md §4 assumes the opposite; the
 * generator still emits both variants, which costs nothing and is the safer
 * shape for forced rules during cutover.)
 */
function matches(pattern, url) {
  const variants = url.endsWith('/') ? [url, url.slice(0, -1)] : [url, `${url}/`];

  for (const u of variants) {
    if (pattern === u) return true;
    if (!pattern.includes('*') && !pattern.includes('/:')) continue;

    const rx = new RegExp(
      '^' +
        pattern
          .split('*')[0]
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\/:[^/]+/g, '/[^/]+') +
        (pattern.includes('*') ? '(.*)$' : '$')
    );
    if (rx.test(u)) return true;
  }
  return false;
}

/* -------------------------------------------------------------- dist ---- */

const distCache = new Map();

/** Does this URL path resolve to a real file in dist/? */
function fileExists(url) {
  if (distCache.has(url)) return distCache.get(url);

  const clean = url.split(/[?#]/)[0];
  const candidates = clean.endsWith('/')
    ? [join(DIST, clean, 'index.html')]
    : [join(DIST, clean), join(DIST, clean, 'index.html'), join(DIST, `${clean}.html`)];

  const found = candidates.some((p) => {
    try { return statSync(p).isFile(); } catch { return false; }
  });
  distCache.set(url, found);
  return found;
}

/* ---------------------------------------------------------- resolve ----- */

const toml = existsSync(join(ROOT, 'netlify.toml'))
  ? parseNetlifyToml(readFileSync(join(ROOT, 'netlify.toml'), 'utf8'))
  : [];
// Prefer dist/_redirects: the Netlify adapter merges public/_redirects with
// any rules it emits for SSR routes, and the merged file is what deploys.
const redirectsPath = existsSync(join(DIST, '_redirects'))
  ? join(DIST, '_redirects')
  : join(ROOT, 'public', '_redirects');
const underscore = parseRedirectsFile(readFileSync(redirectsPath, 'utf8'), redirectsPath.replace(ROOT + '/', ''));
const RULES = [...toml, ...underscore];

/** The first rule that would actually fire for this URL, or null. */
function firstLiveRule(url) {
  const exists = fileExists(url);
  for (const r of RULES) {
    if (!matches(r.from, url)) continue;
    if (exists && !r.forced) continue; // a real file shadows an unforced rule
    return r;
  }
  return null;
}

/** Where a rule sends you. Splat captures are substituted into :splat. */
function targetOf(rule, url) {
  if (!rule.to.includes(':splat')) return rule.to;
  const prefix = rule.from.split('*')[0];
  return rule.to.replace(':splat', url.startsWith(prefix) ? url.slice(prefix.length) : '');
}

function classify(url) {
  const rule = firstLiveRule(url);

  if (!rule) {
    return fileExists(url)
      ? { code: 'OK', detail: '200' }
      : { code: 'MISSING', detail: 'no file in dist/, no redirect matches' };
  }

  const to = targetOf(rule, url);

  if (/^https?:\/\//.test(to)) {
    return { code: 'EXTERNAL', detail: `${rule.status} → ${to} (off-site)`, rule };
  }
  if (to === url) {
    return { code: 'LOOP', detail: `${rule.from} redirects to itself`, rule };
  }
  if (!fileExists(to)) {
    return { code: 'BROKEN', detail: `${rule.status} → ${to}, which is not in dist/`, rule };
  }

  const onward = firstLiveRule(to);
  if (onward) {
    return {
      code: 'CHAIN',
      detail: `${rule.status} → ${to} → ${targetOf(onward, to)} (via ${onward.origin} "${onward.from}")`,
      rule,
    };
  }

  return { code: 'REDIRECT', detail: `${rule.status} → ${to}`, rule };
}

/* ------------------------------------------------------------- report --- */

if (!existsSync(DIST)) {
  console.error(`✗ no dist/ at ${DIST}. Run \`npx astro build\` first.`);
  process.exit(1);
}

const urls = readFileSync(URLS, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'));

const results = urls.map((url) => ({ url, ...classify(url) }));
const FAIL = new Set(['MISSING', 'BROKEN', 'CHAIN', 'LOOP']);
const failures = results.filter((r) => FAIL.has(r.code));

const counts = results.reduce((acc, r) => ({ ...acc, [r.code]: (acc[r.code] ?? 0) + 1 }), {});

console.log(`\nMigration check — ${urls.length} URLs from ${URLS.replace(ROOT + '/', '')}`);
console.log(`  ${RULES.length} rules loaded (${toml.length} netlify.toml, ${underscore.length} ${redirectsPath.replace(ROOT + "/", "")})\n`);

const LABEL = {
  OK: 'served 200 at the same URL',
  REDIRECT: 'single 301 to a page that exists',
  EXTERNAL: 'redirects off-site',
  MISSING: '404 — nothing serves this',
  BROKEN: '301 into a 404',
  CHAIN: 'redirect chain (2+ hops)',
  LOOP: 'redirects to itself',
};

for (const code of ['OK', 'REDIRECT', 'EXTERNAL', 'MISSING', 'BROKEN', 'CHAIN', 'LOOP']) {
  if (!counts[code]) continue;
  console.log(`  ${String(counts[code]).padStart(4)}  ${code.padEnd(9)} ${LABEL[code]}`);
}

if (VERBOSE) {
  console.log('');
  for (const r of results) console.log(`  ${r.code.padEnd(9)} ${r.url}  ${r.detail}`);
}

if (failures.length) {
  console.log(`\n✗ ${failures.length} URL${failures.length === 1 ? '' : 's'} would not resolve:\n`);
  for (const r of failures.slice(0, 60)) {
    console.log(`  ${r.code.padEnd(8)} ${r.url}`);
    console.log(`           ${r.detail}`);
  }
  if (failures.length > 60) console.log(`  … and ${failures.length - 60} more`);
  console.log('');
  process.exit(1);
}

console.log(`\n✓ all ${urls.length} URLs resolve in one hop. 0 missing, 0 chains.\n`);
