import { Children, useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon';

// A horizontal shelf with paddles. With `fit`, a short set lays out as a grid on wide screens.
export default function Shelf({ children, label, fit = false }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    update();
    el?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const go = (dir) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild;
    const step = first ? first.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <>
      <div className={`shelf${fit ? ' shelf--fit' : ''}`} ref={ref} role="list" aria-label={label} style={{ '--n': Children.count(children) }}>
        {Children.map(children, (child) => (
          <div role="listitem">{child}</div>
        ))}
      </div>
      <div className="shelf-paddles" hidden={edges.start && edges.end}>
        <button className="paddle" type="button" onClick={() => go(-1)} disabled={edges.start} aria-label="Scroll back">
          <Icon name="chevronLeft" />
        </button>
        <button className="paddle" type="button" onClick={() => go(1)} disabled={edges.end} aria-label="Scroll forward">
          <Icon name="chevronRight" />
        </button>
      </div>
    </>
  );
}
