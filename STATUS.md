# STATUS — The Hobbinomicon · updated 2026-08-27

## Now
**The re-architecture is live.** Merged and deployed 2026-08-26; `main` at `f86252d`. PageSpeed Insights **mobile 100 on every page checked**, against a target of 95.

Positioning shipped: *find your next indie wargame, learn how to play and paint it*. Two surfaces — `/games/` and `/guides/` — with `/warmachine/` and `/warhammer/` as on-ramps. Nav is Games · Guides · Warmachine · Warhammer · News. `/blog/`, `/videos/`, `/explore/` and `/categories/` are gone and 301 cleanly.

**Every one of the 431 pre-rebuild URLs resolves** — 121 unchanged, 310 single 301s, zero chains. Verified against production on a 40-URL sample as well as locally. All 58 legacy 404s Google was still showing now resolve too.

- **438 pages**, up from 431. **75 guides emit `HowTo`**, up from none — `01-…md` calls that the biggest rich-result win available.
- **Collections:** vlog 190 · guides 101 · series 2 · games 12 · news 8 · people 8 · studios 6.
- **`npm run verify-migration` is the gate.** Every phase passed through it; it caught things the build did not, including a state where `astro build` exited 0 while emitting 61 pages instead of 433.
- **The first deploy failed.** `npx astro build` skips the `prebuild` chain, so two `sync-vlogs` bugs went unseen: it recreated 86 duplicate posts per build, and generated a three-deep component import for posts that now sit two deep. Both fixed. **The daily vlog-sync build had already been failing on this.** Lesson recorded in PROGRESS.md: anything touching a content path must be checked with `npm run build`, not `npx astro build`.

Still true: **transcripts only reach the live site from a local sync** — YouTube blocks caption fetches from Netlify IPs, so `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
0. **Phase 5 cutover, and it is time-sensitive.** Resubmit `sitemap-index.xml` in GSC (do NOT use Change of Address — same domain). Request indexing on `/`, `/games/`, `/guides/`, `/warmachine/`, `/warhammer/` and the top guides. Run `update-descriptions.cjs` so YouTube descriptions point at the new `/guides/` URLs — fresh external links speed re-crawl. Then watch GSC Coverage weekly: "Page with redirect" should rise then plateau, "Not found" should stay at zero for old URLs. Expect a 2–6 week dip before guides recover past baseline.
1. **Matt's outstanding content calls** — `relatedGames` on `warmachine.mdx` (no hub funnel until then), `START_HERE_SLUGS`, both hub bodies and both series descriptions still in Claude's register, series hero images, and 17 low-stakes topic flags. All listed in `roadmap/rebuild/PROGRESS.md`.
0b. **Standing: link all BONEZONE content to the hub** `/news/bonezone-2026-open/`. Synced vlogs arrive with no links in the body, so it's a manual edit after each `refresh-vlogs`, and must be committed. Rule lives in `CLAUDE.md`. Runs to 31 Oct.
1. **Paint the Royal Herald.** Entry closes **31 Oct 23:59 GMT**. Recipe is the 07-10 skeleton vlog; this is also the test run for the 2027 Tomb Kings army.
2. **Publish or bin `oldhammer-year-2027.mdx`.** Drafted, invisible. Clearing `draft: true` needs a fresh `pubDate` (currently 08-23) and a check that OWAC/40k2ndAC 2027 details have landed. Sign-ups open around Christmas.
3. **Funnel backfill (editorial).** Mechanic done, only hand-picked `relatedGames` remain. **TSPN** wants it most (only narrative entry, all three suggestions read just "Solo-friendly"). Warmachine needs peers or picks before `hideFunnel` comes off.
4. **Hero images for the Gloam and DWARF news posts.** Both run without one. No-AI-art rule applies: Matt's own photo, or ask the creators.
5. **Act on the channel strategy** — Warmachine launch stream, `@mattglbrt` handle switch, Reels cadence on `@hobbinomicon`. None are code in this repo.
6. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form is wired, engine missing.
7. **Directory to-do — 10 games with content but no page.** Queue with GSC evidence and priority in `roadmap/games.md` § "Directory to-do". Top of it: clear `draft: true` on Infinity (cheapest), then **Dolmenwood** (249 impressions, position 8.6 on "dolmenwood character creation", no page to land on), then Necromunda (172 impressions, position 8.3). Kingdom Death blocks the new `/series/` hub. Bellwoken sits at position 7.2 on its own brand name with nothing behind it.
8. Monster Friends project entry + backfill `project:` on posts.
9. **Port the GEO pattern to mattglbrt.com** (AITD done 07-22).
10. Browser click-through of the 07-31 progress bar fix and the 08-13 disclosure page. Both verified structurally, neither in a browser. (The Motley Crews page *was* browser-verified this session.)

**Note:** `refresh-vlogs` stays off this list until Matt posts a video. Its return is the first real exercise of the manual tag prompt.

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL only).
- YouTube OAuth re-auth roughly weekly before *write* API work. Reads need only the API key. Staying unverified/local-only is closed (07-21).

## Recently done
- 08-26 — **Rebuild Phase 0: audit & safety net.** `verify-migration.mjs` (the gate) and `generate-redirects.mjs` (redirects are generated from the url-map CSVs, never hand-written). `pre-rebuild` tag on `main`. Six resource pages restored from `48d6f7c`; 22 legacy redirects shipped; 28 of 58 legacy 404s recovered. GSC cross-check flipped zero rows — the 95/158 promote-guide split already covers every vlog with 3+ clicks. Full record in `roadmap/rebuild/PROGRESS.md`.
- 08-24/25 — **Two news posts + Countdown component + three bug fixes.** Full detail in SESSION_LOG. Headlines: og:image was broken on four detail templates (heroes live in `src/assets`, raw `/images/…` path 404s; `BlogLayout` already used `getHeroImageUrl`, the others didn't). YouTube thumbnails were offset 32px by Tailwind Typography's `prose img` margin — a margin still displaces an absolutely positioned box; fixed with `not-prose` on `LiteYouTube`. Deathbringer post deleted with 301s. BONEZONE hub rule recorded in `CLAUDE.md`.
- 08-13 — AI disclosure reframed to "100% Human Made Content & Art", same URL. `titleSize` added to `LegalPageLayout`. **`npx astro build` bypasses the npm `prebuild` hook** — the cheap way to verify presentation changes without firing the YouTube sync.
- 08-11 — Funnel mechanic v1 (IDF-weighted tags capped at 3, `MIN_SCORE` 3, editorial picks always win). YouTube catalogue analysed (271 videos); three-channel strategy produced.
- 07-31 — Reading progress bar fixed; the script lived inside `#swup` and never ran on clicked-to posts. Same class of bug as the Countdown script placement.

