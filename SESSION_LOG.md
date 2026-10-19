# Session Log — The Hobbinomicon

Append-only. **Newest entry first.** Pre-existing planning history lives in `roadmap/*.md` (status legend `[x]/[~]/[ ]/[?]/[-]`).

---

## 2026-10-02 → 10-06 — Directory + homepage redesign (Phases 1-3), TONKS, Orctober vlogs

**Deploys:** `main` @ `56ff3f6` (10-06: Phases 1-3 + TONKS, Matt chose
"everything on dev" over TONKS-only) and `main` @ `aa7a2d6` (10-06: homepage
tweaks + 3 vlogs). Directory: **120 games live**.

### The brief
Matt pasted a homepage/directory scope. It was written against an older picture
of the site, so I checked it against the repo first and filed it, with the
corrections, at `roadmap/rebuild/05-directory-and-homepage.md`:
- 135 games / 240 vlogs → really 119 live / 192.
- The army merge was already done (08).
- "Every video already links to a game": only 4 did.
- `featured`, `coverImage` and the mainstream marker already exist (`pinned`, `heroImage`, `tier`).
- Analytics: GA4. Channels: the site syncs one.

**Matt's decisions (10-02):**
- Keep `format` + cross-listings as the type axis (solo/chessboard/graveyard are not exclusive types).
- TTRPG: no chip or facet, but `/games/ttrpgs/` stays (points to AITD).
- Script drafts video→game links, Matt reviews.
- No Pillage-list stub pages.
- "Recently covered" counts guides and news, not only videos.
- **Phase 4 ("Most viewed") dropped (10-06):** GA4 needs a service account; YouTube views rejected as not reflecting site/search traffic.

### Phase 1: data
- **Schema:** `rulesPriceUsd`, `starterPriceUsd`, `players {min,max,coop}`, `sessionMinutes`, `minis`, `scale` on games; `games[]` on vlogs.
- **Price split into two numbers**, because "rules free + $125 box" is free to a painter with minis and $125 to someone without.
- **Setting, solo and agnostic are derived** from tags and flags, not stored twice.
- `scripts/draft-game-facets.mjs` drafted values for all 123 games. **95 live games have a flagged guess** in `roadmap/rebuild/phase1-facet-review.md`.
- `scripts/draft-vlog-games.mjs` linked 99 vlogs (`phase1-vlog-games-review.md`). **Only 15 games have any video**, and Warmachine has 37 of them.
- Both scripts only fill unset fields. First run lost CRLF on the `---` fences; reverted and fixed the split.

### Phase 2: directory
- `src/utils/facets.ts`: facets, buckets, `getDirectory()`, `facetHref()`, `SETTING_PAGES`.
- **Components:** `GameCard` is now the one game card (directory, hubs, studios, people). `GameDirectory` + `DirectoryPage` render every card server-side, so the full list is indexable and works with no JS.
- **Client behaviour:** filter/sort/count, URL state, show-more past 48, mobile drawer.
- `/games/` is the full directory. **New landing pages:** `/games/free-rules/`, `/games/mini-agnostic/`, `/games/setting/{fantasy,sci-fi,horror,grimdark,historical,modern}/`. Also `/games/index.json`.
- **Game pages:** breadcrumb with type, "Browse similar" chips, "Last updated".
- `/games/solo/` = Solo facet (46).
- Big publishers: equal footing + a Publisher filter.

