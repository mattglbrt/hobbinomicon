/**
 * Tag utility functions for display names and descriptions
 */

import tagsConfig from '../data/tags.json';

type TagData = {
  display: string;
  description: string;
  category: string;
};

type TagsConfig = {
  categories: Record<string, { display: string; description: string }>;
  tags: Record<string, TagData>;
};

const config = tagsConfig as TagsConfig;

/**
 * Convert kebab-case tag to display name
 * Uses config if available, otherwise converts to title case
 */
export function getTagDisplay(tag: string): string {
  return config.tags[tag]?.display || toTitleCase(tag);
}

/**
 * Get tag description from config
 * Returns undefined if tag not in config
 */
export function getTagDescription(tag: string): string | undefined {
  return config.tags[tag]?.description;
}

/**
 * Get tag category from config
 * Returns undefined if tag not in config
 */
export function getTagCategory(tag: string): string | undefined {
  return config.tags[tag]?.category;
}

/**
 * Get category display name
 */
export function getCategoryDisplay(category: string): string {
  return config.categories[category]?.display || toTitleCase(category);
}

/**
 * Get category description
 */
export function getCategoryDescription(category: string): string | undefined {
  return config.categories[category]?.description;
}

/**
 * Check if tag exists in config
 */
export function isKnownTag(tag: string): boolean {
  return tag in config.tags;
}

/**
 * Get all tags from config
 */
export function getAllTags(): string[] {
  return Object.keys(config.tags);
}

/**
 * Get all tags grouped by category
 */
export function getTagsByCategory(): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  for (const [tag, data] of Object.entries(config.tags)) {
    const category = data.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(tag);
  }

  return grouped;
}

/**
 * Get all category keys
 */
export function getAllCategories(): string[] {
  return Object.keys(config.categories);
}

/**
 * Convert kebab-case to Title Case
 */
function toTitleCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert display name to kebab-case for URLs
 */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
