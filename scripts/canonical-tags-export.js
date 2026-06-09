#!/usr/bin/env node

/**
 * Export the 74 canonical tags from src/data/tags.json to a cheat-sheet CSV,
 * grouped by category — a reference for the target vocabulary while editing
 * the suggested_tags column of post-tags.csv.
 *
 * Columns: category, tag, display, description
 *
 *   node scripts/canonical-tags-export.js     # writes canonical-tags.csv
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TAGS_JSON = path.join(__dirname, '../src/data/tags.json');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, '../canonical-tags.csv'));

const data = JSON.parse(fs.readFileSync(TAGS_JSON, 'utf-8'));
const catOrder = Object.keys(data.categories);

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const rows = Object.entries(data.tags)
  .map(([tag, v]) => ({
    category: data.categories[v.category]?.display || v.category || '',
    catKey: v.category || '',
    tag,
    display: v.display || '',
    description: v.description || '',
  }))
  .sort(
    (a, b) =>
      (catOrder.indexOf(a.catKey) - catOrder.indexOf(b.catKey)) ||
      a.tag.localeCompare(b.tag)
  );

const header = ['category', 'tag', 'display', 'description'];
const lines = [header.join(',')];
for (const r of rows) lines.push(header.map(k => csvCell(r[k])).join(','));

fs.writeFileSync(OUT, lines.join('\n') + '\n', 'utf-8');
console.log(`Wrote ${rows.length} canonical tags to ${OUT}`);
