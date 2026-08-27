# Rebuild progress

One section per phase. Written at the end of each phase, before the merge to
`main`. Acceptance criteria come from `03-claude-code-prompt-and-workup.md`.

| Phase | State | Merged to `main` |
|---|---|---|
| 0 — Audit & safety net | **complete** | **yes, 2026-08-26** |
| 1 — Content model & moves | **complete** | **yes** |
| 2 — Routes, templates & redirects | **complete** | **yes** |
| 3 — Content upgrade: guides | **complete** | **yes** |
| 3b — Evergreen list articles | not started | |
| 4 — On-ramp hubs & funnel | hubs live, funnel waiting on Matt's `relatedGames` | partially |
| 5 — Cutover & SEO | **in progress** — deployed; GSC steps outstanding | |

**Live since 2026-08-26.** `main` at `f86252d`. PageSpeed Insights mobile
scores **100** on every page checked, against a target of 95.

**After Phase 5 (Matt, 08-26):** fold the `roadmap/games.md` § "Directory
to-do" recommendations into the content to-do list. Not before — the phases
come first.

---

## Phase 0 — Audit & safety net

Branch `dev`, commits `56c3166`, `ef7fc83`, `c77ad3e`, `26b6fb2`.

### Acceptance

| Criterion | Result |
|---|---|
| `verify-migration.mjs` green against the current build | **431 / 431 OK**, 0 missing, 0 chains |
| Redirect generator byte-identical to `_redirects.rebuild` | **yes**, md5 `adb4c7e940a96aa71c6cd4e3149c9f2f` |
| `pre-rebuild` tag exists | **yes**, on `main` at `5e82a0c` |
| Six resource pages build at their old URLs, legacy redirects live | **yes**, 6 × 200 + 22 × 301 |

### What shipped

**`scripts/verify-migration.mjs`** — the gate. Reads the 431-URL pre-rebuild
sitemap, the `netlify.toml` redirects, the emitted `dist/_redirects` and `dist/`
itself, and asserts every old URL either still serves 200 or takes exactly one
301 to a page that exists. 404s, 301s into 404s, chains and loops fail the run
and exit 1.

It reads `dist/_redirects` rather than `public/_redirects`, because the Netlify
adapter merges the two and the merged file is what deploys. Chain detection is
order-agnostic across the two rule files: rather than depend on which file
Netlify evaluates first, it flags a target that matches any live rule in either.
A wrong assumption there can only make the check stricter.

Tested against known-bad input before being trusted: it correctly reports 404 on
a deleted page, and correctly reports a two-hop chain when a synthetic
`/videos/* → /games/` rule turns the existing `netlify.toml` `/vlogs/* →
/videos/` rule into a chain. That cross-file chain is real and arrives in Phase
2 — `/videos/*` starts redirecting then, and `/vlogs/*` has to be repointed in
the same commit.

**`scripts/generate-redirects.mjs`** — builds the rule block from the three
`url-map-*.csv` files plus any `legacySlug` in guides frontmatter, so redirects
stay generated. `--check` proves byte-identity with the reviewed reference
block; `--write` splices into `public/_redirects` between `# BEGIN REBUILD` /
`# END REBUILD` markers and is idempotent across repeat runs; `--only-live`
filters to what is safe to ship before the rebuild exists.

Both are wired as `npm run verify-migration` and `npm run generate-redirects`.

**The six restored resource pages**, from `48d6f7c^`, at their original
`/blog/resources/` URLs. Restored verbatim in one commit and made to build in
the next, so the diff between Matt's file and what the current schema forced is
readable.

**22 legacy-404 redirects.** With the six restored pages, 28 of the 58 URLs in
`url-map-legacy-404s.csv` now resolve. The other 30 need `/guides/`, `/vlog/`,
`/series/`, `/articles/` and `/warmachine/` to exist, and ship in Phase 2.

### GSC cross-check (step 5)

