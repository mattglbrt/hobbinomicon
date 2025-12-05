#!/usr/bin/env node

/**
 * Pre-build script to download YouTube thumbnails for hero images
 * Run this before build to cache YouTube thumbnails locally for better LCP
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../src/content/blog');
const IMAGES_DIR = path.join(__dirname, '../src/assets/hero-cache');

// Ensure cache directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
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
 * Download image from URL
 */
async function downloadImage(url, destPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

/**
 * Get YouTube thumbnail URL (try maxres first, fall back to sd)
 */
async function getYouTubeThumbnail(youtubeId) {
  const urls = [
    `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/sddefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      // maxresdefault returns 404 or a tiny placeholder if not available
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        // Skip if it's the tiny placeholder (usually < 2KB)
        if (contentLength && parseInt(contentLength) > 5000) {
          return url;
        }
      }
    } catch (e) {
      continue;
    }
  }

  // Fall back to hqdefault which always exists
  return urls[2];
}

async function main() {
  console.log('🎬 Downloading YouTube thumbnails for hero images...\n');

  const mdxFiles = findMdxFiles(CONTENT_DIR);
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of mdxFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) continue;

    // Skip if already has a heroImage that's not from hero-cache
    if (frontmatter.heroImage && !frontmatter.heroImage.includes('hero-cache')) {
      continue;
    }

    // Skip if no YouTube ID
    if (!frontmatter.youtubeId) continue;

    const youtubeId = frontmatter.youtubeId;
    const cacheFileName = `yt-${youtubeId}.jpg`;
    const cachePath = path.join(IMAGES_DIR, cacheFileName);
    const publicPath = `/images/hero-cache/${cacheFileName}`;

    // Skip if already cached
    if (fs.existsSync(cachePath)) {
      skipped++;
      continue;
    }

    try {
      const thumbnailUrl = await getYouTubeThumbnail(youtubeId);
      console.log(`📥 ${frontmatter.title || youtubeId}`);
      console.log(`   ${thumbnailUrl}`);

      await downloadImage(thumbnailUrl, cachePath);

      const stats = fs.statSync(cachePath);
      console.log(`   ✓ Saved (${(stats.size / 1024).toFixed(1)} KB)\n`);
      downloaded++;
    } catch (error) {
      console.error(`   ✗ Error: ${error.message}\n`);
      errors++;
    }
  }

  console.log('─'.repeat(50));
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`⏭️  Skipped (cached): ${skipped}`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors}`);
  }
  console.log('\nTo use cached images, update your getHeroImage utility to check');
  console.log('for /images/hero-cache/yt-{youtubeId}.jpg first.');
}

main().catch(console.error);
