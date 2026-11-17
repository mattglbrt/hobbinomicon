# STATUS — The Hobbinomicon · updated 2026-11-17

## Now
**Live** (`main` @ `77fea54`, deployed 11-17; live site not checked after the push). **119 games.** PSI mobile is 100.
- **Game review:** 1 of 119 ticked (TONKS). Argatoria is half-done and not ticked. The 11-10 review day did not happen in the repo.
- **Strategy (Matt, 11-17; drafts in `../strategy/`):** the channel becomes high-production flagships, one finished story per video, first the Pillage starter set (its directory page exists). The bulk of videos will be long form. Hobby tips keep a place here, and future quick tips and vlogs go to Alone in the Dungeon. Existing vlogs, tips and all Warmachine content stay untouched; there is just no dedicated Warmachine channel. Production starts in December and regular publishing starts the week of Mon 4 Jan 2027.
- **Goals:** 1,000 subscribers and monetized (448 on 11-17), memberships at 500, and 5,000 sessions a month on the site. Baseline: **1,711 GA sessions in the 28 days to 11-17.** Membership perks are undecided.
- **Newsletter:** starts Tue 5 Jan 2027 as a publication under one `mattglbrt` Substack. Transfer the existing publication, never delete it: the subdomain is hardcoded in this site and named in its privacy policy and terms.

Scope and decisions: `roadmap/rebuild/05-directory-and-homepage.md`.

**The facet values on cards and filters are script-drafted and mostly unreviewed** (price, players, length, minis, scale). `npm run refresh-vlogs` is load-bearing: Netlify-built vlogs have no transcript. Mac notes: `astro dev` logs a harmless Netlify Edge Functions error, npm 11 rewrites `comments-api/package-lock.json` (revert it), and port 4399 is often taken by aloneinthedungeon.

## Next (ranked)
1. **Matt: finish the directory review in `GAME-REVIEW.md`,** so the site is "done for now" before December production. Argatoria still needs players, length, a check of the £→$ prices ($32 / $70), "mass battle" vs "rank-and-flank", and whether the `competitive` tag fits. Blood Eagle is next. Tick a game only when Matt signs it off; batch the questions for one sitting. `node scripts/game-review.mjs` rebuilds the file and keeps ticks. After that comes `roadmap/rebuild/phase1-vlog-games-review.md`.
2. **Overdue: recheck Hallowtide and Steel Psalm** against the release rule (31 Oct has passed). Outlaws stays a draft until it delivers. Jan 2027: XCOM.
3. **Adding more content** (Matt, 11-09: the week of 11-16, no day picked).
4. **Matt: real-phone check of the homepage and `/games/` filter drawer,** and a look at the new footer byline.
5. **Matt: read the new copy for voice:** the six setting intros, free-rules and mini-agnostic intros, the `/games/` description, the TTRPG line, "Browse similar", the TONKS page, and the `goobins-gits` tag description.
6. **YouTube OAuth is expired.** Run `npm run youtube-auth` with the Hobbinomicon channel before the next write. The "By Matt Gilbert" byline in the channel description is parked (Matt, 11-17: not right now).
7. **Before January:** transfer the Substack publication to the `mattglbrt` account and check the hardcoded subdomain, privacy policy and terms still hold.
8. **Matt: 7 *(verify)* identities, 8 wave-3 one-liners, MESBG tier.**
9. **Comments moderation pending-notification.** Today it is manual D1 SQL only.

## Blockers
—

## Recently done
- 11-17: **Deployed** `77fea54`: "By Matt Gilbert" footer byline linking to mattglbrt.com. Strategy handoff folded in and Matt's clarifications recorded (SESSION_LOG). Traffic baseline taken. Pillage page confirmed.
- 11-01: Deployed `89dbb2d` (CMON removal, TONKS Discord, Argatoria scale). Moved to the Mac, smoke test green.
- 10-20: CMON removed; no CMON games from now on (CLAUDE.md). TONKS ticked.

## Open questions (Matt)
- **11-17:** "Toolbox kit" and "Painting Old Miniatures" go on Alone in the Dungeon "i think". Confirm, and the planner still lists them under Hobbinomicon. The 1,711 baseline is not yet in `../strategy/`. TikTok trial from @hobbinomicon, fed by shorts from the top 20 back-catalogue videos: who cuts them, and when?
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
