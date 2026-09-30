# Session Log — The Hobbinomicon

Append-only. **Newest entry first.** Pre-existing planning history lives in `roadmap/*.md` (status legend `[x]/[~]/[ ]/[?]/[-]`).

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

## 2026-09-15 — Mac to PC, the newsletter moves to Substack, Mailgun deleted

A long session that started as "clean up the Mac files" and ended with the
newsletter on a different platform, Mailgun gone, both legal pages rewritten,
and 190 video descriptions updated. **Deployed five times: `main` @ `b716028`,
`a0f15a8`, `356f421`, `8df0976`, `d76d146`.**

### The migration damage was invisible, and it was not .DS_Store files

The working tree had **zero** Mac metadata files. What had actually broken was
`node_modules`: a darwin-arm64 install, so `esbuild`, `rollup` and `sharp` all
carried Mac-only native binaries and nothing could build. `npm ci` replaced all
three with win32-x64. That is the whole migration problem, and it is invisible
to any file search.

Deleted, at Matt's call: `scripts/hobbinomicon-descriptions.plist` and
`scripts/run-description-pass.sh`, both hardcoded to `/Users/mattglbrt/...` and
`/opt/homebrew/bin/node`. launchd does not exist here and the pass is run by
hand now. Also dropped three tracked Lighthouse reports (~1.6MB) and gitignored
the path, since PageSpeed mobile is the ground truth for this project anyway.

**`CLAUDE.md` still pointed at `src/content/blog/vlogs/`.** The collection moved
to `src/content/vlog/` in the 2026-08 restructure. One of the two stale
references was inside the documented commit ritual, so following the
instructions as written staged nothing and shipped no vlogs.

### Two new vlogs, and 13 transcripts that had been empty for months

Only 3 of 273 channel videos lacked a page. Synced both new ones with
transcripts, thumbnails and tags. **Tagging was done by hand against the
keyword suggestions rather than with them**, and the suggestions demonstrated
exactly the failure `CLAUDE.md` documents: substring matching scored `painting`
13 and 21 on two terrain-board tutorials, while `terrain` did not surface at
all on the Motley Crews one.

Since the home connection is the only place YouTube's caption endpoint works,
ran the full `--all` backfill opportunistically: **13 transcripts recovered**
(11 guides, 2 vlogs) that had synced too early for captions to exist. 9 videos
genuinely have no caption track.

### The newsletter: rebuilt, moved to Substack, and Mailgun deleted

`/newsletter/` rebuilt from a supplied `roadmap/newsletter.astro`, copy
unchanged, wiring adapted. Every signup form site-wide now posts to
`hobbinomicon.substack.com` — footer, homepage, game pages, news pages.
`NewsletterSignup` was updated on **both** variants, not just the footer the
brief named, because the same component feeds four other surfaces and all of
them said "From the Workbench."

**The move would have silently killed the Meta pixel's `Lead` event.** The old
handler posted to `/api/subscribe` over fetch and reported `Lead` on a 200. A
no-JS form post navigates away and nothing of ours runs afterwards. `Lead` now
fires on submit, so it counts *intent* — expect it to read permanently above
the Substack subscriber count. Kept `Lead` rather than `CompleteRegistration`,
which would assert a registration we cannot see, or `Subscribe`, which means a
paid subscription in Meta's taxonomy.

Mailgun removed entirely once Matt confirmed it was dead: both handlers, the
three env vars, the key revoked. **`src/pages/api/subscribe.ts` was the only
route with `prerender = false`, so the site is now fully static.**

### The debugging trap that cost an hour, and should not cost anyone another

The first two test signups produced a redirect and no subscriber. A
cross-origin theory was built on that, and it was **wrong**. curl could not
test it either — Substack returns 403 to it as a bot, so those probes proved
nothing in any direction and should not have been leaned on.

**The actual cause: Substack silently ignores the publication owner subscribing
to their own publication.** No error, same redirect, no subscriber. Combined
with `?nojs=true`, which makes success and failure visually identical, this is
close to the worst available failure mode. A retest with a non-owner address in
a private window worked first time. The form was correct throughout; `email`
alone is sufficient and the ten hidden attribution fields Substack's own form
sends are optional.

