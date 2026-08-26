# The Hobbinomicon — New Information Architecture, Sitemap & SEO Migration Plan

## 1. New sitemap

```
/                                   Home — value line, "Find a game" grid, "Learn to paint" guide tiles,
                                    Warmachine + Warhammer on-ramp cards, latest news, newsletter

/games/                             Directory hub (intro + featured per format + sponsor slot)
/games/skirmish/                    format landing
/games/army/                        format landing (merges large-scale-army + mass-battle + rank & flank)
/games/narrative/                   format landing
/games/ttrpgs/                      format landing (secondary)
/games/solo/                        cross-cut: solo:true
/games/graveyard/                   status: oop
/games/{slug}/                      GAME HUB — take · specs · how to start · Start-here guides ·
                                    painting guides · terrain/basing · series · news · funnel · GetItCard
/games/mage-knight/{guide}/         13 archived Mage Knight guides (nested resource pages)

/warmachine/                        ON-RAMP HUB (pillar). Start here · factions · painting guides ·
                                    my armies · news · "If you paint Warmachine, try…" funnel
/warhammer/                         ON-RAMP HUB (pillar), same template. ONE page for now, grouped by `system`.
/warhammer/{system}/                RESERVED, not built yet: /warhammer/40k/, /warhammer/the-old-world/,
                                    /warhammer/spearhead/, more GW games later. Split when a system has
                                    ≥6 guides; the hub keeps working unchanged because guides already
                                    carry `system`.

/guides/                            All guides, filterable by topic + game
/guides/painting/                   topic landing
/guides/basing-and-terrain/         topic landing
/guides/airbrushing/                topic landing
/guides/sculpting-casting-3d-printing/
/guides/kitbashing/
/guides/solo-rpg/
/guides/getting-started/            "How to start playing X" — one per game, mostly extracted from game pages
/guides/buying-and-selling/
/guides/{slug}/                     GUIDE — intent title, video, written steps, materials/recipe card,
                                    game ref, transcript collapsed, HowTo + VideoObject schema

/series/                            Campaign / live-play series index
/series/kingdom-death-monster/      series hub (16 eps)
/series/kal-arath/                  series hub
/series/{series}/{episode-slug}/    episode page (indexed; these have narrative value)

/news/  /news/{slug}/  /news/kickstarter/  /news/indie-game-news/      unchanged
/studios/  /studios/{slug}/                                            unchanged, add auto "mentioned in" sections
/people/   /people/{slug}/                                             unchanged, same

/articles/                          Essays, lists (was /blog/articles/)
/articles/{slug}/

/vlog/                              Daily hobby vlog archive (paginated, indexed)
/vlog/{slug}/                       individual vlogs — indexed, transcript + post, structured template

/newsletter/                        Archive + signup (Buttondown embed)
/about/ /contact/ /buy-sell-trade/ /privacy-policy/ /terms-of-service/ /ai-disclosure/ /disclaimer/   unchanged
/tags/ /tags/{tag}/                 kept, all indexed; footer-only link
/rss.xml /rss/{tag}.xml /llms.txt /llms-full.txt                       unchanged
```

**Removed (all 301):** `/blog/*` listings, `/categories/*`, `/explore/`, `/videos/*`, `/games/large-scale-army/`, `/games/mass-battle/`.

### Primary navigation (5 items, in this order)

**Games · Guides · Warmachine · Warhammer · News** — plus a search icon. About/Series/Vlog/Newsletter move to the footer "Explore" column. Two mainstream words in the nav is deliberate: they're the recognisable words a cold visitor scans for.

## 2. Content model changes

Keep every existing collection. Add two, rename one, extend one.

