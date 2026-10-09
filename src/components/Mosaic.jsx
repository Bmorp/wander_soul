import { useLayoutEffect, useRef } from 'react';
import Link from './TLink';
import Photo from './Photo';
import { gsap, reduceMotion } from '../lib/motion';
import { morphFrom } from '../lib/transitions';

// Photographs in three columns that drift at different speeds as you scroll, and
// each picture drifts inside its own frame, so the section reads in layers.
// Phones get a calm two-column masonry with no drift. Every frame opens its trip.
const TRAVEL = [36, 132, 72];

export default function Mosaic({ columns }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion()) return undefined;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 700px)', () => {
      const root = ref.current;
      root.querySelectorAll('.mosaic-col').forEach((col, i) => {
        gsap.fromTo(
          col,
          { y: TRAVEL[i] },
          { y: -TRAVEL[i], ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
      root.querySelectorAll('.mosaic-img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -5 },
          { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="mosaic">
      {columns.map((col, i) => (
        <div key={i} className="mosaic-col">
          {col.map((f) => (
            <Link key={f.photo.id} to={f.to} className={`mosaic-frame is-${f.shape}`} data-cursor="Open trip" onClick={morphFrom('.mosaic-pic')}>
              <span className="mosaic-pic" data-unveil>
                <Photo photo={f.photo} className="mosaic-img" sizes="(min-width: 1100px) 400px, (min-width: 700px) 31vw, 46vw" />
              </span>
              <span className="mosaic-caption">
                <b>{f.photo.caption}</b>
                <span>{f.trip}</span>
              </span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
