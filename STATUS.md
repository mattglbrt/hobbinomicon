# STATUS — The Hobbinomicon · updated 2026-09-23

## Now
**The directory grew by five games in a day.** `main` @ `8672cae`, five deploys 09-23. **Infinity, Maleghast, Brawl Arcane 28, Necropolis28, and Pillage** are live, each with its designer and studio pages. Every page was researched with names sourced or left out, after Infinity's draft turned out to have **invented Corvus Belli's founders** ("the Vigo brothers"), live on the studio page since May. That's fixed, with 301s on the old person URLs.

**Three new frontmatter switches:** `storeAffiliate: true` (partner box with built-in disclosure, `rel="sponsored"`; Infinity uses Matt's Corvus Belli affiliate link), `chessboard: true` (feeds `/games/chessboard/`: Motley Crews, Maleghast, Brawl Arcane 28), and `notPlayed: true` (a "Not played yet" box in place of an invented take). The last two are documented in CLAUDE.md.

Still true: newsletter on Substack, first issue **06 Oct**. Transcripts only reach the site from a local sync, so `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
1. **Matt: consolidate the Substack publications under `mattglbrt`.** **Transfer, never delete**: the subdomain survives a transfer, is hardcoded here and named in the policy and terms.
2. **Matt: the two newsletter photos** (`hero.jpg`, `workbench.jpg`) before issue #1 on 06 Oct. Both fall back to flat `bg-ink`.
3. **Description pass for the new game links.** Infinity's two videos and the Necropolis board video can now deep-link to their game pages. `npm run youtube-auth` first (token expired ~09-22), Hobbinomicon channel at the consent screen, `--verify-urls`, then `--only <ids>`.
4. **Necropolis28: when the hardback Kickstarter launches**, update the "hasn't launched yet" line and write a news post. **After Matt's October solo-rules video**, add it to `game-videos.json`.
5. **Brawl Arcane 28 hero image.** Matt's own wizards, or art with Brett Evans's OK. It currently runs without one.
6. **Check the site at 390px.** Includes the new partner box and the chessboard shelf. The Chrome extension still isn't connected.
7. **Matt: Events Manager custom conversion** on `content_name = newsletter`. **Decide on a consent banner** (Meta + Substack disclosed, nothing gates either; BONEZONE runs UK traffic to 31 Oct).
8. **Paint the Royal Herald.** BONEZONE closes **31 Oct 23:59 GMT**. Link every BONEZONE post to the hub (none exist yet).
9. **Next directory candidates:** Dolmenwood (249 impressions, position 8.6, no page), Necromunda (172, 8.3). Use the same research-subagent pattern.
10. **GSC Coverage weekly** (the 2–6 week dip after the rebuild). Matt's content calls in `roadmap/rebuild/PROGRESS.md`. Publish or bin `oldhammer-year-2027.mdx`. Funnel backfill (TSPN most). Hero images for Gloam + DWARF.

## Blockers
- Matt: wave-3 game one-liners (10 games), MESBG tier call, One Ring page-split call.
- YouTube OAuth re-auth before any write. **The consent screen must be given the Hobbinomicon channel**; reads succeed under any identity.
- Comments moderation has no pending-notification (manual D1 SQL only).

## Recently done
- 09-23 — **Five game pages live.** Infinity (Matt's take, terrain section, ITS two-list note, Robert Shepherd), Maleghast (+ STL news post, $66 warbands, 50% off via Taiga's Discord), Brawl Arcane 28 (`notPlayed`), Necropolis28 (linked to Matt's board guide and video), Pillage (Intro Set and all ten free downloads featured).
- 09-23 — **Fabricated Corvus Belli founders removed** and replaced with the four credited creators; studio facts fixed.
- 09-23 — **Affiliate partner box, chessboard shelf, `notPlayed` flag.**
- 09-16 — Description pass finished, 269/269.
- 09-15 — Newsletter moved to Substack, Mailgun deleted, site fully static. Mac → PC.

## Open questions
- **Pillage's rulebook art is credited to Midjourney AI** (Victrix apologised publicly). The page uses none of it. Should the page say so?
- **Affiliate link on `/studios/corvus-belli/`** too? Its store link is plain.
- **Corvus Belli press kit** needs a request form (name, email, website). Worth submitting for future Infinity art?
- **Necropolis28 hero is only 700px** (all Kickstarter would serve). Ask OwlShield for a larger copy?
- **`--verify-urls` validates local `dist/`, not production**; worth building a warning into the script. The guide-URL rule lives in four places.
- Carried from 09-16: `pinned: true` is dead on the homepage; embedded non-vlog thumbnails come from `i.ytimg.com`; `.md` GEO output emits raw `../../assets/` image paths (and JSX expressions, found 09-23); funnel threshold may want revisiting as the directory grows (now 16 games); housekeeping list in `SESSION_LOG.md` 09-15.
