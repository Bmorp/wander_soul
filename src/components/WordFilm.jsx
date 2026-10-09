import { useLayoutEffect, useRef, useState } from 'react';
import VideoClip, { FULL_BLEED } from './VideoClip';
import { gsap, ScrollTrigger, reduceMotion } from '../lib/motion';
import { jumpTo } from '../lib/smoothScroll';

const FACE = '"Tiro Devanagari Hindi"';

// The word's size: its ink box at a given font size.
function inkBox(word, size) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `${size}px ${FACE}, serif`;
  const m = ctx.measureText(word);
  return {
    width: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
    asc: m.actualBoundingBoxAscent,
    desc: m.actualBoundingBoxDescent,
  };
}

// Draw the word exactly as the mask draws it (same size, centred, same baseline) and
// find its headline: the shirorekha, the bar that joins Devanagari letters. It is the
// row with the most ink; the zoom aims at a solid point on it, so flying in lands in film.
function findBar(word, size, W, H, baseline) {
  const c = document.createElement('canvas');
  c.width = Math.ceil(W);
  c.height = Math.ceil(H);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.font = `${size}px ${FACE}, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(word, W / 2, baseline);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);
  const ink = (x, y) => data[(y * c.width + x) * 4 + 3] > 140;
  let best = 0;
  let row = 0;
  const counts = new Array(c.height).fill(0);
  for (let y = 0; y < c.height; y += 1) {
    let n = 0;
    for (let x = 0; x < c.width; x += 2) if (ink(x, y)) n += 1;
    counts[y] = n;
    if (n > best) {
      best = n;
      row = y;
    }
  }
  let top = row;
  let bottom = row;
  while (top > 0 && counts[top - 1] > best * 0.8) top -= 1;
  while (bottom < c.height - 1 && counts[bottom + 1] > best * 0.8) bottom += 1;
  const y = Math.round((top + bottom) / 2);
  // The solid column nearest the middle, inked through the whole bar.
  const solid = (x) => ink(x, top) && ink(x, y) && ink(x, bottom);
  let x = Math.round(W / 2);
  for (let d = 0; d < W / 2; d += 1) {
    if (solid(x + d)) {
      x += d;
      break;
    }
    if (solid(x - d)) {
      x -= d;
      break;
    }
  }
  return { x, y, thick: Math.max(1, bottom - top + 1) };
}

/**
 * The film inside the word. भारत (India) is cut out of the night, with the film
 * playing through its letters. Scrolling flies you in through the gold bar that
 * joins the letters until the film fills the screen, and then the words arrive.
 */
export default function WordFilm({ video, word = 'भारत', reading = 'bhārat', meaning = 'India', title, children }) {
  const section = useRef(null);
  const stage = useRef(null);
  const mask = useRef(null);
  const copy = useRef(null);
  const hint = useRef(null);
  const [geo, setGeo] = useState(null);
  const [still] = useState(() => typeof window !== 'undefined' && reduceMotion());

  // Fit the word to the screen once the Hindi face has loaded, and again on resize.
  useLayoutEffect(() => {
    if (still) return undefined;
    let cancelled = false;
    let fontReady = false;
    const fit = () => {
      if (cancelled || !fontReady || !stage.current) return;
      const W = stage.current.clientWidth;
      const H = stage.current.clientHeight;
      // A page opened in a background tab has no size yet; the observer below fits it
      // once it does.
      if (!W || !H) return;
      const probe = inkBox(word, 100);
      if (!probe.width) return;
      const target = W * (W < 700 ? 0.86 : 0.64);
      const size = Math.min((100 * target) / probe.width, H * 0.62);
      const box = inkBox(word, size);
      // Hang the word from the screen's centre line: its headline sits exactly mid-height,
      // the letters below it, so flying into the bar fills the screen evenly.
      const probeBase = H / 2 + (box.asc - box.desc) / 2;
      const bar = findBar(word, size, W, H, probeBase);
      const shift = H / 2 - bar.y;
      const baseline = probeBase + shift;
      const next = { W, H, size, baseline, ox: bar.x, oy: bar.y + shift, scale: (H / bar.thick) * 2.2 };
      // The same fit again changes nothing, so it must not rebuild the scroll animation.
      setGeo((prev) => (prev && ['W', 'H', 'size', 'baseline', 'ox', 'oy', 'scale'].every((k) => prev[k] === next[k]) ? prev : next));
    };
    const start = () => {
      fontReady = true;
      fit();
    };
    document.fonts.load(`400 100px ${FACE}`, word).then(start, start);
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(fit, 150);
    };
    window.addEventListener('resize', onResize);
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(onResize) : null;
    if (observer && stage.current) observer.observe(stage.current);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
      observer?.disconnect();
    };
  }, [word, still]);

  useLayoutEffect(() => {
    if (!geo || still) return undefined;
    // The copy takes clicks only once it has arrived.
    const live = (self) => copy.current?.classList.toggle('is-live', self.progress > 0.76);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: live, onRefresh: live },
      });
      // Every segment states where it starts (and none renders early), so the timeline never
      // depends on the order it was first drawn in: scrolling back plays exactly the way down.
      tl.fromTo(mask.current, { scale: 0.94 }, { scale: 1, duration: 0.12 })
        .fromTo(hint.current, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -10, duration: 0.08, immediateRender: false }, 0.1)
        .fromTo(mask.current, { scale: 1 }, { scale: geo.scale, duration: 0.56, ease: 'power3.in', immediateRender: false }, 0.14)
        .fromTo(mask.current, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.06, immediateRender: false }, 0.64)
        .fromTo(copy.current, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.16, ease: 'expo.out' }, 0.72)
        .to({}, { duration: 0.12 });
    }, section);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [geo, still]);

  // Keyboard focus can land on the copy before scrolling has shown it: go to where it shows.
  const onFocus = () => {
    const s = section.current;
    if (still || !s || copy.current.classList.contains('is-live')) return;
    jumpTo(s.getBoundingClientRect().top + window.scrollY + (s.offsetHeight - window.innerHeight) * 0.96);
  };

  return (
    <section ref={section} className={`wordfilm${still ? ' is-still' : ''}`} aria-label={title}>
      <div ref={stage} className="wordfilm-stage">
        <div className="wordfilm-film">
          <VideoClip video={video} mode="inview" sizes={FULL_BLEED} />
          <div className="wordfilm-shade" />
        </div>
        {geo ? (
          <svg
            ref={mask}
            className="wordfilm-mask"
            width={geo.W}
            height={geo.H}
            viewBox={`0 0 ${geo.W} ${geo.H}`}
            style={{ transformOrigin: `${geo.ox}px ${geo.oy}px` }}
            aria-hidden="true"
          >
            <defs>
              <mask id="wordfilm-cut" maskUnits="userSpaceOnUse" x={-geo.W} y={-geo.H} width={geo.W * 3} height={geo.H * 3}>
                <rect x={-geo.W} y={-geo.H} width={geo.W * 3} height={geo.H * 3} fill="#fff" />
                <text x={geo.W / 2} y={geo.baseline} textAnchor="middle" fontSize={geo.size} className="wordfilm-letters" lang="hi">
                  {word}
                </text>
              </mask>
            </defs>
            <rect x={-geo.W} y={-geo.H} width={geo.W * 3} height={geo.H * 3} className="wordfilm-night" mask="url(#wordfilm-cut)" />
          </svg>
        ) : null}
        {geo ? (
          <p ref={hint} className="wordfilm-hint" style={{ top: geo.baseline + geo.size * 0.28 }}>
            <i lang="hi-Latn">{reading}</i> · {meaning}
          </p>
        ) : null}
        <div ref={copy} className="wordfilm-copy wrap" onFocus={onFocus}>
          <h2 className="display">{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}
