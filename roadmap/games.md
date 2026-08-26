# Games roadmap

Working doc — not deployed. Fill in the per-game checklists below; once a game's checklist is reasonably complete, I'll convert it to an MDX entry under `src/content/games/`.

## How this works

1. **Decide on the checklist template** (below). Tweak it once until it has everything you need and nothing you don't.
2. **For each game,** copy the template under that game's heading and fill in what you can. Leave blanks where you don't know — we'll figure out what's blocking later.
3. **Stub-first, deepen later.** A game can ship as soon as the "must have" fields are filled. The "nice to have" stuff can be added in a later commit.
4. **When a game is ready,** tell me and I'll generate the MDX file plus any missing studio/people stubs.

---

## URL structure (decided 2026-05-07, shipped 2026-05-11; formats merged 2026-08-26)

Format-based directory pages, each game lives under exactly one format. Solo is cross-cutting.

```
/games/              → directory hub (intro + a few featured per format)
/games/skirmish/     → all skirmish miniature games
/games/army/         → army-scale games
/games/narrative/    → narrative / campaign games
/games/ttrpgs/       → all TTRPGs
/games/boardgame/    → board games
/games/solo/         → cross-list: every game flagged solo:true
/games/graveyard/    → status:'oop' games (cross-format)
/games/[slug]/       → individual game pages
/games/mage-knight/[guide]/ → resource pages nested under their game
```

Schema (`src/content.config.ts`):

- `format: 'skirmish' | 'army' | 'narrative' | 'ttrpg' | 'boardgame'` (required)
- `solo: boolean` (default false)
- `miniatureAgnostic: boolean` (default false)
- `hub: 'warmachine' | 'warhammer'` (optional) — on-ramp membership

**Taxonomy drift: resolved 2026-08-26.** `large-scale-army` and `mass-battle`
were both valid and only the first was ever used, so the directory advertised
three army-scale shelves and filled one. Merged into `army`; Warmachine moved
across and `/games/large-scale-army/` and `/games/mass-battle/` 301 to
`/games/army/`.

---

## Directory to-do — games with content but no page

*Built 2026-08-26 from the Phase 1 migration. Every row below already has posts,
search impressions, or both, pointing at a game the directory does not list.*

`01-review-and-strategy.md` §2a is blunt about why this matters: `/games/*` is
**60% of all clicks** across 25 pages, and "every new game entry is worth more
than ten videos." For calibration, here is what existing entries earn:

| Page | Clicks | Impressions |
|---|---|---|
| `/games/motley-crews/` | 431 | 2,677 |
| `/games/wanted-reward-cc10000/` | 131 | 852 |
| `/games/kal-arath/` | 57 | 2,482 |
| `/games/monster-friends-…/` | 51 | 564 |
| `/games/omen-tide/` | 39 | 1,233 |

Ranked by what it costs against what it returns. **Posts** counts entries in
`url-map-posts.csv` pointing at that game; **clicks/impr** is the 16-month GSC
export for the game's queries.

### 0. Finish Infinity — the entry already exists, drafted

`src/content/games/infinity.mdx` is written and `draft: true`. Ten posts point
at it (7 vlogs, 3 guides) plus the restored Maximus painting references, and
all of them lose their `game` link while it stays drafted. Clearing the flag is
the cheapest item on this list. Search demand is nil (1 impression), so this is
about internal linking, not rankings.

- [ ] Corvus Belli studio entry — already on the "Studios to stub first" list,
      and the entry cannot ship its reference card without it
- [ ] Read it, fill any gaps, clear `draft: true`

### 1. Dolmenwood — the best return on the list

**11 posts (6 guides) · 2 clicks · 249 impressions · position 8.6**

Already on page one for *dolmenwood character creation* (70 impressions, pos
8.6), *character creator* (53, pos 9.5) and *character generator* (33) — and
earning almost nothing from it, because there is no page for those searches to
land on. `guides/how-to-create-a-dolmenwood-character.mdx` exists and is the
natural companion. This is the one to do first.

- [ ] Game entry (`ttrpg`, `tier: indie`) — pre-fill notes already in
      **Wave 1 › TTRPGs › Dolmenwood** below, including the solo question
- [ ] Necrotic Gnome studio entry — already on the "Studios to stub first" list
- [ ] Point the 6 Dolmenwood guides at it with `game: dolmenwood`

