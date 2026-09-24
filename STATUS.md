# STATUS — The Hobbinomicon · updated 2026-09-24

## Now
**The directory is at 18 games.** `main` @ `e6296a9`, three deploys 09-24 (the last added logos + hero art for both, and a `logoInvert` flag for white logos). **Forbidden Psalm** (with Will RD and Wird Designs) and **Necromunda** are live, both `notPlayed`. The Necromunda page leads with the new edition (**Necromunda Skirmish**, released 15 Aug 2026), then what changed from 2017, the 1995 original, and the **Roleplay** game announced 18 Sep. It has a gang-builder section with **Gyrinx** and **Munda Manager**, which both support the new edition; YakTribe is frozen on 2017. Matt's three Necromunda guides link to the page, and the how-to-start guide got a dated 2026 update note.

Still true: newsletter on Substack, first issue **06 Oct**. Transcripts only reach the site from a local sync, so `npm run refresh-vlogs` is load-bearing. Every page is researched with names sourced or left out (lesson from 09-23).

## Next (ranked)
1. **Matt: consolidate the Substack publications under `mattglbrt`.** **Transfer, never delete**: the subdomain survives a transfer, is hardcoded here and named in the policy and terms.
2. **Matt: the two newsletter photos** (`hero.jpg`, `workbench.jpg`) before issue #1 on 06 Oct. Both fall back to flat `bg-ink`.
3. **Description pass for six videos**: Infinity x2, the Necropolis board video, and the three Necromunda videos (now in `game-videos.json`). `npm run youtube-auth` first, Hobbinomicon channel at the consent screen, `--verify-urls`, then `--only <ids>`.
4. **Necropolis28: when the hardback Kickstarter launches**, update the "hasn't launched yet" line and write a news post. **After Matt's October solo-rules video**, add it to `game-videos.json`.
5. **Brawl Arcane 28 hero image**: Matt's own wizards, or art with Brett Evans's OK.
6. **Check the site at 390px.** Partner box, chessboard shelf, the new Necromunda tools grid. The Chrome extension still isn't connected.
7. **Matt: Events Manager custom conversion** on `content_name = newsletter`. **Decide on a consent banner** (BONEZONE runs UK traffic to 31 Oct).
8. **Paint the Royal Herald.** BONEZONE closes **31 Oct 23:59 GMT**. Link every BONEZONE post to the hub.
9. **Dolmenwood: wait** until its makers launch their own store (moving off Exalted Funeral, Matt 09-24). Then the same research-subagent pattern.
10. **GSC Coverage weekly.** Matt's content calls in `roadmap/rebuild/PROGRESS.md`. Publish or bin `oldhammer-year-2027.mdx`. Funnel backfill (TSPN most). Hero images for Gloam + DWARF.

## Blockers
- Matt: wave-3 game one-liners (10 games), MESBG tier call, One Ring page-split call.
- YouTube OAuth re-auth before any write. **The consent screen must be given the Hobbinomicon channel**; reads succeed under any identity.
- Comments moderation has no pending-notification (manual D1 SQL only).

## Recently done
- 09-24 — **Forbidden Psalm live**: End Times Edition, credited "Will RD" as on the official site, studio page for Wird Designs.
- 09-24 — **Necromunda live**: 2026 edition, 2017 changes, 1995 history, Roleplay. `hub: warhammer`. Gang-builder section. Guide fixed ("Munda Manager (Yaktribe)" was two sites).
- 09-23 — **Five game pages live** (Infinity, Maleghast, Brawl Arcane 28, Necropolis28, Pillage); fabricated Corvus Belli founders removed; `storeAffiliate`, `chessboard`, `notPlayed` switches.
- 09-16 — Description pass finished, 269/269.

## Open questions
- **Matt: is r/necromunda the right subreddit?** Reddit blocks automated checks, so it's left off the page. Necro Raw's support for the new edition is also unknown.
- **The Warhammer hub is built from guides**, so `hub: warhammer` on a game entry doesn't list it on `/warhammer/`. Worth a games row on the hub once there's a second live entry.
- **`--verify-urls` validates local `dist/`, not production**; worth building a warning into the script. The guide-URL rule lives in four places.
- Carried: `pinned: true` is dead on the homepage; embedded non-vlog thumbnails come from `i.ytimg.com`; `.md` GEO output emits raw `../../assets/` image paths and JSX expressions; funnel threshold may want revisiting (18 games); every build rewrites `src/data/youtube-stats.json`; housekeeping list in `SESSION_LOG.md` 09-15.
