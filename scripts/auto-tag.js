/**
 * Auto-tagging script for blog posts
 * Analyzes content and generates appropriate tags based on keywords
 *
 * Usage: node scripts/auto-tag.js [--dry-run] [--file path/to/file.mdx]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tag detection rules - keywords/phrases that indicate a tag should apply
// IMPORTANT: This script suggests ADDITIONS to existing tags, not replacements
// It preserves existing tags unless they're clearly wrong
const TAG_RULES = {
  // Game Systems - use specific multi-word phrases to avoid false positives
  'warmachine': {
    keywords: ['warmachine', 'warjack', 'warcaster', 'khador', 'cygnar', 'cryx', 'love shack', 'hordes'],
    caseSensitive: false
    // Removed 'privateer press' and 'steamforged' as they're company names that could appear in other contexts
  },
  'trench-crusade': {
    keywords: ['trench crusade', 'trench-crusade', 'new antioch'],
    caseSensitive: false
  },
  'mage-knight': {
    keywords: ['mage knight', 'mage-knight', 'mageknight', 'wizkids', 'combat dial'],
    caseSensitive: false
  },
  'necromunda': {
    keywords: ['necromunda', 'underhive', 'gang warfare', 'hive gang', 'yaktribe', 'necrovox'],
    caseSensitive: false
  },
  'crown-and-skull': {
    keywords: ['crown and skull', 'crown-and-skull', 'crown & skull'],
    caseSensitive: false
  },
  'motley-crews': {
    keywords: ['motley crews', 'motley-crews'],
    caseSensitive: false
  },
  'warhammer': {
    keywords: ['warhammer', 'age of sigmar', 'games workshop', 'citadel miniatures', 'old world'],
    caseSensitive: false,
    excludeContext: ['citadel paint', 'citadel shade', 'citadel contrast'] // Don't match paint brand mentions
  },
  'dolmenwood': {
    keywords: ['dolmenwood'],
    caseSensitive: false
  },
  'old-school-essentials': {
    keywords: ['old school essentials', 'old-school-essentials'],
    caseSensitive: false
    // Removed 'ose' and 'osr' as too generic
  },
  'dungeons-and-dragons': {
    keywords: ['dungeons and dragons', 'dungeons & dragons', 'd&d 5e', 'dnd 5e', 'dungeon master'],
    caseSensitive: false
    // Removed generic 'd&d', 'dnd', 'dm' as too prone to false positives
  },

  // Factions - be specific to avoid false matches
  'menoth': {
    keywords: ['menoth', 'protectorate of menoth', 'exemplar', 'kreoss'],
    caseSensitive: false
  },
  'dusk': {
    keywords: ['dusk faction', 'final hunt'],
    caseSensitive: false,
    requireContext: ['warmachine']
  },
  'orgoth': {
    keywords: ['orgoth'],
    caseSensitive: false
  },
  'trench-pilgrims': {
    keywords: ['trench pilgrim', 'trench pilgrims', 'communicant', 'flagellant'],
    caseSensitive: false,
    requireContext: ['trench crusade', 'trench-crusade']
  },
  'orcs-and-goblins': {
    keywords: ['orcs and goblins', 'orcs & goblins', 'greenskinz', 'orruk'],
    caseSensitive: false
    // Removed generic 'orc', 'goblin' to avoid false positives
  },
  'the-last-watch': {
    keywords: ['the last watch', 'last watch campaign'],
    caseSensitive: false
  },

  // Techniques - be more specific to avoid generic word matches
  'glazing': {
    keywords: ['glaze', 'glazing', 'glazed over', 'transparent layer'],
    caseSensitive: false,
    requireContext: ['paint', 'painting', 'miniature', 'model']
  },
  'dry-brushing': {
    keywords: ['drybrush', 'dry brush', 'dry-brush', 'drybrushing'],
    caseSensitive: false
  },
  'airbrushing': {
    keywords: ['airbrush', 'air brush', 'airbrushing'],
    caseSensitive: false
  },
  'nmm': {
    keywords: ['nmm', 'non-metallic metal', 'non metallic metal'],
    caseSensitive: false
  },
  'contrast-paints': {
    keywords: ['contrast paint', 'speedpaint', 'contrast medium'],
    caseSensitive: false
  },
  'basing': {
    keywords: ['basing', 'base texture', 'scenic base', 'static grass'],
    caseSensitive: false,
    requireContext: ['paint', 'painting', 'miniature', 'model', 'flock']
  },
  'weathering': {
    keywords: ['weathering powder', 'weathered look', 'chipping medium', 'battle damage'],
    caseSensitive: false
  },
  'rust-effects': {
    keywords: ['rust effect', 'dirty down rust', 'typhus corrosion', 'ryza rust'],
    caseSensitive: false
  },
  'snow-effects': {
    keywords: ['snow effect', 'snow flock', 'winter base', 'valhallan blizzard'],
    caseSensitive: false
  },
  'orc-skin': {
    keywords: ['orc skin', 'ork skin', 'greenskin flesh'],
    caseSensitive: false
  },
  'pale-flesh': {
    keywords: ['pale flesh', 'pale skin', 'sickly skin', 'undead skin'],
    caseSensitive: false
  },
  'goblin-skin': {
    keywords: ['goblin skin', 'goblin flesh', 'grot skin'],
    caseSensitive: false
  },
  'preshading': {
    keywords: ['preshade', 'preshading', 'pre-shade', 'pre-shading'],
    caseSensitive: false
  },
  'zenithal': {
    keywords: ['zenithal', 'zenithal prime', 'zenithal highlight'],
    caseSensitive: false
  },
  'edge-highlighting': {
    keywords: ['edge highlight', 'edge-highlight', 'line highlight'],
    caseSensitive: false
  },
  'blending': {
    keywords: ['wet blend', 'wet-blend', 'loaded brush', 'two brush blend'],
    caseSensitive: false
  },
  'washes': {
    keywords: ['nuln oil', 'agrax earthshade', 'reikland fleshshade', 'shade wash', 'apply a wash', 'wash over'],
    caseSensitive: false
  },
  'speed-painting': {
    keywords: ['speed paint', 'speedpaint', 'batch paint', 'army painter speedpaint'],
    caseSensitive: false
  },
  'skin-tones': {
    keywords: ['skin tone', 'flesh tone', 'skin recipe', 'painting skin', 'paint skin'],
    caseSensitive: false
  },

  // Hobby Activities - use specific phrases
  '3d-printing': {
    keywords: ['3d print', '3d-print', '3d printed', 'resin print', 'elegoo', 'anycubic', 'stl file'],
    caseSensitive: false
  },
  'resin-casting': {
    keywords: ['resin cast', 'silicone mold', 'mold making', 'casting resin'],
    caseSensitive: false
  },
  'kitbashing': {
    keywords: ['kitbash', 'kit bash', 'kitbashing', 'conversion work', 'bits box'],
    caseSensitive: false
  },
  'priming': {
    keywords: ['primer', 'priming', 'undercoat', 'spray prime'],
    caseSensitive: false,
    requireContext: ['paint', 'painting', 'miniature', 'model']
  },
  'terrain': {
    keywords: ['terrain piece', 'scenery', 'scatter terrain', 'terrain building'],
    caseSensitive: false
  },
  'model-prep': {
    keywords: ['mould line', 'mold line', 'gap fill', 'green stuff', 'milliput'],
    caseSensitive: false
  },
  'magnetizing': {
    keywords: ['magnetize', 'magnetizing', 'magnet for'],
    caseSensitive: false
  },
  'stripping': {
    keywords: ['strip paint', 'stripping paint', 'simple green', 'paint remover'],
    caseSensitive: false
  },
  'hobby-tools': {
    keywords: ['hobby knife', 'cutting mat', 'pin vise', 'hobby clippers'],
    caseSensitive: false
  },

  // Content Types - be specific
  'battle-report': {
    keywords: ['battle report', 'game report', 'batrep'],
    caseSensitive: false
  },
  'unboxing': {
    keywords: ['unboxing', 'mail day', 'just arrived', 'kickstarter arrived'],
    caseSensitive: false
  },
  'showcase': {
    keywords: ['showcase', 'finished model', 'completed model', 'done painting'],
    caseSensitive: false
  },
  'work-in-progress': {
    keywords: ['work in progress', 'wip', 'currently painting', 'in progress'],
    caseSensitive: false
  },
  'live-stream': {
    keywords: ['live stream', 'livestream', 'streaming live'],
    caseSensitive: false
  }
};

// Auto-associations: if one tag is present, consider adding related tags
const TAG_ASSOCIATIONS = {
  'trench-pilgrims': ['trench-crusade'],
  'menoth': ['warmachine'],
  'dusk': ['warmachine'],
  'orgoth': ['warmachine'],
  'the-last-watch': ['crown-and-skull'],
  'dolmenwood': ['rpg'],
  'crown-and-skull': ['rpg']
};

// Tags that should NEVER be automatically removed (they are typically set intentionally)
const PROTECTED_TAGS = [
  'campaign', 'rpg', 'tutorial', 'vlog', 'resources', 'wargaming', 'strategy',
  'dolmenwood', 'crown-and-skull', 'dungeons-and-dragons', 'old-school-essentials',
  'fractured-isles', 'tips'
];

// Parse frontmatter from MDX file
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: null, body: content };

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length);

  // Simple YAML parsing for our needs
  const frontmatter = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v =>
        v.trim().replace(/^["']|["']$/g, '')
      ).filter(v => v);
    } else {
      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');
    }

    frontmatter[key] = value;
  }

  return { frontmatter, body, raw: match[0] };
}

// Check if content matches a tag rule
function matchesRule(content, rule) {
  const searchContent = rule.caseSensitive ? content : content.toLowerCase();

  // Check exclude contexts first
  if (rule.excludeContext) {
    for (const exclude of rule.excludeContext) {
      if (searchContent.includes(exclude.toLowerCase())) {
        return false;
      }
    }
  }

  // Check require contexts
  if (rule.requireContext) {
    let hasContext = false;
    for (const required of rule.requireContext) {
      if (searchContent.includes(required.toLowerCase())) {
        hasContext = true;
        break;
      }
    }
    if (!hasContext) return false;
  }

  // Count keyword matches
  let matches = 0;
  for (const keyword of rule.keywords) {
    const searchKeyword = rule.caseSensitive ? keyword : keyword.toLowerCase();
    const regex = new RegExp(searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const found = (searchContent.match(regex) || []).length;
    matches += found;
  }

  // Check minimum occurrences
  const minRequired = rule.minOccurrences || 1;
  return matches >= minRequired;
}

// Generate tags for content
function generateTags(title, description, body, category, existingTags = []) {
  const fullContent = `${title} ${description} ${body}`.toLowerCase();
  const suggestedTags = new Set();

  // Check each tag rule
  for (const [tagName, rule] of Object.entries(TAG_RULES)) {
    if (matchesRule(fullContent, rule)) {
      suggestedTags.add(tagName);
    }
  }

  // Add associated tags
  for (const tag of [...suggestedTags]) {
    if (TAG_ASSOCIATIONS[tag]) {
      for (const associated of TAG_ASSOCIATIONS[tag]) {
        suggestedTags.add(associated);
      }
    }
  }

  // Add category-based defaults
  if (category === 'Vlogs' && !suggestedTags.has('tutorial')) {
    suggestedTags.add('vlog');
  }
  if (category === 'Tutorials') {
    suggestedTags.add('tutorial');
  }
  if (category === 'Resources') {
    suggestedTags.add('resources');
  }

  return Array.from(suggestedTags).sort();
}

// Update frontmatter with new tags
function updateFrontmatter(content, newTags) {
  const { frontmatter, raw } = parseFrontmatter(content);
  if (!frontmatter) return content;

  const tagsStr = `["${newTags.join('", "')}"]`;

  // Find and replace the tags line
  const tagsRegex = /tags:\s*\[.*?\]/;
  if (raw.match(tagsRegex)) {
    return content.replace(tagsRegex, `tags: ${tagsStr}`);
  } else {
    // Add tags after description or title
    const insertAfter = /description:.*\n/;
    const match = raw.match(insertAfter);
    if (match) {
      return content.replace(match[0], `${match[0]}tags: ${tagsStr}\n`);
    }
  }

  return content;
}

// Process a single file
function processFile(filePath, dryRun = true) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);

  if (!frontmatter) {
    console.log(`Skipping ${filePath} - no frontmatter found`);
    return null;
  }

  const title = frontmatter.title || '';
  const description = frontmatter.description || '';
  const category = frontmatter.category || '';
  const existingTags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

  const suggestedTags = generateTags(title, description, body, category, existingTags);

  // Compare with existing - ONLY suggest additions, never removals
  // The existing tags were manually curated, so we trust them
  const existingSet = new Set(existingTags);

  const toAdd = suggestedTags.filter(t => !existingSet.has(t));

  // Don't suggest any removals - trust the manual curation
  const toRemove = [];

  if (toAdd.length === 0) {
    return null; // No changes needed
  }

  const result = {
    file: path.relative(process.cwd(), filePath),
    title,
    existing: existingTags,
    suggested: [...existingTags, ...toAdd].sort(),
    toAdd,
    toRemove
  };

  if (!dryRun) {
    // Merge: keep ALL existing tags + add new suggested tags
    const finalTags = [...new Set([...existingTags, ...suggestedTags])].sort();
    const updatedContent = updateFrontmatter(content, finalTags);
    fs.writeFileSync(filePath, updatedContent);
    result.updated = true;
  }

  return result;
}

// Process all blog files
function processAllFiles(blogDir, dryRun = true) {
  const results = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const result = processFile(filePath, dryRun);
        if (result) results.push(result);
      }
    }
  }

  walkDir(blogDir);
  return results;
}

// Main
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');
const singleFile = args.find(a => a.startsWith('--file='))?.split('=')[1];

console.log(`\n🏷️  Auto-Tagging Script ${dryRun ? '(DRY RUN)' : '(APPLYING CHANGES)'}\n`);

if (singleFile) {
  const result = processFile(singleFile, dryRun);
  if (result) {
    console.log(`File: ${result.file}`);
    console.log(`Title: ${result.title}`);
    console.log(`Current: [${result.existing.join(', ')}]`);
    console.log(`Suggested: [${result.suggested.join(', ')}]`);
    console.log(`  + Add: ${result.toAdd.join(', ') || 'none'}`);
    console.log(`  - Remove: ${result.toRemove.join(', ') || 'none'}`);
  } else {
    console.log('No changes needed or file not found.');
  }
} else {
  const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
  const results = processAllFiles(blogDir, dryRun);

  console.log(`Found ${results.length} files with suggested tag changes:\n`);

  for (const result of results) {
    console.log(`📄 ${result.file}`);
    console.log(`   "${result.title}"`);
    if (result.toAdd.length > 0) {
      console.log(`   ✅ Add: ${result.toAdd.join(', ')}`);
    }
    if (result.toRemove.length > 0) {
      console.log(`   ❌ Remove: ${result.toRemove.join(', ')}`);
    }
    console.log('');
  }

  if (dryRun) {
    console.log(`\n💡 Run with --apply to make changes`);
  } else {
    console.log(`\n✅ Updated ${results.length} files`);
  }
}
