#!/usr/bin/env node

/**
 * Export every blog post's tags to a CSV for manual cleanup.
 *
 * Columns: id, category, pubDate, title, tags
 *  - `id` is the path relative to src/content/blog (e.g. vlogs/foo.mdx). It is
 *    the stable key used to map edits back to files — DO NOT edit it.
 *  - `tags` is a comma-separated list inside a quoted CSV cell. Edit this column
 *    only. An empty cell means "no tags".
 *
 * Re-run any time to regenerate from the current state of the posts.
 *
 *   node scripts/tags-export.js              # writes post-tags.csv
 *   node scripts/tags-export.js out.csv      # custom path
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, '../post-tags.csv'));

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

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const rows = walk(BLOG_DIR)
  .map(file => {
    const fm = frontmatter(fs.readFileSync(file, 'utf-8'));
    return {
      id: path.relative(BLOG_DIR, file),
      category: fm.category || '',
      pubDate: fm.pubDate ? new Date(fm.pubDate).toISOString().slice(0, 10) : '',
      title: fm.title || '',
      tags: Array.isArray(fm.tags) ? fm.tags.join(', ') : '',
    };
  })
  .sort((a, b) => a.category.localeCompare(b.category) || a.id.localeCompare(b.id));

const header = ['id', 'category', 'pubDate', 'title', 'tags'];
const lines = [header.join(',')];
for (const r of rows) {
  lines.push(header.map(k => csvCell(r[k])).join(','));
}

fs.writeFileSync(OUT, lines.join('\n') + '\n', 'utf-8');
console.log(`Wrote ${rows.length} posts to ${OUT}`);
