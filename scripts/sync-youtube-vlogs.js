#!/usr/bin/env node

/**
 * Sync YouTube channel videos to blog posts
 * Fetches new videos and creates MDX files for vlogs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { YoutubeTranscript } from 'youtube-transcript';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../src/content/blog');
const VLOGS_DIR = path.join(CONTENT_DIR, 'vlogs');

// Ensure vlogs directory exists
if (!fs.existsSync(VLOGS_DIR)) {
  fs.mkdirSync(VLOGS_DIR, { recursive: true });
}

/**
 * Extract frontmatter from MDX file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

/**
 * Recursively find all MDX files
 */
function findMdxFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findMdxFiles(fullPath, files);
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Get all existing YouTube IDs from blog posts
 */
function getExistingYouTubeIds() {
  const mdxFiles = findMdxFiles(CONTENT_DIR);
  const ids = new Set();

  for (const filePath of mdxFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    if (frontmatter?.youtubeId) {
      ids.add(frontmatter.youtubeId);
    }
  }

  return ids;
}

/**
 * Convert title to URL-friendly slug
 */
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, '') // Trim leading/trailing dashes
    .slice(0, 80); // Limit length
}

/**
 * Fetch transcript for a video
 */
async function fetchTranscript(videoId) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcript || transcript.length === 0) {
      return null;
    }
    // Combine transcript segments into paragraphs
    const text = transcript.map(item => item.text).join(' ');
    // Clean up auto-generated artifacts
    return text
      .replace(/\[Music\]/gi, '')
      .replace(/\[Applause\]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (error) {
    // Transcript not available is common, don't log as error
    return null;
  }
}

/**
 * Create description excerpt (first ~160 chars)
 */
function createExcerpt(description) {
  if (!description) return '';

  // Remove URLs
  let clean = description.replace(/https?:\/\/[^\s]+/g, '');
  // Remove extra whitespace
  clean = clean.replace(/\s+/g, ' ').trim();

  if (clean.length <= 160) return clean;

  // Cut at word boundary
  const truncated = clean.slice(0, 160);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace) + '...';
}

/**
 * Generate MDX content for a video
 */
function generateMdxContent(video, transcript) {
  const { id, title, description, publishedAt } = video;
  const excerpt = createExcerpt(description);

  let content = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${excerpt.replace(/"/g, '\\"')}"
pubDate: ${publishedAt}
category: "Vlogs"
youtubeId: "${id}"
tags: []
---

import YouTubeEmbed from '../../../components/YouTubeEmbed.astro';

<YouTubeEmbed videoId="${id}" title="${title.replace(/"/g, '\\"')}" />
`;

  // Add description section if there's meaningful content
  if (description && description.trim().length > 0) {
    content += `
## About This Video

${description}
`;
  }

  // Add transcript section if available
  if (transcript) {
    content += `
## Transcript

> ${transcript}
`;
  }

  return content;
}

/**
 * Main sync function
 */
async function main() {
  console.log('🎬 Syncing YouTube videos to blog posts...\n');

  // Check for required environment variables
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey) {
    console.error('❌ YOUTUBE_API_KEY not found in environment variables');
    console.log('\nTo set up:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a project and enable YouTube Data API v3');
    console.log('3. Create an API key');
    console.log('4. Add YOUTUBE_API_KEY=your_key to .env file');
    process.exit(1);
  }

  if (!channelId) {
    console.error('❌ YOUTUBE_CHANNEL_ID not found in environment variables');
    console.log('\nTo find your channel ID:');
    console.log('1. Go to your YouTube channel');
    console.log('2. Click on "About" or look at the URL');
    console.log('3. The channel ID starts with "UC"');
    console.log('4. Add YOUTUBE_CHANNEL_ID=UCxxxxxx to .env file');
    process.exit(1);
  }

  // Initialize YouTube API
  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
  });

  // Get channel's uploads playlist ID
  console.log('📡 Fetching channel info...');
  const channelResponse = await youtube.channels.list({
    part: 'contentDetails',
    id: channelId
  });

  if (!channelResponse.data.items?.length) {
    console.error('❌ Channel not found');
    process.exit(1);
  }

  const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
  console.log(`   Uploads playlist: ${uploadsPlaylistId}\n`);

  // Get existing YouTube IDs
  const existingIds = getExistingYouTubeIds();
  console.log(`📚 Found ${existingIds.size} existing blog posts with YouTube videos\n`);

  // Fetch all videos from uploads playlist
  console.log('📺 Fetching channel videos...');
  const allVideos = [];
  let nextPageToken = undefined;

  do {
    const playlistResponse = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      pageToken: nextPageToken
    });

    for (const item of playlistResponse.data.items || []) {
      const videoId = item.snippet.resourceId.videoId;
      allVideos.push({
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt
      });
    }

    nextPageToken = playlistResponse.data.nextPageToken;
  } while (nextPageToken);

  console.log(`   Found ${allVideos.length} total videos\n`);

  // Filter to new videos only
  const newVideos = allVideos.filter(v => !existingIds.has(v.id));

  if (newVideos.length === 0) {
    console.log('✅ All videos already have blog posts!\n');
    return;
  }

  console.log(`🆕 ${newVideos.length} new videos to sync:\n`);

  // Create blog posts for new videos
  let created = 0;
  let errors = 0;

  for (const video of newVideos) {
    try {
      console.log(`📝 ${video.title}`);

      // Fetch transcript (best effort)
      const transcript = await fetchTranscript(video.id);
      if (transcript) {
        console.log('   ✓ Transcript found');
      } else {
        console.log('   ⚠ No transcript available');
      }

      // Generate content
      const mdxContent = generateMdxContent(video, transcript);

      // Write file
      const slug = slugify(video.title);
      const filePath = path.join(VLOGS_DIR, `${slug}.mdx`);

      // Check for duplicate slugs
      let finalPath = filePath;
      let counter = 1;
      while (fs.existsSync(finalPath)) {
        finalPath = path.join(VLOGS_DIR, `${slug}-${counter}.mdx`);
        counter++;
      }

      fs.writeFileSync(finalPath, mdxContent);
      console.log(`   ✓ Created: ${path.basename(finalPath)}\n`);
      created++;

    } catch (error) {
      console.error(`   ✗ Error: ${error.message}\n`);
      errors++;
    }
  }

  // Summary
  console.log('─'.repeat(50));
  console.log(`✅ Created: ${created} new blog posts`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors}`);
  }
  console.log('\nNext steps:');
  console.log('1. Review generated posts in src/content/blog/vlogs/');
  console.log('2. Add project associations if needed');
  console.log('3. Run npm run build to download hero images');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
