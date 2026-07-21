# Session Log — The Hobbinomicon

Append-only. **Newest entry first.** Pre-existing planning history lives in `roadmap/*.md` (status legend `[x]/[~]/[ ]/[?]/[-]`).

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
