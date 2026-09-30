# STATUS — The Hobbinomicon · updated 2026-09-30 (evening)

## Now
**Directory: 60 live, 102 on `dev` (not deployed).** Round 1 went live this morning (`main` @ `1c8f26d`). Since then, rounds 2-5, wave 3, Snarling Badger's five and Gundam Assemble are all committed on `dev` (last: `7c39e6b`). Everything builds, and no internal links are dead. **Deploy once, when Matt says**, with one `dev` → `main` merge.

**Lean protocol:** 10 searches per game, and the cap stays at 200. A game averages about 3.5. This session used about 155. **New rule (Matt, 09-30):** a game only lists once its full rules are out (see CLAUDE.md, "Only released games"). Hallowtide, Outlaws and Cosmic Horror are drafts, and the two live URLs 302 to Black Site on the next deploy. Gundam Assemble is Matt's one exception (`status: announced`).

Newsletter on Substack, first issue **06 Oct**. `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
1. **Rounds 6-8** in a fresh session (about 25 games, listed in `roadmap/directory-plan.md`). Then **deploy**.
2. **Matt: newsletter photos** and **Substack consolidation**, before 06 Oct.
3. **Matt: skim the new pages.** Questions are in the session log and the plan. The big ones: Here's the Ruckus (WiPrime-only rules, does it pass?), Rumpus / Alien Zoo Keeper / Scrungaloids (need links), and the Gundam hero with baked-in text.
4. **After 31 Oct:** flip Gundam Assemble to `active`. Recheck Hallowtide (preorder 30 Oct) and Steel Psalm.
5. Outlaws Gamefound ends 14 Oct. It stays a draft until the rules ship.
6. Paint the Royal Herald (BONEZONE closes 31 Oct). Run the description pass. Retag the 9 wrongly tagged `ttrpg` pages.

## Blockers
- **The web-search budget** (above). Nothing else blocks the run.
- Matt: 7 *(verify)* identities, 8 wave-3 one-liners, MESBG tier. Spearhead and The Old World are on hold.
- YouTube OAuth re-auth before any write. **The consent screen must be given the Hobbinomicon channel.**
- Comments moderation has no pending-notification (manual D1 SQL only).

## Recently done
- 09-30 — **Backlog round 1** (on `dev`): Wyrdcry, This Quar's War, Carnivore, Hallowtide, Hametsu, Devilry Afoot, Spectre Operations.
- 09-30 — **Batch 7:** Bolt Action, Konflikt '47, Lion Rampant, Dragon Rampant, Oathmark 2E. Cavatore credited on Mordheim.
- 09-30 — **Batch 6:** Full Spectrum Dominance, Don't Look Back (+1698), Outlaws, Malediction, The Barons' War.
- 09-30 — **Batch 5:** Blood Bowl, Guards of Traitor's Toll (USD), Scrapjacks. Oasis and Pilgrim dropped.
- 09-30 — Batches 2–4, the RPG call (out; linked to AITD), the KDM take, the `sun-rot` tag, and the `/warhammer/` games row.

## Open questions (Matt, for the review)
- **Round 1:**
  - Wyrdcry (a Warcry fan hack): put it on the Warhammer hub?
  - Spectre's "Rogue Warriors" and "War Eternal" aren't Spectre products (master-list error?), and there's a new `modern` tag.
  - Carnivore: solo or not? Also, a `dinosaurs` tag?
  - This Quar's War: status, and the hero may be a test cover.
  - Hallowtide: Chris Bunge's credit comes from the cover byline only.
  - Hametsu: a second Discord invite, and was there a Kickstarter?
  - Devilry Afoot: the studio name.
- **Earlier:**
  - Malediction and Barons' War logos (adapted), the small Bolt Action logo, and the portrait Rampant covers.
  - GW hero crops, BattleTech's "keep list" line and format, GW prices, an Underworlds take, the Verrotwood publisher, and an Ana Polanšćak people page.
- Carried: r/mordheim unconfirmed. `--verify-urls` checks `dist/` only. Every build rewrites `youtube-stats.json` (revert before committing). The funnel threshold may want revisiting at 60 games.
