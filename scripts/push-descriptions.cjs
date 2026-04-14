/**
 * Push YouTube Descriptions
 * Updates video descriptions using the YouTube Data API
 *
 * Usage:
 *   node scripts/push-descriptions.cjs                    # Push all unpushed descriptions
 *   node scripts/push-descriptions.cjs --dry-run          # Preview without pushing
 *   node scripts/push-descriptions.cjs --video VIDEO_ID   # Push single video
 *   node scripts/push-descriptions.cjs --list             # List videos to update
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Config — all paths relative to project root
const ROOT = path.join(__dirname, '..');
const CREDENTIALS_DIR = path.join(ROOT, 'credentials');
const TOKEN_PATH = path.join(ROOT, 'youtube_tokens.json');
const VLOGS_DIR = path.join(ROOT, 'src/content/blog/vlogs');
const DESCRIPTIONS_DIR = path.join(ROOT, 'descriptions');
const PUSH_LOG_PATH = path.join(ROOT, 'descriptions_pushed.json');

// Find client secret file in credentials directory
function findCredentialsFile() {
  if (fs.existsSync(CREDENTIALS_DIR)) {
    const files = fs.readdirSync(CREDENTIALS_DIR).filter(f => f.startsWith('client_secret') && f.endsWith('.json'));
    if (files.length > 0) {
      return path.join(CREDENTIALS_DIR, files[0]);
    }
  }
  // Fallback to project root
  const rootFiles = fs.readdirSync(ROOT).filter(f => f.startsWith('client_secret') && f.endsWith('.json'));
  if (rootFiles.length > 0) {
    return path.join(ROOT, rootFiles[0]);
  }
  return null;
}

// Parse command line args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIST_ONLY = args.includes('--list');
const SINGLE_VIDEO = args.includes('--video') ? args[args.indexOf('--video') + 1] : null;

// Load push log
function loadPushLog() {
  try {
    return JSON.parse(fs.readFileSync(PUSH_LOG_PATH, 'utf-8'));
  } catch {
    return { description: 'Tracks which descriptions have been pushed to YouTube', pushed: {} };
  }
}

// Save push log
function savePushLog(log) {
  log.lastUpdated = new Date().toISOString();
  log.totalPushed = Object.keys(log.pushed).length;
  fs.writeFileSync(PUSH_LOG_PATH, JSON.stringify(log, null, 2), 'utf-8');
}

// Extract video ID and title from MDX frontmatter
function getVideoInfoFromMdx(mdxPath) {
  const content = fs.readFileSync(mdxPath, 'utf-8');
  const idMatch = content.match(/^youtubeId:\s*"?([^"\n]+)"?/m);
  const titleMatch = content.match(/^title:\s*"?([^"\n]+)"?/m);
  return {
    videoId: idMatch ? idMatch[1].trim() : null,
    title: titleMatch ? titleMatch[1].replace(/^"|"$/g, '').trim() : 'Unknown'
  };
}

// Get OAuth2 client
async function getAuthClient() {
  if (!fs.existsSync(TOKEN_PATH)) {
    console.error('Error: No tokens found. Run "node scripts/youtube-auth.cjs" first.');
    process.exit(1);
  }

  const credentialsPath = findCredentialsFile();
  if (!credentialsPath) {
    console.error('Error: client_secret.json not found in credentials/ folder!');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

  const { client_id, client_secret } = credentials.installed || credentials.web;

  const oauth2Client = new google.auth.OAuth2(client_id, client_secret);
  oauth2Client.setCredentials(tokens);

  // Handle token refresh
  oauth2Client.on('tokens', (newTokens) => {
    const updatedTokens = { ...tokens, ...newTokens };
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(updatedTokens, null, 2));
    console.log('Tokens refreshed and saved.');
  });

  return oauth2Client;
}

// Get current video details (need title and categoryId for update)
async function getVideoDetails(youtube, videoId) {
  const response = await youtube.videos.list({
    part: 'snippet',
    id: videoId
  });

  if (response.data.items && response.data.items.length > 0) {
    return response.data.items[0].snippet;
  }
  return null;
}

// Update video description
async function updateVideoDescription(youtube, videoId, newDescription) {
  const currentSnippet = await getVideoDetails(youtube, videoId);

  if (!currentSnippet) {
    throw new Error(`Video ${videoId} not found or not accessible`);
  }

  const response = await youtube.videos.update({
    part: 'snippet',
    requestBody: {
      id: videoId,
      snippet: {
        title: currentSnippet.title,
        description: newDescription,
        categoryId: currentSnippet.categoryId,
        tags: currentSnippet.tags || []
      }
    }
  });

  return response.data;
}

// Build list of videos to update — scans vlogs MDX files and matches to description files
function buildUpdateList(pushLog) {
  if (!fs.existsSync(VLOGS_DIR)) {
    console.error(`Error: Vlogs directory not found at ${VLOGS_DIR}`);
    return [];
  }

  const mdxFiles = fs.readdirSync(VLOGS_DIR).filter(f => f.endsWith('.mdx'));
  const updates = [];

  for (const mdxFile of mdxFiles) {
    const mdxPath = path.join(VLOGS_DIR, mdxFile);
    const { videoId, title } = getVideoInfoFromMdx(mdxPath);

    if (!videoId) continue;

    // Check if already pushed
    if (pushLog.pushed[videoId] && !SINGLE_VIDEO) continue;

    // If single video mode, only process that one
    if (SINGLE_VIDEO && videoId !== SINGLE_VIDEO) continue;

    // Find corresponding description file — try multiple naming patterns
    const descFiles = fs.existsSync(DESCRIPTIONS_DIR) ? fs.readdirSync(DESCRIPTIONS_DIR).filter(f => fs.statSync(path.join(DESCRIPTIONS_DIR, f)).isFile()) : [];
    const descFile = descFiles.find(f => {
      const content = fs.readFileSync(path.join(DESCRIPTIONS_DIR, f), 'utf-8');
      // Match by video ID being referenced, or by similar naming
      return f.endsWith('_description.txt');
    });

    // Try matching by slug
    const slug = mdxFile.replace('.mdx', '');
    const possibleDescNames = [
      `${slug}_description.txt`,
      `${slug}.txt`,
    ];

    // Also scan descriptions for videoId match
    let descriptionPath = null;
    let descriptionFile = null;

    for (const name of possibleDescNames) {
      const p = path.join(DESCRIPTIONS_DIR, name);
      if (fs.existsSync(p)) {
        descriptionPath = p;
        descriptionFile = name;
        break;
      }
    }

    // Fallback: scan all description files for any that might match by title similarity
    if (!descriptionPath && fs.existsSync(DESCRIPTIONS_DIR)) {
      for (const f of descFiles) {
        if (!f.endsWith('_description.txt')) continue;
        const baseName = f.replace('_description.txt', '').replace(/_/g, ' ').toLowerCase();
        if (title.toLowerCase().includes(baseName.slice(0, 20)) || baseName.includes(title.toLowerCase().slice(0, 20))) {
          descriptionPath = path.join(DESCRIPTIONS_DIR, f);
          descriptionFile = f;
          break;
        }
      }
    }

    if (!descriptionPath) continue;

    const description = fs.readFileSync(descriptionPath, 'utf-8');

    updates.push({
      videoId,
      title,
      mdxFile,
      descriptionFile,
      description
    });
  }

  return updates;
}

async function main() {
  console.log('\n=== YouTube Description Pusher ===\n');

  if (DRY_RUN) console.log('DRY RUN MODE - No changes will be made\n');

  const pushLog = loadPushLog();
  const updates = buildUpdateList(pushLog);

  if (updates.length === 0) {
    console.log('No videos to update.');
    return;
  }

  console.log(`Found ${updates.length} video(s) to update:\n`);

  // List mode - just show what would be updated
  if (LIST_ONLY) {
    for (const update of updates) {
      console.log(`- ${update.title} (${update.videoId})`);
    }
    return;
  }

  // Get authenticated client
  const auth = await getAuthClient();
  const youtube = google.youtube({ version: 'v3', auth });

  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    console.log(`[${successCount + errorCount + 1}/${updates.length}] ${update.title}`);
    console.log(`  Video ID: ${update.videoId}`);

    if (DRY_RUN) {
      console.log('  Status: SKIPPED (dry run)\n');
      successCount++;
      continue;
    }

    try {
      await updateVideoDescription(youtube, update.videoId, update.description);

      // Log success
      pushLog.pushed[update.videoId] = {
        title: update.title,
        mdxFile: update.mdxFile,
        descriptionFile: update.descriptionFile,
        pushedAt: new Date().toISOString()
      };
      savePushLog(pushLog);

      console.log('  Status: SUCCESS\n');
      successCount++;

      // Rate limiting - YouTube API has quotas
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (err) {
      console.error(`  Status: ERROR - ${err.message}`);
      if (err.response?.data?.error) {
        console.error(`  Details: ${JSON.stringify(err.response.data.error, null, 2)}`);
      }
      console.error('');
      errorCount++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total: ${updates.length}`);
}

main().catch(console.error);
