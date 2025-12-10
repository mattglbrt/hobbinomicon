#!/usr/bin/env node

/**
 * Auto-tag existing blog posts based on content analysis
 * Uses keyword matching from tag-keywords.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../src/content/blog');
const TAG_KEYWORDS_PATH = path.join(__dirname, '../src/data/tag-keywords.json');

// Load tag keywords
const tagKeywordsData = JSON.parse(fs.readFileSync(TAG_KEYWORDS_PATH, 'utf-8'));
const tagKeywords = tagKeywordsData.keywords || {};

// Project to faction tag mappings
const projectTagMappings = {
  'trench-pilgrims': ['trench-crusade', 'trench-pilgrims'],
  'motley-crews': ['motley-crews'],
  'orcs-and-goblins-army': ['warhammer', 'orcs-and-goblins'],
  'dusk-final-hunt': ['warmachine', 'dusk'],
};

/**
 * Extract tags from text using keyword matching
 */
function extractTagsFromText(text) {
  if (!text) return [];

  const normalizedText = text.toLowerCase();
  const tagScores = {};

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      const regex = new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = normalizedText.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > 0) {
      tagScores[tag] = score;
    }
  }

  // Sort by score and take top tags
  return Object.entries(tagScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([tag]) => tag);
}

/**
 * Parse frontmatter from MDX file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: null, body: content };

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length);
  const frontmatter = {};

  const lines = frontmatterStr.split('\n');
  let currentKey = null;
  let currentValue = '';
  let inArray = false;

  for (const line of lines) {
    // Check if this is a new key
    const keyMatch = line.match(/^(\w+):\s*(.*)/);

    if (keyMatch && !inArray) {
      // Save previous key if exists
      if (currentKey) {
        frontmatter[currentKey] = parseValue(currentValue.trim());
      }
      currentKey = keyMatch[1];
      currentValue = keyMatch[2];

      // Check if starting an array
      if (currentValue.startsWith('[') && !currentValue.endsWith(']')) {
        inArray = true;
      }
    } else if (inArray) {
      currentValue += '\n' + line;
      if (line.includes(']')) {
        inArray = false;
      }
    } else if (currentKey) {
      currentValue += '\n' + line;
    }
  }

  // Save last key
  if (currentKey) {
    frontmatter[currentKey] = parseValue(currentValue.trim());
  }

  return { frontmatter, body };
}

/**
 * Parse a frontmatter value
 */
function parseValue(value) {
  // Handle arrays
  if (value.startsWith('[')) {
    try {
      // Try JSON parse for arrays like ["tag1", "tag2"]
      return JSON.parse(value);
    } catch {
      // Handle YAML-style arrays
      const items = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      return items.filter(Boolean);
    }
  }

  // Handle quoted strings
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  // Handle booleans
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Handle numbers
  if (!isNaN(value) && value !== '') return Number(value);

  return value;
}

/**
 * Generate frontmatter string from object
 */
function generateFrontmatter(frontmatter) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else if (typeof value === 'string') {
      // Check if needs quoting
      if (value.includes(':') || value.includes('"') || value.includes('\n')) {
        lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
      } else {
        lines.push(`${key}: "${value}"`);
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else if (value instanceof Date) {
      lines.push(`${key}: ${value.toISOString()}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
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
 * Main function
 */
async function main() {
  console.log('🏷️  Auto-tagging blog posts...\n');

  const files = findMdxFiles(CONTENT_DIR);
  console.log(`Found ${files.length} posts to analyze\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of files) {
    const relativePath = path.relative(CONTENT_DIR, filePath);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { frontmatter, body } = parseFrontmatter(content);

      if (!frontmatter) {
        console.log(`⚠️  ${relativePath}: No frontmatter found`);
        skipped++;
        continue;
      }

      // Get existing tags
      const existingTags = frontmatter.tags || [];

      // Skip if already has meaningful tags (more than 2)
      if (existingTags.length > 2) {
        console.log(`⏭️  ${relativePath}: Already has ${existingTags.length} tags`);
        skipped++;
        continue;
      }

      // Build text to analyze
      const textToAnalyze = [
        frontmatter.title || '',
        frontmatter.description || '',
        body // Include post body/transcript
      ].join(' ');

      // Extract tags from content
      let newTags = extractTagsFromText(textToAnalyze);

      // Add project-based tags
      if (frontmatter.project && projectTagMappings[frontmatter.project]) {
        const projectTags = projectTagMappings[frontmatter.project];
        newTags = [...new Set([...projectTags, ...newTags])];
      }

      // Add category-specific tags for resources
      if (frontmatter.category === 'Resources' && frontmatter.resourceType) {
        // Resource posts usually need specific game tags
      }

      // Add campaign tag for character/campaign posts
      if (frontmatter.campaign) {
        const campaignTag = frontmatter.campaign.toLowerCase().replace(/\s+/g, '-');
        if (!newTags.includes(campaignTag)) {
          newTags.unshift(campaignTag);
        }
      }

      // Merge with existing tags, preserving existing ones
      const mergedTags = [...new Set([...existingTags, ...newTags])].slice(0, 7);

      // Skip if no new tags to add
      if (mergedTags.length === existingTags.length &&
          mergedTags.every(t => existingTags.includes(t))) {
        console.log(`⏭️  ${relativePath}: No new tags to add`);
        skipped++;
        continue;
      }

      // Update frontmatter
      frontmatter.tags = mergedTags;

      // Generate new content
      const newContent = generateFrontmatter(frontmatter) + body;

      // Write back
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ ${relativePath}: ${mergedTags.join(', ')}`);
      updated++;

    } catch (error) {
      console.error(`❌ ${relativePath}: ${error.message}`);
      errors++;
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(`✅ Updated: ${updated} posts`);
  console.log(`⏭️  Skipped: ${skipped} posts`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors} posts`);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
