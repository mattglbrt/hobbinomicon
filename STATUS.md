# STATUS — The Hobbinomicon · updated 2026-10-19

## Now
**Live, all deployed** (`main` @ `40f349f`, 10-19). **120 games.** The directory and homepage redesign went live 10-06, and PSI mobile is 100.
- 10-19: BONEZONE is off the site (Matt isn't entering). The news post is drafted and 301s to the skeleton guide.
- All 4 latest vlogs have their transcript post and YouTube footer. New tag `goobins-gits`.

Scope and decisions: `roadmap/rebuild/05-directory-and-homepage.md`.

**The facet values on cards and filters are script-drafted and unreviewed.** That covers price, players, length, minis and scale. `npm run refresh-vlogs` is load-bearing: Netlify-built vlogs have no transcript.

## Next (ranked)
1. **Matt: work through `GAME-REVIEW.md`, the one checklist for all 120 games** (local, gitignored, newest first). Tick once the page reads right and the specs are correct; fix specs in the game's frontmatter. `node scripts/game-review.mjs` rebuilds it and keeps ticks. Then `phase1-vlog-games-review.md`.
2. **Matt: real-phone check of the homepage and `/games/` filter drawer.**
3. **Matt: read the new copy for voice:** the six setting intros, free-rules and mini-agnostic intros, the `/games/` description, the TTRPG line, "Browse similar", the TONKS page, and the `goobins-gits` tag description.
4. Answer the open questions below as you go through the checklist.
5. After 31 Oct: recheck Hallowtide and Steel Psalm. Outlaws' Gamefound ended 14 Oct; it stays a draft until it delivers. Jan 2027: XCOM.
6. **Matt: 7 *(verify)* identities, 8 wave-3 one-liners, MESBG tier.**
7. **YouTube OAuth:** authorized 10-19, so it lapses ~10-26. Re-auth with the Hobbinomicon channel before the next write.
8. **Comments moderation pending-notification.** Today it is manual D1 SQL only.

## Blockers
—

## Recently done
- 10-19: BONEZONE removed (post drafted + 301, three pages and CLAUDE.md cleaned). Orc skin vlog synced with transcript and tagged. `goobins-gits` tag + transcript fix. Footers on the 4 latest videos.
- 10-06: **Phases 1-3 + TONKS! deployed; PSI mobile 100**. One review checklist. Gundam Assemble set `active`. Homepage tweaks, 3 Orctober vlogs, Swup filter fix.
- 10-02: Phase 1 data. Facet fields on every game; `games[]` on 99 vlogs.

## Open questions (Matt)
- **10-19:** Is Goobinsgitz (people page, *Wanted! Reward* co-designer) the Goobins Gits sculptor? Keep `indie-miniatures` or rename to `indie-models`?
- **Rounds 6-8:**
  - The "Matt Gilbert" in the KoW 4E and DreadBall credits: is that you?
  - Firefight and X-Wing format. No `10mm` tag.
  - Small heroes: Deadzone, Walking Dead, KoW, SAGA, X-Wing, Bushido.
  - Missing logos: Song of Blades, Sellswords, Cyberpunk CZ, Blood Eagle, DreadBall, Fantastic Battles.
  - Designers *(verify)*: Cyberpunk CZ, Bushido, X-Wing 2E, Argatoria.
  - Cavatore's Conquest line. Brethren's studio. Steamforged's HQ.
- **Earlier:** Here's the Ruckus release-rule pass · Rumpus, Alien Zoo Keeper, Scrungaloids links · Gundam hero text · Wyrdcry on the Warhammer hub · Spectre master-list errors and `modern` · Carnivore solo/dinosaurs · This Quar's War status · Hallowtide credit · Hametsu Discord/Kickstarter · Devilry Afoot studio · logos/covers (Malediction, Barons' War, Bolt Action, Rampant) · GW crops and prices, the Underworlds take, Verrotwood publisher, the Ana Polanšćak page.
- **Directory:** a visible "big publisher" marker on cards? Only 2 games are pinned, too few for a staff-picks chip.
- **Carried:** r/mordheim unconfirmed · `--verify-urls` checks `dist/` only · every full build rewrites `youtube-stats.json`; revert before committing.