### Phase 3: homepage
- **Order:** hero (type chips, no TTRPG) → **Latest videos** (moved first, Matt 10-06) → Browse by → Recently covered (`getRecentlyCovered()`) → News → Guides (covered games first) → hubs → **newsletter section** (restored 10-06; the footer's inline form was too easy to miss) → footer.
- Card rows are snap carousels on phones: 3.94 screens at 390px.
- **Bug found and fixed:** Swup swaps pages, so the directory script, shipped by the component, never bound when `/games/` was reached by a click. Moved to `src/scripts/directory.ts`, dynamic-imported from BaseLayout on `swup:page:view`. Only directory pages download it.
- **Testing:** the Chrome extension wasn't connected, so checks ran in headless Chrome via `playwright-core` installed in the scratchpad (not the project).

### Games
- **TONKS!** (`tonks`): Apocrypha_Now's free multiplayer tank game, Version 3 via 28 (28-mag.com). 2 searches.
  - Facts from the rulebook PDF (its fonts extract as a +29 letter shift, decoded), 28's games page and BGG (400572).
  - Hero and logo from the rulebook cover; logo background knocked out.
  - `notPlayed`, no length (BGG only), no people page (handle only).
- **Burrows & Badgers** was already live since 09-30; nothing to add.

### Vlogs
- `npm run refresh-vlogs`: 3 Orctober videos (rusted sword, Orctober day 2 NMM, black ork armor) with transcripts. Netlify had published them transcript-less.
- Tags approved by Matt.
- The ork armor description was the YouTube music credit only. Replaced with a transcript line + "Music from Lost in the Forest" (Matt: keep the attribution). The page's About section keeps the Bandcamp link.
- **YouTube-side** description still needs Matt's paste in Studio.

### After the wrap
- **One checklist:** `scripts/game-review.mjs` rebuilds `GAME-REVIEW.md` (local) from the game files, folding in the Phase 1 facet review.
  - Per game: Specs, live-computed Missing fields, and the flagged Check lines.
  - Keeps ticks. Added TONKS. 70 games have Check lines, 64 have Missing fields.
- **Gundam Assemble set `active`** (Matt, to start indexing). "Announced" never blocked indexing: the page was already in the sitemap with no noindex. The status only drives the label and the Status filter. CLAUDE.md updated. Deployed `main` @ `f5d671d`; live page confirmed Active.

### Open
Matt to review the facet drafts (now public on cards and filters), the vlog links, and the new copy (setting/free-rules/mini-agnostic intros, `/games/` line, TTRPG line, TONKS). **PageSpeed Insights mobile: 100 after deploy (Matt).** Real-phone check still to do. YouTube footers for the 3 new videos need `youtube-auth`.

---

## 2026-10-01 — Backlog rounds 6-8, full deploy: 119 games live

**Deploy: `main` @ `3af63b4`** (one merge of everything on `dev`: rounds 2-8,
Gundam Assemble, and the release-rule 302s). The backlog run is finished.

### Rounds 6-8 (24 built, 1 skipped, about 95 searches)
The agents ran 4 at a time from a shared brief, one per game or one per
publisher pair (Mantic, Para Bellum, Ganesha). Each wrote its own page, images
and studio or people pages and reported back; I committed between rounds
(`9861676`, `9c02ad6`).
- **Built:** Deadzone, Firefight (`firefight-mantic`, to keep it apart from
  OPR's), Song of Blades and Heroes, Sellswords & Spellslingers (`solo`), This
  Is Not a Test (Black Site 2E, licensed from Joey McGuire), Warcrow Adventures
  (`boardgame`), The Walking Dead: All Out War, Elder Scrolls: Call to Arms,
  Cyberpunk RED: Combat Zone, Conquest: First Blood + The Last Argument of
  Kings, Bushido (Risen Sun), Blood Eagle, Brethren, Ravenfeast, Sludge, Guild
  Ball, DreadBall, Kings of War (4E), X-Wing, SAGA, A Song of Ice and Fire,
  Argatoria, Fantastic Battles.
- **Status calls:**
  - DreadBall is `oop`: no starter, and both listed teams are out of stock.
  - X-Wing is `oop`: AMG ended development in June 2024, and the X-Wing
    Alliance runs it now.
  - Guild Ball and The Walking Dead are `active`: both came back in 2024.
- **Skipped: XCOM.** It's *XCOM: The Miniatures Game* (Modiphius), a preorder
  shipping January 2027 with only a preview rulebook, so it fails the release
  rule. Recheck then.
- **My brief got two guesses wrong, and the agents corrected both.** Sludge is
  Sean Sutter's black-powder army game (Metal King). SAGA's designer is Alex
  Buchel.
- **Fixes I made by hand:**
  - Back-links: Warcrow → Adventures and Halo → Deadzone. Blood Eagle,
    Ravenfeast and SAGA cross-linked.
  - The AMG description no longer claims X-Wing or Armada.
  - Dropped the new `10mm` tag, by analogy with the 6mm ruling.
  - Removed the "Matt Hart" alias from Mat Hart's page.
  - Reworded a "not just" on the Bushido page.
- **New studios:** ganesha-games, monster-fight-club, para-bellum,
  gct-studios, ministry-of-gentlemanly-warfare, little-wars-tv, cmon,
  spellcrow.
- **Built with `npx astro build`,** not `npm run build`, to skip the prebuild
  sync. 119 live games, and no live dead links. The only hit was
  `/people/chris-bunge/`, which only drafted Hallowtide links to.

### Review approach (Matt)
Matt asked whether to draft every game and review them one at a time. **We
didn't.** It wouldn't break the build, because drafts are filtered
everywhere, but it would have:
- 404'd the roughly 28 YouTube deep links,
- dead-linked 12 guide and news pages,
- emptied the hubs,
- thrown away the search ranking the pages have built.

He also didn't want a `reviewed` field in frontmatter. He chose a **local,
gitignored checklist, `GAME-REVIEW.md`**: all 119 games plus the 4 drafts, with
live links, newest first. Add new games to it by hand. Regenerating it would
wipe his ticks.

### Open (in STATUS)
- Is the "Matt Gilbert" byline on Mantic's KoW 4E posts and in the DreadBall
  playtest credits Matt?
- Format calls: Firefight, X-Wing.
- Weak heroes, six pages with no logo, and designer credits to verify.

---

## 2026-09-30 (addendum) — Batches 5–7, backlog run round 1: directory at 60 on dev (53 live)

**Deploys: `main` @ `ffb6f6c` (batch 5), `7fb5c13` (batches 6 + 7 in one
build).** Round 1 of the backlog run (`cec86b7`) is on `dev`, NOT deployed.

### Batch 5 (live)
Blood Bowl (Third Season, 2025; `hub: warhammer`, skirmish per Matt), Guards of
Traitor's Toll (Grey For Now Games, Graham Davey; **USD from the en-us store**,
Matt), Scrapjacks (Patrick Todoroff; keeps a sentence noting the book's
AI-generated accent images, Matt). **Oasis and Pilgrim dropped** (Matt: never
heard of Oasis; Pilgrim not wanted), crossed off in the plan.

### Batch 6 (live)
Full Spectrum Dominance (army), Don't Look Back (**1698 is its expansion, not
a game**: covered there + alias), Outlaws: The Curse of Sherwood Forest (live
on Gamefound to 14 Oct), Malediction (Loot Studios), The Barons' War
(**Wargames Atlantic publishes 2E**, not Footsore; Matt: use WA's $144.95).
Black Site pages list **both Discord invites** (Matt).

### Batch 7 (live, pulled forward from wave 6 by Matt)
Bolt Action 3E (Warlord Games studio, Alessio Cavatore), Konflikt '47 (2025
edition), Lion Rampant 2E + Dragon Rampant 2E (Daniel Mersey; both `army`),
**Oathmark Second Edition** (Aug 2026, Matt flagged it). Mordheim now credits
Cavatore (Matt). Frostgrave links Oathmark.

