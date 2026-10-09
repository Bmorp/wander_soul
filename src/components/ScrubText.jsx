import { useLayoutEffect, useRef } from 'react';
import { gsap, SplitText, reduceMotion } from '../lib/motion';

// A statement that lights up word by word as you scroll through it.
export default function ScrubText({ as: Tag = 'p', className = '', children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion()) return undefined;
    let split = null;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      split = SplitText.create(el, {
        type: 'words',
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.22 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
            },
          );
        },
      });
    });
    return () => {
      cancelled = true;
      split?.revert();
    };
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
