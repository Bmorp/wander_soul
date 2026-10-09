// The site's public pages, its sitemap and robots.txt.
// `npm run build` writes both into dist/ by itself when it knows the live address:
// SITE_URL if set, otherwise the production domain Vercel provides at build time.
// To write public/sitemap.xml by hand instead:
//   SITE_URL=https://www.example.com npm run sitemap
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { indexablePaths } from '../src/data/seo.js';

export const siteUrl = () => {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return (process.env.SITE_URL || (vercel ? `https://${vercel}` : '')).replace(/\/$/, '');
};

// The pages worth finding in a search: every page in data/seo.js (not the private ones).
export const pages = indexablePaths;

export const sitemapXml = (base) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${base}${p}</loc></url>`)
    .join('\n')}\n</urlset>\n`;

export const robotsTxt = (base) => `User-agent: *\nAllow: /\n${base ? `\nSitemap: ${base}/sitemap.xml\n` : ''}`;

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const base = siteUrl();
  if (!base) {
    console.error('Set SITE_URL to the live address, e.g. SITE_URL=https://www.example.com npm run sitemap');
    process.exit(1);
  }
  writeFileSync(new URL('../public/sitemap.xml', import.meta.url), sitemapXml(base));
  console.log(`Wrote ${pages.length} URLs to public/sitemap.xml`);
}
