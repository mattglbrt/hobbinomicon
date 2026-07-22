/**
 * Build a meta description from transcript text.
 *
 * When a video has no YouTube description we fall back to the transcript, and
 * naively taking the first 160 characters produces search snippets like
 * "Okay, I'm sorry. I was vibing. Forgot to pull the camera and record..." or
 * "people. A long time no see." (YouTube's ASR routinely drops the first word
 * or two of a video, so the text can start mid-sentence).
 *
 * So: throw away leading throat-clearing, then take whole sentences up to the
 * target length. A description that starts with the second real sentence beats
 * one that starts with a stray fragment.
 */

const MAX = 155;

// Openers that carry no information: greetings, sign-ons, hesitation noise.
const FILLER = [
  /^(hey|hi|hello|yo|what'?s up|good morning|good evening)\b/i,
  /^(uh|um|er|ah|oh|okay|ok|alright|all right|so|well|anyway|anyways)\b[,.]?$/i,
  /^(everybody|everyone|people|guys|folks|friends)\b/i,
  /^(a )?long time no see/i,
  /^i'?m sorry/i,
  /^(i was |just )?vibing/i,
  /^(here we go|let'?s go|let'?s get into it|welcome back|welcome)\b/i,
  /^(today|tonight) (we'?re|i'?m) (just )?(gonna|going to) (get|jump|dive|hop) (in|into)/i,
];

// "I I just" / "the the model" — ASR doubles words constantly.
function dedupeStutter(text) {
  return text.replace(/\b(\w+)(\s+\1\b)+/gi, '$1');
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function isThrowaway(sentence) {
  // The transcript censors profanity as "[ __ ]". That must never reach a
  // search snippet, so skip the whole sentence rather than serve a redaction.
  if (/\[\s*_*\s*\]/.test(sentence)) return true;
  const words = sentence.replace(/[^\w\s']/g, ' ').trim().split(/\s+/).filter(Boolean);
  // Very short openers are almost always fragments or interjections.
  if (words.length <= 3) return true;
  const stripped = sentence.replace(/^(uh|um|er|ah|oh|so|okay|ok|alright|all right)[,\s]+/i, '');
  return FILLER.some((re) => re.test(stripped.trim()));
}

export function excerptFromTranscript(transcript, max = MAX) {
  if (!transcript) return '';
  const sentences = splitSentences(dedupeStutter(transcript.replace(/\s+/g, ' ').trim()));

  // Drop leading throwaways, but never drop everything — a short video may be
  // nothing but throat-clearing, and a weak description still beats none.
  let start = 0;
  while (start < sentences.length - 1 && isThrowaway(sentences[start])) start++;

  let out = '';
  for (let i = start; i < sentences.length; i++) {
    const next = out ? `${out} ${sentences[i]}` : sentences[i];
    if (next.length > max) break;
    out = next;
  }

  // One sentence longer than the budget: take it and cut at a word boundary.
  if (!out) {
    const first = sentences[start] || '';
    if (first.length <= max) return first;
    const cut = first.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,;:]$/, '') + '...';
  }

  // Trailing throwaways read as badly as leading ones ("...Here we go. All
  // right.") — drop them, but keep at least one sentence.
  const kept = splitSentences(out);
  while (kept.length > 1 && isThrowaway(kept[kept.length - 1])) kept.pop();

  return tidyInterior(tidyOpening(kept.join(' ')));
}

// The first sentence often survives selection but still opens on a particle.
function tidyOpening(text) {
  const trimmed = text.replace(/^(uh|um|er|ah|oh|so|well|okay|ok|alright|all right)[,\s]+/i, '');
  if (!trimmed) return text;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

// Interior sentences keep their hesitation noise too ("...his picture. Uh I
// printed it off."). Only the pure hesitation particles are stripped here —
// "so"/"well"/"okay" mid-description carry his rhythm and stay.
function tidyInterior(text) {
  return (
    text
      // After a sentence break: "...picture. Uh I printed it off."
      .replace(
        /(^|[.!?]\s+)(uh|um|er|ah)[,\s]+(\w)/gi,
        (_, lead, _particle, first) => `${lead}${first.toUpperCase()}`,
      )
      // After a comma, where the sentence continues: "Today, uh I'm building..."
      .replace(/,\s+(uh|um|er|ah)\s+/gi, ', ')
  );
}

/** Same trim for an authored YouTube description (already prose, just clamp). */
export function excerptFromDescription(description, max = MAX) {
  if (!description) return '';
  const clean = description.replace(/https?:\/\/[^\s]+/g, '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '...';
}
