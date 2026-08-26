# Copy I wrote that a reader will see

> **Status:** **A and B applied** 2026-08-26 — see the notes inline. Three
> blocks still need Matt: **[A4]/[A5]** length, **[B3]** voice pass, **[B5]**
> the two lines I wrote for the new channel. **C onward is untouched.**

Everything on the site that is my words rather than yours, pulled from the
source as it stands on `dev`. Edit in place and hand it back — I'll put each
block where its ID says it goes.

**How to use it:** every block has an ID like `[A1]`. Rewrite the text under it,
delete what you don't want, or write `KEEP` if it's fine. Anything you leave
untouched I'll assume is fine. If a block should not exist at all, write `CUT`.

**Not in here:** your game one-liners, verdicts, game and news bodies, guide
titles and descriptions, transcripts — none of that was touched. The 288 posts
moved with frontmatter changes only. Also not here: the four restored resource
pages, which are your words from `48d6f7c`, restored verbatim.

**Length notes** matter in two places. `<title>` wants ≤60 characters or Google
truncates it; meta `description` wants ≤155. I've flagged those.

---

## A — Home page

### [A1] The H1. **APPLIED.**
> Find your next indie wargame. Learn how to play and paint it.

### [A2] The line above it (kept from the old hero — your words, listed so you can see the pairing)
> HOBBYING FROM THE DEEP END OF THE DUNGEON

### [A3] Hero paragraph, under the H1. **APPLIED** (spacing after two commas normalised).
> A directory of small and indie tabletop wargames, and the guides to get them on your table. Skirmish, army-scale, solo stuff, and the weird stuff in between.

### [A4] Browser tab + Google result title *(currently 71 chars — over the 60 limit, will truncate)*
> The Hobbinomicon — find your next indie wargame, then learn to paint it

### [A5] Google result description *(currently 178 chars — over the 155 limit, will truncate)*
> A directory of indie wargames the big publishers ignore, and the painting guides to get them on your table. Skirmish, army-scale, solo, and the weird stuff in between.

### [A6] Guides section, eyebrow + heading. **APPLIED.**
> **Eyebrow:** Learn to paint and play it
> **Heading:** Guides

### [A7] On-ramp section, eyebrow + heading
> **Eyebrow:** Already playing something big?
> **Heading:** Start where you are

### [A8] Warmachine card, on the home page. **APPLIED.**
> Hobby and painting guides dedicated to Warmachine.

### [A9] Warhammer card, on the home page. **APPLIED** ("occassionally" → "occasionally", "games workshop" → "Games Workshop").
> 40k, The Old World, and Spearhead. I do occasionally paint Games Workshop stuff still.

---

## B — Warmachine hub (`/warmachine/`)

### [B1] Tagline, under the big title. **APPLIED.**
> I love Warmachine for the tight, competitive rules, but I am not good enough to write strategy guides. So here are painting guides instead.

### [B2] Google result description. **APPLIED.**
> Warmachine painting guides by faction, army projects, and news

### [B3] **RESTRUCTURED, still needs your voice.** You asked for a dedicated section for the army you're actually painting, separate from the factions you paint samples of. The page now has one: a bordered "The army I am painting — Old Umbrey" block above the faction grid, carrying this text, Old Umbrey's guides, and its planned-models line. Old Umbrey is out of the grid so it isn't said twice.

The text below is **only the facts you gave me** — it still needs rewriting in your voice:
> Old Umbrey is the one I am painting all the way through. Everything else on this page is a single model from another faction, painted far enough to work out a scheme and write it down.

Two labels I invented for the new structure, which you should also check:
> **Section label:** The army I am painting
> **Faction grid blurb:** Single models from the other factions, painted to work out a scheme. These are recipes, not armies.

### [B4] Section heading for the faction grid. **KEPT as is.**
> Painting guides by faction

### [B5] YouTube CTA. **APPLIED** — now points at `@TheHobbinomiconWarmachine`, not the main channel.

