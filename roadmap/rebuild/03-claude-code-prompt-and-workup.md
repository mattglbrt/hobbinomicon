# Claude Code — Rebuild Prompt & Phased Workup

Two parts. **Part A** is the master prompt: paste it into Claude Code at the repo root as the first message of a fresh session (after Matt has reviewed `url-map-posts.csv`). **Part B** is the phase-by-phase workup — each phase is one Claude Code session, one `dev` → `main` merge, with acceptance criteria that must pass before the next phase starts. Give Claude Code one phase at a time; don't paste all of Part B at once.

---

## Part A — Master prompt (paste verbatim)

```
You are re-architecting hobbinomicon.com, an Astro 6 static site deployed to Netlify. Read CLAUDE.md,
STATUS.md, voice.md, src/content.config.ts, and everything in roadmap/rebuild/ before doing anything.
The rebuild plan lives in roadmap/rebuild/01-review-and-strategy.md, 02-information-architecture-and-migration.md,
and 04-hubs-content-plan.md (Warmachine / Spearhead hub content).
The per-URL migration map is roadmap/rebuild/url-map-posts.csv, url-map-pages.csv and url-map-legacy-404s.csv. Treat those CSVs as
the source of truth for what moves where; do not invent new URLs.

POSITIONING (drives every copy and layout decision):
"The Hobbinomicon — find your next indie wargame, then learn to paint it."
Two surfaces: /games/ (find) and /guides/ (learn). Warmachine and Warhammer (Spearhead, 40k, Old World) are mainstream
ON-RAMPS at /warmachine/ and /warhammer/ whose job is to funnel readers sideways into indie games.
Everything else is feeder content (/vlog/, /series/) or support (/about/, /newsletter/).

NON-NEGOTIABLES:
1. Every URL in the current live sitemap (roadmap/rebuild/old-sitemap-urls.txt) must resolve after the
   rebuild: either unchanged (200) or a single 301 to a URL that exists in dist/. No chains, no 404s.
   The redirect rules are generated, not hand-written — see scripts/generate-redirects.mjs in Phase 1.
2. Do not delete or rewrite CLAUDE.md conventions: work on `dev`, one merge to `main` per phase, use
   `npx astro build` (not npm run build) to verify so the YouTube prebuild does not fire.
3. Keep every existing collection (games, studios, people, news). Keep the funnel (src/utils/funnel.ts),
   Pagefind, JSON-LD, llms.txt, RSS, the transcript pipeline, and public/_redirects (prepend, never
   replace).
4. Voice: all copy follows voice.md, polished register. No AI tells. No stock phrases. Matt's
   one-liners in game/guide frontmatter are his; do not rewrite them.
5. No AI-generated imagery anywhere (site policy: "100% Human Made Content & Art").
6. Do not run scripts that touch the YouTube API (sync-vlogs, update-descriptions, etc.) unless a phase
   explicitly says so.
7. Mobile first (GSC: mobile CTR is 2x desktop). Lighthouse mobile must stay ≥ 95 performance, CLS ≈ 0. Inline CSS stays.
8. NOTHING gets noindexed and nothing is deleted from the index. Every page keeps its transcript and post. More indexed content is the goal, not less.
9. The second hub is /warhammer/ — a single top-level page for now, grouped by `system` (40k, The Old World, Spearhead…). Do NOT build /warhammer/{system}/ routes yet; reserve the slugs via the `system` enum so the split is a template change later, not a migration — see 04-hubs-content-plan.md, "Implication for the hub naming". It launches when it has ≥3 guides; Spearhead is a section within it that stays "coming soon" until City of Ash content exists. Never launch an empty hub or an empty section without a planned-models list.

WORKING STYLE:
- Before each phase, restate the acceptance criteria and list the files you will touch. Then do it.
- Commit in small, named steps on `dev`. Do not merge to `main` until I say the phase passes.
- When a content decision is Matt's to make (a title, a verdict, a faction list), leave a
  `<!-- MATT: ... -->` comment in the file and list all of them at the end of the phase.
- End every phase by updating STATUS.md and roadmap/rebuild/PROGRESS.md.

Start with Phase 0 from roadmap/rebuild/03-claude-code-prompt-and-workup.md: the audit and safety net.
Do not start Phase 1 until I confirm.
```

