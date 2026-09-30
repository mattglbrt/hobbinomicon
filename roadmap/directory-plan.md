# Directory build plan (from the master list, 2026-09-24)

Source: Matt's `hobbinomicon-directory-master-list.md` (Downloads, 09-24),
scored against the site. The scoring table is in the session scratchpad; the
numbers that matter are below. This replaces the ranked to-do in
`roadmap/games.md` (Infinity and Necromunda are done; the rest of that list is
folded in here).

## Scope (Matt, 09-24)

- **In:** indie and established skirmish, Games Workshop games, mass battle
  and big mainstream games (tag `format: army` / `tier: big` honestly).
- **Out:** TTRPGs, all of them (Matt, 09-30). That covers Shadowdark, OSE,
  Wolves upon the Coast, D&D, Mörk Borg, Dolmenwood, Cairn, Knave, and the rest
  of §6, including the five in the Pillage video. RPG talk on the site links to
  **aloneinthedungeon.com**, Matt's dedicated RPG site. Kal Arath stays live.
- **Out:** the §7 watchlist, until something on it gets real traction.

## How a batch runs (5 games, one deploy)

1. **Research subagents in parallel**, one per game, told: every name, price,
   and date comes from a source it actually read, or it is left out. That rule
   caught invented founders on 09-23. The master list's own credits are not a
   source; three of them are already wrong (see the end).
2. **Images subagent**: logo + wide hero from official sources only, no AI art,
   checked by eye before anything enters the repo.
3. **Write the pages** in the Pillage/Necromunda shape: What it is · How it
   plays · How to start · Community & reviews. 3–6 tags. Designer and studio
   pages when the credit is sourced.
4. **No take unless Matt gives one.** `notPlayed: true`, no `verdict`: the page
   says "My take on this one is coming soon."
5. **Never mention the Pillage video on a game page** (Matt, 09-24).
6. Build, Matt skims, one merge `dev` → `main`.

At 5 per batch this is roughly 23 batches. Two batches per long session is
realistic, so figure on about ten sessions for everything in scope.

## Priority order

### Wave 1: the Pillage-video games (Matt is making the video now)

The non-RPG §1 games that aren't live. They go first so the pages are up
before the video is.

- **Batch 1:** Greathelm · Frostgrave · Rangers of Shadow Deep · Mordheim ·
  Turnip28
  - Greathelm was already flagged "create before the first video" in
    `games.md`.
  - Rangers of Shadow Deep already gets search impressions.
  - Mordheim has 8 posts of Matt's to link to.
  - Turnip28 is the parent of Necropolis28 and Ømen Tide, so it strengthens
    their funnels.
- **Batch 2:** Sword Weirdos · 1490 DOOM · OPR Age of Fantasy: Skirmish · OPR
  Age of Fantasy: Quest · Five Leagues from the Borderlands
- **Batch 3:** The Doomed · plus the four highest from Wave 2 below.

**Progress (09-30): batches 1–4 are live, and the directory is at 40.** Batch 2
added Space Weirdos, Deep Below and Eric Michael Robertson (Matt). Batch 3 was
The Doomed, Sun Rot, Bellwoken, Kingdom Death: Monster and Hobgoblin. Batch 4
was BattleTech (+ Alpha Strike), Verrotwood, Kill Team, Warcry and
Underworlds. **Batch 5:** Blood Bowl + Pilgrim, Guards of Traitor's Toll,
OASIS, Scrapjacks. Space Weirdos is done, so skip it in wave 5.

### Wave 2: demand, Matt's content, and old roadmap promises

- **Sun Rot**: 9 posts of Matt's, and it's the only other game with search
  impressions. The tag key is `smashbash`.
- **Bellwoken**: position 7 in search with no page (`games.md`).
- **Kingdom Death: Monster**: unlocks a series hub (`games.md`). It isn't on
  the master list.
- **Hobgoblin**: a legacy `/games/hobgoblin` URL is still in Search Console.
  Also on wave 3.
- **BattleTech / Alpha Strike**: 2 posts, and a big mainstream on-ramp.
- **Verrotwood**: Gardens of Hecate. Matt owns the Kickstarter minis.
- **MESBG**: needs Matt's tier call first. Not on the master list.
- **Flames of Orion: Matt wants it on the site now** (09-30). It's being
  built without the one-liner, as a coming-soon take.
- **Wave 3 games** (Gloam, Hag 28, Midguard, Rumpus, Cyber Savages, Alien Zoo
  Keeper, Scrungaloids): Matt, 09-30, "add all the wave 3 game with coming
  soon". They're built with no one-liner, as coming-soon takes.

### Wave 3: Games Workshop (feeds `/warhammer/`)

Kill Team · Warcry · Warhammer Underworlds · Blood Bowl

- Spearhead stays a draft until the City of Ash trigger.
- The Old World waits for the Oldhammer article (`games.md`).

### Wave 4: indie breakouts (§4), strongest signal first

