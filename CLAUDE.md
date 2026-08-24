# The Hobbinomicon — project notes for Claude

Astro site (hobbinomicon.com) deployed on Netlify. Content is a mix of authored
posts and auto-synced YouTube vlogs.

## Deploy workflow — IMPORTANT (conserves Netlify build credits)

Netlify deploys **only off `main`**. Every push to `main` triggers one build;
pushing 5–10 times a day burned 5–10 builds.

- **Do day-to-day work on the `dev` branch.** Commit features one at a time and
  push to `dev` as often as you like — this triggers **zero** builds.
- **Deploy by merging `dev` → `main` and pushing once** — that is the single
  build. Then switch back to `dev`.
  ```bash
  git switch main && git merge dev && git push && git switch dev
  ```
- Use a normal merge (not squash) for `dev` → `main` so the branches don't
  diverge and future merges stay clean.
- Do NOT push directly to `main` for routine work — batch via `dev` instead.

A scheduled Netlify function (`netlify/functions/trigger-rebuild.js`,
`schedule: '@daily'`) rebuilds the site once a day to auto-publish new vlogs.
This is intentional — keep it.

## Vlog sync + transcript pipeline

`prebuild` runs: `sync-vlogs.js → backfill-transcripts.js → download-hero-images.js`

- **`scripts/sync-vlogs.js`** — fetches new channel videos (YouTube Data API),
  generates MDX in `src/content/blog/vlogs/`, prompts for tags, downloads
  thumbnails, and fetches the transcript. Only processes videos not already
  present.
- **`scripts/lib/prompt-tags.js`** — the tag prompt. **Tagging is manual**
  (Matt, 07-28): keyword matching only *prefills a suggestion*, and nothing
  reaches frontmatter without someone pressing Enter on it. Enter accepts the
  suggestion, `?` lists the 69 live tags by category, `s` leaves the post
  untagged. Input is validated against `src/data/tags.json`; a retired tag is
  rejected with the tag it became (read out of `public/_redirects`, which is
  the canonical "this became that" record), and a near-miss gets a
  did-you-mean. Untagged posts are listed in the closing report.

  Why manual: auto-tagging was set to rebuild the junk taxonomy the 07-22
  collapse removed, one new vlog at a time, and nobody would have noticed until
  the registry drifted again. Video cadence is dropping, so the per-video cost
  is now small.

  **The prompt must never block a build.** Without a TTY (Netlify's prebuild,
  CI, or `--no-prompt`) it is skipped and the post is created with **no** tags
  rather than guessed ones. That's safe for the same reason transcripts are:
  Netlify-built vlog posts are ephemeral, and the committed local file wins.
- **`src/data/tag-keywords.json`** — suggestion keywords, keyed by the 69 live
  tags and nothing else. Read the `_rules` before editing. Matching is a plain
  substring count with **no word boundaries**, so a keyword that's a substring
  of a common word fires on every video — `ork` used to match "work" 903 times
  across 77% of the corpus. Prefer plurals, phrases, or proper nouns.
- Retired 2026-07-28: `scripts/auto-tag-posts.js`. A bulk keyword tagger that
  rewrote tags across *existing* posts from keyword matches alone. It was never
  wired to an npm script, but with tagging now manual it was one stray
  invocation away from undoing hand-tagged frontmatter across the corpus.
  Deleted rather than documented-around.
- **`scripts/backfill-transcripts.js`** — re-fetches transcripts for vlogs that
  are missing a `## Transcript` section. YouTube auto-captions (ASR) usually
  aren't ready in the first hours after upload, so videos synced too early get
  no transcript and were never revisited. This self-heals that. Default mode
  only re-checks vlogs published in the last 21 days (`BACKFILL_WINDOW_DAYS`) to
  stay cheap; `node scripts/backfill-transcripts.js --all` scans every vlog.
- **`scripts/lib/fetch-transcript.js`** — shared transcript fetch + clean.
  Returns `{ status, text }`, where status distinguishes `no-captions` from
  `blocked`. Do not collapse that back to a bare string (see below).
- **`scripts/lib/normalize-transcript.js`** + **`scripts/transcript-normalize.json`**
  — corrects recurring ASR manglings of proper nouns at fetch time. Read the
  `_rules` in the JSON before adding entries; the dangerous mistake is adding a
  variant that's also valid English.
- **`scripts/lib/excerpt.js`** — builds the meta description, skipping the
  throat-clearing that opens most transcripts.
- **`scripts/lib/format-transcript.js`** — splits a transcript blob into
  paragraphs; used for both new and backfilled transcripts. Strictly mechanical,
  no word changes — keep it that way.

Some videos genuinely have **0 caption tracks** on YouTube — those correctly
have no transcript, and the windowed backfill will add one if/when YouTube
generates captions.

Transcripts are embedded as a `## Transcript` markdown section in the MDX body
(not via a frontmatter field or component).

### Transcripts only reach the site from a local sync (found 07-21)

**YouTube blocks the caption endpoint from datacenter IPs.** Every transcript
fetch fails on Netlify and succeeds from a home connection. So `prebuild` can
create a post but can never give it a body, and `backfill-transcripts.js` — the
thing written to self-heal missing transcripts — has never once succeeded in a
Netlify build. This hid for six weeks because the failure was swallowed and
logged identically to "this video has no captions."

The consequence: **a vlog is a thin, transcript-less page on the live site until
someone syncs locally and commits it.** Netlify-generated posts are ephemeral;
committed files win, because sync skips videos that already have a file.

So the ritual, weekly-ish:

