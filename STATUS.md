# STATUS — The Hobbinomicon · updated 2026-09-15

## Now
**The newsletter moved to Substack, and the whole site follows it.** `main` @ `356f421`. `/newsletter/` is rebuilt from `roadmap/newsletter.astro` and every signup form on the site — footer, homepage, game pages, news pages — posts to `hobbinomicon.substack.com`. **A real signup was verified landing in Substack on 09-15.** Mailgun is deleted; the site is now fully static, since its API route was the only `prerender = false` page. Privacy policy and terms both disclose Substack as of 09-15.

**This machine is the Mac's replacement and is fully working.** `npm ci` replaced a darwin-arm64 `node_modules`; build, vlog sync, transcript backfill, YouTube auth and the description pass all run here.

Still true: **transcripts only reach the live site from a local sync**, so `npm run refresh-vlogs` is load-bearing. **The YouTube token was re-authed 09-15 and dies around 09-22.**

## Next (ranked)
0. **Matt: two newsletter photos** — `public/images/newsletter/hero.jpg` (lit mini on black, landscape ~1600px) and `workbench.jpg` (desk, ~1200px). Both slots check at build time and fall back to flat `bg-ink`, so the page holds without them; the hero is currently a plain black band. **The mobile hero fade cannot be checked until `hero.jpg` exists.**
1. **Finish the description pass — 79 left.** 190 of 269 written 09-15 (priority first, zero errors). Re-run `node scripts/update-descriptions.cjs --run --max 190` on or after **16 Sep** once quota resets; already-updated videos are skipped, so it just picks up the remainder. **Token dies around 09-22** — after that, `npm run youtube-auth` and pick the Hobbinomicon channel.
2. **Decide on a consent banner.** An advertising pixel is a different consent category from analytics under UK/EU GDPR, and BONEZONE runs UK traffic to 31 Oct. The policy currently discloses that no banner exists. Matt's call.
3. **The rest of Phase 5, time-sensitive.** GSC Coverage weekly: "Page with redirect" rises then plateaus, "Not found" stays zero. Expect a **2–6 week dip** before guides recover past baseline. (Recrawls requested 08-27.)
4. **Matt's outstanding content calls** — `relatedGames` on `warmachine.mdx`, `START_HERE_SLUGS`, both hub bodies and both series descriptions still in Claude's register, series hero images, 17 low-stakes topic flags. All in `roadmap/rebuild/PROGRESS.md`.
5. **Standing: link all BONEZONE content to the hub** `/news/bonezone-2026-open/`. Synced vlogs arrive with no body links — manual edit after each `refresh-vlogs`, and it must be committed. Runs to 31 Oct.
6. **Paint the Royal Herald.** Closes **31 Oct 23:59 GMT**. Recipe is the 07-10 skeleton vlog; doubles as the test run for the 2027 Tomb Kings army.
7. **Clear `draft: true` on Infinity** — cheapest directory win, and the game two live videos (`IKX_sQ1XA2c`, `Uelyqf2Y5FQ`) are mapped to but cannot link. Doing it *before* the pass upgrades those two from the `/games/` hub to a deep link. Then **Dolmenwood** (249 impressions, position 8.6, no page), then Necromunda (172, 8.3). Kingdom Death blocks the `/series/` hub.
8. **Publish or bin `oldhammer-year-2027.mdx`.** Drafted, invisible. Needs a fresh `pubDate` and a check that OWAC/40k2ndAC 2027 details have landed. Sign-ups open around Christmas.
9. **Funnel backfill (editorial).** Mechanic done, only hand-picked `relatedGames` remain. **TSPN** wants it most. Warmachine needs peers or picks before `hideFunnel` comes off.
10. **Hero images for the Gloam and DWARF news posts.** No-AI-art rule applies: Matt's own photo, or ask the creators.
11. **Act on the channel strategy** — Warmachine launch stream, `@mattglbrt` handle switch, Reels cadence. None are code here.
12. Newsletter engine: **settled 09-15 — Substack** (`hobbinomicon.substack.com`), Mailgun removed. Cadence is monthly, first issue 06 Oct 2026; archive lives on Substack. Coordinate with AITD. Monster Friends project entry + backfill `project:` on posts. Port the GEO pattern to mattglbrt.com.

**Note:** `refresh-vlogs` stays off this list until Matt posts a video. Its return is the first real exercise of the manual tag prompt.

## Blockers
- **Events Manager confirmation (Matt)** — needs the Business login; can't be done from here.
- **Newsletter page content (Matt)** — still the only thing holding the description pass.
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL only).
- YouTube OAuth re-auth roughly weekly before *write* work; **the consent screen must be given the Hobbinomicon channel** — reads succeed under any identity, so nothing warns you until the first write. Staying unverified/local-only is closed (07-21).

