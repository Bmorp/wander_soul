// The build writes each page of the site as its own HTML file, so a page opened by a reader
// that never runs scripts (a link preview, a search engine's first fetch, an AI assistant)
// still has its own title, description, picture, structured data and the page's words. The
// words come from the same data modules the pages are built from, so they cannot drift.
//
// In the browser the app takes over as usual: the plain-text copy sits in <noscript>, which
// a browser with scripts never shows.
import { SITE_NAME, DEFAULT_DESCRIPTION, fullTitle, seoFor, indexablePaths, privatePages, NOT_FOUND_SEO } from '../src/data/seo.js';
import { trips, inboundTrips, indiaTrips, internationalTrips, holidayTrips, duration, bestTime, tripBySlug } from '../src/data/trips.js';
import { states } from '../src/data/states.js';
import { onRequest } from '../src/data/international.js';
import { site, waLink, generalMessage, tripMessage } from '../src/data/site.js';
import { howItWorksFaq, indiaToursFaq, TIME_ZONE } from '../src/data/faq.js';
import { trust } from '../src/data/trust.js';

export const allPaths = [...indexablePaths, ...Object.keys(privatePages)];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const plain = (parts) => parts.map((p) => (typeof p === 'string' ? p : p.b)).join('');

const NAV = [
  ['/', 'Home'],
  ['/india-tours', 'India tours'],
  ['/holidays', 'Holidays in India'],
  ['/international', 'Holidays abroad'],
  ['/compare', 'Compare holidays'],
  ['/how-it-works', 'How it works'],
  ['/about', 'About'],
  ['/contact', 'Plan your trip'],
];

const contactBlock = () =>
  `<section><h2>Contact Wander Soul</h2>${list([
    `WhatsApp: ${link(waLink(generalMessage), site.phoneDisplay)}`,
    `Phone: ${link(site.phoneHref, site.phoneDisplay)}`,
    `Email: ${link(`mailto:${site.email}`, site.email)}`,
    `Instagram: ${link(site.instagram, site.instagramHandle)}`,
    `Based in ${esc(site.city)}, Maharashtra, India (${esc(TIME_ZONE)})`,
  ])}</section>`;

const page = (h1, intro, body = '') =>
  `<header><p>${link('/', SITE_NAME)}</p><nav aria-label="Main">${list(NAV.map(([to, label]) => link(to, label)))}</nav></header>` +
  `<main><h1>${esc(h1)}</h1>${intro}${body}</main><footer>${contactBlock()}</footer>`;

const tripItem = (t) =>
  `${link(`/trips/${t.slug}`, t.name)}: ${esc(t.tagline)} ${esc(t.places.join(', '))}. ${esc(duration(t))}.`;

const tripList = (items) => list(items.map(tripItem));

function tripBody(t) {
  const kind = t.region === 'inbound' ? 'India tour' : t.region === 'india' ? 'Holiday in India' : 'Holiday abroad';
  const byDay = t.plan === 'days';
  const rows = [];
  rows.push(`<p>${esc(t.tagline)}</p>`);
  rows.push(`<p>${esc(kind)}. ${esc(duration(t))}. Route: ${esc(t.places.join(', '))}. Best time to go: ${esc(bestTime(t))}.</p>`);
  if (t.lead?.length) rows.push(`<p>${esc(plain(t.lead))}</p>`);
  rows.push(`<h2>${byDay ? 'Day by day' : 'The route'}</h2>`);
  rows.push(`<ol>${t.itinerary.map((d, i) => `<li><h3>${byDay ? `Day ${i + 1}: ` : ''}${esc(d.title)}</h3><p>${esc(d.body)}</p></li>`).join('')}</ol>`);
  if (t.plannedWithYou?.length) {
    rows.push(`<h2>Planned with you</h2>${list(t.plannedWithYou.map((i) => esc(i.text)))}`);
  }
  if (t.included?.length) {
    rows.push(`<h2>Included</h2>${list(t.included.map((i) => esc(i.text)))}`);
    rows.push(`<h2>Not included</h2>${t.excluded?.length ? list(t.excluded.map(esc)) : '<p>Ask your planner what this trip leaves out for your dates, such as flights.</p>'}`);
    if (t.optional?.length) rows.push(`<h2>Optional extras</h2>${list(t.optional.map(esc))}`);
  }
  rows.push(`<h2>When to go</h2><p>${esc(t.seasonNote)}</p>`);
  rows.push(`<h2>Get the details</h2><p>${link(waLink(tripMessage(t)), 'Get details on WhatsApp')}. Your planner replies with the plan and the price for your dates.</p>`);
  const others = trips.filter((o) => o.region === t.region && o.slug !== t.slug);
  if (others.length) rows.push(`<h2>More trips</h2>${tripList(others)}`);
  return rows.join('');
}

