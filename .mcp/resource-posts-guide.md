# Resource Posts Pattern Guide

This guide documents the standard pattern for creating resource posts in the Hobbinomicon blog.

## Overview

Resource posts are special blog posts in the "Resources" category that serve as hubs for specific games or topics. They pull in related projects and content automatically using dedicated components.

## File Location

Resource posts are located in: `/src/content/blog/resources/`

Examples:
- `trench-crusade-resources.mdx`
- `warmachine-resources.mdx`

## Frontmatter Template

```yaml
---
title: "[Game/Topic] Resources"
description: "Essential tools, guides, and community resources for [topic] players and hobbyists"
pubDate: YYYY-MM-DD
category: "Resources"
tags: ["[main-tag]", "resources", "wargaming"]
heroImage: "/images/[topic]-hero.jpg"
heroImageAlt: "[Topic] resources and guides"
hideRelatedPosts: true
---
```

**Key frontmatter fields:**
- `hideRelatedPosts: true` - Disables the auto-generated related posts section at the bottom
- `category: "Resources"` - Use this category for all resource pages
- `tags` - Include the game/topic name tag so it links to other content

## Required Imports

```mdx
import TaggedPostsList from '../../../components/TaggedPostsList.astro';
import GameProjectsList from '../../../components/GameProjectsList.astro';
import TableOfContents from '../../../components/TableOfContents.astro';
```

## Content Structure

### 1. Introduction Paragraph

Start with a welcoming introduction that explains what the resource page offers.

```markdown
Your hub for all things [Topic]! Find essential tools, community resources, and helpful guides for [description].
```

### 2. Table of Contents

Add a table of contents for easy navigation:

```mdx
<TableOfContents items={[
  { title: "Essential Links", slug: "essential-links" },
  { title: "My [Topic] Projects", slug: "my-topic-projects" },
  { title: "My [Topic] Content", slug: "my-topic-content" },
]} />

---
```

### 3. Essential Links Section

Use card-based sections with bulleted lists for external resources:

```mdx
## Essential Links

<div class="not-prose grid gap-6 my-8">
  <div class="p-6 bg-ink/5 border-l-4 border-ink/20 rounded-r-lg">
    <h3 class="text-xl font-heading font-bold text-ink mb-3">Official Resources</h3>
    <ul class="space-y-2 text-ink/80">
      <li><a href="https://example.com" class="underline hover:text-ink">Official Website</a></li>
      <li><a href="https://example.com/rules" class="underline hover:text-ink">Rules PDF</a></li>
    </ul>
  </div>

  <div class="p-6 bg-ink/5 border-l-4 border-ink/20 rounded-r-lg">
    <h3 class="text-xl font-heading font-bold text-ink mb-3">Community Tools</h3>
    <ul class="space-y-2 text-ink/80">
      <li><a href="https://discord.gg/example" class="underline hover:text-ink">Discord Server</a></li>
      <li><a href="https://reddit.com/r/example" class="underline hover:text-ink">Subreddit</a></li>
    </ul>
  </div>
</div>
```

### 4. Placeholder Link Sections

For sections where links will be added later:

```mdx
<div class="p-6 bg-ink/5 border-l-4 border-ink/20 rounded-r-lg">
  <h3 class="text-xl font-heading font-bold text-ink mb-3">[Section Name]</h3>
  <p class="text-ink/60 italic">Add your [section description] here</p>
</div>
```

### 5. Projects Section (Auto-Generated)

Use the `GameProjectsList` component to automatically display projects:

```mdx
---

## My [Topic] Projects

<GameProjectsList game="[game-name]" />
```

This component displays projects that have matching `game` field in their frontmatter, showing the latest post image as the project thumbnail.

### 6. Content Section (Auto-Generated)

Use the `TaggedPostsList` component to automatically display related blog posts:

```mdx
---

## My [Topic] Content

<TaggedPostsList tag="[tag-name]" excludeCategory="Resources" excludeProjectPosts={true} limit={4} />
```

### 7. Footer

```markdown
---

**Have a resource to suggest?** This guide is a living document. If you have [topic] resources you'd like to see added, please reach out!

*Last updated: [Month Day, Year]*
```

## Component Reference