## Recently done
- 09-15 — **Pixel verified, Mailgun fully retired.** `Lead` registered in Events Manager from a real Substack signup, closing the check open since 09-10. Mailgun key revoked and the three Netlify vars deleted. **Note: pixel `2022316185081924` is shared with Yellow Imp** (policy §4.4), so its `AddToCart`/`ViewContent`/`InitiateCheckout` counts and a chunk of `PageView` are the store, not this site — build audiences on URL rules, not the raw pixel.
- 09-15 — **Description pass, 190 of 269 done.** Every one now points at `/newsletter/` instead of the dead `/#newsletter` anchor. Zero errors, zero 403s. 79 remain, blocked only on the daily 10,000-unit quota. Undo is `scripts/backups/descriptions-backup-2026-09-15T16-06-44.json`, taken before any writes.
- 09-15 — **Substack signup verified end to end.** A real signup from the live footer form landed in Substack. The form posts `email` alone; Substack's own form also sends ten hidden attribution fields, and they are confirmed optional. **The gotcha that cost an hour: subscribing with the publication owner's own address (`matt@hobbinomicon.com`) silently does nothing** — no error, same redirect, no subscriber. `?nojs=true` makes success and failure look identical, so test with a non-owner address in a private window or you are reading noise. A cross-origin theory was chased and was wrong; curl cannot test this (403 as a bot).
- 09-15 — **Newsletter moved to Substack, Mailgun removed.** `/newsletter/` rebuilt from `roadmap/newsletter.astro`; every form site-wide posts to `hobbinomicon.substack.com`. `Lead` now fires on submit rather than on a success response, because a no-JS post navigates away before anything of ours runs — it counts intent, so expect it to read above the subscriber count. Privacy policy gains 4.6 Substack, terms gain 6. Newsletter, both stamped 09-15; 4.4 corrected, since it claimed `Lead` recorded a *completed* signup. `src/pages/api/subscribe.ts` was the only `prerender = false` route, so **the site is now fully static**.
- 09-15 — **Mac to PC migration.** `node_modules` was a darwin-arm64 install (esbuild, rollup, sharp) and nothing built; replaced via `npm ci`. Deleted the launchd plist and `run-description-pass.sh` (hardcoded `/Users/mattglbrt`, `/opt/homebrew`) — the pass is run by hand now. Dropped three tracked Lighthouse reports. `CLAUDE.md` still pointed at `src/content/blog/vlogs/`; the collection moved to `src/content/vlog/` in 2026-08, and the stale path was in the documented commit ritual, so following it staged nothing.
- 09-15 — **2 new vlogs synced, 13 transcripts backfilled.** Both new posts got transcripts, thumbnails and hand-confirmed tags. The `--all` backfill recovered 13 (11 guides, 2 vlogs) that synced too early for YouTube captions; 9 genuinely have none. Added `--only` to the description pass and mapped `OGa7nwScvUM` to motley-crews.
- 09-10 — **Meta pixel shipped.** First-interaction loading (chosen over a flat 3s delay, which would drop every visitor who bounces inside 3s); `load` kept as a hard floor for LCP. **The site runs Swup, not View Transitions** — without handling that, every visit after the first would have gone uncounted. Advanced matching off and `Lead` carries no payload, so the policy's "never share your email with advertisers" holds. Hardcoded ID at Matt's call, matching GA in the same layout; it therefore also fires from localhost and deploy previews. Full account in SESSION_LOG.
- 09-10 — **09-01 work committed and deployed** after nine days uncommitted. The merge also carried two undeployed `dev` commits (08-27 wrap, dark-mode record) — docs and tooling only, checked before pushing.
- 09-01 — **Description pass staged and held.** All pre-flight gates green, zero writes. Footer newsletter link → `/newsletter/` with UTM.
- 08-27 — **Mobile UI pass + two live bugs fixed.** Scroll-reveal threshold left headings invisible; fixing it exposed contrast failures axe could not audit. Thumbnails 16:9 and ~10x lighter; 9 image 404s and 3 og:image 404s fixed. New gate `npm run audit-images`.
- 08-26 — **Rebuild Phases 0–3 shipped.** `verify-migration.mjs` is the gate. **Anything touching a content path must be checked with `npm run build`** — `npx astro build` skips `prebuild`.

## Open questions
- **`eventCount` from `fbq.getState()` is not a per-call counter** and nearly produced a false "Swup PageView isn't firing" conclusion. Spy on `window.fbq` instead. Related: **stubbing `window.fetch` breaks Swup**, forcing a hard navigation — test `Lead` and Swup separately.
- **The outbound `/tr` beacon was never directly observed** locally (invisible transport, `_fbp` unreliable on localhost). Events Manager is the real check.
- **`.env.example` was deleted** with the env var; the two remaining keys (YouTube ×2) stay undocumented in the repo. Worth adding back standalone?
- **`--verify-urls` validates local `dist/`, not production.** It would pass for a page never merged to `main`. Teach it to check live URLs, or warn when `dev` is ahead of `main` on a content path.
- **The guide-URL rule now lives in four places** (both routes, `generate-redirects.mjs`, `update-descriptions.cjs`). Extract one shared source?
- **`pinned: true` is dead on the homepage.** Set on Motley Crews, but the sort reads `updatedDate || pubDate` only.
- **og:image serves the full-size original**, not a 1200×630 variant; needs `getImage()`.
- **Do the stacked mobile list cards feel too tall** on a long list like `/tags/warmachine/` (41 cards)?
- **Embedded non-vlog videos pull thumbnails from `i.ytimg.com`** — `hero-cache` only covers synced vlogs. Extend it?
- Two videos sit outside the description pass's filter (backup 271, pass 269). Harmless, but nobody has looked at which.
- Motley Crews Advanced has no published ruleset; revisit if `_nubmark` publishes.
- The `.md` GEO rendering emits markdown images' raw `../../assets/…` paths — dead links for crawlers.
- Deathbringer: 301 to `/news/` or a hard 404? Currently 301, matching the dropped-tag convention.
- Funnel threshold of 3: right for 10 games, may want revisiting as the directory grows.
- Normalize the 192 timezone-less `pubDate` values? Legacy, cosmetic, shifts RSS order between local and UTC.
- Housekeeping: 13 ambiguous tag redirects point at the index; 7 redirect mappings were inference not Matt's guide; should `/llms.txt` be linked; delete the dead `descriptions/` corpus; worth a transcript proxy so Netlify can fetch captions itself (deferred on cost).
