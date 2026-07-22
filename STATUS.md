# STATUS — The Hobbinomicon · updated 2026-07-22

## Now
Live on Astro 6 (README still says Astro 5 — stale). v2 baseline shipped: three-entity directory, format-based game URLs, News pillar, SEO/perf pass, search improvements, GEO output (`/llms.txt`, `/llms-full.txt`, `.md` renderings). **YouTube description footer pass done: 269/269.** **Tag taxonomy collapsed 304 → 69** with 474 redirects covering every retired URL, and the registry is now 1:1 with the corpus.

**`main` is at `e4e35b7`. `dev` is in sync — everything is deployed.** Two builds today. **Transcripts only reach the live site from a local sync** — YouTube blocks caption fetches from Netlify's IPs, so `npm run refresh-vlogs` weekly is load-bearing (see `_system/RECURRING.md`).

## Next (ranked)
1. **Remap `src/data/tag-keywords.json` to the new 69 tags.** It still has 99 auto-tag targets, **45 of them retired** (`vlog`, `goblins`, `orcs`, `zenithal`, `tips`, `conversion`, …), and 15 live tags have no rule at all. The next vlog sync starts putting dead tags back. This is the "junk regrows daily" problem from `roadmap/tags.md`, now urgent — today's cleanup decays without it.
2. **Hero images for the Gloam and DWARF news posts.** Both currently run without one. The no-AI-art rule applies, so this is Matt's own photo (a printout, a play session, dice on a table) or asking the creators for permission to use their key art. Ask-the-creator is the cleaner route and also opens a contact.
3. **DWARF play-through write-up** — the news post promises it "this week," so it has a clock on it.
4. **Weekly `npm run refresh-vlogs`** — last sync 07-21. Do this *after* item 1, or it re-seeds retired tags.
5. **Funnel mechanic v1** ("if you like X, try Y") — biggest visible gap from the v2 vision; schema ready, rendering + tag-fallback + backfill not. The clean 69-tag taxonomy makes the tag-fallback much more tractable than it was.
6. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form is wired, engine missing.
7. Monster Friends project entry + backfill `project:` on posts.
8. **Port the GEO pattern to mattglbrt.com** (AITD done 07-22).

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL checks only).
- YouTube OAuth needs re-auth roughly weekly before API work. Staying unverified/local-only is a closed decision (07-21).

## Recently done
- 07-22 (cont.) — **Tag taxonomy collapsed 304 → 69** (1,445 uses → 996, 258 posts changed) from Matt's cleaned matrix, validated against his guide before and after applying. Registry 99 → 69, now exactly 1:1 with the corpus. **474 redirects** for 237 retired tag pages + RSS feeds, explicit rather than a catch-all so live pages can't be shadowed or prefix-collided. Fixed a pre-existing bug where the `brand` category never rendered on `/tags` or `/explore`. Added the DWARF news post. Two deploys: `08f351e`, `e4e35b7`.
- 07-22 — Description pass finished 269/269. Two long transcripts polished to `voice.md` §3 and retitled (`## Transcript` heading dropped, since the text is no longer verbatim). Back-catalogue sweep: 3 new `transcript-normalize.json` entries → 20 fixes across 13 files; 12 raw-dump meta descriptions rebuilt; two real gaps fixed in `lib/excerpt.js`. `excerpt.js` itself was never broken — it postdates the affected posts by 24 minutes.
- 07-21 (evening) — GEO output built, deployed, verified live. Surfaced the pubDate timezone bug and a sort-tie fix (`17ce0c7`).
- 07-21 (pm) — Found transcripts never reach the site from Netlify builds (YouTube blocks datacenter IPs; silent for six weeks). Created `_system/RECURRING.md`.
- 07-08 — full tag audit. 06-09 — first tag normalization pass (`466ed2f`).

## Open questions
- **Normalize the 192 timezone-less `pubDate` values?** They read `"YYYY-MM-DD HH:MM:SS"`, which JS parses as *local* time, so those posts resolve to a different instant on Netlify (UTC) than locally, shifting ordering in RSS, the blog index, and GEO outputs. Legacy data, not a live regression. Cosmetic-only impact.
- **Directory entries for DWARF / Tavern Lore?** Deferred by Matt 07-22. Worth revisiting after the play-through, since `solo-rpg` is now the third-biggest tag.
- Thirteen tag redirects point at the index because they were too ambiguous to place (`showcase`, `tools`, `maps`, `rahara`, …). Refinable any time; one line each in `public/_redirects`.
- Eight redirect mappings were my inference, not from Matt's guide (`metallic`→`metallics`, `tufts`→`basing`, `mdf`/`heat-gun`/`led-lights`→`terrain`, `modeling-compound`→`sculpting`, `one-ring`→`ttrpg`, `thyra`→`warmachine`). Worth a glance.
- A few regenerated meta descriptions are thin where the transcript opens weakly (`rambling-about-competitive-vs-fun-games`, `coffee-cup`). Hand-written blurbs would beat auto-generated.
- Should `/llms.txt` be linked from the site (footer, or `<link rel="alternate">`)? Discovery is crawler-side only.
- Delete the now-unused `descriptions/` corpus (232 files) and `descriptions_pushed.json`? Both gitignored, both dead.
- Worth a transcript proxy so Netlify can fetch captions itself? (Deferred on cost/complexity.)
- Tagline alternatives? Newsletter provider? Moderation alerting approach?
