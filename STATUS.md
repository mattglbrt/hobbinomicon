# STATUS — The Hobbinomicon · updated 2026-08-27

## Now
**The re-architecture is live** (deployed 08-26, `main` at `f86252d`), PSI **mobile 100 on every page checked**. Positioning shipped: *find your next indie wargame, learn how to play and paint it*. Two surfaces, `/games/` and `/guides/`, with `/warmachine/` and `/warhammer/` as on-ramps. **All 431 pre-rebuild URLs resolve** — 121 unchanged, 310 single 301s, zero chains. 438 pages; **75 guides emit `HowTo`**. Collections: vlog 190 · guides 101 · series 2 · games 12 · news 8 · people 8 · studios 6.

**Phase 5 cutover is half-done and the YouTube half is staged but unrun.** `update-descriptions.cjs` now points descriptions at the new `/guides/` URLs (85 of 271 videos deep-link their own guide page; every video links both surfaces). Committed on `dev`, four commits, no merge needed — local scripts don't deploy.

**The pass has not run: 0 of 271 videos updated.** Today's attempt authorized the wrong channel ("Curving Out", not Hobbinomicon), so all 190 writes came back 403 and the full 10,000-unit daily quota went on rejected calls. Nothing was written anywhere. Auth is now correct and verified; **quota resets 03:00 local**. A one-unit `assertRightChannel()` guard now runs before the first write so this cannot recur.

**On `dev`, unmerged: the mobile UI pass and a thumbnail fix.** List
thumbnails were 96px squares built from unprocessed full-size originals, and
nine of them 404'd on the live site — `getHeroImageUrl()` hands components a
`/_astro/` path Astro never emits. Card call sites now pass the image object, so
the thumbnails are responsive webp, 16:9, and full width on mobile. `/guides/`
at 390px went from ~1 MB of images to 107 KB. Sitewide image audit: 0 missing.

**Dark mode was broken on every list page and is now fixed and live.**
`ListCard` had no `dark:` variants, so titles, dates and descriptions rendered
at 1:1 against the background — the same colour, not merely low contrast. Same
class of bug in the `/tags/<tag>/` header, the contact button and `Pagination`.
Verified on production by measuring rendered contrast across 11 pages, both
themes: clean.