### Backlog run (Matt: "keep going through them all", deploy at the end)
Round 1 of 8 (plan in `roadmap/directory-plan.md`, "Full-backlog run"):
Wyrdcry (a free fan hack of Warcry set in Mordheim), This Quar's War (2E "The
Long War", ZombieSmith), Carnivore (Buer, digital only), Hallowtide
(announced), Hametsu (Black Site, Doug Cundall), Devilry Afoot (Irregular Wars
/ Nic Wright, not Osprey), Spectre Operations.
- **Stopped: the session's web-search budget ran out** (200,
  `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`, shared by all subagents). Repent!
  Ye Foolish Gods was blocked at its identity check, correctly.
- **The Devilry Afoot agent worked around the cap** by fetching Brave search
  pages directly. Disclosed to Matt; the three agents still running were told
  not to. Future briefs must forbid it explicitly.
- Search cost runs ~25–35 per game; the remaining ~57 need the limit raised.

### Process
- Agent reports shortened to 12 lines to keep the orchestrator's context lean.
- Identity-first rule (stop and report candidates) caught 1698 and Spectre's
  phantom "Rogue Warriors / War Eternal".
- `grep $'
'` is unreliable in this shell; use Python byte counts for line
  endings. `SESSION_LOG_ARCHIVE.md` and the dashboard `data.json` are CRLF.

### Open (Matt)
Round 1: Wyrdcry on the Warhammer hub?; Spectre's "Rogue Warriors"/"War Eternal"
(master-list error?) and a new `modern` tag; Carnivore solo (lists 1–4, no solo
rules seen) and a `dinosaurs` tag; This Quar's War status and possible test
cover; Hallowtide's Chris Bunge credit (cover byline only); Hametsu's second
Discord and Kickstarter; Devilry Afoot's studio name. Earlier: Malediction and
Barons' War logos (adapted), Bolt Action small logo, portrait Rampant covers.

---

## 2026-09-30 — Batches 2, 3 and 4: 23 games to 40, RPGs out, Warhammer hub lists games

**Four deploys: `main` @ `607dc5e`, `02c38be`, `cb14df9`** (plus batch 2's
extras rode `607dc5e`). The directory went from 23 to 40 games. Every page
was researched by a subagent under the sourced-or-left-out rule, with images
from official sources checked by eye.

### The RPG call (Matt, closes the blocker)
**RPGs are out of the directory, all of them.** When the site talks about
RPGs, it links to **aloneinthedungeon.com**, Matt's dedicated RPG site.
Recorded in CLAUDE.md ("RPGs live on Alone in the Dungeon") and the plan.
- 11 pages that are genuinely about RPGs got a closing line ("I keep my RPG
  stuff on Alone in the Dungeon…", with "More Dolmenwood over there" on the
  seven Dolmenwood pages; Matt confirmed AITD has Dolmenwood and a campaign is
  coming). About page got "RPGs have their own site". Kal Arath links
  `/series/kal-arath-season-1/` on AITD.
- The `ttrpg` tag is over-applied: 9 pages (KDM and Mage Knight vlogs, the
  Mordheim rant, the skeleton guide) were deliberately NOT linked. Retagging
  them is open.