```ts
// NEW: guides (promoted from blog/vlogs)
const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),                 // search-intent title
    videoTitle: z.string().optional(), // original YouTube title
    description: z.string(),
    pubDate: z.coerce.date(), updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(), heroImageAlt: z.string().optional(),
    youtubeId: z.string().optional(),
    topic: z.enum(['painting','basing-and-terrain','airbrushing','sculpting-casting-3d-printing',
                   'kitbashing','solo-rpg','getting-started','buying-and-selling','review']),
    game: reference('games').optional(),        // drives game-page sections + hub pages
    hub: z.enum(['warmachine','warhammer']).optional(),  // on-ramp membership
    system: z.enum(['40k','the-old-world','spearhead','age-of-sigmar','kill-team','necromunda','other']).optional(),
                                                // within warhammer; extend the enum as GW games are added.
                                                // Values are the future /warhammer/{system}/ slugs — pick them once.
    faction: z.string().optional(),             // "Cygnar", "Stormcast Eternals"
    difficulty: z.enum(['beginner','intermediate','advanced']).default('beginner'),
    timeMinutes: z.number().optional(),
    materials: z.array(z.object({ name: z.string(), url: z.string().url().optional(), affiliate: z.boolean().default(false) })).default([]),
    steps: z.array(z.string()).default([]),     // feeds HowTo schema; body can elaborate
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    legacySlug: z.string().optional(),          // "vlogs/how-to-paint-…" — for the redirect generator
  }),
});

// NEW: series (KDM blind campaign, Kal Arath live play, future)
const series = defineCollection({ /* name, description, game ref, youtubePlaylist, heroImage */ });
// episodes live in blog collection with `series: reference('series')` + `episode: number`

// RENAME: blog → vlog (content/vlog/), schema unchanged + `series`/`episode` optional fields
// EXTEND: games.format → z.enum(['skirmish','army','narrative','ttrpg','boardgame'])
//         games.hub (optional) → 'warmachine' | 'warhammer' for the on-ramp entries
```