### 2. Necromunda — same shape, smaller

**3 posts (2 guides) · 3 clicks · 172 impressions · position 8.3**

Page one for *necro raw necromunda* (49 impressions) and *necromunda raw* (32),
and *how to play necromunda* at 22. `tier: big`, so it is an on-ramp entry, and
`hub: warhammer` with `system: necromunda` is already set on the guides.

- [ ] Game entry (`skirmish`, `tier: big`, `hub: warhammer`)
- [ ] Point `how-to-start-playing-necromunda-easily` and
      `necromunda-kitbashing-and-giveaway-winners` at it

### 3. Kingdom Death: Monster — unblocks the series hub

**24 posts (19 of them the series) · 0 clicks · 34 impressions**

The sharp one structurally rather than commercially. `/series/kingdom-death-monster/`
ships in Phase 2 with sixteen episodes and no game page to hang them on;
`src/content/series/kingdom-death-monster.mdx` has its `game` reference left
unset for exactly this reason. Search demand is weak and the queries are
long-tail (*kdm weapon proficiency*, *screaming antelope kdm*), so do this for
the internal linking, not the rankings.

- [ ] Game entry (`boardgame`, `solo: true`, `tier: big`, `status: active`)
- [ ] Set `game:` on `series/kingdom-death-monster.mdx`
- [ ] Set `game:` on the 19 episodes + 5 loose vlogs

### 4. Bellwoken — ranked at position 7 with nothing behind it

**0 posts · 0 clicks · 17 impressions · position 7.2 on the bare brand name**

Exactly the pattern `01-…md` calls out: brand-name intent for indie games that
nobody else is serving. There is one news post and one vlog, no entry, and it is
already page one. `04-hubs-content-plan.md` lists it in the 2026 pipeline and
says to create it *before* the videos go up.

- [ ] Game entry + studio entry

### 5. Greathelm and 6. Pillage — create before the first video

**0 posts · no search data yet**

Both named in `04-hubs-content-plan.md` as 2026 projects whose directory entry
should exist before the painting run starts, so the page is ranking by the time
the videos land. An afternoon each.

- [ ] Greathelm: game entry + studio entry
- [ ] Pillage: game entry + studio entry

### 7. Warhammer: The Old World — Oldhammer 2027 depends on it

**17 posts share the `warhammer-aos-40k` bucket · no search data**

`04-hubs-content-plan.md` calls the game entry optional here, and the numbers
agree: zero impressions on *old world*, *oldhammer* or *tomb kings*. But
`articles/oldhammer-year-2027.mdx` is drafted and waiting, the Tomb Kings army
is the 2027 project, and the Warhammer hub needs somewhere to point. Do it when
the Oldhammer article ships, not before.

- [ ] Game entry (`army`, `tier: big`, `hub: warhammer`)
- [ ] Set `system: the-old-world` on the relevant guides (see the 7 unset flags
      in `roadmap/rebuild/PROGRESS.md`)

### 8. Warhammer 40,000 — hub-only for now

**shares the same 17-post bucket · no search data**

The Khorne Daemon army is queued. `04-hubs` says 40k needs no directory entry —
`tier: big`, hub-only. Listed here so the decision is recorded rather than
forgotten.

- [ ] Decide: entry, or hub section only
- [ ] Either way, set `system: 40k` on the relevant guides

### 9. Chainmail and Warriors of Athena — archive, only if you want them

**0 posts each · 7 and 0 impressions**

Both came up in Phase 0. Each has a restored checklist page and nothing else.
`url-map-legacy-404s.csv` offers a `/games/chainmail/` entry as one option; the
alternative is leaving both as list articles, which is where they sit now. No
search case either way — this is a completeness call, not a traffic one.

- [ ] Chainmail: entry, or leave as `/articles/chainmail-miniatures-checklist/`
- [ ] Warriors of Athena: entry, or leave nested under Mage Knight

### Also open, from STATUS

- [ ] **DWARF / Tavern Lore** — deferred by Matt 07-22. `solo-rpg` is the
      third-biggest tag, so there is an argument, but no data gathered yet.
- [ ] **Age of Sigmar: Spearhead** — entry exists as a `draft: true` stub. It
      goes live with the Warhammer hub, on the City of Ash trigger. Not a gap,
      a scheduled item.

---

## Per-game checklist template

