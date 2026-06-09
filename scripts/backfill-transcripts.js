#!/usr/bin/env node

/**
 * Backfill transcripts for vlogs that were synced before their captions existed.
 *
 * YouTube's auto-generated (ASR) captions are usually NOT ready in the first
 * hours after an upload. sync-vlogs.js fetches the transcript once, at first
 * sight of a video, and records the video in .sync-log.json — so a video synced
 * before its captions were generated never gets a transcript, even after YouTube
 * produces one later. This script closes that gap: it re-attempts the transcript
 * fetch for any vlog missing a `## Transcript` section and appends it when one is
 * now available.
 *
 * By default it only looks at recently-published vlogs (BACKFILL_WINDOW_DAYS,
 * default 21) — that is the window in which late captions actually appear, and
 * it keeps the per-build API call count small so YouTube doesn't rate-limit the
 * build IP. Pass --all to scan every vlog (use for a one-time backfill).
 *
 *   node scripts/backfill-transcripts.js            # recent vlogs only
 *   node scripts/backfill-transcripts.js --all      # every vlog
 *
 * Idempotent and build-safe: a vlog that already has a transcript is skipped,
 * and any unexpected error is logged without failing the build.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatTranscriptParagraphs } from './lib/format-transcript.js';
import { getTranscript } from './lib/fetch-transcript.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VLOGS_DIR = path.join(__dirname, '../src/content/blog/vlogs');

const SCAN_ALL = process.argv.includes('--all');
const WINDOW_DAYS = Number(process.env.BACKFILL_WINDOW_DAYS) || 21;
const WINDOW_MS = WINDOW_DAYS * 24 * 60 * 60 * 1000;

function readField(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  if (!match) return null;
  return match[1].trim().replace(/^["']|["']$/g, '');
}

async function main() {
  const cutoff = Date.now() - WINDOW_MS;
  let backfilled = 0;
  let stillMissing = 0;
  let skipped = 0;
  const attempts = [];

  for (const name of fs.readdirSync(VLOGS_DIR)) {
    if (!name.endsWith('.mdx') && !name.endsWith('.md')) continue;

    const filePath = path.join(VLOGS_DIR, name);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Already has a transcript — leave it alone.
    if (content.includes('\n## Transcript\n')) {
      skipped++;
      continue;
    }

    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) {
      skipped++;
      continue;
    }
    const frontmatter = fmMatch[1];

    const youtubeId = readField(frontmatter, 'youtubeId');
    if (!youtubeId) {
      skipped++;
      continue;
    }

    // Default mode: only re-check vlogs published inside the late-caption window.
    if (!SCAN_ALL) {
      const pubDate = readField(frontmatter, 'pubDate');
      const pubMs = pubDate ? Date.parse(pubDate) : NaN;
      if (Number.isNaN(pubMs) || pubMs < cutoff) {
        skipped++;
        continue;
      }
    }

    attempts.push({ name, filePath, content, youtubeId });
  }

  if (attempts.length === 0) {
    console.log('No transcript-less vlogs in scope. Nothing to backfill.');
    return;
  }

  console.log(
    `Re-checking ${attempts.length} transcript-less vlog(s)` +
      (SCAN_ALL ? ' (all)' : ` published in the last ${WINDOW_DAYS} days`) +
      '...\n'
  );

  for (const { name, filePath, content, youtubeId } of attempts) {
    const transcript = await getTranscript(youtubeId);

    if (transcript) {
      const section = `\n## Transcript\n\n${formatTranscriptParagraphs(transcript)}\n`;
      fs.writeFileSync(filePath, `${content.replace(/\s+$/, '')}\n${section}`, 'utf-8');
      console.log(`  + ${name} (${youtubeId}) — transcript added`);
      backfilled++;
    } else {
      console.log(`  · ${name} (${youtubeId}) — still no captions`);
      stillMissing++;
    }

    // Be gentle with YouTube — avoid tripping rate limits on the build IP.
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n---');
  console.log(`Backfilled: ${backfilled}`);
  console.log(`Still no captions: ${stillMissing}`);
  console.log(`Skipped (already have transcript / out of window): ${skipped}`);
}

main().catch(error => {
  // Never fail the build on a backfill error — log and move on.
  console.warn('Transcript backfill did not complete:', error.message);
});
