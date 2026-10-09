import { useEffect } from 'react';
import { DEFAULT_DESCRIPTION, fullTitle, seoFor } from '../data/seo';

function meta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (content == null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Per-page title, description, picture, social card text and structured data. The words come
 * from data/seo.js, which the build also uses to write them into each page's own HTML.
 * `jsonLd` is one structured-data object or a list of them.
 */
export default function useSeo({ title, description, jsonLd, noindex = false, image } = {}) {
  const list = jsonLd ? [].concat(jsonLd).filter(Boolean) : [];
  const ld = list.length ? JSON.stringify(list.length === 1 ? list[0] : list) : '';
  const imageKey = image ? image.url : '';
  useEffect(() => {
    const full = fullTitle(title);
    const desc = description || DEFAULT_DESCRIPTION;
    document.title = full;
    meta('name', 'description', desc);
    meta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    meta('property', 'og:title', full);
    meta('property', 'og:description', desc);
    meta('property', 'og:url', window.location.origin + window.location.pathname.replace(/(.)\/+$/, '$1'));
    meta('name', 'twitter:title', full);
    meta('name', 'twitter:description', desc);

    // The picture on a link preview: the page's own, or the Wander Soul card.
    const picture = image || { url: `${window.location.origin}/og-image.jpg`, alt: 'Wander Soul: travel with feeling', width: 1200, height: 630 };
    meta('property', 'og:image', picture.url);
    meta('property', 'og:image:alt', picture.alt || null);
    meta('property', 'og:image:width', picture.width ? String(picture.width) : null);
    meta('property', 'og:image:height', picture.height ? String(picture.height) : null);
    meta('name', 'twitter:image', picture.url);

    // Each page is its own canonical address (without ?trip= or #anchor variations).
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    // (A host may serve a page at /trips/goa/; the address is the same page.)
    canonical.href = window.location.origin + window.location.pathname.replace(/(.)\/+$/, '$1');

    let script = document.getElementById('ld-page');
    if (ld) {
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'ld-page';
        document.head.appendChild(script);
      }
      script.textContent = ld;
    } else if (script) {
      script.remove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, ld, noindex, imageKey]);
}

// A page that is in data/seo.js: useRouteSeo('/about').
export function useRouteSeo(path) {
  useSeo(seoFor(path, typeof window === 'undefined' ? '' : window.location.origin));
}
