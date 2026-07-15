/**
 * Create YouTube playlists from a resolved plan and add videos in order.
 *
 * Reads scripts/.playlist-resolved.json (produced by match-plan.cjs).
 * Idempotent & resumable: reuses an existing playlist with the same title and
 * skips videos already present, so it's safe to re-run (e.g. after hitting the
 * daily quota).
 *
 * Requires OAuth (write scope). If you see "invalid_grant", re-auth first:
 *   node scripts/youtube-auth.cjs
 *
 * Usage:
 *   node scripts/create-playlists.cjs --dry-run     # preview, no writes
 *   node scripts/create-playlists.cjs               # create for real
 *   node scripts/create-playlists.cjs --only "Hobby Opinions"
 */
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const ROOT = path.join(__dirname, '..');
const TOKEN_PATH = path.join(ROOT, 'youtube_tokens.json');
const CREDENTIALS_DIR = path.join(ROOT, 'credentials');
const RESOLVED = path.join(ROOT, 'scripts/.playlist-resolved.json');
const LOG_PATH = path.join(ROOT, 'scripts/.playlists-created.json');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findCredentialsFile() {
  const dirs = [CREDENTIALS_DIR, ROOT];
  for (const d of dirs) {
    if (!fs.existsSync(d)) continue;
    const f = fs.readdirSync(d).find((x) => x.startsWith('client_secret') && x.endsWith('.json'));
    if (f) return path.join(d, f);
  }
  return null;
}

function getAuthClient() {
  if (!fs.existsSync(TOKEN_PATH)) {
    console.error('No tokens found. Run: node scripts/youtube-auth.cjs');
    process.exit(1);
  }
  const credentials = JSON.parse(fs.readFileSync(findCredentialsFile(), 'utf8'));
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  const { client_id, client_secret } = credentials.installed || credentials.web;
  const o = new google.auth.OAuth2(client_id, client_secret);
  o.setCredentials(tokens);
  o.on('tokens', (t) => {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify({ ...tokens, ...t }, null, 2));
    console.log('  (tokens refreshed and saved)');
  });
  return o;
}

async function listAllMyPlaylists(yt) {
  const map = new Map();
  let pageToken;
  do {
    const r = await yt.playlists.list({ part: 'snippet', mine: true, maxResults: 50, pageToken });
    for (const p of r.data.items) map.set(p.snippet.title, p.id);
    pageToken = r.data.nextPageToken;
  } while (pageToken);
  return map;
}

async function listPlaylistVideoIds(yt, playlistId) {
  const ids = new Set();
  let pageToken;
  do {
    const r = await yt.playlistItems.list({
      part: 'contentDetails',
      playlistId,
      maxResults: 50,
      pageToken,
    });
    for (const it of r.data.items) ids.add(it.contentDetails.videoId);
    pageToken = r.data.nextPageToken;
  } while (pageToken);
  return ids;
}

function isQuotaError(e) {
  const reason = e?.errors?.[0]?.reason || '';
  return reason === 'quotaExceeded' || reason === 'dailyLimitExceeded';
}

// Newly created playlists take a moment to propagate; the first insert can
// 404 ("playlist cannot be found") or transiently 5xx. Retry with backoff.
async function withRetry(fn, label) {
  const transient = ['playlistNotFound', 'backendError', 'internalError', 'SERVICE_UNAVAILABLE'];
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (isQuotaError(e)) throw e;
      const reason = e?.errors?.[0]?.reason || '';
      const retryable =
        transient.includes(reason) ||
        /cannot be found/i.test(e.message) ||
        e.code === 409 ||
        (e.code >= 500 && e.code < 600);
      if (!retryable || attempt === 6) throw e;
      const wait = Math.min(8000, 1000 * 2 ** (attempt - 1));
      console.log(`  … ${label}: ${reason || e.message} — retry ${attempt} in ${wait}ms`);
      await sleep(wait);
    }
  }
}

async function main() {
  const plan = JSON.parse(fs.readFileSync(RESOLVED, 'utf8'));
  const privacy = plan.privacy || 'public';

  // Dry-run previews from the resolved file alone — no auth needed.
  const yt = DRY_RUN ? null : google.youtube({ version: 'v3', auth: getAuthClient() });

  let existing = new Map();
  if (!DRY_RUN) {
    try {
      existing = await listAllMyPlaylists(yt);
    } catch (e) {
      if (e.message.includes('invalid_grant')) {
        console.error('\nAuth expired (invalid_grant). Re-auth: node scripts/youtube-auth.cjs\n');
        process.exit(1);
      }
      throw e;
    }
  }

  const log = fs.existsSync(LOG_PATH) ? JSON.parse(fs.readFileSync(LOG_PATH, 'utf8')) : {};
  let added = 0;
  let created = 0;

  for (const pl of plan.playlists) {
    if (ONLY && pl.title !== ONLY) continue;
    console.log(`\n=== ${pl.title} (${pl.videos.length} videos) ===`);

    let playlistId = existing.get(pl.title) || log[pl.title]?.id;
    let justCreated = false;

    if (!playlistId) {
      if (DRY_RUN) {
        console.log(`  [dry-run] would CREATE playlist (${privacy})`);
      } else {
        const r = await withRetry(
          () =>
            yt.playlists.insert({
              part: 'snippet,status',
              requestBody: {
                snippet: { title: pl.title, description: pl.description || '' },
                status: { privacyStatus: privacy },
              },
            }),
          'create playlist',
        );
        playlistId = r.data.id;
        justCreated = true;
        created++;
        console.log(`  CREATED ${playlistId}`);
        await sleep(2500); // let the new playlist propagate before inserting items
      }
    } else {
      console.log(`  exists ${playlistId} (reusing)`);
    }

    log[pl.title] = {
      id: playlistId || '(pending)',
      url: playlistId ? `https://www.youtube.com/playlist?list=${playlistId}` : null,
    };
    if (!DRY_RUN) fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));

    // A freshly created playlist is empty (and may 404 on immediate listing);
    // only enumerate existing items when reusing a playlist.
    const present =
      DRY_RUN || !playlistId || justCreated ? new Set() : await listPlaylistVideoIds(yt, playlistId);

    for (const v of pl.videos) {
      if (present.has(v.id)) {
        console.log(`  = already in: ${v.realTitle}`);
        continue;
      }
      if (DRY_RUN) {
        console.log(`  + would add: ${v.realTitle}`);
        continue;
      }
      try {
        await withRetry(
          () =>
            yt.playlistItems.insert({
              part: 'snippet',
              requestBody: {
                snippet: {
                  playlistId,
                  resourceId: { kind: 'youtube#video', videoId: v.id },
                },
              },
            }),
          `add ${v.id}`,
        );
        added++;
        console.log(`  + added: ${v.realTitle}`);
        await sleep(300);
      } catch (e) {
        if (isQuotaError(e)) {
          console.error('\nDaily quota exhausted. Re-run tomorrow — already-added videos are skipped.');
          process.exit(2);
        }
        console.error(`  ! failed to add ${v.id} (${v.realTitle}): ${e.message}`);
      }
    }
  }

  console.log(
    `\nDone.${DRY_RUN ? ' (dry-run, no changes)' : ` Created ${created} playlists, added ${added} videos.`}`,
  );
  if (!DRY_RUN) console.log(`Log: ${LOG_PATH}`);
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
