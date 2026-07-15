/**
 * Full backup of every uploaded video's snippet (title, description, tags,
 * categoryId, publishedAt) before any description edits.
 * Read-only: uses YOUTUBE_API_KEY, no OAuth required.
 *
 * Usage: node scripts/backup-descriptions.cjs
 * Writes: scripts/backups/descriptions-backup-<ISO-date>.json
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const yt = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });
const BACKUP_DIR = path.join(__dirname, 'backups');

async function main() {
  const ch = await yt.channels.list({
    part: 'contentDetails',
    id: process.env.YOUTUBE_CHANNEL_ID,
  });
  const uploads = ch.data.items[0].contentDetails.relatedPlaylists.uploads;

  // Collect all video ids from the uploads playlist.
  const ids = [];
  let pageToken;
  do {
    const r = await yt.playlistItems.list({
      part: 'contentDetails',
      playlistId: uploads,
      maxResults: 50,
      pageToken,
    });
    for (const it of r.data.items) ids.push(it.contentDetails.videoId);
    pageToken = r.data.nextPageToken;
  } while (pageToken);

  // Fetch full snippets in batches of 50.
  const videos = [];
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const r = await yt.videos.list({ part: 'snippet', id: batch.join(',') });
    for (const v of r.data.items) {
      videos.push({
        id: v.id,
        title: v.snippet.title,
        description: v.snippet.description,
        tags: v.snippet.tags || [],
        categoryId: v.snippet.categoryId,
        publishedAt: v.snippet.publishedAt,
      });
    }
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const out = path.join(BACKUP_DIR, `descriptions-backup-${stamp}.json`);
  fs.writeFileSync(
    out,
    JSON.stringify({ backedUpAt: new Date().toISOString(), count: videos.length, videos }, null, 2),
  );
  console.log(`Backed up ${videos.length} video snippets -> ${out}`);
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
