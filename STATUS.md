# STATUS — The Hobbinomicon · updated 2026-10-06

## Now
**Directory redesign live** (`main` @ `aa7a2d6`, 10-06). **120 games.**
- `/games/` is the full filterable directory: players, minis, price, length, setting, scale, status, publisher, coverage. Filters live in the URL.
- New landing pages: free rules, mini-agnostic, six settings.
- The homepage is a dashboard: Latest videos → Browse by → Recently covered → News → Guides → hubs → newsletter section.

Scope and decisions: `roadmap/rebuild/05-directory-and-homepage.md`. "Most viewed" was dropped (Matt, 10-06).

**The facet values on cards and filters are script-drafted and unreviewed.** That covers price, players, length, minis and scale. Newsletter first issue was due 06 Oct. `npm run refresh-vlogs` is load-bearing: Netlify-built vlogs have no transcript.

## Next (ranked)
1. **Matt: work through `GAME-REVIEW.md`, the one checklist for all 120 games** (local, gitignored, newest first). Each game shows its directory **Specs** (what cards and filters display), **Missing** fields and **Check** lines for flagged guesses (70 games). Tick once the page reads right and the specs are correct; fix specs in the game's frontmatter. `node scripts/game-review.mjs` rebuilds it and keeps ticks. Then `phase1-vlog-games-review.md`.
2. **Matt: real-phone check of the homepage and `/games/` filter drawer.** PageSpeed Insights mobile is **100** after the redesign (Matt, 10-06).
3. **Matt: read the new copy for voice:** the six setting intros, free-rules and mini-agnostic intros, the `/games/` description, the TTRPG line, "Browse similar", and the TONKS page.
4. **YouTube:** paste the new ork-armor description in Studio, keeping the Lost in the Forest credit line. Optionally `npm run youtube-auth` (Hobbinomicon channel), then `update-descriptions.cjs --only kRZNffm3g2c,3WuOjAC77MI,6rukHpWR0ZM` for footers.
5. Answer the open questions below as you go through the checklist.
6. Paint the Royal Herald (BONEZONE closes 31 Oct). After 31 Oct: recheck Hallowtide and Steel Psalm (Gundam Assemble already set `active`, 10-06). Outlaws Gamefound ends 14 Oct (stays a draft). Jan 2027: XCOM.

## Blockers
- Matt: the checklist (item 1), 7 *(verify)* identities, 8 wave-3 one-liners, MESBG tier.
- YouTube OAuth re-auth before any write. **The consent screen must be given the Hobbinomicon channel.**
- Comments moderation has no pending-notification (manual D1 SQL only).

## Recently done
- 10-06: **Phases 1-3 + TONKS! deployed; PSI mobile 100**. One review checklist (`scripts/game-review.mjs`). Gundam Assemble set `active`. Then the homepage tweaks (videos first, newsletter section back) and 3 Orctober vlogs with transcripts and approved tags. Fixed a Swup bug that left the filters dead when `/games/` was reached by a click.
- 10-02: Phase 1 data. Facet fields on every game; `games[]` on 99 vlogs (only 15 games have videos).
- 10-01: Backlog rounds 6-8, 119 games live, `GAME-REVIEW.md`.

## Open questions (Matt)
- **Rounds 6-8:**
  - The "Matt Gilbert" in the KoW 4E and DreadBall credits: is that you?
  - Firefight and X-Wing format.
  - No `10mm` tag.
  - Small heroes: Deadzone, Walking Dead, KoW, SAGA, X-Wing, Bushido.
  - Missing logos: Song of Blades, Sellswords, Cyberpunk CZ, Blood Eagle, DreadBall, Fantastic Battles.
  - Designers *(verify)*: Cyberpunk CZ, Bushido, X-Wing 2E, Argatoria.
  - Cavatore's Conquest line. Brethren's studio. Steamforged's HQ.
- **Earlier:**
  - Here's the Ruckus release-rule pass.
  - Rumpus, Alien Zoo Keeper and Scrungaloids links.
  - Gundam hero text.
  - Wyrdcry on the Warhammer hub.
  - Spectre master-list errors and the `modern` tag.
  - Carnivore solo/dinosaurs. This Quar's War status. Hallowtide credit.
  - Hametsu Discord/Kickstarter. Devilry Afoot studio.
  - Logos and covers (Malediction, Barons' War, Bolt Action, Rampant).
  - GW crops and prices, the Underworlds take, Verrotwood publisher, the Ana Polanšćak page.
- **Directory:** a visible "big publisher" marker on cards? (A filter exists.) Only 2 games are pinned, too few for a staff-picks chip.
- **Carried:**
  - r/mordheim unconfirmed.
  - `--verify-urls` checks `dist/` only.
  - Every full build rewrites `youtube-stats.json`; revert before committing.