---

## Part B — Phased workup

### Phase 0 — Audit & safety net (½ session)

**Goal:** nothing can be lost.

1. Save the live sitemap: fetch `https://hobbinomicon.com/sitemap-0.xml`, write every `<loc>` path to `roadmap/rebuild/old-sitemap-urls.txt` (431 lines; already saved by this workup).
2. Create `scripts/verify-migration.mjs`: reads `old-sitemap-urls.txt`, `public/_redirects`, `netlify.toml` redirects, and `dist/`; for each old URL asserts it exists in `dist/` **or** matches exactly one redirect whose target exists in `dist/` and is not itself redirected. Prints a table; exits 1 on any failure. This is the gate for every later phase.
3. Create `scripts/generate-redirects.mjs`: reads `url-map-posts.csv` + `url-map-pages.csv` + any `legacySlug` in guides frontmatter, emits the block in `_redirects.rebuild` format, and writes it to the top of `public/_redirects` between `# BEGIN REBUILD` / `# END REBUILD` markers (idempotent). Include both slash variants, `301!` for explicit rules, unforced splats last.
4. Tag the current `main` as `pre-rebuild`. Branch `dev` from it.
5. Cross-check `gsc-pages.csv` against `url-map-posts.csv`: any `vlog` row with ≥3 clicks becomes `promote-guide`; log changes in `PROGRESS.md`.
6. **Legacy 404 fix (ship this immediately, before Phase 1 — it's a standalone win):** add the rules from `url-map-legacy-404s.csv` to `public/_redirects`, and `git show 48d6f7c^:src/content/blog/resources/<file>` to restore `warriors-of-athena-figure-list`, `solo-coop-gaming-resources`, `trench-crusade-resources`, `warmachine-resources`, `chainmail-miniatures-checklist`, `painting-references-maximus-infinity` into `src/content/blog/resources/` at their original URLs for now (Phase 1 moves them with everything else). Merge to `main` as its own deploy.

**Accept when:** `verify-migration.mjs` runs green against the *current* build (every old URL exists as-is), the redirect generator produces a file byte-identical to `_redirects.rebuild` (before GSC adjustments), `pre-rebuild` tag exists, and the six restored resource pages build at their old URLs with the legacy redirects live.

### Phase 1 — Content model & moves (1 session)

**Goal:** the new collections exist and every file is in its new home; no templates yet.

1. `src/content.config.ts`: add `guides` and `series` collections per `02-…md §2`; rename `blog` → `vlog` (base `./src/content/vlog`), add optional `series` ref + `episode` number; change `games.format` enum to `skirmish | army | narrative | ttrpg | boardgame`; add `games.hub`. Update `warmachine.mdx` (`format: army`, `hub: warmachine`). Add `age-of-sigmar-spearhead.mdx` stub (`tier: big`, `format: skirmish`, `hub: spearhead`, `draft: true`, `<!-- MATT -->` for verdict/how-to-start).
2. Write `scripts/migrate-content.mjs` driven by `url-map-posts.csv`:
   * `promote-guide` → `git mv` to `src/content/guides/{slug}.mdx`; set `legacySlug`, `videoTitle` (= old title), `topic` (from tags: painting/basing/terrain/airbrushing/sculpting/resin-casting/3d-printing/kitbashing/solo-rpg/review/unboxing/buying-selling → mapped), `game` (from `game` column, only if a games entry exists), `hub` (warmachine tag → warmachine; warhammer tag → warhammer), `difficulty: beginner`. Leave `title` as-is for now (Phase 3 rewrites).
   * `series` → `git mv` to `src/content/vlog/{slug}.mdx` with `series:` ref + `episode:` (parse from title; `<!-- MATT -->` where ambiguous). Create `src/content/series/kingdom-death-monster.mdx` and `kal-arath.mdx`.
   * `vlog` → `git mv` to `src/content/vlog/{slug}.mdx`, no frontmatter changes.
   * `keep-resource` (Mage Knight) → `src/content/guides/mage-knight/{x}.mdx`, `game: mage-knight`, `topic: getting-started`, `legacySlug`.
   * `keep-article` → `src/content/articles/{slug}.mdx` (new tiny collection or reuse `vlog` with `kind: article` — choose reuse; fewer collections).
3. Update `scripts/sync-vlogs.js` output path to `src/content/vlog/`. Update `astro.config.mjs` `getCollectionDates` paths.
4. Run `generate-redirects.mjs`.

**Accept when:** `npx astro sync` passes schema validation with zero errors; `git status` shows only renames + frontmatter edits; `npm run validate-schema` green; every file in `url-map-posts.csv` exists at its mapped path; `PROGRESS.md` lists every `<!-- MATT -->`.

### Phase 2 — Routes, templates & redirects (1–2 sessions)

**Goal:** the new site builds and the migration gate is green.

1. Delete `src/pages/blog/`, `categories/`, `explore.astro`, `videos/`, `games/large-scale-army.astro`, `games/mass-battle.astro`. Add `games/army.astro`.
2. New routes: `guides/index.astro`, `guides/[topic].astro`, `guides/[...slug].astro` (+ `.md.ts` GEO twin), `guides/mage-knight/…` handled by slug nesting; `series/index.astro`, `series/[series]/index.astro`, `series/[series]/[episode].astro`; `vlog/[...page].astro` (index, paginated 24), `vlog/[slug].astro`; `articles/…`; `warmachine.astro`, `warhammer.astro` (shared `HubLayout`; the Warhammer hub groups by `system`, the Warmachine hub by `faction`; no per-system routes yet); `newsletter.astro`.
3. Templates:
   * **GuideLayout** — H1 = `title`; sub = `videoTitle` if different; `LiteYouTube`; meta pill row (topic · game · difficulty · time); **written body first**; `MaterialsCard` (with affiliate disclosure line when any `affiliate: true`); `StepsList` if `steps`; transcript in `<details>` at the bottom (keep `rehypeTranscriptWeight`); "More for {game}" (guides with same `game`), "Watch the series on YouTube" CTA; `HowTo` + `VideoObject` + `BreadcrumbList` JSON-LD.
   * **Game page** — regroup the existing "Builds & Series" into: Start here (guides `topic: getting-started` + the page's own How to Start) · Painting guides · Terrain & basing · Series · News · Funnel · `GetItCard` (official/store/kickstarter with disclosure). Sections render only when non-empty.
   * **HubLayout** (`/warmachine/`, `/warhammer/`) — hero with Matt's one-line pitch; "Start here" (3 hand-picked guides, `<!-- MATT -->`); "Painting guides by faction" (group guides with `hub` by `faction`); "My armies" (hand-written MDX body); latest news with `relatedGame`; **"If you paint {hub}, you'll love…"** — the funnel section fed from `relatedGames` on the game entry (set 3 indie picks each, `<!-- MATT -->`); YouTube CTA to the hub's channel/playlist.
   * **Vlog page** — existing BlogLayout (indexed, full transcript kept) plus: "Part of" line linking the game/project, a "Guides for this" block (guides sharing `game` or top tag), prev/next within the same series or month, and `VideoObject` + `BreadcrumbList` JSON-LD. No robots meta.
   * **Studio / Person** — add auto "Games · News · Guides" sections from references.
   * **Home** — hero value line + dungeon sub-line; "Find a game" (format tiles + 6 featured); "Learn to paint" (6 latest guides); two on-ramp cards (Warmachine / Spearhead); news (6); newsletter.
   * **Header** — Games · Guides · Warmachine · Spearhead · News · [search]. Footer Explore column: Series · Vlog archive · Articles · Studios · People · Newsletter · RSS.
4. Sitemap: everything except `/search`, `/contact-success`, `/404`. Tag pages get a one-line intro so each is a page, not a bare list.
5. `og:image` via `getImage()` 1200×630. `BreadcrumbList` on every layout.
6. Update `llms.txt` / `llms-full.txt` / `search-index.json.ts` / `rss.xml.ts` for the new collections; guides outrank vlogs in search results.
7. `npx astro build && node scripts/verify-migration.mjs`.

**Accept when:** build green; `verify-migration.mjs` green (0 missing, 0 chains); `npm run validate-schema` green; Lighthouse mobile ≥95 on `/`, a guide, a game, `/warmachine/`; every page in a browser click-through of the 5 nav items + footer; no page shows an empty section heading.

### Phase 3 — Content upgrade: guides (2–4 sessions, batched by topic)

**Goal:** the 95 promoted posts become guides Google can distinguish from vlogs.

For each guide, working in batches of ~15 by `topic`:
1. Rewrite `title` to search intent (pattern: *How to Paint X* / *X Recipe (paints listed)* / *How to Start Playing X* / *X Review*). Keep `videoTitle`. Update `description` (≤155 chars, includes the primary phrase).
2. From the transcript, write the **body**: 150–400 words intro (what/why/result), then `steps` (3–8 imperative sentences) and `materials` (paints, tools — names only; Matt adds URLs/affiliate later). Do not pad. If the transcript genuinely lacks steps, write what's there and flag `<!-- MATT: needs steps -->`.
3. Set `difficulty`, `timeMinutes` where the video states it, `faction` for hub guides.
4. Internal links: ≥1 to the game page (if `game`), ≥1 to a sibling guide, ≥1 to the topic landing.
5. Voice check against voice.md §3–4 — no lists of adjectives, no "in this guide we will", no "dive in".

Slug changes are only allowed when the old slug is wrong for the new title; then set `legacySlug` and re-run `generate-redirects.mjs`.

**Accept when:** all 95 have body ≥150 words outside transcript, `steps` ≥3 or a MATT flag, validate-schema green, verify-migration green (slug changes covered), and a spot-read of 5 random guides passes the voice check.

### Phase 3b — Evergreen list articles (ongoing, 1 per session)

GSC shows one list article (painting competitions 2026) earning 10% of all site clicks. Build the family under `/articles/`: *Indie wargame Kickstarters live this month* (from `news` with `kind: kickstarter`, auto-updated), *Free skirmish rulesets*, *Miniature-agnostic games you can play with what you own* (from `games` with `miniatureAgnostic: true`), *Solo wargames* (from `games` with `solo: true`). The last two are generated from the directory, so they update themselves as games are added. Each has a hand-written intro in voice.md register and an `updatedDate` bump on every regeneration.

### Phase 4 — On-ramp hubs & funnel (1 session + Matt's input)

1. Warmachine: faction map, order, and hub structure are in `04-hubs-content-plan.md` — use it. Hand-write the hub body from Matt's answers; set `relatedGames` on `warmachine.mdx` (3 indie picks), clear `hideFunnel`. Group existing Warmachine guides by `faction`; render empty factions as "coming soon" cards listing the planned models.
2. Spearhead: build the hub file and the game entry on the same template with the City of Ash teams + a Terrain group as empty groups (see `04-hubs-content-plan.md`), `draft: true`. It goes live the day the first three Spearhead guides exist — **do not launch an empty hub**. Until then, 40k/Old World guides live on `/guides/painting/` with `hub: spearhead` already set, so the hub is populated the moment it launches.
3. `GetItCard` + affiliate disclosure component; wire `storeUrl`/`kickstarterUrl`.
4. Newsletter: Buttondown embed on `/newsletter/`, homepage, guide footer; RSS-to-email for `news`.

**Accept when:** the Warmachine hub renders with ≥3 start-here guides, a non-empty funnel, and the YouTube CTA; the Spearhead hub builds locally with `draft` cleared and renders its empty states cleanly, then is re-drafted; disclosure appears wherever an affiliate link does.

### Phase 5 — Cutover & SEO (½ session + 8 weeks of monitoring)

Follow `02-…md §5` steps 10–17. Additionally: run `update-descriptions.cjs` (YouTube API — explicitly allowed here) to point video descriptions at `/guides/` URLs; delete `_posts_inventory.csv` from the repo root; compact `SESSION_LOG.md`.

**Accept when:** GSC sitemap resubmitted, 20 old URLs spot-checked in a browser, Netlify 404 log empty for old-sitemap paths after 48h.

---

## Phase order rationale

Model → moves → routes → redirects all land in Phases 1–2 so that the *first* deploy is URL-complete. Content rewriting (Phase 3) is the long tail and can deploy incrementally — a guide with the old title at its new URL is still better than the old page, and Google re-evaluates on each update. Hubs (Phase 4) wait for Matt's inputs and for Spearhead videos to exist. Never deploy Phase 2 without Phase 0's verifier green.
