# The Hobbinomicon — Site Review & Rebuild Strategy

*Prepared 2026-08-26. Inputs: full crawl of hobbinomicon.com (sitemap-0.xml, 431 URLs), the Astro repo (schema, roadmap, STATUS, CLAUDE.md, voice.md), and a per-post inventory of all 288 blog entries.*

---

## 1. The one-paragraph verdict

You don't need a rebuild. You need a **re-architecture** — and the Search Console data says exactly where the money is. The data model under the site (games/studios/people/news, the funnel scorer, JSON-LD, GEO output, Pagefind) is stronger than 95% of hobby sites. What's broken is the *surface*: the site still presents as a personal blog with a directory bolted on, five overlapping browse surfaces (`/blog`, `/videos`, `/categories`, `/tags`, `/explore`) fight each other, and 288 posts sit at one URL depth in one template whether they're a 2,000-word tutorial or a daily mail-day. Fix the information architecture, promote ~95 posts into a proper `guides` collection, keep the other ~160 live and indexed as a structured `/vlog/` archive, add two mainstream on-ramp hubs (Warmachine now, Spearhead built and waiting), fix the 148 legacy URLs Google is still showing that currently 404, and every existing URL 301s cleanly. Nothing is removed from the index; you gain a site with one job.

## 2. What the site is *for* (positioning)

**Current, stated:** "part journal, part personal hobby log, part indie game directory and discovery platform." That's three sites. A visitor arriving from Google on "how to paint trench pilgrims" has no idea the directory exists; a visitor on `/games/relicblade/` has no idea there are 38 painting tutorials.

**Recommended positioning (one line, put it in the hero and the `<title>`):**

> **The Hobbinomicon — find your next indie wargame, then learn to paint it.**

Two verbs, one funnel. *Find* = the directory (games, news, studios, people). *Learn* = the guides (painting, terrain, basing, how-to-start). Everything else on the site is either feeder content (vlogs, series) or supporting infrastructure (about, newsletter, BST).

**The funnel, stated as strategy:**

```
Mainstream hobbyist searches "how to paint Warmachine Cygnar" / "Spearhead Stormcast paint scheme"
      → lands on a Warmachine / Spearhead guide (on-ramp hub)
      → sees "If you paint this, you'll love painting…" → Trench Crusade / Relicblade / Motley Crews
      → game page: Hobbinomicon take + how to start + guides + news
      → subscribes to YouTube (tutorial series for that game) / newsletter (news for that game)
      → later: buys your minis
```

Warmachine and Spearhead are not the destination — they are the **top of the funnel**. Design them as hubs that always point sideways into the indie directory. This is what you told me, and it's the right call: it's how you rank for terms with real search volume while the indie pages, which have almost none, earn traffic through internal links and YouTube.


## 2a. What Search Console says (16 months, 1,244 clicks / 27,856 impressions)

| Section | Clicks | Share | Pages | Read |
|---|---|---|---|---|
| `/games/*` | 752 | **60%** | 25 | The directory *is* the site. `/games/motley-crews/` alone = 431 clicks (35% of everything), position 4.2. |
| `/blog/vlogs/*` | 204 | 16% | 253 | Every vlog with clicks is a how-to, review, or "how to start" — exactly the promote-to-guide set. |
| `/blog/articles/*` | 129 | 10% | 5 | **One** evergreen list (painting competitions 2026) = 128 clicks. Lists work for you. |
| `/blog/resources/*` (Mage Knight) | 60 | 5% | 25 | Long-tail archive content ranks. Two of the five top resource URLs are now 404 (deleted in the May demolition). |
| `/people/*` | 44 | 4% | 8 | Tanner Simpson's page = 44 clicks. Entity pages rank; give them more. |
| everything else | 55 | 5% | | |

Other signals: mobile CTR (6.2%) is double desktop (3.3%) — the phone experience is the one to design for. Video rich results: 184 impressions, 0 clicks, position 28 — `VideoObject` schema is the fix. Top queries are all game names ("motley crews", "wanted reward cc 10000", "kal arath", "omen tide", "monster friends") plus "painting competitions 2026" — brand-name intent for indie games, which nobody else is serving.

**Three data-backed conclusions**

