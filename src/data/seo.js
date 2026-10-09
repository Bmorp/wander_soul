// What each page tells search engines and link previews about itself: its title, its
// description, its picture and its structured data. The pages (through lib/useSeo) and the
// build (scripts/seo-pages.mjs, which writes the same words into each page's own HTML, for
// the readers that never run the page's scripts) both take it from here, so they agree.
// No prices appear anywhere in it, and nothing is claimed that the site does not show.
import { site } from './site.js';
import { trips, tripBySlug } from './trips.js';
import { daysOf } from './dayPhotos.js';
import { howItWorksFaq, indiaToursFaq } from './faq.js';
import { trust } from './trust.js';

export const SITE_NAME = 'Wander Soul';
export const DEFAULT_TITLE = 'Wander Soul | Holidays in India and abroad, and India tours';
export const DEFAULT_DESCRIPTION =
  'Wander Soul, Kalyan, Mumbai: holiday packages across India and abroad, and India tours for international visitors. Everything listed, planned with you on WhatsApp.';

export const fullTitle = (title) => (title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE);

// Pages that are in the sitemap, in the order they are listed. (/account is one person's own
// list of enquiries, so it is left out and marked noindex.)
export const pageSeo = {
  '/': { title: null, description: DEFAULT_DESCRIPTION },
  '/india-tours': {
    title: 'India tours: Golden Triangle, South India, Varanasi',
    description:
      'India tours for visitors from abroad: the Golden Triangle, South India from Chennai to Kochi, and Varanasi. Planned around your dates by Wander Soul, Mumbai.',
  },
  '/holidays': {
    title: 'Holidays in India: Kashmir, Goa, Kerala, Himalayas',
    description:
      'Holiday packages in India with the stay and the plan written down: Kashmir, Goa, Kerala, Shimla and Manali, Sikkim, Darjeeling and Nainital. Wander Soul, Mumbai.',
  },
  '/international': {
    title: 'Holidays abroad: Thailand, Malaysia, Sri Lanka',
    description:
      'Holidays abroad for travellers from India: Thailand, Malaysia and Sri Lanka, plus Bali, the Maldives and Vietnam on request. Planned by Wander Soul, Mumbai.',
  },
  '/compare': {
    title: 'Compare holidays side by side',
    description: 'Compare Wander Soul holidays side by side: length, places, stays, meals, transfers and the best time to go.',
  },
  '/how-it-works': {
    title: 'How it works: plan your trip on WhatsApp',
    description:
      'How Wander Soul works: tell us where you want to go, get your plan and price on WhatsApp, and travel with someone to message throughout the trip.',
  },
  '/about': {
    title: 'About us: a travel agency in Kalyan, Mumbai',
    description:
      'Wander Soul is a travel agency in Kalyan, Mumbai, planning holidays across India and abroad, and India tours for visitors from around the world.',
  },
  '/contact': {
    title: 'Plan your trip: message us on WhatsApp',
    description:
      'Plan your trip with Wander Soul: tell us where, when and who is travelling, and we reply on WhatsApp with a plan and a price for your dates.',
  },
  '/privacy': { title: 'Privacy', description: 'How the Wander Soul website handles your information.' },
  '/terms': { title: 'Terms', description: 'Terms for using the Wander Soul website and reading its trip details.' },
};

// Pages that exist but are not for search results.
export const privatePages = {
  '/account': { title: 'Your enquiries', description: 'The enquiries you have made from this device.', noindex: true },
};

export const NOT_FOUND_SEO = { title: 'Page not found', description: 'This page has moved or does not exist.', noindex: true };

export const tripPaths = trips.map((t) => `/trips/${t.slug}`);
export const indexablePaths = [...Object.keys(pageSeo), ...tripPaths];

// --- Trips ------------------------------------------------------------------------------

export const tripTitle = (trip) => (trip.region === 'inbound' ? `${trip.name}: India tour` : `${trip.name} holiday`);

// (A long route is cut to its first five stops, so the line fits in a search result.)
export const tripDescription = (trip) =>
  `${trip.name}: ${trip.tagline} ${trip.places.slice(0, 5).join(', ')}${trip.places.length > 5 ? ' and more' : ''}. Get the details on WhatsApp from Wander Soul.`;

// The picture on a trip's link preview: its own photograph, cropped to the 1.91:1 shape that
// WhatsApp, Facebook and X use. (fm=jpg because link scrapers do not all read AVIF or WebP.)
export function tripImage(trip) {
  const photo = trip.photo || trip.tilePhoto || daysOf(trip).flatMap((d) => d.photos || [])[0];
  if (!photo) return null;
  return {
    url: `https://images.unsplash.com/${photo.id}?fm=jpg&fit=crop&w=1200&h=630&q=75`,
    alt: photo.alt,
    width: 1200,
    height: 630,
  };
}

// --- Structured data ----------------------------------------------------------------------

export const organizationLd = (base = '') => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  ...(base ? { '@id': `${base}/#organization`, url: base, logo: `${base}/brand/seal-640.webp`, image: `${base}/og-image.jpg` } : {}),
  name: SITE_NAME,
  ...(trust.legalName ? { legalName: trust.legalName } : {}),
  slogan: 'Travel with feeling',
  description: DEFAULT_DESCRIPTION,
  telephone: '+91-97689-95995',
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    ...(trust.address ? { streetAddress: trust.address } : {}),
    addressLocality: 'Kalyan',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      name: 'WhatsApp',
      contactType: 'customer service',
      telephone: '+91-91509-95995',
      email: site.email,
      ...(trust.languages ? { availableLanguage: trust.languages } : {}),
    },
    {
      '@type': 'ContactPoint',
      name: 'Phone',
      contactType: 'customer service',
      telephone: '+91-97689-95995',
    },
  ],
  sameAs: [site.instagram, ...trust.reviews.map((r) => r.url), ...trust.memberships.map((m) => m.url).filter(Boolean)],
  hasMap: site.mapsUrl,
});

export const websiteLd = (base = '') =>
  base
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: base,
        name: SITE_NAME,
        inLanguage: 'en-IN',
        publisher: { '@id': `${base}/#organization` },
      }
    : null;

export const faqLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const tripLd = (trip, base = '') => {
  const image = tripImage(trip);
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.name,
    description: trip.tagline,
    ...(base ? { url: `${base}/trips/${trip.slug}` } : {}),
    ...(image ? { image: image.url } : {}),
    itinerary: {
      '@type': 'ItemList',
      itemListElement: trip.places.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Place', name: p } })),
    },
    provider: base ? { '@id': `${base}/#organization` } : { '@type': 'TravelAgency', name: SITE_NAME, telephone: '+91-97689-95995' },
  };
};

// --- Everything a page says about itself -------------------------------------------------------

export function seoFor(path, base = '') {
  const trip = path.startsWith('/trips/') ? tripBySlug(path.slice('/trips/'.length)) : null;
  if (trip) {
    return {
      title: tripTitle(trip),
      description: tripDescription(trip),
      image: tripImage(trip),
      jsonLd: [tripLd(trip, base)],
    };
  }
  const page = pageSeo[path] || privatePages[path];
  if (!page) return NOT_FOUND_SEO;
  const jsonLd = {
    '/': [organizationLd(base), websiteLd(base)],
    '/about': [organizationLd(base)],
    '/contact': [organizationLd(base)],
    '/india-tours': [faqLd(indiaToursFaq)],
    '/how-it-works': [faqLd(howItWorksFaq)],
  }[path];
  return { ...page, jsonLd: (jsonLd || []).filter(Boolean) };
}
