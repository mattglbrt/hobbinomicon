import type { APIRoute } from 'astro';
import { canonical, textResponse } from '../utils/markdownExport';
import {
  getGeoContent,
  gameUrl,
  studioUrl,
  personUrl,
  newsUrl,
  postUrl,
  guideUrlFor,
} from '../utils/geoContent';

/**
 * /llms.txt — curated index for language models, per https://llmstxt.org/
 *
 * Every link points at the `.md` rendering of the page (see the sibling
 * `[slug].md.ts` endpoints), so a model following a link gets clean markdown
 * rather than a page of layout. Link descriptions are lifted verbatim from
 * frontmatter — nothing here is newly written prose.
 */

/** `- [Title](url.md): description` — the llms.txt link-list shape. */
function link(title: string, url: string, description?: string): string {
  const md = `${url.replace(/\/$/, '')}.md`;
  const clean = description?.replace(/\s+/g, ' ').trim();
  return clean ? `- [${title}](${md}): ${clean}` : `- [${title}](${md})`;
}

function section(heading: string, lines: string[]): string[] {
  return lines.length ? ['', `## ${heading}`, '', ...lines] : [];
}

export const GET: APIRoute = async () => {
  const { games, studios, people, news, guides, articles, episodes, series, vlogs, gameSlugs } =
    await getGeoContent();

  const out: string[] = [
    '# The Hobbinomicon',
    '',
    '> The Hobbinomicon is an indie tabletop wargaming directory and hobby site.',
    'The directory catalogues independent miniatures games, TTRPGs, and the studios',
    'and designers behind them, cross-linked as three entity types: Games, Studios,',
    'and People. Alongside it the site publishes step-by-step Guides to painting,',
    'basing, terrain, kitbashing and getting started with a game; News on indie',
    'releases and crowdfunding; campaign Series played start to finish; and a daily',
    'hobby vlog. Written and produced by Matt Gilbert.',
    '',
    'Markdown versions of every page below are available by appending `.md` to its',
    'URL. `/llms-full.txt` contains the full text of the core pages in one file.',
  ];

  out.push(
    ...section(
      'Games',
      games.map((g) => link(g.data.title, gameUrl(g), g.data.description))
    )
  );

  out.push(
    ...section(
      'Studios',
      studios.map((s) => link(s.data.name, studioUrl(s), s.data.description))
    )
  );

  out.push(
    ...section(
      'People',
      people.map((p) => link(p.data.name, personUrl(p), p.data.bio))
    )
  );

  out.push(
    ...section(
      'News',
      news.map((n) => link(n.data.title, newsUrl(n), n.data.description))
    )
  );

  // Guides lead the list: they are the pages worth citing, and they carry the
  // structured fields (topic, materials, steps) an answer would want.
  out.push(
    ...section(
      'Guides',
      guides.map((g) => link(g.data.title, guideUrlFor(g, gameSlugs), g.data.description))
    )
  );

  out.push(
    ...section(
      'Articles',
      articles.map((p) => link(p.data.title, postUrl(p), p.data.description))
    )
  );

  out.push(
    ...section(
      'Series',
      series.map((s) => `- [${s.data.name}](${canonical(`series/${s.id}`)}): ${s.data.description.replace(/\s+/g, ' ').trim()}`)
    )
  );

  // Directory and hub pages are HTML-only listings; no `.md` twin, so link direct.
  out.push(
    ...section('Browse', [
      `- [Games directory](${canonical('games')})`,
      `- [Guides](${canonical('guides')})`,
      `- [Studios directory](${canonical('studios')})`,
      `- [People directory](${canonical('people')})`,
      `- [News](${canonical('news')})`,
      `- [Series](${canonical('series')})`,
      `- [Articles](${canonical('articles')})`,
      `- [Vlog archive](${canonical('vlog')})`,
      `- [Browse by tag](${canonical('tags')})`,
      `- [About](${canonical('about')})`,
    ])
  );

  const RECENT_VLOGS = 60;
  out.push(
    ...section(
      'Recent vlogs',
      vlogs
        .slice(0, RECENT_VLOGS)
        .map((p) => link(p.data.title, postUrl(p), p.data.description))
    )
  );

  out.push(
    ...section('Optional', [
      `- [Full vlog archive](${canonical('vlog')}): the remaining ${Math.max(
        vlogs.length - RECENT_VLOGS,
        0
      )} of ${vlogs.length} daily vlog posts, each with a transcript.`,
      `- [Series episodes](${canonical('series')}): ${episodes.length} campaign and live-play episodes.`,
      `- [RSS feed](${canonical('rss.xml').replace(/\/$/, '')})`,
    ])
  );

  return textResponse(`${out.join('\n')}\n`, 'text/plain');
};