**No rows changed.** Every `vlog` row in `url-map-posts.csv` has fewer than 3
clicks in the 16-month GSC export, so nothing crossed the promote-guide bar. The
95/158 split stands as generated.

The nearest misses, left as `vlog`, all sit at 1–2 clicks:
`crucible-guard-base-test-results`, `first-one-piece-event-prep`, `lego-dnd-prep`
and `taking-a-look-at-inquisitor-kroyle` at 2; ten more at 1.

`crucible-guard-base-test-results` is worth a second look at Phase 3 even so.
`04-hubs-content-plan.md` names it as existing Crucible Guard content, and
Crucible Guard is the faction that has to reach three guides before the
Warmachine hub can launch. Two clicks is not the argument; hub completeness is.

Five `/blog/*` URLs with 3+ clicks are absent from the post map. All five are
legacy 404s covered by `url-map-legacy-404s.csv`, not gaps — and three of them
are pages restored in this phase, which had been throwing away 18 clicks between
them:

| Clicks | URL |
|---|---|
| 7 + 3 | `/blog/resources/warriors-of-athena-figure-list/` |
| 5 | `/blog/resources/solo-coop-gaming-resources/` |
| 3 | `/blog/resources/trench-crusade-resources/` |
| 3 | `/blog/campaigns/dolmenwood/` (now 301s to `/tags/dolmenwood/`) |

### Bug found and fixed

`mageknight-resources.mdx` passed `tag="mage knight"` to `TaggedPostsList`,
which matches the raw tag string. Tags have been slugs since the 07-22 collapse,
so "My Mage Knight Content" has been rendering *"No posts found with this tag
yet. Check back soon!"* on a live page for a month. The two restored hub pages
had the identical bug. All three now list four posts.

### Held back on purpose

* **All six catch-alls.** `/blog/* → /guides/` and friends are unforced, so a
  real file shadows them — but `/blog/campaigns/*` and `/blog/characters/*` have
  no files behind them and would fire straight into a missing `/series/` and
  `/vlog/`. They ship in Phase 2 with their targets.
* **The 12 slug-variant rows.** Each could redirect to today's `/blog/vlogs/`
  URL, but the map is the source of truth and Phase 2 regenerates the block
  against the real targets. Interim targets buy a few weeks and risk a chain.
* **`/blog/resources/competition-painting-guides/`.** Not restorable — it is not
  in the tree at `48d6f7c^`. Its mapped target
  `/articles/online-painting-competitions-2026/` arrives in Phase 2. Flagged
  because the live version of that article is the site's third page by clicks
  (128), so this is the most valuable single URL still 404ing.

### Decisions — resolved by Matt, 2026-08-26

1. **`{/* MATT */}`, not `<!-- MATT -->`, inside MDX.** MDX has no HTML comments
   and an `<!--` breaks the build. The convention holds for every later phase in
   `.mdx`; `.astro` and `.md` files keep the HTML form.
2. **Warriors of Athena: tag deleted.** The page keeps `tags: ["resources"]`
   only. No game entry, no tag. Flag cleared.
3. **Chainmail: both senses, settled.** The July collapse folded `chainmail`
   into `metallics`, which read the word as the armour. The first call was that
   the tag means the game; the pre-collapse data showed three of its four uses
   were painting Norman mail, and Matt's revision was to keep the tag on those.

   So `chainmail` is back in the registry as a **technique** tag (70 live tags,
   registry still 1:1) and sits alongside `metallics` on
   `probably-not-the-worst-chainmail-tutorial-ever`,
   `more-progress-on-the-normans` and `hobby-vlog-and-terrain-inspiration`. The
   `/tags/chainmail` and `/rss/chainmail.xml` 301s are deleted — the page is
   real again, and `prompt-tags.js` reads `public/_redirects` as the canonical
   "this became that" record, so leaving them would have made the tag prompt
   reject `chainmail` as retired.

   The Chainmail *game* checklist keeps `tags: ["dungeons-and-dragons",
   "resources"]`. The tag is the armour; the game is served by
   `dungeons-and-dragons`. Say so if you want the checklist carrying `chainmail`
   too.

   Housekeeping: `chainmail` was dropped from the `metallics` description and
   from its keyword list so the two do not double-count in the tag prompt.