The heading is unchanged, but the body and sub-line were the *main* channel's default copy ("Daily vlogs from the painting desk…"), which is exactly the confusion you wanted to avoid. I wrote replacements — **these two lines are mine and need checking**:
> **Heading:** More Warmachine on YouTube
> **Body:** A second channel, Warmachine only. Faction schemes, army projects and event coverage, with none of the daily vlog in the way.
> **Sub-line:** Warmachine only. The daily vlog stays on the main channel.

---

## C — Warhammer hub (`/warhammer/`)

### [C1] Tagline
> 40k, The Old World and Spearhead. The recipes that carry over to anything you paint, and where to look when you want a game that fits on a smaller table.

### [C2] Google result description
> Warhammer painting guides — 40k, The Old World and Spearhead — plus the indie wargames worth trying if you already paint Games Workshop models.

### [C3] The body. **Also fully mine — needs your voice.**
> ## Why this page exists
>
> Most people painting miniatures started with one of these. The techniques carry over to everything else, so this is a good place to begin — and a good place to find out what else is out there.

### [C4] Section heading for the system grid
> Guides by game

### [C5] The "coming soon" lists. These appear under each empty section — the rule is that an empty section must say what's coming or not exist at all.
> **40k:** On the desk: a Khorne Daemon army.
> **The Old World:** On the desk: Tomb Kings, for Oldhammer 2027.
> **Spearhead:** On the desk: the City of Ash terrain build, both boxed teams.
>
> *(Spearhead team names are placeholders — you said the box isn't bought yet.)*

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
> How to paint it, base it, build it and start playing it. Every guide here is a video I made, written up so you do not have to scrub through it.

### [E2] The nine topic landing intros. Each one is the only prose on that page, so it's what stops it being a bare list.

**Painting**
> Recipes, colour choices and the order to put paint on in. Most of these are one model, start to finish, with the paints named.

**Basing & Terrain**
> Bases, boards and the scenery that goes on them. Cheap materials, mostly, because a table full of terrain adds up fast.

**Airbrushing**
> Priming, zenithals and basecoating with an airbrush, plus what to do when it clogs.

**Sculpting, Casting & 3D Printing**
> Making models rather than buying them: green stuff, moulds and resin, and getting a printer to behave.

**Kitbashing**
> Cutting models up and gluing them back together wrong on purpose.

**Solo RPG**
> Playing without a group. Oracles, journalling, and the kit that makes a solo session work.

**Getting Started**
> How to start playing a game, from what to buy first to what the rules actually ask of you.

**Buying & Selling**
> Buying, selling and trading miniatures without losing your shirt.

**Reviews**
> First looks, unboxings and whether the thing was worth the money.

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
> The daily hobby vlog, all of it. Painting sessions, mail days, false starts and the odd finished model.

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
> **Start here** — What to buy, what to read, and what the game actually asks of you.
> **Painting guides** — Recipes and schemes, paints named.
> **Terrain & basing** — Bases, boards and the scenery to put them on.
> **More guides** — *(no blurb)*
> **Series** — *(no blurb)*
> **Build logs** — The project, in order, start to finish.
> **From the vlog** — *(no blurb; was "From the Hobbinomicon")*

### [I4] Age of Sigmar: Spearhead stub — drafted, won't publish until you clear it
> **Description:** Boxed skirmish format for Age of Sigmar: two fixed warbands of about a dozen models, a small board, and a game that finishes inside an hour.
>
> *Still needs from you: the verdict line, the "how to start" body, costToStart, boardSize, and the three funnel picks.*

---

## J — Newsletter (`/newsletter/`)

### [J1] The promise, used as the page intro and the Google description
> New indie wargames, Kickstarters worth backing, and one painting guide. Every two weeks, no more than that.

### [J2] Page body
> ## What you get
>
> Three things, every other week. A game from the directory worth a look, whatever is live on Kickstarter that is not a cash grab, and one painting guide from the site.
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

## The four I'd change first, if you only do four

1. **[B3] "My armies"** — a personal section written by someone who isn't you.
2. **[C3] "Why this page exists"** — same problem, and it's the first thing a cold 40k visitor reads.
3. **[H1] and [H2] the series descriptions** — they front sixteen and five episodes.
4. **[A4] and [A5]** — both over Google's truncation limits, so they're getting cut mid-sentence in search results whatever they say.
