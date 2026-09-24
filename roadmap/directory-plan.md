# Directory build plan (from the master list, 2026-09-24)

Source: Matt's `hobbinomicon-directory-master-list.md` (Downloads, 09-24),
scored against the site. The scoring table is in the session scratchpad; the
numbers that matter are below. This replaces the ranked to-do in
`roadmap/games.md` (Infinity and Necromunda are done; the rest of that list is
folded in here).

## Scope (Matt, 09-24)

- **In:** indie and established skirmish, Games Workshop games, mass battle
  and big mainstream games (tag `format: army` / `tier: big` honestly).
- **Out for now:** TTRPGs. That parks Shadowdark, OSE, Wolves upon the Coast,
  D&D, Mörk Borg, Dolmenwood, Cairn, Knave, and the rest of §6. **Open call for
  Matt**: the five RPGs in the Pillage-video group, and Dolmenwood (which was
  already held for its new store). Kal Arath stays live either way.
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
- **Wave 3 games** (Flames of Orion, Gloam, Hag 28, Midguard, Rumpus, Cyber
  Savages, Alien Zoo Keeper, Scrungaloids): these still need Matt's one-liner
  each. Build them when he's written it.

### Wave 3: Games Workshop (feeds `/warhammer/`)

Kill Team · Warcry · Warhammer Underworlds · Blood Bowl

- Spearhead stays a draft until the City of Ash trigger.
- The Old World waits for the Oldhammer article (`games.md`).

### Wave 4: indie breakouts (§4), strongest signal first

1. Pilgrim: The Haunted Frontier
2. Guards of Traitor's Toll
3. OASIS
4. Scrapjacks
5. Full Spectrum Dominance
6. 1698
7. Outlaws: The Curse of Sherwood Forest
8. Malediction
9. The Barons' War 2E
10. Repent! Ye Foolish Gods
11. Wyrdcry
12. This Quar's War
13. Carnivore
14. Hallowtide
15. Hametsu
16. Don't Look Back
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

- Kings of War (with Ambush), Bolt Action 3E, Saga, Conquest: Last Argument of
  Kings
- Oathmark, Lion Rampant 2E, Dragon Rampant 2E, Konflikt '47
- A Song of Ice and Fire, Firefight, Argatoria, Fantastic Battles

## Needs Matt

- **The RPG call.** Are the five RPGs in the Pillage video in, or out like the
  rest of §6? What about Dolmenwood?
- **MESBG tier** (big or indie). The One Ring page split falls away if RPGs
  stay out.
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