4. **Splat ordering fixed.** `CATCH_ALLS` in the generator now sorts by prefix
   length descending, so `/blog/characters/*` and `/blog/campaigns/*` emit above
   `/blog/*` and actually fire. Sorting in code rather than trusting the
   authored order means adding a rule later cannot reintroduce the bug.
   `_redirects.rebuild` was regenerated: four lines moved, nothing else, md5
   `2ae618c9…` → `adb4c7e9…`. The Phase 0 byte-identity criterion passed against
   the original block before this intentional change.
5. **`netlify.toml` still sends `/vlogs/*` to `/videos/`.** Fine today. In Phase
   2 `/videos/*` starts redirecting and that becomes a chain, so it gets
   repointed to `/vlog/` in the same commit.
6. **`/blog/resources/competition-painting-guides/` stays 404** until Phase 2, on
   Matt's call. Not restorable from git; its mapped target
   `/articles/online-painting-competitions-2026/` arrives with the Phase 2
   routes.

### Netlify normalises trailing slashes

`02-…md` §4 states that Netlify treats `/x` and `/x/` as separate for explicit
rules, which is why the generator emits both variants. Checked against the live
site rather than carried forward as an assumption:

```
/tags/age-of-sigmar   301 -> /tags/warhammer/
/tags/age-of-sigmar/  301 -> /tags/warhammer/     (rule is written without the slash)
/tags/hobby-zen       404                          (rule ships in this phase)
```

So the 496 hand-written tag rules, which only carry the bare form, are fine at
the canonical slashed URL. The verifier had been reporting the slashed form of
every retired tag as a 404; it now normalises, matching observed behaviour. The
generator still emits both variants — it costs nothing and doubled explicit
rules are the safer shape for forced rules during cutover.

### Notes carried into Phase 1

* `dev` was left where it was rather than re-branched from `pre-rebuild`;
  re-branching would have dropped `ad30fb6`, the 08-24/25 wrap commit.
* `dist/tags/` holds exactly 69 entries after the restore. The tag registry is
  still 1:1 and the restored pages did not resurrect a retired tag page.
* A failed MDX build empties `dist/`, and the next `astro build` can report
  "0 page(s) built" off stale state. `rm -rf dist .astro` before trusting a
  build that follows a failure.


---

## Phase 1 — Content model & moves

Branch `dev`. No templates: this phase moves files and changes the model, and
**the site does not build at the end of it.** That is by design — the workup
lands model, moves, routes and redirects across Phases 1–2 so the first deploy
is URL-complete. **Phase 1 must not be merged to `main` on its own.**

### Acceptance

| Criterion | Result |
|---|---|
| `npx astro sync` passes schema validation, zero errors | **yes**, 7 collections |
| `git status` shows only renames + frontmatter edits | **yes**, 293 renames + 1 rename git scored below its similarity threshold |
| Every file in `url-map-posts.csv` at its mapped path | **288 / 288** |
| `PROGRESS.md` lists every `<!-- MATT -->` | **yes**, 38 flags below |
| `npm run validate-schema` green | **deferred to Phase 2** — it walks `dist/`, and `dist/` cannot be built until the routes exist |

### The model

`blog` → `vlog`, plus two new collections and two extended ones.

* **`vlog`** (183) — the daily archive, the 19 series episodes, and 3 essays.
  One collection, not three: they share a schema and a template lineage, and
  the routes tell them apart. `series` + `episode` mark an episode, `kind:
  'article'` marks an essay. `category` became optional — the collection is the
  category now, and `/categories/` retires in Phase 2. Existing values are left
  alone rather than stripped.
* **`guides`** (111) — the 95 promoted posts, the 13 Mage Knight resource pages,
  and 3 of the pages restored in Phase 0.
