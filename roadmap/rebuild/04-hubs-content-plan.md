# On-ramp hubs — content plan (Warmachine now, Spearhead queued)

*Input from Matt, 2026-08-26. Faction grouping below is my read of his list — confirm before Phase 4 builds the hub sections.*

## Warmachine hub — `/warmachine/`

### Faction map (drives the "Painting guides by faction" groups and the `faction` field on guides)

| Faction (hub group) | Models in the backlog | Existing content |
|---|---|---|
| **Crucible Guard** | Gearheart, Toro, Apollo | `how-to-paint-crucible-guard-green`, `crucible-guard-base-test-results`, escalation-league vlogs — the only faction with guides already |
| **Old Umbrey** (Khador) | Lissya, Primeval, Vorony, Chosen of the Witch | `new-warmachine-caster`, Old Witch / King of Nothing league vlogs |
| **Grymkin** | Heretic, Old Witch, Cage Rager, Crabbit, Slaughterhouse, Dreadrot | — |
| **Infernals** | Zataroth, 1 heavy, 1 light, cultist, destroyer, Kithguard, Kraghorn | `infernal-diaries-*` vlogs |
| **Convergence of Cyriss** | Directrix, Lucant | — |
| **Dark Ops** (Cephalyx) | Thexus (Kythos shown, Thexus painted), Malfessor (extreme), Criterion, Drudge, Agitator | — |
| **Thornfall Alliance** | Midas, Sturm & Drang *or* Carver (decide) | — |

Old Witch appears under both Old Umbrey and Grymkin in the game; file the guide under whichever army she's painted for and cross-tag the other.

### Recommended order (and why)

The hub is only as strong as its fullest faction group, so paint **one faction to completion before starting the next** — a faction page with three finished guides outranks seven factions with one each.

1. **Crucible Guard** (Gearheart, Toro, Apollo) — you already have the green recipe and basing guides, so this group hits "≥3 guides" fastest and lets the hub launch.
2. **Old Umbrey** — it's the army you've actually been playing (league vlogs exist), Khador is one of the most-searched factions, and the Old Witch guide double-counts for Grymkin.
3. **Grymkin** — six models, distinctive look, great painting content; Old Witch already done from step 2.
4. **Infernals** — seven models and existing "Infernal Diaries" vlogs to link back to.
5. **Convergence** — two models, quick group, very search-friendly (metallics content travels beyond Warmachine).
6. **Dark Ops** — Malfessor "extreme" is a showcase piece; save it for when the hub has an audience.
7. **Thornfall Alliance** — smallest group; decide Sturm & Drang vs Carver when you get there.

Each model = one guide (`/guides/how-to-paint-{faction}-{model}/`, `hub: warmachine`, `faction: "…"`). Each faction gets a short **scheme guide** first ("The {faction} recipe — paints, order, basing") that every model guide links to; that page is the one that ranks.

### Hub page structure (`HubLayout`, Phase 4)

Start here (3 picks — suggest: Crucible Guard scheme guide · how to prepare bases for an entire army · buying/selling/trading) → Factions grid (7 cards, guide count on each; empty factions show "coming soon" with the planned model list) → Latest Warmachine news → My armies (hand-written) → **"If you paint Warmachine, you'll love…"** funnel: set `relatedGames` on `warmachine.mdx` — suggest Trench Crusade (grimdark kitbash), Relicblade (small warband, same "characterful heavies" itch), Motley Crews (cheap, use your Warmachine minis) → YouTube CTA to the Warmachine channel.

## Spearhead hub — `/spearhead/` (built, `draft: true`)

Plan: **City of Ash** box — terrain and both Spearhead teams. Not purchased yet; a little way off.

