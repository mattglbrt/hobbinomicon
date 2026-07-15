/**
 * Append a standard Hobbinomicon footer to every YouTube description.
 *
 * - Idempotent: the footer starts with a ――― delimiter line; on rerun the old
 *   footer (delimiter to end) is stripped and rebuilt, so it never duplicates.
 * - Game-mapped videos (src/data/game-videos.json) get a game-specific first
 *   line linking their directory page instead of the generic directory.
 * - Scope guard: ONLY the description changes. Title/tags/categoryId are read
 *   from the live video and re-sent unchanged.
 * - Priority: playlisted + game-mapped videos first (evergreen), so a
 *   quota-limited day covers the videos that matter most. Resumable.
 *
 * Requires OAuth write scope (youtube). Re-auth if needed:
 *   node scripts/youtube-auth.cjs
 *
 * Usage:
 *   node scripts/update-descriptions.cjs                 # DRY RUN, prints top 25 before/after
 *   node scripts/update-descriptions.cjs --dry-run --limit 5
 *   node scripts/update-descriptions.cjs --run           # execute (respects --max)
 *   node scripts/update-descriptions.cjs --run --max 190 # cap updates this run (quota)
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const ROOT = path.join(__dirname, '..');
const TOKEN_PATH = path.join(ROOT, 'youtube_tokens.json');
const CREDENTIALS_DIR = path.join(ROOT, 'credentials');
const GAME_VIDEOS = path.join(ROOT, 'src/data/game-videos.json');
const RESOLVED = path.join(ROOT, 'scripts/.playlist-resolved.json');
const GAMES_DIR = path.join(ROOT, 'src/content/games');
const UPDATED_LOG = path.join(ROOT, 'scripts/.descriptions-updated.json');

const DELIM = '―――';
const args = process.argv.slice(2);
const RUN = args.includes('--run');
const DRY = !RUN || args.includes('--dry-run');
const LIMIT = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : 25;
const MAX = args.includes('--max') ? Number(args[args.indexOf('--max') + 1]) : 190;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const U = 'utm_source=youtube&utm_medium=description';

function findCredentialsFile() {
  for (const d of [CREDENTIALS_DIR, ROOT]) {
    if (!fs.existsSync(d)) continue;
    const f = fs.readdirSync(d).find((x) => x.startsWith('client_secret') && x.endsWith('.json'));
    if (f) return path.join(d, f);
  }
  return null;
}

function getAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(findCredentialsFile(), 'utf8'));
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  const { client_id, client_secret } = credentials.installed || credentials.web;
  const o = new google.auth.OAuth2(client_id, client_secret);
  o.setCredentials(tokens);
  o.on('tokens', (t) => fs.writeFileSync(TOKEN_PATH, JSON.stringify({ ...tokens, ...t }, null, 2)));
  return o;
}

// slug -> title from game frontmatter (kept in sync with the directory).
function gameTitles() {
  const map = {};
  for (const f of fs.readdirSync(GAMES_DIR)) {
    if (!f.endsWith('.mdx')) continue;
    const slug = f.replace(/\.mdx$/, '');
    const src = fs.readFileSync(path.join(GAMES_DIR, f), 'utf8');
    const m = src.match(/^title:\s*"?(.+?)"?\s*$/m);
    if (m) map[slug] = m[1].trim();
  }
  return map;
}

function buildFooter(gameSlug, titles) {
  const lines = [DELIM];
  if (gameSlug) {
    lines.push(
      `▶ ${titles[gameSlug] || gameSlug} on the Hobbinomicon: https://hobbinomicon.com/games/${gameSlug}/?${U}`,
    );
  } else {
    lines.push(`🎲 The indie wargames directory: https://hobbinomicon.com/games/?${U}`);
  }
  lines.push('📬 Monthly-ish newsletter: https://hobbinomicon.com/#newsletter');
  lines.push('💬 Discord: https://discord.gg/5YnP7KrQH3');
  return lines.join('\n');
}

function stripFooter(desc) {
  const lines = desc.split('\n');
  const i = lines.findIndex((l) => l.trim() === DELIM);
  return i === -1 ? desc : lines.slice(0, i).join('\n');
}

function isQuotaError(e) {
  const reason = e?.errors?.[0]?.reason || '';
  return reason === 'quotaExceeded' || reason === 'dailyLimitExceeded';
}

async function main() {
  const yt = google.youtube({ version: 'v3', auth: getAuthClient() });
  const titles = gameTitles();

  // Reverse map: videoId -> game slug (first match wins).
  const gameVideos = JSON.parse(fs.readFileSync(GAME_VIDEOS, 'utf8'));
  const videoToGame = {};
  for (const [slug, vids] of Object.entries(gameVideos)) {
    for (const v of vids) if (!videoToGame[v.id]) videoToGame[v.id] = slug;
  }

  // Priority set = playlisted (evergreen) ∪ game-mapped.
  const priority = new Set(Object.keys(videoToGame));
  if (fs.existsSync(RESOLVED)) {
    const r = JSON.parse(fs.readFileSync(RESOLVED, 'utf8'));
    for (const pl of r.playlists) for (const v of pl.videos) priority.add(v.id);
  }

  // Fetch all uploads + current snippets.
  const ch = await yt.channels.list({ part: 'contentDetails', id: process.env.YOUTUBE_CHANNEL_ID });
  const uploads = ch.data.items[0].contentDetails.relatedPlaylists.uploads;
  const ids = [];
  let pageToken;
  do {
    const r = await yt.playlistItems.list({ part: 'contentDetails', playlistId: uploads, maxResults: 50, pageToken });
    for (const it of r.data.items) ids.push(it.contentDetails.videoId);
    pageToken = r.data.nextPageToken;
  } while (pageToken);

  const snippets = new Map();
  for (let i = 0; i < ids.length; i += 50) {
    const r = await yt.videos.list({ part: 'snippet', id: ids.slice(i, i + 50).join(',') });
    for (const v of r.data.items) snippets.set(v.id, v.snippet);
  }

  // Order: priority first, preserving uploads order within each group.
  const ordered = [...snippets.keys()].sort((a, b) => (priority.has(b) ? 1 : 0) - (priority.has(a) ? 1 : 0));

  const updatedLog = fs.existsSync(UPDATED_LOG) ? JSON.parse(fs.readFileSync(UPDATED_LOG, 'utf8')) : { ids: [] };
  const already = new Set(updatedLog.ids);

  if (DRY) {
    console.log(`DRY RUN — showing first ${LIMIT} of ${ordered.length} videos (priority first).\n`);
    let shown = 0;
    for (const id of ordered) {
      if (shown >= LIMIT) break;
      const sn = snippets.get(id);
      const slug = videoToGame[id];
      const base = stripFooter(sn.description).trimEnd();
      const next = `${base}\n\n${buildFooter(slug, titles)}`;
      if (next === sn.description) continue; // already correct, skip in preview
      shown++;
      console.log('━'.repeat(72));
      console.log(`#${shown}  ${id}  ${slug ? `[game: ${slug}]` : '[generic]'}${priority.has(id) ? ' [priority]' : ''}`);
      console.log(`title: ${sn.title}`);
      console.log('\n--- BEFORE (tail) ---');
      console.log(sn.description.split('\n').slice(-6).join('\n') || '(empty)');
      console.log('\n--- AFTER (tail) ---');
      console.log(next.split('\n').slice(-6).join('\n'));
      console.log();
    }
    const needing = ordered.filter((id) => {
      const sn = snippets.get(id);
      return `${stripFooter(sn.description).trimEnd()}\n\n${buildFooter(videoToGame[id], titles)}` !== sn.description;
    }).length;
    console.log('━'.repeat(72));
    console.log(`\nTotal videos: ${ordered.length} | need footer added/updated: ${needing} | priority (evergreen/mapped): ${[...priority].filter((id) => snippets.has(id)).length}`);
    console.log(`Est. quota for a full pass: ~${needing * 50} units (default daily quota 10,000).`);
    console.log('\nApprove, then run:  node scripts/update-descriptions.cjs --run --max 190');
    return;
  }

  // RUN
  let updates = 0;
  for (const id of ordered) {
    if (updates >= MAX) {
      console.log(`\nReached --max ${MAX}. Re-run tomorrow to continue (already-updated are skipped).`);
      break;
    }
    if (already.has(id)) continue;
    const sn = snippets.get(id);
    const slug = videoToGame[id];
    const next = `${stripFooter(sn.description).trimEnd()}\n\n${buildFooter(slug, titles)}`;
    if (next === sn.description) {
      already.add(id);
      continue; // already correct
    }
    try {
      await yt.videos.update({
        part: 'snippet',
        requestBody: {
          id,
          snippet: {
            title: sn.title,
            categoryId: sn.categoryId,
            description: next,
            ...(sn.tags ? { tags: sn.tags } : {}),
            ...(sn.defaultLanguage ? { defaultLanguage: sn.defaultLanguage } : {}),
            ...(sn.defaultAudioLanguage ? { defaultAudioLanguage: sn.defaultAudioLanguage } : {}),
          },
        },
      });
      updates++;
      updatedLog.ids = [...already.add(id)];
      fs.writeFileSync(UPDATED_LOG, JSON.stringify(updatedLog, null, 2));
      console.log(`updated (${updates}) ${id}  ${slug ? `[${slug}]` : ''}  ${sn.title.slice(0, 60)}`);
      await sleep(200);
    } catch (e) {
      if (isQuotaError(e)) {
        console.error(`\nQuota exhausted after ${updates} updates. Re-run tomorrow to continue.`);
        break;
      }
      console.error(`! failed ${id}: ${e.message}`);
    }
  }
  console.log(`\nDone. Updated ${updates} descriptions this run.`);
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
