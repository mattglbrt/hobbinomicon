# Rebuild progress

One section per phase. Written at the end of each phase, before the merge to
`main`. Acceptance criteria come from `03-claude-code-prompt-and-workup.md`.

| Phase | State | Merged to `main` |
|---|---|---|
| 0 — Audit & safety net | **complete, awaiting sign-off** | not yet |
| 1 — Content model & moves | not started | |
| 2 — Routes, templates & redirects | not started | |
| 3 — Content upgrade: guides | not started | |
| 3b — Evergreen list articles | not started | |
| 4 — On-ramp hubs & funnel | not started | |
| 5 — Cutover & SEO | not started | |

---

## Phase 0 — Audit & safety net

Branch `dev`, commits `56c3166`, `ef7fc83`, `c77ad3e`, `26b6fb2`.

### Acceptance

| Criterion | Result |
|---|---|
| `verify-migration.mjs` green against the current build | **431 / 431 OK**, 0 missing, 0 chains |
| Redirect generator byte-identical to `_redirects.rebuild` | **yes**, md5 `2ae618c9ed228d20ee8c2818b244bbd6` |
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

### Decisions for Matt

1. **`{/* MATT */}`, not `<!-- MATT -->`, inside MDX.** MDX has no HTML comments
   and an `<!--` breaks the build. The convention holds for every later phase in
   `.mdx`; `.astro` and `.md` files keep the HTML form.
2. **`warriors-of-athena-figure-list.mdx`** — the `warriors-of-athena` tag was
   retired in July with no replacement, so the page now carries only `resources`.
   Warriors of Athena has no game entry and no live tag. Directory entry, or is
   `resources` enough?
3. **`chainmail-miniatures-checklist.mdx`** — tagged `dungeons-and-dragons`. The
   retired `chainmail` tag redirects to `/tags/metallics/`, which reads the word
   as the armour rather than the game; one of the eight inferred mappings
   `CLAUDE.md` already flags. `url-map-legacy-404s.csv` offers `/games/chainmail/`
   or the graveyard.
4. **Splat ordering in `_redirects.rebuild` is wrong but harmless.** `/blog/*`
   precedes `/blog/campaigns/*` and `/blog/characters/*`, and Netlify is
   first-match-wins, so those two never fire. Every campaign and character URL
   Google knows about has an explicit forced rule above them, so this only
   affects unknown URLs, which land on `/guides/` instead of `/series/`. Left
   as-is because byte-identity with the reviewed block was the acceptance
   criterion; say the word and the generator reorders specific-before-general.
5. **`netlify.toml` still sends `/vlogs/*` to `/videos/`.** Fine today. In Phase
   2 `/videos/*` starts redirecting and that becomes a chain, so it gets
   repointed to `/vlog/` in the same commit.

### Notes carried into Phase 1

* `dev` was left where it was rather than re-branched from `pre-rebuild`;
  re-branching would have dropped `ad30fb6`, the 08-24/25 wrap commit.
* `dist/tags/` holds exactly 69 entries after the restore. The tag registry is
  still 1:1 and the restored pages did not resurrect a retired tag page.
* A failed MDX build empties `dist/`, and the next `astro build` can report
  "0 page(s) built" off stale state. `rm -rf dist .astro` before trusting a
  build that follows a failure.
