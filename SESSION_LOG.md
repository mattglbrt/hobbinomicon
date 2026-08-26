# Session Log — The Hobbinomicon

Append-only. **Newest entry first.** Pre-existing planning history lives in `roadmap/*.md` (status legend `[x]/[~]/[ ]/[?]/[-]`).

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

## 2026-07-21 — archived era: standard installed, description pass, GEO, transcript pipeline

*Five entries covering 21 July 2026 moved to `SESSION_LOG_ARCHIVE.md` on 2026-08-11. Read that file only when the detail is needed.*

- **Everyway organization standard installed** (CLAUDE.md · STATUS.md · SESSION_LOG.md, `/orient` + `/wrap` ritual).
- **YouTube description pass** — 190 videos updated in the first run, two bugs fixed. `push-descriptions.cjs` and the `descriptions/` corpus retired: it matched files to videos by fuzzy *title* similarity and would have pushed the wrong description to a short-titled video. `update-descriptions.cjs` matches on video ID and supersedes it. **Closed decision:** the OAuth app stays unverified and local-only, so the refresh token dies weekly — don't propose publishing it again.
- **Transcripts were never reaching the live site.** YouTube blocks the caption endpoint from datacenter IPs, so every fetch fails on Netlify and succeeds from home. Hidden for six weeks because the failure was logged identically to "this video has no captions." `fetch-transcript.js` now returns `{status, text}` distinguishing `no-captions` from `blocked`, and both scripts print a loud banner. Consequence that still governs the repo: **a vlog is a thin, transcript-less page until someone syncs locally and commits it.** `_system/RECURRING.md` created. A proxy was considered and deferred on cost/complexity.
- **GEO output built and deployed** (`17ce0c7`) — `/llms.txt`, `/llms-full.txt`, and `.md` renderings of every page, verified live.
- **A timezone bug fell out of the GEO diff** — 192 `pubDate` values written as `"YYYY-MM-DD HH:MM:SS"` parse as *local* time, so those posts resolve to a different instant on Netlify (UTC) than locally. Legacy data, still open, cosmetic-only.

---

