import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, reduceMotion } from '../lib/motion';
import { enableSound } from '../lib/sound';
import { stopScroll, startScroll } from '../lib/smoothScroll';

const KEY = 'ws_opening_seen';
export const INTRO_DONE = 'ws:intro-done';

// Plays once per visit, only when the visit starts on the home page.
const shouldPlay = () => {
  if (typeof window === 'undefined' || reduceMotion() || window.location.pathname !== '/') return false;
  try {
    return !sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
};

// Read once at load, so the hero knows to wait for the curtain.
export const introWillPlay = shouldPlay();
if (typeof window !== 'undefined') window.__wsIntro = introWillPlay;

/**
 * The opening: यात्रा (the journey) is written in gold, the name settles beneath
 * it, and the curtain lifts into the film. A tap skips ahead; "Enter with sound"
 * starts the sounds of India on the way in. Under two seconds and a half.
 */
export default function Intro() {
  const ref = useRef(null);
  const tl = useRef(null);
  const [show, setShow] = useState(introWillPlay);

  useLayoutEffect(() => {
    if (!show) return undefined;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* private mode: it simply plays again next time */
    }
    // Smooth scrolling starts just after this; hold it still until the curtain lifts.
    const hold = window.setTimeout(stopScroll, 0);
    const q = gsap.utils.selector(ref);
    const done = () => {
      window.__wsIntro = false;
      window.dispatchEvent(new Event(INTRO_DONE));
    };
    const t = gsap.timeline({ paused: true, onComplete: () => setShow(false) });
    t.fromTo(q('.intro-word'), { clipPath: 'inset(-20% 100% -30% 0)' }, { clipPath: 'inset(-20% 0% -30% 0)', duration: 1.15, ease: 'power2.inOut' })
      .fromTo(q('.intro-line'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.65)
      .fromTo(q('.intro-sound'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0.5)
      .addLabel('lift', 1.75)
      .call(done, null, 'lift')
      .call(() => startScroll(), null, 'lift')
      .to(q('.intro-inner'), { y: -40, autoAlpha: 0, duration: 0.6, ease: 'expo.in' }, 'lift')
      .to(q('.intro-sound'), { autoAlpha: 0, duration: 0.3 }, 'lift')
      .fromTo(ref.current, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.95, ease: 'expo.inOut' }, 'lift+=0.15');
    tl.current = t;

    // Start once the Hindi face is ready (or after a short wait), so it never shows a fallback.
    let started = false;
    const start = () => {
      if (!started) {
        started = true;
        t.play();
      }
    };
    document.fonts.load('400 100px "Tiro Devanagari Hindi"', 'यात्रा').then(start, start);
    const fallback = window.setTimeout(start, 900);

    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skipAhead();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      started = true; // a font promise that settles later must not revive this timeline
      window.clearTimeout(fallback);
      window.clearTimeout(hold);
      document.removeEventListener('keydown', onKey);
      t.kill();
      startScroll();
      // Gone mid-opening for real (not StrictMode's rehearsal, which keeps the node):
      // release whatever waits for the curtain.
      window.setTimeout(() => {
        if (window.__wsIntro && !ref.current) done();
      }, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const skipAhead = () => {
    const t = tl.current;
    if (!t) return;
    if (!t.isActive()) t.play();
    if (t.time() < t.labels.lift) t.seek('lift');
  };

  const withSound = (e) => {
    e.stopPropagation();
    enableSound();
    skipAhead();
  };

  if (!show) return null;
  return (
    <div className="intro" ref={ref} onClick={skipAhead}>
      <div className="intro-inner">
        <p className="intro-word" lang="hi" aria-hidden="true">
          यात्रा
        </p>
        <p className="intro-line">
          <span className="intro-brand">Wander Soul</span>
          <span className="intro-tag">yātrā · the journey</span>
        </p>
      </div>
      <button type="button" className="intro-sound" onClick={withSound}>
        <span className="eq" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        Enter with sound
      </button>
    </div>
  );
}
