# STATUS — The Hobbinomicon · updated 2026-08-27

## Now
**The re-architecture is live and the mobile pass shipped on top of it.** `main` at `78427fb`. Positioning: *find your next indie wargame, learn how to play and paint it* — two surfaces, `/games/` and `/guides/`, with `/warmachine/` and `/warhammer/` as on-ramps. **All 431 pre-rebuild URLs resolve** (121 unchanged, 310 single 301s, zero chains). 439 pages; **75 guides emit `HowTo`**. Collections: vlog 190 · guides 101 · games 12 · news 8 · people 8 · studios 6 · series 2.

Today's UI work fixed two defects that had been live and that no existing gate would have caught. **Nine images were 404ing across ~100 pages** — `getHeroImageUrl()` hands components an `/_astro/` path Astro never emits — which also meant `ListCard`'s `<Image>` branch had never run, so list pages shipped unprocessed originals to fill a 96px square. Card call sites now pass the image object; thumbnails are 16:9 and full-width on mobile. `/guides/` at 390px went **96x96 → 318x179 and ~1 MB of images → 107 KB**. Those pages were also serving a **404 as their `og:image`**, so shares showed no preview card. And **dark mode was broken on every list page**: `ListCard` had no `dark:` variants, so text rendered at **1:1** — the same colour as the background, not merely low contrast. Same class of bug in the `/tags/<tag>/` header, the contact button and `Pagination`. All verified on production by measuring rendered contrast, 11 pages.

**The description pass still has not run — 0 of 271 videos updated.** The code is correct and committed; the 08-27 attempt authorized the wrong channel, so all 190 writes 403'd and the day's quota went on nothing.

