# STATUS — The Hobbinomicon · updated 2026-09-30

## Now
**Directory at 40 games.** Batches 2, 3 and 4 went live 09-30 (`main` @ `cb14df9`, four deploys). The plan is `roadmap/directory-plan.md`: batches of 5, one deploy each, Matt skims first. **Never mention the video on a game page.** No-take pages say **"My take on this one is coming soon."** (`notPlayed: true`). Every fact is sourced or left out, and every image is official and checked by eye.

**RPGs are out of the directory (Matt, 09-30).** RPG talk links to aloneinthedungeon.com (CLAUDE.md). `/warhammer/` now lists every live `hub: warhammer` game.

**Bellwoken:** Matt is an official merchant partner. The page discloses it and links the Yellow Imp homepage until yellowimp.com launches, then should switch to the Bellwoken category.

Still true: newsletter on Substack, first issue **06 Oct**. `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
1. **Matt: the two newsletter photos** (`hero.jpg`, `workbench.jpg`) and **Substack consolidation under `mattglbrt`** (transfer, never delete) before issue #1 on **06 Oct**.
2. **Matt: skim batches 2–4** on phone and desktop. Check the logos marked `logoInvert` (Five Leagues, Space Weirdos, Hobgoblin, Verrotwood) in light and dark mode.
3. **Batch 5:** Blood Bowl + the top of wave 4 (Pilgrim, Guards of Traitor's Toll, OASIS, Scrapjacks).
4. **Matt's batch 4 answers:** the GW hero crops (Warcry, Kill Team), BattleTech's "keep list" line and skirmish vs army, GW prices and store links, an Underworlds take, the Verrotwood 2027 hardback publisher, and whether Ana Polanšćak gets a people page.
5. **Paint the Royal Herald.** BONEZONE closes **31 Oct 23:59 GMT**.
6. **Description pass for the new game videos:** Infinity x2, Necropolis board, three Necromunda. `npm run youtube-auth` first, with the Hobbinomicon channel at the consent screen.
7. **Housekeeping:** retag the 9 pages wrongly tagged `ttrpg` (KDM, Mage Knight, the Mordheim rant, skeletons). Consider pointing the solo/co-op guide's RPG section at AITD.
8. Necropolis28 update and news post when its Kickstarter launches. Brawl Arcane 28 and Mordheim heroes. Events Manager conversion and consent banner. GSC Coverage weekly, where `/games/hobgoblin` should now clear.

## Blockers
- Matt: wave-3 game one-liners (8 games), MESBG tier call, and identities for the 7 *(verify)* entries in wave 4.
- YouTube OAuth re-auth before any write. **The consent screen must be given the Hobbinomicon channel.**
- Comments moderation has no pending-notification (manual D1 SQL only).

## Recently done
- 09-30 — **Batch 4:** BattleTech (+ Alpha Strike), Verrotwood, Kill Team, Warcry, Warhammer Underworlds. **`/warhammer/` games row.**
- 09-30 — **Batch 3:** The Doomed, Sun Rot, Bellwoken, Kingdom Death: Monster (**Matt's take**), Hobgoblin (solo, reclaims the legacy URL). **`sun-rot` tag** on 5 posts.
- 09-30 — **Batch 2:** Sword Weirdos, 1490 DOOM, AoF Skirmish, AoF Quest, Five Leagues, plus Space Weirdos, Deep Below and Eric Michael Robertson. The solo/co-op guide's cards now point at game pages.
- 09-30 — **RPG call:** out, and linked to AITD from 11 RPG pages, the About page and Kal Arath. Vlog check: nothing missing from the site.
- 09-24 — Batch 1 live, the directory plan, "take coming soon", `logoInvert`.

## Open questions
- r/mordheim is unconfirmed (Reddit blocks automated checks). Neither the Sword Weirdos nor the Space Weirdos Kickstarter URL is verified (blocked), and Matt said to keep them.
- **`--verify-urls` validates local `dist/`, not production.** The guide-URL rule lives in four places.
- Carried: `pinned: true` is dead on the homepage; embedded non-vlog thumbnails come from `i.ytimg.com`; `.md` GEO output emits raw asset paths and JSX expressions; the funnel threshold may want revisiting at 40 games; every build rewrites `src/data/youtube-stats.json` (revert before committing).
