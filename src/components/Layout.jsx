import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import GlobalNav from './GlobalNav';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';
import Intro from './Intro';
import Cursor from './Cursor';
import { startSmoothScroll, stopSmoothScroll, scrollToTop, scrollToElement } from '../lib/smoothScroll';
import { gsap, ScrollTrigger, reduceMotion } from '../lib/motion';
import { setPageScene, setSectionScene, setHoverScene } from '../lib/sound';
import { tripBySlug, sceneOf } from '../data/trips';

// Which sound scene a page opens with, before any section takes over.
function pageSceneFor(pathname) {
  const trip = pathname.match(/^\/trips\/([^/]+)/);
  if (trip) {
    const t = tripBySlug(trip[1]);
    return t ? sceneOf(t) : 'india';
  }
  if (pathname.startsWith('/international')) return 'world';
  return 'india';
}

function PageFallback() {
  return <div className="page-loading" aria-hidden="true" />;
}

// Primary buttons lean towards the pointer, just a little (fine pointers only).
// The lean goes through the `translate` property (--mx, --my), so the button's own
// hover lift and press still work on `transform`.
function useMagnetic() {
  useEffect(() => {
    if (reduceMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let current = null;
    const settle = (el) => gsap.to(el, { '--mx': '0px', '--my': '0px', duration: 0.6, ease: 'expo.out' });
    const move = (e) => {
      const el = e.target.closest?.('.btn-gold, .magnetic');
      if (current && current !== el) {
        settle(current);
        current = null;
      }
      if (!el) return;
      current = el;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      gsap.to(el, { '--mx': `${dx * 10}px`, '--my': `${dy * 8}px`, duration: 0.5, ease: 'expo.out' });
    };
    const leave = () => {
      if (current) settle(current);
      current = null;
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  const navigation = useNavigation();
  const isTripPage = /^\/trips\/[^/]+/.test(pathname);
  const firstPath = useRef(pathname);
  const navigated = useRef(false);
  if (pathname !== firstPath.current) navigated.current = true;

  useEffect(() => {
    startSmoothScroll();
    return stopSmoothScroll;
  }, []);

  useMagnetic();

  // New page: to the top (or the anchor) before the browser takes its picture of the
  // new page, so a view transition morphs into the right place. A new anchor on the
  // same page (footer link to /international#bali while on /international) scrolls too.
  useLayoutEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) scrollToElement(target);
    else scrollToTop();
    setPageScene(pageSceneFor(pathname));
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(refresh);
  }, [pathname, hash]);

  // Reveals: [data-reveal] blocks, [data-ink] Hindi names, [data-unveil] pictures.
  // Scenes: [data-scene] sections and [data-hover-scene] cards.
  useEffect(() => {
    const main = document.getElementById('main');
    if (!main) return undefined;

    const revealer = !reduceMotion()
      ? new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add('is-in');
                revealer.unobserve(e.target);
              }
            }),
          { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
        )
      : null;

    const active = new Set();
    const scenes = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? active.add(e.target) : active.delete(e.target)));
        const last = [...active].pop();
        setSectionScene(last ? last.dataset.scene : null);
      },
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
    );

    const scan = () => {
      if (revealer) {
        main.querySelectorAll('[data-reveal]:not(.is-in), [data-ink]:not(.is-in), [data-unveil]:not(.is-in)').forEach((el) => revealer.observe(el));
      }
      main.querySelectorAll('[data-scene]').forEach((el) => scenes.observe(el));
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(main, { childList: true, subtree: true });

    const over = (e) => setHoverScene(e.target.closest('[data-hover-scene]')?.dataset.hoverScene || null);
    main.addEventListener('pointerover', over);

    return () => {
      revealer?.disconnect();
      scenes.disconnect();
      mo.disconnect();
      main.removeEventListener('pointerover', over);
    };
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className={`route-bar${navigation.state === 'loading' ? ' is-loading' : ''}`} aria-hidden="true" />
      <Intro />
      <Cursor />
      <GlobalNav sticky={!isTripPage} />
      <main id="main" tabIndex={-1}>
        <ErrorBoundary key={pathname}>
          {/* After the first page, each new page fades in (where the browser can't morph). */}
          <div className={navigated.current ? 'page page-in' : 'page'}>
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
