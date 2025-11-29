# Project Posts Pattern Guide

This guide documents the standard pattern for creating project posts in the Hobbinomicon.

## Overview

Projects are a separate content collection that showcases hobby projects like army builds, warbands, or painting series. They link to resource pages via the `game` field and aggregate related blog posts that reference them via the `project` field.

## File Location

Project posts are located in: `/src/content/projects/`

Examples:
- `trench-pilgrims.mdx`
- `orcs-and-goblins-army.mdx`
- `motley-crews.mdx`
- `dusk-final-hunt.mdx`

## Frontmatter Template

```yaml
---
title: "[Project Name]"
description: "[Engaging description of the project and what you're building]"
pubDate: YYYY-MM-DD
draft: false
game: "[game-system]"
---
```

### Frontmatter Fields Explained

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Name of the project |
| `description` | Yes | Description shown in project listings and cards |
| `pubDate` | Yes | Publication/start date of the project |
| `draft` | No | Set to `true` to hide the project (default: false) |
| `game` | No | Game system slug - links project to resource pages |

**Important Notes:**
- The `game` field must match the game name used in resource pages' `GameProjectsList` component
- Projects without a `game` field won't appear on resource pages but will still be accessible
- The project slug (filename without .mdx) is used by blog posts to link back via their `project` field

## Content Structure

Project posts are intentionally minimal. The main content comes from linked blog posts.

### Basic Structure

```markdown
## About This Project

[Brief introduction to what you're building, your goals, and approach]
```

### Optional Additions

```markdown
## About This Project

[Introduction paragraph]

## Goals

- [Goal 1]
- [Goal 2]
- [Goal 3]

## The Army/Warband/Collection

[Description of what you're building and why]
```

## Complete Examples

### Minimal Project

```mdx
---
title: "Trench Pilgrims"
description: "A grim pilgrimage through the mud and mire. Follow along as I build and paint my Trench Pilgrims warband."
pubDate: 2025-11-27
draft: false
game: "trench crusade"
---

## About This Project

Follow along as I work through my Trench Pilgrims warband.
```

### Project Without Game Link

```mdx
---
title: "Dusk Final Hunt Command Cadre"
description: "Remnants of the Nyss hunters walk a razor's edge between vengeance and survival. Led by Lanyssa Ryssyl, the Final Hunt fights with cold precision and striking speed."
pubDate: 2025-11-25
draft: false
---

## About This Project

The Final Hunt represents the last of the Nyss hunter tradition, adapted for warfare in the frozen north. This project follows the assembly and painting of my command cadre.

## The Warband

Led by Lanyssa Ryssyl, this force combines:
- Elite archer units
- Swift cavalry
- Mystical support
```

### Detailed Project

```mdx
---
title: "Orcs and Goblins Army"
description: "Building a massive greenskin horde for the Old World. From humble gobbos to mighty warbosses."
pubDate: 2025-10-01
draft: false
game: "warhammer"
---

## About This Project

A return to the greenskins! This project chronicles my journey building an Orcs and Goblins army for Warhammer: The Old World.

## Goals

- Build 2000 points of painted greenskins
- Focus on classic models with modern techniques
- Document the entire process through vlogs

## The Horde

The army centers around a massive block of gobbos supported by orc muscle and war machines.
```

## File Naming Convention

Project filenames should be kebab-case and descriptive:

- `trench-pilgrims.mdx`
- `orcs-and-goblins-army.mdx`
- `necromunda-gang.mdx`

The filename becomes the project slug used for linking.

## Linking Projects to Resource Pages

Projects appear on resource pages through the `GameProjectsList` component.

**Project frontmatter:**
```yaml
game: "trench crusade"
```

**Resource page usage:**
```jsx
<GameProjectsList game="trench crusade" />
```

The `game` value must match exactly (case-insensitive matching may apply).

## Linking Blog Posts to Projects

Blog posts can reference a project using the `project` field in their frontmatter:

**Blog post frontmatter:**
```yaml
---
title: "How to Paint Trench Pilgrims Fast"
description: "Quick painting guide"
pubDate: 2025-09-22
category: "Vlogs"
youtubeId: "3zMe3dW878o"
project: "trench-pilgrims"
---
```

The `project` value must match the project's filename (without .mdx).

### Project Order

Use `projectOrder` in blog posts to control the display order within a project:

```yaml
project: "trench-pilgrims"
projectOrder: 1
```

Lower numbers appear first. Posts without `projectOrder` appear after ordered posts.

## Project Thumbnails

Projects automatically display a thumbnail from the latest linked blog post. The system:

1. Finds blog posts with matching `project` field
2. Gets the most recent post
3. Uses that post's hero image (or YouTube thumbnail) as the project thumbnail

No manual thumbnail configuration needed.

## Quick Start Checklist

Creating a new project:

- [ ] Create `.mdx` file in `/src/content/projects/`
- [ ] Use kebab-case filename (this becomes the project slug)
- [ ] Add complete frontmatter
- [ ] Set `game` field if linking to a resource page
- [ ] Write "About This Project" section
- [ ] Optionally add goals or additional context
- [ ] Create blog posts that reference this project via `project` field
- [ ] Project thumbnail will auto-generate from linked posts

## Integration Overview

Projects sit at the center of a content web:

```
Resource Page
    │
    ├── GameProjectsList (game: "trench crusade")
    │       │
    │       └── Project (game: "trench crusade")
    │               │
    │               └── Blog Posts (project: "trench-pilgrims")
    │                       │
    │                       └── YouTubeEmbed / Content
    │
    └── TaggedPostsList (tag: "trench crusade")
            │
            └── Related blog posts by tag
```

**Flow:**
1. Resource page displays projects via `GameProjectsList`
2. Project aggregates blog posts via `project` field matching
3. Blog posts link back to project and appear on resource page via tags

## Common Game Values

Use these `game` values to match existing resource pages:

- `"trench crusade"` - Trench Crusade Resources page
- `"warmachine"` - Warmachine Resources page

When creating a new resource page, choose a game value and use it consistently across projects and the GameProjectsList component.

## Tips

- **Keep project content minimal** - Let linked blog posts tell the story
- **Write compelling descriptions** - They appear in project cards and listings
- **Set the game field** - Enables automatic resource page integration
- **Use consistent project slugs** - Blog posts reference by filename
- **Let thumbnails auto-generate** - The system handles this via linked posts
- **Start with draft: true** - Publish when you have linked content