| Component | Props | Description |
| :--- | :--- | :--- |
| `TaggedPostsList` | `tag`, `excludeCategory?`, `excludeProjectPosts?`, `limit?` | Lists blog posts with a specific tag |
| `GameProjectsList` | `game`, `limit?` | Lists projects for a specific game (with latest post image) |
| `TableOfContents` | `items: {title, slug}[]` | Jump links to page sections |

## Linking Projects to Resource Pages

To have projects appear in a resource page, set the `game` field in the project's frontmatter:

```yaml
---
title: "My Project"
description: "Project description"
pubDate: 2025-01-01
draft: false
game: "trench crusade"
---
```

## Design System

### Colors
- `ink` - Primary dark color (#1a1614)
- `parchment` - Background color (#F4ECD8)
- `ink/5` - Very light background for cards
- `ink/20` - Subtle borders
- `ink/60` - Muted text (italics, placeholder text)
- `ink/80` - Body text

### Typography
- `font-heading` - IM Fell DW Pica for headings
- `font-serif` - Besley for body text

### Card Structure

All link cards use the same base structure:

```html
<div class="p-6 bg-ink/5 border-l-4 border-ink/20 rounded-r-lg">
  <h3 class="text-xl font-heading font-bold text-ink mb-3">[Title]</h3>
  <!-- Content: either a list or placeholder text -->
</div>
```

## Quick Start Checklist

When creating a new resource post:

- [ ] Create file in `/src/content/blog/resources/[topic]-resources.mdx`
- [ ] Add complete frontmatter with `hideRelatedPosts: true`
- [ ] Import all three components (TaggedPostsList, GameProjectsList, TableOfContents)
- [ ] Write introduction paragraph
- [ ] Add TableOfContents with section links
- [ ] Add horizontal rule (`---`)
- [ ] Create Essential Links section with card grid
- [ ] Add `<GameProjectsList game="[game-name]" />` for projects
- [ ] Add `<TaggedPostsList tag="[tag-name]" excludeCategory="Resources" excludeProjectPosts={true} />` for content
- [ ] Include footer with "suggest a resource" message
- [ ] Update "Last updated" date

## Complete Example

See `/src/content/blog/resources/trench-crusade-resources.mdx` for a complete working example.

```mdx
---
title: "My Game Resources"
description: "Essential tools, guides, and community resources for My Game players and hobbyists"
pubDate: 2025-01-01
category: "Resources"
tags: ["my game", "resources", "wargaming"]
heroImage: "/images/my-game-hero.jpg"
heroImageAlt: "My Game resources and guides"
hideRelatedPosts: true
---

import TaggedPostsList from '../../../components/TaggedPostsList.astro';
import GameProjectsList from '../../../components/GameProjectsList.astro';
import TableOfContents from '../../../components/TableOfContents.astro';

Your hub for all things My Game! Brief intro text here.

<TableOfContents items={[
  { title: "Essential Links", slug: "essential-links" },
  { title: "My Projects", slug: "my-projects" },
  { title: "My Content", slug: "my-content" },
]} />

---

## Essential Links

<div class="not-prose grid gap-6 my-8">
  <div class="p-6 bg-ink/5 border-l-4 border-ink/20 rounded-r-lg">
    <h3 class="text-xl font-heading font-bold text-ink mb-3">Official Resources</h3>
    <ul class="space-y-2 text-ink/80">
      <li><a href="https://example.com" class="underline hover:text-ink">Official Website</a></li>
      <li><a href="https://example.com/rules" class="underline hover:text-ink">Rules PDF</a></li>
    </ul>
  </div>

  <div class="p-6 bg-ink/5 border-l-4 border-ink/20 rounded-r-lg">
    <h3 class="text-xl font-heading font-bold text-ink mb-3">Community Tools</h3>
    <ul class="space-y-2 text-ink/80">
      <li><a href="https://discord.gg/example" class="underline hover:text-ink">Discord Server</a></li>
      <li><a href="https://reddit.com/r/example" class="underline hover:text-ink">Subreddit</a></li>
    </ul>
  </div>
</div>

---

## My Projects

<GameProjectsList game="my game" />

---

## My Content

<TaggedPostsList tag="my game" excludeCategory="Resources" excludeProjectPosts={true} limit={4} />

---

**Have a resource to suggest?** This guide is a living document!

*Last updated: January 1, 2025*
```
