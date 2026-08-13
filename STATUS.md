# STATUS — The Hobbinomicon · updated 2026-08-13

## Now
Live on Astro 6 (README still says Astro 5 — stale). v2 baseline shipped: three-entity directory, format-based game URLs, News pillar, SEO/perf pass, search improvements, GEO output (`/llms.txt`, `/llms-full.txt`, `.md` renderings). YouTube description pass 269/269. Tag taxonomy 69, registry 1:1 with the corpus. Funnel mechanic v1 live on all 10 published games (Warmachine off via `hideFunnel`).

**`main` is at `f2391f2`; `dev` at `8ba7eba`; branches not diverged.** One build today, carrying a small content change: the footer's AI-disclosure link and the page it lands on now both read **"100% Human Made Content & Art"** — same `/ai-disclosure/` URL, promise-first framing instead of caveat-first. `LegalPageLayout` gained an optional `titleSize` prop so the longer title doesn't resize the other legal pages.

Still true: **transcripts only reach the live site from a local sync** — YouTube blocks caption fetches from Netlify's IPs, so `npm run refresh-vlogs` is load-bearing (see `_system/RECURRING.md`).

## Next (ranked)
1. **Funnel backfill (editorial).** Mechanic is done; only hand-picked `relatedGames` remain. **TSPN** wants it most — only narrative-format entry, so all three of its suggestions read just "Solo-friendly". Warmachine needs either peer large-scale-army entries or hand-picked picks before `hideFunnel` comes off.
3. **Act on the channel strategy** — near-term items are the Warmachine launch stream, the `@mattglbrt` handle switch, and standing up the Reels cadence on `@hobbinomicon`. None are code in this repo.
4. **Hero images for the Gloam and DWARF news posts.** Both run without one. No-AI-art rule applies: Matt's own photo, or ask the creators for permission.
5. Newsletter: pick provider (Buttondown/ConvertKit/DIY — coordinate with AITD), cadence, archive page. Form is wired, engine missing.
6. Monster Friends project entry + backfill `project:` on posts.
7. **Port the GEO pattern to mattglbrt.com** (AITD done 07-22).
8. One-minute browser click-through covering both the 07-31 progress bar fix and today's disclosure page (homepage → click a post → scroll; images should lightbox). Both verified structurally, neither in a browser.

**Note:** `npm run refresh-vlogs` stays off this list until Matt posts a video — sync skips videos that already have a file. Its return will be the first real exercise of the manual tag prompt.

## Blockers
- Matt: wave-3 game one-liners (10 games) + wave-1 game-page inputs; MESBG tier call; The One Ring page-split call.
- Comments moderation has no pending-notification (manual D1 SQL checks only).
- YouTube OAuth needs re-auth roughly weekly before *write* API work. Reads (stats, catalogue) need only the API key. Staying unverified/local-only is a closed decision (07-21).

