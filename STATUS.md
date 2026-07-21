# STATUS — The Hobbinomicon · updated 2026-07-21

## Now
Live on Astro 6 (README still says Astro 5 — stale). v2 baseline shipped: three-entity directory, format-based game URLs, News pillar, SEO/perf pass (Lighthouse mobile high-90s), search improvements (05-12). Daily scheduled rebuild auto-publishes vlogs. Tag audit done 07-08: 279 posts / 349 distinct tags / **290 unregistered** vs the 99-tag canonical set; 5-phase cleanup plan ready in `roadmap/tags.md`.

## Next (ranked)
1. **Last 65 YouTube descriptions** — 190 done 07-21 (quota cap), all priority (playlisted + game-mapped) videos covered; 65 non-priority left. Resume: `npm run youtube-auth` (token expires 07-22), `npm run backup-descriptions`, then `node scripts/update-descriptions.cjs --run --max 190`. One day's work.
2. **Funnel mechanic v1** ("if you like X, try Y") — biggest visible gap from the v2 vision; schema ready, rendering + tag-fallback + backfill not.
3. **Publish the YouTube OAuth app to production** — kills the 7-day refresh-token churn (`npm run youtube-auth` treadmill), the closest thing to a recurring pain point.
4. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form is wired, engine missing.
5. Tag cleanup phases 1-2 (lock taxonomy ~120-140, extend `tag-normalize.json`); fix the generator so junk stops regrowing daily.
6. Monster Friends project entry + backfill `project:` on posts.
7. Schedule the recurring maintenance (validate-schema, Lighthouse, tag-audit, link-rot) — currently unscheduled.

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL checks only).

## Recently done
- 07-21 — 190 video descriptions updated; fixed a rewrite loop + stripped the legacy "Website & Blog" link block from 232 videos; retired `push-descriptions.cjs` (fuzzy title matching, would have pushed a wrong description).
- 07-08 — full tag audit. 06-09 — first tag normalization pass (`466ed2f`). 05-12 — search + hero-cache work.

## Open questions
- Tagline alternatives? Newsletter provider? Moderation alerting approach?
