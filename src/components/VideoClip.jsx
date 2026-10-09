import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { registerClip, requestPlaybackDecision } from '../lib/videoPlayback';
import { fadeIn, FADE_CLASS } from '../lib/fadeIn';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = () => navigator.connection?.saveData === true;
const slowNetwork = () => /(^|-)2g$|^3g$/.test(navigator.connection?.effectiveType || '');
const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Poster sizes for a slot that fills the screen. On a phone that slot is tall, so a wide
// frame is cropped to its middle and spans about 178vh. The posters themselves are only
// 1084 to 1445px wide, so a larger request returns the same picture in a bigger file (the
// Taj poster is 72 KB at 1280 and 213 KB at 2560): the widths are capped to what the
// pictures actually hold. (index.html preloads the first poster with this same value.)
export const FULL_BLEED = '(max-width: 899px) min(178vh, 640px), min(100vw, 960px)';

// The sharpest file the slot can use. The slot is measured unscaled (a film that grows
// into place is judged at full size), and a tall slot that crops a wide film needs the
// film's full width: height x 16/9. Full-screen films get 1080p (1440p on large,
// high-density screens); cards get 720p or 540p; slow networks get 540p.
// Phones stop at 720p: on a phone screen 1080p looks the same and costs twice the data. And
// only a slot that fills the screen gets 720p there; a card or a half-height frame gets
// 540p, which is still sharp at that size and about a third lighter.
const fileFor = (video, wrap) => {
  if (slowNetwork()) return video.sd;
  const need = Math.max(wrap.offsetWidth, (wrap.offsetHeight * 16) / 9) * Math.min(window.devicePixelRatio || 1, 2);
  if (window.innerWidth < 900) return need > 1500 ? video.hd : video.sd;
  if (need > 2400 && video.qhd) return video.qhd;
  if (need > 1500 && video.fhd) return video.fhd;
  if (need > 900) return video.hd;
  return video.sd;
};

/**
 * Footage that behaves. The poster frame shows first (sized to its slot through
 * srcset); the film loads only when it is about to play. Which films actually
 * play is decided in one place (lib/videoPlayback), so a long page never runs a
 * stack of decoders at once. Reduced motion and data saver keep the poster only.
 *
 * mode "inview": plays while it is well inside the viewport.
 * mode "hover":  plays while the nearest [data-hover-play] is hovered or focused
 *                (poster only on touch screens).
 * mode "manual": plays while `active` and on screen; `warm` preloads the file.
 */
export default function VideoClip({
  video,
  mode = 'inview',
  active = false,
  warm = false,
  priority = false,
  sizes = '100vw',
  className = '',
  label,
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [allowed] = useState(() => typeof window !== 'undefined' && !reducedMotion() && !saveData());
  const state = useRef({ ratio: 0, area: 0, hovered: false, active, mode, loaded: false });

  // The poster is only added to the page once its frame is within about a screen of view
  // (the browser's own loading="lazy" proved to fetch every poster on the page at once).
  // A frame inside a sideways-scrolling rail is clipped by the rail until swiped into view,
  // so the rail itself is what gets watched: its pictures are ready before they are swiped to.
  const [shown, setShown] = useState(priority);
  useEffect(() => {
    if (shown) return undefined;
    const wrap = wrapRef.current;
    if (!wrap || typeof IntersectionObserver !== 'function') {
      setShown(true);
      return undefined;
    }
    let target = wrap;
    for (let el = wrap.parentElement; el && el !== document.body; el = el.parentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(el).overflowX) && el.scrollWidth > el.clientWidth + 1) {
        target = el;
        break;
      }
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '800px 600px' },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [shown]);

  useLayoutEffect(() => {
    state.current.active = active;
    state.current.mode = mode;
    requestPlaybackDecision();
  }, [active, mode]);

  useEffect(() => {
    if (!allowed || !video) return undefined;
    const wrap = wrapRef.current;
    const el = videoRef.current;
    if (!wrap || !el) return undefined;
    const s = state.current;

    // Films are scenery: no picture-in-picture or casting buttons over them.
    el.disablePictureInPicture = true;
    el.disableRemotePlayback = true;

    const load = () => {
      if (s.loaded) return;
      el.muted = true;
      el.src = fileFor(video, wrap);
      s.loaded = true;
    };
    const release = () => {
      if (!s.loaded) return;
      el.pause();
      el.removeAttribute('src');
      el.load();
      s.loaded = false;
      wrap.classList.remove('is-playing');
    };

    const clip = {
      set ratio(v) {
        s.ratio = v;
      },
      set area(v) {
        s.area = v;
      },
      wants() {
        if (s.mode === 'manual') return s.active && s.ratio > 0.05;
        if (s.mode === 'hover') return s.hovered && s.ratio > 0;
        return s.ratio >= 0.4;
      },
      rank() {
        return (s.hovered ? 4e9 : 0) + (s.mode === 'manual' ? 2e9 : 0) + s.area;
      },
      setPlaying(on) {
        if (on) {
          load();
          if (el.paused) el.play()?.catch(() => {});
        } else if (s.loaded && !el.paused) {
          el.pause();
        }
      },
      setNear(near) {
        if (!near) release();
      },
    };
    const unregister = registerClip(wrap, clip);

    const onPlaying = () => wrap.classList.add('is-playing');
    el.addEventListener('playing', onPlaying);

    let host = null;
    const enter = () => {
      s.hovered = true;
      requestPlaybackDecision();
    };
    const leave = () => {
      s.hovered = false;
      requestPlaybackDecision();
    };
    if (s.mode === 'hover' && canHover()) {
      host = wrap.closest('[data-hover-play]') || wrap.parentElement;
      host.addEventListener('pointerenter', enter);
      host.addEventListener('pointerleave', leave);
      host.addEventListener('focusin', enter);
      host.addEventListener('focusout', leave);
    }

    return () => {
      unregister();
      el.removeEventListener('playing', onPlaying);
      if (host) {
        host.removeEventListener('pointerenter', enter);
        host.removeEventListener('pointerleave', leave);
        host.removeEventListener('focusin', enter);
        host.removeEventListener('focusout', leave);
      }
      release();
    };
  }, [allowed, video]);

  // The next film in a sequence loads a moment after the current one starts.
  useEffect(() => {
    if (!allowed || !warm || !video) return undefined;
    const timer = window.setTimeout(() => {
      const s = state.current;
      const el = videoRef.current;
      const wrap = wrapRef.current;
      if (!el || !wrap || s.loaded) return;
      el.muted = true;
      // Phones fetch only the start of the next film; larger screens buffer it.
      el.preload = window.innerWidth < 900 ? 'metadata' : 'auto';
      el.src = fileFor(video, wrap);
      s.loaded = true;
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [allowed, warm, video]);

  if (!video) return null;

  return (
    <div ref={wrapRef} className={`clip ${className}`}>
      {shown ? (
        <img
          {...(priority ? {} : fadeIn)}
          className={priority ? 'clip-poster' : `clip-poster ${FADE_CLASS}`}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          decoding="async"
          src={video.poster}
          srcSet={video.posterSet}
          sizes={sizes}
          alt={label ?? video.label}
        />
      ) : null}
      {allowed ? (
        <video ref={videoRef} className="clip-video" muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
      ) : null}
    </div>
  );
}
