# Character Posts Pattern Guide

This guide documents the standard pattern for creating character posts in the Hobbinomicon blog.

## Overview

Character posts are detailed RPG character profiles in the "Dramatis Personae" category. They feature a hero portrait image, structured character information, and a complete character sheet. The layout displays the character image on the left with content on the right.

## File Location

Character posts are organized by campaign: `/src/content/blog/characters/[campaign-name]/`

Examples:
- `characters/crownandskull/Cylena.mdx`
- `characters/crownandskull/Lanyssa.mdx`
- `characters/crownandskull/Mordryth.mdx`

## Frontmatter Template

```yaml
---
title: "[Character Name]"
description: "[Brief character description - role, race, class, distinguishing trait]"
pubDate: YYYY-MM-DD
category: "Dramatis Personae"
tags: ["[game-system]", "[race]", "[class]", "[campaign-name]"]
featured: false
heroImage: "/images/characters/[CharacterName].jpg"
campaign: "[Campaign Name]"
---
```

### Frontmatter Fields Explained

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Character's name |
| `description` | Yes | Brief summary (race, role, distinguishing trait) |
| `pubDate` | Yes | Publication date |
| `category` | Yes | Always "Dramatis Personae" for character posts |
| `tags` | Yes | Array including game system, race, class, campaign name |
| `featured` | No | Set to `true` to feature on homepage |
| `heroImage` | Yes | Path to character portrait image |
| `campaign` | Yes | Campaign name for linking related content |

**Image Guidelines:**
- Store images in `/public/images/characters/`
- Recommended aspect ratio: Portrait (2:3 or similar)
- The layout displays images in a sticky sidebar at 800x1200 max
- Use descriptive filenames matching character names

## Content Structure

Character posts follow a structured format with these sections:

### Required Sections

```markdown
## Background
[Character's history, origin, training, and connection to the story]

## Personality
[Character traits, flaws, quirks, relationships]

## Appearance
[Physical description, clothing, distinctive features, equipment appearance]

## Role in the Story
[Function in the party, responsibilities, narrative importance]

## Notable Abilities
- **[Ability Name]**: [Description]
- **[Ability Name]**: [Description]

## Equipment Highlights
- **[Item Name]**: [Brief description of stats/effects]
- **[Item Name]**: [Brief description]

## Character Sheet
[Full mechanical details - see template below]
```

### Character Sheet Template

```markdown
## Character Sheet

**Lineage:** [Race/Species]
**Hometown:** [Location]
**True Origin:** [If different from hometown]
**Hero Points Remaining:** [Number]

### Flaws
- [Flaw 1]
- [Flaw 2]

### Core Ability
**[Ability Name]**

### Skills
- [Skill Name] ([Score])
- [Skill Name] ([Score])
- [Skill Name] ([Score])

### Equipment
- [Item Name] (Cost: [X]) — [Bonus/Effect if any]
- [Item Name] (Cost: [X])

### Custom Items
- **[Item Name]** — [Damage/Effect], based on [Base Item] (Cost: [X])
  - Effects: [Effect 1], [Effect 2]

### Spells (if applicable)
- **[Spell Name]** — [Effect description]

### Companions (if applicable)
- **[Companion Name]** — [Type], [Brief description]
  - [Stats if relevant]
```

## Complete Example