## Open questions
- **Motley Crews Advanced has no published ruleset.** The store page references it; nothing is linked. Matt supplied the rules verbally (Dreadwood team, 10 terrain pieces vs 2, any 5 classes, max 1 per class). Revisit if `_nubmark` publishes.
- **`pinned: true` is dead on the homepage.** Set on Motley Crews, but "Games worth knowing about" sorts on `updatedDate || pubDate` only. Either wire `pinned` into that sort or stop relying on it.
- **og:image serves the full-size original**, not a 1200×630 variant (Dreadwood's is 1.1MB). Inside every platform limit, so previews work, but heavier than needed. Would need `getImage()`.
- **Embedded non-vlog videos pull thumbnails from `i.ytimg.com`.** `hero-cache` only covers synced vlogs, so `_nubmark`'s two videos make a third-party request at 4:3 and get cropped. Extend the cache script?
- **Deathbringer: 301 to `/news/` or a hard 404?** Currently 301, matching the dropped-tag convention.
- The `.md` GEO rendering emits markdown images' raw `../../assets/…` paths — dead links for crawlers. `stripMdx` handles JSX, not markdown images.
- Funnel threshold of 3: right for 10 games, may want revisiting as the directory grows.
- Does the longer "100% Human Made Content & Art" footer label wrap badly on mobile?
- Wave 2 post tells readers to ignore the "BETA 1.1" button on orcthebrand.com — delete if they fix it.
- Is `vlogs/monster-friends-energy-counter` meant to stay drafted?
- Normalize the 192 timezone-less `pubDate` values? Legacy, cosmetic, but they shift RSS/index order between local and UTC.
- Directory entries for DWARF / Tavern Lore? Deferred by Matt 07-22; `solo-rpg` is the third-biggest tag. Now tracked in the `games.md` directory to-do.
- Housekeeping backlog: 13 ambiguous tag redirects point at the index; 7 redirect mappings were inference not Matt's guide (`chainmail` resolved 08-26); should `/llms.txt` be linked from the site; delete the dead `descriptions/` corpus (232 gitignored files); worth a transcript proxy so Netlify can fetch captions itself (deferred on cost).

**SESSION_LOG.md is 48KB** — compact per PLAYBOOK §8 at the next wrap that pushes it over ~50KB.
