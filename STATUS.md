# STATUS — The Hobbinomicon · updated 2026-11-01

## Now
**Live** (`main` @ `89dbb2d`, deployed 11-01). **119 games** after CMON was removed. The directory and homepage redesign went live 10-06, and PSI mobile is 100.
- **Game review has started:** 1 of 119 ticked (TONKS). Argatoria is half-done and not ticked.

Scope and decisions: `roadmap/rebuild/05-directory-and-homepage.md`.

**On the Mac since 11-01. Install, build, dev server and transcript fetch all work** (details in SESSION_LOG). Known noise: `astro dev` logs a Netlify Edge Functions connection error, which is harmless (no edge functions). npm 11 rewrites `comments-api/package-lock.json`, so revert it rather than commit it. Port 4399 is often taken by aloneinthedungeon's dev server, so pick another.

**The facet values on cards and filters are script-drafted and mostly unreviewed.** That covers price, players, length, minis and scale. `npm run refresh-vlogs` is load-bearing: Netlify-built vlogs have no transcript.

## Next (ranked)
1. **Due now: recheck Hallowtide and Steel Psalm** against the release rule (31 Oct has passed). Outlaws stays a draft until it delivers. Jan 2027: XCOM.
2. **Matt: finish Argatoria in `GAME-REVIEW.md`.** It still needs players, length, a check of the £→$ prices ($32 / $70), whether the description should say "mass battle" instead of "rank-and-flank", and whether the `competitive` tag fits. Then carry on down the list (Blood Eagle is next). Tick a game only when Matt signs it off. `node scripts/game-review.mjs` rebuilds the file and keeps ticks. After that comes `roadmap/rebuild/phase1-vlog-games-review.md`.
3. **Matt: real-phone check of the homepage and `/games/` filter drawer.**
4. **Matt: read the new copy for voice:** the six setting intros, free-rules and mini-agnostic intros, the `/games/` description, the TTRPG line, "Browse similar", the TONKS page, and the `goobins-gits` tag description.
5. **YouTube OAuth: expired (confirmed 11-01).** Run `npm run youtube-auth` with the Hobbinomicon channel before the next write.
6. **Matt: 7 *(verify)* identities, 8 wave-3 one-liners, MESBG tier.**
7. **Comments moderation pending-notification.** Today it is manual D1 SQL only.

## Blockers
—

## Recently done
- 11-01: **Deployed** `89dbb2d` (CMON removal, TONKS Discord, Argatoria scale). **Moved to the Mac.** Deps installed, smoke test green (build, dev, transcripts, comments-api tsc), no Windows leftovers. YouTube OAuth confirmed expired. No code changes.
- 10-20: CMON removed; no CMON games from now on (CLAUDE.md). TONKS Discord link added and TONKS ticked. Argatoria scale set to mass-battle.
- 10-19: BONEZONE removed (post drafted + 301). Orc skin vlog synced and tagged. `goobins-gits` tag. Footers on the 4 latest videos.

## Open questions (Matt)
- **10-20:** TONKS has no length. Is there a play time in the rules?
- **10-19:** Is Goobinsgitz (people page, *Wanted! Reward* co-designer) the Goobins Gits sculptor? Keep `indie-miniatures` or rename to `indie-models`?
- **Rounds 6-8:**
  - The "Matt Gilbert" in the KoW 4E and DreadBall credits: is that you?
  - Firefight and X-Wing format. No `10mm` tag. Argatoria is 10mm too.
  - Small heroes: Deadzone, Walking Dead, KoW, SAGA, X-Wing, Bushido.
  - Missing logos: Song of Blades, Sellswords, Cyberpunk CZ, Blood Eagle, DreadBall, Fantastic Battles.
  - Designers *(verify)*: Cyberpunk CZ, Bushido, X-Wing 2E, Argatoria.
  - Cavatore's Conquest line. Brethren's studio. Steamforged's HQ.
- **Earlier:** Here's the Ruckus release-rule pass · Rumpus, Alien Zoo Keeper, Scrungaloids links · Gundam hero text · Wyrdcry on the Warhammer hub · Spectre master-list errors and `modern` · Carnivore solo/dinosaurs · This Quar's War status · Hallowtide credit · Hametsu Discord/Kickstarter · Devilry Afoot studio · logos/covers (Malediction, Barons' War, Bolt Action, Rampant) · GW crops and prices, the Underworlds take, Verrotwood publisher, the Ana Polanšćak page.
- **Directory:** a visible "big publisher" marker on cards? Only 2 games are pinned, too few for a staff-picks chip.
- **Orchestrator:** `mdggrowth/PROJECTS.md` is missing on the Mac. Not restored, or retired?
- **Carried:** r/mordheim unconfirmed · `--verify-urls` checks `dist/` only · every full build rewrites `youtube-stats.json`; revert before committing.
