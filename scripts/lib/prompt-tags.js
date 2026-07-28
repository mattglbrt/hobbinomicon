/**
 * Interactive tag prompt for the vlog sync.
 *
 * Tagging is manual. Keyword matching (tag-keywords.json) only ever *prefills a
 * suggestion* — it can no longer write a tag on its own. That split is the
 * point: the keyword file drifted out of sync with the registry and was set to
 * quietly rebuild the junk taxonomy the 07-22 collapse removed, one new vlog at
 * a time. A human now approves every tag that lands in frontmatter.
 *
 * Nothing here may ever block a build. When stdin isn't a TTY (Netlify's
 * prebuild, CI, `--no-prompt`) the prompt is skipped and the post is created
 * with NO tags rather than guessed ones, then listed in the closing report.
 * That's safe: Netlify-built vlog posts are ephemeral and transcript-less
 * anyway, and the committed, locally-tagged file wins on the next sync.
 */

import fs from 'fs';
import readline from 'node:readline/promises';

// ─── Registry ──────────────────────────────────────────────────

/**
 * Reads src/data/tags.json. Returns the live tag list plus category grouping
 * for the `?` listing. A missing/broken registry disables validation rather
 * than killing the sync — the operator can still type tags, they just don't
 * get checked.
 */
export function loadRegistry(registryPath) {
  try {
    const data = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    const tags = Object.keys(data.tags || {});
    if (tags.length === 0) throw new Error('registry has no tags');

    const groups = new Map();
    for (const [key, meta] of Object.entries(data.categories || {})) {
      groups.set(key, { display: meta.display || key, tags: [] });
    }
    for (const [tag, meta] of Object.entries(data.tags)) {
      const cat = meta.category || 'other';
      if (!groups.has(cat)) groups.set(cat, { display: cat, tags: [] });
      groups.get(cat).tags.push(tag);
    }
    return { tags, groups, valid: true };
  } catch (error) {
    console.warn(`  Warning: could not read tag registry (${error.message}) — tags will not be validated.`);
    return { tags: [], groups: new Map(), valid: false };
  }
}

// ─── Fuzzy match for typos ─────────────────────────────────────

function editDistance(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        diag + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      diag = tmp;
    }
  }
  return prev[b.length];
}

// ─── Retired tags ──────────────────────────────────────────────

/**
 * The 07-22 collapse left a 301 for every retired tag. Those redirects are the
 * canonical "this became that" record, so reuse them: typing a tag from muscle
 * memory should say where it went, not just "unknown".
 */
export function loadRetiredMap(redirectsPath) {
  const map = new Map();
  try {
    for (const line of fs.readFileSync(redirectsPath, 'utf-8').split('\n')) {
      const m = line.match(/^\/tags\/([a-z0-9-]+)\s+\/tags\/([a-z0-9-]*)\/?\s+30\d/);
      if (m) map.set(m[1], m[2] || null); // null = redirected to the tag index
    }
  } catch {
    // No redirects file is fine — we just lose the nicer message.
  }
  return map;
}

function nearestTag(input, tags) {
  let best = null;
  let bestScore = Infinity;
  for (const tag of tags) {
    const score = editDistance(input, tag);
    if (score < bestScore) {
      bestScore = score;
      best = tag;
    }
  }
  // Only volunteer a correction when it's plausibly the same word.
  return bestScore <= Math.max(2, Math.floor(input.length / 3)) ? best : null;
}

// ─── Input parsing ─────────────────────────────────────────────

/** Splits on commas and/or whitespace, lowercases, dedupes, preserves order. */
export function parseTagInput(line) {
  const seen = new Set();
  const out = [];
  for (const raw of line.split(/[\s,]+/)) {
    const tag = raw.trim().toLowerCase();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out;
}

/**
 * Splits parsed input into known/unknown against the registry, with a
 * suggestion for each unknown where one is close enough to be a typo.
 */
export function validateTags(tags, registry, retired = new Map()) {
  if (!registry.valid) return { ok: tags, bad: [] };
  const ok = [];
  const bad = [];
  for (const tag of tags) {
    if (registry.tags.includes(tag)) {
      ok.push(tag);
      continue;
    }
    if (retired.has(tag)) {
      bad.push({ tag, retiredTo: retired.get(tag), suggestion: null });
      continue;
    }
    bad.push({ tag, retiredTo: undefined, suggestion: nearestTag(tag, registry.tags) });
  }
  return { ok, bad };
}

// ─── Prompter ──────────────────────────────────────────────────

function printRegistry(registry) {
  console.log('');
  for (const { display, tags } of registry.groups.values()) {
    if (tags.length === 0) continue;
    console.log(`    ${display}`);
    // Wrap to a readable width rather than one tag per line.
    let line = '     ';
    for (const tag of tags) {
      if (line.length + tag.length + 2 > 76) {
        console.log(line);
        line = '     ';
      }
      line += ` ${tag}`;
    }
    if (line.trim()) console.log(line);
  }
  console.log('');
}

/**
 * Creates the prompter. `interactive: false` makes promptForTags a no-op that
 * returns [] — used on Netlify and under --no-prompt.
 */
export function createTagPrompter({ registryPath, redirectsPath, interactive }) {
  const registry = loadRegistry(registryPath);
  const retired = redirectsPath ? loadRetiredMap(redirectsPath) : new Map();
  const untagged = [];
  let rl = null;

  if (interactive) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  }

  async function promptForTags(video, suggested) {
    if (!interactive) {
      untagged.push(video.title);
      return [];
    }

    const hasSuggestion = suggested.length > 0;
    if (hasSuggestion) {
      console.log(`    Suggested: ${suggested.join(', ')}`);
    } else {
      console.log('    No keyword suggestions for this one.');
    }

    for (;;) {
      const hint = hasSuggestion
        ? 'Enter to accept, ? to list, s to skip'
        : '? to list, s to skip';
      const answer = (await rl.question(`    Tags [${hint}]: `)).trim();

      if (answer === '?') {
        printRegistry(registry);
        continue;
      }

      if (answer === '') {
        if (hasSuggestion) {
          console.log(`    ✓ ${suggested.join(', ')}`);
          return suggested;
        }
        console.log('    Type some tags, or "s" to leave this post untagged.');
        continue;
      }

      if (answer === 's' || answer === 'skip') {
        untagged.push(video.title);
        console.log('    ↷ left untagged');
        return [];
      }

      const parsed = parseTagInput(answer);
      const { ok, bad } = validateTags(parsed, registry, retired);

      if (bad.length > 0) {
        for (const { tag, retiredTo, suggestion } of bad) {
          if (retiredTo) {
            console.log(`    ✗ "${tag}" was retired — it's ${retiredTo} now`);
          } else if (retiredTo === null) {
            console.log(`    ✗ "${tag}" was retired with no replacement`);
          } else {
            console.log(
              `    ✗ unknown tag: "${tag}"` + (suggestion ? ` — did you mean ${suggestion}?` : '')
            );
          }
        }
        continue;
      }

      console.log(`    ✓ ${ok.join(', ')}`);
      return ok;
    }
  }

  function close() {
    if (rl) rl.close();
  }

  return { promptForTags, close, untagged, registry, retired };
}
