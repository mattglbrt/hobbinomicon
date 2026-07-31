# STATUS — The Hobbinomicon · updated 2026-07-31

## Now
Live on Astro 6 (README still says Astro 5 — stale). v2 baseline shipped: three-entity directory, format-based game URLs, News pillar, SEO/perf pass, search improvements, GEO output (`/llms.txt`, `/llms-full.txt`, `.md` renderings). YouTube description pass 269/269. Tag taxonomy 69, registry 1:1 with the corpus.

**`main` is at `5333dd3`; `dev` carries only this wrap entry on top.** Three builds today, all user-facing work deployed. The **Swup script-inside-`#swup` sweep is closed**: the reading progress bar was the last post-only script, and a scan of all 455 built pages confirmed the three remaining in-container scripts (Header, DarkModeToggle, NewsletterSignup) are safe because they ship on every page. The **Monster Friends Wave 2 news post** now carries a July 31 update — rulebook v1.3 is out and every Wave 2 monster has a card.

Still true: **transcripts only reach the live site from a local sync** — YouTube blocks caption fetches from Netlify's IPs, so `npm run refresh-vlogs` is load-bearing (see `_system/RECURRING.md`).

## Next (ranked)
1. **DWARF play-through write-up.** The 07-22 news post promised it "this week" — two windows have now closed. Highest priority because it's a public promise, not a maintenance task. No competing code work left in the queue.
2. **Hero images for the Gloam and DWARF news posts.** Both run without one. No-AI-art rule applies: Matt's own photo, or ask the creators for permission to use their key art — the ask also opens a contact.
3. **Funnel mechanic v1** ("if you like X, try Y") — biggest visible gap from the v2 vision; schema ready, rendering + tag-fallback + backfill not. The 69-tag taxonomy makes tag-fallback far more tractable.
4. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form is wired, engine missing.
5. Monster Friends project entry + backfill `project:` on posts.
6. **Port the GEO pattern to mattglbrt.com** (AITD done 07-22).
7. One-minute browser click-through on the progress bar fix (homepage → click a post → scroll; images should lightbox). Verified structurally, not in a browser.

**Note:** `npm run refresh-vlogs` has dropped off this list — Matt has posted no new videos, and sync skips videos that already have a file. It returns the day there's an upload, and that will be the first real exercise of the manual tag prompt.

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL checks only).
- YouTube OAuth needs re-auth roughly weekly before API work. Staying unverified/local-only is a closed decision (07-21).

## Recently done
- 07-31 — **Reading progress bar fixed**, closing the 07-28 Swup class. The script was already written to be swap-safe and it didn't matter: living inside `#swup` meant it never executed at all on a post reached by clicking. **A second bug rode along** — the same block tagged post images for the lightbox, so clicked-to posts had un-clickable images. Guarded a negative-width divisor while in there. Swept all 455 built pages to confirm nothing else is exposed. **`.claude/commands/` untracked and ignored** (`6d37f95`, `2fa62f0`), closing the 07-28 stray-`git add -A` mistake; files restored to disk after a branch switch ate them — merge first, *then* untrack (see the log). **Wave 2 news post updated for rulebook v1.3**; verified against the live PDFs rather than the page copy, which still labels the button "BETA 1.1" while serving 1.3 behind it. All 14 cards checked: every Wave 2 monster is now playable. Deploys: `947994f`, `f9c12b7`, `5333dd3`.
- 07-28 — **Swup was silently killing post-only component scripts.** Fixed for `LiteYouTube`, `Comments`, `BackToTop`. **`tag-keywords.json` remapped 99 → 69** and its substring false positives fixed (`ork` was matching "work" 903 times across 77% of the corpus). **Tagging switched to a manual prompt** (`scripts/lib/prompt-tags.js`); keywords only prefill, retired tags rejected with what they became, and the prompt can never block a build. `auto-tag-posts.js` deleted. **Draft posts were public and in the sitemap** — `getStaticPaths` lacked the draft filter every other collection had; fixed, demo post + two orphaned components deleted. Deploys: `43c5e8f`, `e1811b9`, `286cb82`.
- 07-22 (cont.) — Tag taxonomy collapsed 304 → 69 (1,445 uses → 996, 258 posts changed), registry 99 → 69 and 1:1 with the corpus, 474 explicit redirects for 237 retired tag pages + RSS feeds. Fixed a pre-existing bug where the `brand` category never rendered on `/tags` or `/explore`. Added the DWARF news post. Deploys: `08f351e`, `e4e35b7`.
- 07-22 — Description pass 269/269. Two long transcripts polished and retitled. Back-catalogue ASR sweep: 3 new normalize entries → 20 fixes across 13 files; 12 raw-dump meta descriptions rebuilt; two real gaps fixed in `lib/excerpt.js`.
- 07-21 (pm/evening) — GEO output built, deployed, verified live (`17ce0c7`). Found transcripts never reach the site from Netlify builds (YouTube blocks datacenter IPs; silent for six weeks). Created `_system/RECURRING.md`.

## Open questions
- **`SESSION_LOG.md` is at 48KB** — compact per `_system/PLAYBOOK.md` §8 next session, before it crosses the ~50KB line.
- **The Wave 2 post tells readers to ignore the "BETA 1.1" button label** on orcthebrand.com. If Orc the Brand fixes their copy, delete that line.
- **Is `vlogs/monster-friends-energy-counter` meant to stay drafted?** It was publicly readable until the 07-28 fix and is now a 404. If it should be live, clear `draft: true` rather than reverting the filter.
- **Normalize the 192 timezone-less `pubDate` values?** They read `"YYYY-MM-DD HH:MM:SS"`, which JS parses as *local* time, so those posts resolve to a different instant on Netlify (UTC) than locally, shifting ordering in RSS, the blog index, and GEO outputs. Legacy data, not a live regression. Cosmetic-only.
- **Directory entries for DWARF / Tavern Lore?** Deferred by Matt 07-22. Worth revisiting after the play-through, since `solo-rpg` is now the third-biggest tag.
- Thirteen tag redirects point at the index because they were too ambiguous to place (`showcase`, `tools`, `maps`, `rahara`, …). Refinable any time; one line each in `public/_redirects`.
- Eight redirect mappings were inference, not from Matt's guide (`metallic`→`metallics`, `tufts`→`basing`, `mdf`/`heat-gun`/`led-lights`→`terrain`, `modeling-compound`→`sculpting`, `one-ring`→`ttrpg`, `thyra`→`warmachine`). Worth a glance.
- A few regenerated meta descriptions are thin where the transcript opens weakly (`rambling-about-competitive-vs-fun-games`, `coffee-cup`). Hand-written blurbs would beat auto-generated.
- Should `/llms.txt` be linked from the site (footer, or `<link rel="alternate">`)? Discovery is crawler-side only.
- Delete the now-unused `descriptions/` corpus (232 files) and `descriptions_pushed.json`? Both gitignored, both dead.
- Worth a transcript proxy so Netlify can fetch captions itself? (Deferred on cost/complexity.)
- Tagline alternatives? Newsletter provider? Moderation alerting approach?
