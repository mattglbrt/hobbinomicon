# Session Log Archive — The Hobbinomicon
Entries moved out of `SESSION_LOG.md` on 2026-08-11, 2026-08-27, 2026-09-15 and 2026-09-30 per `_system/PLAYBOOK.md` §8. **Newest first.** The live log carries summary blocks in their place.
Entries moved out of `SESSION_LOG.md` on 2026-08-11 per `_system/PLAYBOOK.md` §8. **Newest first.** The live log carries a summary block in their place.

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

---

## 2026-08-24/25 — Two news posts, a countdown component, a hub rule, and three real bugs

Long content session that kept turning into engineering. **Eleven commits on dev, three merges to main** (`d4275dc`, `acc9cd2`, `5e82a0c`), three builds. Everything shipped; `dev` and `main` are level.

### BONEZONE 2026 post + the Countdown component

Matt is entering Richard Gray's annual skeleton painting comp and wanted a post with a live countdown to the deadline. Source page 403s to both WebFetch and curl, so the details came out of the browser.

**The comp had not "just started."** It opened 1 August and today is the 23rd. Wrote it as open with ten weeks left rather than as a launch, and flagged the mismatch rather than papering over it.

`src/components/Countdown.astro` + a tick script in `BaseLayout`. Two decisions worth keeping:

- **The script lives in BaseLayout, outside `#swup`, not in the component.** A countdown only ships on the posts that use it, which is exactly the shape that broke `LiteYouTube`, `Comments` and the reading progress bar: Swup swaps content in as parsed markup, so a component-local script never executes on a page reached by clicking. Verified by *clicking through from /news/*, not by hard-loading — digits ticked, the interval cleared on navigate-away (net intervals back to 0), and the expired state swapped correctly against a faked past deadline.
- **Digits are server-rendered from build time, then corrected by JS.** No-JS readers and the pre-hydration frame get a plausible number instead of dashes. They stale between builds, which the daily scheduled rebuild covers. The deadline is *also* written in prose, because `stripMdx` strips JSX components from the `.md` GEO rendering — the countdown must not be the only carrier of the date.

Halloween 2026 falls after UK DST ends (25 Oct), so the deadline is 23:59 **GMT**, not BST.

### The BONEZONE hub rule

Matt: all BONEZONE content links back to `/news/bonezone-2026-open/`. Recorded in **`CLAUDE.md`** rather than only STATUS, because CLAUDE.md is auto-loaded and survives STATUS rewrites, and because the failure mode is specific: **synced vlogs arrive with no links in the body**, so every Royal Herald vlog needs the link added by hand after `refresh-vlogs`, and committed, since Netlify-built vlog posts are ephemeral.

Applied it to the two pieces that already existed: `online-painting-competitions-2026.mdx` still said 2026 details "haven't been announced yet" (now filled in), and the skeleton-recipe vlog got a backlink.

### Motley Crews: Dreadwood

New `_nubmark` release. Post at `/news/motley-crews-denizens-of-dreadwood/`, plus a "What's new" section on the game page. Matt supplied the final copy; his version carried facts the sources did not — Advanced goes **2 terrain pieces to 10**, cows and terrain are pay-what-you-want, $15 buys a table plus all three official teams, new teams in development.

**Deadwood vs Dreadwood:** the itch product title says Deadwood, the card file and video chapters say Dreadwood. Matt confirmed **Dreadwood**. Renamed the post; the itch URL genuinely contains `deadwood` and was deliberately left alone. Safe rename with no redirect — it had never reached main.

**A correction of mine.** I changed the game page's "$10" to "$5 a set", assuming it was stale. It was not: sets are $5 and a two-player game needs two. Restored, and both mentions now state the per-set price *and* why it doubles, so the next reader does not repeat the mistake.

Also caught from the video description and added: the **Maison Nébuleuse pre-order week, 24–31 August**, physical resin printed by Trashfire Studio. Time-sensitive, which is what drove merging rather than batching.

### Three bugs, none of them the thing I was asked to do

- **og:image was broken site-wide on four templates.** news, games, studios and people all passed the raw `heroImage` frontmatter path to BaseLayout and StructuredData. Heroes live in `src/assets`, so `/images/...` has no file behind it once deployed: every social preview and every structured-data image pointed at a 404. `BlogLayout` already resolved this via `getHeroImageUrl`; the detail templates never did, which is why blog posts previewed fine and news posts did not. Fixed all four.
- **YouTube embed thumbnails sat 32px low.** Reported as "the container is too tall" — the container was always exactly 16:9. Tailwind Typography's base `prose img` rule margins the thumbnail, and **a margin still offsets an absolutely positioned box**, so it dropped below the frame top and overflowed the bottom into `overflow-hidden`. `not-prose` on the `LiteYouTube` root, fixed at the component so it covers every in-prose embed.
- **Motley Crews had fallen off the homepage.** "Games worth knowing about" sorts indie-tier first then by `updatedDate || pubDate`, top 6; Motley Crews sat at #8 on its May pubDate. Added `updatedDate`, now #1. **Note `pinned: true` is set on that game and the homepage sort never reads it** — there is no durable pin, only date order.

### Deletions and drafts

- **Deathbringer post removed** at Matt's request: post, 700KB hero, and a stale doc-comment referencing it. Its URL and `.md` rendering both 301 to `/news/`, matching the dropped-tag convention. Verified gone from build, news index, sitemap, `llms.txt` and `llms-full.txt`.
- **`oldhammer-year-2027.mdx` drafted** (`draft: true`, invisible to build/sitemap/indexes). 2027 as an Oldhammer year via OWAC and 40k2ndAC. Both source pages currently document the 2026 editions and Matt says they update in place. Two threads left visible in the copy rather than smoothed: the challenges **overlap** (two 1,000-point armies in parallel, on top of the Tomb Kings army), and **OWAC is Oldhammer 3rd/4th edition, not the current Warhammer: The Old World game** the BONEZONE kits belong to.

### Artifacts

`src/components/Countdown.astro` · `src/content/news/bonezone-2026-open.mdx` · `src/content/news/motley-crews-denizens-of-dreadwood.mdx` (+ two optimized images in `src/assets/images/news/`) · `src/content/blog/articles/oldhammer-year-2027.mdx` (draft) · edits to `BaseLayout.astro`, `LiteYouTube.astro`, four `[slug].astro` templates, `motley-crews.mdx`, `online-painting-competitions-2026.mdx`, `a-new-way-to-paint-skeletons.mdx`, `public/_redirects`, `CLAUDE.md`.

Not verified: the live site after the final deploy. The countdown and the og:image tags were confirmed on a locally built site and, for the embed fix, measured in a browser before and after.

---

## 2026-08-13 — AI disclosure reframed as a promise; shipped

Short session, one change, deployed. **`8ba7eba`** on dev, merged **`f2391f2`** to main, one build.

Matt asked for the footer's **"AI Disclosure"** link to read **"100% Human Made Content & Art"** while still pointing at `/ai-disclosure/`. The framing is the point: the old label leads with the caveat, the new one leads with the promise, and the promise is the brand position (`../CLAUDE.md` hard rule: *"All artwork and creative content by Matt Gilbert — no AI-generated art"*).

Three things followed from the relabel, each raised and each approved before doing it:

- **The page had to be retitled too.** Clicking a link that promises human-made work and landing on an `<h1>` reading "AI Disclosure" is a mismatch the reader notices. `LegalPageLayout` feeds `title` to both the `<h1>` and the `<title>` tag, so one prop change fixed both.
- **The heading needed a size.** At the layout's `text-5xl md:text-6xl`, the longer title ran to three lines. Rather than shrink every legal page, `LegalPageLayout` gained an optional **`titleSize`** prop defaulting to the existing classes; only the disclosure page passes `text-4xl md:text-5xl`. Also added `text-balance`, which is free — it only affects headings that actually wrap, so Privacy Policy and Terms of Service render identically. Verified that in `dist/`, not by eye.
- **Two typos in the page copy** — "assit" → "assist", "peice" → "piece". Reader-facing text on the page that makes the site's central credibility claim, so worth the thirty seconds.

**URL unchanged**, so no redirect. Grepped `src/`, `public/` and the Astro config: the footer was the *only* link to that page anywhere in the repo.

**Build verification without burning the YouTube quota.** `npm run build` fires `prebuild` (vlog sync → transcripts → heroes), which hits the YouTube API and is pointless for two string literals. Calling **`npx astro build` directly bypasses the npm prebuild hook** and still produces a real `dist/`. Worth remembering as the default for verifying presentation-layer changes here.

**The merge carried more than this change.** `main` was two commits behind — the 08-11 wrap (`SESSION_LOG` compaction into `SESSION_LOG_ARCHIVE.md`, `STATUS.md` refresh) had been committed to dev but never merged. So `f2391f2` published those too. Docs only, no effect on the built site, but a reminder that the batched-deploy workflow means dev can quietly accumulate: check what a merge actually contains before pushing, not after.

Not verified: the live page after the deploy. Structurally confirmed in `dist/` only.

---

## 2026-08-11 — Funnel mechanic v1 built and deployed; then a full YouTube data analysis and a three-channel strategy

Two halves. Code first (**`df70292`** on dev, merged **`864effa`** to main, one build), then a long analytical session that produced strategy documents rather than commits.

### Funnel mechanic v1 — "if you like X, try Y"

Matt cleared the DWARF play-through off the board (he'll post it when he does it) and picked the funnel.

**STATUS was wrong about what was missing.** It said "schema ready, rendering + tag-fallback + backfill not." Rendering *was* built — a sidebar "If you like this, try" list at `[slug].astro:368`. It had simply never appeared on the site, because **zero of the 11 games have `relatedGames` set**, so the array was always empty and the block never rendered. Worth recording because the same trap is easy to re-enter: a feature can be fully written and invisible, and the doc will describe it as unwritten.

So the real gaps were the fallback and the placement. Matt chose a full-width card section over the sidebar, and chose to exclude out-of-print games from auto-suggestions while still allowing them editorially.

**Scoring leans on the structured fields, not tags.** `src/utils/funnel.ts` weights `format` (4), `solo` (3), `miniatureAgnostic` (3), tier (1) and cost band (1), plus shared tags weighted by inverse document frequency and **capped at 3**. The cap is the load-bearing part. Game tags are ad-hoc (`grimdark`, `bounty-hunters`, `mage-knight`, `dim-future`) and on a ten-game corpus a shared `fantasy` means almost nothing — five of ten carry it — while an uncapped IDF would let a one-off tag outrank a format match. Below `MIN_SCORE` (3) nothing renders; no padding with "latest" filler, because an empty section beats a non-sequitur.

Editorial `relatedGames` always come first, unfiltered — no threshold, no OOP exclusion. Out-of-print games are excluded as *suggestions* but still *receive* a funnel, which makes a graveyard entry the best possible place for one. Mage Knight now points at three live skirmish games.

Result: all 10 published games get suggestions, none suggest themselves, and the format index pages correctly show nothing.

**Then Matt asked for Warmachine to be switched off.** Added `hideFunnel` to the games schema and set it on `warmachine.mdx` — it's the only large-scale-army entry, so scored suggestions have no format peer and fall back to thin tag overlap (its single suggestion was Motley Crews on "3d printable · Fantasy", a $400 game pointing at a $0 one). The flag only hides the section *on* Warmachine's page; it can still be suggested elsewhere.

### A wrong call, and how it got caught

I reported that most game entries lack card images and filed it as a directory-wide content gap, based on a screenshot of the funnel section showing blank gradient cards. **Matt pushed back, and he was right.** Nine of eleven games have a `heroImage`; they all resolve through `getHeroImage` into `src/assets/images/` and all emit correctly to `/_astro/*.webp`.

The screenshot was of the **dev server**, taken immediately after scrolling. Card images are `loading="lazy"` and `astro dev` transforms them on demand, so I caught them mid-load. Only Ømen Tide genuinely has no hero (logo only). Two lessons now in CLAUDE.md: verify card rendering against a **built** site, and `astro preview` does not work here at all — the Netlify adapter rejects it, so serve `dist/` with `python3 -m http.server`.

### YouTube analysis — 271 videos

Matt asked for top-20 lists by views, likes and comments. Pulled the full catalogue via the Data API (~12 quota units of 10,000; public data, so the API key, not the OAuth token that dies weekly). Script kept out of the repo, in the session scratchpad.

Corpus: 271 videos, Sep 2025 – Jul 2026, **33,044 lifetime views, median 38 per video**.

Only **4 videos appear in all three lists**. The findings that drove everything after:

- **`My minimal solo rpg kit` is 10% of all channel views** — 3,313 views, 185 likes, 3.4× the next best on likes. Solo content overall: median 72 views against a channel median of 38.
- **Complete things beat installments, by 40×.** Board videos framed as a finished technique or a finished board did 983 / 922 / 761. The same subject framed as progress — "starting", "working on", "almost ready for paint", "making some additions" — did 40 / 25 / 24 / 21. That's the daily-vlog habit leaking into terrain content.
- **Shorts are a discovery product, not an engagement one.** 23 Shorts, 6,493 views, 1.20% like rate against long-form's 5.69%; 0.32% comments against 1.73%.
- **20–45 minute videos have the best like rate on the channel** (7.69%, n=14). Under five minutes is the weakest bucket.
- **Vlogs are last on reach and likes but beat baseline on comments** (1.84% vs 1.46%) — the conversation engine.

Combined ranking computed two ways (average percentile vs share-of-totals). They agreed on 6 of 10 and on the entire top 4; every disagreement was the Shorts/reach question. Led with the percentile method because the question was resonance, not reach.

### The strategy work

Matt had already planned to split into three channels. Checked it rather than endorsing it, and **two of three moves were well-supported, one was not**: Warmachine is 1.8% of lifetime views on 7 videos, and Trench Crusade out-performs it on a similar count (983 views, median 106 — the highest median of any category). Said so. Matt then supplied the missing variable — **direct Steamforged access and relationships with established Warmachine creators** — which addresses exactly the problem the numbers describe (reach, not resonance, since Warmachine already has the channel's highest like *and* comment rates). Updated the recommendation rather than holding the line.

Decisions settled across the session:

- **Daily vlog relocates to Instagram Reels**, not retired — the format's real strength is reach, which is worth something on a platform where reach converts to follows.
- **YouTube splits by topic, Instagram unifies by craft.** Two IG accounts, not four: `@hobbinomicon` (Matt-forward, all hobby craft including the Reels) and `@yellowimp` (company voice). No AITD Instagram. `@mattglbrt` secured everywhere and deliberately parked, replacing `@mattgilbertsucks` as the front door — it works against a page asking people to pay for painting.
- **Keep cross-posting Reels to YouTube Shorts** — same asset, zero marginal cost, and Shorts are a fifth of lifetime views.
- **Yellow Imp is a separate brand and business licence.** Rule: *borrow the audience, don't borrow the identity.*
- **Commissions are a real revenue line** (Matt's answer), which is what forced the mattglbrt.com rescope.

**The connection worth keeping:** the directory already flags which games are `miniatureAgnostic` — games that tell players to bring any minis. That is precisely Yellow Imp's addressable market, and the Hobbinomicon showcase strategy builds relationships with those same studios. Hobbinomicon opens the door, Yellow Imp walks through as a supplier rather than a competitor. **And it is also the exposure**: painting your own product on camera while the directory carries a `verdict` on those studios' games needs a plain disclosure line, set now rather than retrofitted after someone else raises it.

### mattglbrt.com — revised scope

"Commissions are real" breaks `claude.md §4`, which says keep it text-forward and explicitly do not make it a gallery. Nobody hires a miniature painter from ASCII text.

**The fix is cheap because the rule was editorial, not technical.** `src/modules/philes/images.ts` already globs and bundles everything under `src/images/`, and `src/modules/textmode/lightbox` already exists. So: keep the terminal frame, make the work visible inside it. Home page stays text-first; the commissions path goes image-led. No theme replacement — throughput is the whole plan's biggest risk and a rebuild spends it for nothing.

Three findings from reading that repo: `src/content` is **empty** (zero philes, so "the human behind the brands" is unbacked); `src/images/bearer-of-the-pale-stone/` holds **seven photos referenced by nothing**; and the `videos.ts` comment saying side channels are "retired" now misleads, since the split reinstates them.

### Artifacts

| | Path |
|---|---|
| Channel strategy (web) | `claude.ai/code/artifact/f185367e-7e17-4ea3-99ee-832ed6dd0183` |
| mattglbrt.com scope (web) | `claude.ai/code/artifact/ec0e17c3-1625-41d4-9a7e-8941ea6ba80c` |
| Channel strategy (md) | `~/Desktop/channel-strategy.md` |
| mattglbrt.com scope (md) | `~/Desktop/mattglbrt-scope.md` |

Markdown copies live on the Desktop by Matt's request, deliberately outside any repo. They are independent of the artifacts — editing one does not touch the other.

**Still open:** the funnel backfill is editorial and unstarted (TSPN wants it most — only narrative-format entry, so all three of its suggestions read just "Solo-friendly"); no Instagram data exists, so every IG target in the strategy needs a real 30-day baseline; and the mattglbrt.com scope has one decision outstanding — publish commission price ranges or stay quote-only (recommended: publish).

---


## 2026-07-31 — Monster Friends rulebook v1.3 update; reading progress bar fixed, Swup sweep closed. Three deploys

Short session, everything shipped. **`947994f`** (news post update), **`f9c12b7`** (progress bar), **`5333dd3`** (docs + `.claude/` untracking), one build each.

### Wave 2 news post — the rules finally landed

Matt asked for a July 31 update on `news/monster-friends-wave-2-released.mdx`: the 1.3 rulebook and Wave 2 monsters are live for download.

**Checked it rather than transcribing it**, and that was worth doing. The rulebook page's own copy still reads **"MONSTER FRIENDS (BETA 1.1) · updated 04.2026"** on the download button, so taking the page at face value would have said the opposite of the truth. The Google Drive files behind those buttons are `Monster Friends Battle For New Florida Core Rules v1_3.pdf` (created Jul 30, 20:22 EDT) and `...Monster Cards v1_3.pdf` (Jul 31, 01:48 EDT). The label is stale, the files are current.

Rendered the 31-page cards PDF to check what's actually in it (it's Photoshop output, so `pdftotext` only got fragments). **14 cards**: Brew Bat, Bucket Troll, Doctor Speeding Ticket, Gnorc Big Bomber, Gnorc Pillager, Mr. Devil, Outhouse Mimic, Penguin Rogue, Schnoz, Snapping Turtle Knight, Tumble Stone (Large + Small), Walrus Champion, Wimpy Guard.

Cross-referenced against the post's own Wave 2 lineup: **every Wave 2 release now has a card.** Brew Bat, Gnorc Big Bomber, Outhouse Mimic and the Tumble Stones (the "Face Stones 4-Pack" in the post) join Doctor Speeding Ticket and Walrus Champion from the July 16 batch, and Mr. Devil is in there so the Summer Cook Out sculpt is covered. The whole wave is playable — which is the actual news, and it's a claim the post can now make on evidence.

Followed the existing `## Update (July 16)` pattern rather than rewriting the original "we're still waiting on the rules" section — the post is a dated record and reads better as one. `updatedDate` → 2026-07-31. Checked the game directory page too; it has no version-specific copy, so nothing to change there.

**One line to watch:** the post tells readers to ignore the "BETA 1.1" button label. If Orc the Brand fixes it, that line wants deleting.

### Reading progress bar — the last of the 07-28 class

Same root cause as the three components fixed on 07-28, and the last one on the list.

The irony: **the script was already written to be swap-safe.** It re-queried the bar and `.blog-content` on every tick, and guarded against double-binding, with a comment explaining why. None of it mattered. It lived in `BlogLayout`, which renders inside `<div id="swup">`, so on a post reached by clicking it had never executed *anywhere* and the scroll listener was never bound. It only worked if you hard-loaded a post first.

**A second bug rode along in the same block.** That script also tagged `.blog-content img` with `data-lightbox`. `Lightbox` itself is delegated and sits outside the container, so it was fine — but on any clicked-to post the images were never tagged, so clicking them did nothing. Moving the block fixes both. Also guarded a zero/negative divisor: on a post shorter than the viewport the old maths wrote a negative width.

**The sweep is now genuinely closed, and the reason is worth keeping.** Scanned all 455 built pages for `<script>` tags still inside `#swup`. Three remain — `Header`, `DarkModeToggle`, `NewsletterSignup` — and they're safe:

| | ships on | first hard load | after a swap |
|---|---|---|---|
| Header / DarkModeToggle / NewsletterSignup | every page | always runs, registers `swup:page:view` on `document` | self-heals |
| reading progress (before) | blog posts only | never ran if you entered from elsewhere | nothing to heal |

That's the whole distinction, and it's now a comment in `BaseLayout` so the next sweep doesn't re-derive it. The 07-28 entry's "most survive by accident" note was right; this pins down exactly which accident.

Verified by byte offset against the built HTML, same method as 07-28: bar, `.blog-content` and `#back-to-top` inside the container, scripts outside, script now on all 455 pages instead of posts only, old function gone from the build.

**Not verified in a real browser.** The Chrome extension isn't connected, and installing Playwright purely for this check wasn't worth the download. The structural evidence is strong but it is not a click-through. Worth one minute on the live site.

### Housekeeping

- **No new vlogs** (Matt). So `npm run refresh-vlogs` — ranked #3 last session — is moot: sync skips videos that already have a file, so with no uploads there's nothing to pull. **The manual tag prompt remains unexercised**, now for a second session.
- Named paths explicitly on every `git add` this session, per the 07-28 note.
- **`.claude/commands/` untracked** (`6d37f95` + `2fa62f0`), closing the 07-28 mistake. `git rm --cached` only, so both files stay on disk and the slash commands keep working. Also ignored `.claude/settings.local.json` — machine-local state that was sitting untracked and would have been the next thing a stray `-A` swept up. **Scoped to those two paths rather than all of `.claude/`**, so a skill or agent definition worth sharing later can still be committed deliberately. Side effect worth knowing: the two files are now gone from GitHub, so they no longer sync to another checkout.

### Two mistakes on the untracking, both caught and fixed

Worth recording because the second one is a trap that will recur.

**The `.gitignore` rules shipped a commit late.** `git rm --cached` stages the file removals but not the `.gitignore` edit, and that edit was never added — so `6d37f95` untracked the files without the rules meant to stop it happening again. Caught on the pre-merge `git status` and fixed in `2fa62f0`. The `git check-ignore` verification run at the time was real but could only prove the *working-tree* file worked; it can't detect that the file is uncommitted.

**Untracking a file and then switching branches deletes it locally.** `git rm --cached` correctly left both commands on disk. Then `git switch main` — where they were still tracked — restored them as tracked files, and merging the deletion removed them from the working tree. They were gone. Restored from `4d3a042` with `git show <rev>:<path> >` (not `git checkout --`, which would re-stage them), verified against the originals, and they're now on disk, untracked, ignored.

**The safe order is merge first, then untrack from the merged branch.** Untracking on a side branch and merging later means one branch switch destroys the file.

### Still open

- **DWARF play-through write-up** — still carrying its "this week" promise from 07-22. Now the clear top item.
- Hero images for Gloam + DWARF news posts.
- Browser click-through on the progress bar fix.

---

## 2026-07-28 — Swup killed three components' JS; vlog tagging goes manual; drafts were public. Three deploys

Started as `/orient` + the auto-tagger remap, and turned into a hunt for a class of bug. Everything below is **live**: three batched merges, one build each — **`43c5e8f`** (handler fixes, tag-keywords remap, manual tagging), **`e1811b9`** (draft filter), **`286cb82`** (component cleanup).

### The video player, and what it actually was

Matt reported the player dead on a vlog page. It wasn't YouTube, a CSP, or the embed — the server-side HTML was correct, the thumbnail 200'd, and the click handler was present and well-formed.

The handler was a component `<script>`, so it rendered **inside `<div id="swup">`**. Swup swaps that container's contents in as parsed markup, and **scripts that arrive that way never execute** (DOMParser-created scripts are non-executable by spec; this is why `@swup/scripts-plugin` exists). So the player worked on a hard load and was inert on any page reached by clicking. Worse, it stayed inert for the whole session: the script never ran, so `initLiteYouTube` was never defined and its own `swup:page:view` re-init never registered either.

**This is a class of bug, not one bug.** Eight scripts sit inside `#swup`. Most survive by accident — they're on every page, so they run on the first hard load and their `swup:page:view` listener persists. The ones that break are the **post-only** ones, absent from the page you first load:

| Component | Symptom on a navigated-to post |
|---|---|
| `LiteYouTube` | play button inert |
| `Comments` | comments never load, form does nothing |
| `BackToTop` | dead — *plus* it captured the button once at load, so even when it ran, the first swap left it toggling a detached node |
| reading progress | same root cause, not yet fixed |

All three named ones now live in `BaseLayout` **outside** the container, delegated from `document`. Verified structurally in the built HTML rather than by eye: parsed the `#swup` span and asserted each handler's byte offset falls outside it, on both the homepage and a post page. The homepage row is the meaningful one — previously none of the three existed there at all.

### tag-keywords.json remapped, then demoted

The remap flagged as urgent last session: **99 targets → the 69 live tags**, exactly 1:1 with the registry. Retired tags' keywords folded into whatever they 301 to in `public/_redirects`; 8 targets that were never in the registry at all (`orgoth`, `the-last-watch`, `orc-skin`, `pale-flesh`, `goblin-skin`, `campaign`, `strategy`, `fractured-isles` — zero corpus uses) merged or dropped.

**A second, worse problem surfaced while validating.** Matching is a plain substring count with **no word boundaries**, and the old list was badly exposed. Measured across all 272 vlogs:

| keyword | reality |
|---|---|
| `ork` | 903 hits, **77% of files** — "work", "working", "workspace" |
| `ice` | 559 hits, 49% — "nice", "price", "service" |
| `table` | 389, 40% · `clean` | 322, 38% |
| `board` | 306, 26% — "cardboard" · `orc` | 239, 31% — "force", "torch" |
| `tip` | 223, 28% — "multiple" · `cast` | 219, 24% — "podcast" |
| `face` | 204, 25% — "surface" · `rust` | 129, 14% — "trust" |

`ork` alone was enough to push `orcs-and-goblins` into the top 7 of most videos. Now plurals, phrases, or proper nouns, with the trap documented in a `_rules` block mirroring `transcript-normalize.json`.

Validated by running the real `extractTags` over all 272 vlogs: no off-registry tag produced, all 69 fire at least once, nothing matches in >45% of files except `paint`/`painting`/`build`.

**Matt then corrected a framing of mine**, rightly: he'd already fixed all the post tags, so where was the mismatch? The confusion was worth resolving explicitly — three separate things, only one of which was stale:

- `tags.json` (registry) — collapsed to 69 ✅
- post frontmatter — hand-fixed, verified 69/69 exact 1:1 ✅
- `tag-keywords.json` — last touched in `16fc61c`, **before** the collapse commits ❌

The third is read only when sync generates a **new** post, and sync skips videos that already have a file. So the corpus was clean and would have stayed clean until the next video synced — decay is prospective, one post at a time, which is why nothing looked wrong.

### Tagging is now manual (Matt's call)

Given video cadence is dropping, Matt chose to provide tags by hand at sync time. Picked **"suggest, then edit"** over a blank picker: keyword matching survives as a *prefill only*, and nothing reaches frontmatter without someone pressing Enter.

New: **`scripts/lib/prompt-tags.js`**. Enter accepts, `?` lists the 69 by category, `s` leaves untagged. Input validated against `tags.json`; near-misses get a did-you-mean (Levenshtein); **retired tags are rejected with the tag they became**, read out of `public/_redirects` rather than a new hardcoded list — those 301s are already the canonical record, so it stays correct for free.

```
Tags [...]: zenithal goblins showcase
  ✗ "zenithal" was retired — it's airbrushing now
  ✗ "goblins" was retired — it's orcs-and-goblins now
  ✗ "showcase" was retired with no replacement
```

**Two constraints held deliberately.** (1) It can never block a build: no TTY (Netlify, CI, `--no-prompt`) means no prompt and the post is created with **no** tags — suggestions must not leak through that path, since silently-written guesses are the failure mode being removed. Same logic as transcripts: the Netlify post is ephemeral, the committed local one wins. (2) The per-video loop is wrapped in `try/finally` so a mid-sync throw can't leave the readline handle open and hang the build.

`extractTags` renamed `suggestTags` to keep the demotion honest at the call site. Verified against the real API with `--no-prompt`: 271 videos, all already posted, clean exit, nothing written.

**`scripts/auto-tag-posts.js` deleted** (294 lines, at Matt's instruction). It bulk-rewrote tags across *existing* posts from keywords alone and was never wired to an npm script — one stray invocation from undoing the hand-tagging. This closes `roadmap/tags.md` Phase 3, solved by removing auto-tagging rather than tuning it: validating against `tags.json` gives the "only emit registry tags" guarantee by construction, so the planned weighted scoring isn't needed.

### Draft posts were publicly reachable — and in the sitemap

Chasing a throwaway observation (sync reported **272 posts vs 271 videos**) found a real defect. The gap was `example-with-media.mdx`, a scaffolding demo post embedding `dQw4w9WgXcQ` — the Rickroll, not a channel video. **No video of Matt's was unpublished**; an earlier framing of mine said otherwise and was wrong.

But it was `draft: true` and returning **200 live**. `getStaticPaths` in `blog/[...slug].astro` called `getCollection('blog')` with **no draft filter**. Every other collection (`games`, `news`, `studios`, `people`) already filtered; the blog's own page route was the exception.

Containment was partly good — drafts were correctly absent from the index, RSS, tag/category pages, pagefind, and the `.md` GEO renderings, so nothing linked to them. But **the sitemap is generated from emitted routes**, so Google was being pointed straight at `/blog/example-with-media/` and `/blog/vlogs/monster-friends-energy-counter/` (Matt's own deliberately-drafted vlog, publicly readable).

Fixed with the filter; demo post deleted. Verified live: both 404, sitemap down to 430 URLs with zero draft entries, 286 real posts unaffected.

`ImageGallery.astro` and `VideoTranscript.astro` were that post's only callers and are now deleted too, README updated to match. `VideoTranscript` was never part of the vlog pipeline at all — transcripts go into the MDX body as a plain `## Transcript` section — so it was dead from the start.

### Mistake worth recording

`git add -A` on the last commit swept in `.claude/commands/orient.md` and `.claude/commands/wrap.md`, untracked since session start and outside the requested scope. They are now tracked and pushed. Flagged to Matt; untracking + a `.gitignore` entry is a one-liner if he'd rather keep them local. Name paths explicitly, not `-A`.

### Still open

- **Reading progress bar** has the same Swup root cause as the three fixed components. Not fixed.
- **`.claude/` now tracked** — untrack if unwanted.
- Hero images for Gloam + DWARF news posts; **DWARF play-through write-up**, still carrying its "this week" promise from 07-22.
- The manual tag prompt is deployed but unexercised — no new videos yet.

---

## 2026-07-22 (cont.) — Tag taxonomy collapsed 304 → 69, redirects shipped, DWARF news post; two deploys

Continuation of the entry below. Everything from both entries is now **live** — two batched merges, one build each: **`08f351e`** (description pass, polished transcripts, ASR sweep, tag collapse, redirects) and **`e4e35b7`** (registry cleanup, DWARF post).

### Tag cleanup — the main event

Matt returned a cleaned tag matrix plus a written cleanup guide. I built the matrix for him first, and the first attempt was wrong: I produced a binary post × tag grid (317 columns), when what he wanted was `tag_1..tag_N` columns with the tag *names* in the cells so he could clear a cell and hand it back. The second shape was 16 columns and is the one to rebuild if this is ever needed again.

**Validated before touching anything.** The CSV declared 69 tags and 996 uses; its guide's taxonomy tables agreed exactly — no undocumented tags, no count mismatches, no duplicate tags within a row, every slug resolving to a real file. Applied, then re-verified: all 288 posts round-trip against the CSV.

Result: **304 tags → 69**, **1,445 uses → 996**. 258 posts changed, 30 already matched.

One discrepancy, harmless: the guide's *before* figures read 290 tags / 1,355 uses; disk state was 304 / 1,445. Only the before-numbers differ, so whatever snapshot produced them was stale. The after-state is exact.

Tag arrays now use `JSON.stringify` formatting, matching `sync-vlogs.js`. The corpus had been split 233 spaced / 39 unspaced; it is now uniform, so future syncs stop producing diff noise.

### Registry and a bug that was hiding a whole category

`src/data/tags.json` went 99 → 114 → **69**: added the 15 tags the new taxonomy used but never registered (`solo-rpg`, at 28 posts, was the largest), then removed the 45 left unused. It is now exactly 1:1 with the corpus. Project tags file under `faction`, following `children-of-gomb` and `kdm-hesychia`, so no new category was invented.

**Pre-existing bug found and fixed:** `categoryOrder` in `tags/index.astro` and `explore.astro` omitted `"brand"`, so brand-category tags never rendered on either page. Four were already invisible; the new taxonomy has seven, so the whole Products & Brands group would have silently vanished.

### Redirects — 474 rules

Collapsing the taxonomy left 237 tag URLs and 237 per-tag RSS feeds at 404. `public/_redirects` now carries explicit 301s: 160 merged tags point at their new home, 77 dropped ones go to the tag index, feeds to `/rss.xml`.

**Design decision:** explicit rules rather than a `/tags/*` catch-all. A catch-all would depend on Netlify shadowing (a static file winning over a non-forced rule) to avoid swallowing the 69 live pages, which is too subtle to bet the tag section on. Exact paths also cannot prefix-collide, which matters concretely here: `orcs` is retired while `orcs-and-goblins` is live, and a careless `/tags/orcs*` would have hijacked the biggest tag on the site.

Verified: every dead tag has exactly one rule, none shadows a live tag, every target resolves, no duplicate sources, and the file survives into `dist/_redirects` with nothing appended by the adapter.

**Eight redirect sources are my calls, not Matt's.** Twenty-one old tags appeared in neither of the guide's lists. Eight had an unambiguous home (`metallic`→`metallics`, `tufts`→`basing`, `mdf`/`heat-gun`/`led-lights`→`terrain`, `modeling-compound`→`sculpting`, `one-ring`→`ttrpg`, `thyra`→`warmachine`); the other thirteen were too ambiguous and go to the index.

### DWARF news post

`src/content/news/dwarf-solo-hex-crawl-released.mdx`. itch.io rate-limited both WebFetch and curl (429), so the page was read in Chrome; every fact comes from the page itself.

- `source: "authored"` rather than `curated` — curated renders a "Via itch.io. Read original" block, implying the writeup came from them.
- The page's setting description ends on a crude, profanity-heavy joke. Per `voice.md` the post gestures at it rather than reproducing it.
- No hero image (the only art is Tavern Lore's; hosting it is a rights question) and no `relatedGame`/`relatedStudio` — Matt explicitly deferred creating directory entries.
- I drafted an opinion in Matt's voice about the hunting/fishing angle and flagged it for review; he confirmed the fishing is genuinely what caught his eye, and asked to add that he's playing it this week with a write-up to follow.

### The thing that undermines all of it if left alone

`src/data/tag-keywords.json` drives auto-tagging on vlog sync. It has **99 targets, 45 of which are now-retired tags** (`vlog`, `goblins`, `orcs`, `zenithal`, `tips`, `conversion`, …), and **15 live tags have no keyword rule at all**. The next vlog sync will start reintroducing retired tags. This is precisely the "junk regrows daily" problem `roadmap/tags.md` flagged, and the collapse has made it urgent rather than theoretical.

Not fixed — the session was wrapping — but it is the top of the Next list.

### Still open

- **Auto-tagger remap** (above). Highest priority; the cleanup decays without it.
- **Hero images for the Gloam and DWARF news posts.** Both run without one. Constrained by the no-AI-art rule: options are Matt's own photo or asking the creators for permission to use their key art.
- **DWARF play-through write-up**, promised in the post as "this week."
- Directory entries for DWARF / Tavern Lore, deferred by Matt.
- The 13 ambiguous tag redirects pointing at the index, refinable any time.

---

## 2026-07-22 — Description pass finished at 269/269; two transcripts polished; back-catalogue description sweep

Cleared the top two items off the board, then chased the follow-ups they exposed. Everything is committed and pushed to `dev`. **Nothing is deployed** — no `dev` → `main` merge this session, so none of it is live yet.

### YouTube footer pass — done, 269/269

The token had not actually expired. STATUS said "expires 07-22, re-auth first regardless," but a dry run read live snippets fine, so `npm run youtube-auth` was skipped. Worth remembering: the 7-day window is a floor, not a hard stop, and a dry run is the cheap way to check.

Backed up first (`scripts/backups/descriptions-backup-2026-07-22T13-26-53.json`, 271 snippets), then `--run --max 190` updated all 65 remaining in one pass, ~3,250 units against the 10,000 daily quota. Verified with a follow-up dry run reporting **0 remaining** — that's live-API confirmation, not just trusting the run output.

Note: the backup holds 271 snippets but the pass sees 269. Two videos are in the channel but outside the script's working set, most likely private or unlisted. Not chased.

### Two long transcripts polished into written posts

Matt chose **full polish to `voice.md` §3, edited in place** over the lighter options.

**Decision worth recording:** full polish means the body is no longer what was said in the video. Left under a `## Transcript` heading with the embed directly above, the page would claim to be something it isn't, and a reader could check it against the video in seconds. So the heading came out in favor of topical headers. Same work Matt asked for, minus the false promise. The alternative — keeping verbatim text under the transcript heading — is the disfluency-only option, still available if he wants it back.

- `planning-a-new-hobby-room-layout.mdx` — 3,241 → ~1,690 words, 9 headers.
- `lava-rock-diorama-for-teaspoon-part-1.mdx` — 3,620 → ~1,780 words, 8 headers, cork technique broken out as the centerpiece with the one bullet list (voice.md allows bullets for steps/gear, never prose).

Both had a lowercase raw-fragment `title` and a truncated-transcript `description`; both rewritten. Slugs unchanged, so no URLs moved. Zero em-dashes in either. Kept near-verbatim: the pen pocket bit, the ceiling fan joke, "no tool better for the job than the tool you can reach," "you're literally just gluing trash together," the razor-blade safety gag, and both sign-offs.

**I got one thing wrong and corrected it.** I reported leaving "the Belling competition" as-is; I had actually dropped it. Restored as "the Bellwoken competition" in `dba6d2e`.

### Follow-up 1 — three ASR entries, 20 corrections swept

Added to `scripts/transcript-normalize.json`: **Grymkin** (9 mangled vs 4 correct across 6 files), **diorama** (12 mangled, 3 different spellings), **Shadespire**. Each variant was seen in a real transcript and none is valid English, per the `_rules`.

`normalize-transcripts.js` then fixed 20 occurrences across 13 files. It skipped the two hand-polished posts, correctly — it only touches `## Transcript` sections and those no longer have one, which is exactly the "hand-written words are not this script's business" rule working as designed.

**Deliberately not added:** "Bellwoken" turned out to be *correct*, not a mangle — it has its own post (`bellwoken-whimsical-army-set.mdx`) and is spelled consistently across three videos. "skin mounds" is probably the Grymkin warbeast **Skin and Moans**, but it appears once and is unverified, so it stayed as-is and is logged as an open question.

### Follow-up 2 — excerpt.js was never broken

I flagged `lib/excerpt.js` as failing to skip throat-clearing. **That diagnosis was wrong.** Git timeline settles it: `excerpt.js` landed at **11:41** on 07-21 (`6478615`), the 9-vlog sync ran at **11:17** (`abcbd26`). Those posts predate the fix by 24 minutes, and the rest of the back catalogue predates it entirely. Two of the offenders were the literal examples quoted in its own docstring — it was written *from* these posts and never applied *back* to them.

So the gap was a missing backfill, not a bug. Rebuilt **12 meta descriptions** that were raw transcript dumps.

Testing against real posts did expose two genuine small gaps, both fixed in `2d2d48d`:

- Hesitation particles survived in interior sentences (`"...his picture. Uh I printed it off."`) and after a comma (`"Today, uh I'm building"`). Only `uh/um/er/ah` are stripped; `so`/`well`/`okay` carry his rhythm and stay.
- Sentences containing the `[ __ ]` profanity redaction could reach a meta description. Now treated as throwaway. `coffee-cup.mdx` would have shipped one.

Corpus now has **zero filler-opening descriptions and zero censor markers** in frontmatter. Schema validates clean at 402 pages; `astro build` completes.

### Commits (all on `dev`, pushed, none deployed)

- `f791f0d` — description backup snapshot
- `9daa35e` — the two polished posts
- `2d2d48d` — normalize entries + excerpt.js fixes
- `dba6d2e` — back-catalogue sweep: 20 ASR fixes, 12 rebuilt descriptions, Bellwoken restore

### Still open

- **Nothing is live.** Needs `git switch main && git merge dev && git push && git switch dev` — one build. Held back because this is reader-facing copy and Matt hasn't read the two posts yet.
- **"skin mounds" → "Skin and Moans"?** Matt's hobby knowledge, one occurrence, unverified.
- A few regenerated descriptions are thin where the transcript opens weakly (`rambling-about-competitive-vs-fun-games`, `coffee-cup`). Auto-generated beats a dump, but hand-written blurbs would beat both.
- The 192 timezone-less `pubDate` values, unchanged from yesterday.

---

## 2026-07-21 (evening, cont.) — GEO deployed and verified live; a timezone bug fell out of the diff

Continuation of the entry below, which closed with the GEO work committed to `dev` but unpushed and unverified. Both of those are now resolved; this entry supersedes its "Still open" list.

### Deploys

Two batched merges, one build each, both normal merges per the workflow:

- **`890e8e3`** — GEO output + both wrap commits (3 commits).
- **`35d3eea`** — the sort fix below + two STATUS updates (3 commits).

Matt confirmed the earlier 07-21 transcript deploy independently, closing that item.

### Live verification

All outputs confirmed at 200. `/llms.txt` came back **byte-identical to the local build** (26,015 bytes), and its section counts match exactly: Games 10, Studios 6, People 8, News 6, Guides 13, Articles 2, Browse 7, Recent vlogs 60, Optional 2. `/llms-full.txt` is 280,503 bytes; `/games/kal-arath.md` and `/blog/vlogs/wtf-is-a-rectifier.md` both serve as `text/markdown` with the transcript intact.

**The `.md` content-type worry was unfounded** — despite site-wide `nosniff`, Netlify serves `text/markdown` and browsers display it. No `netlify.toml` change needed; that blocker is closed.

**Method note worth keeping:** the first verification pass used WebFetch, which miscounted two sections (reported Browse 6 and vlogs 71, actual 7 and 60). Its answers come from a small summarizing model that is not reliable at counting long lists. Re-checked with `curl` + `awk`, which is what the numbers above come from. Don't trust WebFetch for anything numeric.

### What the diff caught

Diffing live `llms-full.txt` against local showed identical byte counts but one vlog sorted one position differently. Chasing it turned up a real, pre-existing bug:

**192 posts carry `pubDate: "YYYY-MM-DD HH:MM:SS"` with no timezone.** JS parses that as *local* time, so those posts resolve to a different UTC instant on Netlify (UTC) than on Matt's Mac. Content inventory: 79 explicit-TZ, 48 date-only, **192 ambiguous**.

This is broader than the GEO outputs — it shifts ordering in RSS and the blog index too. `scripts/sync-vlogs.js` writes `video.publishedAt` (ISO with Z), so it's legacy data rather than a live regression, and the impact is cosmetic ordering only.

**Not fixed.** Rewriting 192 content files is a separate call from "implement GEO output," and the correct fix depends on whether those timestamps were originally UTC (likely — they came from YouTube `publishedAt`). Logged as an open question instead.

### Decisions

- **Tie-break the date sort by id** (`17ce0c7`). The 48 date-only pubDates parse to exactly UTC midnight, so same-day posts tie genuinely and fell back to the glob loader's filesystem order, which differs between macOS and Linux. Real fix, kept — but note it does *not* address the 192-post timezone issue, which is a different mechanism.
- **First diagnosis was wrong and got corrected.** I initially attributed the ordering difference to a sort tie and committed a comment saying so. Reading the two actual pubDates showed they differ by time, not tie. Comment and commit message corrected before push; recording it because the wrong explanation was briefly in the tree.
- **Reported the timezone bug rather than fixing it.** Out of scope, touches 192 content files, and needs Matt's read on original intent.

### Artifacts

- `src/utils/geoContent.ts` — id tie-breaker + a comment documenting the wider timezone caveat.
- `STATUS.md` — GEO verified live, `.md` content-type blocker closed, timezone finding logged.

### Still open

- **Normalize the 192 timezone-less pubDates?** One-off script, cosmetic impact, Matt's call.
- Should `/llms.txt` be linked from the site? Nothing references it; discovery is crawler-side only.
- Port the pattern to aloneinthedungeon.com and mattglbrt.com once this version has been live a while.

---

## 2026-07-21 (evening) — GEO output: llms.txt, llms-full.txt, and .md renderings of every page

Built the Generative Engine Optimization surface Matt asked for, modeled on Ghost's new built-in feature. All of it is statically generated at build time from the content collections, so the existing daily scheduled rebuild keeps it fresh — no new automation, no new moving parts to forget about.

### What shipped

- **`/llms.txt`** (25KB) — curated index per the [llms.txt spec](https://llmstxt.org/). H1, a one-paragraph blockquote, then H2 sections: Games → Studios → People → News → Guides and resources → Articles → Browse → Recent vlogs (60) → Optional. Directory entities lead, as asked. Every link points at the `.md` rendering, so a model that follows one gets clean markdown instead of a page of layout.
- **`.md` renderings** — appending `.md` to any public page URL returns frontmatter (title, description, date, tags, canonical URL) plus body. 316 files: 10 games, 6 studios, 8 people, 6 news, 286 blog. Vlog renderings keep their `## Transcript` section intact.
- **`/llms-full.txt`** (274KB) — directory, News, guides, and articles in full; the 271 vlogs as title + description + link. Well under the 2MB threshold, so **no split needed**.

### Decisions

- **Link descriptions are lifted verbatim from frontmatter.** Per Matt's constraint, no new copy written in his voice. The only prose I authored is the llms.txt blockquote and the llms-full.txt header, both deliberately flat and factual — they're machine-facing metadata, not site copy.
- **Rendered from the raw MDX body, not Astro's HTML.** Keeps the output real markdown. `src/utils/markdownExport.ts` strips scaffolding mechanically: imports and JSX out, with the four components carrying citable text converted to equivalents — `YouTubeEmbed` → a watch link, `ResourceSection` → `###`, `ResourceCard`/`ImageCard` → list items with their titles, prices, and descriptions. No word is ever changed, same rule as `scripts/lib/format-transcript.js`.
- **Documents in llms-full.txt are bounded by HTML comments, not `---`.** Caught during review: every doc opens with a YAML frontmatter fence, so a `---` separator would be indistinguishable from one and split the file wrong for anything parsing it.
- **Vlog transcripts excluded from llms-full.txt.** They'd multiply the file by roughly 10× for content that's one fetch away at each post's own `.md` URL.
- **`<div>` tags stripped from markdown output.** They only ever wrap layout here (grid rows around cards) and mean nothing in a markdown export. Found because stripping `ImageCard` left empty husks on the Wave 2 news post.
- **Doc builders factored into `src/utils/geoContent.ts`** so the `.md` endpoints and llms-full.txt render a page identically rather than drifting apart.

### robots.txt — was not blocking anything

Reported as asked: the existing `User-agent: * / Allow: /` already permitted every AI crawler. Nothing was being excluded, so nothing needed unblocking. Named GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, and meta-externalagent explicitly anyway — the wildcard covers them, but naming them means a future `Disallow` under `*` can't silently lock them out. Kept `Disallow: /_astro/` in both groups.

### Verification

- Built clean with `npx astro build` (skipping `prebuild`'s YouTube API calls). 692 HTML pages, unchanged.
- Spot-checked `llms.txt`, `llms-full.txt`, and three `.md` URLs — `/games/kal-arath.md`, `/blog/resources/mageknight-stormfox-newbie-guide.md`, `/blog/vlogs/wtf-is-a-rectifier.md` (transcript present).
- **Zero leftover MDX scaffolding** across all 316 files and llms-full.txt (grepped for `^import` and `<Capital`).
- **All 105 `.md` links in llms.txt resolve** to real files; all Browse targets exist.
- **Performance impact is zero by construction** — no existing page, layout, or component was touched. `git status` confirms the only modified pre-existing file is `robots.txt`. `npm run validate-schema` still passes across all 692 pages.
- Endpoints emit as static files, confirmed in `dist` — not SSR functions. They do **not** appear in the sitemap, which is correct.

### Artifacts

- `src/utils/markdownExport.ts` (new) — MDX stripping, frontmatter rendering, canonical URLs.
- `src/utils/geoContent.ts` (new) — per-collection doc builders + the filtered/sorted content set.
- `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts` (new).
- `src/pages/{blog/[...slug],games/[slug],studios/[slug],people/[slug],news/[slug]}.md.ts` (new).
- `public/robots.txt` (modified).
- Committed to `dev` as `0871107`, **not pushed** — Matt deploys via the batched merge.

### Still open

- **One decision for Matt:** `netlify.toml` sets `X-Content-Type-Options: nosniff` site-wide, and Netlify serves `.md` as `text/markdown`. Browsers will therefore *download* a `.md` URL rather than display it. Fine for crawlers, awkward for eyeballing. A `[[headers]]` block forcing `text/plain; charset=utf-8` on `/*.md` would make them render inline. Not applied — it changes how a whole file class is served, and `text/markdown` is arguably the more correct type.
- Not yet verified against the live site (nothing pushed).
- **Port the same pattern to aloneinthedungeon.com and mattglbrt.com.** The two utils are close to portable; only the collection schemas differ.

---

## 2026-07-21 (later) — Transcripts were never reaching the live site; pipeline hardened, everything deployed

Started as "pull the transcript for the latest video and clean it up." Ended up finding that **no recent vlog on the live site had a transcript at all**, and that this had been true for six weeks.

### The find

Matt noticed the skeletons post looked empty. It wasn't a rendering bug. The chain:

1. Local MDX had the full 3,000-word transcript, and the local build rendered it correctly into `dist`.
2. The live page had none. Same for `how-to-make-terrain-glue`.
3. The live page's "About This Video" contained the footer pushed to YouTube at ~11:00 **that same morning**, proving Netlify had rebuilt *after* that and still produced no transcript. Not a stale build.
4. An older post (`wtf-is-a-rectifier`) did have its transcript live, because it was synced from Matt's machine and committed.

**Cause:** YouTube blocks the caption endpoint from datacenter IPs. Transcript fetches fail on every Netlify build and succeed from a home connection. `scripts/lib/fetch-transcript.js` swallowed every error into `catch { return null }`, so a blocked fetch logged identically to "this video has captions disabled." `backfill-transcripts.js` — written specifically to self-heal missing transcripts — uses the same library and had therefore **never once succeeded in a Netlify build**, while appearing to run fine daily.

**Consequence:** Netlify can create a post but can never give it a body. A vlog stays thin on the live site until someone syncs locally and commits. This reversed advice given earlier in the same session ("keep the Netlify workflow as-is") — that was offered before checking the live site, and was wrong.

### Also found: the footer leaking into posts

Syncing surfaced a bug introduced by the morning's own footer pass. Recent videos had empty YouTube descriptions, so after the pass their entire description *was* the footer, and `sync-vlogs.js` copied it into the frontmatter description, the "About This Video" section, **and** the auto-tag input (where footer game names like "TSPN" could mis-tag videos). All 9 new posts shipped a meta description reading `――― 🎲 The indie wargames directory: 📬 Monthly-ish newsletter: 💬 Discord:`. Fixed at all three sites; regenerated the 9 posts.

### Work done

- **9 vlogs synced** (06-16 → 07-10). Local vlogs had stalled at 06-07.
- **Latest post cleaned** (`a-new-way-to-paint-skeletons.mdx`): ASR garbles corrected against verified sources rather than guessed — Mörk Borg, Westfalia Miniatures, Boris Woloszyn, Skelly Joe, MyMiniFactory, Tenebrous Grey (AK Interactive, *not* Scale75), phthalocyanine, zenithal, baking soda, light box. Hand-wrote its meta description. Added a **"Mentioned in This Video"** link section; every URL request-checked, two dropped when they failed (Westfalia has no about page → Boris named but unlinked; MyMiniFactory 403s bots → URL confirmed instead from Westfalia's own nav).
- **Three pipeline fixes** (`6478615`): blocked-vs-missing transcript status with a loud banner; `lib/excerpt.js` so meta descriptions skip throat-clearing; `transcript-normalize.json` + `lib/normalize-transcript.js` applying ASR corrections at fetch time. Swept the back catalogue: 11 corrections across 8 posts.
- **`npm run refresh-vlogs`** — the one-command weekly ritual, ending in a `git status` of what to commit.
- **Merged `dev` → `main` and pushed.** 6 commits, 31 files, +3,311/−359. One build. Six weeks of missing transcripts now live.
- **`_system/RECURRING.md`** created + a 🔁 Standing operations panel added to `_system/everyway-dashboard.html`, with PLAYBOOK §5 updated to walk it in the Friday review.

### Decisions

- **OAuth app stays unverified and local-only** (Matt's call). Recorded in `CLAUDE.md` as a closed decision so it stops resurfacing; the 7-day re-auth is accepted cost.
- **Keep Netlify auto-publishing.** The fix is a local weekly ritual, not a workflow change. A proxy would let Netlify fetch transcripts itself — considered and deferred on cost/complexity, not overlooked.
- **Normalization dictionary kept deliberately narrow.** The first draft included invented variants, among them `"more time" → "Mordheim"`, which would have silently rewritten a common English phrase across dozens of transcripts. Thrown out; only observed manglings remain, and the JSON now carries `_rules` explaining the trap.
- **Recurring work needed a durable home.** The dashboard is generated, so the panel would vanish on the next refresh — hence `RECURRING.md` as source of truth, with the regenerate instruction updated to include it.

### Artifacts

- `scripts/lib/fetch-transcript.js` — now returns `{status, text}`: `ok` / `no-captions` / `blocked` / `error`.
- `scripts/lib/excerpt.js`, `scripts/lib/normalize-transcript.js`, `scripts/transcript-normalize.json`, `scripts/normalize-transcripts.js` (new).
- `scripts/sync-vlogs.js`, `scripts/backfill-transcripts.js` — classified status, footer stripping, loud banner.
- `../_system/RECURRING.md` (new), `../_system/everyway-dashboard.html`, `../_system/PLAYBOOK.md` §5.

### Still open

- **65 YouTube descriptions** left, one quota day.
- **Two long transcripts worth hand-cleaning**: `lava-rock-diorama-for-teaspoon-part-1` (3,620 words) and `planning-a-new-hobby-room-layout` (3,241). The other six synced posts are too short to be worth it.
- **Verify the deploy**: the skeletons post should now show links + transcript.
- `_system/PLAYBOOK.md` §5 edit is not mirrored into `clients/_system/` (outside the working directory).
- This sync added ~30 tag instances to a taxonomy already known to be overgrown.

---

## 2026-07-21 — YouTube description pass: 190 updated, two bugs fixed, old pipeline retired

Resumed the description footer pass that stalled 07-15 at 22 videos. **190 updated this run, 0 errors** — the full priority set (playlisted + game-mapped, 160 videos) is now covered. 65 non-priority videos remain, blocked only by the 10,000/day API quota.

**Two bugs found and fixed before running anything live** (`35050cf`, `scripts/update-descriptions.cjs`):

1. *Rewrite loop.* Videos whose original description was empty ended up footer-only. The script sent `"\n\n" + footer`, YouTube stripped the leading whitespace, so the read-back never equalled the desired string and the content-based skip never fired. 14 videos were being rewritten every pass at 50 quota units each — a permanent tax on a quota-bound job. Fixed by emitting the bare footer when there's no body.
2. *Duplicate link block.* 232 of 271 videos still carried the pre-footer block (`---` / `🌐 Website & Blog: https://hobbinomicon.com` / `---`) above their hashtags, so the new footer was landing beneath it as a second, un-UTM'd link block. Matt chose to strip it in the same pass. The regex requires the site URL to match, so a bare `---` used as a separator in real body text can't be eaten; verified 232/232 clean against the 07-15 backup before any live write.

**`push-descriptions.cjs` retired** (`79a711a`). STATUS had it ranked as the #1 next action, but it was the wrong tool: it matched files in `descriptions/` to videos by *fuzzy title similarity*, and its one remaining backlog item — "Almost done" (`zFFKXkdD3js`) — resolved to `Almost_done_with_Dolmenwood_Breggle_Mini`'s description. Short titles make that failure common, not rare. `update-descriptions.cjs` matches on video ID and supersedes it, so the script and its npm alias are gone (git history retains them). The gitignored `descriptions/` corpus (232 files) and `descriptions_pushed.json` are now unused but left on disk.

Verification: spot-checked `bWV0v1u65es` against the live API post-run — legacy block gone, single correct footer.

**Artifacts**
- `scripts/backups/descriptions-backup-2026-07-21T15-00-00.json` — 271 live snippets, taken immediately pre-run. The only undo. (Backups are gitignored.)
- `scripts/update-descriptions.cjs` — the surviving, sole description writer.
- `CLAUDE.md` — new "YouTube description footer pass" section: backup first, quota math, priority ordering, 7-day token expiry, and a note that similarly-named `backfill-descriptions.js` is unrelated (it fills MDX frontmatter from transcripts).
- `package.json` — added `update-descriptions` + `backup-descriptions` aliases, dropped `push-descriptions`.
- `scripts/youtube-auth.cjs` — pointed at the surviving script in two places.

**Still open:** the last 65 descriptions need one more quota day. The refresh token expires 07-22, so re-auth first. That token churn is now the recurring cost of leaving the OAuth app unverified — this session is the argument for promoting that task. `SESSION_LOG.md` and `STATUS.md` remain untracked in git from yesterday's install.

---

## 2026-07-21 — Everyway organization standard installed

STATUS.md, this log, `/wrap` `/orient` commands added; standard footer appended to CLAUDE.md. Known stale spot: README says Astro 5 / Tailwind 3 — repo is on Astro 6 since 03-24.