1. **Game pages are the product.** Every new game entry is worth more than ten videos. The 10-game directory should be 40+ within a year; the `games.md` roadmap already has the intake template.
2. **Evergreen lists are your second engine.** "Online painting competitions 2026" should become a family: *Indie wargame Kickstarters this month*, *Free skirmish rulesets*, *Mini-agnostic games you can play with what you own*, *Solo wargames*. Each is a `/articles/` page updated on a schedule.
3. **148 URLs in GSC currently 404** — mostly from the May demolition (`/blog/resources/`, `/blog/campaigns/`, `/blog/characters/`) and the WordPress-era site (`/getting-good-warmachine-the-lists/`, `/orcs-goblins/`). Two of them had clicks *this quarter*. Redirect all of them (`url-map-legacy-404s.csv`); restore the resource pages from git commit `48d6f7c` since the content already exists.

## 3. Review findings

### 3.1 Marketing / positioning

| Finding | Impact | Fix |
|---|---|---|
| Hero tagline "Hobbying from the deep end of the dungeon" is personality, not a promise. It doesn't say what the site does. | Bounce from cold search traffic | Lead with the value line above; keep the dungeon line as the sub-line. |
| `/about` says "I'm not chasing a big audience." Charming on a personal blog, self-defeating on a directory you want sponsors for. | Weakens sponsor/affiliate pitch | Reframe: "built by one hobbyist, for the games the big publishers ignore." Same honesty, outward-facing. |
| The newsletter is pitched as "what I'm painting" — a personal log — while the site is pitched as a news desk. Mismatched offer. | Low signup rate | One newsletter, one promise: *"New indie wargames, Kickstarters worth backing, and one painting guide — every two weeks."* |
| No affiliate/sponsor surface exists. Game pages have `storeUrl` but no disclosure block, no "Get it" CTA styling, no sponsor slot. | $0 | Add a `GetItCard` component (official store / Kickstarter / MyMiniFactory) with disclosure; add one "Featured studio" sponsor slot on `/games/` and `/news/`. |
| Your future minis company has no seed on the site. | No audience warm-up | Add a `/studios/the-hobbinomicon/` entry when ready; in the meantime a "Coming from the dungeon" teaser on About and the newsletter. |

### 3.2 Information architecture / UX

