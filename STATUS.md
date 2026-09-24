# STATUS — The Hobbinomicon · updated 2026-09-24

## Now
**Working through the directory master list.** `main` @ `bfcd907`, five deploys 09-24. There are 23 games: Forbidden Psalm, Necromunda, and **batch 1** (Greathelm, Frostgrave, Rangers of Shadow Deep, Mordheim, Turnip28) went live today. The plan is `roadmap/directory-plan.md`: Matt's ~140-game list, scoped to skirmish, Games Workshop, and mass battle (TTRPGs out), and done in batches of 5, with the Pillage-video games first. **Never mention the video on a game page.**

Games without Matt's take say **"My take on this one is coming soon."** (`notPlayed: true`, no custom lines). White logos use `logoInvert`. Every page is researched with names sourced or left out, and every image comes from official sources, checked by eye, with no AI art.

Still true: newsletter on Substack, first issue **06 Oct**. `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
1. **Matt: review batch 1** on phone and desktop, including the four inverted logos (Frostgrave, Mordheim, Rangers, Turnip28) in light and dark mode and the Maleghast logo in light mode.
2. **Batch 2:** Sword Weirdos · 1490 DOOM · OPR Age of Fantasy: Skirmish · OPR Age of Fantasy: Quest · Five Leagues from the Borderlands. Batch 3 is The Doomed plus the top of Wave 2 (Sun Rot, Bellwoken, Kingdom Death: Monster, Hobgoblin).
3. **Matt: consolidate the Substack publications under `mattglbrt`.** Transfer, never delete.
4. **Matt: the two newsletter photos** (`hero.jpg`, `workbench.jpg`) before issue #1 on 06 Oct.
5. **Description pass for six videos:** Infinity x2, the Necropolis board video, and three Necromunda videos. `npm run youtube-auth` first, with the Hobbinomicon channel at the consent screen.
6. **Necropolis28** update and news post when its Kickstarter launches. Its logo needs Matt (from the Kickstarter page or Peter Vigors).
7. **Brawl Arcane 28 hero** (Matt's wizards or Brett Evans's OK). **Mordheim hero** would need a photo of Matt's own warbands.
8. **Matt: Events Manager custom conversion**, and a consent-banner call.
9. **Paint the Royal Herald.** BONEZONE closes **31 Oct 23:59 GMT**.
10. GSC Coverage weekly. Matt's calls in `roadmap/rebuild/PROGRESS.md`. Hero images for Gloam and DWARF.

## Blockers
- **Matt: the RPG call.** Shadowdark, OSE, Wolves upon the Coast, D&D, and Mörk Borg are in the Pillage video, but RPGs are out of scope. Also Dolmenwood (held for its new store anyway).
- Matt: wave-3 game one-liners, MESBG tier call.
- YouTube OAuth re-auth before any write. **The consent screen must be given the Hobbinomicon channel.**
- Comments moderation has no pending-notification (manual D1 SQL only).

## Recently done
- 09-24 — **Batch 1 live:** Greathelm, Frostgrave, Rangers of Shadow Deep, Mordheim (oop, thumbnail only), Turnip28 (`army`). People: McCullough, Malev, Max FitzGerald. Studios: Modiphius, Osprey Games.
- 09-24 — **Directory plan** from Matt's master list. **"Take coming soon"** standard line. **`logoInvert`** flag. Logos and heroes for Forbidden Psalm, Necromunda, Ømen Tide, and Maleghast.
- 09-24 — **Forbidden Psalm and Necromunda live.** Necromunda gang-builder tools. Guide fixed ("Munda Manager (Yaktribe)" was two sites).
- 09-23 — Five game pages (Infinity, Maleghast, Brawl Arcane 28, Necropolis28, Pillage). Fabricated Corvus Belli founders removed.

## Open questions
- r/mordheim is unconfirmed (Reddit blocks automated checks). Necro Raw's support for the new Necromunda edition is unknown.
- **The Warhammer hub is built from guides**, so `hub: warhammer` on a game (Necromunda, Mordheim) doesn't list it on `/warhammer/`. There are now two live entries, which is enough to add a games row to the hub.
- **`--verify-urls` validates local `dist/`, not production.** The guide-URL rule lives in four places.
- Carried: `pinned: true` is dead on the homepage; embedded non-vlog thumbnails come from `i.ytimg.com`; `.md` GEO output emits raw asset paths and JSX expressions; funnel threshold may want revisiting (23 games); every build rewrites `src/data/youtube-stats.json`; housekeeping list in `SESSION_LOG.md` 09-15.
