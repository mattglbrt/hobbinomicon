import { getStore } from '@netlify/blobs';

// Privacy-respecting search analytics ingest.
//
// Stores ONLY: normalized query string, aggregate counts, last result count.
// No IP, no cookies, no user identifiers, nothing that identifies a person.
// One blob key per query, so concurrent writes to different queries never race.
//
// Two signals feed the two reports:
//   - a "search" event (clicked !== true) with the result count → powers the
//     zero-result report (queries the directory doesn't cover = roadmap).
//   - a "click" event (clicked === true) → a query with searches but no clicks
//     is a zero-click query (content exists, ranking/snippet failed).

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = await req.json();

    // Normalize + cap the query. Drop anything too short to be a real intent.
    const q = String(body.query || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80);
    if (q.length < 2) return json({ ok: true });

    const clicked = body.clicked === true;
    const resultCount = Number.isFinite(body.resultCount) ? body.resultCount : null;

    const store = getStore('search-analytics');
    const key = encodeURIComponent(q);

    const rec = (await store.get(key, { type: 'json' })) || {
      q,
      searches: 0,
      clicks: 0,
      zeroResults: 0,
      lastResultCount: null,
    };

    if (clicked) {
      rec.clicks += 1;
    } else {
      rec.searches += 1;
      if (resultCount !== null) {
        rec.lastResultCount = resultCount;
        if (resultCount === 0) rec.zeroResults += 1;
      }
    }
    rec.lastSeen = new Date().toISOString();

    await store.setJSON(key, rec);
    return json({ ok: true });
  } catch (err) {
    // Analytics must never break search — swallow and 200.
    console.error('search-log error:', err);
    return json({ ok: true });
  }
};

export const config = {
  path: '/api/search-log',
};