```
## [Game name]

### Must have (page can't ship without these)
- [ ] Title:
- [ ] One-line description (~140 chars):
- [ ] Format: skirmish / army / narrative / ttrpg / boardgame
- [ ] Solo-friendly: yes / no
- [ ] Miniature-agnostic: yes / no
- [ ] Tier: indie / big
- [ ] Status: active / oop / kickstarter / announced
- [ ] Hero image: (path or "TBD — need source")
- [ ] Hero image alt:
- [ ] Tags: (comma list — see tag set below)

### Hobbinomicon take (the personal-voice top of page)
- [ ] Verdict (1 sentence — appears as a pull-quote at top):
- [ ] What it is (1 short paragraph — what the game IS, mechanically + vibe):
- [ ] Why play it (1 short paragraph — what it gives you that other games don't):
- [ ] How to start (1 short paragraph — first thing to buy / read / do):

### Provenance
- [ ] Studio: (slug — create studio stub if missing)
- [ ] Designers: (slugs — create people stubs if missing)
- [ ] Current edition: (e.g. "MK IV", "N5", "1st edition")
- [ ] Release year (original):

### Reference card (the structured links section)
- [ ] Official site:
- [ ] Where to buy:
- [ ] Rules (PDF or wiki):
- [ ] Discord:
- [ ] Subreddit:
- [ ] Kickstarter (if active or recent):

### Community
- [ ] Podcasts (name | url, one per line):
- [ ] Content creators (name | url, one per line):

### Funnel
- [ ] Related games (slugs — "if you like this, try Y"):

### Personal context (informs the take, doesn't appear on page)
- [ ] What you own / play / paint:
- [ ] How long you've been into it:
- [ ] Why it earned its slot on the site:
```

### The tag set (use these — add new ones only if nothing fits)

Tags now do less work because `format` and `solo` cover the big buckets. Use tags for *flavor*:

**Tone/genre:** `narrative`, `competitive`, `OSR`, `OSR-adjacent`, `pbta`, `horror`, `fantasy`, `sci-fi`, `historical`, `IP-tie-in`, `religious-horror`, `fairy-tale`, `gothic`, `noir`

**Logistics:** `low-model-count`, `cheap-to-start`, `print-and-play`, `3d-printable`, `pre-painted`, `gm-required`, `gm-less`

Lean toward fewer tags per game (3–6). The tags drive the "if you like X, try Y" funnel — overtagging breaks it.

---

## Studios to stub first

Reference fields can't link to studios that don't exist. These need 1-paragraph stub entries before games that link to them can ship:

- [x] Steamforged Games — shipped 2026-05-08 (with Warmachine)
- [ ] Corvus Belli — for Infinity
- [ ] Free League — for The One Ring (Strider Mode)
- [ ] Necrotic Gnome — for Dolmenwood
- [ ] Lampblack & Brimstone — for Stonetop
- [ ] Metal King Studio — for Relic Blade
- [ ] Games Workshop — for Middle Earth Strategy Battle Game
- [x] Orc the Brand — shipped 2026-05-07
- [x] Nubmark — shipped 2026-05-09 (with Motley Crews)
- [x] Castle Grief — shipped 2026-05-13 (with Kal Arath)
- [ ] Electi Studio — for Bloody Hollow
- [ ] (TBD per game as we figure out publishers)

---

# Wave 1 — deep coverage, mostly out of your head

(games you've vlogged about, played, and have opinions on — pre-categorized; correct me if I'm wrong)

## TTRPGs

### Dolmenwood
- **Pre-fill:** Necrotic Gnome; current featured project (the Pokédex Project); OSR-adjacent fantasy.
- **Solo?** GM-led campaign game. Probably no.

