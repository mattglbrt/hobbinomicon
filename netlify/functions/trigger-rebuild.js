/**
 * Scheduled function: trigger a daily Netlify rebuild.
 *
 * Each run POSTs to a Netlify build hook, which re-runs `npm run build`.
 * The prebuild step (scripts/sync-vlogs.js) pulls any newly-published YouTube
 * videos + transcripts into src/content/blog/vlogs/, so new uploads appear on
 * the site automatically without a manual deploy.
 *
 * Setup (one-time, in the Netlify dashboard):
 *   1. Site configuration → Build & deploy → Build hooks → "Add build hook".
 *   2. Copy the generated URL.
 *   3. Site configuration → Environment variables → add BUILD_HOOK_URL = <that URL>.
 *      (Also ensure YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID are set there so the
 *      prebuild sync can reach the YouTube API.)
 *
 * If BUILD_HOOK_URL is missing the function no-ops instead of erroring.
 */
export default async () => {
  const hookUrl = process.env.BUILD_HOOK_URL;

  if (!hookUrl) {
    console.warn('BUILD_HOOK_URL not set — skipping scheduled rebuild.');
    return new Response('No build hook configured', { status: 200 });
  }

  try {
    const res = await fetch(hookUrl, { method: 'POST' });
    if (!res.ok) {
      console.error(`Build hook returned ${res.status}`);
      return new Response(`Build hook failed: ${res.status}`, { status: 502 });
    }
    console.log('Scheduled rebuild triggered.');
    return new Response('Rebuild triggered', { status: 200 });
  } catch (err) {
    console.error('Failed to trigger rebuild:', err);
    return new Response('Failed to trigger rebuild', { status: 500 });
  }
};

export const config = {
  schedule: '@daily',
};