1. ~~Pilgrim: The Haunted Frontier~~ (Matt, 09-30: not on the site)
2. Guards of Traitor's Toll
3. ~~OASIS~~ (Matt, 09-30: unknown to him, dropped)
4. Scrapjacks
5. Full Spectrum Dominance
6. 1698 (an expansion for Don't Look Back: covered on that page, 09-30)
7. Outlaws: The Curse of Sherwood Forest
8. Malediction
9. The Barons' War 2E
10. Repent! Ye Foolish Gods
11. Wyrdcry
12. This Quar's War
13. Carnivore
14. Hallowtide
15. Hametsu
16. Don't Look Back (done 09-30, batch 6)
17. Devilry Afoot
18. Spectre (Operations / Rogue Warriors / War Eternal)
19. Cosmic Horror
20. Sector Alix
21. Flames of Orion
22. Of Oil & Iron
23. Zeo Genesis
24. Steel Psalm
25. Mars: Code Aurora
26. FIRE: Modern Combat
27. Rapture
28. Eldfall Chronicles
29. Here's the Ruckus
30. The Last Mile

**Every row the list marks *(verify)* goes last.** Each one needs its
identity confirmed before any research starts: Lobsterpot, The Last War,
ARSENAL, SolCorps, Shroudfall, County Road Z, and "Necropolis / Rotvårlden".
That last one is a different game from Necropolis28.

### Wave 5: established skirmish (§3)

Ordered by the list's signal.

1. **The heavy hitters:** Malifaux 4E, Marvel: Crisis Protocol, Star Wars:
   Shatterpoint, Warcrow, Halo: Flashpoint, Fallout: Wasteland Warfare, Gundam
   Assemble
2. **The Osprey / McCullough shelf:** Stargrave, The Silver Bayonet, Gaslands:
   Refuelled, When Nightmares Come, Zona Alfa
3. **The rest:**
   - Moonstone, Carnevale, Burrows & Badgers, Blood & Plunder, Port Royal
   - Five Parsecs from Home, Space Weirdos, Grimdark Future: Firefight, Star
     Quest
   - Song of Blades and Heroes, Sellswords & Spellslingers, This Is Not a Test
   - Deadzone, The Walking Dead: All Out War, Warcrow Adventures, Elder
     Scrolls: Call to Arms, XCOM, Cyberpunk RED: Combat Zone
   - Bushido, Conquest: First Blood, Blood Eagle, Brethren, Ravenfeast, Sludge
   - Guild Ball (note its status), DreadBall, X-Wing

### Wave 6: mass battle and mainstream

Tag these `army`, and mark them `big` where they are.

- **Done 09-30 (batch 7, pulled forward by Matt):** Bolt Action 3E, Konflikt '47,
  Lion Rampant 2E, Dragon Rampant 2E, Oathmark (Second Edition, Aug 2026).
- Kings of War (with Ambush), Bolt Action 3E, Saga, Conquest: Last Argument of
  Kings
- Oathmark, Lion Rampant 2E, Dragon Rampant 2E, Konflikt '47
- A Song of Ice and Fire, Firefight, Argatoria, Fantastic Battles

## Full-backlog run (started 09-30, Matt: "keep going through them all")

Rounds of 8 parallel agents, committed to `dev`, deployed once at the end.
Stopped after round 1 when the session's **web-search budget (200,
`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`) ran out**. Agents must NOT work
around it by fetching search-engine result pages (one did on Devilry Afoot;
disclosed).

