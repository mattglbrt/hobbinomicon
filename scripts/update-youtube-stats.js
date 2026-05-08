#!/usr/bin/env node
/**
 * Refresh src/data/youtube-stats.json with the current video count for the
 * @Hobbinomicon channel. Run manually with:
 *   npm run update-youtube-stats
 *
 * Reads YOUTUBE_API_KEY (and optionally YOUTUBE_CHANNEL_ID) from .env via
 * dotenv, same pattern as scripts/sync-vlogs.js. Uses the YouTube Data API v3
 * channels.list endpoint — only needs a public API key, no OAuth.
 */
import dotenv from 'dotenv';
dotenv.config();

import { google } from 'googleapis';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATS_PATH = path.resolve(__dirname, '../src/data/youtube-stats.json');
const HANDLE = '@Hobbinomicon';

const apiKey = process.env.YOUTUBE_API_KEY;
const channelId = process.env.YOUTUBE_CHANNEL_ID;

if (!apiKey) {
  console.error('Missing YOUTUBE_API_KEY (set it in .env).');
  process.exit(1);
}

const youtube = google.youtube({ version: 'v3', auth: apiKey });

const params = channelId
  ? { part: ['statistics'], id: [channelId] }
  : { part: ['statistics'], forHandle: HANDLE };

const res = await youtube.channels.list(params);

const channel = res.data.items?.[0];
if (!channel) {
  console.error(`Channel not found (id=${channelId || ''} handle=${HANDLE}).`);
  process.exit(1);
}

const videoCount = parseInt(channel.statistics.videoCount, 10);
if (!Number.isFinite(videoCount)) {
  console.error('Could not parse videoCount from API response.');
  process.exit(1);
}

const data = {
  videoCount,
  fetchedAt: new Date().toISOString(),
};

fs.writeFileSync(STATS_PATH, JSON.stringify(data, null, 2) + '\n');
console.log(`Updated YouTube stats: ${videoCount} videos at ${data.fetchedAt}`);
