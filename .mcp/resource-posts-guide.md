# Resource Posts Pattern Guide

This guide documents the standard pattern for creating resource posts in the Hobbinomicon blog.

## Overview

Resource posts are special blog posts in the "Resources" category that aggregate external links and internal content around a specific topic. They use a card-based design system for visual consistency and easy scanning.

## File Location

Resource posts are located in: `/src/content/blog/resources/`

Examples:
- `competition-painting-guides.mdx`
- `trench-crusade-resources.mdx`
- `warmachine-resources.mdx`

## Frontmatter Template

```yaml
---
title: "[Topic] Resources"
description: "Essential tools, guides, and community resources for [topic]"
pubDate: YYYY-MM-DD
category: "Resources"
tags: ["[main-tag]", "resources", "[additional-tags]"]
featured: true
heroImage: "/images/resources/[topic]-hero.jpg"
heroImageAlt: "[Topic] resources and guides"
---
```

## Content Structure

### 1. Introduction Paragraph

Start with a welcoming introduction that explains what the resource page offers.

```markdown
Your hub for all things [Topic]! Find essential tools, community resources, and helpful guides for [description].

---
```

### 2. External Links Section (Static Links)

For curated external resources, use the card-based link design:

```markdown
## Essential Resources

Brief description of the resources.

<div class="not-prose grid gap-6 my-8">
  <a href="[URL]"
     class="block p-6 bg-ink/5 hover:bg-ink/10 border-l-4 border-ink/30 hover:border-ink transition-all rounded-r-lg group"
     target="_blank"
     rel="noopener noreferrer">
    <h3 class="text-2xl font-heading font-bold text-ink mb-2 group-hover:underline">
      [Link Title] →
    </h3>
    <p class="text-ink/80 leading-relaxed">
      [Description of what this resource provides]
    </p>
  </a>

  <!-- Add more link cards as needed -->
</div>
```

**Key Features:**
- `not-prose` class to escape prose styling
- `grid gap-6 my-8` for consistent spacing
- Arrow (→) indicates external link
- `target="_blank" rel="noopener noreferrer"` for security
- Hover effects: background darkens, border intensifies, title underlines

### 3. Placeholder Link Sections

For sections where links will be added later:

```markdown
<div class="not-prose grid gap-6 my-8">
  <div class="p-6 bg-ink/5 border-l-4 border-ink/20 rounded-r-lg">
    <h3 class="text-xl font-heading font-bold text-ink mb-3">[Section Name]</h3>
    <p class="text-ink/60 italic">Add your [section description] here</p>
  </div>
</div>
```

**Key Features:**
- Same card structure but non-clickable
- Lighter border (`border-ink/20`) to indicate placeholder
- Italic text for "coming soon" message

### 4. Auto-Generated Content Section (Optional)

For automatically pulling in blog posts with specific tags:

```markdown
import { getCollection } from 'astro:content';

export const allPosts = await getCollection('blog');
export const filteredPosts = allPosts
  .filter(post => !post.data.draft)
  .filter(post => post.data.tags?.some(tag => tag.toLowerCase().includes('[tag-name]')))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
```

Then in the content:

```markdown
## My [Topic] Content

{filteredPosts.length > 0 ? (
  <div class="not-prose grid gap-4 my-8">
    {filteredPosts.map(post => (
      <a href={`/blog/${post.slug}`}
         class="block p-6 bg-ink/5 hover:bg-ink/10 border-l-4 border-ink/30 hover:border-ink transition-all rounded-r-lg group">
        <h3 class="text-xl font-heading font-bold text-ink mb-2 group-hover:underline">
          {post.data.title}
        </h3>
        <p class="text-ink/80 text-sm mb-2">{post.data.description}</p>
        <p class="text-ink/60 text-xs">
          Published: {new Date(post.data.pubDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </a>
    ))}
  </div>
) : (
  <p class="text-ink/60 italic my-8">No [topic] posts yet. Check back soon!</p>
)}
```

### 5. Footer

```markdown
---

**Have a resource to suggest?** This guide is a living document. If you have [topic] resources you'd like to see added, please reach out!

*Last updated: [Date]*
```

## Design System

### Colors
- `ink` - Primary dark color (#1a1614)
- `parchment` - Background color (#F4ECD8)
- `ink/5` - Very light background for cards
- `ink/10` - Hover background
- `ink/20` - Subtle borders for placeholders
- `ink/30` - Normal borders
- `ink/60` - Muted text
- `ink/80` - Body text

### Typography
- `font-heading` - IM Fell DW Pica for headings
- `font-serif` - Besley for body text

### Card Variants

**Clickable External Link Card:**
```html
<a href="[url]"
   class="block p-6 bg-ink/5 hover:bg-ink/10 border-l-4 border-ink/30 hover:border-ink transition-all rounded-r-lg group"
   target="_blank"
   rel="noopener noreferrer">
```

**Placeholder Card:**
```html
<div class="p-6 bg-ink/5 border-l-4 border-ink/20 rounded-r-lg">
```

**Internal Link Card (auto-generated):**
```html
<a href={`/blog/${post.slug}`}
   class="block p-6 bg-ink/5 hover:bg-ink/10 border-l-4 border-ink/30 hover:border-ink transition-all rounded-r-lg group">
```

## Quick Start Checklist

When creating a new resource post:

- [ ] Create file in `/src/content/blog/resources/[topic]-resources.mdx`
- [ ] Add complete frontmatter with title, description, tags
- [ ] Write introduction paragraph
- [ ] Add horizontal rule (`---`)
- [ ] Create section headings with `##`
- [ ] Wrap link cards in `<div class="not-prose grid gap-6 my-8">`
- [ ] For external links, use clickable card with arrow (→)
- [ ] For placeholders, use non-clickable card with italic text
- [ ] Add imports at top if using auto-generated content
- [ ] Include footer with "suggest a resource" message
- [ ] Update "Last updated" date

## Common Patterns

### Multiple Sections
Separate different types of resources (Official, Community, Tools, etc.) into their own card grids.

### Section Ordering
1. Introduction
2. Static external links (most important)
3. Placeholder sections (for future expansion)
4. Auto-generated internal content
5. Footer

### Consistency
All resource posts should follow the same visual pattern for a cohesive user experience.

## Example File

See `/src/content/blog/resources/competition-painting-guides.mdx` for a complete working example.