* **`series`** (2) — Kingdom Death: Monster, Kal-Arath.
* **`games`** — `format` merged `large-scale-army` and `mass-battle` into
  `army`; `hub` added. Warmachine is now `format: army`, `hub: warmachine`.
  `age-of-sigmar-spearhead.mdx` added as a `draft: true` stub with `hub:
  warhammer`.

Four fields the spec in `02-…md` §2 left out are carried on `guides` rather than
dropped, because dropping them would have lost data: `project` (16 guides),
`resourceType` (13), `projectSection` (4) and `hideRelatedPosts`. `games.relatedProjects`
still points at project slugs, so `project` in particular had to survive.

### The move

`scripts/migrate-content.mjs`, driven entirely by `url-map-posts.csv`. It never
picks a destination; the CSV does. Frontmatter it writes is mechanical — `topic`
from tags, `hub` from tags, `game` from the CSV column but only when a directory
entry exists, `videoTitle` from the old title. Everything needing judgement is a
flag, not a guess. Moves go through `git mv`, so history follows.

It is idempotent: a file already at its destination is skipped, so a partial run
finishes by running again.

### Two things that would have broken Phase 2

**Relative imports.** 275 files moved up a directory level, so every
`from '../../../components/YouTubeEmbed.astro'` became wrong. Rewritten to the
correct depth per file; the 3 Mage Knight guides stay at three levels because
they are nested one deeper. All 306 relative imports in `src/content` now
resolve.

**`astro build` exits 0 with the collection missing.** With `blog` gone and the
old routes still calling `getCollection('blog')`, the build printed "The
collection "blog" does not exist or is empty" 13 times, emitted **61 pages
instead of 433**, and returned **exit code 0**. Nothing in the build would have
stopped that reaching production. `verify-migration.mjs` caught it: 372 MISSING,
exit 1. This is the failure mode the gate exists for, and it is worth
remembering that the build alone is not a safety net.

### Phase 2 work list, from the build

13 files still call `getCollection('blog')`:
`SearchModal.astro`, `TaggedPostsList.astro`, `blog/[...page].astro`,
`blog/[...slug].astro`, `categories/[category].astro`, `categories/index.astro`,
`explore.astro`, `games/[slug].astro`, `rss.xml.ts`, `rss/[tag].xml.ts`,
`tags/[tag].astro`, `tags/index.astro`, `utils/videoCollections.ts`. Plus the
type aliases in `filterDrafts.ts`, `collections.ts` and `geoContent.ts`.

### Redirect generator changes

* `legacySlug` rules are now **deduped against the CSVs**. `migrate-content.mjs`
  sets `legacySlug` on everything it moves, and every move is already a CSV row,
  so without the dedupe the block emitted all 288 rules twice. `legacySlug`
  starts carrying its own weight in Phase 3, when a rewritten title changes a
  slug the CSVs know nothing about.
* A guide nested in a directory named after a game renders under that game —
  `/games/mage-knight/army-checklist/`, not `/guides/mage-knight/…`. The
  generator now knows that, so a Phase 3 slug change there produces the right
  target. **Phase 2's routes must follow the same rule.**
* `url-map-legacy-404s.csv`: five of the six restored pages had targets that
  fold the page into a hub or game page. Repointed at the pages themselves.

### Directory gaps this surfaced

Four games are named in the migration map with no directory entry, so `game:`
was left unset on those posts rather than emitting a reference that fails the
build:

| Game | Posts affected |
|---|---|
| `kingdom-death-monster` | 19 (the whole series) + 5 vlogs |
| `warhammer-aos-40k` | 17 |
| `dolmenwood` | 11 |
| `necromunda` | 3 |

Kingdom Death is the sharp one: it has a series hub, 16 episodes and no game
page. `01-…md` §2a puts it plainly — game pages are 60% of clicks, and "every
new game entry is worth more than ten videos."

### MATT flags — 38

