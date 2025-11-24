# Vlog Posts Pattern Guide

This guide documents the standard pattern for creating vlog posts in the Hobbinomicon blog.

## Overview

Vlog posts are YouTube-focused blog posts in the "Vlogs" category. They embed a YouTube video and use minimal additional content. The design leverages YouTube metadata for hero images and keeps the focus on the video content.

## File Location

Vlog posts are located in: `/src/content/blog/vlogs/`

Examples:
- `casting-my-own-bases.mdx`
- `how-to-paint-trench-pilgrims-fast.mdx`
- `2-color-nmm-easy-peasy-style.mdx`

## Frontmatter Template

```yaml
---
title: "[Vlog Title]"
description: "[Brief description of the video content]"
pubDate: YYYY-MM-DD HH:MM:SS
category: "Vlogs"
youtubeId: "[YouTube Video ID]"
tags: ["[optional-tag-1]", "[optional-tag-2]"]
---
```

### Frontmatter Fields Explained

- **title**: The title of your vlog (should match or closely match the YouTube title)
- **description**: Brief description of what the video covers
- **pubDate**: Publication date and time (can be YYYY-MM-DD or include time)
- **category**: Always "Vlogs" for vlog posts
- **youtubeId**: The YouTube video ID (from the URL: `youtube.com/watch?v=[ID]`)
- **tags**: Optional tags for categorization and filtering (e.g., `["trench crusade", "painting"]`)

**Important Notes:**
- The `youtubeId` is used for:
  - Embedding the video via YouTubeEmbed component
  - Auto-generating hero images from YouTube thumbnails
  - Fallback images if no custom heroImage is specified
- Tags are optional but recommended for resource pages that auto-filter content
- No `heroImage` is needed - it auto-generates from YouTube thumbnail

## Content Template

### Minimal Vlog Post (Standard)

```markdown
---
title: "[Your Title]"
description: "[Your description]"
pubDate: YYYY-MM-DD HH:MM:SS
category: "Vlogs"
youtubeId: "[VIDEO_ID]"
---

import YouTubeEmbed from '../../../components/YouTubeEmbed.astro';

<YouTubeEmbed videoId="[VIDEO_ID]" title="[Your Title]" />
```

### Vlog Post with Tags (For Resource Page Integration)

```markdown
---
title: "How to Paint Trench Pilgrims Fast"
description: "Quick painting guide for Trench Crusade miniatures"
pubDate: 2025-09-22 20:23:49
category: "Vlogs"
youtubeId: "3zMe3dW878o"
tags: ["trench crusade", "painting", "tutorial"]
---

import YouTubeEmbed from '../../../components/YouTubeEmbed.astro';

<YouTubeEmbed videoId="3zMe3dW878o" title="How to Paint Trench Pilgrims Fast" />
```

### Vlog Post with Additional Content (Optional)

```markdown
---
title: "[Your Title]"
description: "[Your description]"
pubDate: YYYY-MM-DD HH:MM:SS
category: "Vlogs"
youtubeId: "[VIDEO_ID]"
tags: ["tag1", "tag2"]
---

import YouTubeEmbed from '../../../components/YouTubeEmbed.astro';

<YouTubeEmbed videoId="[VIDEO_ID]" title="[Your Title]" />

## Additional Context

You can add additional written content here if needed:
- Materials list
- Step-by-step breakdown
- Links to related videos
- Community discussion points

This content will appear below the video embed.
```

## Key Components

### YouTubeEmbed Component

**Location:** `/src/components/YouTubeEmbed.astro`

**Usage:**
```jsx
<YouTubeEmbed videoId="[VIDEO_ID]" title="[Video Title]" />
```

**Features:**
- Responsive 16:9 aspect ratio
- Lazy loading
- Accessible iframe with proper title

### Hero Image Auto-Generation

**Utility:** `/src/utils/getHeroImage.ts`

The blog automatically generates hero images from YouTube thumbnails with this fallback sequence:
1. Custom `heroImage` (if specified in frontmatter)
2. YouTube maxresdefault thumbnail
3. YouTube sddefault thumbnail
4. YouTube hqdefault thumbnail
5. Placeholder image

