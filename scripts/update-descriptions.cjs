/**
 * Append a standard Hobbinomicon footer to every YouTube description.
 *
 * - Idempotent: the footer starts with a ――― delimiter line; on rerun the old
 *   footer (delimiter to end) is stripped and rebuilt, so it never duplicates.
 * - Every footer carries exactly two site links: one guides-surface, one
 *   games-surface. Each is deep-linked when we know where the video belongs
 *   and falls back to the hub when we don't.
 *     guides: the video's own guide page (matched on `youtubeId` in
 *             src/content/guides) else /guides/
 *     games:  the video's game page (src/data/game-videos.json) else /games/
 * - Scope guard: ONLY the description changes. Title/tags/categoryId are read
 *   from the live video and re-sent unchanged.
 * - Priority: playlisted + game-mapped + guide-mapped videos first (evergreen),
 *   so a quota-limited day covers the videos that matter most. Resumable.
 *
 * Requires OAuth write scope (youtube). Re-auth if needed:
 *   node scripts/youtube-auth.cjs
 *
 * Usage:
 *   node scripts/update-descriptions.cjs                 # DRY RUN, prints top 25 before/after
 *   node scripts/update-descriptions.cjs --dry-run --limit 5
 *   node scripts/update-descriptions.cjs --run           # execute (respects --max)
 *   node scripts/update-descriptions.cjs --run --max 190 # cap updates this run (quota)
 *   node scripts/update-descriptions.cjs --verify-urls   # offline: check every
 *                                          link this pass would emit exists in dist/
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
const GUIDES_DIR = path.join(ROOT, 'src/content/guides');
const UPDATED_LOG = path.join(ROOT, 'scripts/.descriptions-updated.json');

const DELIM = '―――';
const args = process.argv.slice(2);
const VERIFY = args.includes('--verify-urls');
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

// slug -> title, for the games that actually have a page.
//
// Drafts are excluded: a draft game builds no page, so linking it from YouTube
// is a 404. game-videos.json maps two live videos to `infinity`, which is still
// drafted, and both were being sent there. Same rule the guide routes apply
// ("never link to a page that isn't built").
function gameTitles() {
  const map = {};
  for (const f of fs.readdirSync(GAMES_DIR)) {
    if (!f.endsWith('.mdx')) continue;
    const slug = f.replace(/\.mdx$/, '');
    const src = fs.readFileSync(path.join(GAMES_DIR, f), 'utf8');
    const fm = src.split(/^---$/m)[1] || '';
    if (/^draft:\s*true\s*$/m.test(fm)) continue;
    const m = fm.match(/^title:\s*"?(.+?)"?\s*$/m);
    if (m) map[slug] = m[1].trim();
  }
  return map;
}

// videoId -> guide URL, matched on the guide's `youtubeId` frontmatter.
//
// The URL rule is guideUrlWith() in src/utils/content.ts: a guide filed under
// a directory named for a game renders at /games/{game}/{slug}/, everything
// else at /guides/{slug}/. That rule is duplicated in three places already
// (the two routes, generate-redirects.mjs); this is the fourth, and all four
// have to agree or these descriptions link at pages that were never built.
// `--verify-urls` checks the output against dist/ for exactly that reason.
function guideUrls() {
  const games = new Set(
    fs.readdirSync(GAMES_DIR).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, '')),
  );
  const map = {};
  const walk = (dir, prefix = '') => {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        walk(full, `${prefix}${f}/`);
        continue;
      }
      if (!/\.mdx?$/.test(f)) continue;
      const id = prefix + f.replace(/\.mdx?$/, '');
      const fm = fs.readFileSync(full, 'utf8').split(/^---$/m)[1] || '';
      // A draft guide isn't built. Never point YouTube at a 404.
      if (/^draft:\s*true\s*$/m.test(fm)) continue;
      const vid = (fm.match(/^youtubeId:\s*"?([\w-]+)"?\s*$/m) || [])[1];
      if (!vid || map[vid]) continue; // first match wins, as with game-videos
      const [first, ...rest] = id.split('/');
      map[vid] = rest.length && games.has(first) ? `/games/${id}/` : `/guides/${id}/`;
    }
  };
  walk(GUIDES_DIR);
  return map;
}

function buildFooter(gameSlug, guidePath, titles) {
  const lines = [DELIM];
  // Guides surface, then games surface. Deep link where we know the page,
  // hub where we don't — so every video links both halves of the site.
  if (guidePath) {
    lines.push(`📖 Written guide: https://hobbinomicon.com${guidePath}?${U}`);
  } else {
    lines.push(`📖 Painting and hobby guides: https://hobbinomicon.com/guides/?${U}`);
  }
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

// Correct the legacy footer typo baked into old auto-generated descriptions.
function fixTypos(text) {
  return text.replace(/hobbynomicon\.com/gi, 'hobbinomicon.com');
}

// The pre-footer link block, sitting mid-description above the hashtags:
//   ---
//   🌐 Website & Blog: https://hobbinomicon.com
//   ---
// Deliberately narrow (the site URL is required) so a bare "---" separator in
// real body text is never eaten. Superseded by the standard footer.
const LEGACY_BLOCK =
  /\n*^-{3,}[ \t]*\n[^\n]{0,4}[ \t]*Website & Blog:[ \t]*https?:\/\/\S*hobb\w*\.com\/?[ \t]*\n-{3,}[ \t]*$\n*/m;

