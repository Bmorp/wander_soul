import { useEffect, useState } from 'react';
import Link from './TLink';
import Icon from './Icon';
import { inboundTrips, indiaTrips, internationalTrips } from '../data/trips';
import { onRequest } from '../data/international';
import { site, waLink, generalMessage } from '../data/site';

const COLUMNS = [
  {
    title: 'India tours',
    links: [
      ...inboundTrips.map((t) => ({ to: `/trips/${t.slug}`, label: t.name })),
      { to: '/india-tours#states', label: 'Explore by state' },
    ],
  },
  {
    title: 'Holidays in India',
    links: indiaTrips.map((t) => ({ to: `/trips/${t.slug}`, label: t.name })),
  },
  {
    title: 'International',
    links: [
      ...internationalTrips.map((t) => ({ to: `/trips/${t.slug}`, label: t.name })),
      ...onRequest.map((p) => ({ to: `/international#${p.slug}`, label: `${p.name} (on request)` })),
    ],
  },
  {
    title: 'Wander Soul',
    links: [
      { to: '/how-it-works', label: 'How it works' },
      { to: '/compare', label: 'Compare holidays' },
      { to: '/about', label: 'About us' },
      { to: '/account', label: 'Your enquiries' },
    ],
  },
  {
    title: 'Get in touch',
    links: [
      { href: waLink(generalMessage), label: 'WhatsApp', external: true },
      { href: site.phoneHref, label: site.phoneDisplay },
      { href: `mailto:${site.email}`, label: site.email },
      { href: site.instagram, label: `Instagram ${site.instagramHandle}`, external: true },
      { href: site.mapsUrl, label: site.city, external: true },
    ],
  },
];

function useDesktop() {
  const query = '(min-width: 900px)';
  const [desktop, setDesktop] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return desktop;
}

export default function Footer() {
  const desktop = useDesktop();
  return (
    <footer className="footer">
      <div className="wrap-wide">
        <div className="footer-top">
          <img className="seal" src="/brand/seal-160.webp" alt="" width="36" height="36" />
          <span>Wander Soul</span>
          <span className="muted">Travel with feeling.</span>
        </div>

        <nav className="footer-dir" aria-label="Site directory">
          {COLUMNS.map((col) => (
            <details key={col.title} className="footer-col" open={desktop || undefined}>
              <summary>
                {col.title}
                <Icon name="chevronDown" />
              </summary>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to}>{l.label}</Link>
                    ) : (
                      <a href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>

        <div className="footer-bottom">
          <span>Copyright © {new Date().getFullYear()} Wander Soul. All rights reserved.</span>
          <span className="footer-legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <span>{site.city}, India</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
