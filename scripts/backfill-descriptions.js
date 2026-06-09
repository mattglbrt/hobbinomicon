#!/usr/bin/env node

/**
 * Backfill empty blog descriptions from the post's transcript.
 *
 * Some synced vlogs have an empty `description: ""` (the YouTube video had no
 * description), which produces an empty <meta name="description"> and an empty
 * search excerpt. This derives a ~160-char excerpt from the transcript (or the
 * "About This Video" section) and writes it into the frontmatter.
 *
 * Idempotent: only touches posts whose description is empty, and skips any post
 * with no usable body text.
 *
 *   node scripts/backfill-descriptions.js            # apply
 *   node scripts/backfill-descriptions.js --dry-run  # preview only
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const DRY_RUN = process.argv.includes('--dry-run');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.mdx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

// Pull the prose body (after frontmatter), stripping imports, JSX components,
// markdown headings, and links — then return a clean ~160-char excerpt.
function deriveExcerpt(body) {
  const text = body
    .replace(/^import\s.+$/gm, '')
    .replace(/<[^>]+>/g, ' ')            // JSX/HTML tags
    .replace(/^#{1,6}\s.*$/gm, '')        // markdown headings (## Transcript etc.)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return '';
  if (text.length <= 160) return text;
  const truncated = text.slice(0, 160);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace > 0 ? lastSpace : 160) + '…';
}

let filled = 0, skipped = 0, noBody = 0;

for (const file of walk(BLOG_DIR)) {
  const content = fs.readFileSync(file, 'utf-8');
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { skipped++; continue; }

  // Only act on an empty description.
  if (!/^description:\s*""\s*$/m.test(fm[1])) { skipped++; continue; }

  const body = content.slice(fm[0].length);
  const excerpt = deriveExcerpt(body);
  if (!excerpt) {
    console.warn(`  ! no usable body text: ${path.relative(BLOG_DIR, file)}`);
    noBody++;
    continue;
  }

  const escaped = excerpt.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const newContent = content.replace(/^description:\s*""\s*$/m, `description: "${escaped}"`);

  console.log(`  + ${path.relative(BLOG_DIR, file)}`);
  console.log(`      "${excerpt}"`);
  if (!DRY_RUN) fs.writeFileSync(file, newContent, 'utf-8');
  filled++;
}

console.log('\n---');
console.log(`${DRY_RUN ? 'Would fill' : 'Filled'}: ${filled}`);
console.log(`No usable body: ${noBody}`);
console.log(`Skipped (has description / no frontmatter): ${skipped}`);
if (DRY_RUN && filled) console.log('\nDry run only. Re-run without --dry-run to write.');