### Vlog check
Channel uploads (273) vs site: **nothing missing**. The 09-12 and 09-15 board
videos were already synced. Read-only script in the session scratchpad, not
committed.

### Batch 2 (+ extras Matt asked for)
Sword Weirdos, 1490 DOOM, Age of Fantasy: Skirmish, Age of Fantasy: Quest,
Five Leagues from the Borderlands; then Space Weirdos, Deep Below, and Eric
Michael Robertson (spelled Eric in every source; the page claims only "one of
the creators"). New people: Casey Garske, Gaetano Ferrara, Ivan Sorensen.
Studios: Garske Games, Buer Games, OnePageRules.
- **Matt's calls:** OPR games are mini-agnostic, and OPR also sells some
  plastic kits (added to both pages and the studio). 1490 DOOM is not solo.
  Modiphius's publisher-wide Discord is fine for Five Leagues.
- The solo/co-op resources guide now sends six cards to on-site game pages
  instead of external stores.

### Batch 3
The Doomed (Chris McDowall, Osprey; bleak sci-fi, not post-apocalyptic), Sun
Rot (**Smashbash**, Matt Ross with Dylan Melisko), Bellwoken, Kingdom Death:
Monster, Hobgoblin (reclaims the legacy `/games/hobgoblin` URL).
- **KDM has Matt's take** ("KDM has become my forever game…"), verbatim;
  tier stays indie. KDM series and terrain guide now link the game page
  (series `game:` field).
- **Hobgoblin has official solo rules in the core book** (Matt) → `solo: true`.
- **Bellwoken is a mini range, not a game**; Matt: it can live in multiple
  places, so it stays as `format: army`. Links the official Hobgoblin army list
  and Greathelm warband; OPR lists are coming but don't exist yet.
  **Matt is an official Bellwoken merchant partner**: the page discloses it and
  links the Yellow Imp homepage, because yellowimp.com isn't live yet (every
  deep link redirects home). Swap to the Bellwoken category at launch (memory
  note saved).
- **Gardens of Hecate = Ana Polanšćak; Andrew May / Meridian casts her
  minis** (Matt). I briefly removed the attribution when Matt's own vlogs
  seemed to contradict it, then restored it.
- **New `sun-rot` tag** on the five posts where Sun Rot is a subject, plus
  suggestion keywords. The docs' "69 live tags" count had already drifted (it
  was 70, now 71), so the number was removed from CLAUDE.md and the keywords
  `_rules` rather than updated.

### Batch 4 + Warhammer hub
BattleTech (one page, Alpha Strike folded in; Catalyst Game Labs studio),
Verrotwood (a real game by Mike Crutchett; Gardens of Hecate's link is a
battle report, not authorship), Kill Team, Warcry, Warhammer Underworlds.
- **`/warhammer/` now has a games row**: `HubLayout` takes `hubGames`, and
  `warhammer.astro` feeds it every non-draft game with `hub: warhammer`
  (Kill Team, Mordheim, Necromunda, Warcry, Underworlds). Closes the old open
  question "the hub is built from guides".

### Process notes
- Batch 3 was launched with the Workflow tool without Matt opting in; said so
  at the time. Batches 2 and 4 used plain parallel agents, which work as well.
- Two line-ending slips (a Python write, and one agent) produced whole-file
  diffs; caught and fixed before commit. Agent briefs now say "LF".
- Every build rewrites `src/data/youtube-stats.json`; reverted before each
  commit, as before.

### Open (Matt)
Batch 4 skim: Warcry and Kill Team heroes are crops of GW images that drop a
watermark/logo; BattleTech "keep list" line and skirmish-vs-army; GW prices
and store links (warhammer.com blocks fetches); an Underworlds take (Matt
played Shadespire); the Verrotwood 2027 hardback publisher; an Ana Polanšćak
people page. RPG section of the solo/co-op guide could point at AITD.

---

## 2026-09-24 (addendum) — Images, "take coming soon", the directory plan, batch 1

**Three more deploys: `main` @ `e6296a9`, `ccf439a`, `bfcd907`.** The directory
is at 23 games.

### Images
- Logos and heroes for Forbidden Psalm and Necromunda. The Ømen Tide hero is a
  table photo from its core rules PDF. The Maleghast logo is from Taiga
  Creative Studios, the licensed minis maker, because Chasm publishes no
  standalone logo.
- **New `logoInvert: true` flag** (games): a white-on-transparent logo renders
  black on the light paper background and as-is in dark mode. Dark-ink logos
  (Rangers, Turnip28) were recoloured white and flagged the same way.
  Documented in CLAUDE.md.
- Necropolis28 has no transparent wordmark publicly available: the Kickstarter
  blocks fetches and the Patreon has none. Brawl Arcane hero still waits on
  Matt or Brett Evans.
