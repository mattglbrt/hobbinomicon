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
