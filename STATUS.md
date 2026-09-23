# STATUS — The Hobbinomicon · updated 2026-09-16

## Now
**The newsletter runs on Substack, and the whole site follows it.** `main` @ `d76d146`, five deploys 09-15. `/newsletter/` was rebuilt from `roadmap/newsletter.astro` and every signup form — footer, homepage, game pages, news pages — posts to `hobbinomicon.substack.com`. **A real signup was verified landing in Substack**, so the chain is proven end to end. Monthly, first issue **06 Oct 2026**. Mailgun is deleted and its key revoked; `api/subscribe.ts` was the only `prerender = false` route, so **the site is now fully static**. Privacy policy (4.6) and terms (6) both disclose Substack.

**This machine replaces the Mac and is fully working.** `node_modules` was a darwin-arm64 install and nothing built; `npm ci` fixed it. Build, vlog sync, transcript backfill, YouTube auth and the description pass all run here.

**The YouTube description pass is complete (09-16): 269 of 269**, every footer now pointing at `/newsletter/`.

Still true: **transcripts only reach the live site from a local sync**, so `npm run refresh-vlogs` is load-bearing. The YouTube token dies around 09-22; nothing queued needs it.

## Next (ranked)
1. **Matt: consolidate the Substack publications under `mattglbrt`** (planned 09-16). **Transfer, never delete** — Settings → Danger Zone → Transfer ownership, accepted within 6 hours. The subdomain survives a transfer and would not survive a delete, and it is hardcoded here and named in the privacy policy and terms.
2. **Matt: two newsletter photos** — `public/images/newsletter/hero.jpg` (lit mini on black, landscape ~1600px) and `workbench.jpg` (desk, ~1200px). Both slots check at build time and fall back to flat `bg-ink`, so the page holds; the hero is currently a plain black band.
3. **Check the site at 390px.** Not done yet — the Chrome extension is not connected here. Most signups will be mobile, and the rebuilt newsletter page plus the new Substack notice line under all four forms have only been verified structurally. **The mobile hero fade cannot be checked until `hero.jpg` exists**, since the image block is skipped entirely when the file is missing.
4. **Matt: create the Events Manager custom conversion.** Both `Lead` calls now send `content_name: 'newsletter'`, but nothing uses it until a custom conversion filters on it. Then optimise ads and audiences against that, not raw `Lead`.
5. **Decide on a consent banner.** Two US processors now disclosed (Meta, Substack) and nothing gates either. An advertising pixel is a different consent category from analytics under UK/EU GDPR, and BONEZONE runs UK traffic to 31 Oct. Matt's call.
6. **The rest of Phase 5, time-sensitive.** GSC Coverage weekly: "Page with redirect" rises then plateaus, "Not found" stays zero. Expect a **2–6 week dip** before guides recover past baseline. (Recrawls requested 08-27.)
7. **Matt's outstanding content calls** — `relatedGames` on `warmachine.mdx`, `START_HERE_SLUGS`, both hub bodies and both series descriptions still in Claude's register, series hero images, 17 low-stakes topic flags. All in `roadmap/rebuild/PROGRESS.md`.
8. **Standing: link all BONEZONE content to the hub** `/news/bonezone-2026-open/`. Synced vlogs arrive with no body links — manual edit after each `refresh-vlogs`, and it must be committed. Runs to 31 Oct.
9. **Paint the Royal Herald.** Closes **31 Oct 23:59 GMT**. Recipe is the 07-10 skeleton vlog; doubles as the test run for the 2027 Tomb Kings army.
10. **Clear `draft: true` on Infinity** — cheapest directory win; two live videos are mapped to it but cannot link. Then **Dolmenwood** (249 impressions, position 8.6, no page), then Necromunda (172, 8.3). Kingdom Death blocks the `/series/` hub.
11. **Publish or bin `oldhammer-year-2027.mdx`.** Drafted, invisible. Needs a fresh `pubDate` and a check that OWAC/40k2ndAC 2027 details have landed. Sign-ups open around Christmas.
12. **Funnel backfill (editorial).** Mechanic done, only hand-picked `relatedGames` remain. **TSPN** wants it most. Warmachine needs peers or picks before `hideFunnel` comes off.
13. **Hero images for the Gloam and DWARF news posts.** No-AI-art rule applies: Matt's own photo, or ask the creators.
14. **Act on the channel strategy** — Warmachine launch stream, `@mattglbrt` handle switch, Reels cadence. None are code here.
15. Monster Friends project entry + backfill `project:` on posts. Port the GEO pattern to mattglbrt.com.

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL only).
- YouTube OAuth re-auth roughly weekly before *write* work; **the consent screen must be given the Hobbinomicon channel** — reads succeed under any identity, so nothing warns you until the first write. Staying unverified/local-only is closed (07-21).