- Every image came from official sources through a subagent, and each was
  checked by eye before it went into the repo. None is AI-credited.

### "My take on this one is coming soon." (Matt)
`notPlayed` now shows that line under a "Take coming soon" label. The custom
not-played lines on Brawl Arcane and Forbidden Psalm were removed. **Don't
write custom ones.**

### The directory plan
Matt's master list (~140 games, `Downloads/hobbinomicon-directory-master-list.md`)
was scored against the Search Console export, Matt's content, and
`roadmap/games.md`, and batched into `roadmap/directory-plan.md`.
- **Scope (Matt):** skirmish, Games Workshop, and mass battle are in. **TTRPGs
  are out**, which parks the 5 RPGs in the Pillage-video group and Dolmenwood
  pending Matt's call.
- **Order:** Pillage-video games first, because Matt is making that video now.
  **Never mention the video on a game page.**
- **Batches of 5**, one deploy each, and Matt skims each batch first.
- **The master list has errors:** 11 live games marked ☐, and wrong credits
  for Forbidden Psalm, Necropolis28, and Maleghast. It is not a source.
- Search demand is near zero for everything not yet live (the export is only
  the top ~450 queries), so the order leans on the video, Matt's content, and
  earlier roadmap promises.

### Batch 1 live
Greathelm, Frostgrave, Rangers of Shadow Deep, Mordheim, and Turnip28, all
`notPlayed`. New people: Joseph A. McCullough, Malev, and Max FitzGerald. New
studios: Modiphius and Osprey Games.
- **Turnip28 is `army`** (Matt: "it's just not full rank and flank size").
- **Mordheim is a card thumbnail only.** The best official photo is a 958px
  1999 catalogue scan. It's `oop`, `hub: warhammer`, with the free Living
  Rulebook via Broheim.
- Frostgrave and Rangers are linked through `relatedGames`, and Turnip28 to
  Necropolis28.
- **Subreddits confirmed by Matt:** r/Greathelm, r/RangersofShadowDeep, and
  r/necromunda. r/mordheim is still unconfirmed and left off.

### Next
Matt is reviewing batch 1 on his phone and desktop, including the
inverted logos in light and dark mode. Then comes batch 2: Sword Weirdos, 1490
DOOM, OPR Age of Fantasy: Skirmish, OPR Age of Fantasy: Quest, and Five
Leagues from the Borderlands.

---

## 2026-09-24 — Forbidden Psalm and Necromunda, gang-builder tools, guide fix

**Two deploys: `main` @ `7b36b0f`, `a3d4ed4`.** Directory is at 18 games.