Still true: **transcripts only reach the live site from a local sync** — YouTube blocks caption fetches from Netlify IPs, so `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
0. **Run the description pass. Two days, after 03:00 local.** `node scripts/update-descriptions.cjs --run --max 190`, then again next day for the remaining 81. `assertRightChannel()` fails in one unit if the channel is wrong. The 08-27 backup is still accurate since nothing changed. Token good through ~09-03; re-auth with `npm run youtube-auth` if it lapses, **picking the Hobbinomicon channel**.
1. **The rest of Phase 5, and it is time-sensitive.** Sitemap resubmitted and recrawls requested on `/`, `/games/`, `/guides/` and both hubs (Matt, 08-27). Now watch GSC Coverage weekly: "Page with redirect" should rise then plateau, "Not found" should stay at zero for old URLs. Expect a **2–6 week dip** before guides recover past baseline.
2. **Matt's outstanding content calls** — `relatedGames` on `warmachine.mdx` (no hub funnel until then), `START_HERE_SLUGS`, both hub bodies and both series descriptions still in Claude's register, series hero images, 17 low-stakes topic flags. All in `roadmap/rebuild/PROGRESS.md`.
3. **Standing: link all BONEZONE content to the hub** `/news/bonezone-2026-open/`. Synced vlogs arrive with no body links, so it's a manual edit after each `refresh-vlogs`, and must be committed. Runs to 31 Oct.
4. **Paint the Royal Herald.** Closes **31 Oct 23:59 GMT**. Recipe is the 07-10 skeleton vlog; doubles as the test run for the 2027 Tomb Kings army.
5. **Publish or bin `oldhammer-year-2027.mdx`.** Drafted, invisible. Needs a fresh `pubDate` and a check that OWAC/40k2ndAC 2027 details have landed. Sign-ups open around Christmas.
6. **Funnel backfill (editorial).** Mechanic done, only hand-picked `relatedGames` remain. **TSPN** wants it most. Warmachine needs peers or picks before `hideFunnel` comes off.
7. **Clear `draft: true` on Infinity** — cheapest directory win, and it's the game two live videos are mapped to but can't link. Then **Dolmenwood** (249 impressions, position 8.6, no page), then Necromunda (172, 8.3). Kingdom Death blocks the `/series/` hub.
8. **Hero images for the Gloam and DWARF news posts.** No-AI-art rule applies: Matt's own photo, or ask the creators.
9. **Act on the channel strategy** — Warmachine launch stream, `@mattglbrt` handle switch, Reels cadence. None are code here.
10. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form wired, engine missing.
11. Monster Friends project entry + backfill `project:` on posts. Port the GEO pattern to mattglbrt.com.

**Note:** `refresh-vlogs` stays off this list until Matt posts a video. Its return is the first real exercise of the manual tag prompt.

## Blockers
- **Quota, until 03:00 local** — the only thing between here and a finished description pass.
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL only).
- YouTube OAuth re-auth roughly weekly before *write* work; **the consent screen must be given the Hobbinomicon channel** — reads succeed under any identity, so nothing warns you until the first write. Staying unverified/local-only is closed (07-21).
- Installing the launchd schedule needs Matt — writing to `~/Library/LaunchAgents/` is outside the project.

## Recently done
- 08-27 — **Mobile UI pass + two live bugs fixed.** Header/hero/chips/rhythm, 44px targets, WCAG AA both themes, `prefers-reduced-motion`. Scroll-reveal's `threshold: 0.1` left headings invisible on tall sections, and fixing it exposed contrast failures axe couldn't audit. Thumbnails 16:9 and ~10x lighter; 9 image 404s and 3 og:image 404s fixed; dark mode was 1:1 on every list page. New gate `npm run audit-images`. Full account in SESSION_LOG.
- 08-27 — **Description footer rebuilt for the new URLs; pass blocked on quota.** Guides matched on `youtubeId` (85 deep links). `--verify-urls` caught draft games being linked to unbuilt pages. `assertRightChannel()` added after the wrong-channel run burned a day.
- 08-26 — **Rebuild Phases 0–3 shipped and deployed.** `verify-migration.mjs` is the gate; redirects are generated, never hand-written. The first deploy failed because `npx astro build` skips `prebuild` — **anything touching a content path must be checked with `npm run build`**.
- 08-24/25 — Two news posts, Countdown component, three bug fixes. 08-13 — AI disclosure reframed to "100% Human Made Content & Art". 08-11 — Funnel mechanic v1.

## Open questions
- **The YouTube footer links `hobbinomicon.com/#newsletter`**, a homepage anchor, rather than the `/newsletter/` page that now exists. Both resolve — Matt's preference, cheap to change before the pass runs.
- **The guide-URL rule now lives in four places** (both routes, `generate-redirects.mjs`, `update-descriptions.cjs`). Worth extracting one shared source?
- **`pinned: true` is dead on the homepage.** Set on Motley Crews, but the sort reads `updatedDate || pubDate` only.
- **og:image serves the full-size original**, not a 1200×630 variant. Inside every platform limit but heavier than needed; needs `getImage()`.
- **Do the stacked mobile list cards feel too tall on a long list** like `/tags/warmachine/` (41 cards)? One-line reversal to a shorter horizontal card if so.
- **Embedded non-vlog videos pull thumbnails from `i.ytimg.com`** — `hero-cache` only covers synced vlogs. Extend it?
- Motley Crews Advanced has no published ruleset; revisit if `_nubmark` publishes.
- The `.md` GEO rendering emits markdown images' raw `../../assets/…` paths — dead links for crawlers.
- Deathbringer: 301 to `/news/` or a hard 404? Currently 301, matching the dropped-tag convention.
- Funnel threshold of 3: right for 10 games, may want revisiting as the directory grows.
- Normalize the 192 timezone-less `pubDate` values? Legacy, cosmetic, shifts RSS order between local and UTC.
- Housekeeping: 13 ambiguous tag redirects point at the index; 7 redirect mappings were inference not Matt's guide; should `/llms.txt` be linked; delete the dead `descriptions/` corpus; worth a transcript proxy so Netlify can fetch captions itself (deferred on cost).
