# STATUS — The Hobbinomicon · updated 2026-08-11

## Now
Live on Astro 6 (README still says Astro 5 — stale). v2 baseline shipped: three-entity directory, format-based game URLs, News pillar, SEO/perf pass, search improvements, GEO output (`/llms.txt`, `/llms-full.txt`, `.md` renderings). YouTube description pass 269/269. Tag taxonomy 69, registry 1:1 with the corpus.

**`main` is at `864effa`; `dev` at `df70292`; branches not diverged.** One build today. **Funnel mechanic v1 is live** — a full-width "If you like X, try" card section on every game page, fed by editorial `relatedGames` first and a scorer second, so all 10 published games get suggestions without an editorial pass. Warmachine is switched off via `hideFunnel: true` (only large-scale-army entry, so scoring has no format peer).

Second half of the session was analysis, not code: **271 videos pulled from the YouTube API** and turned into a cross-platform channel strategy plus a revised build scope for mattglbrt.com. Both live as artifacts and as markdown on the Desktop (see SESSION_LOG). No repo changes from that half.

Still true: **transcripts only reach the live site from a local sync** — YouTube blocks caption fetches from Netlify's IPs, so `npm run refresh-vlogs` is load-bearing (see `_system/RECURRING.md`).

## Next (ranked)
1. **Funnel backfill (editorial).** Mechanic is done; only hand-picked `relatedGames` remain. **TSPN** wants it most — only narrative-format entry, so all three of its suggestions read just "Solo-friendly". Warmachine needs either peer large-scale-army entries or hand-picked picks before `hideFunnel` comes off.
2. **Act on the channel strategy** — near-term items are the Warmachine launch stream, the `@mattglbrt` handle switch, and standing up the Reels cadence on `@hobbinomicon`. None are code in this repo.
3. **Add the Yellow Imp disclosure line** wherever the directory renders a `verdict`, before the store goes live (go-live is Aug 18). Cheap now, expensive to retrofit.
4. **Hero images for the Gloam and DWARF news posts.** Both run without one. No-AI-art rule applies: Matt's own photo, or ask the creators for permission.
5. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form is wired, engine missing.
6. Monster Friends project entry + backfill `project:` on posts.
7. **Port the GEO pattern to mattglbrt.com** (AITD done 07-22).
8. One-minute browser click-through on the 07-31 progress bar fix (homepage → click a post → scroll; images should lightbox). Verified structurally, not in a browser.

**Note:** `npm run refresh-vlogs` stays off this list until Matt posts a video — sync skips videos that already have a file. Its return will be the first real exercise of the manual tag prompt.

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL checks only).
- YouTube OAuth needs re-auth roughly weekly before *write* API work. Reads (stats, catalogue) need only the API key. Staying unverified/local-only is a closed decision (07-21).

## Recently done
- 08-11 — **Funnel mechanic v1 built, merged, deployed** (`df70292` → `864effa`). Scoring in `src/utils/funnel.ts`: structured fields (`format`/`solo`/`miniatureAgnostic`/tier/cost band) plus IDF-weighted shared tags **capped at 3**, because game tags are ad-hoc and a shared `fantasy` sits on half the directory. Below score 3 nothing renders. Editorial picks always win; OOP games are excluded as suggestions but still receive a funnel. **STATUS had this wrong** — rendering already existed as a sidebar list and had never appeared because no game has `relatedGames`. Added `hideFunnel` to the schema, set on Warmachine. **Also corrected a wrong call of mine**: I reported most games lack card images off a dev-server screenshot; nine of eleven have a `heroImage` and all render fine on a built site — lazy-loading caught mid-load. Documented, along with `astro preview` not working with the Netlify adapter.
- 08-11 — **YouTube catalogue analysed** (271 videos, 33,044 views, median 38). Top-20s by views/likes/comments overlap on only 4 videos. Findings: the solo RPG kit video is 10% of all channel views; complete framings beat installments 40×; Shorts are reach without engagement; 20–45 min has the best like rate. Produced a three-channel strategy and a revised mattglbrt.com scope — cross-venture, outside this repo.
- 07-31 — **Reading progress bar fixed**, closing the 07-28 Swup class. The script was written swap-safe and it didn't matter: living inside `#swup` meant it never executed at all on a clicked-to post. A second bug rode along — the same block tagged post images for the lightbox, so clicked-to posts had un-clickable images. Swept all 455 built pages. `.claude/commands/` untracked and ignored. Wave 2 news post updated for rulebook v1.3, verified against the live PDFs. Deploys: `947994f`, `f9c12b7`, `5333dd3`.
- 07-28 — **Swup was silently killing post-only component scripts** (`LiteYouTube`, `Comments`, `BackToTop`). `tag-keywords.json` remapped 99 → 69 and substring false positives fixed (`ork` matched "work" 903 times). **Tagging switched to a manual prompt**; `auto-tag-posts.js` deleted. **Draft posts were public and in the sitemap** — `getStaticPaths` lacked the draft filter; fixed.
- 07-22 (cont.) — Tag taxonomy collapsed 304 → 69, registry 1:1, 474 redirects for 237 retired tag pages. Fixed the `brand` category never rendering on `/tags` or `/explore`.

## Open questions
- **Funnel: is a score threshold of 3 right?** It holds for a 10-game corpus. As the directory grows the IDF weights shift and the cap may want revisiting.
- **Publish commission price ranges on mattglbrt.com, or stay quote-only?** Recommended: publish. One config value either way. (Not this repo, but it's the open decision from today's scope work.)
- **The Wave 2 post tells readers to ignore the "BETA 1.1" button label** on orcthebrand.com. If Orc the Brand fixes their copy, delete that line.
- **Is `vlogs/monster-friends-energy-counter` meant to stay drafted?** Publicly readable until the 07-28 fix, now a 404. If it should be live, clear `draft: true`.
- **Normalize the 192 timezone-less `pubDate` values?** They parse as *local* time, so those posts resolve to a different instant on Netlify (UTC) than locally, shifting RSS and index ordering. Legacy data, cosmetic-only.
- **Directory entries for DWARF / Tavern Lore?** Deferred by Matt 07-22. `solo-rpg` is the third-biggest tag. (The play-through write-up is off the board — Matt posts it when he does it.)
- Thirteen tag redirects point at the index because they were too ambiguous to place (`showcase`, `tools`, `maps`, `rahara`, …). One line each in `public/_redirects`.
- Eight redirect mappings were inference, not from Matt's guide (`metallic`→`metallics`, `tufts`→`basing`, `mdf`/`heat-gun`/`led-lights`→`terrain`, `one-ring`→`ttrpg`, `thyra`→`warmachine`). Worth a glance.
- Should `/llms.txt` be linked from the site (footer, or `<link rel="alternate">`)? Discovery is crawler-side only.
- Delete the now-unused `descriptions/` corpus (232 files) and `descriptions_pushed.json`? Both gitignored, both dead.
- Worth a transcript proxy so Netlify can fetch captions itself? (Deferred on cost/complexity.)