**19 × topic guessed as "painting".** The tag gave no better signal. Every one
is a promoted guide, so the topic is at least in the right family; these want a
skim, not a rewrite. Phase 3 revisits each of them anyway.

```
2-color-nmm-easy-peasy-style              how-to-strip-metal-models-call-to-arms-vlog-prep-day-1
dolmenwood-official-figures-…             how-to-use-dirty-down-rust-creating-blood-gore-part-2
how-to-create-a-dolmenwood-character      i-built-90-goblins-in-5-days
how-to-glaze-for-fun-and-profit           i-fixed-my-contrast-paint-problems
how-to-marble-paper                       making-zines-is-easy-with-the-right-tools
how-to-paint-pale-orc-flesh               paint-a-trench-pilgrim-warband-in-2-hours
how-to-paint-pale-orc-skin-orktober-…     painting-butcher-klaus-minicrate
how-to-paint-trench-crusade-communicant   spicing-up-some-relic-blade-tokens
how-to-paint-trench-pilgrims-fast         the-jankiest-rust-tutorial-ever
                                          two-minute-trench-crusade-battle-recap
```

**7 × `hub: warhammer`, `system` unset.** 40k, The Old World or Spearhead? The
value reserves the future `/warhammer/{system}/` slug, so it is worth getting
right once: `easy-mode-goblin-faces`, `how-to-paint-pale-orc-flesh`,
`how-to-paint-pale-orc-skin-orktober-…`,
`how-to-start-commission-painting-and-why-you-maybe-shouldn-t`,
`i-built-90-goblins-in-5-days`, `midnight-kitbashing`, `preshading-90-goblins`.

**5 × episode number not in the title.** `kal-arath-live-play-session-1`,
`next-episode-of-kal-arath-is-almost-ready`,
`kingdom-death-monster-antelope-fight`,
`kingdom-death-monster-lantern-year-4-settlement-phase`,
`kingdom-death-monster-lantern-year-5`. Ordering the series hub needs these.

**7 × placement and content calls.**

1. `games/age-of-sigmar-spearhead.mdx` — the stub. Needs your `verdict`, the
   how-to-start body, `costToStart`/`boardSize`, and the three funnel picks
   before `draft` comes off.
2. `series/kingdom-death-monster.mdx` and 3. `series/kal-arath.mdx` — the
   descriptions are placeholders in your register, not your words, and both use
   the default hero image. Rewrite before `/series/` ships in Phase 2.
4. `guides/painting-references-maximus-infinity.mdx` — kept as its own guide;
   the legacy map would have folded it into `/games/infinity/`.
5. `vlog/trench-crusade-resources.mdx` — kept as
   `/articles/trench-crusade-resources/`; the legacy map says the content is
   already merged into the game page and 301s it away.
6. `vlog/warmachine-resources.mdx` — kept as `/articles/warmachine-resources/`;
   the legacy map sends it to the hub, which lands in Phase 4.
7. `vlog/chainmail-miniatures-checklist.mdx` — kept as a list article; the
   legacy map offers the graveyard or a `/games/chainmail/` entry.

4 through 7 are the same question in four places: **you restored these six pages
in Phase 0, and the legacy map — written before that — folds four of them into
hubs.** Keeping them is what non-negotiable 8 asks for and it is reversible.
Say the word and any of them folds with a 301 instead.


---

## Phase 2 — Routes, templates & redirects

Branch `dev`, commits `8da7311`, `6aa29e0`, plus the browser-pass fixes.
**This is the first phase that is deployable**, and it ships Phase 1 with it.

### Acceptance

| Criterion | Result |
|---|---|
| `npx astro build` green | **yes**, 441 pages |
| `verify-migration.mjs` green | **431 / 431**, 121 unchanged + 310 single 301s, 0 chains, 0 missing |
| `npm run validate-schema` green | **yes**, 442 pages, 0 required missing |
| No page shows an empty section heading | **yes** — scanned every built page; the only hits were nested headings and tables |
| Browser click-through of nav + footer | **yes** — home, both hubs, a guide, and the transcript `<details>` |
| Lighthouse mobile ≥95 | **cannot run yet — see below** |

