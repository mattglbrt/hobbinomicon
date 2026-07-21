# STATUS — The Hobbinomicon · updated 2026-07-21

## Now
Live on Astro 6 (README still says Astro 5 — stale). v2 baseline shipped: three-entity directory, format-based game URLs, News pillar, SEO/perf pass (Lighthouse mobile high-90s), search improvements (05-12). Daily scheduled rebuild auto-publishes vlogs. YouTube description footer pass is ~76% done (204 of 269 videos, all priority ones covered). Tag audit done 07-08: 279 posts / 349 distinct tags / **290 unregistered** vs the 99-tag canonical set; 5-phase cleanup plan ready in `roadmap/tags.md`.

## Next (ranked)
1. **Last 65 YouTube descriptions** — one quota day's work. `npm run youtube-auth` (token expires 07-22), `npm run backup-descriptions`, then `node scripts/update-descriptions.cjs --run --max 190`. All remaining videos are non-priority; the evergreen/game-mapped set is already done.
2. **Funnel mechanic v1** ("if you like X, try Y") — biggest visible gap from the v2 vision; schema ready, rendering + tag-fallback + backfill not.
3. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form is wired, engine missing.
4. Tag cleanup phases 1-2 (lock taxonomy ~120-140, extend `tag-normalize.json`); fix the generator so junk stops regrowing daily.
5. Monster Friends project entry + backfill `project:` on posts.
6. Schedule the recurring maintenance (validate-schema, Lighthouse, tag-audit, link-rot) — currently unscheduled.

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- YouTube OAuth refresh token expires 07-22 — `npm run youtube-auth` before any API work. Staying unverified/local-only is a closed decision (Matt, 07-21); the 7-day re-auth is accepted cost, not a problem to solve.
- Comments moderation has no pending-notification (manual D1 SQL checks only).

## Recently done
- 07-21 — 190 video descriptions updated (0 errors); fixed a quota-burning rewrite loop; stripped the legacy "Website & Blog" block from 232 videos; retired `push-descriptions.cjs`. Then synced 9 vlogs (06-16 → 07-10) and fixed sync-vlogs so the new footer stops leaking into post descriptions/tags; cleaned the transcript on the latest post.
- 07-08 — full tag audit. 06-09 — first tag normalization pass (`466ed2f`). 05-12 — search + hero-cache work.

## Open questions
- Delete the now-unused `descriptions/` corpus (232 files) and `descriptions_pushed.json`? Both gitignored, both dead since `push-descriptions.cjs` was retired.
- Tagline alternatives? Newsletter provider? Moderation alerting approach?