Matt chose to **keep the redirect** over a hidden-iframe version that would
have kept readers on-site. Right call for the right reason: the redirect is the
only option where the confirmation a reader sees is real, and today showed what
a confident false success costs. Added a line under all four forms — "Substack
sends the email, so that's where the button takes you." — because most signups
will be on mobile, where a domain change is nearly invisible and reads as a
failure.

### Legal pages, and a correction that mattered

Privacy policy gains **4.6 Substack**; terms gain **6. Newsletter** (6-12
renumbered to 7-13). Both stamped 09-15; the terms had not been touched since
November 2025.

**4.4 was factually wrong and had to be fixed.** It said the pixel records that
"a newsletter signup was completed." It does not — `Lead` fires on submit,
before Substack confirms anything. A privacy policy overstating what its
tracking captures is not a cosmetic error. Also corrected 2.1 and added a
newsletter line to 6. Data Retention.

Not lawyer-reviewed, and said so. The consent-banner question is sharper now:
two US processors disclosed, nothing gating either.

### Description pass: 190 of 269, and Yellow Imp leads separated

Ran the pass once the `/newsletter/` gate cleared. **190 written, zero errors**,
full day's quota spent. 79 remain. Spot-checked three against live YouTube
rather than trusting the log. Added **`--only <id,id>`** to the script, because
the smallest available run was otherwise 190 writes to give two fresh uploads a
footer they had never had.

Events Manager showed commerce events this site cannot fire — `AddToCart`,
`ViewContent`, `InitiateCheckout`. **Pixel `2022316185081924` is shared with
Yellow Imp** (policy 4.4 already documents this), so `PageView: 724` is both
properties combined. Both `Lead` calls now carry `content_name: 'newsletter'`
and `content_category: 'hobbinomicon'` so custom conversions can separate them.
Yellow Imp's own events stay unlabelled — a WooCommerce-side change in the
other repo.

### Strategy repo reconciled (different tree, pushed)

`strategy/` said Hobbinomicon email lived on **Mailcoach**; production said
Substack. Matt then confirmed he is not building Mailcoach at all, which
retires the spine of the 08-19 email architecture and leaves Buzzard's, Tables
Edge and MiniTrukk with no default home. Recorded in `community.md`,
`brands/hobbinomicon.md` and `STATUS.md` there. The 08-19 reasoning was kept as
a block quote, not deleted — the trade it describes is real, the weighting was
wrong, and the scarce resource is hours.

Pushing that repo also backed up **19 commits that had never left the old Mac**,
including the August cost-base and rights work.

### Open, and one thing that was never done

- **The 390px check was never performed.** The Chrome extension is not connected
  here, so no screenshot of the rebuilt newsletter page, the new notice line, or
  the mobile hero fade was ever taken. The fade is untestable regardless until
  `hero.jpg` exists, since the whole image block is skipped when the file is
  missing. Verified structurally only.
- **The Substack endpoint can only be tested by subscribing.** curl gets a 403.
  Any future change to those forms needs a real signup from a non-owner address
  in a private window.
- 79 descriptions left; token dies around 09-22.
- `SESSION_LOG.md` is ~49KB after this entry. Compaction per PLAYBOOK section 8
  is due next session.

---

## 2026-09-10 — The Meta pixel, and the 09-01 backlog finally shipped

Came in to add a Meta pixel and left with the site's first advertising tag
live, plus the 09-01 description-pass work committed and deployed after nine
days sitting uncommitted in the working tree. **Deployed: `main` @ `a336854`.**
One build credit for the whole batch.

### The discovery that shaped the work: this site is not on View Transitions

The brief asked to make `PageView` fire on client-side navigations "if View
Transitions are enabled." They are not. The site runs **Swup**
(`BaseLayout.astro`, `swup:page:view`), and had this gone unchecked every visit
after the first would have been uncounted — the single largest silent failure
available in this task. `PageView` now fires from the existing `swup:page:view`
listener, directly beside the GA virtual pageview that was already doing the
same job.

