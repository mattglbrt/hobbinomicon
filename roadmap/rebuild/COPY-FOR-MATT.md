# Copy still needing you

**This doc is yours now — edit it directly.** I'll read it back and apply
whatever's changed. Settled blocks have been removed; what's left is either
still my words, or something you parked.

**How to use it:** every block has an ID like `[C1]`. Rewrite the text under it,
or write `KEEP` if it's fine as it is, or `CUT` if the thing shouldn't exist.
Anything you don't touch, I'll leave alone.

**Not in here:** your game one-liners, verdicts, game and news bodies, guide
titles and descriptions, transcripts. None of that was touched — the 288
migrated posts changed frontmatter only. Nor the restored resource pages, which
are your words from `48d6f7c`, verbatim.

**Length limits:** `<title>` truncates past ~60 characters, meta `description`
past ~155. Flagged where it matters.

**Settled and live:** A1, A2, A3, A5, A6, A8, A9, B1, B2, B4 — applied
2026-08-26, removed from this doc. `git log` has the before and after if you
want to see one again.

---

## A — Home page (two left)

### [A4] Browser tab + Google result title. **I wrote this at your direction — needs your eye.**

You asked me to make it cover play and paint. This is my wording, 54 characters
so it no longer truncates:
> The Hobbinomicon — find, play, and paint indie wargames

### [A7] On-ramp section heading. **You parked this** — "leave as is for now, I need to see it on the site."

These sit above the two Warmachine/Warhammer cards on the home page:
> **Eyebrow:** Competitive Games
> **Heading:** Warmachine is my competitive game of choice, but I just can't give up on Warhammer.

---

## B — Warmachine hub (`/warmachine/`) (two left)

### [B3] The Old Umbrey section. **Restructured to what you asked for; the words are still mine.**