Prepared now so it launches the day the first videos exist: game entry `age-of-sigmar-spearhead.mdx` (draft) · hub with two faction groups pre-named from the box's teams (`<!-- MATT: confirm team names -->`) plus a **Terrain** group for the City of Ash scenery build · "Also painting" group for 40k / Old World guides (`hub: spearhead` set on those now) · funnel picks — suggest Motley Crews (skirmish on a chessboard), Wanted! Reward CC10000 (small warband, cheap), Trench Crusade.

First three guides when the box arrives, in order: unboxing/first look (fast, ranks on the product name), the terrain build (evergreen, sets the board for every later video), then team A's scheme guide. That's the launch trigger.

## Open decisions for Matt

* Confirm the faction grouping above (especially Dark Ops and Thornfall membership).
* Sturm & Drang vs Carver.
* Which army the Old Witch gets filed under.
* The three Warmachine funnel picks.

## Rest-of-2026 pipeline — where every project lands in the new IA

Each project below is a painting/content run that should leave behind (a) a directory or hub entry, (b) a scheme guide, (c) per-model or per-unit guides, and (d) vlogs linked back to all of the above. The "directory gap" column is the thing to fix *before* the videos go up, because the game page is what ranks — a project whose game page doesn't exist yet is search traffic left on the table.

| Project | Lands in | Directory gap today | Funnel role |
|---|---|---|---|
| **Warmachine** (7 factions above) | `/warmachine/` hub | none | On-ramp → indie |
| **Motley Crews** | `/games/motley-crews/` (already your #1 page, 431 clicks) | none — add `relatedGames` picks | Indie anchor; every mainstream hub funnels here |
| **Monster Friends** | `/games/monster-friends-battle-for-new-florida/` | game page exists; needs the project section the roadmap already calls for (`project: monster-friends`) | Indie |
| **Bellwoken army** | `/games/bellwoken/` | **no game entry** — only a news post and a vlog. Create it (indie, army/skirmish per the set). | Indie |
| **Greathelm** | `/games/greathelm/` | **no game entry.** Create before the first video. | Indie |
| **Pillage Starter Set** | `/games/pillage/` | **no game entry.** Create before the first video. | Indie |
| **Tomb Kings** (Old World, Oldhammer 2027) | `/warhammer/` hub → Old World section; `/articles/oldhammer-year-2027/` (currently drafted) | publish the article; game entry for The Old World is optional (tier: big) | On-ramp → indie |
| **40k Khorne Daemon army** | `/warhammer/` hub → 40k section | none needed (tier: big, hub-only) | On-ramp → indie |
| Smaller indie minis | `/guides/painting/` with `game` set where one exists; news post + studio/people entry for the maker | usually a **studio + person entry** — the entity pages that rank (Tanner Simpson = 44 clicks) | Indie, plus GEO/entity coverage |

**Hub naming (decided in this doc):** with Tomb Kings and Khorne queued before City of Ash arrives, a `/spearhead/` hub would sit empty for months while 40k/Old World guides pile up. So the second hub is **`/warhammer/`** — one top-level page for now, grouped by `system` (40k, The Old World, Spearhead, and other GW games as they're added). It launches this year as soon as it has ≥3 guides. Nav label: "Warhammer". **Later split:** when any system reaches ~6 guides, give it its own page at `/warhammer/{system}/` (`/warhammer/40k/`, `/warhammer/the-old-world/`, `/warhammer/spearhead/`); the top-level page becomes the index of systems. Because every guide carries `system` from day one, that split is a template addition with zero redirects. Everything above that says `/spearhead/` or `hub: spearhead` reads as `/warhammer/` + `system: spearhead`.

**Suggested sequencing for the year**, purely from a site-growth angle: create the three missing game entries (Bellwoken, Greathelm, Pillage) and their studio/person pages *now* — they're an afternoon each and they start ranking while you paint. Then alternate one mainstream run (a Warmachine faction, Khorne, Tomb Kings) with one indie run (Motley Crews, Monster Friends, Greathelm, Pillage, Bellwoken), so the hubs and the directory grow together and every "If you paint this, try…" section has fresh guides on both sides.
