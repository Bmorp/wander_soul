import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, reduceMotion } from '../lib/motion';

const INTRO_DONE = 'ws:intro-done';

/**
 * Headings that move with intent. Four kinds, so no two moments feel the same:
 *  - default (`immediate` or `animate`): lines rise out of a mask.
 *  - `variant="chars"`: letters rise out of a soft blur, one after another
 *    (the opening title and the closing question).
 *  - `scrub`: lines slide up as you scroll, tied to the scroll itself
 *    (section headlines, so reading and motion stay in step).
 *  - `variant="spread"`: letters gather from wide spacing as the block arrives
 *    (destination names on the international panels).
 * Without any of these it is a plain heading. The text is real text throughout.
 */
export default function SplitHeading({
  as: Tag = 'h2',
  immediate = false,
  animate = false,
  scrub = false,
  variant = 'lines',
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);
  const moving = immediate || animate || scrub;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !moving) return undefined;
    if (reduceMotion()) {
      el.removeAttribute('data-split');
      return undefined;
    }
    let split = null;
    let cancelled = false;
    let waiting = null;
    let st = null;
    const reveal = () => el.removeAttribute('data-split');
    const fallback = window.setTimeout(reveal, 3200);
    const chars = variant === 'chars' || variant === 'spread';

    document.fonts.ready.then(() => {
      if (cancelled) return;
      split = SplitText.create(el, {
        type: chars ? 'lines,words,chars' : 'lines',
        mask: chars ? undefined : 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          reveal();
          if (scrub) {
            return gsap.fromTo(
              self.lines,
              { yPercent: 110 },
              { yPercent: 0, ease: 'none', stagger: 0.14, scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 62%', scrub: 0.5 } },
            );
          }
          if (variant === 'spread') {
            const mid = (self.chars.length - 1) / 2;
            return gsap.fromTo(
              self.chars,
              { x: (i) => (i - mid) * 26, opacity: 0.15 },
              {
                x: 0,
                opacity: 1,
                ease: 'none',
                scrollTrigger: { trigger: el.closest('section') || el, start: 'top 85%', end: 'top 15%', scrub: 0.5 },
              },
            );
          }
          const tween = chars
            ? gsap.from(self.chars, {
                yPercent: 70,
                rotateX: -50,
                opacity: 0,
                filter: 'blur(14px)',
                transformOrigin: '50% 100%',
                duration: 1.3,
                stagger: 0.028,
                ease: 'expo.out',
                delay,
                paused: true,
              })
            : gsap.from(self.lines, { yPercent: 105, duration: 1.05, stagger: 0.08, delay, ease: 'expo.out', paused: true });

          if (immediate) {
            // On the first visit the opening plays first; the title waits for its curtain.
            if (window.__wsIntro) {
              waiting = () => tween.play();
              window.addEventListener(INTRO_DONE, waiting, { once: true });
            } else tween.play();
          } else {
            st?.kill();
            st = ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => tween.play() });
          }
          return tween;
        },
      });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      if (waiting) window.removeEventListener(INTRO_DONE, waiting);
      st?.kill();
      split?.revert();
    };
  }, [moving, immediate, scrub, variant, delay]);

  return (
    <Tag
      ref={ref}
      className={`${className}${variant === 'chars' ? ' split-chars' : ''}`}
      data-split={immediate || variant !== 'lines' ? 'pending' : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
