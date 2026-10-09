import { useEffect, useRef, useState } from 'react';
import { gsap, reduceMotion } from '../lib/motion';

/**
 * Over pictures and films, a small gold label follows the pointer and says what a
 * click does ("View photos", "Open trip", "Drag"). Elsewhere it stays out of the
 * way, and the system cursor is never hidden. Fine pointers only.
 */
export default function Cursor() {
  const ref = useRef(null);
  const [label, setLabel] = useState('');
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion(),
  );

  useEffect(() => {
    if (!enabled) return undefined;
    const el = ref.current;
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'expo.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'expo.out' });
    const move = (e) => {
      x(e.clientX);
      y(e.clientY);
    };
    const over = (e) => {
      const target = e.target.closest?.('[data-cursor]');
      setLabel(target ? target.getAttribute('data-cursor') : '');
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className={`cursor${label ? ' is-on' : ''}`} aria-hidden="true">
      <span className="cursor-label">{label}</span>
    </div>
  );
}