### Two decisions Matt reversed mid-session, both taken

**Hardcoded, not an env var.** The pixel first shipped behind
`PUBLIC_META_PIXEL_ID` so dev and Netlify deploy previews stayed out of the ad
account. Matt asked for it hardcoded instead. Done, and it is the more
consistent choice: GA's `G-990EP8N5XW` is already a literal in this same
layout, so both tags now behave identically. **Consequence, recorded because it
is real: the pixel fires from localhost and from deploy previews.** If that
becomes noise, a one-line `location.hostname` guard fixes it without bringing
the env var back. `.env.example` was created for the env-var approach and
deleted when it went away; the four real keys (YouTube x2, Mailgun x3) are
still undocumented anywhere committed.

**First interaction, not a flat 3s delay.** The first cut mirrored GA exactly:
load, then `setTimeout(..., 3000)`. Flagged that for an *advertising* pixel this
quietly drops every visitor who bounces inside 3s, which thins retargeting
audiences in a way GA's equivalent trade-off does not matter for. Matt agreed.
It now loads on the **first of** a real interaction (`pointerdown`,
`touchstart`, `keydown`, `scroll`) **or** 3s after load.

Two deliberate constraints inside that loader:

- **`load` is a hard floor.** An interaction during page load sets a flag and
  waits rather than inserting immediately, so ~70KB of pixel can never compete
  with LCP. The performance-first rule (PSI mobile >=95) is a closed decision and
  this keeps it closed.
- **`mousemove` is not a trigger.** On desktop it fires within milliseconds of
  paint and would have defeated the deferral entirely, turning "deferred" into
  "render-blocking with extra steps."

### Verification, and the rig it needed

Tool round-trips run 3-5s, which is longer than the 3s fallback, so naive
testing could never observe the interaction path — the timer always won first.
Built a throwaway rig instead: a real built page copied to `dist/__pixeltest/`
with one deliberately slow subresource, served by a Python handler that sleeps
10s on that one path. `load` then lands at ~10s and every branch is timeable.

All three branches measured against a served build:

| Case | `load` | Script inserted | Result |
|---|---|---|---|
| No interaction | 183ms | 3536ms | fallback timer, +3353ms |
| Interaction *before* load (5446ms) | 10032ms | 10031ms | fired **at** load, +0ms |
| Interaction *after* load (+1186ms) | 10040ms | at interaction | beat the timer by ~1.8s |

The middle row is the LCP floor proving itself: at 5446ms `readyState` was
`interactive` and the script was absent both immediately before *and*
immediately after the interaction. It waited, then went at load exactly.

Also confirmed: `fbevents.js` v2.9.397 loads, `signals/config/2022316185081924`
returns 200 (Meta recognised the ID), a Swup navigation fires exactly one
`['track','PageView']`, a successful signup fires exactly one `['track','Lead']`
with no payload, and a **failed** signup fires nothing.

### Two measurement traps worth remembering

**`fbq.getState().pixels[0].eventCount` is not a per-call counter.** It sat at
1 through repeated tracks, including a manual `fbq('track','PageView')` typed
straight into the console. It nearly produced a false "the Swup PageView is not
firing" conclusion. Spying on `window.fbq` is the reliable check.

**A `fetch` stub breaks Swup.** Stubbing `window.fetch` to fake a successful
`/api/subscribe` also broke Swup's own page fetching, forcing a hard navigation
and wiping the spy — which read exactly like "the Swup PageView is not firing."
Test `Lead` and Swup separately.

Not chased further: the outbound `/tr` beacon was never directly observed. It
goes out on a transport invisible to resource timing and to the extension's
network monitor, and `_fbp` is not reliably set on `localhost` anyway. Meta's
config endpoint accepting the pixel is the strongest local signal available;
Events Manager is the real confirmation and it needs Matt's Business login.

### Privacy policy