| Finding | Impact | Fix |
|---|---|---|
| **Five browse surfaces** for the same posts: `/blog`, `/videos`, `/categories/*`, `/tags`, `/explore`. Explore alone lists 262 "Videos", 17 "Articles", 9 "Vlogs" — a category system that doesn't match the URL system (`/blog/vlogs/…` are categorised "Videos"). | Confusion, duplicate crawl paths, diluted PageRank | Collapse to **three** content surfaces: `/games/` (directory), `/guides/` (learn), `/vlog/` (archive). Delete `/explore`, `/categories/*`, `/blog/*` listings. Tags stay as a filter, not a destination. |
| Game categories are inconsistent: nav says "Rank & Flank" and "Large Army"; directory says "Large Scale Army" (Warmachine only) *and* "Mass Battle" (empty) *and* "Rank and Flank — coming soon". Schema has both `large-scale-army` and `mass-battle`. | Empty shelves; taxonomy drift flagged in your own roadmap | Merge into one format: `army` ("Army-scale"). Six formats total: skirmish, army, narrative, ttrpg, boardgame, (solo as cross-cut), graveyard as status. |
| `/videos/` is a *playlist view* (9 series) and `/videos/archive/` is the *raw feed* — but `/blog/` is also the raw feed. | Two archives | `/videos/*` becomes `/guides/{topic}/` and `/series/{name}/`; `/videos/archive/*` becomes `/vlog/`. |
| Guides are indistinguishable from diary entries. "How to Paint Trench Crusade Communicant" sits at the same URL depth and template as a daily mail-day post. | Google and readers can't tell a tutorial from a diary entry | Separate collection (`guides`) with a template that has a recipe card, steps, materials, and a game reference. |
| Game pages are excellent but their guides are surfaced as "Builds & Series" — a list of dated video titles. | Reader doesn't see "9 painting guides for this game" | Group by intent on the game page: **Start here** · **Painting guides** · **Terrain & basing** · **Battle reports / series** · **News**. |
| Mage Knight archive (13 guides, real long-tail value) lives at `/blog/resources/mageknight-*` with no link to `/games/mage-knight/`. | Orphaned authority | Nest under the game: `/games/mage-knight/{guide}/` and link both ways. |
| Tag pages: 69 live; 121 tag URLs in GSC earned 13 clicks total. | Low-value crawl paths | Keep them all live and indexed (your call), but demote them: footer link only, and give each tag page an intro line so it's a page, not a list. |
| People/Studios are 200-word stubs with no inbound links from guides or news. | Dead-end entity pages | Keep them (they're good for GEO/entity SEO) but auto-render "Games · News · Guides mentioning" sections so they're hubs, not stubs. |

### 3.3 SEO / technical

What's already right: static output, trailing-slash canonicals, per-entity JSON-LD, `llms.txt`, inlined CSS, Lighthouse high-90s, sitemap with lastmod, explicit tag redirects. Don't touch any of that.

| Finding | Fix |
|---|---|
| ~160 vlog posts stay indexed at `/vlog/`. Decision: **nothing gets noindexed** — every page keeps its transcript and post. | Give the vlog template structure so each one carries more than the embed: intro paragraph (exists), "Project / game" links, "Guides for this" block, prev/next in series, `VideoObject` schema. About 120 of them have intros under 80 words — a slow, ongoing polish job, not a launch blocker. |
| Titles are the YouTube titles ("Lobster Kisses", "WTF is a Rectifier"). Fine for YouTube, useless as `<title>`. | Guides get a search-intent title (`How to Paint Trench Crusade Pilgrims Fast (20-minute method)`); the YouTube title stays as `videoTitle` in frontmatter. |
| Transcript is the body. Transcripts are fine as *supplementary* content but as the *only* content they read as auto-generated. | Guides: written steps first, transcript collapsed in a `<details>` at the bottom (you already have `rehypeTranscriptWeight` — keep it). |
| `og:image` serves full-size originals (your STATUS notes 1.1 MB). | `getImage()` 1200×630 variant. |
| No `VideoObject` schema on guide pages, no `HowTo` schema. | Add both to the guide template — this is the single biggest rich-result win available to you. |
| No `BreadcrumbList`. | Add to every template; cheap and it clarifies the new hierarchy to Google. |

### 3.4 Growth / business

* **YouTube → site → YouTube loop is missing.** Every guide should end with "Watch the full series → [channel/playlist]" and every YouTube description should link to the guide URL (you already have `update-descriptions.cjs` — point it at the new `/guides/` URLs after migration).
* **Newsletter has no engine** (roadmap item 6). Pick Buttondown (cheapest, has an API, RSS-to-email, archive page you can embed). Ship it in the rebuild; the archive page becomes `/newsletter/`.
* **Affiliate:** MyMiniFactory, Amazon (paints/tools in every guide's materials list), Kickstarter (no program, but backer-link tracking exists), and direct affiliate deals with the indie studios you already profile — those are the ones that'll say yes. Materials list on every guide = the most natural affiliate surface in the hobby.
* **Sponsorship:** once `/games/` is the clean directory, "Featured game of the month" is sellable to indie studios at $50–150/mo. Don't sell it until you have GSC data to show.
* **Own-minis launchpad:** the `studios` collection already supports it. The audience is built by the guides, not the directory.

## 4. Decisions locked in this workup

1. Scope: **indie miniature wargames + solo/skirmish**. TTRPGs stay as a secondary format (Kal Arath, Dolmenwood content exists) but are not the pitch.
2. Vlogs: **promote ~95 to guides, ~160 stay as indexed `/vlog/` posts, ~19 become series episodes**. No noindex anywhere. See `url-map-posts.csv`.
3. Warmachine gets its **on-ramp hub** now. The Spearhead hub is **built on the same template and kept `draft: true`** until the first Spearhead videos exist (no content yet). 40k/Old World content files under the Warhammer/Spearhead hub as "Also painting".
4. Goals for 12 months: search → YouTube subs; newsletter list; affiliate/sponsor; audience for the minis company.
5. Not a rewrite. Astro 6 + Netlify + existing collections stay. Work happens on `dev`, one merge to `main` per phase.

## 5. Success metrics (set these up before you ship)

| Metric | Baseline (get from GSC/GA now) | 90-day target |
|---|---|---|
| Indexed pages (GSC Coverage) | 431 | ~450 (restored resources + new guides/series pages) |
| Impressions on `/guides/*` | — | +40% vs same posts at old URLs |
| Clicks → YouTube (outbound event) | — | measurable; 5% of guide sessions |
| Newsletter signups / week | ~0 | 10 |
| Game-page → second game-page (funnel click-through) | — | 15% |
| 404s in Netlify analytics after migration | 148 legacy URLs in GSC | 0 from old sitemap + GSC URLs |
| Games in directory | 11 | 25 |
