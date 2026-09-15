# STATUS — The Hobbinomicon · updated 2026-09-10

## Now
**The Meta pixel is live, and the nine-day 09-01 backlog finally shipped.** `main` @ `a336854`, one build credit for the batch. Pixel `2022316185081924` is site-wide via `BaseLayout.astro`: base code, `<noscript>` beacon, `PageView` on load *and* on Swup navigations, `Lead` on newsletter signup success. Privacy policy gains §4.4 (Meta Pixel) plus edits to 2.2/3/5/6, stamped September 10 2026.

Loading is **first interaction or 3s after load, whichever comes first** — `pointerdown`/`touchstart`/`keydown`/`scroll`, never `mousemove`, with `load` as a hard floor so it can't compete with LCP. Verified on a served build across all three branches (no interaction +3353ms · interaction before load fires *at* load, +0ms · interaction after load beat the timer by ~1.8s).

**The description pass is untouched and still held**, on the same gate as 09-01: Matt's `/newsletter/` copy. Its backup is now nine days old.

Site otherwise unchanged since 08-27. Still true: **transcripts only reach the live site from a local sync**, so `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
0. **Matt: confirm the pixel in Events Manager → Test Events.** The one hop this session couldn't close (needs the Business login). Expect stray `localhost` events from verification — a few `PageView`s and two `Lead`s from a fake `test@example.com`. Those are the session, not traffic.
1. **Matt: content for `/newsletter/`.** Still the one thing gating the description pass.
2. **Then run the pass, two days.** `node scripts/update-descriptions.cjs --run --max 190`, then the remaining 79. **Re-run `npm run backup-descriptions` and the dry run first** — the 09-01 backup is nine days old and the footer copy may have moved. `assertRightChannel()` fails in one unit on a wrong channel; **pick the Hobbinomicon channel at the consent screen**. Expect `npm run youtube-auth`; the old token is long dead.
3. **Confirm `MAILGUN_API_KEY` + `MAILGUN_LIST` in Netlify env.** Now doubly load-bearing: missing vars mean signups 500 silently *and* `Lead` reads zero, which looks like a broken pixel.
4. **Decide on a consent banner.** An advertising pixel is a different consent category from analytics under UK/EU GDPR, and BONEZONE runs UK traffic to 31 Oct. The policy currently discloses that no banner exists. Matt's call.
5. **The rest of Phase 5, time-sensitive.** GSC Coverage weekly: "Page with redirect" rises then plateaus, "Not found" stays zero. Expect a **2–6 week dip** before guides recover past baseline. (Recrawls requested 08-27.)
6. **Matt's outstanding content calls** — `relatedGames` on `warmachine.mdx`, `START_HERE_SLUGS`, both hub bodies and both series descriptions still in Claude's register, series hero images, 17 low-stakes topic flags. All in `roadmap/rebuild/PROGRESS.md`.
7. **Standing: link all BONEZONE content to the hub** `/news/bonezone-2026-open/`. Synced vlogs arrive with no body links — manual edit after each `refresh-vlogs`, and it must be committed. Runs to 31 Oct.
8. **Paint the Royal Herald.** Closes **31 Oct 23:59 GMT**. Recipe is the 07-10 skeleton vlog; doubles as the test run for the 2027 Tomb Kings army.
9. **Clear `draft: true` on Infinity** — cheapest directory win, and the game two live videos (`IKX_sQ1XA2c`, `Uelyqf2Y5FQ`) are mapped to but cannot link. Doing it *before* the pass upgrades those two from the `/games/` hub to a deep link. Then **Dolmenwood** (249 impressions, position 8.6, no page), then Necromunda (172, 8.3). Kingdom Death blocks the `/series/` hub.
10. **Publish or bin `oldhammer-year-2027.mdx`.** Drafted, invisible. Needs a fresh `pubDate` and a check that OWAC/40k2ndAC 2027 details have landed. Sign-ups open around Christmas.
11. **Funnel backfill (editorial).** Mechanic done, only hand-picked `relatedGames` remain. **TSPN** wants it most. Warmachine needs peers or picks before `hideFunnel` comes off.
12. **Hero images for the Gloam and DWARF news posts.** No-AI-art rule applies: Matt's own photo, or ask the creators.
13. **Act on the channel strategy** — Warmachine launch stream, `@mattglbrt` handle switch, Reels cadence. None are code here.
14. Newsletter engine proper: Mailgun handler exists, provider/cadence/archive still undecided (Buttondown was the recommendation — coordinate with AITD). Monster Friends project entry + backfill `project:` on posts. Port the GEO pattern to mattglbrt.com.

**Note:** `refresh-vlogs` stays off this list until Matt posts a video. Its return is the first real exercise of the manual tag prompt.

## Blockers
- **Events Manager confirmation (Matt)** — needs the Business login; can't be done from here.
- **Newsletter page content (Matt)** — still the only thing holding the description pass.
- **Mailgun env vars unverified** — cannot be checked from the repo; needs the Netlify dashboard.
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL only).
- YouTube OAuth re-auth roughly weekly before *write* work; **the consent screen must be given the Hobbinomicon channel** — reads succeed under any identity, so nothing warns you until the first write. Staying unverified/local-only is closed (07-21).

## Recently done
- 09-10 — **Meta pixel shipped.** First-interaction loading (chosen over a flat 3s delay, which would drop every visitor who bounces inside 3s); `load` kept as a hard floor for LCP. **The site runs Swup, not View Transitions** — without handling that, every visit after the first would have gone uncounted. Advanced matching off and `Lead` carries no payload, so the policy's "never share your email with advertisers" holds. Hardcoded ID at Matt's call, matching GA in the same layout; it therefore also fires from localhost and deploy previews. Full account in SESSION_LOG.
- 09-10 — **09-01 work committed and deployed** after nine days uncommitted. The merge also carried two undeployed `dev` commits (08-27 wrap, dark-mode record) — docs and tooling only, checked before pushing.
- 09-01 — **Description pass staged and held.** All pre-flight gates green, zero writes. Footer newsletter link → `/newsletter/` with UTM.
- 08-27 — **Mobile UI pass + two live bugs fixed.** Scroll-reveal threshold left headings invisible; fixing it exposed contrast failures axe could not audit. Thumbnails 16:9 and ~10x lighter; 9 image 404s and 3 og:image 404s fixed. New gate `npm run audit-images`.
- 08-26 — **Rebuild Phases 0–3 shipped.** `verify-migration.mjs` is the gate. **Anything touching a content path must be checked with `npm run build`** — `npx astro build` skips `prebuild`.

## Open questions
- **`eventCount` from `fbq.getState()` is not a per-call counter** and nearly produced a false "Swup PageView isn't firing" conclusion. Spy on `window.fbq` instead. Related: **stubbing `window.fetch` breaks Swup**, forcing a hard navigation — test `Lead` and Swup separately.
- **The outbound `/tr` beacon was never directly observed** locally (invisible transport, `_fbp` unreliable on localhost). Events Manager is the real check.
- **`.env.example` was deleted** with the env var; the five real keys (YouTube ×2, Mailgun ×3) stay undocumented in the repo. Worth adding back standalone?
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
