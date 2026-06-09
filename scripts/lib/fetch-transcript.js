/**
 * Fetch and clean a YouTube transcript into a single plain-text blob.
 *
 * Returns the cleaned transcript string, or null when no transcript is
 * available (captions disabled, not yet generated, or fetch error). Auto-
 * generated (ASR) captions are often not ready for a few hours after upload,
 * so a null here is frequently temporary — see scripts/backfill-transcripts.js.
 *
 * Shared by scripts/sync-vlogs.js (new vlogs) and
 * scripts/backfill-transcripts.js (re-attempt for transcript-less vlogs).
 */
import { fetchTranscript } from 'youtube-transcript-plus';

export async function getTranscript(videoId) {
  try {
    const transcript = await fetchTranscript(videoId);
    if (!transcript || transcript.length === 0) return null;

    const text = transcript
      .map(item => item.text || item.content || item.snippet || '')
      .join(' ');

    // Clean up auto-generated artifacts
    return text
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
  } catch {
    return null;
  }
}
