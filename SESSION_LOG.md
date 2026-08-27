# Session Log — The Hobbinomicon

Append-only. **Newest entry first.** Pre-existing planning history lives in `roadmap/*.md` (status legend `[x]/[~]/[ ]/[?]/[-]`).

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

