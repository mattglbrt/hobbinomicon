/**
 * Dump all channel uploads (id, title, viewCount, publishedAt) to a JSON file.
 * Read-only: uses the YOUTUBE_API_KEY, no OAuth required.
 *
 * Usage: node scripts/dump-uploads.cjs [outPath]
 */
require('dotenv').config();
const fs = require('fs');
const { google } = require('googleapis');

const OUT = process.argv[2] || 'scripts/.uploads.json';
const yt = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

async function main() {
  const ch = await yt.channels.list({
    part: 'contentDetails',
    id: process.env.YOUTUBE_CHANNEL_ID,
  });
  const uploads = ch.data.items[0].contentDetails.relatedPlaylists.uploads;

  // 1) Walk the uploads playlist for every video id + title.
  const items = [];
  let pageToken;
  do {
    const r = await yt.playlistItems.list({
      part: 'snippet,contentDetails',
      playlistId: uploads,
      maxResults: 50,
      pageToken,
    });
    for (const it of r.data.items) {
      items.push({
        id: it.contentDetails.videoId,
        title: it.snippet.title,
        publishedAt: it.contentDetails.videoPublishedAt || it.snippet.publishedAt,
      });
    }
    pageToken = r.data.nextPageToken;
  } while (pageToken);

  // 2) Batch videos.list (50 at a time) for view counts.
  const byId = new Map(items.map((v) => [v.id, v]));
  for (let i = 0; i < items.length; i += 50) {
    const batch = items.slice(i, i + 50).map((v) => v.id);
    const r = await yt.videos.list({ part: 'statistics', id: batch.join(',') });
    for (const v of r.data.items) {
      byId.get(v.id).viewCount = Number(v.statistics.viewCount || 0);
    }
  }

  const out = [...byId.values()].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`Wrote ${out.length} videos to ${OUT}`);
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
