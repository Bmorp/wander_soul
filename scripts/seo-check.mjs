// Checks the built site (dist/) for the things search engines and link previews rely on.
//   npm run build && npm run check:seo
// (Set SITE_URL, or build on Vercel, to have the canonical addresses and the sitemap checked too.)
// Exits with an error if anything that should never happen does; warns about the rest.
import { existsSync, readFileSync } from 'node:fs';
import { allPaths, fileFor } from './seo-pages.mjs';
import { indexablePaths, privatePages } from '../src/data/seo.js';
import { siteUrl } from './sitemap.mjs';

const DIST = new URL('../dist/', import.meta.url);
const base = siteUrl();
const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

const read = (file) => (existsSync(new URL(file, DIST)) ? readFileSync(new URL(file, DIST), 'utf8') : null);
const attr = (html, re) => html.match(re)?.[1];
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const titles = new Map();
const descriptions = new Map();
let pagesChecked = 0;

for (const path of [...allPaths, '/404']) {
  const file = path === '/404' ? '404.html' : fileFor(path);
  const html = read(file);
  if (!html) {
    err(`${path}: ${file} was not written`);
    continue;
  }
  pagesChecked += 1;
  const priv = path === '/404' || path in privatePages;

  const title = decode(attr(html, /<title>([^<]*)<\/title>/) || '');
  const desc = decode(attr(html, /<meta\s+name="description"\s+content="([^"]*)"/) || '');
  if (!title) err(`${path}: no <title>`);
  if (!desc) err(`${path}: no meta description`);
  if (title.length > 70) warn(`${path}: title is ${title.length} characters (search results cut it near 60)`);
  if (desc && (desc.length < 50 || desc.length > 175)) warn(`${path}: description is ${desc.length} characters (aim for 70 to 160)`);
  if (!priv) {
    if (titles.has(title)) err(`${path}: same title as ${titles.get(title)}`);
    titles.set(title, path);
    if (descriptions.has(desc)) err(`${path}: same description as ${descriptions.get(desc)}`);
    descriptions.set(desc, path);
  }

  const robots = attr(html, /<meta\s+name="robots"\s+content="([^"]*)"/) || '';
  if (priv && !/noindex/.test(robots)) err(`${path}: private page is not marked noindex`);
  if (!priv && /noindex/.test(robots)) err(`${path}: public page is marked noindex`);

  if (!/<meta property="og:title"/.test(html) || !/<meta property="og:description"/.test(html)) err(`${path}: missing og:title or og:description`);
  const og = attr(html, /<meta property="og:image" content="([^"]*)"/);
  if (!og) err(`${path}: no og:image`);
  else if (base && !/^https?:\/\//.test(decode(og))) err(`${path}: og:image is not an absolute address (${og})`);
  if (base && !priv) {
    const canon = attr(html, /<link rel="canonical" href="([^"]*)"/);
    const want = `${base}${path === '/' ? '' : path}`;
    if (canon !== want) err(`${path}: canonical is ${canon || 'missing'}, expected ${want}`);
  }

  const ld = attr(html, /<script type="application\/ld\+json" id="ld-page">([\s\S]*?)<\/script>/);
  if (ld) {
    try {
      const data = JSON.parse(ld);
      for (const item of [].concat(data)) if (!item['@context'] || !item['@type']) err(`${path}: structured data without @context or @type`);
    } catch (e) {
      err(`${path}: structured data is not valid JSON (${e.message})`);
    }
  } else if (['/', '/about', '/contact', '/india-tours', '/how-it-works'].includes(path) || path.startsWith('/trips/')) {
    err(`${path}: no structured data`);
  }

  const noscript = attr(html, /<noscript>([\s\S]*?)<\/noscript>/) || '';
  const h1s = (noscript.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) err(`${path}: the plain-text copy has ${h1s} <h1> (expected 1)`);
  if (noscript.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length < 60) warn(`${path}: the plain-text copy is short`);

  if (/₹|\bper package\b|\bper person\b/i.test(html)) err(`${path}: mentions a price`);
  for (const href of noscript.matchAll(/<a href="(\/[^"#?]*)"/g)) {
    const target = href[1];
    if (target !== '/' && !allPaths.includes(target)) err(`${path}: links to ${target}, which is not a page`);
  }
}

if (base) {
  const sitemap = read('sitemap.xml') || '';
  for (const p of indexablePaths) if (!sitemap.includes(`<loc>${base}${p}</loc>`)) err(`sitemap.xml is missing ${p}`);
  for (const p of Object.keys(privatePages)) if (sitemap.includes(`<loc>${base}${p}</loc>`)) err(`sitemap.xml lists the private page ${p}`);
  if (!(read('robots.txt') || '').includes(`Sitemap: ${base}/sitemap.xml`)) err('robots.txt does not point to the sitemap');
} else {
  warn('No SITE_URL (and not building on Vercel): canonical addresses, absolute picture addresses and the sitemap were not checked.');
}

console.log(`Checked ${pagesChecked} pages${base ? ` for ${base}` : ''}.`);
for (const w of warns) console.log(`  warning: ${w}`);
for (const e of errors) console.log(`  ERROR:   ${e}`);
console.log(errors.length ? `${errors.length} problem(s).` : 'No problems.');
process.exit(errors.length ? 1 : 0);
