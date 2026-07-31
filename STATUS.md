# STATUS — The Hobbinomicon · updated 2026-07-28

## Now
Live on Astro 6 (README still says Astro 5 — stale). v2 baseline shipped: three-entity directory, format-based game URLs, News pillar, SEO/perf pass, search improvements, GEO output (`/llms.txt`, `/llms-full.txt`, `.md` renderings). YouTube description pass 269/269. Tag taxonomy 69, registry 1:1 with the corpus.

**`main` is at `286cb82`. `dev` is in sync — everything is deployed.** Three builds today. Two long-standing defects closed: **client-side navigation was killing three components' JavaScript** (video player, comments, back-to-top — all dead on any post reached by clicking rather than hard-loading), and **draft posts were building public pages and sitemap entries**. **Vlog tagging is now manual** — `sync-vlogs` prompts, keywords only suggest.

Still true: **transcripts only reach the live site from a local sync** — YouTube blocks caption fetches from Netlify's IPs, so `npm run refresh-vlogs` is load-bearing (see `_system/RECURRING.md`).

## Next (ranked)
1. **DWARF play-through write-up.** The 07-22 news post promised it "this week" — that window has closed. Highest priority because it's a public promise, not a maintenance task.
2. **Reading progress bar — same Swup bug as today's three fixes.** Its script also lives inside `#swup`; a post reached by in-site navigation never runs it. Same fix (move to `BaseLayout`, delegate), ~10 minutes, and it finishes the sweep. See the 07-28 log entry for the full pattern.
3. **`npm run refresh-vlogs`** — last sync 07-21, and now unblocked (the remap it was waiting on is done). This will be the **first real exercise of the manual tag prompt**, so expect to type tags per video.
4. **Hero images for the Gloam and DWARF news posts.** Both run without one. No-AI-art rule applies: Matt's own photo, or ask the creators for permission to use their key art — the ask also opens a contact.
5. **Funnel mechanic v1** ("if you like X, try Y") — biggest visible gap from the v2 vision; schema ready, rendering + tag-fallback + backfill not. The 69-tag taxonomy makes tag-fallback far more tractable.
6. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form is wired, engine missing.
7. Monster Friends project entry + backfill `project:` on posts.
8. **Port the GEO pattern to mattglbrt.com** (AITD done 07-22).

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL checks only).
- YouTube OAuth needs re-auth roughly weekly before API work. Staying unverified/local-only is a closed decision (07-21).

## Recently done
- 07-28 — **Swup was silently killing post-only component scripts.** They render inside `<div id="swup">`, and Swup swaps that container in as parsed markup, so those scripts never execute — dead on every page reached by clicking. Fixed for `LiteYouTube`, `Comments`, `BackToTop` (which had a second bug: it captured the button once, so the first swap left it toggling a detached node). Handlers moved to `BaseLayout` outside the container, verified by byte-offset against the built HTML. **`tag-keywords.json` remapped 99 → 69** and its substring false positives fixed (`ork` was matching "work" 903 times across 77% of the corpus). **Tagging switched to a manual prompt** (`scripts/lib/prompt-tags.js`); keywords only prefill, retired tags are rejected with what they became, and the prompt can never block a build. `auto-tag-posts.js` deleted. **Draft posts were public and in the sitemap** — `getStaticPaths` lacked the draft filter every other collection had; fixed, demo post + two orphaned components deleted. Deploys: `43c5e8f`, `e1811b9`, `286cb82`.
- 07-22 (cont.) — Tag taxonomy collapsed 304 → 69 (1,445 uses → 996, 258 posts changed), registry 99 → 69 and 1:1 with the corpus, 474 explicit redirects for 237 retired tag pages + RSS feeds. Fixed a pre-existing bug where the `brand` category never rendered on `/tags` or `/explore`. Added the DWARF news post. Deploys: `08f351e`, `e4e35b7`.
- 07-22 — Description pass 269/269. Two long transcripts polished and retitled. Back-catalogue ASR sweep: 3 new normalize entries → 20 fixes across 13 files; 12 raw-dump meta descriptions rebuilt; two real gaps fixed in `lib/excerpt.js`.
- 07-21 (evening) — GEO output built, deployed, verified live. Surfaced the pubDate timezone bug and a sort-tie fix (`17ce0c7`).
- 07-21 (pm) — Found transcripts never reach the site from Netlify builds (YouTube blocks datacenter IPs; silent for six weeks). Created `_system/RECURRING.md`.

## Open questions
- **`.claude/commands/{orient,wrap}.md` are now tracked in git** — swept in by a `git add -A` on 07-28, outside that commit's scope. Untrack + `.gitignore` if they should stay local.
- **Is `vlogs/monster-friends-energy-counter` meant to stay drafted?** It was publicly readable until today's fix and is now a 404. If it should be live, clear `draft: true` rather than reverting the filter.
- **Normalize the 192 timezone-less `pubDate` values?** They read `"YYYY-MM-DD HH:MM:SS"`, which JS parses as *local* time, so those posts resolve to a different instant on Netlify (UTC) than locally, shifting ordering in RSS, the blog index, and GEO outputs. Legacy data, not a live regression. Cosmetic-only.
- **Directory entries for DWARF / Tavern Lore?** Deferred by Matt 07-22. Worth revisiting after the play-through, since `solo-rpg` is now the third-biggest tag.
- Thirteen tag redirects point at the index because they were too ambiguous to place (`showcase`, `tools`, `maps`, `rahara`, …). Refinable any time; one line each in `public/_redirects`.
- Eight redirect mappings were inference, not from Matt's guide (`metallic`→`metallics`, `tufts`→`basing`, `mdf`/`heat-gun`/`led-lights`→`terrain`, `modeling-compound`→`sculpting`, `one-ring`→`ttrpg`, `thyra`→`warmachine`). Worth a glance.
- A few regenerated meta descriptions are thin where the transcript opens weakly (`rambling-about-competitive-vs-fun-games`, `coffee-cup`). Hand-written blurbs would beat auto-generated.
- Should `/llms.txt` be linked from the site (footer, or `<link rel="alternate">`)? Discovery is crawler-side only.
- Delete the now-unused `descriptions/` corpus (232 files) and `descriptions_pushed.json`? Both gitignored, both dead.
- Worth a transcript proxy so Netlify can fetch captions itself? (Deferred on cost/complexity.)
- Tagline alternatives? Newsletter provider? Moderation alerting approach?
