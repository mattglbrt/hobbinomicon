# STATUS — The Hobbinomicon · updated 2026-07-21

## Now
Live on Astro 6 (README still says Astro 5 — stale). v2 baseline shipped: three-entity directory, format-based game URLs, News pillar, SEO/perf pass, search improvements. Deployed earlier today: 9 new vlogs, six weeks of missing transcripts, a hardened vlog pipeline. **GEO output built and deployed this evening** — `/llms.txt`, `/llms-full.txt`, and a `.md` rendering of all 316 public pages, all statically generated so the daily rebuild keeps them current. YouTube description footer pass ~76% done (204/269, all priority videos covered). **Transcripts only reach the live site from a local sync** — YouTube blocks caption fetches from Netlify's IPs, so `npm run refresh-vlogs` weekly is load-bearing (see `_system/RECURRING.md`). Tag audit 07-08: 279 posts / 349 tags / **290 unregistered** vs the 99-tag canonical set; plan in `roadmap/tags.md`.

## Next (ranked)
1. **Confirm the GEO outputs are live** once the build lands — `/llms.txt`, `/llms-full.txt`, and one `.md` URL (e.g. `/games/kal-arath.md`). Only remaining unknown is whether Netlify emits them exactly as the local build did.
2. **Last 65 YouTube descriptions** — one quota day. `npm run youtube-auth` → `npm run backup-descriptions` → `node scripts/update-descriptions.cjs --run --max 190`. All remaining are non-priority.
3. **Hand-clean two long transcripts** — `lava-rock-diorama-for-teaspoon-part-1` (3,620 words) and `planning-a-new-hobby-room-layout` (3,241). The other six synced posts are too short to be worth it.
4. **Funnel mechanic v1** ("if you like X, try Y") — biggest visible gap from the v2 vision; schema ready, rendering + tag-fallback + backfill not.
5. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form is wired, engine missing.
6. Tag cleanup phases 1-2 (lock taxonomy ~120-140, extend `tag-normalize.json`); fix the generator so junk stops regrowing daily. Today's sync added ~30 more tag instances.
7. Monster Friends project entry + backfill `project:` on posts.
8. **Port the GEO pattern to aloneinthedungeon.com and mattglbrt.com** — `src/utils/markdownExport.ts` and `geoContent.ts` are close to portable; only the collection schemas differ. Do it after Hobbinomicon's version has been live long enough to shake out.

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Matt: serve `.md` as `text/plain` so it renders in-browser instead of downloading? `nosniff` is site-wide and Netlify types `.md` as `text/markdown`. One `[[headers]]` block in `netlify.toml`. Not applied — changes a whole file class, and `text/markdown` is arguably more correct.
- YouTube OAuth token expires 07-22 — `npm run youtube-auth` before API work. Staying unverified/local-only is a closed decision (07-21); the 7-day re-auth is accepted cost, not a problem to solve.
- Comments moderation has no pending-notification (manual D1 SQL checks only).

## Recently done
- 07-21 (evening) — GEO output built: `/llms.txt` (25KB curated index, directory-first), `/llms-full.txt` (274KB, no split needed), and `.md` renderings of 316 pages with vlog transcripts intact. Descriptions lifted from frontmatter, no new copy. robots.txt was **not** blocking any AI crawler; named the major ones explicitly as a guardrail. Zero impact on HTML pages — nothing pre-existing touched but robots.txt; schema validation passes on all 692. Merged `dev`→`main` and pushed (3 commits, one build, `890e8e3`). Matt verified the earlier 07-21 transcript deploy.
- 07-21 (pm) — Found transcripts never reach the site from Netlify builds (YouTube blocks datacenter IPs; failure was silent for six weeks). Synced 9 vlogs, cleaned + linked the newest post, fixed the footer leaking into descriptions/tags, added blocked-fetch reporting, `lib/excerpt.js`, and `transcript-normalize.json`. Merged `dev`→`main` (6 commits, +3,311/−359). Created `_system/RECURRING.md` + dashboard panel.
- 07-21 (am) — 190 video descriptions updated; fixed a quota-burning rewrite loop; stripped the legacy "Website & Blog" block from 232 videos; retired `push-descriptions.cjs`.
- 07-08 — full tag audit. 06-09 — first tag normalization pass (`466ed2f`).

## Open questions
- Should `/llms.txt` be linked from the site (footer, or a `<link rel="alternate">` on pages)? Nothing references it yet; discovery is crawler-side only.
- Delete the now-unused `descriptions/` corpus (232 files) and `descriptions_pushed.json`? Both gitignored, both dead.
- Mirror the `_system/PLAYBOOK.md` §5 edit into `clients/_system/`? That tree is outside this working directory.
- Worth a transcript proxy so Netlify can fetch captions itself, or is the weekly local sync fine? (Deferred on cost/complexity.)
- Tagline alternatives? Newsletter provider? Moderation alerting approach?
