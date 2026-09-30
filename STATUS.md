# STATUS — The Hobbinomicon · updated 2026-09-30 (late)

## Now
**Directory at 53 games live, 60 on `dev`.** Batches 2 to 7 went live today (`main` @ `7fb5c13`). **Backlog run round 1** (7 games) is committed on `dev` (`cec86b7`) but **not deployed**. The run plan is in `roadmap/directory-plan.md` under "Full-backlog run": rounds 2 to 8, about 57 games, with the studio page each round's designated agent creates.

**The run stopped because the session's web-search budget ran out** (200, `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`, shared by every subagent). Each game costs about 25–35 searches. **Agents must never work around the cap by fetching search-engine pages.** One did on Devilry Afoot; it was disclosed and stopped.

Rules unchanged: sourced or left out, official images checked by eye, "My take on this one is coming soon." for pages without a take, never mention the video, USD prices, and identity check first. RPGs link to aloneinthedungeon.com. Bellwoken discloses the Yellow Imp partnership.

Newsletter on Substack, first issue **06 Oct**. `npm run refresh-vlogs` is load-bearing.

## Next (ranked)
1. **Matt: raise `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`** (1,500+ covers the rest), then start a new session and **resume at round 2**. Deploy once at the end, including round 1.
2. **Matt: newsletter photos** (`hero.jpg`, `workbench.jpg`) and **Substack consolidation under `mattglbrt`** (transfer, never delete), before **06 Oct**.
3. **Matt: manual review of every game** once the run finishes. The round 1 questions are below.
4. **Outlaws:** update the "on Gamefound now" line after **14 Oct**.
5. **Paint the Royal Herald.** BONEZONE closes **31 Oct 23:59 GMT**.
6. Description pass for the new game videos (`youtube-auth` first, Hobbinomicon channel). Retag the 9 pages wrongly tagged `ttrpg`.
7. Necropolis28 update at Kickstarter launch. Brawl Arcane 28 and Mordheim heroes. Events Manager conversion and consent banner. GSC Coverage weekly.

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
