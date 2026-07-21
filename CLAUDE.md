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
  generates MDX in `src/content/blog/vlogs/`, auto-tags, downloads thumbnails,
  and fetches the transcript. Only processes videos not already present.
- **`scripts/backfill-transcripts.js`** — re-fetches transcripts for vlogs that
  are missing a `## Transcript` section. YouTube auto-captions (ASR) usually
  aren't ready in the first hours after upload, so videos synced too early get
  no transcript and were never revisited. This self-heals that. Default mode
  only re-checks vlogs published in the last 21 days (`BACKFILL_WINDOW_DAYS`) to
  stay cheap; `node scripts/backfill-transcripts.js --all` scans every vlog.
- **`scripts/lib/fetch-transcript.js`** — shared transcript fetch + clean.
- **`scripts/lib/format-transcript.js`** — splits a transcript blob into
  paragraphs; used for both new and backfilled transcripts.

Some videos genuinely have **0 caption tracks** on YouTube — those correctly
have no transcript, and the windowed backfill will add one automatically if/when
YouTube generates captions.

Transcripts are embedded as a `## Transcript` markdown section in the MDX body
(not via a frontmatter field or component).

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

---

## Session workflow (Everyway standard — added 2026-07-21)

This repo follows the standard in `../_system/PLAYBOOK.md` (MDG Growth root; venture context in `../CLAUDE.md`).

- **Start:** `/orient` — read `STATUS.md`. Roadmaps (`roadmap/*.md`) stay the deep planning docs; STATUS.md is the one-page rollup.
- **End:** `/wrap` — append a `SESSION_LOG.md` entry (newest first), refresh `STATUS.md`, update `../PROJECTS.md` row if the picture changed.
- Writing anything reader-facing? `voice.md` is law (it is the master copy; yellowimp mirrors it).
