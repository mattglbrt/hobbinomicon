#!/usr/bin/env node

/**
 * One-time migration: reformat existing vlog transcripts into paragraphs.
 *
 * Older vlogs were generated with the whole transcript as a single wall of
 * text. This rewrites the `## Transcript` section of each MDX file into
 * blank-line-separated paragraphs (matching the new sync-vlogs.js output).
 *
 * Idempotent: a transcript that already contains paragraph breaks is skipped,
 * so it is safe to re-run.
 *
 *   node scripts/format-transcripts.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatTranscriptParagraphs } from './lib/format-transcript.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// The blog collection split into `vlog` and `guides` in the 2026-08
// re-architecture. Both hold tagged content with transcripts, so anything that
// walks one has to walk both or it silently covers half the corpus.
const CONTENT_DIRS = [
  path.join(__dirname, '../src/content/vlog'),
  path.join(__dirname, '../src/content/guides'),
].filter(fs.existsSync);
const VLOGS_DIR = CONTENT_DIRS[0];

const MARKER = '\n## Transcript\n';

let reformatted = 0;
let skipped = 0;
let noTranscript = 0;

// Walk full paths, not bare names: the files come from two collections now,
// so joining every name back onto one directory would miss half of them.
const allFiles = CONTENT_DIRS.flatMap((dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? fs.readdirSync(path.join(dir, e.name)).map((n) => path.join(dir, e.name, n))
      : [path.join(dir, e.name)]
  )
).sort();

for (const filePath of allFiles) {
  const name = path.basename(filePath);
  if (!name.endsWith('.mdx') && !name.endsWith('.md')) continue;
  const content = fs.readFileSync(filePath, 'utf-8');

  const markerIndex = content.lastIndexOf(MARKER);
  if (markerIndex === -1) {
    noTranscript++;
    continue;
  }

  const head = content.slice(0, markerIndex + MARKER.length);
  const body = content.slice(markerIndex + MARKER.length);
  const trimmedBody = body.trim();

  // Already split into paragraphs (or empty) — leave it alone.
  if (!trimmedBody || trimmedBody.includes('\n\n')) {
    skipped++;
    continue;
  }

  const formatted = formatTranscriptParagraphs(trimmedBody);
  if (formatted === trimmedBody) {
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, `${head}\n${formatted}\n`, 'utf-8');
  reformatted++;
}

console.log(`Reformatted: ${reformatted}`);
console.log(`Skipped (already split / empty): ${skipped}`);
console.log(`No transcript section: ${noTranscript}`);
