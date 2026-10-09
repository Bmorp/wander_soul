import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import { stopScroll, startScroll } from '../lib/smoothScroll';
import { requestPlaybackDecision } from '../lib/videoPlayback';
import { fadeIn, FADE_CLASS } from '../lib/fadeIn';

const WIDTHS = [800, 1200, 1600, 2400];
const src = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=max&w=${w}&q=76`;

/**
 * A full-screen photo viewer. Phones swipe (native scroll-snap); larger screens
 * use the arrows or the keyboard. Escape closes, focus stays inside while it is
 * open and returns to the photo that opened it.
 */
export default function Lightbox({ photos, start = 0, title, onClose }) {
  const root = useRef(null);
  const track = useRef(null);
  const closeRef = useRef(null);
  const [index, setIndex] = useState(start);

  useEffect(() => {
    const opener = document.activeElement;
    const el = track.current;
    el.scrollLeft = start * el.clientWidth;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stopScroll();
    closeRef.current?.focus({ preventScroll: true });
    requestPlaybackDecision();
    return () => {
      document.body.style.overflow = overflow;
      startScroll();
      opener?.focus?.({ preventScroll: true });
      window.setTimeout(requestPlaybackDecision, 50);
    };
  }, [start]);

  const go = useCallback(
    (n) => {
      const el = track.current;
      const target = Math.max(0, Math.min(photos.length - 1, n));
      el.scrollTo({ left: target * el.clientWidth, behavior: 'smooth' });
    },
    [photos.length],
  );

  // The counter follows swipes as well as buttons.
  useEffect(() => {
    const el = track.current;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(index + 1);
      else if (e.key === 'ArrowLeft') go(index - 1);
      else if (e.key === 'Tab') {
        const focusable = [...root.current.querySelectorAll('button:not([disabled])')];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, go, onClose]);

  return createPortal(
    <div ref={root} className="lightbox" role="dialog" aria-modal="true" aria-label={`${title}: photos`}>
      <div className="lightbox-bar">
        <p className="lightbox-title">
          {title}
          <span aria-live="polite">
            {' '}
            · {index + 1} of {photos.length}
          </span>
        </p>
        <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose} aria-label="Close photos">
          <Icon name="close" size={22} />
        </button>
      </div>

      <div ref={track} className="lightbox-track">
        {photos.map((p, i) => (
          <figure key={p.id} className="lightbox-slide">
            <img
              {...fadeIn}
              className={FADE_CLASS}
              loading={Math.abs(i - start) <= 1 ? 'eager' : 'lazy'}
              decoding="async"
              src={src(p.id, 1600)}
              srcSet={WIDTHS.map((w) => `${src(p.id, w)} ${w}w`).join(', ')}
              sizes="100vw"
              alt={p.alt}
            />
            <figcaption>{p.caption}</figcaption>
          </figure>
        ))}
      </div>

      {photos.length > 1 ? (
        <>
          <button type="button" className="lightbox-arrow is-prev" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous photo">
            <Icon name="chevronLeft" size={26} />
          </button>
          <button
            type="button"
            className="lightbox-arrow is-next"
            onClick={() => go(index + 1)}
            disabled={index === photos.length - 1}
            aria-label="Next photo"
          >
            <Icon name="chevronRight" size={26} />
          </button>
        </>
      ) : null}
    </div>,
    document.body,
  );
}
