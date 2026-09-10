# STATUS — The Hobbinomicon · updated 2026-09-01

## Now
**The description pass is staged, green, and deliberately not run.** Every gate in front of it passed today: backup (271 snippets), full build (439 pages), `--verify-urls` (97 URLs, 85 guide deep links, all resolve), dry run (**269 videos need the footer, 168 priority, ~13,450 units vs 10,000/day** → 190 + 79 over two days). **No descriptions were touched. Nothing committed, nothing pushed.**

Held at Matt's call: the footer now points at `/newsletter/`, and sending 271 videos' worth of traffic to a thin page spends that shot once. **Matt is writing the page content.** The pass runs after.

One **uncommitted change in the working tree**: `scripts/update-descriptions.cjs:143`, newsletter link `/#newsletter` → `/newsletter/?utm_source=youtube&utm_medium=description`. Reasoning: a fragment records as a pageview of `/` and is uncountable in GA4, *and* that line carried no UTM at all unlike the guides/games lines. Discord stays bare on purpose (external domain, never reports back).

Site itself is unchanged since 08-27 — `main` at `78427fb`, all 431 pre-rebuild URLs resolving, 75 guides emitting `HowTo`. Still true: **transcripts only reach the live site from a local sync**, so `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
0. **Matt: content for `/newsletter/`.** The one thing gating the pass.
1. **Then run the description pass, two days.** `node scripts/update-descriptions.cjs --run --max 190`, then again for the remaining 79. The 09-01 backup stays valid *only* while nothing else edits descriptions. Re-run the dry run first if the page copy changed the footer. `assertRightChannel()` fails in one unit on a wrong channel; **pick the Hobbinomicon channel at the consent screen**. Token was good through ~09-03 — expect `npm run youtube-auth`.
2. **Confirm `MAILGUN_API_KEY` + `MAILGUN_LIST` are set in Netlify env.** The form is live now; if they are missing every submission returns a 500 and signups are dropped silently. Do this before the pass drives traffic.
3. **The rest of Phase 5, time-sensitive.** Watch GSC Coverage weekly: "Page with redirect" should rise then plateau, "Not found" stays at zero for old URLs. Expect a **2–6 week dip** before guides recover past baseline. (Recrawls requested 08-27.)
4. **Matt's outstanding content calls** — `relatedGames` on `warmachine.mdx`, `START_HERE_SLUGS`, both hub bodies and both series descriptions still in Claude's register, series hero images, 17 low-stakes topic flags. All in `roadmap/rebuild/PROGRESS.md`.
5. **Standing: link all BONEZONE content to the hub** `/news/bonezone-2026-open/`. Synced vlogs arrive with no body links — manual edit after each `refresh-vlogs`, and must be committed. Runs to 31 Oct.
6. **Paint the Royal Herald.** Closes **31 Oct 23:59 GMT**. Recipe is the 07-10 skeleton vlog; doubles as the test run for the 2027 Tomb Kings army.
7. **Clear `draft: true` on Infinity** — cheapest directory win, and it is the game two live videos (`IKX_sQ1XA2c`, `Uelyqf2Y5FQ`) are mapped to but cannot link. Doing it *before* the pass upgrades those two from the `/games/` hub to a deep link. Then **Dolmenwood** (249 impressions, position 8.6, no page), then Necromunda (172, 8.3). Kingdom Death blocks the `/series/` hub.
8. **Publish or bin `oldhammer-year-2027.mdx`.** Drafted, invisible. Needs a fresh `pubDate` and a check that OWAC/40k2ndAC 2027 details have landed. Sign-ups open around Christmas.
9. **Funnel backfill (editorial).** Mechanic done, only hand-picked `relatedGames` remain. **TSPN** wants it most. Warmachine needs peers or picks before `hideFunnel` comes off.
10. **Hero images for the Gloam and DWARF news posts.** No-AI-art rule applies: Matt's own photo, or ask the creators.
11. **Act on the channel strategy** — Warmachine launch stream, `@mattglbrt` handle switch, Reels cadence. None are code here.
12. Newsletter engine proper: Mailgun handler exists, but provider/cadence/archive still undecided (Buttondown was the recommendation — coordinate with AITD).
13. Monster Friends project entry + backfill `project:` on posts. Port the GEO pattern to mattglbrt.com.

**Note:** `refresh-vlogs` stays off this list until Matt posts a video. Its return is the first real exercise of the manual tag prompt.

## Blockers
- **Newsletter page content (Matt)** — the only thing holding the description pass.
- **Mailgun env vars unverified** — cannot be checked from the repo; needs the Netlify dashboard.
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL only).
- YouTube OAuth re-auth roughly weekly before *write* work; **the consent screen must be given the Hobbinomicon channel** — reads succeed under any identity, so nothing warns you until the first write. Staying unverified/local-only is closed (07-21).
- Installing the launchd schedule needs Matt — writing to `~/Library/LaunchAgents/` is outside the project.

## Recently done
- 09-01 — **Description pass staged and held.** Newsletter footer link switched to `/newsletter/` with UTM; all pre-flight gates green; zero writes. Verified `/newsletter/` is genuinely live on production (200, incl. the UTM'd URL) — `--verify-urls` alone could not have told us that. Full account in SESSION_LOG.
- 08-27 — **Mobile UI pass + two live bugs fixed.** Header/hero/chips/rhythm, 44px targets, WCAG AA both themes, `prefers-reduced-motion`. Scroll-reveal's `threshold: 0.1` left headings invisible on tall sections, and fixing it exposed contrast failures axe could not audit. Thumbnails 16:9 and ~10x lighter; 9 image 404s and 3 og:image 404s fixed; dark mode was 1:1 on every list page. New gate `npm run audit-images`.
- 08-27 — **Description footer rebuilt for the new URLs.** Guides matched on `youtubeId` (85 deep links). `--verify-urls` caught draft games being linked to unbuilt pages. `assertRightChannel()` added after the wrong-channel run burned a day.
- 08-26 — **Rebuild Phases 0–3 shipped and deployed.** `verify-migration.mjs` is the gate; redirects are generated, never hand-written. **Anything touching a content path must be checked with `npm run build`** — `npx astro build` skips `prebuild`.

## Open questions
- **`--verify-urls` has a blind spot: it validates against local `dist/`, not production.** It would pass for a page never merged to `main`. Worth teaching it to check live URLs, or at least to warn when `dev` is ahead of `main` on a content path.
- **The guide-URL rule now lives in four places** (both routes, `generate-redirects.mjs`, `update-descriptions.cjs`). Worth extracting one shared source?
- **`pinned: true` is dead on the homepage.** Set on Motley Crews, but the sort reads `updatedDate || pubDate` only.
- **og:image serves the full-size original**, not a 1200×630 variant. Inside every platform limit but heavier than needed; needs `getImage()`.
- **Do the stacked mobile list cards feel too tall on a long list** like `/tags/warmachine/` (41 cards)? One-line reversal to a shorter horizontal card if so.
- **Embedded non-vlog videos pull thumbnails from `i.ytimg.com`** — `hero-cache` only covers synced vlogs. Extend it?
- Two videos sit outside the description pass's filter (backup 271, pass 269). Harmless, but nobody has looked at which.
- Motley Crews Advanced has no published ruleset; revisit if `_nubmark` publishes.
- The `.md` GEO rendering emits markdown images' raw `../../assets/…` paths — dead links for crawlers.
- Deathbringer: 301 to `/news/` or a hard 404? Currently 301, matching the dropped-tag convention.
- Funnel threshold of 3: right for 10 games, may want revisiting as the directory grows.
- Normalize the 192 timezone-less `pubDate` values? Legacy, cosmetic, shifts RSS order between local and UTC.
- Housekeeping: 13 ambiguous tag redirects point at the index; 7 redirect mappings were inference not Matt's guide; should `/llms.txt` be linked; delete the dead `descriptions/` corpus; worth a transcript proxy so Netlify can fetch captions itself (deferred on cost).
