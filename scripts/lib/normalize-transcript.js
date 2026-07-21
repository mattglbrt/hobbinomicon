/**
 * Apply the auto-caption correction dictionary to transcript text.
 *
 * YouTube's ASR reliably mangles the proper nouns Matt uses most (paints,
 * games, sculptors), and mangles them differently every time — one video says
 * "teneembbas gray", another "tenebris grey". scripts/transcript-normalize.json
 * maps the spellings actually seen back to the verified real name.
 *
 * Deliberately narrow: whole-word, case-insensitive, longest variant first so
 * "westfallian miniatures" wins over "westfallian". It corrects mishearings and
 * nothing else — it is not a style pass, and it must never touch a phrase that
 * is valid English on its own. See the _rules in the JSON.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DICT_PATH = path.join(__dirname, '../transcript-normalize.json');

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let rules = null;

function loadRules() {
  if (rules) return rules;
  const raw = JSON.parse(fs.readFileSync(DICT_PATH, 'utf-8'));
  const pairs = [];
  for (const [correct, variants] of Object.entries(raw.replacements || {})) {
    for (const variant of variants) {
      // Skip a variant identical to its replacement — no-op, and it would
      // needlessly rewrite already-correct text.
      if (variant.toLowerCase() === correct.toLowerCase()) continue;
      pairs.push({ correct, variant });
    }
  }
  // Longest first: otherwise a short variant eats the prefix of a long one.
  pairs.sort((a, b) => b.variant.length - a.variant.length);
  rules = pairs.map(({ correct, variant }) => ({
    correct,
    re: new RegExp(`\\b${escapeRegex(variant)}\\b`, 'gi'),
  }));
  return rules;
}

export function normalizeTranscript(text) {
  if (!text) return text;
  let out = text;
  for (const { re, correct } of loadRules()) out = out.replace(re, correct);
  return out;
}

/** Which corrections would fire, for reporting. Does not modify the text. */
export function findCorrections(text) {
  if (!text) return [];
  const hits = [];
  for (const { re, correct } of loadRules()) {
    const matches = text.match(re);
    if (matches) hits.push({ correct, count: matches.length, sample: matches[0] });
  }
  return hits;
}
