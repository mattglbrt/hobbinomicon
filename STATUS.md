# STATUS — The Hobbinomicon · updated 2026-10-01

## Now
**Directory: 119 games live** (deployed 10-01, `main` @ `3af63b4`). The backlog run (rounds 1-8) is finished. Hallowtide and Cosmic Horror now 302 to Black Site.

**Lean protocol:** 10 searches per game, and the cap stays at 200. Rounds 6-8 (10-01) used about 95 searches for 25 games. **New rule (Matt, 09-30):** a game only lists once its full rules are out (see CLAUDE.md, "Only released games"). Hallowtide, Outlaws and Cosmic Horror are drafts, and the two live URLs 302 to Black Site on the next deploy. Gundam Assemble is Matt's one exception (`status: announced`).

Newsletter on Substack, first issue **06 Oct**. `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
1. **Matt: review the live game pages** one at a time, ticking them off in `GAME-REVIEW.md` (local, gitignored, newest first). Answer the open questions below as you go.
2. **Matt: newsletter photos** and **Substack consolidation**, before 06 Oct.
3. **After 31 Oct:** flip Gundam Assemble to `active`. Recheck Hallowtide (preorder 30 Oct) and Steel Psalm. **Jan 2027:** recheck XCOM: The Miniatures Game.
4. Outlaws Gamefound ends 14 Oct. It stays a draft until the rules ship.
5. Paint the Royal Herald (BONEZONE closes 31 Oct). Run the description pass. Retag the 9 wrongly tagged `ttrpg` pages.
6. More backlog candidates if wanted: Fantastic Scuffles, Song of Drums and Shakos, Flying Lead.

## Blockers
- Matt: 7 *(verify)* identities, 8 wave-3 one-liners, MESBG tier. Spearhead and The Old World are on hold.
- YouTube OAuth re-auth before any write. **The consent screen must be given the Hobbinomicon channel.**
- Comments moderation has no pending-notification (manual D1 SQL only).

## Recently done
- 10-01 — **Rounds 6-8** (24 games; XCOM failed the release rule), then **deployed everything**: `main` @ `3af63b4`, 119 games live. Made `GAME-REVIEW.md`, the review checklist, instead of drafting games (drafting would have 404'd YouTube links and dropped search ranking).
- 09-30 — Backlog rounds 1-5, batches 5-7, Snarling Badger's five, wave 3, Gundam Assemble, the release rule and the RPG rule (RPGs out, linked to AITD).

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
- **Earlier rounds:** Here's the Ruckus (WiPrime-only rules, does it pass?). Rumpus, Alien Zoo Keeper and Scrungaloids need links. The Gundam hero has text baked in.
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