Still true: **transcripts only reach the live site from a local sync** — YouTube blocks caption fetches from Netlify IPs, so `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
0. **Run the description pass. Two days, after 03:00 local.** `node scripts/update-descriptions.cjs --run --max 190`, then again the next day for the remaining 81. The guard fails in one unit if the channel is wrong. Backup (`scripts/backups/descriptions-backup-2026-08-27T13-52-36.json`) is still accurate since nothing changed. Token good through ~09-03; re-auth with `npm run youtube-auth` if it lapses, **picking the Hobbinomicon channel**. Optionally install the launchd schedule (`scripts/hobbinomicon-descriptions.plist`, instructions in its comment) — written but deliberately not installed.
1. **The rest of Phase 5, and it is time-sensitive.** Resubmit `sitemap-index.xml` in GSC (**not** Change of Address — same domain). Request indexing on `/`, `/games/`, `/guides/`, `/warmachine/`, `/warhammer/` and the top guides. Then watch GSC Coverage weekly: "Page with redirect" should rise then plateau, "Not found" should stay at zero for old URLs. Expect a **2–6 week dip** before guides recover past baseline.
2. **Matt's outstanding content calls** — `relatedGames` on `warmachine.mdx` (no hub funnel until then), `START_HERE_SLUGS`, both hub bodies and both series descriptions still in Claude's register, series hero images, 17 low-stakes topic flags. All in `roadmap/rebuild/PROGRESS.md`.
3. **Standing: link all BONEZONE content to the hub** `/news/bonezone-2026-open/`. Synced vlogs arrive with no body links, so it's a manual edit after each `refresh-vlogs`, and must be committed. Runs to 31 Oct.
4. **Paint the Royal Herald.** Closes **31 Oct 23:59 GMT**. Recipe is the 07-10 skeleton vlog; doubles as the test run for the 2027 Tomb Kings army.
5. **Publish or bin `oldhammer-year-2027.mdx`.** Drafted, invisible. Needs a fresh `pubDate` and a check that OWAC/40k2ndAC 2027 details have landed. Sign-ups open around Christmas.
6. **Funnel backfill (editorial).** Mechanic done, only hand-picked `relatedGames` remain. **TSPN** wants it most. Warmachine needs peers or picks before `hideFunnel` comes off.
7. **Clear `draft: true` on Infinity** — cheapest directory win, and it's the game two live videos are mapped to but can't link (see `games.md` § "Directory to-do"). Then **Dolmenwood** (249 impressions, position 8.6, no page), then Necromunda (172, 8.3). Kingdom Death blocks the `/series/` hub.
8. **Hero images for the Gloam and DWARF news posts.** No-AI-art rule applies: Matt's own photo, or ask the creators.
9. **Act on the channel strategy** — Warmachine launch stream, `@mattglbrt` handle switch, Reels cadence. None are code here.
10. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form wired, engine missing.
11. Monster Friends project entry + backfill `project:` on posts. Port the GEO pattern to mattglbrt.com. Browser click-through of the 07-31 progress bar and 08-13 disclosure page.

**Note:** `refresh-vlogs` stays off this list until Matt posts a video. Its return is the first real exercise of the manual tag prompt.

## Blockers
- **Quota, until 03:00 local** — the only thing between here and a finished description pass.
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL only).
- YouTube OAuth re-auth roughly weekly before *write* work; **the consent screen must be given the Hobbinomicon channel**. Reads need only the API key. Staying unverified/local-only is closed (07-21).
- Installing the launchd schedule needs Matt — writing to `~/Library/LaunchAgents/` is outside the project and was blocked.

## Recently done
- 08-27 — **Description footer rebuilt for the new URLs; pass blocked on quota.** Guides matched on `youtubeId` (85 deep links). New offline `--verify-urls` check caught a live bug: draft games weren't filtered, so two videos were pointed at the unbuilt `/games/infinity/`. `assertRightChannel()` + a consecutive-failure abort added after the wrong-channel run burned a day. Full account in SESSION_LOG.
- 08-26 — **Rebuild Phases 0–3 shipped and deployed.** `verify-migration.mjs` is the gate; redirects are generated from url-map CSVs, never hand-written. The first deploy failed because `npx astro build` skips `prebuild`, hiding two `sync-vlogs` bugs (86 duplicate posts per build; a three-deep import for posts now two deep). **Anything touching a content path must be checked with `npm run build`.**
- 08-24/25 — Two news posts, Countdown component, three bug fixes: og:image 404ing site-wide on four detail templates; YouTube thumbnails 32px low (`prose img` margin displaces an absolutely positioned box); Motley Crews off the homepage. BONEZONE hub rule recorded in `CLAUDE.md`.
- 08-13 — AI disclosure reframed to "100% Human Made Content & Art". 08-11 — Funnel mechanic v1. 07-31 — Reading progress bar fixed.

## Open questions
- **The guide-URL rule now lives in four places** (both routes, `generate-redirects.mjs`, `update-descriptions.cjs`). `--verify-urls` catches drift for the descriptions copy only. Worth extracting one shared source?
- **`pinned: true` is dead on the homepage.** Set on Motley Crews, but the sort reads `updatedDate || pubDate` only. Wire it in or stop relying on it.
- **og:image serves the full-size original**, not a 1200×630 variant (Dreadwood's is 1.1MB). Inside every platform limit but heavier than needed; would need `getImage()`.
- **Embedded non-vlog videos pull thumbnails from `i.ytimg.com`** — `hero-cache` only covers synced vlogs. Extend it?
- **Motley Crews Advanced has no published ruleset.** Matt supplied rules verbally; revisit if `_nubmark` publishes.
- The `.md` GEO rendering emits markdown images' raw `../../assets/…` paths — dead links for crawlers. `stripMdx` handles JSX, not markdown images.
- Deathbringer: 301 to `/news/` or a hard 404? Currently 301, matching the dropped-tag convention.
- Funnel threshold of 3: right for 10 games, may want revisiting as the directory grows.
- Does the longer "100% Human Made Content & Art" footer label wrap badly on mobile?
- Wave 2 post tells readers to ignore the "BETA 1.1" button on orcthebrand.com — delete if they fix it.
- Is `vlogs/monster-friends-energy-counter` meant to stay drafted?
- Normalize the 192 timezone-less `pubDate` values? Legacy, cosmetic, shifts RSS order between local and UTC.
- Housekeeping: 13 ambiguous tag redirects point at the index; 7 redirect mappings were inference not Matt's guide; should `/llms.txt` be linked; delete the dead `descriptions/` corpus (232 gitignored files); worth a transcript proxy so Netlify can fetch captions itself (deferred on cost).
