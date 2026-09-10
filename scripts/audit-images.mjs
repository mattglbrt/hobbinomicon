#!/usr/bin/env node
/**
 * Every image URL referenced by dist/, checked against the files actually on
 * disk. No dependencies, no network, no build — run it after `astro build`.
 *
 * Why this exists: on 2026-08-27 nine images 404'd across ~100 pages, on the
 * live site as well as locally, and nothing caught it. The build exited 0, no
 * warning was printed, and the pages rendered — a component was handed
 * `ImageMetadata.src` as a bare string, so Astro never emitted the original it
 * pointed at. A missing image is invisible to every other gate we have.
 *
 * Usage: node scripts/audit-images.mjs [distDir]
 * Exits 1 if any referenced image is missing.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = process.argv[2] ?? 'dist';

if (!fs.existsSync(DIST)) {
  console.error(`✗ ${DIST}/ not found — run a build first.`);
  process.exit(1);
}

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, out) : e.name.endsWith('.html') && out.push(p);
  }
  return out;
};

const IMG = /\.(?:jpg|jpeg|png|webp|avif|gif|svg)$/i;
const missing = new Map();
let pages = 0;
let refs = 0;

for (const file of walk(DIST)) {
  pages += 1;
  const html = fs.readFileSync(file, 'utf8');
  const urls = new Set();

  for (const m of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)) {
    if (IMG.test(m[1].split('?')[0])) urls.add(m[1]);
  }
  // srcset carries the responsive candidates, which is where most of them live.
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith('/') && IMG.test(u.split('?')[0])) urls.add(u);
    }
  }

  for (const u of urls) {
    refs += 1;
    const onDisk = path.join(DIST, decodeURIComponent(u.split('?')[0]));
    if (!fs.existsSync(onDisk)) {
      if (!missing.has(u)) missing.set(u, []);
      missing.get(u).push(file.slice(DIST.length) || '/');
    }
  }
}

console.log(`  scanned ${pages} pages, ${refs} image references`);

if (missing.size === 0) {
  console.log('\n✓ every referenced image exists in dist/');
  process.exit(0);
}

console.log(`\n✗ ${missing.size} referenced image(s) missing from ${DIST}/\n`);
for (const [url, where] of [...missing].sort()) {
  console.log(`  ${url}`);
  console.log(`    ${where.length} page(s): ${where.slice(0, 4).join(', ')}${where.length > 4 ? ' …' : ''}`);
}
process.exit(1);
