# STATUS — The Hobbinomicon · updated 2026-07-22

## Now
Live on Astro 6 (README still says Astro 5 — stale). v2 baseline shipped: three-entity directory, format-based game URLs, News pillar, SEO/perf pass, search improvements, and GEO output (`/llms.txt`, `/llms-full.txt`, `.md` renderings of 316 pages, verified live 07-21). **YouTube description footer pass is done: 269/269**, confirmed against the live API. Today also polished the two long vlog transcripts into written posts and swept the back catalogue for ASR manglings and junk meta descriptions.

**`main` is at `35d3eea`. `dev` is 4 commits ahead and undeployed** — today's work is committed and pushed but not live. **Transcripts only reach the live site from a local sync** — YouTube blocks caption fetches from Netlify's IPs, so `npm run refresh-vlogs` weekly is load-bearing (see `_system/RECURRING.md`). Tag audit 07-08: 279 posts / 349 tags / **290 unregistered** vs the 99-tag canonical set; plan in `roadmap/tags.md`.

## Next (ranked)
1. **Read the two polished posts, then deploy.** `planning-a-new-hobby-room-layout` and `lava-rock-diorama-for-teaspoon-part-1` are now written posts, not transcripts — reader-facing copy in Matt's voice, worth an eyeball before it goes live. Then one batched merge: `git switch main && git merge dev && git push && git switch dev`.
2. **Weekly `npm run refresh-vlogs`** — last sync 07-21. Load-bearing; Netlify cannot do this.
3. **Funnel mechanic v1** ("if you like X, try Y") — biggest visible gap from the v2 vision; schema ready, rendering + tag-fallback + backfill not.
4. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form is wired, engine missing.
5. Tag cleanup phases 1-2 (lock taxonomy ~120-140, extend `tag-normalize.json`); fix the generator so junk stops regrowing daily.
6. Monster Friends project entry + backfill `project:` on posts.
7. **Port the GEO pattern to aloneinthedungeon.com and mattglbrt.com** — `src/utils/markdownExport.ts` and `geoContent.ts` are close to portable; only the collection schemas differ.

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL checks only).
- ~~YouTube OAuth token expires 07-22~~ — token was still valid; pass completed. Re-auth still needed roughly weekly for future API work. Staying unverified/local-only is a closed decision (07-21).

## Recently done
- 07-22 — **Description pass finished at 269/269** (65 updated, ~3,250 quota units, verified 0 remaining). **Two long transcripts polished** to `voice.md` §3 and retitled; `## Transcript` heading dropped since the text is no longer verbatim. **Back-catalogue sweep:** 3 new `transcript-normalize.json` entries (Grymkin, diorama, Shadespire) → 20 fixes across 13 files; 12 raw-dump meta descriptions rebuilt; two real gaps fixed in `lib/excerpt.js` (interior hesitation particles, and `[ __ ]` redactions leaking into descriptions). Corpus now has zero filler-opening descriptions. `excerpt.js` itself was never broken — it postdates the affected posts by 24 minutes.
- 07-21 (evening) — GEO output built, deployed, verified live. `/llms.txt` byte-identical to local build; 316 `.md` pages serving as `text/markdown`. Surfaced the pubDate timezone bug and a genuine sort-tie fix (`17ce0c7`).
- 07-21 (pm) — Found transcripts never reach the site from Netlify builds (YouTube blocks datacenter IPs; silent for six weeks). Synced 9 vlogs, added blocked-fetch reporting, `lib/excerpt.js`, `transcript-normalize.json`. Created `_system/RECURRING.md`.
- 07-21 (am) — 190 video descriptions updated; fixed a quota-burning rewrite loop; retired `push-descriptions.cjs`.
- 07-08 — full tag audit. 06-09 — first tag normalization pass (`466ed2f`).

## Open questions
- **Normalize the 192 timezone-less `pubDate` values?** They read `"YYYY-MM-DD HH:MM:SS"`, which JS parses as *local* time, so those posts resolve to a different instant on Netlify (UTC) than locally — shifting ordering in RSS, the blog index, and GEO outputs. `sync-vlogs.js` now writes ISO-with-Z, so it's legacy data, not a live regression. Fix is a one-off script rewriting them as UTC. Cosmetic-only impact.
- **Is "skin mounds" the Grymkin warbeast "Skin and Moans"?** One occurrence, unverified, left as-is. Matt's call — if yes it's a `transcript-normalize.json` entry.
- A few regenerated descriptions are thin where the transcript opens weakly (`rambling-about-competitive-vs-fun-games`, `coffee-cup`). Hand-written blurbs would beat auto-generated. Worth it?
- Should the other 7 vlogs from the 07-21 sync get the same full-polish treatment, or is that only worth it for long ones?
- Should `/llms.txt` be linked from the site (footer, or `<link rel="alternate">`)? Discovery is crawler-side only.
- Delete the now-unused `descriptions/` corpus (232 files) and `descriptions_pushed.json`? Both gitignored, both dead.
- Mirror the `_system/PLAYBOOK.md` §5 edit into `clients/_system/`? That tree is outside this working directory.
- Worth a transcript proxy so Netlify can fetch captions itself? (Deferred on cost/complexity.)
- Tagline alternatives? Newsletter provider? Moderation alerting approach?
