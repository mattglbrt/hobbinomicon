#!/usr/bin/env node

/**
 * Apply scripts/transcript-normalize.json to transcripts already on disk.
 *
 * New vlogs get normalized at fetch time (lib/fetch-transcript.js), but the
 * posts synced before the dictionary existed still carry the raw manglings.
 * Run this after adding entries to the dictionary to sweep the back catalogue.
 *
 *   node scripts/normalize-transcripts.js --dry-run   # report only
 *   node scripts/normalize-transcripts.js             # apply
 *
 * Only the `## Transcript` section is touched. Frontmatter and any authored
 * prose above it are left exactly as they are — hand-written words are not the
 * ASR's fault and are not this script's business.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeTranscript, findCorrections } from './lib/normalize-transcript.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VLOGS_DIR = path.join(__dirname, '../src/content/blog/vlogs');
const DRY_RUN = process.argv.includes('--dry-run');

const MARKER = '\n## Transcript\n';

let changed = 0;
let scanned = 0;
const totals = new Map();

for (const name of fs.readdirSync(VLOGS_DIR).sort()) {
  if (!/\.mdx?$/.test(name)) continue;
  const filePath = path.join(VLOGS_DIR, name);
  const content = fs.readFileSync(filePath, 'utf-8');

  const at = content.indexOf(MARKER);
  if (at === -1) continue;
  scanned++;

  const head = content.slice(0, at + MARKER.length);
  const transcript = content.slice(at + MARKER.length);

  const hits = findCorrections(transcript);
  if (hits.length === 0) continue;

  const fixed = normalizeTranscript(transcript);
  if (fixed === transcript) continue;

  console.log(`  ${name}`);
  for (const { correct, count, sample } of hits) {
    console.log(`      ${sample} -> ${correct}${count > 1 ? ` (${count}x)` : ''}`);
    totals.set(correct, (totals.get(correct) || 0) + count);
  }

  if (!DRY_RUN) fs.writeFileSync(filePath, head + fixed, 'utf-8');
  changed++;
}

console.log('\n---');
console.log(`Transcripts scanned : ${scanned}`);
console.log(`Files ${DRY_RUN ? 'that would change' : 'changed'} : ${changed}`);
if (totals.size > 0) {
  console.log('Corrections by term :');
  for (const [term, count] of [...totals].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${count.toString().padStart(4)}  ${term}`);
  }
}
if (DRY_RUN && changed > 0) console.log('\nDry run — nothing written. Re-run without --dry-run to apply.');