**No manual hero image needed** - the system handles it automatically.

## File Naming Convention

Vlog post filenames should be kebab-case and descriptive:

✅ Good:
- `how-to-paint-trench-pilgrims-fast.mdx`
- `casting-my-own-bases.mdx`
- `2-color-nmm-easy-peasy-style.mdx`

❌ Avoid:
- `video1.mdx`
- `Vlog Post.mdx`
- `my_new_video.mdx`

## Tags for Organization

### Common Tag Categories

**Game Systems:**
- `"trench crusade"`
- `"warmachine"`
- `"warhammer"`
- `"necromunda"`

**Activities:**
- `"painting"`
- `"building"`
- `"kitbashing"`
- `"terrain"`
- `"basing"`

**Techniques:**
- `"nmm"` (non-metallic metal)
- `"osl"` (object source lighting)
- `"contrast paints"`
- `"airbrushing"`
- `"weathering"`

**Content Type:**
- `"tutorial"`
- `"vlog"`
- `"showcase"`
- `"tips"`

### Tag Best Practices

1. **Use lowercase** - Tags are filtered with case-insensitive matching
2. **Be consistent** - Use the same tag format across posts
3. **Multi-word tags** - Use spaces for readability: `"trench crusade"` not `"trench-crusade"`
4. **Specific over general** - Tag `"warmachine"` is more useful than just `"wargaming"`
5. **2-5 tags ideal** - Don't over-tag, be selective

## Integration with Resource Pages

When you add tags to vlog posts, they automatically appear in matching resource pages.

**Example:**
```yaml
tags: ["trench crusade", "painting"]
```

This vlog will automatically appear in:
- `/blog/resources/trench-crusade-resources` (filtered by "trench crusade" tag)

## Quick Start Checklist

Creating a new vlog post:

- [ ] Get YouTube video ID from URL
- [ ] Create new `.mdx` file in `/src/content/blog/vlogs/`
- [ ] Use kebab-case filename matching the video title
- [ ] Add complete frontmatter with all required fields
- [ ] Set category to "Vlogs"
- [ ] Add youtubeId
- [ ] Add relevant tags (if applicable)
- [ ] Import YouTubeEmbed component
- [ ] Add YouTubeEmbed with videoId and title
- [ ] (Optional) Add additional written content below embed
- [ ] Verify video embeds correctly in preview

## Common Patterns

### Simple Vlog
Just video embed, no extra content. Great for quick updates or vlogs where the video is self-contained.

### Tutorial Vlog
Video embed + materials list + written steps. Good for painting tutorials or techniques.

### Series Vlog
Video embed + links to related videos in the series. Useful for multi-part content.

### Tagged Vlog
Video embed + specific tags for resource page aggregation. Essential for game-specific content.

## YouTube Video ID

**How to find it:**

From URL: `https://www.youtube.com/watch?v=okP03GxXgJA`
Video ID: `okP03GxXgJA`

From Short URL: `https://youtu.be/okP03GxXgJA`
Video ID: `okP03GxXgJA`

## Rendering Flow

1. User creates vlog post with frontmatter
2. Astro processes the MDX file
3. BlogLayout receives frontmatter data
4. `getHeroImage()` utility generates hero image from youtubeId
5. BlogLayout displays hero image at top
6. YouTubeEmbed component renders the video
7. Any additional markdown content renders below

## Example Files

See examples in `/src/content/blog/vlogs/`:
- **Minimal:** `casting-my-own-bases.mdx`
- **With Tags:** `how-to-paint-trench-pilgrims-fast.mdx`
- **Tutorial Style:** `2-color-nmm-easy-peasy-style.mdx`

## Tips

- **Keep it simple** - Most vlogs work best with just the video embed
- **Let YouTube work** - The auto-thumbnail system is reliable
- **Tag thoughtfully** - Tags enable auto-aggregation in resource pages
- **Match YouTube title** - Consistency helps with SEO and user expectations
- **Use timestamps** - If adding written content, include video timestamps for reference