You said the personal-army section should be Old Umbrey only, separate from the
factions you paint samples of. The page now has a bordered block above the
faction grid holding all three of these, plus Old Umbrey's guides and its
planned-model line ("On the desk: Lissya, Primeval, Vorony, Chosen of the
Witch"). Old Umbrey is out of the faction grid so it isn't said twice.

**B3a — the section label:**
> My personal Warmachine Army Project

**B3b — the body.** This is only the facts you gave me, written up. It's the
most personal text on the hub and it should sound like you:
> I plan on playing Old Umbrey in 2027, so I am getting it painted now. I am committing to Old Umbrey as my faction for 2027, regardless of what happens with the balance patch.

**B3c — the faction grid blurb**, which now has to explain what the grid *is*,
given the personal army moved out of it:
> These are recipes, and guides on how to paint the official box art schemes my way.

### [B5] The YouTube CTA. **Heading is yours and unchanged. The two lines under it are mine.**

It points at `@TheHobbinomiconWarmachine` now. The body and sub-line were the
main channel's default copy ("Daily vlogs from the painting desk…") — exactly
the confusion you wanted to avoid — so I replaced them:

**B5a — heading (unchanged, yours):**
> More Warmachine on YouTube

**B5b — body:**
> A second channel, Warmachine only. Faction schemes, army projects, and event coverage.

**B5c — sub-line, under the button:**
> Warmachine only.

---

## C — Warhammer hub (`/warhammer/`)

### [C1] Tagline
> 40k, The Old World, and Age of Sigmar Spearhead.

### [C2] Google result description
> Warhammer painting guides — 40k, The Old World, and Spearhead. Plus the smaller wargames worth trying if you already paint Games Workshop models.

### [C3] The body. **Also fully mine — needs your voice.**
> ## Why this page exists
>
> Most people painting miniatures started with one of these. 

### [C4] Section heading for the system grid
> Guides by game

### [C5] The "coming soon" lists. These appear under each empty section — the rule is that an empty section must say what's coming or not exist at all.
> **40k:** On the desk: a Khorne Daemon army.
> **The Old World:** On the desk: Tomb Kings.
> **Spearhead:** On the desk: Tyrants Below

### [C6] YouTube button
> More Warhammer on YouTube

---

## D — Shared hub furniture (appears on both hubs)

### [D1] Under the "Start here" heading
> If you read three things on this page, read these.

### [D2] Label on a section with no guides yet
> Coming soon

### [D3] Group with no faction/system
> Not faction-specific

---

## E — Guides

### [E1] `/guides/` description, used as the page intro and the Google description
> How to paint it, base it, and start playing it. Every guide here is a video I made, written up so you do not have to scrub through it.

### [E2] The nine topic landing intros. Each one is the only prose on that page, so it's what stops it being a bare list.

**Painting**
> Recipes, colour choices, and easy to follow techniques. Most of these are one model, start to finish, with the paints named.

**Basing & Terrain**
> Bases, boards, and the scenery that goes on them. Cheap materials, mostly, because a table full of terrain adds up fast.

**Airbrushing**
> Everything to do with using an airbrush, especially what to do when it clogs.

**Sculpting, Casting & 3D Printing**
> Making models rather than buying them: green stuff, moulds, and resin, and getting a printer to behave.

**Kitbashing**
> Cutting models up and gluing them back together wrong on purpose.

**Solo RPG**
> Playing without a group. Oracles, journalling, and the kit that makes a solo session work.

**Getting Started**
> How to start playing a game, from what to buy first to getting good.

**Buying & Selling**
> Buying, selling, and trading miniatures.

**Reviews**
> First looks, unboxings, and whether the thing was worth the money.

### [E3] Topic display names — the words in the nav, breadcrumbs and headings
> Painting · Basing & Terrain · Airbrushing · Sculpting, Casting & 3D Printing · Kitbashing · Solo RPG · Getting Started · Buying & Selling · Reviews

---

## F — Guide page template (every one of the 111 guides)

### [F1] Above the title, when the guide title differs from the YouTube title
> From the video "{the YouTube title}"

### [F2] The collapsed transcript toggle
> Full transcript of the video

### [F3] Materials card heading + the affiliate disclosure. The disclosure is built into the component, so a paid link can't render without it.
> **Heading:** What you need
>
> **Disclosure:** Some links above are affiliate links. If you buy through one, I get a small cut at no extra cost to you. It does not change what I recommend — everything listed is what I actually used.

### [F4] Steps heading
> The steps

### [F5] Section headings at the bottom
> More for {game name}
> More {topic} guides

### [F6] Link back to the directory
> {game name} in the directory →

### [F7] YouTube call to action at the very bottom
> **Heading:** Watch the whole thing
> **Body:** Every guide here started as a video. The channel has the full session, mistakes included.
> **Button:** Watch on YouTube

---

## G — Vlog, Series, Articles

### [G1] `/vlog/` description
> The daily hobby vlog, all of it. Painting sessions, mail days, false starts, and the occasional finished model.

### [G2] The line above the vlog list
> Showing 1–24 of 158 vlogs. Looking for a how-to? Those live in **the guides**.

### [G3] "Guides for this" block on a vlog post — the thing that stops a diary entry being a dead end
> Guides for this

### [G4] `/series/` description
> Campaigns and live plays, run start to finish. Kingdom Death blind, Kal-Arath solo, and whatever comes next.

### [G5] `/articles/` description
> Lists, essays and reference pages. The things that are neither a painting guide nor a day at the desk.

### [G6] Episode list heading on a series hub
> {N} episodes, in order

---

## H — Series entries. **Both are placeholders I wrote — these need you.**

### [H1] Kingdom Death: Monster
> **Name:** Kingdom Death: Monster — Blind Campaign
> **Description:** A full blind playthrough of Kingdom Death: Monster, settlement by settlement, with no rules read ahead and every mistake left in.

*(Also needs a hero image — it's on the site default. No AI art, so this wants a photo of yours.)*

### [H2] Kal-Arath
> **Name:** Kal-Arath — Live Play
> **Description:** Solo live-play sessions of Kal-Arath, the sword-and-sorcery solo RPG, run at the table and recorded start to finish.

*(Same — default hero image.)*

---

## I — Games

### [I1] `/games/army/` — the page that replaces "Large Scale Army" and "Rank and Flank"
> **Heading:** Army-Scale Games
> **Description:** Games where you field a whole army. Bigger model counts, longer setup, and a table that takes a while to fill.

### [I2] The Army-Scale block on `/games/`
> **Heading:** Army-Scale
> **Body:** Whole armies on the table. Bigger model counts, longer setup, and a game that fills an afternoon.

### [I3] Game page sections — these replace the old flat "Builds & Series" list
> **Start here** — What to buy, what to read, and how the game actually plays.
> **Painting guides** — Recipes and schemes, paints named.
> **Terrain & basing** — Bases, boards, and the scenery to put them on.
> **More guides** — *(no blurb)*
> **Series** — *(no blurb)*
> **Build logs** — The project, in order, start to finish.
> **From the vlog** — *(no blurb; was "From the Hobbinomicon")*

### [I4] Age of Sigmar: Spearhead stub — drafted, won't publish until you clear it
> **Description:** Boxed skirmish format for Age of Sigmar: two fixed warbands of about a dozen models, a small board, and a game that finishes inside an hour or two.
>
> *Still needs from you: the verdict line, the "how to start" body, costToStart, boardSize, and the three funnel picks.*

---

## J — Newsletter (`/newsletter/`)

### [J1] The promise, used as the page intro and the Google description
> New indie wargames, Kickstarters worth backing, and some painting guides. Every month, no more than that - first issue coming soon.

### [J2] Page body
> ## What you get
>
> I am working on this, who knows what you will get.
>
> ## What you don't get
>
> Daily mail. Affiliate spam. Your address given to anyone.

---

## K — Small stuff

### [K1] Tag page count line
> 12 pages, 4 of them guides

### [K2] Search — the scope chips and the default suggestion heading
> All · Games · Guides · News · Vlogs · Studios · People
> **Heading:** Latest guides

### [K3] Footer "Explore" column, in this order
> Series · Vlog archive · Articles · Studios · People · Newsletter · Tags · RSS Feeds

### [K4] Primary nav, in this order
> Games · Guides · Warmachine · Warhammer · News

---

## L — `/llms.txt` site summary

Not a page a person reads, but it's the description an AI answer will paraphrase
when it cites you, so it's worth getting right.

### [L1]
> The Hobbinomicon is an indie tabletop wargaming directory and hobby site. The directory catalogues independent miniatures games, TTRPGs, and the studios and designers behind them, cross-linked as three entity types: Games, Studios, and People. Alongside it the site publishes step-by-step Guides to painting, basing, terrain, kitbashing and getting started with a game; News on indie releases and crowdfunding; campaign Series played start to finish; and a daily hobby vlog. Written and produced by Matt Gilbert.

---

## If you only do four

1. **[B3b]** the Old Umbrey body — the most personal text on the site that I wrote.
2. **[C3]** "Why this page exists" — same problem, and it's the first thing a cold 40k visitor reads.
3. **[H1] and [H2]** the series descriptions — they front sixteen and five episodes.
4. **[B5b]/[B5c]** the new channel lines — they make a claim about your channels that should be yours to make.

---

## Corrected on the way in

Three typos, fixed rather than shipped. Say so if any were deliberate:

- **[A7]** "warhammer" → "Warhammer"
- **[B3a]** "Warmchine" → "Warmachine"
- **[G1]** "ocassional" → "occasional"

Plus four Oxford commas, per the rule you just set: **[B5b]**, **[C2]**,
**[E2 Sculpting]** and **[I3 Terrain & basing]**.

## Still unreviewed — my words

**D** (shared hub furniture), **F** (the guide page template, on all 111
guides), **H** (both series descriptions), **K** (small UI strings), **L**
(the `/llms.txt` summary). **H** is the one I'd do next: those two lines front
sixteen and five episodes.
