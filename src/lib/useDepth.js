import { useLayoutEffect } from 'react';
import { gsap, reduceMotion } from './motion';

/**
 * Depth for a picture inside its frame: as the frame crosses the screen, the
 * picture drifts a little slower than the page. The element must be taller
 * than its frame (see `.depth` in index.css). Transform only, scrubbed to scroll.
 */
export function useDepth(ref, distance = 7) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion()) return undefined;
    const tween = gsap.fromTo(
      el,
      { yPercent: -distance },
      {
        yPercent: distance,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, distance]);
}

/**
 * An opening section that eases away as you scroll past it: the film sinks
 * slower than the page and the words fade, so leaving the first screen feels
 * like moving through it rather than off it.
 */
export function useExitDepth(sectionRef, mediaSelector, bodySelector) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || reduceMotion()) return undefined;
    const ctx = gsap.context(() => {
      const scrub = { trigger: section, start: 'top top', end: 'bottom top', scrub: true };
      const media = section.querySelector(mediaSelector);
      const body = bodySelector ? section.querySelector(bodySelector) : null;
      if (media) gsap.fromTo(media, { yPercent: 0 }, { yPercent: 18, ease: 'none', scrollTrigger: scrub });
      if (body) gsap.fromTo(body, { y: 0, opacity: 1 }, { y: -48, opacity: 0, ease: 'none', scrollTrigger: { ...scrub, end: '70% top' } });
    }, section);
    return () => ctx.revert();
  }, [sectionRef, mediaSelector, bodySelector]);
}