`src/pages/privacy-policy.astro` gains **section 4.4 Meta Pixel** (YouTube
renumbered 4.5), plus edits to 2.2, 3, 5 (cookies) and 6 (retention), stamped
**September 10, 2026**. It discloses what the pixel collects, that data may be
combined with **Yellow Imp Miniatures** under MDG Growth LLC for advertising
and measurement, and three opt-out routes (Meta Ad Preferences and Off-Facebook
Activity, browser controls, a consent banner if one is ever added).

**There is no consent banner**, so the pixel loads for every visitor exactly as
GA already does, and the policy now says that in as many words. Flagged once and
left with Matt: an advertising pixel is a different consent category from
analytics under UK/EU GDPR, and BONEZONE is pulling UK traffic through October.
No banner was built; that was not the ask.

The policy's absolute "**WE DO NOT AND WILL NEVER** ... share your email address
with marketers or advertisers" survives intact, and deliberately so: **advanced
matching stays off and `Lead` carries no payload**, so Meta never receives a
subscriber's address. `Lead` sits outside the `if (msg)` block in
`NewsletterSignup.astro` so it does not depend on the message element existing.

### Artifacts

- `src/layouts/BaseLayout.astro` — base code, first-interaction loader,
  `<noscript>` beacon (in `<body>`, since `<noscript>` in `<head>` may legally
  contain only `link`/`style`/`meta`), preconnect, Swup `PageView`
- `src/components/NewsletterSignup.astro` — `Lead` on signup success
- `src/pages/privacy-policy.astro` — section 4.4 and four amended sections
- Commits `237cb64` (pixel) and `0a97171` (the 09-01 description-pass staging,
  including the 271-snippet backup, tracked by existing precedent)

### Also shipped: the 09-01 backlog

That work had been sitting uncommitted for nine days, one `git checkout` from
gone. Committed separately from the pixel. The merge to `main` additionally
carried two older `dev` commits that had never been deployed (the 08-27 wrap and
the dark-mode bug record) — checked before pushing: docs, `PROGRESS.md`,
`scripts/audit-images.mjs` and one `package.json` entry, no rendering changes.

**The description pass itself is untouched and still held.** Its gate has not
moved: Matt's `/newsletter/` copy. The 09-01 backup stays the only undo and is
now nine days old, so re-run `backup-descriptions` and the dry run before any
write.

### Open

- **Events Manager Test Events is the unclosed hop.** Everything up to the
  `fbq` call is verified; the last mile needs Matt's Business login.
- **Stray `localhost` events may already be in the account** from this
  session's verification — a handful of `PageView`s and two `Lead`s from a fake
  `test@example.com` (no actual signup was created). If they appear against a
  `localhost` domain, that is this session, not traffic.
- **`Lead` will read zero until Mailgun is confirmed.** It only fires when
  `/api/subscribe` returns ok, so the unverified `MAILGUN_API_KEY` /
  `MAILGUN_LIST` env vars gate it. A quiet Lead count could mean the pixel is
  fine and the newsletter is broken.
- Consent banner: Matt's call, unbuilt.
- `.env.example` was deleted with the env var; the real keys stay undocumented.

---

## 2026-09-01 — The description pass, staged and held at the last step

