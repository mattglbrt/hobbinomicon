import type { APIRoute } from 'astro';
import { renderMarkdownDoc, textResponse } from '../utils/markdownExport';
import {
  getGeoContent,
  gameDoc,
  studioDoc,
  personDoc,
  newsDoc,
  postDoc,
  gameUrl,
  studioUrl,
  personUrl,
  newsUrl,
  postUrl,
} from '../utils/geoContent';

/**
 * /llms-full.txt — the site's core citable content concatenated as markdown.
 *
 * Directory entities, News, guides, and articles appear in full. The 250+ daily
 * vlogs appear as title + description + link only; including their transcripts
 * would multiply the file size by roughly an order of magnitude for content a
 * model can fetch per-post at `/blog/vlogs/<slug>.md` when it actually needs it.
 */

const SEP = '\n\n';

/**
 * Bound each document with an HTML comment rather than a `---` rule: every doc
 * opens with a YAML frontmatter fence, so a `---` separator would be
 * indistinguishable from one and split the file wrong.
 */
function doc(markdown: string, url: string): string {
  return `<!-- doc: ${url} -->\n${markdown.trim()}\n<!-- /doc -->`;
}

export const GET: APIRoute = async () => {
  const { games, studios, people, news, resources, articles, vlogs } = await getGeoContent();

  const parts: string[] = [
    [
      '# The Hobbinomicon — full content export',
      '',
      'Indie tabletop wargaming directory (Games, Studios, People), News, guides,',
      'and a daily hobby vlog. Written and produced by Matt Gilbert.',
      'Source: https://hobbinomicon.com',
      `Generated: ${new Date().toISOString().slice(0, 10)}`,
      '',
      'Contains the full text of the directory, News, guides, and articles. Daily',
      'vlogs are listed by title and description only; each vlog’s full transcript',
      'is at its own URL with `.md` appended.',
    ].join('\n'),
  ];

  const heading = (h: string, count: number) => `<!-- section: ${h} (${count}) -->`;

  parts.push(heading('Games', games.length));
  for (const game of games) {
    parts.push(doc(renderMarkdownDoc(await gameDoc(game)), gameUrl(game)));
  }

  parts.push(heading('Studios', studios.length));
  for (const studio of studios) {
    parts.push(doc(renderMarkdownDoc(studioDoc(studio)), studioUrl(studio)));
  }

  parts.push(heading('People', people.length));
  for (const person of people) {
    parts.push(doc(renderMarkdownDoc(await personDoc(person)), personUrl(person)));
  }

  parts.push(heading('News', news.length));
  for (const item of news) {
    parts.push(doc(renderMarkdownDoc(newsDoc(item)), newsUrl(item)));
  }

  parts.push(heading('Guides and resources', resources.length));
  for (const post of resources) {
    parts.push(doc(renderMarkdownDoc(postDoc(post)), postUrl(post)));
  }

  parts.push(heading('Articles', articles.length));
  for (const post of articles) {
    parts.push(doc(renderMarkdownDoc(postDoc(post)), postUrl(post)));
  }

  parts.push(
    [
      heading('Daily vlogs', vlogs.length),
      '',
      `# Daily vlogs`,
      '',
      `${vlogs.length} posts, newest first. Full transcript at each URL with \`.md\` appended.`,
    ].join('\n')
  );
  parts.push(
    vlogs
      .map((p) => {
        const url = postUrl(p).replace(/\/$/, '');
        const date = p.data.pubDate.toISOString().slice(0, 10);
        const desc = p.data.description?.replace(/\s+/g, ' ').trim();
        return `- [${p.data.title}](${url}.md) (${date})${desc ? `: ${desc}` : ''}`;
      })
      .join('\n')
  );

  return textResponse(`${parts.join(SEP)}\n`, 'text/plain');
};
