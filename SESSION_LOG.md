# Session Log — The Hobbinomicon

Append-only. **Newest entry first.** Pre-existing planning history lives in `roadmap/*.md` (status legend `[x]/[~]/[ ]/[?]/[-]`).

---

## 2026-07-31 — Monster Friends rulebook v1.3 update; reading progress bar fixed, Swup sweep closed. Two deploys

Short session, both items shipped. **`947994f`** (news post update) and **`f9c12b7`** (progress bar), one build each.

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
- **`.claude/commands/` untracked** (`6d37f95`), closing the 07-28 mistake. `git rm --cached` only, so both files stay on disk and the slash commands keep working. Also ignored `.claude/settings.local.json` — machine-local state that was sitting untracked and would have been the next thing a stray `-A` swept up. **Scoped to those two paths rather than all of `.claude/`**, so a skill or agent definition worth sharing later can still be committed deliberately. Side effect worth knowing: the two files are now gone from GitHub, so they no longer sync to another checkout.

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
