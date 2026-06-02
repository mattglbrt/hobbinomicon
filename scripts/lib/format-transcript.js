/**
 * Split a single-blob transcript into readable paragraphs.
 *
 * Groups sentences into chunks separated by blank lines so the markdown
 * renders as semantic <p> tags (good for readability, SEO, and Ctrl-F).
 * Purely mechanical formatting — no words are added, removed, or reordered,
 * so it never fabricates content.
 *
 * Shared by scripts/sync-vlogs.js (new vlogs) and
 * scripts/format-transcripts.js (one-time migration of existing vlogs).
 */
export function formatTranscriptParagraphs(text, sentencesPerParagraph = 5) {
  if (!text) return text;

  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return normalized;

  // Match sentences (text ending in . ! or ? plus any closing quote/bracket),
  // falling back to a trailing fragment that has no terminator.
  const sentences = normalized.match(/[^.!?]+[.!?]+["')\]]*|\S[^.!?]*$/g);
  if (!sentences || sentences.length <= sentencesPerParagraph) {
    return normalized;
  }

  const trimmed = sentences.map((s) => s.trim()).filter(Boolean);
  const paragraphs = [];
  for (let i = 0; i < trimmed.length; i += sentencesPerParagraph) {
    paragraphs.push(trimmed.slice(i, i + sentencesPerParagraph).join(' '));
  }
  return paragraphs.join('\n\n');
}
