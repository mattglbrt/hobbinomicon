# STATUS — The Hobbinomicon · updated 2026-10-01

## Now
**Directory: 60 live, 119 on `dev` (not deployed).** Rounds 2-8 are all committed on `dev` (last: `9c02ad6`), which finishes the backlog run. Everything builds, and no internal links are dead. **Deploy once, when Matt says**, with one `dev` → `main` merge.

**Lean protocol:** 10 searches per game, and the cap stays at 200. Rounds 6-8 (10-01) used about 95 searches for 25 games. **New rule (Matt, 09-30):** a game only lists once its full rules are out (see CLAUDE.md, "Only released games"). Hallowtide, Outlaws and Cosmic Horror are drafts, and the two live URLs 302 to Black Site on the next deploy. Gundam Assemble is Matt's one exception (`status: announced`).

Newsletter on Substack, first issue **06 Oct**. `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
1. **Matt: skim, then deploy** the 59 undeployed games (one merge).
2. **Matt: newsletter photos** and **Substack consolidation**, before 06 Oct.
3. **Open questions from the earlier rounds:** Here's the Ruckus (WiPrime-only rules, does it pass?), Rumpus / Alien Zoo Keeper / Scrungaloids (need links), and the Gundam hero with baked-in text.
4. **After 31 Oct:** flip Gundam Assemble to `active`. Recheck Hallowtide (preorder 30 Oct) and Steel Psalm.
5. Outlaws Gamefound ends 14 Oct. It stays a draft until the rules ship.
6. Paint the Royal Herald (BONEZONE closes 31 Oct). Run the description pass. Retag the 9 wrongly tagged `ttrpg` pages.

## Blockers
- Matt: 7 *(verify)* identities, 8 wave-3 one-liners, MESBG tier. Spearhead and The Old World are on hold.
- YouTube OAuth re-auth before any write. **The consent screen must be given the Hobbinomicon channel.**
- Comments moderation has no pending-notification (manual D1 SQL only).

## Recently done
- 10-01 — **Rounds 6-8** (on `dev`), 24 games: Deadzone, Firefight (Mantic), Song of Blades and Heroes, Sellswords & Spellslingers, This Is Not a Test, Warcrow Adventures, The Walking Dead: All Out War, Elder Scrolls: Call to Arms, Cyberpunk RED: Combat Zone, Conquest ×2, Bushido, Blood Eagle, Brethren, Ravenfeast, Sludge, Guild Ball, DreadBall (oop), Kings of War, X-Wing (oop), SAGA, A Song of Ice and Fire, Argatoria, Fantastic Battles. XCOM failed the release rule (recheck Jan 2027).
- 09-30 — **Backlog round 1** (on `dev`): Wyrdcry, This Quar's War, Carnivore, Hallowtide, Hametsu, Devilry Afoot, Spectre Operations.
- 09-30 — **Batch 7:** Bolt Action, Konflikt '47, Lion Rampant, Dragon Rampant, Oathmark 2E. Cavatore credited on Mordheim.
- 09-30 — **Batch 6:** Full Spectrum Dominance, Don't Look Back (+1698), Outlaws, Malediction, The Barons' War.
- 09-30 — **Batch 5:** Blood Bowl, Guards of Traitor's Toll (USD), Scrapjacks. Oasis and Pilgrim dropped.
- 09-30 — Batches 2–4, the RPG call (out; linked to AITD), the KDM take, the `sun-rot` tag, and the `/warhammer/` games row.

## Open questions (Matt, for the review)
- **Rounds 6-8:**
  - Mantic's KoW 4th edition posts and the DreadBall playtest credits list a "Matt Gilbert". Is that you?
  - Format calls: Firefight (skirmish or army?) and X-Wing (skirmish for ship combat?).
  - No `10mm` tag, to match the 6mm ruling (dropped from Argatoria). OK?
  - Small or text-on heroes: Deadzone, Walking Dead and KoW (about 730-1000px), SAGA (906px), X-Wing (a padded product shot), Bushido (logo in the banner).
  - No logo: Song of Blades, Sellswords, Cyberpunk Combat Zone, Blood Eagle, DreadBall, Fantastic Battles.
  - Designers *(verify)*: Cyberpunk CZ (Aaron Dill and John Kovaleski?), Bushido's original designer, X-Wing 2E, the Argatoria designer.
  - Is Cavatore's "lead designer on Conquest" line outdated? The 2026 rules credit Leandros Mavrokefalos.
  - Brethren: Wargames Atlantic only sells the PDF, so no studio is set. Steamforged's HQ: Sheffield or Salford?
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
