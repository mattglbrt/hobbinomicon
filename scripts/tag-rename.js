#!/usr/bin/env node

/**
 * Tag Rename
 * Apply a tag mapping to every blog post's frontmatter. Supports:
 *   - rename: "old-tag" → "new-tag"
 *   - drop:   "old-tag" → null
 *   - merge:  multiple sources mapped to the same target (post tag arrays
 *             are deduplicated, so collisions resolve cleanly)
 *
 * Mapping format (JSON):
 *   {
 *     "miniature painting": "painting",
 *     "minipainting":       "painting",
 *     "soloplay":           "solo-rpg",
 *     "wip":                null
 *   }
 *
 * Usage:
 *   node scripts/tag-rename.js --mapping <path>            # apply (writes files)
 *   node scripts/tag-rename.js --mapping <path> --dry-run  # preview only
 *
 * Notes:
 *   - Only single-line array frontmatter (`tags: ["a", "b"]`) is handled.
 *     Multi-line YAML form is skipped (none of the auto-generated posts use it).
 *   - Renames are single-pass: `{ "a": "b", "b": "c" }` does not chain — write
 *     `{ "a": "c", "b": "c" }` explicitly if that's what you mean.
 *   - tags.json is not touched. After renames, register any new canonical tags
 *     there manually.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../src/content/blog');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const mappingFlagIdx = args.indexOf('--mapping');

if (mappingFlagIdx === -1 || !args[mappingFlagIdx + 1]) {
  console.error('Usage: tag-rename.js --mapping <path-to-json> [--dry-run]');
  console.error('');
  console.error('Mapping format: { "old-tag": "new-tag", "drop-me": null }');
  process.exit(1);
}

const mappingPath = args[mappingFlagIdx + 1];
let rawMapping;
try {
  rawMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
} catch (err) {
  console.error(`Failed to load mapping at ${mappingPath}: ${err.message}`);
  process.exit(1);
}

// ─── Validate ───────────────────────────────────────────────────────
const renames = new Map();
const drops = new Set();

for (const [from, to] of Object.entries(rawMapping)) {
  if (to === null || to === '') {
    drops.add(from);
  } else if (typeof to === 'string') {
    if (from === to) continue; // identity, ignore
    renames.set(from, to);
  } else {
    console.error(`Invalid mapping entry: "${from}" → ${JSON.stringify(to)} (must be string or null)`);
    process.exit(1);
  }
}

console.log('\n=== Tag Rename ===\n');
console.log(`Mode:    ${DRY_RUN ? 'DRY RUN (no writes)' : 'APPLY'}`);
console.log(`Renames: ${renames.size}`);
console.log(`Drops:   ${drops.size}\n`);

// ─── Walk + apply ───────────────────────────────────────────────────
function findFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) findFiles(fullPath, out);
    else if (/\.mdx?$/.test(entry.name)) out.push(fullPath);
  }
  return out;
}

const TAGS_RE = /^tags:\s*(\[[^\]]*\])\s*$/m;

function applyMapping(tags) {
  const result = [];
  const seen = new Set();
  for (const tag of tags) {
    if (drops.has(tag)) continue;
    const next = renames.get(tag) ?? tag;
    if (drops.has(next)) continue;
    if (!seen.has(next)) {
      seen.add(next);
      result.push(next);
    }
  }
  return result;
}

let filesChecked = 0;
let filesChanged = 0;
const appliedCounts = new Map(); // mapping-key -> number of posts where it fired

for (const file of findFiles(BLOG_DIR)) {
  const content = fs.readFileSync(file, 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;
  const tagsMatch = fmMatch[1].match(TAGS_RE);
  if (!tagsMatch) continue;

  filesChecked++;

  let tags;
  try {
    tags = JSON.parse(tagsMatch[1].replace(/'/g, '"'));
  } catch {
    continue;
  }
  if (!Array.isArray(tags)) continue;

  const newTags = applyMapping(tags);
  const changed =
    newTags.length !== tags.length || newTags.some((t, i) => t !== tags[i]);

  if (!changed) continue;

  for (const tag of tags) {
    if (drops.has(tag) || renames.has(tag)) {
      appliedCounts.set(tag, (appliedCounts.get(tag) ?? 0) + 1);
    }
  }

  filesChanged++;

  const relPath = path.relative(BLOG_DIR, file);
  const newTagsStr = `[${newTags.map((t) => `"${t}"`).join(', ')}]`;

  console.log(`${DRY_RUN ? '[would change]' : '[changed]'}  ${relPath}`);
  console.log(`  before: ${tagsMatch[0]}`);
  console.log(`  after:  tags: ${newTagsStr}`);
  console.log('');

  if (!DRY_RUN) {
    const newFm = fmMatch[1].replace(TAGS_RE, `tags: ${newTagsStr}`);
    fs.writeFileSync(file, content.replace(fmMatch[0], `---\n${newFm}\n---`), 'utf-8');
  }
}

// ─── Summary ────────────────────────────────────────────────────────
console.log('--- Summary ---\n');
console.log(`Files scanned: ${filesChecked}`);
console.log(`Files ${DRY_RUN ? 'that would change' : 'changed'}: ${filesChanged}\n`);

if (appliedCounts.size > 0) {
  console.log('Mapping fired on:');
  const sorted = [...appliedCounts.entries()].sort((a, b) => b[1] - a[1]);
  for (const [tag, count] of sorted) {
    const action = drops.has(tag) ? '(drop)' : `→ "${renames.get(tag)}"`;
    console.log(`  ${String(count).padStart(4)}  "${tag}"  ${action}`);
  }
  console.log('');
}

const unused = [...renames.keys(), ...drops].filter((t) => !appliedCounts.has(t));
if (unused.length > 0) {
  console.log(`Mapping entries that did not match any post: ${unused.length}`);
  for (const t of unused) {
    const action = drops.has(t) ? '(drop)' : `→ "${renames.get(t)}"`;
    console.log(`  "${t}"  ${action}`);
  }
  console.log('');
}

if (DRY_RUN && filesChanged > 0) {
  console.log('Re-run without --dry-run to apply.\n');
}