Came in to run the YouTube description pass (STATUS #0, blocked since 08-27).
Everything in front of the writes is done and green; the pass itself is
deliberately not run. **No descriptions were touched, nothing was committed,
nothing was pushed.**

### The newsletter link, decided before the writes

The footer's newsletter line was the one open question that gets baked into
271 videos at 50 quota units each, so it had to be settled first. Changed
`scripts/update-descriptions.cjs:143` from `hobbinomicon.com/#newsletter` to
`https://hobbinomicon.com/newsletter/?utm_source=youtube&utm_medium=description`.

Three reasons, in order of weight:

1. **A fragment is invisible to analytics.** `/#newsletter` records as a
   pageview of `/`. The fragment never leaves the browser and is not in GA4's
   default `page_path`, so newsletter clicks from YouTube were not merely hard
   to attribute, they were *uncountable* — indistinguishable from all other
   homepage traffic.
2. **That line carried no UTM at all.** The guides and games lines (132, 138)
   both append `?${U}`; newsletter and Discord did not. Fixing only the URL
   would still have left the source unattributed. The Discord line was left
   bare on purpose: it points at an external domain that will never report a
   UTM back.
3. **It is a better landing page.** Both surfaces render the identical
   `<NewsletterSignup variant="section" />`, so the form is the same. The
   difference is context — `/newsletter/` opens with the pitch and carries its
   own title and breadcrumb data, where `/#newsletter` drops a cold viewer at
   the bottom of the homepage past everything else.

### Pre-flight, all green

`npm run backup-descriptions` → 271 snippets to
`scripts/backups/descriptions-backup-2026-09-01T16-19-34.json`. **That file is
the only undo.** Full `npm run build` (439 pages, per CLAUDE.md — not
`npx astro build`, which skips `prebuild`). Then `--verify-urls`: 97 URLs
checked against `dist/`, 85 guide deep links, all resolve. Dry run: **269
videos need the footer, 168 priority, ~13,450 units against a 10,000/day
limit** — so 190 in the first day and 79 in the second, priority first.

### Three things the pre-flight surfaced

**`--verify-urls` cannot tell you a page is live.** It checks against local
`dist/`, built from the working tree, so it would pass happily for a page never
merged to `main`. Matt asked whether the newsletter page actually exists on the
site, which is precisely the question that check does not answer. It does:
`src/pages/newsletter.astro` landed on `main` in `6aa29e0` (Phase 2b) and went
out with the 08-26 deploy, and production returns **200** for both
`/newsletter/` and the exact UTM'd URL the footer emits, serving the real title
and form. Confirmed by request, not inferred. Worth remembering this blind spot
in the pre-flight — the only two commits on `dev` and not on `main` are
docs-only, so nothing else the footer points at was at risk this time.

**STATUS's "engine missing" for the newsletter is out of date.**
`netlify/functions/subscribe.js` is a working Mailgun handler. It is gated on
`MAILGUN_API_KEY` and `MAILGUN_LIST` and returns a 500 if either is absent.
Whether they are set in Netlify's env is **unverified** and not checkable from
here. The form is live either way; the open risk is silently dropped signups.

**Counts.** The backup captured 271 snippets, the pass scopes 269 — two videos
sit outside its filter. And the dry run's BEFORE blocks already show UTMs on the
guides and games lines, so an earlier pass did land at some point; STATUS's
"0 of 271 updated" is specific to the 08-27 wrong-channel attempt.

### Why it is held

Matt's call, and the right one: pointing 271 video descriptions at a thin page
spends the one shot that traffic gives you. He is writing content for
`/newsletter/` first. The pass runs after that. The backup stays valid as long
as nothing else edits descriptions in the meantime.

---

## 2026-08-27 — Mobile pass, then two bugs that had shipped invisible

Started as the mobile UI/UX pass Matt asked for and turned into finding two
classes of defect that were live on the site and that no gate we have would
ever have caught. Three merges to `main`: `905f4ab` (mobile pass + thumbnails),
`78427fb` (dark mode). Docs-only commits stayed on `dev` to save build credits.

### The mobile pass

Header height and icon inconsistency, the duplicate search entry point, hero
sizing and dead space, search contrast, filter-chip raggedness, an 8px vertical
rhythm, and a global baseline: 44px tap targets, `viewport-fit=cover`,
`prefers-reduced-motion`, no horizontal overflow at 360px.

Two findings inside it are worth keeping. **Scroll-reveal used
`threshold: 0.1`**, so any section taller than the viewport never intersected
10% of itself and its heading stayed at `opacity: 0` while fully on screen —
fixed to `threshold: 0`. And fixing that **exposed contrast failures axe could
not see**, because you cannot audit an invisible element: `ink/40` at 2.49:1,
`ink/60` at 4.43:1, transcript summaries at 3.99:1, disabled pagination at
2.12:1. The bug was hiding the bugs.

`.icon-btn` also lived in `Header.astro`, and Astro scopes component styles, so
it never reached `DarkModeToggle` — the toggle had no border. Moved to
`global.css`.

### Thumbnails, and the 404s behind them

Matt asked for bigger thumbnails on `/guides/`, site-wide. The size was the
smaller half of the problem.

`getHeroImageUrl()` returns `ImageMetadata.src` — `/_astro/<name>.<hash>.jpg`.
Astro emits that original only when something references it *as an original*,
and a component handed the bare string never does. **Nine images 404'd across
~100 pages, on the live site as well as locally.** Worse, `ListCard` forks on
`isImageMetadata`, and since every call site passed a string, the `<Image>`
branch had never run once: list pages were shipping unprocessed originals,
median 104 KB, to fill a 96px square.

Fixing the input fixed both. Card call sites now pass `getHeroImage()`;
`getHeroImageUrl` stays where a string is genuinely wanted (og:image, RSS,
JSON-LD). Thumbnails went 16:9 — they are video stills and the square crop was
discarding ~44% of the frame — full-width on mobile, 192px beside the text
above 640px. **`/guides/` at 390px: 96x96 → 318x179, and total image weight
~1 MB → 107 KB.**

The og:image half mattered more than expected: those pages were serving a
**404 as their `og:image`**, so any share of them showed no preview card at
all. Three checked, all 200 now.

Also: the `src/assets/images` glob omitted `avif`, so a studio logo silently
degraded to a raw `/images/` path with no `public/` copy. And a desktop
regression from my own hero work — `display: flex` made "Browse all games" fill
the row, since a block-level flex container ignores `width: auto`.

New gate: **`npm run audit-images`** — every image URL in `dist` checked
against the files on disk. No dependencies. 439 pages, 12,867 references, 0
missing.

### Dark mode: text the same colour as the page

Matt: "under guides theres just images and no titles or descriptions in dark
mode." Reproduced, and it was not low contrast — it was **1:1**.

`ListCard`'s `light` scheme carried no `dark:` counterparts at all, so title,
meta and description all rendered `text-ink`. The palette **inverts** rather
than dims: `ink` is near-black in light mode and cream in dark, so a bare
`text-ink` is the same near-black in both. Every list page.

Three more had the mirror mistake — a background that inverts under hard-coded
`text-white`, leaving white on cream: the `/tags/<tag>/` header, the contact
submit button, and `Pagination` (which also punched white pills into the dark
page and hid its disabled prev/next and ellipsis). `PageHeader` is the model:
it does **not** invert its background, which is why most headers were fine.

**The method changed the answer.** A regex over class strings flagged
`ProseContent` and half a dozen others that are entirely fine, and would have
sent me rewriting body copy that already worked. Rendering both themes and
computing contrast against the *effective* background for every visible text
node was right in both directions. 18 pages, both themes, clean.

### The mistake I made

I reported the dark-mode fix live when it was not. The marker I polled for
(`dark:text-ink-dark/80`) already appeared on that page from `GuideLayout` and
`BaseLayout`, so it matched the **old** deploy in 20 seconds. Production was
still 1:1 when I called it fixed; measuring the live page is what caught it.
**Verify a deploy by measuring the thing you changed, not by grepping for a
string that may predate it.**

### Open after this

Nothing in code. Matt's content calls are unchanged, and the description pass
is still waiting on quota. Flagged for Matt: the YouTube footer links the
newsletter as `hobbinomicon.com/#newsletter` (homepage anchor) rather than the
`/newsletter/` page that now exists — both resolve, so it is a preference.

---

## 2026-08-27 — The description pass: right change, wrong channel, whole day's quota

Phase 5 cutover work. The goal was item 0 on STATUS: run `update-descriptions.cjs` so YouTube descriptions point at the new `/guides/` URLs, because fresh external links are the cheapest way to speed re-crawl after the rebuild. **The code change is done and committed. The pass itself did not run — 0 of 271 videos updated.** Four commits on `dev` (`4d0bac5`, `d7814f3`, `d4ef725`, `3dc10fa`), no merge to main: these are local-only scripts, nothing deploys.

### The footer now covers both surfaces

The rebuild shipped two surfaces, `/games/` and `/guides/`, but the footer only ever linked the games half. It now carries **exactly two site links, one per surface**, deep-linked where the page is known and falling back to the hub where it isn't:

- **guides** — the video's own guide page, matched on `youtubeId` frontmatter across `src/content/guides`. **85 of 271 videos** get a deep link; the rest get `/guides/`.
- **games** — the video's game page from `game-videos.json` (28 videos), else `/games/`.

So every video links both halves, and the 85 whose pages actually moved carry a fresh external link straight at the new URL. Guide-mapped videos also joined the priority set, so the first quota day covers what most needs re-crawling.

The URL rule (`/games/{game}/{slug}/` for a guide filed under a game directory, `/guides/{slug}/` otherwise) is now duplicated in **four** places: both routes, `generate-redirects.mjs`, and this script. That's the fourth copy of a rule that has to stay in lockstep, which is why the next item exists.

### `--verify-urls`, and the bug it found immediately

An offline pre-flight (no auth, no quota) that checks every link the pass would emit against `dist/`, then prints the four footer shapes on real videos so the copy can be approved before anything is spent.

It failed on the first run: **`gameTitles()` didn't filter drafts**, and `game-videos.json` maps two live videos to `infinity`, which is still `draft: true` and builds no page. Both were being pointed at a 404 — a pre-existing bug, not a new one. Drafts are now dropped from both maps and those videos take the directory line. All 97 URLs resolve; `dist/` was confirmed current (no content or route file changed since the 08-26 build).

Also checked the 07-22 description backups for stale in-body links: **zero** descriptions carry a hobbinomicon URL above the delimiter. The footer is the only place site URLs appear, so nothing else needed rewriting.

### The expensive part

Backup taken (271 snippets → `scripts/backups/descriptions-backup-2026-08-27T13-52-36.json`). Dry run clean: 271 needing update, 171 priority, ~13,550 units, two days. Ran `--run --max 190`.

**Every write returned 403 Forbidden. Zero updates. The full 10,000-unit daily quota was spent on rejected calls.**

Cause: the OAuth consent screen had authorized **"Curving Out"** (`UCgDOGJF3WrdjjF0cTSuy-lQ`) instead of The Hobbinomicon (`UCloue_Zf7JyQ7rhyvxW7zSg`). Matt has five channels and Google's account chooser doesn't default to the right one.

**Why nothing caught it:** video metadata is public, so *every read succeeds for any identity*. `backup-descriptions` pulled all 271 snippets and the dry run rendered perfect before/afters — both against a token with no write access to a single one of those videos. The failure only surfaces at the first write, and by then the script was 190 rejected calls × 50 units deep. Quota is billed per **Google Cloud project**, so re-authing correctly afterwards gave the right permissions against an empty budget; it resets midnight Pacific.

Two guards added:

- **`assertRightChannel()`** — one unit on `channels.list({mine: true})` against `YOUTUBE_CHANNEL_ID` before the first write, printing which channel the token actually owns. This is the check that should have run before anything was spent.
- **Abort after 5 consecutive failures with 0 successes** — no future cause can quietly drain a day either.

Recorded in `CLAUDE.md` next to the existing re-auth note, because the failure mode is invisible to every check that runs first.

### Scheduling, and why not a cloud routine

`youtube_tokens.json`, `credentials/` and `.env` are all gitignored and local-only, so a cloud-scheduled agent can't do this pass at all, and session cron dies with the session. A **launchd agent** is the only thing that survives to the 03:10 local reset. `scripts/run-description-pass.sh` + `scripts/hobbinomicon-descriptions.plist` are committed but **not installed** — writing to `~/Library/LaunchAgents/` was blocked by the permission classifier, so install is Matt's call; instructions are in the plist comment. The runner is daily and idempotent: skipping is content-based, so day two picks up the remainder and later days cost ~15 read units and change nothing.

### State at close

Auth is now correct and verified (The Hobbinomicon), token good through roughly 09-03. The backup is accurate because nothing changed. **Next run is the real one:** `node scripts/update-descriptions.cjs --run --max 190` after 3am local, twice — 190 then 81.

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

