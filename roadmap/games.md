# Games roadmap

Working doc — not deployed. Fill in the per-game checklists below; once a game's checklist is reasonably complete, I'll convert it to an MDX entry under `src/content/games/`.

## How this works

1. **Decide on the checklist template** (below). Tweak it once until it has everything you need and nothing you don't.
2. **For each game,** copy the template under that game's heading and fill in what you can. Leave blanks where you don't know — we'll figure out what's blocking later.
3. **Stub-first, deepen later.** A game can ship as soon as the "must have" fields are filled. The "nice to have" stuff can be added in a later commit.
4. **When a game is ready,** tell me and I'll generate the MDX file plus any missing studio/people stubs.

---

## URL structure (decided 2026-05-07)

Format-based directory pages, each game lives under exactly one format. Solo is cross-cutting.

```
/games/             → directory hub (intro + a few featured per format)
/games/ttrpgs/      → all TTRPGs
/games/skirmish/    → all skirmish miniature games
/games/mass-battle/ → all rank-and-file / army-scale games
/games/solo/        → cross-list: every game flagged solo:true (TTRPGs + minis)
/games/graveyard/   → status:'oop' games (cross-format)
/games/[slug]/      → individual game pages (already exists)
```

Schema changes needed to support this (do once before shipping any new game):

- Add `format: 'ttrpg' | 'skirmish' | 'mass-battle' | 'boardgame'` (required)
- Add `solo: boolean` (default false)
- Mage Knight gets retroactively tagged with `format: 'skirmish'`.

---

## Per-game checklist template

```
## [Game name]

### Must have (page can't ship without these)
- [ ] Title:
- [ ] One-line description (~140 chars):
- [ ] Format: ttrpg / skirmish / mass-battle / boardgame
- [ ] Solo-friendly: yes / no
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

- [ ] Steamforged Games — for Warmachine
- [ ] Corvus Belli — for Infinity
- [ ] Free League — for The One Ring (Strider Mode)
- [ ] Necrotic Gnome — for Dolmenwood
- [ ] Lampblack & Brimstone — for Stonetop
- [ ] Metal King Studio — for Relic Blade
- [ ] Games Workshop — for Middle Earth Strategy Battle Game
- [x] Orc the Brand — shipped 2026-05-07
- [ ] Electi Studio — for Bloody Hollow
- [ ] (TBD per game as we figure out publishers)

---

# Wave 1 — deep coverage, mostly out of your head

(games you've vlogged about, played, and have opinions on — pre-categorized; correct me if I'm wrong)

## TTRPGs

### Dolmenwood
- **Pre-fill:** Necrotic Gnome; current featured project (the Pokédex Project); OSR-adjacent fantasy.
- **Solo?** GM-led campaign game. Probably no.

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

### Kal Arath
- **Pre-fill:** indie; you have multi-episode live-play vlog content.
- **Solo?** TBD.

## Mass-battle

### Warmachine
- **Pre-fill:** Steamforged Games (formerly Privateer Press); you own Crucible Guard, Menoth, Fifth Division, Armored Core, Retribution, Dusk, Phantom of Nero, Cryx (partial), Convergence (most), Royal Guard, Dark Operations, Storm of the North, Grymkin (partial), Rolling Guard.
- **Tier:** big (your call — confirmed 2026-05-07)
- **Solo?** No.

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
- **Pre-fill:** indie skirmish.
- **Studio:** TBD.

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
- [ ] **Wanted Reward CC 10000** —
- [ ] **Flames of Orion** —
- [ ] **Gloam** —
- [ ] **Hag 28** —
- [ ] **Omentide** —
- [ ] **Pillage** —
- [ ] **Midguard** —
- [ ] **Hobgoblin** —
- [ ] **Rumpus** —

---

## Implementation order

1. **Schema change** — add `format` and `solo` fields. Update Mage Knight frontmatter (set `format`, set `solo`). Build, ship.
2. **Format index pages** — build `/games/ttrpgs/`, `/games/skirmish/`, `/games/mass-battle/`, `/games/solo/`. Convert `/games/index.astro` into a hub page with a few featured games per format. Existing `/games/graveyard/` lives at status filter level — already implicitly covered by current Graveyard section, but now becomes its own page too.
3. **Studio stubs** — write 1-paragraph entries for all studios in the "to stub first" list.
4. **Game stubs** — start with one wave-1 game per format to test the full flow end-to-end (e.g. Dolmenwood + Trench Crusade + Warmachine). Once the flow feels good, batch the rest.
5. **Deepen** — full wave-1 coverage as content gets written.

---

## Open questions (still)

1. **MESBG tier** — `big` (it's GW) or `indie` (Specialist-game vibes)?
2. **The One Ring + Strider Mode** — one page or two?
