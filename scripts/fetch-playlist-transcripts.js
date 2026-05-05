#!/usr/bin/env node

/**
 * Fetch transcripts for every video in a YouTube playlist.
 *
 * Usage:
 *   npm run fetch-playlist -- <playlist-url-or-id>
 *   npm run fetch-playlist -- <playlist-url-or-id> --limit 10
 *   npm run fetch-playlist -- <playlist-url-or-id> --out <dir>
 *
 * Default output: ~/Documents/dev/greek/transcripts/<playlist-id>/<title-slug>.json
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchTranscript } from 'youtube-transcript-plus';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUTPUT_ROOT = path.join(os.homedir(), 'Documents/dev/greek/transcripts');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

function parsePlaylistId(input) {
  if (!input) return null;
  if (input.startsWith('PL') || input.startsWith('UU') || input.startsWith('FL') || input.startsWith('OL')) {
    return input;
  }
  try {
    const url = new URL(input);
    const listParam = url.searchParams.get('list');
    if (listParam) return listParam;
  } catch {
    // not a URL
  }
  return null;
}

function parseArgs(argv) {
  const args = { playlist: null, limit: null, out: DEFAULT_OUTPUT_ROOT };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--limit') {
      args.limit = parseInt(argv[++i], 10);
    } else if (a === '--out') {
      args.out = argv[++i];
    } else if (!args.playlist) {
      args.playlist = a;
    }
  }
  return args;
}

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

async function getPlaylistMeta(playlistId) {
  const data = await youtubeApiRequest('playlists', {
    part: 'snippet',
    id: playlistId,
  });
  if (!data.items?.length) throw new Error(`Playlist not found: ${playlistId}`);
  return {
    title: data.items[0].snippet.title,
    channelTitle: data.items[0].snippet.channelTitle,
  };
}

async function getPlaylistVideos(playlistId, limit) {
  const videos = [];
  let pageToken = null;

  do {
    const params = { part: 'snippet', playlistId, maxResults: '50' };
    if (pageToken) params.pageToken = pageToken;

    const data = await youtubeApiRequest('playlistItems', params);

    for (const item of data.items) {
      if (item.snippet.resourceId?.kind !== 'youtube#video') continue;
      videos.push({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
        position: item.snippet.position,
      });
      if (limit && videos.length >= limit) return videos;
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  return videos;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function getExistingVideoIds(dir) {
  const ids = new Set();
  if (!fs.existsSync(dir)) return ids;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.json')) continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf-8'));
      if (data.videoId) ids.add(data.videoId);
    } catch {
      // ignore unreadable files
    }
  }
  return ids;
}

async function getTranscript(videoId) {
  try {
    const raw = await fetchTranscript(videoId);
    if (!raw || raw.length === 0) return null;

    const segments = raw.map(item => ({
      text: (item.text || item.content || item.snippet || '')
        .replace(/&amp;#39;/g, "'")
        .replace(/&amp;quot;/g, '"')
        .replace(/&amp;gt;/g, '>')
        .replace(/&amp;lt;/g, '<')
        .replace(/&amp;amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&'),
      offset: item.offset ?? item.start ?? null,
      duration: item.duration ?? null,
    }));

    const fullText = segments
      .map(s => s.text)
      .join(' ')
      .replace(/\[Music\]/gi, '')
      .replace(/\[Applause\]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return { fullText, segments };
  } catch (err) {
    return { error: err.message };
  }
}

async function main() {
  if (!YOUTUBE_API_KEY) {
    console.error('Error: YOUTUBE_API_KEY not set in .env');
    process.exit(1);
  }

  const { playlist: playlistInput, limit, out } = parseArgs(process.argv.slice(2));
  if (!playlistInput) {
    console.error('Usage: npm run fetch-playlist -- <playlist-url-or-id> [--limit N] [--out <dir>]');
    process.exit(1);
  }

  const playlistId = parsePlaylistId(playlistInput);
  if (!playlistId) {
    console.error(`Could not parse playlist ID from: ${playlistInput}`);
    process.exit(1);
  }

  const outputDir = path.join(out, playlistId);
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`Fetching playlist ${playlistId}...`);
  const meta = await getPlaylistMeta(playlistId);
  console.log(`  "${meta.title}" by ${meta.channelTitle}\n`);

  const videos = await getPlaylistVideos(playlistId, limit);
  console.log(`Found ${videos.length} videos${limit ? ` (limit ${limit})` : ''}\n`);

  const existingIds = getExistingVideoIds(outputDir);

  let fetched = 0;
  let skipped = 0;
  let missing = 0;
  let errors = 0;

  for (const video of videos) {
    if (existingIds.has(video.id)) {
      skipped++;
      continue;
    }

    console.log(`  [${video.position + 1}] ${video.title}`);

    const transcript = await getTranscript(video.id);
    if (!transcript) {
      console.log('    No transcript available');
      missing++;
    } else if (transcript.error) {
      console.log(`    Error: ${transcript.error}`);
      errors++;
    } else {
      console.log(`    Transcript: ${transcript.segments.length} segments, ${transcript.fullText.length} chars`);
      fetched++;
    }

    const record = {
      videoId: video.id,
      title: video.title,
      description: video.description,
      publishedAt: video.publishedAt,
      channelTitle: video.channelTitle,
      playlistId,
      playlistTitle: meta.title,
      url: `https://www.youtube.com/watch?v=${video.id}&list=${playlistId}`,
      transcript: transcript && !transcript.error ? transcript.fullText : null,
      transcriptSegments: transcript && !transcript.error ? transcript.segments : null,
      transcriptError: transcript?.error || (transcript ? null : 'unavailable'),
      fetchedAt: new Date().toISOString(),
    };

    const baseSlug = slugify(video.title) || video.id;
    let outPath = path.join(outputDir, `${baseSlug}.json`);
    let counter = 1;
    while (fs.existsSync(outPath)) {
      outPath = path.join(outputDir, `${baseSlug}-${counter}.json`);
      counter++;
    }
    fs.writeFileSync(outPath, JSON.stringify(record, null, 2), 'utf-8');

    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n---');
  console.log(`Output:   ${path.relative(process.cwd(), outputDir)}`);
  console.log(`Fetched:  ${fetched}`);
  if (skipped) console.log(`Skipped:  ${skipped} (already on disk)`);
  if (missing) console.log(`Missing:  ${missing} (no captions)`);
  if (errors)  console.log(`Errors:   ${errors}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
