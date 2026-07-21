/**
 * Shared helpers for the GEO build outputs: the `.md` endpoints, /llms.txt,
 * and /llms-full.txt.
 *
 * These render from the *raw* MDX body rather than Astro's rendered HTML, so
 * the output stays real markdown. The only transformation is mechanical:
 * strip the MDX scaffolding (imports, JSX) and convert the handful of
 * components that carry citable text into equivalent markdown. No wording is
 * ever changed or invented — same rule as scripts/lib/format-transcript.js.
 */

export const SITE = 'https://hobbinomicon.com';

/** Absolute canonical URL for a site-relative path (trailingSlash: 'always'). */
export function canonical(path: string): string {
  const clean = `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}/`;
  return `${SITE}${clean === '//' ? '/' : clean}`;
}

/**
 * Find the index of the `>` that closes a JSX tag opening at `start`,
 * skipping over quoted attribute values so a `>` inside a description
 * doesn't end the tag early.
 */
function findTagEnd(src: string, start: number): number {
  let quote: string | null = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === '>') {
      return i;
    }
  }
  return -1;
}

/** Pull `key="value"` pairs out of a JSX tag's attribute text. */
function parseProps(attrText: string): Record<string, string> {
  const props: Record<string, string> = {};
  const re = /([A-Za-z][A-Za-z0-9]*)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrText)) !== null) {
    props[m[1]] = m[2];
  }
  return props;
}

/**
 * Components whose props carry text worth keeping, mapped to markdown.
 * Anything not listed here has its tags dropped; children (if any) survive,
 * which is what we want for layout-only wrappers.
 */
const COMPONENT_TO_MARKDOWN: Record<string, (p: Record<string, string>) => string> = {
  YouTubeEmbed: (p) =>
    p.videoId
      ? `[Watch on YouTube${p.title ? `: ${p.title}` : ''}](https://www.youtube.com/watch?v=${p.videoId})`
      : '',
  ResourceSection: (p) => (p.title ? `### ${p.title}` : ''),
  ResourceCard: (p) => {
    if (!p.title) return '';
    const link = p.href ? `[${p.title}](${p.href})` : p.title;
    return p.description ? `- ${link} — ${p.description}` : `- ${link}`;
  },
  // Product/gallery card: the image is dropped, but title, price badge, and
  // subtitle are real content worth keeping.
  ImageCard: (p) => {
    if (!p.title) return '';
    const link = p.href ? `[${p.title}](${p.href})` : p.title;
    return `- ${[link, p.badge, p.subtitle].filter(Boolean).join(' — ')}`;
  },
};

/**
 * Strip MDX scaffolding from a raw body, leaving plain markdown.
 */
export function stripMdx(body: string): string {
  // Drop import statements (all content imports are single-line).
  let out = body.replace(/^import\s+.*$/gm, '');

  let result = '';
  let i = 0;
  while (i < out.length) {
    const lt = out.indexOf('<', i);
    if (lt === -1) {
      result += out.slice(i);
      break;
    }

    const after = out[lt + 1];
    const isClose = after === '/';
    const nameStart = isClose ? lt + 2 : lt + 1;
    const isComponent = /[A-Z]/.test(out[nameStart] ?? '');

    // Not a JSX component tag (plain markdown `<`, HTML, autolink) — pass through.
    if (!isComponent) {
      result += out.slice(i, lt + 1);
      i = lt + 1;
      continue;
    }

    const end = findTagEnd(out, lt);
    if (end === -1) {
      result += out.slice(i);
      break;
    }

    result += out.slice(i, lt);

    if (!isClose) {
      const nameMatch = /^([A-Za-z0-9]+)/.exec(out.slice(nameStart, end));
      const name = nameMatch ? nameMatch[1] : '';
      const attrText = out.slice(nameStart + name.length, end).replace(/\/$/, '');
      const render = COMPONENT_TO_MARKDOWN[name];
      if (render) {
        const md = render(parseProps(attrText));
        if (md) result += `\n\n${md}\n\n`;
      }
    }

    i = end + 1;
  }

  let cleaned = result.replace(/[ \t]+$/gm, '');

  // <div> only ever wraps layout here (grid rows around cards) and means
  // nothing in a markdown export — drop the tags, keep what's inside.
  cleaned = cleaned.replace(/^[ \t]*<\/?div(?:\s[^>]*)?>[ \t]*$/gm, '');

  // Any other wrapper left empty once its JSX children converted out.
  let before: string;
  do {
    before = cleaned;
    cleaned = cleaned.replace(/<(\w+)(?:\s[^>]*)?>\s*<\/\1>/g, '');
  } while (cleaned !== before);

  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Converted components each get their own blank line above and below, which
  // turns a run of ResourceCards into a loose list. Tighten consecutive items.
  let previous: string;
  do {
    previous = cleaned;
    cleaned = cleaned.replace(/^(- .*)\n\n(?=- )/gm, '$1\n');
  } while (cleaned !== previous);

  return cleaned.trim();
}

export interface MarkdownDoc {
  title: string;
  description?: string;
  url: string;
  date?: Date;
  updated?: Date;
  tags?: string[];
  /** Extra frontmatter lines, e.g. `format: skirmish` on a game. */
  extra?: Record<string, string | undefined>;
  body: string;
}

function yamlString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Render a document as markdown with a YAML frontmatter header. */
export function renderMarkdownDoc(doc: MarkdownDoc): string {
  const lines: string[] = ['---'];
  lines.push(`title: ${yamlString(doc.title)}`);
  if (doc.description) lines.push(`description: ${yamlString(doc.description)}`);
  if (doc.date) lines.push(`date: ${isoDate(doc.date)}`);
  if (doc.updated) lines.push(`updated: ${isoDate(doc.updated)}`);
  for (const [key, value] of Object.entries(doc.extra ?? {})) {
    if (value) lines.push(`${key}: ${yamlString(value)}`);
  }
  if (doc.tags?.length) {
    lines.push(`tags: [${doc.tags.map((t) => yamlString(t)).join(', ')}]`);
  }
  lines.push(`canonical: ${doc.url}`);
  lines.push('source: The Hobbinomicon (hobbinomicon.com)');
  lines.push('---', '');
  lines.push(`# ${doc.title}`, '');
  const body = stripMdx(doc.body);
  if (body) lines.push(body, '');
  return lines.join('\n');
}

/** Standard plain-text response for these endpoints. */
export function textResponse(body: string, contentType = 'text/markdown'): Response {
  return new Response(body, {
    headers: { 'Content-Type': `${contentType}; charset=utf-8` },
  });
}