const faqHtml = (items) => `<dl>${items.map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`).join('')}</dl>`;

const bodies = {
  '/': () =>
    page(
      'Wander Soul: holidays in India and abroad, and India tours for visitors from around the world',
      `<p>${esc(DEFAULT_DESCRIPTION)}</p>`,
      `<section><h2>India tours for international visitors</h2>${tripList(inboundTrips)}</section>` +
        `<section><h2>Holidays in India</h2>${tripList(indiaTrips)}</section>` +
        `<section><h2>Holidays abroad</h2>${tripList(internationalTrips)}${list(onRequest.map((p) => `${esc(p.name)} (on request): ${esc(p.line)}`))}</section>` +
        `<section><h2>How it works</h2><p>Tell us where you want to go, get your plan and price on WhatsApp, and travel with someone to message throughout the trip. ${link('/how-it-works', 'How it works')}.</p></section>`,
    ),
  '/india-tours': () =>
    page(
      'India tours for international visitors',
      `<p>${esc(seoFor('/india-tours').description)}</p>`,
      `<section><h2>The routes</h2>${inboundTrips
        .map(
          (t) =>
            `<article><h3>${link(`/trips/${t.slug}`, t.name)}</h3><p>${esc(t.tagline)} ${esc(t.places.join(', '))}.</p><p>${esc(plain(t.lead))}</p></article>`,
        )
        .join('')}</section>` +
        `<section><h2>India by state</h2>${list(states.map((s) => `${esc(s.name)}: ${esc(s.line)}`))}</section>` +
        `<section><h2>Questions from visitors</h2>${faqHtml(indiaToursFaq)}</section>`,
    ),
  '/holidays': () => page('Holidays in India', `<p>${esc(seoFor('/holidays').description)}</p>`, tripList(indiaTrips)),
  '/international': () =>
    page(
      'Holidays abroad, from India',
      `<p>${esc(seoFor('/international').description)}</p>`,
      `<section><h2>Packages</h2>${tripList(internationalTrips)}</section>` +
        `<section><h2>On request</h2>${list(onRequest.map((p) => `${esc(p.name)}: ${esc(p.line)}`))}</section>`,
    ),
  '/compare': () =>
    page(
      'Compare holidays side by side',
      `<p>${esc(seoFor('/compare').description)}</p>`,
      `<table><thead><tr><th>Holiday</th><th>Length</th><th>Places</th><th>Stay</th><th>Meals</th><th>Transfers</th><th>Best time</th></tr></thead><tbody>${holidayTrips
        .map(
          (t) =>
            `<tr><th scope="row">${link(`/trips/${t.slug}`, t.name)}</th><td>${esc(duration(t))}</td><td>${esc(t.places.join(', '))}</td><td>${esc(t.stay)}</td><td>${esc(t.meals)}</td><td>${esc(t.transfers)}</td><td>${esc(bestTime(t))}</td></tr>`,
        )
        .join('')}</tbody></table>`,
    ),
  '/how-it-works': () =>
    page(
      'How it works',
      `<p>${esc(seoFor('/how-it-works').description)}</p>`,
      `<ol><li>Tell us where: pick a holiday or an India tour, or describe the trip you have in mind.</li><li>Get your plan and price: we reply on WhatsApp with the day-by-day plan, the stays and the price for your dates.</li><li>Travel with us beside you: book when you are happy with it, and we stay on WhatsApp through the trip.</li></ol>` +
        `<section><h2>Questions</h2>${faqHtml(howItWorksFaq)}</section>`,
    ),
  '/about': () =>
    page(
      'About Wander Soul',
      `<p>${esc(seoFor('/about').description)}</p>`,
      `<p>Wander Soul was born from a simple belief: every traveller deserves a trip that feels designed for them. We plan with you, in conversation, and you can reach us on WhatsApp while you travel.</p>` +
        `<section><h2>Business details</h2>${list(
          [
            trust.legalName && `Registered name: ${esc(trust.legalName)}`,
            `Based in ${esc(site.city)}, Maharashtra, India${trust.address ? `: ${esc(trust.address)}` : ''}`,
            `Time zone: ${esc(TIME_ZONE)}`,
            ...trust.registrations.map((r) => `${esc(r.label)}: ${esc(r.value)}`),
            ...trust.memberships.map((m) => esc(m.name)),
          ].filter(Boolean),
        )}</section>`,
    ),
  '/contact': () =>
    page(
      'Plan your trip',
      `<p>${esc(seoFor('/contact').description)}</p>`,
      `<section><h2>Trips you can ask about</h2>${tripList(trips)}</section>`,
    ),
  '/privacy': () => page('Privacy', `<p>${esc(seoFor('/privacy').description)}</p>`),
  '/terms': () => page('Terms', `<p>${esc(seoFor('/terms').description)}</p>`),
  '/account': () => page('Your enquiries', `<p>${esc(privatePages['/account'].description)}</p>`),
};

export function noscriptFor(path) {
  const trip = path.startsWith('/trips/') ? tripBySlug(path.slice('/trips/'.length)) : null;
  if (trip) return page(trip.name, '', tripBody(trip));
  return (bodies[path] || (() => page('Page not found', `<p>${esc(NOT_FOUND_SEO.description)}</p>`))) ();
}

// --- Writing the head and the body into the page -----------------------------------------------

const ldJson = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

function swap(html, pattern, to, warn) {
  if (!pattern.test(html)) warn?.(`SEO pages: could not find ${pattern} in index.html`);
  return html.replace(pattern, () => to);
}

export function renderPage(shell, path, base, warn) {
  const seo = path === '/404' ? NOT_FOUND_SEO : seoFor(path, base);
  const title = fullTitle(seo.title);
  const desc = seo.description || DEFAULT_DESCRIPTION;
  const url = base ? `${base}${path === '/' ? '' : path}` : '';
  const image = seo.image || { url: `${base}/og-image.jpg`, alt: 'Wander Soul: travel with feeling', width: 1200, height: 630 };
  let html = shell;
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`, warn);
  html = swap(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(desc)}" />`, warn);
  html = swap(html, /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/, `<meta name="robots" content="${seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`, warn);
  html = swap(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`, warn);
  html = swap(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(desc)}" />`, warn);
  html = swap(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(image.url)}" />`, warn);
  html = swap(
    html,
    /<meta property="og:image:width" content="[^"]*" \/>\s*<meta property="og:image:height" content="[^"]*" \/>/,
    [
      image.alt ? `<meta property="og:image:alt" content="${esc(image.alt)}" />` : '',
      image.width ? `<meta property="og:image:width" content="${image.width}" />\n    <meta property="og:image:height" content="${image.height}" />` : '',
    ]
      .filter(Boolean)
      .join('\n    '),
    warn,
  );
  html = html.replace(/\s*<meta name="twitter:image" content="[^"]*" \/>/, '');
  const extra = [
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${esc(image.url)}" />`,
    ...(base ? [`<meta property="og:url" content="${url}" />`, `<link rel="canonical" href="${url}" />`] : []),
    ...(seo.jsonLd?.length ? [`<script type="application/ld+json" id="ld-page">${ldJson(seo.jsonLd.length === 1 ? seo.jsonLd[0] : seo.jsonLd)}</script>`] : []),
  ];
  html = html.replace('</head>', () => `    ${extra.join('\n    ')}\n  </head>`);
  html = swap(html, /<div id="root"><\/div>/, `<div id="root"></div>\n    <noscript>${noscriptFor(path)}</noscript>`, warn);
  return html;
}

// The file each page is written to: /india-tours -> india-tours.html (the host serves it at
// /india-tours), /trips/goa -> trips/goa.html, and the home page is index.html itself.
export const fileFor = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);
