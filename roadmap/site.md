# Site roadmap

Working doc — not deployed. Tracks site-level work outside of game/studio/people additions (those live in [`games.md`](./games.md)). Stub-first, deepen later. Update statuses as you go.

## Status legend

- `[x]` shipped
- `[~]` in flight / partial
- `[ ]` decided, not started
- `[?]` open question
- `[-]` deferred / dream-tier (intentionally not on the near roadmap)

---

## Shipped (the v2 baseline)

Captured so the starting line is visible.

- [x] **Demolition phase** (campaigns/characters/parties + non-Mage Knight resources removed; schema cleaned) — 2026-05-05
- [x] **Three-entity directory** (Games, Studios, People) — schema + listing pages
- [x] **Format-based game URLs** — `/games/{skirmish,large-scale-army,mass-battle,ttrpgs,solo,graveyard}/`
- [x] **Game-page anatomy** — Hobbinomicon take + structured reference card + community + funnel slots
- [x] **News pillar** with `relatedGame` / `relatedStudio` / `relatedPerson` references
- [x] **Homepage IA** — hero, latest vlogs, news (now above vlogs), newsletter, directory, projects, YouTube CTA
- [x] **Astro 6 migration** — 2026-03-24
- [x] **SEO foundation** — per-entity JSON-LD, og-image conventions, `npm run validate-schema` — 2026-05-07
- [x] **Perf pass** — Lighthouse mobile in the high 90s, CLS effectively zero — 2026-05-07
- [x] **YouTube workflow consolidation** — sync-vlogs + polish + push-descriptions in one repo — 2026-03-31
- [x] **Hero-cache moved out of git** into Netlify build cache (both yt-prefix and no-prefix paths) — 2026-05-12

---

## In flight / next

The v2 vision items that are wired in schema but not yet visible, plus immediate non-vision priorities.

### Funnel mechanic v1 — "If you like X, try Y"

Single biggest visible gap from v2 vision. Schema is ready; rendering is not.

- [x] Schema field `relatedGames` (array of game references) exists today
- [x] Bridge tags in shared vocabulary (skirmish, narrative, low-model-count, solo-friendly, cheap-to-start, OSR-adjacent, etc.)
- [ ] Render `relatedGames` as a section on individual game pages
- [ ] Fall back to tag-based suggestions when `relatedGames` is empty, so new games get "people who like this also liked…" for free
- [ ] Backfill `relatedGames` on existing game entries (one editorial pass)

### Newsletter content / cadence

Form is wired; the actual content engine is not.

- [x] Newsletter form on homepage + about page
- [ ] Pick an integration: Buttondown, ConvertKit, Netlify functions + custom, etc.
- [ ] Decide cadence (weekly digest? monthly?) and angle (indie wargaming news vs. personal hobby log vs. both)
- [ ] Archive page so subscribers can see what they signed up for
- [?] Where does newsletter content live in the repo? New collection, or piggyback on `news`?

### Monster Friends project entry

You're shipping build content already (draft energy counter post; daemon prince complete; more planned) but the project umbrella to group them doesn't exist.

- [ ] Create `src/content/projects/monster-friends.md`
- [ ] Backfill `project: monster-friends` on existing related blog posts
- [ ] Consider `projectSection` groupings (e.g. "Energy Counter", "Painting", "Battle Reports")

### Search coverage

Audit done 2026-05-12. Coverage was already deeper than this roadmap originally implied: all six collections (`blog`, `projects`, `games`, `studios`, `people`, `news`) are indexed in `src/pages/search-index.json.ts`, result order puts directory entities before blog content, and vlog `searchText` excludes transcripts so blog posts only match intentional metadata.

- [x] Audit existing coverage — all six collections already indexed
- [x] Verify ranking — games outrank vlog mentions via collection priority + per-result scoring
- [x] Title-prefix relevance boost (2026-05-12) — typing "war" surfaces Warmachine ahead of slug-order siblings; exact title match scores 1000, prefix match 500
- [x] Default browse surface (2026-05-12) — modal opens to Featured games + Latest news + Recent vlogs when there's no query and no filter
- [x] Clickable result tags (2026-05-12) — tag chips on each result are buttons that add to the active filter set