Add `src/content/games/age-of-sigmar-spearhead.mdx` (tier: big, format: skirmish, hub: warhammer, draft until content) — plus `bellwoken.mdx`, `greathelm.mdx`, `pillage.mdx` (indie; Matt's 2026 pipeline) and set `hub: warmachine` on `warmachine.mdx`. The hub pages at `/warmachine/` and `/warhammer/` are *not* game pages — they are pillar pages that pull from the game entry, the guides with `hub: x`, news with `relatedGame`, and a hand-written "start here" body. Game page for each still exists at `/games/{slug}/` and is the canonical entity; the hub is the marketing surface.

## 3. URL migration map

Full per-URL map is in **`url-map-posts.csv`** (288 rows: old_url, new_url, action, game, note) and **`url-map-pages.csv`** (non-post URLs). Summary:

| Old pattern | New | Action | Count |
|---|---|---|---|
| `/blog/vlogs/{slug}/` (guide-worthy) | `/guides/{slug}/` | 301, rewrite as guide | 95 |
| `/blog/vlogs/{slug}/` (diary/progress) | `/vlog/{slug}/` | 301, stays indexed | 158 |
| `/blog/vlogs/{slug}/` (KDM / Kal Arath eps) | `/series/{series}/{slug}/` | 301 | 19 |
| `/blog/resources/mageknight-{x}/` | `/games/mage-knight/{x}/` | 301 | 13 |
| `/blog/articles/{slug}/` | `/articles/{slug}/` | 301 | 3 |
| `/blog/` , `/blog/{n}/` | `/guides/` , `/vlog/` | 301 | 25 |
| `/videos/{collection}/` | topic landing / game / series (see pages csv) | 301 | 9 |
| `/videos/archive/*` | `/vlog/` | 301 | 6 |
| `/categories/*`, `/explore/` | `/guides/` | 301 | 5 |
| `/games/large-scale-army/`, `/games/mass-battle/` | `/games/army/` | 301 | 2 |
| 148 legacy URLs in GSC that currently 404 | see `url-map-legacy-404s.csv` | 301 (+ restore 6 resource pages from git `48d6f7c`) | 60 explicit + 6 splats |
| everything else | unchanged | — | ~120 |

Rules: every 301 goes to the *final* URL (no chains). Slugs are preserved wherever possible — a guide's slug changes only if the title change makes the old slug misleading, and then the `legacySlug` field generates the redirect. Existing `public/_redirects` (496 tag rules) and `netlify.toml` rules stay; new rules are **prepended** (Netlify matches first-match-wins, and explicit rules must beat any splat).

## 4. Netlify redirects

`_redirects.rebuild` (generated) contains one explicit rule per moved URL, e.g.

```
/blog/vlogs/how-to-paint-trench-crusade-communicant/  /guides/how-to-paint-trench-crusade-communicant/  301!
/blog/vlogs/may-5-2026/                               /vlog/may-5-2026/                                 301!
/blog/resources/mageknight-stormfox-newbie-guide/      /games/mage-knight/stormfox-newbie-guide/         301!
/videos/miniature-painting-tutorials/                  /guides/painting/                                 301!
/blog/*                                                /guides/                                          301
```

Use `301!` (forced) on the explicit rules so a stale file in `dist/` can never shadow a redirect during the cutover build; the trailing splat is unforced. Also add the no-trailing-slash variants — Netlify treats `/x` and `/x/` separately for explicit rules. The generator script in the workup writes both.

**Because Astro builds static files, moved content must not also exist at the old path.** Delete `src/pages/blog/`, `src/pages/categories/`, `src/pages/explore.astro`, `src/pages/videos/` in the same commit the redirects land.

## 5. SEO migration runbook

**T-minus 1 week**
1. GSC export is done (`gsc-pages.csv`, `gsc-queries.csv`). Any URL slated `vlog` with clicks stays at a byte-identical slug.
2. Export Netlify Analytics top pages (or GA4) for the same check.
3. Record baseline: indexed count (Coverage report), top 50 queries, top 50 pages.
4. Run `npm run refresh-vlogs` one last time so transcripts are committed; freeze new vlog syncs into the new `vlog/` folder.

**Build (on `dev`)**
5. Content moves + new collections + templates + redirects (workup phases 1–4).
6. `npx astro build` (bypasses prebuild) and run the verification script: every URL in the *old* sitemap must return 200 at its old path (unchanged) or 301 → a URL that exists in `dist/`. Zero 404s, zero chains.
7. New sitemap: everything except `/search`, `/contact-success`, `/404`. Vlogs, tags, series all in.
8. Every template emits `BreadcrumbList`; guides emit `HowTo` + `VideoObject`; games keep existing JSON-LD; hubs emit `CollectionPage`.
9. No `noindex` anywhere. Do not add robots.txt disallows either — Google must be able to crawl the 301s.

**Cutover (one merge to `main`)**
10. Merge, deploy, immediately spot-check 20 old URLs in a browser + `curl -I`.
11. GSC → Sitemaps → resubmit `sitemap-index.xml`. Do **not** use the Change of Address tool (same domain).
12. GSC → URL Inspection → Request indexing on: `/`, `/games/`, `/guides/`, `/warmachine/`, `/warhammer/`, and the 10 highest-traffic guides.
13. Run `update-descriptions.cjs` against the new URLs so YouTube descriptions point at `/guides/…` (fresh external links to the new URLs speed up re-crawl).
14. Update `llms.txt` / `llms-full.txt` generators to the new collections.

**T+1 to T+8 weeks**
15. Weekly: GSC Coverage → "Page with redirect" count should rise then plateau; "Not found (404)" should stay at zero for old-sitemap URLs. Netlify → Analytics → 404s.
16. Expect a 2–6 week impression dip on moved URLs. Guides typically recover and exceed by week 6–8 because of the title/schema upgrades. Restored resource pages and legacy redirects should show up as recovered impressions within 2–3 weeks.
17. Keep the redirects **forever**. They cost nothing.

## 6. What I need from you before Phase 2 (content) can run

* Spearhead: which factions you plan to paint first — even before videos exist, so the hub's faction grouping and "start here" slots are ready.
* Warmachine: your factions/armies list for the "my armies" section (Crucible Guard, Orgoth/Dusk are tagged already).
* Newsletter provider decision (recommend Buttondown).
* Confirm the 95/158 split in `url-map-posts.csv` — it's rule-generated; skim the `promote-guide` rows and flip anything that's actually a diary post to `vlog` (and vice versa) before the redirect file is generated.
* Decide which of the six deleted resource pages to restore (recommend all six — they had traffic).
