import { useEffect, useRef, useState } from 'react';

const WIDE = '(min-width: 1360px)';

// Is the ground at this point light (paper, mist) or dark (night, navy, forest, film)?
function lightAt(x, y) {
  let el = document.elementFromPoint(x, y);
  while (el && el !== document.documentElement) {
    if (el.tagName === 'IMG' || el.tagName === 'VIDEO') return false;
    const c = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    if (c && (c[3] === undefined || Number(c[3]) > 0.5)) return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] > 150;
    el = el.parentElement;
  }
  return true;
}

/**
 * Wide screens: the page as a journey. A dashed flight path runs down the left
 * margin, a small plane travels along it as you scroll, and the chapter you are in
 * is named beside it, in gold on dark grounds and brass on light ones. Chapters
 * are the sections marked [data-chapter].
 */
export default function JourneyProgress() {
  const ref = useRef(null);
  const [chapter, setChapter] = useState('');

  useEffect(() => {
    const el = ref.current;
    const wide = window.matchMedia(WIDE);
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!wide.matches) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      el.style.setProperty('--p', p.toFixed(4));
      // The path runs from 28% to 72% of the screen; read the ground beside the plane.
      el.classList.toggle('is-light', lightAt(40, window.innerHeight * (0.28 + 0.44 * p)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    wide.addEventListener('change', schedule);

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setChapter(e.target.dataset.chapter);
        }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    document.querySelectorAll('[data-chapter]').forEach((n) => io.observe(n));
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      wide.removeEventListener('change', schedule);
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="journey" aria-hidden="true">
      <span className="journey-path" />
      <span className="journey-plane">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
        <span key={chapter} className="journey-label">
          {chapter}
        </span>
      </span>
    </div>
  );
}
