/**
 * Rehype plugin: wrap the `## Transcript` section of a post in a container
 * with `data-pagefind-weight`, so transcript chatter counts far less toward
 * Pagefind relevance than authored content. Without this, common hobby terms
 * ("green", "paint", "terrain") rank vlogs by how often a word was *spoken*
 * rather than what the post is about.
 *
 * Transcripts stay in the index — a query that only appears in a transcript
 * still finds the post — they just can't outrank title/description/body hits.
 */

const TRANSCRIPT_WEIGHT = '0.2';

function textOf(node) {
  if (node.type === 'text') return node.value;
  if (!node.children) return '';
  return node.children.map(textOf).join('');
}

export function rehypeTranscriptWeight() {
  return (tree) => {
    const children = tree.children;
    if (!Array.isArray(children)) return;

    const start = children.findIndex(
      (node) =>
        node.type === 'element' &&
        node.tagName === 'h2' &&
        textOf(node).trim().toLowerCase() === 'transcript'
    );
    if (start === -1) return;

    // Wrap the heading and everything up to the next h2 (or end of document).
    let end = children.length;
    for (let i = start + 1; i < children.length; i++) {
      const node = children[i];
      if (node.type === 'element' && node.tagName === 'h2') {
        end = i;
        break;
      }
    }

    const section = children.splice(start, end - start);
    children.splice(start, 0, {
      type: 'element',
      tagName: 'section',
      properties: { 'data-pagefind-weight': TRANSCRIPT_WEIGHT },
      children: section,
    });
  };
}
