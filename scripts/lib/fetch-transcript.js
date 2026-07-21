/**
 * Fetch and clean a YouTube transcript.
 *
 * Returns a result object, not a bare string, because *why* a transcript is
 * missing matters and used to be invisible. This function previously swallowed
 * every error and returned null, so "this video has captions disabled" and
 * "YouTube refused to talk to us" looked identical in the logs. That hid a real
 * problem for six weeks: YouTube blocks the caption endpoint from datacenter
 * IPs, so transcript fetches fail on every Netlify build and succeed from a
 * home connection. Netlify-generated posts silently shipped with no body text.
 *
 *   { status: 'ok',          text }  — transcript fetched and cleaned
 *   { status: 'no-captions', text: null }  — YouTube genuinely has none
 *   { status: 'blocked',     text: null }  — refused/rate-limited: RETRY ELSEWHERE
 *   { status: 'error',       text: null }  — anything else (network, bad id)
 *
 * Only 'no-captions' is a settled answer. 'blocked' means the transcript may
 * well exist and this machine just can't have it — callers should say so
 * loudly rather than record the video as transcript-less.
 *
 * Shared by scripts/sync-vlogs.js (new vlogs) and
 * scripts/backfill-transcripts.js (re-attempt for transcript-less vlogs).
 */
import { normalizeTranscript } from './normalize-transcript.js';
import {
  fetchTranscript,
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptNotAvailableLanguageError,
  YoutubeTranscriptTooManyRequestError,
} from 'youtube-transcript-plus';

function clean(text) {
  const cleaned = text
    .replace(/\[Music\]/gi, '')
    .replace(/\[Applause\]/gi, '')
    .replace(/&amp;#39;/g, "'")
    .replace(/&amp;quot;/g, '"')
    .replace(/&amp;gt;/g, '>')
    .replace(/&amp;lt;/g, '<')
    .replace(/&amp;amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  // Fix the recurring auto-caption manglings before anything downstream sees
  // the text, so new posts land correct instead of needing a cleanup pass.
  return normalizeTranscript(cleaned);
}

export async function getTranscriptResult(videoId) {
  try {
    const transcript = await fetchTranscript(videoId);
    if (!transcript || transcript.length === 0) {
      return { status: 'no-captions', text: null };
    }
    const text = clean(
      transcript.map((item) => item.text || item.content || item.snippet || '').join(' ')
    );
    if (!text) return { status: 'no-captions', text: null };
    return { status: 'ok', text };
  } catch (err) {
    // The video really has nothing to give us.
    if (
      err instanceof YoutubeTranscriptDisabledError ||
      err instanceof YoutubeTranscriptNotAvailableError ||
      err instanceof YoutubeTranscriptNotAvailableLanguageError
    ) {
      return { status: 'no-captions', text: null, reason: err.message };
    }
    // Rate limit / refusal. On a cloud build host this is the normal outcome.
    if (err instanceof YoutubeTranscriptTooManyRequestError) {
      return { status: 'blocked', text: null, reason: err.message };
    }
    // YouTube's block often arrives as a plain fetch/parse failure rather than a
    // typed error, so treat the usual suspects as blocked too — better to
    // over-report a retryable condition than to bury it as "no captions".
    const msg = String(err?.message || err);
    if (/429|403|too many|forbidden|captcha|consent|sign in|bot/i.test(msg)) {
      return { status: 'blocked', text: null, reason: msg };
    }
    return { status: 'error', text: null, reason: msg };
  }
}

/**
 * Back-compat shim: string | null, losing the reason. Prefer
 * getTranscriptResult so failures stay distinguishable.
 */
export async function getTranscript(videoId) {
  const { text } = await getTranscriptResult(videoId);
  return text;
}

/**
 * Shared end-of-run warning. Both scripts run inside `prebuild`, where nobody
 * reads the log unless something shouts.
 */
export function reportBlocked(blockedCount, scriptName) {
  if (!blockedCount) return;
  console.warn('');
  console.warn('  ' + '!'.repeat(68));
  console.warn(`  !! ${blockedCount} transcript fetch(es) were BLOCKED, not missing.`);
  console.warn('  !! YouTube refuses the caption endpoint from datacenter IPs, so this');
  console.warn('  !! is expected on Netlify and these posts will publish with no body.');
  console.warn(`  !! Fix: run "${scriptName}" locally, then commit the result.`);
  console.warn('  ' + '!'.repeat(68));
  console.warn('');
}