### Recurring maintenance

Things that drift if nobody watches them.

- [ ] Schedule for running `npm run validate-schema` (per content batch? weekly cron?)
- [ ] Schedule for re-running Lighthouse — baseline is the high 90s per `project_perf.md`; alert when it drops
- [ ] Tag-audit cadence (`npm run tag-audit` exists; no rhythm)
- [ ] Link-rot audit (Discord invites, official game URLs, podcast URLs) — they decay

---

## Decided but deferred

Vision-locked, intentionally not being worked on yet. Each has a stated trigger to start.

### Multi-channel scaffolding (2026-05-05)

Don't build until 2+ channels actually exist. Nav uses "Vlogs" today; switches to a generic "Videos" section when *The Hobbinomicon* (or any second channel) launches.

- [-] `channel` field on blog/vlogs schema (default: `vlogs`)
- [-] Channel landing pages (`/vlogs/`, `/videos/the-hobbinomicon/`, etc.)
- [-] Channel filter on the homepage Latest Vlogs section

**Trigger to start:** a second channel exists and has its first published video.

### Podcast collection

Audio-first content type with guest profiles linking back to People.

- [-] Podcast schema (host, guest references, audio URL, transcript, runtime, episode number)
- [-] Episode pages + listing page
- [-] Cross-link from People pages to episodes they appear in

**Trigger to start:** a first episode is in the pipeline (recording or scheduled).

### Events / partner venues (dream-tier)

Local game store partnerships for indie game events. Not v2 scope but keep schema choices open enough that adding it later isn't a rewrite.

- [-] Events schema (venue reference, date, related games, status)
- [-] Venue/store entity (sub-type of studios, or its own collection?)
- [-] Calendar surface on homepage / dedicated events page

**Trigger to start:** a real event is planned at a real venue.

---

## Tech debt / housekeeping

Known fragility that isn't blocking but is worth chipping at.

- [ ] **`heroImage` redundancy on vlogs.** `sync-vlogs` writes `heroImage: "/images/hero-cache/<id>.jpg"` even though the `youtubeId` would resolve the same image via the fallback path. Cleanup is low-value (mirroring is solved) but the simplification is real.
- [ ] **`src/data/tag-keywords.json` drift.** Auto-tagger keyword list. No process for updating as new content vocabulary appears.
- [ ] **Comments moderation flow.** Self-hosted comments require manual approval; no notification when something is pending. Worth a lightweight check (Slack ping? email digest?).
- [ ] **YouTube OAuth in testing mode.** 7-day refresh-token expiry causes recurring `npm run youtube-auth` cycles. Publishing the OAuth app to production extends token life indefinitely.
- [ ] **`src/data/unique-commenters.csv`** appears to be a one-off snapshot, not a live thing. Decide: keep, regenerate periodically, or remove.
- [ ] **`tag-audit.csv` in repo root.** Likely a generated working file; consider gitignoring.

---

## Open questions

Things that need a decision before they can move.

- [?] **Tagline.** Current: "Hobbying from the deep end of the dungeon." User open to alternatives per v2 vision. No urgency.
- [?] **MESBG tier** — `big` (it's GW) or `indie` (Specialist-game vibes)? (Carried from `games.md`.)
- [?] **The One Ring + Strider Mode** — one page or two? (Carried from `games.md`.)
- [?] **Newsletter integration** — which provider / DIY?
- [?] **Comments moderation alerts** — is "check manually" acceptable, or is this annoying enough to wire a notification?

---

## How this doc evolves

- Move items between buckets as state changes (`[ ]` → `[~]` → `[x]`).
- When a deferred item's trigger fires, promote it to "In flight / next."
- New questions get added under "Open questions" until they're decided, then they migrate to the relevant in-flight section as work items.
- Per-game work belongs in [`games.md`](./games.md), not here.