### Kal Arath
- **Shipped 2026-05-13** — page at `/games/kal-arath/`. Studio: Castle Grief. Format: ttrpg, solo: true. (Reclassified from skirmish — it's actually a solo-friendly OSR TTRPG.)

## Skirmish

### Trench Crusade
- **Pre-fill:** indie, you have a fully 3D-printed set, excited to paint it.
- **Solo?** TBD — does it have official solo rules?

### Forbidden Psalm
- **Pre-fill:** small-press indie, narrative, low model count, Mörk Borg-adjacent.
- **Solo?** Yes — known for solo play.

### Relic Blade
- **Pre-fill:** Metal King Studio; you own a ton, planning to paint it this year, "huge fan."
- **Solo?** TBD.

## Army-scale

### Warmachine
- **Shipped 2026-05-08** — page at `/games/warmachine/`. Format: `army` (was `large-scale-army`; merged 2026-08-26). `hub: warmachine`.
- **Pre-fill (kept for reference):** Steamforged Games (formerly Privateer Press); Crucible Guard, Menoth, Fifth Division, Armored Core, Retribution, Dusk, Phantom of Nero, Cryx (partial), Convergence (most), Royal Guard, Dark Operations, Storm of the North, Grymkin (partial), Rolling Guard.

### Infinity
- **Pre-fill:** Corvus Belli; you own the full Combined Army faction.
- **Tier:** big (confirmed 2026-05-07)
- **Solo?** No.

### Middle Earth Strategy Battle Game (MESBG)
- **Pre-fill:** GW; lots of Middle Earth armies; "childhood dream" angle.
- **Tier:** TBD — `big` (it's GW) or `indie` (Specialist Games slot)?
- **Solo?** No.

---

# Wave 2 — known indies, lighter coverage

## TTRPGs

### Stonetop
- **Pre-fill:** PbtA RPG by Lampblack & Brimstone (Jeremy Strandberg).
- **Solo?** No — group GM'd PbtA.

### The One Ring — Strider Mode
- **Pre-fill:** Free League; solo TTRPG variant of The One Ring 2e.
- **Solo?** Yes (that's the whole point).
- **Open question:** one page covering The One Ring + Strider Mode, or two pages?

## Skirmish

### Motley Crews
- **Shipped 2026-05-09** — page at `/games/motley-crews/`. Studio: Nubmark. Format: skirmish, miniature-agnostic.

### Necropolis
- **Pre-fill:** which Necropolis? Multiple games share the name.

## Format TBD

### Bloody Hollow
- **Pre-fill:** published by **Electi Studio**, written by **Alex C. Van Allen**.
- **Format:** TBD — TTRPG / skirmish / something else?
- **What I need from you:** format, status, the official URL, your take.
- **References to stub:** Electi Studio, Alex C. Van Allen.

---

# Wave 3 — need one sentence from you per game

Format I need from you: "It's an [X — TTRPG / skirmish / mass-battle / boardgame] by [Y]. Solo: yes/no. Official: URL. My take: one line."

- [x] **Monster Friends: Battle for New Florida** — shipped 2026-05-07. Page at `/games/monster-friends-battle-for-new-florida/`.
- [x] **Wanted! Reward: CC 10000** — shipped 2026-05-12. Page at `/games/wanted-reward-cc10000/`.
- [ ] **Flames of Orion** —
- [ ] **Gloam** —
- [ ] **Hag 28** —
- [x] **Ømen Tide** — shipped 2026-05-11. Page at `/games/omen-tide/`.
- [ ] **Pillage** —
- [ ] **Midguard** —
- [ ] **Hobgoblin** —
- [ ] **Rumpus** —
- [ ] **Cyber Savages** —
- [ ] **Alien Zoo Keeper** —
- [ ] **Scrungaloids** —

---

## Implementation order

1. **Schema change** — ✅ shipped. `format`, `solo`, `miniatureAgnostic` all live in `src/content.config.ts`. Mage Knight retagged.
2. **Format index pages** — ✅ shipped. `ttrpgs.astro`, `skirmish.astro`, `large-scale-army.astro`, `mass-battle.astro`, `solo.astro`, `graveyard.astro`, hub at `index.astro`. The two army pages merge into `army.astro` in rebuild Phase 2.
3. **Studio stubs** — in progress. Shipped: Orc the Brand, Nubmark, Steamforged Games, Castle Grief. Still needed: Corvus Belli, Free League, Necrotic Gnome, Lampblack & Brimstone, Metal King Studio, Games Workshop, Electi Studio.
4. **Game stubs** — in progress. End-to-end flow validated via Warmachine (army), Monster Friends / Motley Crews / Wanted / Ømen Tide (skirmish), Kal Arath (ttrpg).
5. **Deepen** — pending full wave-1 coverage.

---

## Open questions (still)

1. **MESBG tier** — `big` (it's GW) or `indie` (Specialist-game vibes)?
2. **The One Ring + Strider Mode** — one page or two?
