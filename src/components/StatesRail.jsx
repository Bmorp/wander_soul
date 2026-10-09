import { useLayoutEffect, useRef } from 'react';
import { gsap, reduceMotion } from '../lib/motion';

// On large screens the section pins and its cards travel sideways as you scroll;
// on phones (and with reduced motion) it is a plain swipeable row.
export default function StatesRail({ head, children, label, className = '', ...rest }) {
  const section = useRef(null);
  const track = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion()) return undefined;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const distance = () => Math.max(0, track.current.scrollWidth - track.current.clientWidth);
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      return () => tween.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className={`rail ${className}`} {...rest}>
      {head}
      <div className="rail-track" ref={track} role="list" aria-label={label}>
        {children}
      </div>
    </section>
  );
}
