#!/usr/bin/env node

/**
 * Tag Audit
 * Read-only inspection of every tag used across the blog collection.
 *
 * Surfaces:
 *   - All distinct tags with post counts, sorted desc
 *   - Tags not registered in src/data/tags.json
 *   - Likely duplicate variants (same normalized form, e.g. "mage knight" vs "mage-knight")
 *
 * Usage:
 *   node scripts/tag-audit.js              # full audit
 *   node scripts/tag-audit.js --unknown    # only unknown tags
 *   node scripts/tag-audit.js --duplicates # only duplicate-variant groups
 *   node scripts/tag-audit.js --csv        # machine-readable CSV (tag,count,known)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const TAGS_JSON = path.join(__dirname, '../src/data/tags.json');

const args = new Set(process.argv.slice(2));
const ONLY_UNKNOWN = args.has('--unknown');
const ONLY_DUPLICATES = args.has('--duplicates');
const CSV = args.has('--csv');

// ─── Load known tags ────────────────────────────────────────────────
const tagsConfig = JSON.parse(fs.readFileSync(TAGS_JSON, 'utf-8'));
const knownTags = new Set(Object.keys(tagsConfig.tags));

// ─── Walk content/blog ──────────────────────────────────────────────
function findFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) findFiles(fullPath, out);
    else if (/\.mdx?$/.test(entry.name)) out.push(fullPath);
  }
  return out;
}

// ─── Extract tags from frontmatter ──────────────────────────────────
// Handles single-line array form: tags: ["a", "b", 'c']
function extractTags(content) {
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return [];
  const m = fm[1].match(/^tags:\s*(\[[^\]]*\])\s*$/m);
  if (!m) return [];
  try {
    return JSON.parse(m[1].replace(/'/g, '"')).map((s) => String(s));
  } catch {
    return [];
  }
}

// Normalize for duplicate detection: lower-case + collapse spaces/underscores to hyphens
function normalize(tag) {
  return tag.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ─── Walk + accumulate ──────────────────────────────────────────────
const tagMap = new Map(); // tag -> { count, files: string[] }
let totalPosts = 0;
let postsWithTags = 0;

for (const file of findFiles(BLOG_DIR)) {
  totalPosts++;
  const content = fs.readFileSync(file, 'utf-8');
  const tags = extractTags(content);
  if (tags.length > 0) postsWithTags++;
  const relPath = path.relative(BLOG_DIR, file);
  for (const tag of tags) {
    if (!tagMap.has(tag)) tagMap.set(tag, { count: 0, files: [] });
    const entry = tagMap.get(tag);
    entry.count++;
    if (entry.files.length < 3) entry.files.push(relPath);
  }
}

// Group by normalized form to surface duplicates
const groups = new Map(); // normalized -> [tag, ...]
for (const tag of tagMap.keys()) {
  const key = normalize(tag);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(tag);
}
const duplicateGroups = [...groups.values()].filter((variants) => variants.length > 1);

const sorted = [...tagMap.entries()].sort((a, b) => b[1].count - a[1].count);

// ─── CSV output ─────────────────────────────────────────────────────
if (CSV) {
  console.log('tag,count,known,duplicate_of');
  for (const [tag, { count }] of sorted) {
    const variants = groups.get(normalize(tag));
    const dupOf = variants.length > 1 ? variants.filter((v) => v !== tag).join('|') : '';
    console.log(`"${tag}",${count},${knownTags.has(tag) ? 1 : 0},"${dupOf}"`);
  }
  process.exit(0);
}

// ─── Pretty output ──────────────────────────────────────────────────
const unknownCount = [...tagMap.keys()].filter((t) => !knownTags.has(t)).length;

console.log('\n=== Tag Audit ===\n');
console.log(`Posts scanned:     ${totalPosts}`);
console.log(`Posts with tags:   ${postsWithTags}`);
console.log(`Distinct tags:     ${tagMap.size}`);
console.log(`Registered:        ${tagMap.size - unknownCount} (in tags.json)`);
console.log(`Unknown:           ${unknownCount}`);
console.log(`Duplicate groups:  ${duplicateGroups.length}\n`);

if (!ONLY_UNKNOWN && !ONLY_DUPLICATES) {
  console.log('--- All Tags (✓ = registered, ? = unknown) ---\n');
  for (const [tag, { count }] of sorted) {
    const mark = knownTags.has(tag) ? '✓' : '?';
    const variants = groups.get(normalize(tag));
    const dupFlag =
      variants.length > 1
        ? `  [variants: ${variants.filter((v) => v !== tag).map((v) => `"${v}"`).join(', ')}]`
        : '';
    console.log(`  ${mark}  ${String(count).padStart(4)}  ${tag}${dupFlag}`);
  }
  console.log('');
}

if (!ONLY_UNKNOWN && duplicateGroups.length > 0) {
  console.log('--- Likely Duplicate Variants (same normalized form) ---\n');
  console.log('These probably want to be merged into a single canonical tag.\n');
  for (const variants of duplicateGroups) {
    const summary = variants
      .map((v) => `"${v}" (${tagMap.get(v).count})`)
      .join('  ·  ');
    console.log(`  → ${summary}`);
  }
  console.log('');
}

if (!ONLY_DUPLICATES) {
  const unknown = sorted.filter(([t]) => !knownTags.has(t));
  if (unknown.length > 0) {
    console.log(`--- Unknown Tags (not in tags.json) — ${unknown.length} total ---\n`);
    console.log('Decide for each: register it in tags.json, rename to an existing tag, or drop.\n');
    for (const [tag, { count, files }] of unknown) {
      console.log(`  ${String(count).padStart(4)}  ${tag}`);
      for (const f of files) console.log(`           ${f}`);
    }
    console.log('');
  }
}
