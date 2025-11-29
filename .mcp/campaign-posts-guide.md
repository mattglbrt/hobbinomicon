# Campaign Posts Pattern Guide

This guide documents the standard pattern for creating campaign posts in the Hobbinomicon blog.

## Overview

Campaign posts are narrative chapter content in the "Campaign Chronicles" category. They document RPG campaign sessions through immersive prose, capturing the story as it unfolds. These posts connect to character profiles through consistent tagging.

## File Location

Campaign posts are organized by game system and campaign name:
`/src/content/blog/campaigns/[game-system]/[campaign-name]/`

Examples:
- `campaigns/crown-and-skull/the-last-watch/chapter-1.mdx`
- `campaigns/crown-and-skull/the-last-watch/chapter-2.mdx`

## Frontmatter Template

```yaml
---
title: "[Campaign Name] - Chapter [X]"
description: "[Brief chapter summary or hook]"
pubDate: YYYY-MM-DD
category: "Campaign Chronicles"
tags: ["[game-system]", "campaign", "[Campaign Name]", "rpg"]
featured: false
heroImage: "/images/campaigns/[campaign-chapter].jpg"
draft: false
---
```

### Frontmatter Fields Explained

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Campaign name + chapter number |
| `description` | Yes | Brief chapter summary or teaser |
| `pubDate` | Yes | Publication date |
| `category` | Yes | Always "Campaign Chronicles" for campaign posts |
| `tags` | Yes | Array including game system, "campaign", campaign name, "rpg" |
| `featured` | No | Set to `true` to feature on homepage |
| `heroImage` | No | Path to chapter artwork or scene image |
| `draft` | No | Set to `true` for work-in-progress chapters |

**Important Notes:**
- Use `draft: true` to hide unpublished chapters while working on them
- The campaign name in tags should match the `campaign` field used in character posts
- Hero images are optional but recommended for visual appeal

## Content Structure

Campaign posts are primarily narrative prose. Unlike character posts, there is no required structure—the content flows naturally as a story.

### Suggested Approaches

**Pure Narrative:**
Write the chapter as immersive prose, focusing on character actions, dialogue, and atmosphere.

```markdown
Streams of incense drift through the room in blue wisps. Two figures sit facing each other, eyes closed. Breath intentional, slow, in unison.

"Icebane stirs. The Final Hunt has begun."

She stands and removes a loose floorboard of the rented apartment...
```

**Scene-Based:**
Break the chapter into distinct scenes with subtle transitions.

```markdown
The tavern door creaked open, spilling firelight into the rain-soaked street...

---

Three hours later, they gathered in the back room...
```

**Session Recap Style:**
A more structured approach summarizing key events.

```markdown
## The Journey North

The party departed at dawn, following the merchant road toward...

## The Ambush

Shortly after midday, Cylena spotted movement in the treeline...

## Revelations

What they discovered in the ruined temple changed everything...
```

## Complete Example

```mdx
---
title: "The Last Watch - Chapter 1"
description: "The first chapter of The Last Watch campaign"
pubDate: 2025-11-25
category: "Campaign Chronicles"
tags: ["crown and skull", "campaign", "The Last Watch", "rpg"]
featured: false
heroImage: "/images/campaigns/last-watch-chapter-1.jpg"
draft: false
---

Streams of incense drift through the room in blue wisps. Two figures sit facing each other, eyes closed. Breath intentional, slow, in unison. At first glance they would appear sisters, one clearly older with her hair pulled back in a warrior's knot. Her face grim, but frozen in timeless beauty. She breathes in.

"Icebane stirs. The Final Hunt has begun."

Still holding her breath she opens her eyes. For this second she is silent. She basks in the stillness of this breath. For now, nothing has changed. She is still waiting for her life to begin, just as she has for the last 200 years. For thousands of years her people have been waiting. Trained from birth for this moment, she lets the tightness in her chest expand to fill her body. This final breath before her destiny manifests completely.

She turns her attention outward and stares at her companion. Stark white hair that normally lies just above the shoulders is now floating, awash in a sea that she can't feel herself. Younger than herself by 100 years, but confident and poised beyond her years. Created from birth for this day, just like every member of their group.

She finally breathes out. Everything is changed. The Final Hunt has begun.

She stands and removes a loose floorboard of the rented apartment. The smell of weathered oil cloth mixes with the incense that is now drifting in eddies around the room. She unwraps the bundle with the reverence of ritual. First revealing a longbow and quiver, black with golden scrollwork along the riser. Veins of magestone running through the limbs. Then a long, slender greatsword. Ruby red grip and golden pommel. Created over 1000 years ago and passed down through her family. She straps them all to her back and heads for the door.

"I will gather the others."

She walks unanswered through the door and shuts it softly behind her.
```