### Lighthouse

Not installed locally, and `CLAUDE.md` makes PageSpeed Insights *mobile* the
ground truth rather than a local run — which needs a public URL, so it cannot
happen until this merges. The structural proxies are all clean:

* CSS still inlined, **zero** render-blocking stylesheets.
* Every in-flow image carries width and height. The only dimensionless `<img>`
  is the hidden lightbox element, which is pre-existing and out of flow.
* Page weights are unchanged against the pre-rebuild pages: 177–217 KB of HTML,
  same band as before.
* `og:image` got *lighter* — 1200×630 WebP instead of the full-size original.

**Run PSI mobile on `/`, a guide, a game and `/warmachine/` immediately after
the deploy.** If anything has slipped it will be the guide template, which is
the only one with a new above-the-fold shape.

### What shipped

Deleted `/blog/`, `/categories/`, `/explore/`, `/videos/`,
`/games/large-scale-army/`, `/games/mass-battle/`. Added `/guides/` (index,
9 topic landings, detail + `.md` twin), `/vlog/` (paginated 24, detail + twin),
`/series/` (index, 2 hubs, episodes + twins), `/articles/`, `/games/army/`,
`/games/{game}/{guide}/`, `/warmachine/`, `/warhammer/`, `/newsletter/`.

`GuideLayout` gives a tutorial a shape a diary entry does not have: a
search-intent H1 with the YouTube title as a subhead, a meta pill row,
`MaterialsCard` (whose affiliate disclosure is part of the component, so there
is no way to render a paid link without it), `StepsList`, and `HowTo` +
`VideoObject` + `BreadcrumbList` JSON-LD. The transcript collapses into a
`<details>` on guides and stays open on vlogs — on a vlog the transcript *is*
the post.

`src/utils/content.ts` owns the URL rules. One collection now renders at three
URL shapes and three places must agree: this file, the routes, and
`generate-redirects.mjs`.

### Five things the build did not catch

The build was green while all of these were wrong. Each was caught by the
migration gate or the link audit.

1. **`/vlogs/*` in `netlify.toml` pointed at `/videos/`**, which this phase
   deleted — a 301 into a 404. Exactly the chain flagged in Phase 0's notes.
2. **`VlogLayout` built guide URLs as `/guides/{id}/`**, wrong for the 13 Mage
   Knight guides that render under their game. It takes resolved hrefs now.
3. **`/games/` still advertised two army-scale shelves** and filled one.
4. **59 internal links still pointed at retired URLs.** Rewritten from the
   url-map CSVs so links and redirects share one source of truth. Seven remain,
   all pre-existing links to retired tag feeds that 301 correctly.
5. **The Warmachine hub was rendering the funnel Matt had switched off.**
   `hideFunnel` is set on Warmachine because it is the only army-scale entry,
   so scored suggestions fall back to thin tag overlap. The hub honours it now:
   no funnel until `relatedGames` is set, because "showing an empty section
   beats shipping a non-sequitur" applies hardest on the page whose whole job
   is pointing sideways.

### Hub state

Both clear the three-guide bar, so both launch.

* **`/warmachine/`** — 5 guides. Crucible Guard has 2, filed from Matt's own
  `crucible-guard` tag. The other six factions render their planned-model lists
  from `04-hubs-content-plan.md`. Three guides are "Not faction-specific",
  which is honest: they are about technique or the hobby, not an army.
* **`/warhammer/`** — 9 guides, all currently under "Also painting" because
  none carries `system` yet. 40k, The Old World and Spearhead render their
  planned lists. No per-system routes were built; the enum reserves the slugs.

### Still open, and why

* **Lighthouse/PSI** — needs the deploy.
* **`START_HERE_SLUGS` on `/warmachine/` is empty**, so "Start here" is the
  three newest guides rather than Matt's picks. `04-hubs` suggests the Crucible
  Guard scheme guide, army-wide base prep, and buying/selling/trading.