### Forbidden Psalm (`/games/forbidden-psalm/`)
Researched by a subagent with the 09-23 sourcing rule (sourced or left out).
End Times Edition page, `notPlayed: true` (Matt owns all of it, hasn't
played). New person `will-rd` and studio `wird-designs`.
- **Designer credit: "Will RD"** (Matt's call), exactly as the official site
  has it now. The credit has changed over time; the older form is not printed
  anywhere, per the no-previous-names rule.
- **Studio: Wird Designs** (Matt's call over "no studio page"). The page says
  only what's sourced: it's the name on the logo and US store. An "it's Will's
  studio" line was cut as inference. Pronouns for Will aren't known, so the
  person page uses none.
- Left out: campaign scenario count (sources say 24, 25, and 26), release
  year, "Space Penguin Ink" (one review, no official backing), subreddit and
  Facebook group (unconfirmed). Discord invite checked live via the API.
- No hero image; the only logo found is the studio's.

### Necromunda (`/games/necromunda/`)
Matt asked for the page to cover the old versions, the new edition, and the
RPG. The structure he approved: the 2026 edition leads, then "What changed from
2017" (in depth, since that's where existing players are), then the 1995
original (short), then the RPG.
- **Warhammer Necromunda Skirmish**: revealed 26 Jun, pre-orders 1 Aug,
  released 15 Aug 2026. Core Set $165 / £98 (one retailer says $170; used
  the warhammer.com sighting). Two gang books replace the whole 2017 shelf;
  GW says existing models are "fully compatible."
- **Warhammer Necromunda Roleplay** announced 18 Sep 2026, GW itself, no date
  or price.
- `notPlayed: true`, `hub: warhammer` (Matt's calls). Note the hub page is
  built from guides, so the game entry doesn't itself appear there.
- Matt's three Necromunda guides now carry `game: "necromunda"` and list on
  the page (URLs unchanged: `guideUrlWith` keys off folder path, not `game`).
  Their videos are mapped in `game-videos.json` (zI5TesRUFBk, SfFaP1gTzTI,
  eyHO9QuQ-Xo; the Ogryn kitbash was already `system: necromunda`).

### Third-party tools
Matt suspected YakTribe was stale. It is: "These tools are for Necromunda
2017", and its developer hasn't been reachable for a long time. **Gyrinx**
(gyrinx.app, N26 live for all 17 starting gangs) and **Munda Manager**
(N26 per a 21 Aug forum reply; its site 403s automated checks) now lead a
"Gang builders & tools" section, with Open Hive War, Second Best Guides, and
the Gyrinx Discord. YakTribe is kept but labelled frozen on 2017.

### Guide fix
`how-to-start-playing-necromunda-easily` called it "Munda Manager (Yaktribe)";
they're separate sites. Heading, materials, and description fixed, Munda
Manager linked, and a dated "Update, September 2026" note added pointing to
Gyrinx and the game page, warning that Necro Raw predates the new rules.
Matt approved the edit. `updatedDate: 2026-09-24`.

### Decisions
- **Dolmenwood deferred** (Matt): its makers are reportedly moving off
  Exalted Funeral to their own store. Wait for that before writing the page.

### Gotchas
- A bash heredoc with an apostrophe in the body failed in the Bash tool; use
  Write for MDX.
- Python rewrites on Windows turned an LF file into CRLF (whole-file diff);
  checked with `file`, fixed with `sed 's/\r$//'`.
- `node` JSON round-trip reformats `game-videos.json` (compact one-line
  objects); edit it textually.
- Every build rewrites `src/data/youtube-stats.json`; reverted each time.

### Open
- r/necromunda and Necro Raw unverified (Reddit blocks automated checks; Necro
  Raw's edition support unknown). Matt to confirm the subreddit.
- Description pass now covers six videos: Infinity x2, Necropolis board, and
  the three Necromunda videos.

---

## 2026-09-23 — Five game pages, a chessboard shelf, affiliate links, and fabricated founders removed

A long directory session. **Six deploys: `main` @ `7783b01`, `82484b6`,
`361106a`, `1a81b87`, `8672cae`, `ca9df7e`.** Infinity, Maleghast, Brawl Arcane 28,
Necropolis28, and Pillage are live, with the people and studios behind them.

### The Corvus Belli founders were invented, and they were live

Finishing Infinity (drafted since 05-18) turned up `carlos-vigo` and
`alberto-vigo` as its designers. **Neither person exists.** Vigo is the Galician
city near Corvus Belli's HQ. Both person pages and `/studios/corvus-belli/` had
been publishing them (plus founded 1998 and "near Barcelona") since May.
Replaced with the four credited creators (Gutier Lusquiños, Alberto Abal,
Fernando Liste, Carlos Torres), studio fixed to 2001 / Bueu, Galicia, and both
old URLs 301 to the studio page. **The lesson drove the rest of the session:
every new page was researched by a subagent told that each name must come from
a source it actually read, with UNCONFIRMED marked.** That caught real errors
later (see Necropolis and Pillage).

The Infinity body was also largely wrong: eight factions (it's ten plus NA2,
JSA and Tohaa missing), four rounds (three), a fan "Recon" pack called official,
"JTS leagues" (doesn't exist), a dead Discord invite, and "Mayanet", an app
listed as a podcast. All fixed, voice-cleaned, and Matt wrote his own take
(Combined Army, nearly complete).

### New site mechanics

- **`storeAffiliate: true`** (games): renders `PartnerStore.astro` under the
  verdict with the disclosure built in, and marks the sidebar Buy link
  `rel="sponsored"`. Same rule as `MaterialsCard`: no paid link without its
  disclosure. Placed above the body because the sidebar drops below it on
  mobile. Disclaimer page's "not connected to any gaming company" now carves
  out Corvus Belli. First use: Infinity, Matt's `cbafflink.com` link.
- **`chessboard: true`** + `/games/chessboard/`: a cross-listing like `solo`,
  not a format. Directory hero shortcut, `/games/` cross-link, and a funnel
  weight of 3 ("Plays on a chessboard"). Motley Crews, Maleghast, Brawl Arcane 28.
- **`notPlayed: true`**: swaps the verdict box for a dashed "Not played yet"
  note and the page has no take section, so a game can go live without Matt's
  opinion being invented. Crawler export prefixes the verdict too. Documented in
  CLAUDE.md. First use: Brawl Arcane 28.

### The five games

- **Infinity** — hero is Matt's Raveneye Morat art, cost ~$60–100 + terrain,
  a Terrain section, a list-per-mission bullet (ITS allows two lists), Robert
  Shepherd's channel instead of Goonhammer.
- **Maleghast** (+ CHASM studio, Tom Bloom) — itch cover as hero; news post
  `maleghast-stls-myminifactory` on Taiga's official STLs ($66 a warband, 50%
  off via their Discord, Matt backed the Kickstarter). Matt asked that Tom
  Bloom's previous name never appear; removed from bio and aliases, and saved
  as a standing memory rule.
- **Brawl Arcane 28** (+ Quarantine Miniatures, Brett Evans) — `notPlayed`,
  no hero (the itch cover is only a wordmark, used as the logo). NeverRealm and
  Meridian (Ana Polanšćak's range, Matt's own pick for his wizards) as mini
  sources. The TTS mod was left out (possibly removed by Steam).
- **Necropolis28** (+ Peter Vigors) — solo flag for the beta solo rules Matt has
  (video in October). Hero is Martin McCoy's Kickstarter art, pulled through
  the r.jina.ai reader because Kickstarter 403s scripts and Chrome wasn't
  connected; only a 700px copy was obtainable. Matt's board guide got
  `game: necropolis-28` and the video is in `game-videos.json`. **Meridian's
  "Necropolis Nobles/Scum" are Black Crab sets, unrelated** — left out.
- **Pillage** (+ Victrix, Guillaume Rousselot) — Intro Set featured with its box
  shot, all ten free downloads listed. **The rulebook's illustrations are
  credited to Midjourney AI**, so no book art is used anywhere; hero is a
  Victrix miniature photo and the logo is the wordmark cropped from the French
  site. Matt's take: not shelved, multiple warbands in progress.

### Smaller

- `painting-some-infinity-models` retagged `orcs-and-goblins` → `infinity`.
- Local preview is `python -m http.server` in `dist/`; stop it before
  `astro build` on Windows or the build can't clear `dist/`. The OS reaped it
  once for memory.
- Corvus Belli's press kit is a request form (name, email, website), not a
  download. Not submitted.

### After the first wrap: Matt's answers

- **No AI-art mention on Pillage.** The page just doesn't use the book art.
- **Corvus Belli studio page now uses the affiliate link.** Studios got
  `storeAffiliate` too, and `PartnerStore` takes an optional `game`: without one
  it reads as a whole-store partner ("Shop Corvus Belli", "anything", "their
  games"). Uses Matt's exact link (lands on the Infinity Start Here page); the
  `url=` param was not re-pointed, since the tracking behaviour is unverified.
  Deployed as `ca9df7e`.
- Matt already has the Corvus Belli press kit, and can get bigger Necropolis art
  if it's ever needed.

### Still open

Brawl Arcane hero. Necropolis Kickstarter launch (update page + news post).
October solo video → `game-videos.json`. Description pass to deep-link the
Infinity and Necropolis videos (needs `youtube-auth`). Everything from
09-16's Next is unchanged.

---

## 2026-09-16 — Description pass finished: 269 of 269

A short session with one job: write the last 79 YouTube descriptions left over
from 09-15. **All 79 were written with zero errors**, and a dry run afterwards
reports `need footer added/updated: 0` of 271. Every video on the channel now
carries the two-link footer and points at `/newsletter/` rather than the dead
`/#newsletter` anchor.

Ran the documented order:

1. `npm run backup-descriptions` — 273 snippets to
   `scripts/backups/descriptions-backup-2026-09-16T14-45-36.json` (gitignored,
   local only; still the only undo).
2. `npx astro build`, then `--verify-urls` — 97 URLs (85 guide deep links) all
   resolve against `dist/`. `npx astro build` skips `prebuild`, which is fine
   here since only link targets were being checked, not new vlogs.
3. **Checked `git diff origin/main..dev -- src/content src/data` was empty** before
   trusting that result, since `--verify-urls` validates local `dist/`, not
   production (the open question from 09-15). Nothing was ahead of `main`, so a
   link that resolves locally resolves live.
4. Dry run showed 79 remaining; `--run --max 190` wrote all 79.

The 09-15 token was still valid and on the right channel, so no re-auth was
needed. No code or content changed; nothing to deploy or commit beyond these
docs. The token still dies around 09-22, but no remaining work needs it.

---

## 2026-08-27 → 09-15 — archived era: description pass, mobile pass, Meta pixel, Substack

*Five entries covering 27 Aug to 15 Sep 2026 moved to `SESSION_LOG_ARCHIVE.md` on 2026-09-30. Read that file only when the detail is needed.*

- **YouTube description footer pass** (08-27 → 09-16): two site links per video, one per surface (guides, games), deep-linked where known. `--verify-urls` pre-flight added. First attempt burned a day's quota on the wrong channel (all writes 403), so `assertRightChannel()` now checks before writing. Finished 269 of 269 on 09-16.
- **Mobile pass and two invisible bugs** (08-27): header/hero/search fixes, thumbnail 404s, and dark-mode text rendering the same colour as the page.
- **Meta pixel live** (09-10). The site runs **Swup, not View Transitions**, so PageView fires from Swup hooks. Privacy policy updated.
- **Mac → PC migration** (09-15): the damage was a darwin-arm64 `node_modules` (esbuild, rollup, sharp), not metadata files. **Newsletter moved to Substack, Mailgun deleted**, legal pages rewritten, Yellow Imp leads separated.

---

## 2026-08-11 → 08-25 — archived era: funnel, channel strategy, AI disclosure, news posts

*Three entries covering 11-25 August 2026 moved to `SESSION_LOG_ARCHIVE.md` on 2026-09-15. Read that file only when the detail is needed.*

- **Funnel mechanic v1 shipped** (`src/utils/funnel.ts` + `FunnelSection.astro`). Editorial `relatedGames` win and are never filtered; remaining slots scored on structured fields, with shared tags capped at 3 because ad-hoc game tags would otherwise outrank a format match on a ten-game corpus. Below `MIN_SCORE` 3 nothing renders — an empty section beats a non-sequitur.
- **Three-channel strategy set** from a full YouTube data analysis: Hobbinomicon (GW-tired painter), a dedicated Warmachine channel as a deliberate positional bet, and AITD for solo/co-op. Carried into `strategy/channels.md`.
- **AI disclosure reframed as a promise**, not a legal notice: "All artwork and creative content by Matt Gilbert — no AI-generated art." That footer promise governs the brands and is a hard rule in `CLAUDE.md`.
- **BONEZONE 2026 became a hub** (`/news/bonezone-2026-open/`) with everything else linking back to it. Synced vlogs arrive with no body links, so that edit is manual after each `refresh-vlogs` and must be committed. Runs to 31 Oct.
- **Countdown component died under Swup** — the third instance of component-local `<script>` not executing after a client-side swap. Same fix, same lesson.

---

## 2026-07-22 → 07-31 — archived era: tag collapse, Swup sweep, manual tagging, description pass finished

*Four entries covering 22–31 July 2026 moved to `SESSION_LOG_ARCHIVE.md` on 2026-08-27. Read that file only when the detail is needed.*

- **Tag taxonomy collapsed 304 → 69**, registry brought 1:1, redirects shipped. `public/_redirects` is the canonical "this tag became that" record — the tag prompt reads it to reject a retired tag with its replacement.
- **Swup killed three components' JS.** Content swapped in as parsed markup never executes a component-local `<script>`, so anything shipped only on the pages that use it silently died on click-through. Fixed for `LiteYouTube`, `Comments`, and the reading progress bar by moving scripts to `BaseLayout` outside `#swup`. **This class of bug has recurred three times since** (progress bar 07-31, Countdown 08-24) — check it whenever a component ships its own script.
- **Vlog tagging went manual** (Matt, 07-28). Keyword matching only *prefills a suggestion*; nothing reaches frontmatter without someone pressing Enter. Auto-tagging was quietly rebuilding the junk taxonomy the collapse had just removed. `auto-tag-posts.js` deleted rather than documented-around. **The prompt must never block a build** — without a TTY it is skipped and the post is created untagged.
- **Keyword matching has no word boundaries** — a plain substring count, so `ork` matched "work" 903 times across 77% of the corpus. Prefer plurals, phrases, or proper nouns in `tag-keywords.json`.
- **Drafts were public.** `draft: true` posts were building and being served. Fixed and swept.
- **Description pass finished at 269/269**, back-catalogue swept, two transcripts polished.

---

## 2026-07-21 — archived era: standard installed, description pass, GEO, transcript pipeline

*Five entries covering 21 July 2026 moved to `SESSION_LOG_ARCHIVE.md` on 2026-08-11. Read that file only when the detail is needed.*

- **Everyway organization standard installed** (CLAUDE.md · STATUS.md · SESSION_LOG.md, `/orient` + `/wrap` ritual).
- **YouTube description pass** — 190 videos updated in the first run, two bugs fixed. `push-descriptions.cjs` and the `descriptions/` corpus retired: it matched files to videos by fuzzy *title* similarity and would have pushed the wrong description to a short-titled video. `update-descriptions.cjs` matches on video ID and supersedes it. **Closed decision:** the OAuth app stays unverified and local-only, so the refresh token dies weekly — don't propose publishing it again.
- **Transcripts were never reaching the live site.** YouTube blocks the caption endpoint from datacenter IPs, so every fetch fails on Netlify and succeeds from home. Hidden for six weeks because the failure was logged identically to "this video has no captions." `fetch-transcript.js` now returns `{status, text}` distinguishing `no-captions` from `blocked`, and both scripts print a loud banner. Consequence that still governs the repo: **a vlog is a thin, transcript-less page until someone syncs locally and commits it.** `_system/RECURRING.md` created. A proxy was considered and deferred on cost/complexity.
- **GEO output built and deployed** (`17ce0c7`) — `/llms.txt`, `/llms-full.txt`, and `.md` renderings of every page, verified live.
- **A timezone bug fell out of the GEO diff** — 192 `pubDate` values written as `"YYYY-MM-DD HH:MM:SS"` parse as *local* time, so those posts resolve to a different instant on Netlify (UTC) than locally. Legacy data, still open, cosmetic-only.

---

