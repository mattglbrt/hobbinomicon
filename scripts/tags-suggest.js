#!/usr/bin/env node

/**
 * Regenerate post-tags.csv with a `suggested_tags` column.
 *
 * suggested_tags = each post's current tags run through
 * scripts/tag-normalize.json (merge variants → canonical, drop noise) and
 * deduplicated, preserving order. It is only a cleaned starting point — edit
 * the suggested_tags column per post, then hand the CSV back to apply.
 *
 * Columns: id, category, pubDate, title, tags, suggested_tags
 *   - Edit suggested_tags only. Empty = no tags. Don't touch id.
 *
 *   node scripts/tags-suggest.js              # writes post-tags.csv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const NORMALIZE = path.join(__dirname, 'tag-normalize.json');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, '../post-tags.csv'));

const rawMap = JSON.parse(fs.readFileSync(NORMALIZE, 'utf-8'));
const map = Object.fromEntries(Object.entries(rawMap).filter(([k]) => !k.startsWith('_')));

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.mdx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

function frontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  try {
    return parseYaml(m[1]) || {};
  } catch {
    return {};
  }
}

function normalize(tags) {
  const seen = new Set();
  const out = [];
  for (const tag of tags) {
    if (!(tag in map)) {
      if (!seen.has(tag)) { seen.add(tag); out.push(tag); }
      continue;
    }
    const mapped = map[tag];
    if (mapped == null) continue; // dropped
    if (!seen.has(mapped)) { seen.add(mapped); out.push(mapped); }
  }
  return out;
}

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const rows = walk(BLOG_DIR)
  .map(file => {
    const fm = frontmatter(fs.readFileSync(file, 'utf-8'));
    const tags = Array.isArray(fm.tags) ? fm.tags : [];
    return {
      id: path.relative(BLOG_DIR, file),
      category: fm.category || '',
      pubDate: fm.pubDate ? new Date(fm.pubDate).toISOString().slice(0, 10) : '',
      title: fm.title || '',
      tags: tags.join(', '),
      suggested_tags: normalize(tags).join(', '),
    };
  })
  .sort((a, b) => a.category.localeCompare(b.category) || a.id.localeCompare(b.id));

const header = ['id', 'category', 'pubDate', 'title', 'tags', 'suggested_tags'];
const lines = [header.join(',')];
for (const r of rows) lines.push(header.map(k => csvCell(r[k])).join(','));

fs.writeFileSync(OUT, lines.join('\n') + '\n', 'utf-8');

const changed = rows.filter(r => r.tags !== r.suggested_tags).length;
console.log(`Wrote ${rows.length} posts to ${OUT}`);
console.log(`suggested_tags differs from current on ${changed} posts`);
