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
const VLOGS_DIR = path.join(__dirname, '../src/content/blog/vlogs');

const MARKER = '\n## Transcript\n';

let reformatted = 0;
let skipped = 0;
let noTranscript = 0;

for (const name of fs.readdirSync(VLOGS_DIR)) {
  if (!name.endsWith('.mdx') && !name.endsWith('.md')) continue;

  const filePath = path.join(VLOGS_DIR, name);
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
