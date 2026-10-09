import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, reduceMotion } from '../lib/motion';

const FACE = '"Tiro Devanagari Hindi"';

/**
 * A Hindi word set in Tiro Devanagari Hindi that writes itself: the gold
 * outline is drawn first, then the ink fills in. The caption gives the reading
 * and the meaning for visitors who don't read Devanagari.
 * `immediate` plays on mount (an opening title); otherwise it plays once in view.
 */
export default function InkWord({ word, reading, meaning, label, className = '', immediate = false, delay = 0 }) {
  const svgRef = useRef(null);
  const textRef = useRef(null);
  const [box, setBox] = useState(null);

  // Fit the drawing to the ink of the word (not the font's line box) once the face has loaded.
  useLayoutEffect(() => {
    let cancelled = false;
    const fit = () => {
      if (cancelled) return;
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = `100px ${FACE}, serif`;
      const m = ctx.measureText(word);
      const pad = 6;
      const left = m.actualBoundingBoxLeft;
      const width = left + m.actualBoundingBoxRight;
      const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      if (width > 0) setBox(`${-left - pad} ${100 - m.actualBoundingBoxAscent - pad} ${width + pad * 2} ${height + pad * 2}`);
    };
    document.fonts
      .load(`400 100px ${FACE}`, word)
      .then(fit)
      .catch(fit);
    return () => {
      cancelled = true;
    };
  }, [word]);

  useLayoutEffect(() => {
    const t = textRef.current;
    if (!box || !t || reduceMotion()) return undefined;
    const tl = gsap.timeline({
      delay,
      scrollTrigger: immediate ? undefined : { trigger: svgRef.current, start: 'top 85%', once: true },
    });
    tl.fromTo(t, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut' })
      .fromTo(t, { fillOpacity: 0 }, { fillOpacity: 1, duration: 1.1, ease: 'power1.out' }, '-=1')
      .to(t, { strokeOpacity: 0.35, duration: 0.9, ease: 'power1.out' }, '<0.3');
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [box, immediate, delay]);

  return (
    <figure className={`ink ${className}`}>
      <svg
        ref={svgRef}
        className={`ink-word${box ? ' is-fit' : ''}`}
        viewBox={box || '0 0 300 140'}
        role="img"
        aria-label={reading ? `${word} (${reading}): ${meaning}` : label || word}
      >
        <text ref={textRef} x="0" y="100" fontSize="100" lang="hi">
          {word}
        </text>
      </svg>
      {reading ? (
        <figcaption className="ink-caption">
          <i lang="hi-Latn">{reading}</i> · {meaning}
        </figcaption>
      ) : null}
    </figure>
  );
}
