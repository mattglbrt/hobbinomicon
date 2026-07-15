import { getStore } from '@netlify/blobs';

// Protected read-out of the search analytics. Gate with a secret so the query
// data isn't public. Set SEARCH_REPORT_KEY in the Netlify env, then visit:
//   /api/search-report?key=YOUR_SECRET
//
// Returns two reports:
//   - zeroResult: queries that returned nothing = games people expect you to
//     cover = your directory roadmap (and Yellow Imp demand signal).
//   - zeroClick: queries with searches but no clicks = you have content but the
//     ranking or snippet failed.

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async (req) => {
  const secret = process.env.SEARCH_REPORT_KEY;
  const key = new URL(req.url).searchParams.get('key');
  if (!secret || key !== secret) return json({ error: 'Not found' }, 404);

  try {
    const store = getStore('search-analytics');
    const { blobs } = await store.list();
    const rows = await Promise.all(
      blobs.map((b) => store.get(b.key, { type: 'json' }))
    );
    const records = rows.filter(Boolean);

    const zeroResult = records
      .filter((r) => r.lastResultCount === 0)
      .sort((a, b) => b.searches - a.searches)
      .map((r) => ({ query: r.q, searches: r.searches, lastSeen: r.lastSeen }));

    const zeroClick = records
      .filter((r) => r.searches > 0 && r.clicks === 0 && r.lastResultCount !== 0)
      .sort((a, b) => b.searches - a.searches)
      .map((r) => ({ query: r.q, searches: r.searches, results: r.lastResultCount, lastSeen: r.lastSeen }));

    return json({
      totals: {
        uniqueQueries: records.length,
        searches: records.reduce((n, r) => n + r.searches, 0),
        clicks: records.reduce((n, r) => n + r.clicks, 0),
      },
      zeroResult,
      zeroClick,
    });
  } catch (err) {
    console.error('search-report error:', err);
    return json({ error: 'Report failed' }, 500);
  }
};

export const config = {
  path: '/api/search-report',
};