## File Naming Convention

Chapter filenames should follow a consistent pattern:

- `chapter-1.mdx`
- `chapter-2.mdx`
- `prologue.mdx`
- `epilogue.mdx`
- `interlude-the-dream.mdx`

Use kebab-case and include chapter numbers or descriptive names.

## Directory Structure

Organize campaigns hierarchically:

```
campaigns/
└── crown-and-skull/           # Game system (kebab-case)
    └── the-last-watch/        # Campaign name (kebab-case)
        ├── chapter-1.mdx
        ├── chapter-2.mdx
        └── epilogue.mdx
```

This structure:
- Groups all campaigns by game system
- Keeps chapters together for easy navigation
- Allows multiple campaigns per game system

## Tags for Organization

### Required Tags

1. **Game system** - e.g., `"crown and skull"`
2. **"campaign"** - Literal tag for filtering campaign content
3. **Campaign name** - e.g., `"The Last Watch"` (matches character posts)
4. **"rpg"** - General category tag

### Linking to Characters

Use the same campaign name tag that characters use:

**Character post tags:**
```yaml
tags: ["crown and skull", "elf", "ranger", "The Last Watch"]
```

**Campaign post tags:**
```yaml
tags: ["crown and skull", "campaign", "The Last Watch", "rpg"]
```

Both share `"The Last Watch"` tag, enabling discovery through tag pages.

## Working with Drafts

Use the `draft` field to manage work-in-progress chapters:

```yaml
draft: true   # Hidden from site, visible in dev
draft: false  # Published and visible
```

**Workflow:**
1. Create chapter file with `draft: true`
2. Write and edit the narrative
3. Add hero image when ready
4. Set `draft: false` to publish

## Writing Tips

### Immersion
- Write in present or past tense consistently
- Use sensory details (sight, sound, smell)
- Show character thoughts and emotions

### Pacing
- Vary sentence length for rhythm
- Use short paragraphs for tension
- Allow quiet moments between action

### Character Voice
- Reference characters by name (links to their profiles mentally)
- Include distinctive actions or dialogue
- Show personality through behavior

### Session to Prose
- Focus on memorable moments, not every dice roll
- Expand brief session notes into full scenes
- Add atmospheric details that emerged during play

## Quick Start Checklist

Creating a new campaign chapter:

- [ ] Create game system folder if needed: `/src/content/blog/campaigns/[game-system]/`
- [ ] Create campaign folder if needed: `/src/content/blog/campaigns/[game-system]/[campaign-name]/`
- [ ] Create `.mdx` file with chapter name
- [ ] Add complete frontmatter
- [ ] Set category to "Campaign Chronicles"
- [ ] Add tags including campaign name (matching character posts)
- [ ] Optionally set `draft: true` while writing
- [ ] Write narrative content
- [ ] Add hero image (optional but recommended)
- [ ] Set `draft: false` when ready to publish

## Integration with Characters

Campaign chapters and character profiles connect through:

1. **Consistent tags** - Both use the campaign name tag
2. **Tag pages** - Clicking the campaign tag shows all related content
3. **Narrative references** - Mention characters by name in the prose

This creates a cohesive campaign experience where readers can:
- Read chapters in order
- Click through to character profiles
- See all campaign content on the tag page