* **Neither hub has a funnel** until `relatedGames` is set on `warmachine.mdx`.
  Phase 4's job.
* **Both hub bodies and both `series` descriptions are placeholders** in a
  register that is not Matt's. They must be rewritten before this is public —
  they are the only prose on the site I wrote that a reader will see.
* **`system` unset on 9 Warhammer guides**, so the hub cannot group them.
* **`/articles/rss-feeds/` links seven retired tag feeds.** They 301 correctly;
  the page itself wants a pass in Phase 3b.


---

## Phase 3 — Content upgrade: guides

Branch `dev`, many commits. Shipped with the same merge as 0–2.

### Acceptance

| Criterion | Result |
|---|---|
| Body ≥150 authored words | **99 of 101**; the two under are a link list and a Short, correctly short |
| `steps` ≥3 or a flag | **75 guides emit `HowTo`**, up from 0. The other 26 are reference pages where `HowTo` would be false schema |
| `validate-schema` green | yes |
| `verify-migration` green | yes, 431/431 throughout |
| Voice spot-check | Matt approved the register at the four-guide pilot, before scaling |

### What the plan got wrong

The workup assumed guides were transcript-only and budgeted ~95 rewrites.
Measured properly, **82 already had 150+ authored words**. The real work was
`steps`/`materials` — which nothing had, which is why zero `HowTo` was emitting,
the thing `01-…md` calls the single biggest rich-result win available.

It also assumed every promoted post was a guide. Nine were diary entries and are
now back in `/vlog/`, and one was a duplicate of another and was merged.

### Three bugs found by reading, not by any check

1. **Nine guides rendered as empty pages.** Their written body sat under a
   `## Transcript` heading using `###` subheadings, which do not terminate the
   block, so the whole article was swept into the collapsed `<details>`.
   `how-to-speed-paint-faces` went from 0 visible words to 802.
2. **One page was publishing song lyrics.** A video with music over silence
   transcribed the track, not Matt. Removed. Checked the rest of the corpus:
   the only one, but the failure mode recurs on any silent-with-music video.
3. **`normalize-transcripts` had been reading half the corpus** since Phase 1
   split guides out, and was missing two of Matt's own proper nouns —
   Kal Arath and the Mnemosyne notebook.

### The deploy failed the first time

`CLAUDE.md` says to verify with `npx astro build` so the YouTube prebuild does
not fire. Following that for the whole rebuild meant **the `prebuild` chain
Netlify actually runs was never exercised against any Phase 1 path change.**
Two bugs were waiting there, and the daily vlog-sync build had already failed on
them at midnight:

* `sync-vlogs` only scanned `src/content/vlog` when deciding whether a video
  already had a post, so the ~95 videos promoted into `guides` looked unsynced
  and it recreated **86 duplicate posts every build**.
* The MDX it generates still imported `../../../components/`, three deep, when
  posts now land two deep. That alone would have broken the build on the next
  real video, duplicates or not.

Both fixed, plus the same half-corpus blindness in `backfill-transcripts`,
`download-hero-images` and six tag/description scripts. Reproduced the failure
locally rather than guessing, then verified with `npm run build` end to end.

**The lesson worth keeping: `npx astro build` is not the build.** Anything that
changes a content path has to be checked against `npm run build` before a merge,
even though that costs an API call.

### Still open

* `relatedGames` on `warmachine.mdx` — no funnel renders on the hub until it is
  set, and `hideFunnel` is honoured deliberately.
* `START_HERE_SLUGS` on the Warmachine hub is empty, so "Start here" is the
  three newest guides rather than Matt's picks.
* Both hub bodies and both series descriptions are still in my register.
* Both series entries use the site default hero image.
* 17 "topic guessed as painting" flags — low stakes, Matt is working through them.
* `chainmail-miniatures-checklist` and `painting-references-maximus-infinity`
  fold into their game pages the moment those pages exist.