**Lean protocol (Matt, 09-30: keep the cap, fewer searches, "so we don't get
wonky").** The limit stays at 200. Round 1 averaged ~25-35 searches a game.
From round 2 onward:
- **Hard budget of 10 `WebSearch` calls per game.** When it's spent, the agent
  stops and reports what's missing. It does not keep hunting.
- **Official sources first, fetched directly.** Open the publisher's site,
  store page and rules PDF by URL (`WebFetch`), and search only to find those
  URLs.
- **Gaps get left out or marked *(verify)*** for Matt's review, the same rule
  as always. A thin page that's correct beats a full one that's guessed.
- **4 agents per round, not 8.** That's about 40 searches a round and 4 rounds
  a session, stopping at ~170 used to leave headroom. The rounds below stay as
  written. Each one is just split across two sessions.

- **Round 1 done:** Wyrdcry, This Quar's War, Carnivore, Hallowtide, Hametsu,
  Devilry Afoot, Spectre (as `spectre-operations`). **Not done:** Repent! Ye
  Foolish Gods (blocked by the search cap).
- **Round 2:** Repent! Ye Foolish Gods, Cosmic Horror, Sector Alix, Flames of
  Orion, Of Oil & Iron, Zeo Genesis, Steel Psalm, Mars: Code Aurora, FIRE:
  Modern Combat.
- **Round 2 done (09-30, lean, 13 searches for 5):** Repent! Ye Foolish Gods,
  Cosmic Horror, Of Oil & Iron, Flames of Orion. Sector AL-IX was built, then
  **removed by Matt** ("remove sector al-ix"). Keep it out.
- **Round 2b done (09-30, 26 searches):** Zeo Genesis, Mars: Code Aurora, FIRE:
  Modern Combat, Rapture. **Steel Psalm failed the release rule** (the 2024
  Kickstarter hasn't delivered and the books are still in production), so it
  wasn't built. Recheck it when BackerKit ships.
- **Release rule (Matt, 09-30):** a game lists only if its full rules are out
  now. See CLAUDE.md, "Only released games". Every agent brief checks it.
  Drafted under it: Hallowtide, Outlaws, Cosmic Horror. Bellwoken passes
  (delivered and complete, Matt).
- **Added by Matt 09-30, "coming soon" pages (no one-liner needed):** the wave-3
  games Gloam, Hag 28, Midguard, Rumpus, Cyber Savages, Alien Zoo Keeper,
  Scrungaloids.
- **Wave-3 round (09-30, 27 searches):** built Hag28, Midgard Heroic Battles
  (the list's "Midguard"; slug `midgard` picks up Matt's midgard guides) and
  Cyber Savage (the list's "Cyber Savages"). **Gloam is an RPG** (Sam Helms,
  tarot), so it's out under the RPG rule. **Rumpus, Alien Zoo Keeper and
  Scrungaloids couldn't be identified**, so they need a link or designer name
  from Matt. (Rumpus may be *Here's the Ruckus*, which is already in round 3.)
- **Snarling Badger round done (09-30, 6 searches for 5):** Reign in Hell,
  Space Station Zero, Majestic 13, Deth Wizards and Reign in Iron all built
  and all pass the release rule. The studio page lists the full run.
- No `6mm` tag (Matt, 09-30).
- **Round 3 done (09-30, 25 searches):** Eldfall Chronicles, Here's the Ruckus
  (Wi / Mike Peters; the rules are WiPrime-only now, so Matt should confirm
  it passes), Last Mile (Black Site zine; Matt: keep it, format narrative),
  Malifaux 4E, Marvel: Crisis Protocol, Star Wars: Shatterpoint, Warcrow.
  New studios: wyrd-miniatures, atomic-mass-games, freecompany,
  wargames-illustrated.
- **Round 3:** Rapture (moved to 2b), Eldfall Chronicles, Here's the Ruckus, The Last Mile,
  Malifaux 4E (Wyrd, owner of the studio page), Marvel: Crisis Protocol (owns
  `atomic-mass-games`), Star Wars: Shatterpoint, Warcrow (corvus-belli).
- **Round 4:** Halo: Flashpoint, Fallout: Wasteland Warfare (modiphius), Gundam
  Assemble, Stargrave, The Silver Bayonet, Gaslands: Refuelled, When
  Nightmares Come, Zona Alfa (osprey-games).
- **Round 5:** Moonstone, Carnevale, Burrows & Badgers, Blood & Plunder, Port
  Royal, Five Parsecs from Home (modiphius), Grimdark Future: Firefight, Star
  Quest (one-page-rules).
- **Round 6:** Song of Blades and Heroes, Sellswords & Spellslingers, This Is
  Not a Test, Deadzone (owns `mantic-games`), The Walking Dead: All Out War,
  Warcrow Adventures, Elder Scrolls: Call to Arms, XCOM.
- **Round 7:** Cyberpunk RED: Combat Zone, Bushido, Conquest: First Blood (owns
  `para-bellum`), Blood Eagle, Brethren, Ravenfeast, Sludge, Guild Ball.
- **Round 8:** DreadBall, X-Wing, Kings of War, Saga, Conquest: Last Argument
  of Kings, A Song of Ice and Fire, Firefight (Mantic; not OPR's), Argatoria,
  Fantastic Battles.
- Still skipped, need Matt: the 7 *(verify)* entries, the 8 wave-3 one-liner
  games, MESBG tier, Spearhead + The Old World (on hold).

## Needs Matt

- **MESBG tier** (big or indie). No One Ring page split: RPGs are out
  (09-30).
- **Wave-3 one-liners.**
- **A skim of each batch before deploy.**

## Master-list errors (don't copy these into pages)

- **Marked ☐ but already live:**
  - Pillage, Forbidden Psalm, Necropolis28, Trench Crusade
  - Infinity, Relicblade, Warmachine, Maleghast
  - Necromunda, Motley Crews, Wanted!
- **Credits that differ from the live, sourced pages:**
  - Forbidden Psalm: the list's credit differs; the page's credit is sourced.
  - Necropolis28: the list says "Turnip28 community"; the page credits Peter
    Vigors.
  - Maleghast: the list's studio differs from the page, which uses Chasm.
- **Slug:** the list has `/games/necropolis28/`; the live page is
  `/games/necropolis-28/`.
- **Duplicates:** Greathelm is in §1 and §4, Mordheim in §1 and §5.
- **Live pages the list doesn't have:** Mage Knight, TSPN, Monster Friends,
  Brawl Arcane 28.
- **The §8 "Plays with the Pillage Intro Set" callout is dropped**, because
  pages don't mention the video.