## Recently done
- 09-16 — **Description pass finished, 269/269, zero errors.** Backed up first; `--verify-urls` clean and `dev` had no content ahead of `main`, so the links are live.
- 09-15 — **Newsletter moved to Substack; Mailgun deleted.** Signup verified end to end. `Lead` now fires on submit rather than on a success response, so it counts intent and will read above the subscriber count. Legal pages updated, including a correction: 4.4 had claimed the pixel records a *completed* signup.
- 09-15 — **Mac → PC.** `node_modules` was darwin-arm64 and nothing built. Launchd tooling and three Lighthouse reports deleted; `CLAUDE.md`'s stale `src/content/blog/vlogs/` path fixed (it was in the commit ritual, so following it staged nothing).
- 09-15 — **2 new vlogs, 13 transcripts backfilled** (11 guides, 2 vlogs) that had synced too early for captions. 9 genuinely have none.
- 09-15 — **Yellow Imp leads separated.** Pixel `2022316185081924` is shared with the store, so its `AddToCart`/`ViewContent` counts and much of `PageView` are not this site.
- 09-10 — **Meta pixel shipped.** First-interaction loading, `load` as a hard floor for LCP. **The site runs Swup, not View Transitions** — without handling that, every visit after the first would have gone uncounted.

## Open questions
- **Substack silently ignores the publication owner subscribing to their own publication** — no error, same redirect, no subscriber. With `?nojs=true` making success and failure identical, this made a working form look broken. Test with a non-owner address in a private window. curl cannot test it (403 as a bot).
- **`.env.example` was deleted** with the env var; the two remaining keys (YouTube ×2) stay undocumented in the repo. Worth adding back standalone?
- **`--verify-urls` validates local `dist/`, not production.** It would pass for a page never merged to `main`. Worked around 09-16 by hand (`git diff origin/main..dev -- src/content src/data`); worth building that warning into the script.
- **The guide-URL rule lives in four places** (both routes, `generate-redirects.mjs`, `update-descriptions.cjs`). Extract one shared source?
- **`pinned: true` is dead on the homepage.** Set on Motley Crews, but the sort reads `updatedDate || pubDate` only.
- **Do the stacked mobile list cards feel too tall** on a long list like `/tags/warmachine/` (41 cards)?
- **Embedded non-vlog videos pull thumbnails from `i.ytimg.com`** — `hero-cache` only covers synced vlogs. Extend it?
- Two videos sit outside the description pass's filter (backup 273, pass 271). Harmless, but nobody has looked at which.
- Should the `$20 board` video (`Y06CnKziw0I`) join the Motley Crews series? It is the direct predecessor but deliberately system-agnostic.
- Motley Crews Advanced has no published ruleset; revisit if `_nubmark` publishes.
- The `.md` GEO rendering emits markdown images' raw `../../assets/…` paths — dead links for crawlers.
- Deathbringer: 301 to `/news/` or a hard 404? Currently 301, matching the dropped-tag convention.
- Funnel threshold of 3: right for 10 games, may want revisiting as the directory grows.
- Normalize the 192 timezone-less `pubDate` values? Legacy, cosmetic, shifts RSS order between local and UTC.
- Housekeeping: 13 ambiguous tag redirects point at the index; 7 redirect mappings were inference not Matt's guide; should `/llms.txt` be linked; delete the dead `descriptions/` corpus; worth a transcript proxy so Netlify can fetch captions itself (deferred on cost).