## Recently done
- 08-13 — **AI disclosure reframed and deployed** (`8ba7eba` → `f2391f2`). Footer link + page `<h1>`/`<title>` now say "100% Human Made Content & Art"; URL unchanged, and the footer was the only link to that page in the repo. Added `titleSize` to `LegalPageLayout` (defaults to the old classes) plus `text-balance`, so the other legal pages render identically — checked in `dist/`. Fixed two typos in the page copy. **`npx astro build` bypasses the npm `prebuild` hook**, which is the cheap way to verify presentation changes without firing the YouTube sync. The merge also carried the 08-11 wrap commits that were still sitting on dev.
- 08-11 — **Funnel mechanic v1 built, merged, deployed** (`df70292` → `864effa`). Scoring in `src/utils/funnel.ts`: structured fields (`format`/`solo`/`miniatureAgnostic`/tier/cost band) plus IDF-weighted shared tags **capped at 3**, because game tags are ad-hoc and a shared `fantasy` sits on half the directory. Below score 3 nothing renders. Editorial picks always win; OOP games are excluded as suggestions but still receive a funnel. **STATUS had this wrong** — rendering already existed as a sidebar list and had never appeared because no game has `relatedGames`. Added `hideFunnel` to the schema, set on Warmachine. **Also corrected a wrong call of mine**: I reported most games lack card images off a dev-server screenshot; nine of eleven have a `heroImage` and all render fine on a built site — lazy-loading caught mid-load. Documented, along with `astro preview` not working with the Netlify adapter.
- 08-11 — **YouTube catalogue analysed** (271 videos, 33,044 views, median 38). Top-20s by views/likes/comments overlap on only 4 videos. Findings: the solo RPG kit video is 10% of all channel views; complete framings beat installments 40×; Shorts are reach without engagement; 20–45 min has the best like rate. Produced a three-channel strategy and a revised mattglbrt.com scope — cross-venture, outside this repo.
- 07-31 — **Reading progress bar fixed**, closing the 07-28 Swup class. The script was written swap-safe and it didn't matter: living inside `#swup` meant it never executed at all on a clicked-to post. A second bug rode along — the same block tagged post images for the lightbox, so clicked-to posts had un-clickable images. Swept all 455 built pages. Deploys: `947994f`, `f9c12b7`, `5333dd3`.
- 07-28 — **Swup was silently killing post-only component scripts** (`LiteYouTube`, `Comments`, `BackToTop`). `tag-keywords.json` remapped 99 → 69 and substring false positives fixed (`ork` matched "work" 903 times). **Tagging switched to a manual prompt**; `auto-tag-posts.js` deleted. **Draft posts were public and in the sitemap** — `getStaticPaths` lacked the draft filter; fixed.

## Open questions
- **Yellow Imp disclosure line: dropped 08-13, and here's the trigger that would revive it.** Proposed 08-11 on the theory that reviewing games while selling minis to their players is a conflict. Checked: Yellow Imp's `game_compatibility` is Hobgoblin / Greathelm / One Page Rules, none of which the directory reviews, and it publishes none of these games. No overlap, so no disclosure. It becomes real only if Yellow Imp stocks product tied to a reviewed game, or a reviewed publisher becomes a supplier or sponsor. **Separate and more likely: free review copies from studios** — that's a material connection to the thing being reviewed, and it's Matt's call whether any have arrived.
- **Funnel: is a score threshold of 3 right?** It holds for a 10-game corpus. As the directory grows the IDF weights shift and the cap may want revisiting.
- **Does the longer footer label wrap awkwardly on mobile?** "100% Human Made Content & Art" is much longer than its Info-column neighbours. Shortening to "100% Human Made" or pulling it onto its own footer line are both one-liners if it reads badly.
- **Publish commission price ranges on mattglbrt.com, or stay quote-only?** Recommended: publish. One config value either way. (Not this repo, but it's the open decision from the 08-11 scope work.)
- **The Wave 2 post tells readers to ignore the "BETA 1.1" button label** on orcthebrand.com. If Orc the Brand fixes their copy, delete that line.
- **Is `vlogs/monster-friends-energy-counter` meant to stay drafted?** Publicly readable until the 07-28 fix, now a 404. If it should be live, clear `draft: true`.
- **Normalize the 192 timezone-less `pubDate` values?** They parse as *local* time, so those posts resolve to a different instant on Netlify (UTC) than locally, shifting RSS and index ordering. Legacy data, cosmetic-only.
- **Directory entries for DWARF / Tavern Lore?** Deferred by Matt 07-22. `solo-rpg` is the third-biggest tag.
- Thirteen tag redirects point at the index because they were too ambiguous to place (`showcase`, `tools`, `maps`, `rahara`, …). One line each in `public/_redirects`.
- Eight redirect mappings were inference, not from Matt's guide (`metallic`→`metallics`, `tufts`→`basing`, `mdf`/`heat-gun`/`led-lights`→`terrain`, `one-ring`→`ttrpg`, `thyra`→`warmachine`). Worth a glance.
- Should `/llms.txt` be linked from the site (footer, or `<link rel="alternate">`)? Discovery is crawler-side only.
- Delete the now-unused `descriptions/` corpus (232 files) and `descriptions_pushed.json`? Both gitignored, both dead.
- Worth a transcript proxy so Netlify can fetch captions itself? (Deferred on cost/complexity.)
