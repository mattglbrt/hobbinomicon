#!/usr/bin/env node

/**
 * Sync YouTube channel videos to blog posts
 * - Fetches videos via YouTube Data API v3 (native fetch)
 * - Downloads transcripts via youtube-transcript-plus
 * - Prompts for tags per video (keywords only suggest — see lib/prompt-tags.js)
 * - Downloads YouTube thumbnails as featured images
 * - Outputs MDX files to src/content/blog/vlogs/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { formatTranscriptParagraphs } from './lib/format-transcript.js';
import { getTranscriptResult, reportBlocked } from './lib/fetch-transcript.js';
import { excerptFromDescription, excerptFromTranscript } from './lib/excerpt.js';
import { createTagPrompter } from './lib/prompt-tags.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../src/content/blog');
const VLOGS_DIR = path.join(CONTENT_DIR, 'vlogs');
const HERO_CACHE_DIR = path.join(__dirname, '../src/assets/images/hero-cache');
const TAG_KEYWORDS_PATH = path.join(__dirname, '../src/data/tag-keywords.json');
const TAG_REGISTRY_PATH = path.join(__dirname, '../src/data/tags.json');
const REDIRECTS_PATH = path.join(__dirname, '../public/_redirects');
const SYNC_LOG_PATH = path.join(__dirname, '.sync-log.json');

// Tags are chosen by hand at sync time. Prompting needs a real terminal, so a
// build server (or --no-prompt) creates the post untagged rather than blocking
// or guessing — see lib/prompt-tags.js for why guessing is the worse option.
const NO_PROMPT = process.argv.includes('--no-prompt');
const INTERACTIVE = Boolean(process.stdin.isTTY && process.stdout.isTTY) && !NO_PROMPT;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// Ensure directories exist
fs.mkdirSync(VLOGS_DIR, { recursive: true });
fs.mkdirSync(HERO_CACHE_DIR, { recursive: true });

// Load tag keywords
let tagKeywords = {};
try {
  const data = JSON.parse(fs.readFileSync(TAG_KEYWORDS_PATH, 'utf-8'));
  tagKeywords = data.keywords || {};
} catch {
  console.warn('Warning: Could not load tag-keywords.json, auto-tagging disabled');
}

// ─── YouTube API ───────────────────────────────────────────────

async function youtubeApiRequest(endpoint, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  url.searchParams.set('key', YOUTUBE_API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`YouTube API Error: ${JSON.stringify(error)}`);
  }
  return response.json();
}

async function getUploadsPlaylistId(channelId) {
  const data = await youtubeApiRequest('channels', {
    part: 'contentDetails',
    id: channelId,
  });
  if (!data.items?.length) throw new Error(`Channel not found: ${channelId}`);
  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

async function getPlaylistVideos(playlistId) {
  const videos = [];
  let pageToken = null;

  do {
    const params = { part: 'snippet', playlistId, maxResults: '50' };
    if (pageToken) params.pageToken = pageToken;

    const data = await youtubeApiRequest('playlistItems', params);

    for (const item of data.items) {
      videos.push({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
      });
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  return videos;
}

// ─── Tag Suggestions ───────────────────────────────────────────
// These are a starting point for the prompt, never the final answer. Nothing
// returned here reaches frontmatter without someone pressing Enter on it.

function suggestTags(text) {
  if (!text || Object.keys(tagKeywords).length === 0) return [];

  const normalizedText = text.toLowerCase();
  const tagScores = {};

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = normalizedText.match(regex);
      if (matches) score += matches.length;
    }
    if (score > 0) tagScores[tag] = score;
  }

  return Object.entries(tagScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([tag]) => tag);
}

// ─── Thumbnail Download ────────────────────────────────────────

async function downloadThumbnail(videoId) {
  const destPath = path.join(HERO_CACHE_DIR, `${videoId}.jpg`);

  // Skip if already downloaded
  if (fs.existsSync(destPath)) return true;

  // Try maxresdefault first, fall back to hqdefault
  for (const quality of ['maxresdefault', 'hqdefault']) {
    const url = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());
        // maxresdefault returns a small placeholder if unavailable
        if (buffer.length > 5000) {
          fs.writeFileSync(destPath, buffer);
          return true;
        }
      }
    } catch {
      // Try next quality
    }
  }
  return false;
}

// ─── Existing Post Detection ───────────────────────────────────

function getExistingYouTubeIds() {
  const ids = new Set();

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const match = content.match(/^youtubeId:\s*"?([^"\n]+)"?/m);
        if (match) ids.add(match[1].trim());
      }
    }
  }

  scanDir(CONTENT_DIR);
  return ids;
}

// ─── MDX Generation ────────────────────────────────────────────

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// Every video now carries the standard footer appended by
// update-descriptions.cjs (the ――― delimiter and everything after it). It is
// our own boilerplate, so it must never become a post's meta description or
// "About This Video" body — strip it before either. Keep the delimiter in sync
// with DELIM in update-descriptions.cjs.
const FOOTER_DELIM = '―――';

function stripFooter(description) {
  if (!description) return '';
  const lines = description.split('\n');
  const i = lines.findIndex((l) => l.trim() === FOOTER_DELIM);
  return (i === -1 ? description : lines.slice(0, i).join('\n')).trim();
}

function generateMdx(video, transcript, tags, hasHeroImage) {
  const safeTitle = video.title.replace(/"/g, '\\"');
  // Fall back to a transcript-derived excerpt when the video has no
  // description, so the post never ships an empty meta description. The
  // transcript path skips leading throat-clearing — see lib/excerpt.js.
  const body = stripFooter(video.description);
  const excerpt = (excerptFromDescription(body) || excerptFromTranscript(transcript)).replace(
    /"/g,
    '\\"'
  );
  const tagsStr = JSON.stringify(tags);

  let content = `---
title: "${safeTitle}"
description: "${excerpt}"
pubDate: ${video.publishedAt}
category: "Vlogs"
youtubeId: "${video.id}"
tags: ${tagsStr}`;

  if (hasHeroImage) {
    content += `\nheroImage: "/images/hero-cache/${video.id}.jpg"`;
  }

  content += `\n---

import YouTubeEmbed from '../../../components/YouTubeEmbed.astro';

<YouTubeEmbed videoId="${video.id}" title="${safeTitle}" />
`;

  // Add description section
  if (body.length > 0) {
    content += `\n## About This Video\n\n${body}\n`;
  }

  // Add transcript section (split into readable paragraphs)
  if (transcript) {
    content += `\n## Transcript\n\n${formatTranscriptParagraphs(transcript)}\n`;
  }

  return content;
}

// ─── Sync Log ──────────────────────────────────────────────────

function loadSyncLog() {
  try {
    return JSON.parse(fs.readFileSync(SYNC_LOG_PATH, 'utf-8'));
  } catch {
    return { synced: {} };
  }
}

function saveSyncLog(log) {
  fs.writeFileSync(SYNC_LOG_PATH, JSON.stringify(log, null, 2), 'utf-8');
}

// ─── Main ──────────────────────────────────────────────────────

async function main() {
  console.log('Syncing YouTube videos to blog posts...\n');

  // Missing credentials must never break a deploy — skip the sync and let the
  // build proceed with whatever vlogs are already committed.
  if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
    console.warn('Skipping vlog sync: YOUTUBE_API_KEY / YOUTUBE_CHANNEL_ID not set. Using existing content.');
    return;
  }

  // Get existing YouTube IDs from blog posts
  const existingIds = getExistingYouTubeIds();
  console.log(`Found ${existingIds.size} existing posts with YouTube videos\n`);

  // Fetch channel videos. A feed failure (API down, quota, bad key) must not
  // break the build — warn and fall back to existing content.
  console.log('Fetching channel uploads...');
  let videos;
  try {
    const uploadsPlaylistId = await getUploadsPlaylistId(CHANNEL_ID);
    videos = await getPlaylistVideos(uploadsPlaylistId);
  } catch (error) {
    console.warn(`Skipping vlog sync: could not fetch channel feed (${error.message}). Using existing content.`);
    return;
  }
  console.log(`Found ${videos.length} total videos\n`);

  // Filter to new videos only
  const newVideos = videos.filter(v => !existingIds.has(v.id));

  if (newVideos.length === 0) {
    console.log('All videos already have blog posts!\n');
    return;
  }

  console.log(`${newVideos.length} new videos to sync:\n`);

  const prompter = createTagPrompter({
    registryPath: TAG_REGISTRY_PATH,
    redirectsPath: REDIRECTS_PATH,
    interactive: INTERACTIVE,
  });

  if (!INTERACTIVE) {
    console.log(
      NO_PROMPT
        ? 'Running with --no-prompt: new posts will be created untagged.\n'
        : 'No TTY, so tags cannot be prompted for: new posts will be created untagged.\n'
    );
  }

  const syncLog = loadSyncLog();
  let created = 0;
  let errors = 0;
  let blocked = 0;

  try {
    for (const video of newVideos) {
      try {
        console.log(`  ${video.title}`);

        // Fetch transcript
        const result = await getTranscriptResult(video.id);
        const transcript = result.text;
        if (result.status === 'ok') {
          console.log('    Transcript found');
        } else if (result.status === 'blocked') {
          blocked++;
          console.log('    Transcript BLOCKED (not missing) — this post will have no body');
        } else if (result.status === 'error') {
          console.log(`    Transcript fetch failed: ${result.reason}`);
        } else {
          console.log('    No captions on YouTube for this video');
        }

        // Tag. Footer stripped here too: it names games ("Kal Arath", "TSPN")
        // and would otherwise suggest whatever the footer happens to link to.
        const combinedText = [video.title, stripFooter(video.description), transcript || ''].join(' ');
        const tags = await prompter.promptForTags(video, suggestTags(combinedText));

        // Download thumbnail
        const hasHeroImage = await downloadThumbnail(video.id);
        console.log(hasHeroImage ? '    Thumbnail downloaded' : '    No thumbnail available');

        // Generate MDX
        const mdxContent = generateMdx(video, transcript, tags, hasHeroImage);

        // Write file (handle slug collisions)
        const slug = slugify(video.title);
        let filePath = path.join(VLOGS_DIR, `${slug}.mdx`);
        let counter = 1;
        while (fs.existsSync(filePath)) {
          filePath = path.join(VLOGS_DIR, `${slug}-${counter}.mdx`);
          counter++;
        }

        fs.writeFileSync(filePath, mdxContent);
        console.log(`    Created: ${path.basename(filePath)}\n`);

        // Update sync log
        syncLog.synced[video.id] = {
          title: video.title,
          filename: path.basename(filePath),
          syncedAt: new Date().toISOString(),
        };

        created++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`    Error: ${error.message}\n`);
        errors++;
      }
    }
  } finally {
    prompter.close();
  }

  saveSyncLog(syncLog);

  console.log('---');
  console.log(`Created: ${created} new blog posts`);
  if (errors > 0) console.log(`Errors: ${errors}`);

  if (prompter.untagged.length > 0) {
    console.log('');
    console.log(`${prompter.untagged.length} post(s) have NO tags:`);
    for (const title of prompter.untagged) console.log(`  - ${title}`);
    console.log('Add tags by hand in src/content/blog/vlogs/, or re-run the sync');
    console.log('in a terminal after deleting the file.');
  }

  reportBlocked(blocked, 'npm run sync-vlogs');
}

main().catch(error => {
  // Never fail the build on an unexpected sync error — log and continue with
  // whatever content is already committed.
  console.warn('Vlog sync did not complete:', error.message);
});
