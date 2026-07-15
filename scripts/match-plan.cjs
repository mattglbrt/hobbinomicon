/**
 * Resolve each playlist-plan entry to a real video ID.
 * Read-only. Matches on normalized-title similarity, using the plan's view
 * counts as a strong disambiguator. Emits a verification report + a resolved
 * mapping (scripts/.playlist-resolved.json) for the create step to consume.
 *
 * Usage: node scripts/match-plan.cjs
 */
const fs = require('fs');

const PLAN = JSON.parse(fs.readFileSync('scripts/playlist-plan.json', 'utf8'));
const VIDEOS = JSON.parse(fs.readFileSync('scripts/.uploads.json', 'utf8'));

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, ' ') // emoji
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokens = (s) => new Set(norm(s).split(' ').filter(Boolean));

function titleSim(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const jaccard = inter / (A.size + B.size - inter || 1);
  // Substring bonus: plan titles are often a prefix/abbreviation of the real one.
  const na = norm(a);
  const nb = norm(b);
  const sub = nb.includes(na) || na.includes(nb) ? 0.25 : 0;
  return Math.min(1, jaccard + sub);
}

function bestMatch(entry, used) {
  let scored = VIDEOS.map((v) => {
    const sim = titleSim(entry.t, v.title);
    // View-count proximity: exact = huge signal; counts only grow over time,
    // so allow the real count to be >= plan count.
    const dv = v.viewCount == null ? Infinity : Math.abs(v.viewCount - entry.v);
    const vExact = dv === 0;
    const vClose = dv <= Math.max(3, entry.v * 0.15);
    let score = sim + (vExact ? 0.4 : vClose ? 0.2 : 0);
    if (used.has(v.id)) score -= 0.05; // gentle nudge away from reuse within a playlist
    return { v, sim, dv, score };
  }).sort((a, b) => b.score - a.score);

  const top = scored[0];
  const runnerUp = scored[1];
  // Confidence heuristics.
  let confidence = 'LOW';
  if (top.sim >= 0.55 && top.dv <= Math.max(5, entry.v * 0.25)) confidence = 'HIGH';
  else if (top.sim >= 0.7) confidence = 'HIGH';
  else if (top.sim >= 0.4 || top.dv <= Math.max(3, entry.v * 0.1)) confidence = 'MEDIUM';
  const margin = top.score - (runnerUp ? runnerUp.score : 0);
  if (margin < 0.08 && confidence === 'HIGH') confidence = 'MEDIUM';
  return { ...top, confidence, runnerUp };
}

const resolved = { privacy: PLAN.privacy, playlists: [] };
const rows = [];
let low = 0;

for (const pl of PLAN.playlists) {
  const used = new Set();
  const outVideos = [];
  for (const entry of pl.videos) {
    const m = bestMatch(entry, used);
    used.add(m.v.id);
    if (m.confidence === 'LOW') low++;
    outVideos.push({ id: m.v.id, planTitle: entry.t, realTitle: m.v.title });
    rows.push({
      pl: pl.title,
      conf: m.confidence,
      plan: `${entry.t} (${entry.v})`,
      real: `${m.v.title} (${m.v.viewCount})`,
      id: m.v.id,
      alt: m.runnerUp ? `${m.runnerUp.v.title} (${m.runnerUp.v.viewCount})` : '',
    });
  }
  resolved.playlists.push({ title: pl.title, description: pl.description, videos: outVideos });
}

fs.writeFileSync('scripts/.playlist-resolved.json', JSON.stringify(resolved, null, 2));

// Report
const order = { LOW: 0, MEDIUM: 1, HIGH: 2 };
let curPl = '';
for (const r of rows.sort((a, b) => (a.pl === b.pl ? order[a.conf] - order[b.conf] : 0))) {
  if (r.pl !== curPl) {
    curPl = r.pl;
    console.log(`\n=== ${curPl} ===`);
  }
  const flag = r.conf === 'HIGH' ? 'OK  ' : r.conf === 'MEDIUM' ? '~?  ' : 'XX  ';
  const same = norm(r.plan.replace(/\s*\(\d+\)$/, '')) === norm(r.real.replace(/\s*\(\d+\)$/, ''));
  console.log(`${flag}[${r.conf}] ${r.id}`);
  console.log(`      plan: ${r.plan}`);
  console.log(`      ->    ${r.real}${same ? '' : '   <-- title differs'}`);
  if (r.conf !== 'HIGH' && r.alt) console.log(`      alt:  ${r.alt}`);
}

const total = rows.length;
const highs = rows.filter((r) => r.conf === 'HIGH').length;
const meds = rows.filter((r) => r.conf === 'MEDIUM').length;
console.log(`\nTotal ${total}: ${highs} HIGH, ${meds} MEDIUM, ${low} LOW`);
console.log('Resolved mapping -> scripts/.playlist-resolved.json');
