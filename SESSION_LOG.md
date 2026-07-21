# Session Log — The Hobbinomicon

Append-only. **Newest entry first.** Pre-existing planning history lives in `roadmap/*.md` (status legend `[x]/[~]/[ ]/[?]/[-]`).

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
