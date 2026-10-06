# Directory & homepage redesign (scope, 2026-10-02)

Matt's brief, filed here so Phases 2-4 can work from it. **The decisions below
override the brief wherever they disagree.** The brief was written against an
older picture of the site; the corrections are listed so nobody re-derives them.

## Decisions (Matt, 10-02)

- **Type axis = `format` + cross-listings, as now.** Types are skirmish / army /
  narrative / boardgame (+ ttrpg for Kal Arath). Solo, Chessboard and Graveyard
  stay cross-listings (`solo`, `chessboard`, `status: oop`), not exclusive
  types, so a game can be skirmish *and* solo. No game changes its home page.
- **TTRPG: no chip, no facet.** `/games/ttrpgs/` stays live (no URL dies) with
  Kal Arath and a pointer to aloneinthedungeon.com (RPG rule, 09-30).
- **Video→game links: script drafts, Matt reviews.** Done in Phase 1, see below.
- **Pillage research list: not imported as stubs.** Games come in through the
  normal backlog rounds under the release rule.

## Corrections to the brief

| Brief | Reality (10-02) |
|---|---|
| 135 games, 240 vlogs | 119 live games (123 files, 4 drafts), 192 vlogs |
| Merge Army-Scale / Large Scale Army / Rank and Flank | Done 2026-08; `/games/large-scale-army/` and `/games/mass-battle/` already 301 to `/games/army/` |
| "Every video already links to a game" | It didn't: 4 vlogs had an unread `game:` key. Phase 1 added `games[]` to 99 vlogs. **Only 15 games have any video** (Warmachine 37, KDM 15, Infinity 11, Trench Crusade 8...). |
| New `featured`, `coverImage` | Already exist as `pinned`, `heroImage` / `thumbnailImage` |
| New `setting[]` | Derive from tags (fantasy, sci-fi, horror, grimdark, historical, modern, post-apocalyptic...) instead of a second copy |
| `players.solo` | Derive from the `solo` flag |
| `minis: agnostic` | Derive from `miniatureAgnostic` (the funnel reads it); `minis` holds the other three values only |
| `priceUsd` (0 = free) | Split into `rulesPriceUsd` (0 = full rules free; a quickstart doesn't count) and `starterPriceUsd`. "Rules free + a $125 box" is free to a painter with minis and $125 to someone without. |
| Analytics: unknown | **GA4** (in `BaseLayout.astro`). Phase 4 = the GA4 Data API row. `src/data/youtube-stats.json` already exists, so "Most watched" by YouTube views is close to free. |
| Three channels | The site syncs one (Hobbinomicon) |
| Mainstream titles tagged | `tier: big` and `hub:` already exist |

## Phase 1 — done 10-02 (`dev`, not deployed; no visible change)

- Schema: `rulesPriceUsd`, `starterPriceUsd`, `players {min, max?, coop}`,
  `sessionMinutes {min, max}`, `minis`, `scale` on games; `games[]` on vlogs.
- `scripts/draft-game-facets.mjs` drafted them on all 123 games.
  **Review: `phase1-facet-review.md`** (95 live games have at least one flagged
  guess; 55 have no `gameLength`, 18 no `playerCount`).
- `scripts/draft-vlog-games.mjs` linked 99 vlogs. **Review:
  `phase1-vlog-games-review.md`.**
- Both scripts only fill fields that are unset, so hand fixes survive a re-run.
- No new redirects were needed.

## Phase 2 — done 10-02 (`dev`, not deployed)

**Don't deploy until Matt has reviewed the Phase 1 facet drafts.** Phase 2
puts those values on every card (players, minis, price) and behind every
filter, so a wrong guess becomes visible.

- `src/utils/facets.ts`: facet definitions, buckets, `getDirectory()` (every
  live game + facets + coverage date + latest video), `facetHref()` (landing
  page if one exists, else `/games/?k=v`), `SETTING_PAGES`.
- `GameCard` is the one game card (wraps `ImageCard`, adds the spec row:
  type · players · minis · price). `GameGrid` uses it, so hubs, studio and
  people pages all show it.
- `GameDirectory` + `DirectoryPage`: every card server-rendered (with JS off you
  get the full list and no dead controls), client script filters, sorts,
  counts, syncs the URL, "Show more" past 48, empty state offers to drop the
  last filter, mobile drawer with a sticky "Show N games". A facet only shows
  if it can narrow that page's list. `ItemList` JSON-LD on every directory page.
- `/games/` is the full directory (119), default sort "Recently covered" =
  newest of the page's pubDate/updatedDate/latest video. Type pages and
  cross-listings use the same component; type pages hide the Type facet.
- New landing pages: `/games/free-rules/`, `/games/mini-agnostic/`,
  `/games/setting/{fantasy,sci-fi,horror,grimdark,historical,modern}/`. In the
  sitemap automatically. Post-apoc and weird have 2 games each, so filter only.
- `/games/solo/` now means the Solo facet (solo flag OR a 1-player minimum), 46 games.
- `/games/ttrpgs/` points to Alone in the Dungeon.
- `/games/index.json` (74 KB, 16 KB gzipped).
- Game pages: visible breadcrumb Games › Type › Game (and in the JSON-LD),
  "Browse similar" facet chips, "Last updated".
- Checked headless (Chrome, 1366 and 390 px): filter/count/URL/sort/more/empty,
  drawer, no horizontal scroll, no-JS, no console errors.
- Copy written for Matt to check (voice): `/games/` description, free-rules,
  mini-agnostic, the six setting intros, the ttrpgs line, "Browse similar".
- Not done: the ⌘K facet row (§5), "Most viewed" sort (Phase 4).
- Size: `/games/` HTML is 480 KB raw / 80 KB gzipped (119 cards of image
  markup, same per-card weight as the old category pages). Run PageSpeed
  mobile on it after deploy; the fix if needed is lighter card markup past
  the first 48, not dropping cards from the HTML.

## Phase 3 — done 10-03 (`dev`, not deployed)

Homepage per §3 with Matt's 10-02 call that guides and news count as coverage
(`getRecentlyCovered()` in `src/utils/facets.ts`). Directory script moved to
`src/scripts/directory.ts`, loaded on demand by BaseLayout, because Swup page
swaps left the filters dead when `/games/` was reached by a click.

**Homepage tweaks (Matt, 10-06):** Latest videos moved to first after the
hero, and the full newsletter signup section is back as the last section before
the footer (the footer's inline form was too easy to miss). That reverses the
brief's "footer only" rule on purpose.

## Phase 4 — dropped (Matt, 10-06)

"Most viewed" needed a GA4 service account; not worth the setup. YouTube views
were rejected because they don't reflect site or search traffic. The homepage
ships without the section. If it comes back, the plan is GA4 (or Search
Console) via a service account writing `src/data/views.json` at build.

## Still open (ask before the phase that needs it)

- Big-publisher titles: shipped on equal footing with a **Publisher: Indie / Big publisher** filter. A visible marker on cards is a one-line change if Matt wants it.
- "Recently covered": videos only, or do guides/news about a game count? With 15 video-covered games, counting guides widens it a lot. — Phase 3
- Most viewed: GA4 page views (needs a service account) or YouTube views first? — Phase 4
- New vlogs from `sync-vlogs.js` arrive with no `games`. Add a games prompt next to the tag prompt (same rules: suggest, never auto-write, skip without a TTY)? — Phase 4

---

## The brief as received

As of 2026-10-02. Site: hobbinomicon.com (Astro, Netlify). Do not noindex anything, do not change any existing game slug, and keep every existing URL resolving.

### 1. Site review: the directory outgrew its homepage

The homepage and category pages still behave like the directory has 10 games.

**What works today:** the hero promise ("Find your next indie wargame. Learn how to play and paint it."); strong game pages (spec chips, The Hobbinomicon Take, How to Start, Community Resources, "If you like X, try", Builds & Series); ⌘K search filters by content type; News and Guides give the homepage a reason to be revisited.

**Where it breaks:**

| Problem | Evidence | Why it matters |
| --- | --- | --- |
| Category pages are flat alphabetical walls | `/games/skirmish/` lists ~100 games A to Z with no filters | A visitor cannot narrow by players, price, setting, or minis needed |
| Taxonomy is inconsistent | Homepage chips, `/games/` index and sitemap use different category sets | (Largely fixed 2026-08; see Decisions) |
| `/games/` index surfaces a handful of games | Index shows ~10 games while category pages hold 100+ | The directory entry point hides 90% of it |
| "Games worth knowing about" is static | Six hand-picked cards | The homepage never changes |
| Videos are invisible on the homepage | No video section | YouTube is the growth engine |
| Search is one-dimensional | Type filter only | Useless for "what can I play solo with the minis I own" |
| Mobile UI | Flagged in August; long card lists compound it | Worst case on a phone |

### 2. Goals and audience

Turn the directory into something a tired-of-GW painter can filter down to three games in under a minute, then watch a video about playing or painting one of them.

- **Primary visitor:** adult painter with a drawer of unpainted minis, wants a game playable with what they own, solo or with one friend. Arrives from Google or a YouTube description link.
- **Returning visitor:** a subscriber checking what was published this week.
- **Search engine:** the directory as the authoritative indie wargame index; category and facet pages as long-tail landing pages.

Success: a game page in two clicks or one search; every homepage visit shows at least one game covered in the last 14 days; the homepage shows what the audience actually looks at; nothing noindexed, every URL resolves.

### 3. Homepage redesign

| # | Section | What it shows | Data source | Changes |
| --- | --- | --- | --- | --- |
| 1 | Hero + search | Keep the headline. Search box is the hero's primary element ("Try: solo, mini-agnostic, under $30"). Secondary CTA: Browse all games. | Static | Rarely |
| 2 | Browse by | Chip rows: Type, Players (Solo, 2, 3+), Minis (Mini-agnostic, Own line, Proxy-friendly), Price (Free rules, Under $30, $30+). Each chip links to a pre-filtered directory URL. | Frontmatter | On build |
| 3 | Recently covered games | 6-8 cards: cover, "New video" badge, video title, publish date. Sorted by most recent video; one card per game. Last 30 days, fall back to the latest 8 regardless of age. | Videos joined to games | Every build |
| 4 | Most viewed games | Top 8 game pages by trailing-30-day views, ranked. Toggle: This month / All time. | Analytics at build (§6) | Nightly |
| 5 | Latest videos | 4-6 thumbnails, each tagged with its game. Links to the on-site video page, not YouTube. | Videos | Every upload |
| 6 | News | Keep as is | News | As published |
| 7 | Learn to paint and play | Keep, but guides tied to the games in 3 and 4 first | Guides joined to games | On build |
| 8 | Mainstream on-ramps | Warmachine and Warhammer hubs, one card each with guide count | Static | Rarely |
| 9 | Newsletter | Footer area only; remove the mid-page duplicate. Points to Substack. | Static | Rarely |

**Game card (3, 4, 7):** cover at 3:2, title, one-line description, compact spec row (type, players, minis, price). The same component on category pages and search results.

**Mobile:** sections 2-5 are snap-scroll carousels (1.2 cards visible); page under four screens tall. Section 2 chips collapse to one "Filter games" button that opens the directory with the drawer open.

**Leaves the homepage:** the static "Games worth knowing about" block (curation becomes a staff-pick chip, i.e. `pinned`) and the second newsletter form.

### 4. Game directory organization

Type stays a URL segment; facets are query parameters.

| Facet | Values | Source |
| --- | --- | --- |
| Players | Solo, 2, 3+, Co-op | `players`, `solo` |
| Minis | Mini-agnostic, Proxy-friendly, Own line, Print-and-play / STL | `miniatureAgnostic`, `minis` |
| Price to start | Free rules, Under $30, $30-75, $75+ | `rulesPriceUsd`, `starterPriceUsd` |
| Session length | Under 60 min, 60-120, 2 hours+ | `sessionMinutes` |
| Setting | Fantasy, Grimdark, Historical, Sci-fi, Post-apoc, Modern, Horror, Weird | derived from `tags` |
| Status | Active, Playtest, Out of print | `status` |
| Scale | Warband, Platoon, Rank and flank, Mass battle | `scale` |
| Coverage | Has videos, Has guides, Staff pick | derived (vlogs, guides, `pinned`) |

**Pages:**
- `/games/` becomes the full filterable directory: every game, default sort "Recently covered", filter rail (desktop) or drawer (mobile), live count in the header.
- Type pages (`/games/skirmish/` etc.) are the same component pre-filtered, with a short SEO intro. A to Z is a sort option, never the default.
- Game pages get a breadcrumb (Games > Skirmish > Frostgrave), a "last updated" date, and facet values as chips linking back to the filtered directory.
- Static facet landing pages (~15): `/games/solo/` (exists), `/games/free-rules/`, `/games/mini-agnostic/`, one per setting (`/games/setting/grimdark/`), each with an intro paragraph (voice.md applies).
- Studios and People gain a "Games" block.
- Mage Knight's sub-pages under `/games/mage-knight/` are the template for any deep-coverage game hub.

### 5. Search and filtering

- Build emits `/games/index.json`: slug, title, type, facet values, cover URL, latest video date, 30-day views, short description. Under 100 KB.
- Directory renders every card server-side (Google indexes them all); a small client script filters. No pagination: "Show 24 more" or lazy render past 48.
- Filters live in the URL (`/games/?players=solo&minis=agnostic&price=free`) so YouTube descriptions can link to filtered views.
- Sorts: Recently covered (default), Most viewed, A to Z, Newest to directory, Price low to high.
- Zero results: suggest loosening the last filter.
- ⌘K modal: keep type tabs; if the query matches a facet value ("solo", "free", "grimdark") offer a "Browse N solo games" row. Index tagline, setting, publisher and the "If you like X" names.
- No hosted search (Algolia etc.) below ~1,000 entries.

### 6. Connecting videos and popularity to games

Build-time joins only; the nightly scheduled build (already exists, `trigger-rebuild.js`) keeps them fresh. A failed fetch leaves the last good data.

- **Recently covered:** group vlogs by `games[]`, take each game's newest `pubDate`, sort. Videos with `games: []` still appear in Latest videos.
- **Most viewed:** a fetch writes `src/data/views.json` (`{slug: {views30d, viewsAllTime}}`). Fetch failure keeps the previous file and the build succeeds. Games under 10 views in the window are excluded.

| Source | Effort | Notes |
| --- | --- | --- |
| GA4 Data API (service account, `pagePath` begins `/games/`) | Medium | **What the site runs today** |
| YouTube `statistics.viewCount` summed per game | Low | Audience interest, not site traffic; fallback or a "Most watched" toggle |

### 7. Mobile, SEO, redirects

- No URL goes away; merged slugs 301 in `_redirects`; new landing pages go in the sitemap.
- Index everything; filtered query-string URLs get `rel=canonical` to the unfiltered page.
- Structured data: `ItemList` on directory pages, `VideoObject` on video pages with `about` the game, Product/Game schema on game pages.
- Mobile: homepage under four screens at 390 px; carousels; filter drawer with a sticky "Show N games" button; 44 px tap targets; covers at 2 sizes, `loading=lazy` below the fold. Test on a real phone.
- Budget: homepage under 200 KB before images; `index.json` under 100 KB; no client JS on game pages beyond search. PageSpeed mobile ≥95 still applies.

### 8. Phases

| Phase | Scope | Ships |
| --- | --- | --- |
| 1. Data normalization | Facet fields on all games (script drafts, Matt reviews), `games[]` on vlogs, redirects | **Done 10-02**, pending Matt's review |
| 2. Directory + filters | `/games/` as the full directory; type pages reuse it; `index.json`; filter rail/drawer; URL state; facet landing pages; breadcrumbs and facet chips on game pages | **Done 10-02**, not deployed |
| 3. Homepage | New section order; Recently covered + Latest videos; Browse-by chips; mobile carousels; one newsletter form; staff picks via `pinned` | **Done 10-03**, not deployed |
| 4. Popularity + automation | `views.json`; Most viewed with month/all-time; games prompt for new vlogs; build hook on upload | **Dropped** (Matt, 10-06) |

**Not in scope:** user accounts, ratings or comments, hosted search, the Substack migration, the Warmachine hub redesign.

### Working rules

1. Start each phase by reading this file and `src/content.config.ts`.
2. Data changes go through scripts, committed for review; never hand-edit 100+ files.
3. Never delete or rename a route. Every removed or merged slug gets a 301.
4. No `noindex` anywhere.
5. One game card component everywhere a game is listed.
6. The build must succeed when `views.json` or any fetch is missing or stale.
7. Check the homepage at 390 px before calling any phase done.