function stripLegacyBlock(desc) {
  return desc.replace(LEGACY_BLOCK, '\n\n');
}

// The full description we want a video to end up with: cleaned original body
// (footer stripped, typos fixed) + the standard footer.
function desiredDescription(snippet, gameSlug, guidePath, titles) {
  const base = fixTypos(stripLegacyBlock(stripFooter(snippet.description)).trimEnd());
  const footer = buildFooter(gameSlug, guidePath, titles);
  // A video with no body is footer-only: YouTube strips leading whitespace, so
  // prefixing "\n\n" here would never match what comes back and the video would
  // be rewritten on every pass.
  return base ? `${base}\n\n${footer}` : footer;
}

function isQuotaError(e) {
  const reason = e?.errors?.[0]?.reason || '';
  return (
    reason === 'quotaExceeded' ||
    reason === 'dailyLimitExceeded' ||
    /exceeded your.*quota|quotaExceeded/i.test(e?.message || '')
  );
}

// Offline check: every URL this pass would put in front of YouTube must be a
// page the last build actually emitted. Wrong link here = a 301 at best and a
// 404 at worst, on a channel-wide external-link pass we only want to do once.
function verifyUrls(guides, titles, videoToGame) {
  const DIST = path.join(ROOT, 'dist');
  if (!fs.existsSync(DIST)) {
    console.error('No dist/ — run `npm run build` first, then --verify-urls.');
    process.exit(1);
  }
  const urls = new Set(['/guides/', '/games/']);
  for (const u of Object.values(guides)) urls.add(u);
  for (const slug of Object.keys(titles)) urls.add(`/games/${slug}/`);

  const missing = [];
  for (const u of [...urls].sort()) {
    if (!fs.existsSync(path.join(DIST, u, 'index.html'))) missing.push(u);
  }
  console.log(`Checked ${urls.size} URLs against dist/ (${Object.keys(guides).length} guide deep links).`);
  if (missing.length) {
    console.error(`\n${missing.length} MISSING:`);
    for (const m of missing) console.error(`  ${m}`);
    process.exit(1);
  }
  console.log('All resolve. Safe to run the pass.\n');

  // The four footer shapes, on real videos, so the copy can be approved before
  // anyone spends quota on it.
  const withGuide = Object.keys(guides);
  const withGame = Object.keys(videoToGame);
  const samples = [
    ['guide + game', withGuide.find((id) => videoToGame[id])],
    ['guide only', withGuide.find((id) => !videoToGame[id])],
    ['game only', withGame.find((id) => !guides[id])],
    ['neither (most vlogs)', null],
  ];
  for (const [label, id] of samples) {
    console.log('━'.repeat(72));
    console.log(`${label}${id ? `  (${id})` : ''}`);
    console.log(buildFooter(id ? videoToGame[id] : null, id ? guides[id] : null, titles));
    console.log();
  }
  const counts = { guide: withGuide.length, game: withGame.length };
  console.log('━'.repeat(72));
  console.log(`${counts.guide} videos have a guide page, ${counts.game} have a game page.`);
}

async function main() {
  const titles = gameTitles();
  const guides = guideUrls();

  // Reverse map: videoId -> game slug (first match wins). Games with no page
  // (drafts) are dropped here rather than at render time, so those videos take
  // the directory line instead of a dead deep link.
  const gameVideos = JSON.parse(fs.readFileSync(GAME_VIDEOS, 'utf8'));
  const videoToGame = {};
  for (const [slug, vids] of Object.entries(gameVideos)) {
    if (!titles[slug]) continue;
    for (const v of vids) if (!videoToGame[v.id]) videoToGame[v.id] = slug;
  }

  // Offline, no API, no auth — safe to run any time.
  if (VERIFY) return verifyUrls(guides, titles, videoToGame);

  const yt = google.youtube({ version: 'v3', auth: getAuthClient() });

  // Priority set = playlisted (evergreen) ∪ game-mapped ∪ guide-mapped.
  // Guide-mapped videos matter most in this pass: their pages moved, and a
  // fresh external link is what gets them re-crawled.
  const priority = new Set([...Object.keys(videoToGame), ...Object.keys(guides)]);
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
      const guidePath = guides[id];
      const next = desiredDescription(sn, slug, guidePath, titles);
      if (next === sn.description) continue; // already correct, skip in preview
      shown++;
      const tag = [guidePath ? `guide: ${guidePath}` : null, slug ? `game: ${slug}` : null]
        .filter(Boolean)
        .join(' | ');
      console.log('━'.repeat(72));
      console.log(`#${shown}  ${id}  ${tag ? `[${tag}]` : '[generic]'}${priority.has(id) ? ' [priority]' : ''}`);
      console.log(`title: ${sn.title}`);
      console.log('\n--- BEFORE (tail) ---');
      console.log(sn.description.split('\n').slice(-6).join('\n') || '(empty)');
      console.log('\n--- AFTER (tail) ---');
      console.log(next.split('\n').slice(-6).join('\n'));
      console.log();
    }
    const needing = ordered.filter((id) => {
      const sn = snippets.get(id);
      return desiredDescription(sn, videoToGame[id], guides[id], titles) !== sn.description;
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
    // Skip is content-based, not id-based: a video already carrying the exact
    // desired description (footer + typo fix) is skipped; everything else is
    // (re)written. This lets a footer-only pass get revisited to fix the typo.
    const sn = snippets.get(id);
    const slug = videoToGame[id];
    const next = desiredDescription(sn, slug, guides[id], titles);
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