```mdx
---
title: "Cylena"
description: "Second-in-command of the Last Watch, an elven ranger descended from the ancient northern colony and unmatched in stealth and archery"
pubDate: 2025-11-25
category: "Dramatis Personae"
tags: ["crown and skull", "elf", "ranger", "The Last Watch"]
featured: false
heroImage: "/images/characters/Cylena.jpg"
campaign: "The Last Watch"
---

## Background
Though they use the city as a base of operations, Cylena—like the rest of the Last Watch—was not born there. She originates from the Northern Enclave, the secretive settlement maintained by descendants of the ancient starborne elves.

Where Lanyssa studied arcane archives, Cylena studied the land itself. She learned to read broken branches, shifting winds, and the subtle patterns of creatures that sensed disturbances long before mortals noticed them.

## Personality
Cylena is sharp, observant, and dry-witted. She is less solemn than Lanyssa but no less devoted. Her loyalty runs deep, forged through shared duty.

She carries her flaws—**Employed** and **Grudge**—as part of her identity. Once someone earns her mistrust, they rarely regain it.

## Appearance
Cylena moves with the effortless quiet of a snow cat, every step calculated and light.

She wears durable climbing leathers layered beneath a rare scale vest, and her cloak blends seamlessly into shadow and snowfall. Her custom longbow is almost always in hand.

## Role in the Story
As the primary scout, ranged specialist, and second-in-command, Cylena guides the party through hostile terrain, identifies threats long before conflict begins, and coordinates tactical positioning.

## Notable Abilities
- **Uncanny Shot**: Makes extraordinary shots when they matter most.
- **Stealth Master**: Her cloak enhances her already impressive stealth.
- **Expert Marksman**: Highly trained in Take Aim and precision archery.

## Equipment Highlights
- **Eventide**: D10 damage, Deadly and Die Upgrade effects
- **Scale Vest**: Rare armor requiring expert blacksmith work
- **Great Sword**: Close-combat fallback weapon

## Character Sheet

**Lineage:** Elven Folk
**Hometown:** Rivergate (Cover Identity)
**True Origin:** Hidden Northern Enclave
**Hero Points Remaining:** 0

### Flaws
- Employed
- Grudge

### Core Ability
**Uncanny Shot**

### Skills
- Stealth (8)
- Evade (7)
- Take Aim (8)
- Scout (4)

### Equipment
- Cloak (Cost: 1) — +3 Stealth
- Cold Weather Fur (Cost: 1)
- Scale Vest (Cost: 3)
- Climbing Gear (Cost: 1)
- Great Sword (Cost: 3)

### Custom Items
- **Eventide** — D10 damage, based on Long Bow (Cost: 9)
  - Effects: Custom: Deadly, Die Upgrade
```

## File Naming Convention

Character filenames should match the character name:

- `Cylena.mdx`
- `Lanyssa.mdx`
- `Mordryth.mdx`

Use PascalCase for character names to match proper noun formatting.

## Tags for Organization

### Recommended Tag Categories

**Game System:**
- `"crown and skull"`
- `"d&d"`
- `"pathfinder"`

**Race/Lineage:**
- `"elf"`
- `"human"`
- `"dwarf"`

**Class/Role:**
- `"ranger"`
- `"wizard"`
- `"fighter"`

**Campaign:**
- `"The Last Watch"`
- Use the exact campaign name for consistent linking

### Tag Best Practices

1. **Always include the game system** - Enables filtering on resource pages
2. **Include the campaign name** - Links characters to campaign chapters
3. **Use consistent naming** - Same tag format across all characters
4. **Race and class are helpful** - Aid in character discovery

## Layout Behavior

Character posts receive special layout treatment in BlogLayout:

- **Two-column layout**: Image sticky on left, content scrolls on right
- **Compact spacing**: Tighter typography for detailed character sheets
- **Campaign link**: If `campaign` field is set, displays a link to the campaign tag page
- **Portrait orientation**: Hero image displays in portrait aspect ratio

## Quick Start Checklist

Creating a new character:

- [ ] Create character portrait image and add to `/public/images/characters/`
- [ ] Create campaign folder if needed: `/src/content/blog/characters/[campaign-name]/`
- [ ] Create `.mdx` file with character name as filename
- [ ] Add complete frontmatter with all required fields
- [ ] Set category to "Dramatis Personae"
- [ ] Add heroImage path
- [ ] Set campaign name
- [ ] Add relevant tags (game, race, class, campaign)
- [ ] Write Background section
- [ ] Write Personality section
- [ ] Write Appearance section
- [ ] Write Role in the Story section
- [ ] Add Notable Abilities
- [ ] Add Equipment Highlights
- [ ] Create full Character Sheet with stats

## Tips

- **Write in present tense** - Characters are living entities in the narrative
- **Include flaws** - They make characters interesting and relatable
- **Be specific with equipment** - Include costs and effects for game reference
- **Link to campaign** - The campaign field connects characters to their story
- **Portrait images work best** - The layout is optimized for vertical character art
- **Skills with numbers** - Include the actual skill values for quick reference
