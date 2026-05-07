#!/usr/bin/env node
/**
 * Validate JSON-LD blocks in built HTML against schema.org requirements
 * relevant to Google Rich Results.
 *
 * Walks dist/ (or the path passed as argv[2]), extracts every
 * <script type="application/ld+json"> block, and reports per-page issues.
 *
 * Usage:
 *   npm run validate-schema           # walks ./dist
 *   npm run validate-schema -- path   # walks ./path
 *
 * Exits 1 if any required field is missing.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = process.argv[2] || './dist';

const RULES = {
  WebSite:        { R: ['name', 'url'],                                                           r: ['description'] },
  Organization:   { R: ['name', 'url'],                                                           r: ['logo', 'sameAs'] },
  BreadcrumbList: { R: ['itemListElement'],                                                       r: [] },
  BlogPosting:    { R: ['headline', 'datePublished', 'author', 'publisher'],                      r: ['image', 'dateModified', 'mainEntityOfPage'] },
  NewsArticle:    { R: ['headline', 'datePublished', 'author', 'publisher'],                      r: ['image', 'dateModified', 'mainEntityOfPage'] },
  VideoObject:    { R: ['name', 'description', 'thumbnailUrl', 'uploadDate'],                     r: ['embedUrl', 'contentUrl', 'duration'] },
  Game:           { R: ['name'],                                                                  r: ['description', 'image', 'url', 'publisher', 'author'] },
  Person:         { R: ['name'],                                                                  r: ['description', 'url', 'image', 'sameAs'] },
};

function* walkHtml(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) yield* walkHtml(full);
    else if (entry.endsWith('.html')) yield full;
  }
}

function extractJsonLd(html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  const out = [];
  let m;
  while ((m = re.exec(html))) {
    try { out.push(JSON.parse(m[1])); }
    catch (e) { out.push({ __error: e.message }); }
  }
  return out;
}

function validate(obj) {
  const issues = [];
  const t = obj['@type'];
  if (!t) return issues;
  const rule = RULES[t];
  if (!rule) return issues;

  for (const f of rule.R) {
    const v = obj[f];
    if (v === undefined || v === null || (Array.isArray(v) && v.length === 0)) {
      issues.push({ level: 'required', msg: `${t}.${f} missing` });
    }
  }
  for (const f of rule.r) {
    if (obj[f] === undefined) issues.push({ level: 'recommended', msg: `${t}.${f} missing` });
  }

  if (t === 'BlogPosting' || t === 'NewsArticle') {
    if (typeof obj.headline === 'string' && obj.headline.length > 110) {
      issues.push({ level: 'warn', msg: `${t}.headline ${obj.headline.length} chars (Google truncates >110)` });
    }
    if (obj.author && typeof obj.author === 'object' && !Array.isArray(obj.author) && !obj.author.name) {
      issues.push({ level: 'required', msg: `${t}.author.name missing` });
    }
    if (obj.publisher && typeof obj.publisher === 'object') {
      if (!obj.publisher.name) issues.push({ level: 'required', msg: `${t}.publisher.name missing` });
      if (!obj.publisher.logo) issues.push({ level: 'recommended', msg: `${t}.publisher.logo missing` });
    }
  }
  if (t === 'VideoObject') {
    if (obj.thumbnailUrl && !/^https?:\/\//.test(obj.thumbnailUrl)) {
      issues.push({ level: 'warn', msg: `VideoObject.thumbnailUrl must be absolute (got: ${String(obj.thumbnailUrl).slice(0, 60)}...)` });
    }
  }
  if (t === 'BreadcrumbList' && Array.isArray(obj.itemListElement)) {
    obj.itemListElement.forEach((li, i) => {
      if (!li.name) issues.push({ level: 'required', msg: `BreadcrumbList[${i}].name missing` });
      if (!li.item) issues.push({ level: 'required', msg: `BreadcrumbList[${i}].item missing` });
      if (typeof li.position !== 'number') issues.push({ level: 'required', msg: `BreadcrumbList[${i}].position missing` });
    });
  }

  return issues;
}

const counts = { required: 0, recommended: 0, warn: 0, parse: 0 };
const pagesWithIssues = [];
let pageCount = 0;
let blockCount = 0;

for (const file of walkHtml(DIST)) {
  pageCount++;
  const html = readFileSync(file, 'utf-8');
  const blocks = extractJsonLd(html);
  if (!blocks.length) continue;
  blockCount += blocks.length;

  const fileIssues = [];
  for (const b of blocks) {
    if (b.__error) {
      fileIssues.push({ level: 'parse', msg: `JSON parse error: ${b.__error}` });
      continue;
    }
    fileIssues.push(...validate(b));
  }
  if (fileIssues.length) {
    pagesWithIssues.push({ file: relative(DIST, file), issues: fileIssues });
    for (const i of fileIssues) counts[i.level]++;
  }
}

// Group recommended-only issues into a single summary line per type to avoid 600-line output.
const recommendedOnly = pagesWithIssues.filter((p) => p.issues.every((i) => i.level === 'recommended'));
const otherPages = pagesWithIssues.filter((p) => p.issues.some((i) => i.level !== 'recommended'));

if (otherPages.length) {
  console.log('— pages with required/warning issues —');
  for (const { file, issues } of otherPages) {
    console.log(`\n${file}`);
    for (const { level, msg } of issues) {
      const tag = level === 'required' ? '[REQUIRED]' : level === 'warn' ? '[WARN]' : level === 'parse' ? '[PARSE]' : '[rec]';
      console.log(`  ${tag} ${msg}`);
    }
  }
}

if (recommendedOnly.length) {
  // Aggregate: which messages, how many pages each
  const tally = new Map();
  for (const { issues } of recommendedOnly) {
    for (const { msg } of issues) tally.set(msg, (tally.get(msg) || 0) + 1);
  }
  console.log(`\n— recommended-only (${recommendedOnly.length} pages, aggregated) —`);
  for (const [msg, n] of [...tally.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${n}× ${msg}`);
  }
}

console.log('\n— summary —');
console.log(`  pages scanned    : ${pageCount}`);
console.log(`  JSON-LD blocks   : ${blockCount}`);
console.log(`  pages clean      : ${pageCount - pagesWithIssues.length}`);
console.log(`  required missing : ${counts.required}`);
console.log(`  warnings         : ${counts.warn}`);
console.log(`  parse errors     : ${counts.parse}`);
console.log(`  recommended      : ${counts.recommended}`);

if (counts.required > 0 || counts.parse > 0) {
  console.log('\n✗ failed: required-field or parse issues present');
  process.exit(1);
}
console.log('\n✓ all required fields present');
