import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Link from './TLink';
import Icon from './Icon';
import { site, waLink, generalMessage } from '../data/site';
import { stopScroll, startScroll } from '../lib/smoothScroll';
import SoundToggle from './SoundToggle';
import Roll from './Roll';
import { requestPlaybackDecision } from '../lib/videoPlayback';

export const NAV_LINKS = [
  { to: '/india-tours', label: 'Discover India' },
  { to: '/holidays', label: 'Holidays in India' },
  { to: '/international', label: 'International' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function GlobalNav({ sticky = true }) {
  const { pathname, search } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setTucked(false);
  }, [pathname, search]);

  // Solid once the page moves; tucked away while reading down, back on the way up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setTucked(y > last && y > 480);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)');
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Films under the open menu pause; they pick up again when it closes.
  useEffect(() => {
    const t = window.setTimeout(requestPlaybackDecision, open ? 0 : 360);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stopScroll();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    menuRef.current?.querySelector('a')?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prevOverflow;
      startScroll();
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const current = (to) => (pathname === to || pathname.startsWith(`${to}/`) ? 'page' : undefined);
  const classes = ['nav', !sticky && 'is-static', scrolled && 'is-solid', open && 'is-open', tucked && sticky && !open && 'is-tucked']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={classes} onFocusCapture={() => setTucked(false)}>
        <nav className="nav-inner wrap" aria-label="Main">
          <Link to="/" className="brand" onClick={close}>
            <img className="seal" src="/brand/seal-160.webp" alt="" width="38" height="38" />
            <span className="brand-name">Wander Soul</span>
          </Link>

          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} aria-current={current(l.to)}>
                <Roll>{l.label}</Roll>
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <SoundToggle className="icon-btn" />
            <a
              className="icon-btn"
              href={waLink(generalMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Wander Soul on WhatsApp"
            >
              <Icon name="whatsapp" size={20} />
            </a>
            <Link className="btn btn-gold btn-sm nav-plan" to="/contact">
              <Roll>Plan your trip</Roll>
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="icon-btn menu-toggle"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="bars" aria-hidden="true">
                <span className="bar" />
                <span className="bar" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div id="site-menu" ref={menuRef} className={`menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <nav className="wrap" aria-label="Menu">
          <ul className="menu-links">
            {NAV_LINKS.map((l, i) => (
              <li key={l.to} style={{ '--i': i }}>
                <Link to={l.to} onClick={close} tabIndex={open ? 0 : -1} aria-current={current(l.to)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu-sub">
            <SoundToggle variant="pill" />
            <a href={waLink(generalMessage)} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
              <Icon name="whatsapp" /> Chat on WhatsApp
            </a>
            <a href={site.phoneHref} tabIndex={open ? 0 : -1}>
              <Icon name="phone" /> {site.phoneDisplay}
            </a>
            <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1}>
              <Icon name="mail" /> {site.email}
            </a>
            <Link to="/account" onClick={close} tabIndex={open ? 0 : -1}>
              <Icon name="user" /> Your enquiries
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