```bash
npm run refresh-vlogs   # sync + backfill + normalize + heroes, then git status
git add src/content/blog/vlogs && git commit && # merge dev -> main to deploy
```

If a fetch is ever blocked, both scripts now print a loud banner rather than
filing it under "no captions." A proxy would let Netlify do this itself; that
was considered and deferred (cost + complexity) rather than overlooked.

## The funnel ("if you like X, try Y")

`src/utils/funnel.ts` + `src/components/FunnelSection.astro`, rendered as a
full-width card section after the body on every game page.

- **Editorial picks win.** `relatedGames` in frontmatter comes first, in order,
  and is never filtered — no score threshold, no out-of-print exclusion. If
  Matt says try it, the site says try it.
- **Remaining slots are scored** from the rest of the directory, so a game with
  no `relatedGames` still gets an onward path. Out-of-print games are excluded
  *as suggestions* (pointing at something nobody can buy is a dead end) but
  still *receive* a funnel — a graveyard entry is the best possible place for
  one.
- **Scoring leans on structured fields, not tags.** `format` (4), `solo` (3),
  `miniatureAgnostic` (3), tier (1), cost band (1), plus shared tags weighted
  by inverse document frequency and capped at 3. The cap matters: game tags are
  ad-hoc (`grimdark`, `bounty-hunters`, `mage-knight`) and on a ten-game corpus
  a shared `fantasy` means almost nothing — half the directory carries it —
  while a one-off tag would otherwise outrank a format match.
- **Below `MIN_SCORE` (3), nothing renders.** No padding with "latest" or
  "pinned" filler. Showing an empty section beats shipping a non-sequitur, and
  a bare format match already clears the bar.
- The visible reason line under each card ("Skirmish · Mini-agnostic · Cheap to
  start") is what makes it a funnel rather than a list of links. Keep it.

Cards reuse `ImageCard` with the same props as `GameGrid`, so a suggestion
looks like the thing it links to.

`hideFunnel: true` in a game's frontmatter suppresses the section on that
game's page. Set on Warmachine (2026-08-11): it is the only large-scale-army
entry, so scored suggestions have no format peer and fall back to thin tag
overlap. Clearing the flag or adding `relatedGames` brings it back.

**Checking this in a browser: build and serve `dist`, don't use `astro dev`.**
Card images are `loading="lazy"`, and on the dev server they are also
transformed on demand, so a screenshot taken right after scrolling catches them
mid-load and the cards read as empty gradients. That is not a missing-image
bug — nine of eleven games have a `heroImage`. Note `astro preview` does not
work here either (the Netlify adapter rejects it); `python3 -m http.server`
inside `dist/` does.

## YouTube description footer pass

`scripts/update-descriptions.cjs` is the **only** description writer. It appends
the standard footer (directory or game-specific link, newsletter, Discord) to
every video, leaving title/tags/categoryId untouched. Skipping is content-based,
not id-based: a video already carrying the exact desired description is skipped,
so the pass is safely re-runnable and self-healing.

- **Always `npm run backup-descriptions` first** — it snapshots all live
  snippets to `scripts/backups/`. That backup is the only undo.
- Dry run, then `--run --max 190`. Each update costs 50 quota units against a
  10,000/day limit, so a full pass takes two days. Priority (playlisted +
  game-mapped) videos go first, so a quota-limited day covers what matters.
- The OAuth app is unverified → **refresh token dies after 7 days**. Expect
  `npm run youtube-auth` before most passes. This is a **closed decision**
  (Matt, 07-21): these scripts run locally only, and Google verification isn't
  worth it for a one-machine tool. Don't propose publishing the app again.
- Retired 2026-07-21: `push-descriptions.cjs` + the `descriptions/` text corpus
  (gitignored, still on disk). It matched description files to videos by fuzzy
  title similarity and would have pushed the wrong description to a short-titled
  video. `update-descriptions.cjs` matches on video ID and supersedes it.
  Unrelated despite the name: `backfill-descriptions.js` fills empty
  `description:` frontmatter in MDX from transcripts — nothing to do with
  YouTube-side descriptions.

## BONEZONE 2026 is a hub — link everything to it

`src/content/news/bonezone-2026-open.mdx` (`/news/bonezone-2026-open/`) is the
canonical page for Matt's BONEZONE 2026 entry. **Every other piece of BONEZONE
content on the site links back to it** (Matt, 08-23): Royal Herald painting
vlogs, progress posts, the finished-model post, any follow-up news. One hub,
spokes pointing in.

That matters most for **synced vlogs**, which arrive as generated MDX with no
links in the body. When a vlog is about the Royal Herald or the competition, add
the link by hand after `npm run refresh-vlogs` — the sync will not do it for
you, and a Netlify-built vlog post is ephemeral, so the edit has to be committed.

Competition closes 31 October 2026 (23:59 UK). After that the hub still holds:
point results and post-mortems at it too, rather than starting a second page.

---

## Session workflow (Everyway standard — added 2026-07-21)

This repo follows the standard in `~/Documents/dev/_system/PLAYBOOK.md` (MDG Growth root; venture context in `../CLAUDE.md`).

- **Start:** `/orient` — read `STATUS.md`. Roadmaps (`roadmap/*.md`) stay the deep planning docs; STATUS.md is the one-page rollup.
- **End:** `/wrap` — append a `SESSION_LOG.md` entry (newest first), refresh `STATUS.md`, update `../PROJECTS.md` row if the picture changed.
- Writing anything reader-facing? `voice.md` is law (it is the master copy; yellowimp mirrors it).
