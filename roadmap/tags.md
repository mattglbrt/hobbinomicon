# Tag cleanup plan

## Current state (audited 2026-07-08)

- 279 blog posts carry **349 distinct tags**; only 59 of those are in the
  canonical registry (`src/data/tags.json`, 99 tags defined). The other
  **290 tags are unregistered** — most used on only 1–3 posts.
- Root cause: `scripts/sync-vlogs.js` auto-tags new vlogs by counting keyword
  hits across title + description + **full transcript** and keeping the top 7.
  A vlog that *mentions* "heretic" once gets `trench-crusade`; every stray
  paint-color mention becomes a tag. This runs daily, so junk regrows even
  after cleanup.
- A first normalization pass was applied on 2026-06-09 (commit `466ed2f`) via
  the existing pipeline: `tags-suggest.js` → edit `post-tags.csv`
  (`suggested_tags` column) → `tags-apply.js --apply`. It merged variants but
  didn't judge whether tags actually fit the content.
- `post-tags.csv` is now **stale for one post**
  (`vlogs/kal-arath-live-play-session-1.mdx` — its frontmatter was hand-fixed
  to `[rpg-session, kal-arath]` after the CSV was generated; re-applying the
  CSV as-is would revert that). Always regenerate the CSV before editing.
- Blog **categories** have the same disease: one-off categories `Warmachine`,
  `Gaming`, `Miniature Painting` (1 post each) and `Kingdom Death` (9) sit
  beside the core set (Vlogs 143, Tutorials 49, Projects 38, Tips 14,
  Resources 13, Reviews 6, Articles 2) and clutter the search filter chips.

## Existing tooling (all in `scripts/`)

| Script | Role |
|---|---|
| `tag-audit.js` (`npm run tag-audit`) | Reports every used tag, count, known/unknown |
| `tag-normalize.json` | Merge/rename/drop map (`old → new`, `old → null`) |
| `tags-suggest.js` | Regenerates `post-tags.csv` with a `suggested_tags` column seeded through the normalize map |
| `tags-apply.js` | Dry-run/apply `suggested_tags` back into frontmatter |
| `canonical-tags-export.js` | Exports `canonical-tags.csv` from `tags.json` |

## Plan

### Phase 0 — Lock the taxonomy (human decision, ~1 sitting)
Review `src/data/tags.json` (99 tags, categories: game-system, faction,
technique, hobby, content-type, brand). Promote high-count unregistered tags
that deserve to exist — candidates by usage: `solo-rpg` (28), `goblins` (26),
`motivation` (20), `conversion` (13), `sculpting` (13), `crucible-guard` (12),
`ttrpg` (11), `inq28` (11), `board-games` (11), `hobby-organization` (10),
`orcs` (10), `infinity` (10), `green-stuff` (9), `lego` (6)… Target roughly
120–140 total. Ground rules going forward:
- A tag must exist in `tags.json` to be used on a post.
- 3–6 tags per post; tags describe what the post is *about*, not words it mentions.

### Phase 1 — Extend the normalize map (mechanical)
Add entries to `scripts/tag-normalize.json` until `npm run tag-audit` shows
zero unknown tags that aren't deliberate: merge variants into canonical form,
`null` the noise (one-off paint colors, adjectives, video-title fragments).

### Phase 2 — Content-aware retag (the actual "incorrect tags" fix)
1. `node scripts/tags-suggest.js` — regenerate `post-tags.csv` fresh.
2. Have Claude read each post (title/description/body/transcript) and correct
   `suggested_tags` against the canonical registry — removing tags that don't
   fit the content and adding ones that do. Do it in batches by series
   (KDM episodes, Kal Arath, Trench Crusade, Dolmenwood Pokédex…) since
   series-mates share tags; series posts are easy to spot from slugs.
3. Spot-check the CSV, then `node scripts/tags-apply.js` (dry run) and
   `node scripts/tags-apply.js --apply`.

### Phase 3 — Fix the generator so it stays clean
Rework auto-tagging in `scripts/sync-vlogs.js` (and `auto-tag-posts.js`):
- Only emit tags present in `tags.json`.
- Weight matches: title ×5, description ×3, YouTube `#hashtags` in the
  description ×5 (they're the author's own labels), transcript ×1 — and
  require more than a lone transcript mention to qualify.
- Cap at 5 tags, minimum-score threshold; better to under-tag than junk-tag
  (the windowed transcript backfill doesn't touch tags, so nothing self-heals
  bad ones later).

### Phase 4 — Guardrail
Add an unknown-tag check to `scripts/validate-schema.js` (or prebuild) that
warns loudly when a post uses a tag missing from `tags.json`, so drift is
caught at build time instead of the next audit.

### Phase 5 — Categories (optional, same pattern)
Collapse `Warmachine`, `Gaming`, `Miniature Painting`, `Kingdom Death` into
the core seven, expressing the specifics as tags (`kingdom-death`,
`warmachine`). Category is set per-post in frontmatter; the search modal and
category pages derive their chips from it, so this shrinks filter clutter too.

## Payoff
- `/tags/` index stops listing ~290 uncategorized tags; ~200 thin
  single-post `/tags/[tag]/` pages disappear.
- Search tag chips and per-result tags become meaningful filters.
- Related-posts and tag-based navigation actually relate.
