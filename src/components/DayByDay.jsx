import { useEffect, useRef, useState } from 'react';
import Lightbox from './Lightbox';
import Icon from './Icon';
import { glideTo } from '../lib/smoothScroll';
import { fadeIn, FADE_CLASS } from '../lib/fadeIn';

const WIDTHS = [480, 720, 960, 1280, 1600, 2000];
const src = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

// A day's photographs: a large frame and its companions on wide screens, a
// swipeable strip on phones. Every photo opens the full-screen viewer.
function DayGallery({ photos, label, onOpen }) {
  if (!photos.length) return null;
  return (
    <ul className={`day-gallery is-${Math.min(photos.length, 4)}`} aria-label={`${label}: photos`}>
      {photos.map((p, i) => (
        <li key={p.id} className="day-photo">
          <button type="button" onClick={() => onOpen(i)} aria-label={`Open photo: ${p.caption}`} data-unveil data-cursor="View photo">
            <img
              {...fadeIn}
              className={FADE_CLASS}
              loading="lazy"
              decoding="async"
              src={src(p.id, 960)}
              srcSet={WIDTHS.map((w) => `${src(p.id, w)} ${w}w`).join(', ')}
              sizes={i === 0 ? '(min-width: 1024px) 620px, 84vw' : '(min-width: 1024px) 300px, 84vw'}
              alt={p.alt}
            />
            <span className="day-photo-cap">{p.caption}</span>
            {i === 0 && photos.length > 1 ? (
              <span className="day-photo-count" aria-hidden="true">
                <Icon name="images" size={14} /> {photos.length}
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * The itinerary, day by day (or stop by stop). On wide screens a sticky list of
 * days sits beside the plan and fills as you read; on phones the days become a
 * row of chips that stays in reach. Each day has its own photographs.
 */
export default function DayByDay({ trip, days }) {
  const unit = trip.plan === 'days' ? 'Day' : 'Stop';
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState(null);
  const listRef = useRef(null);
  const navRef = useRef(null);

  // Which day is being read.
  useEffect(() => {
    const items = [...listRef.current.querySelectorAll('.day')];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        }),
      { rootMargin: '-30% 0px -60% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [days.length]);

  // Keep the active chip in view when the list scrolls sideways (phones).
  useEffect(() => {
    const nav = navRef.current;
    const chip = nav?.querySelector(`[data-index="${active}"]`);
    if (!nav || !chip || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: chip.offsetLeft - nav.clientWidth / 2 + chip.offsetWidth / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [active]);

  const jump = (i) => (e) => {
    e.preventDefault();
    const narrow = window.matchMedia('(max-width: 1023px)').matches;
    glideTo(document.getElementById(`day-${i + 1}`), narrow ? -120 : -96);
  };

  return (
    <div className="days" style={{ '--count': days.length, '--active': active }}>
      <nav className="days-nav" aria-label={`${trip.name}: ${unit === 'Day' ? 'days' : 'stops'}`}>
        <ol ref={navRef}>
          {days.map((d, i) => (
            <li key={d.title + i}>
              <a
                href={`#day-${i + 1}`}
                data-index={i}
                className={i === active ? 'is-active' : undefined}
                aria-current={i === active ? 'step' : undefined}
                onClick={jump(i)}
              >
                <span className="days-nav-num">
                  {unit} {i + 1}
                </span>
                <span className="days-nav-title">{d.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <ol className="days-list" ref={listRef}>
        {days.map((d, i) => (
          <li key={d.title + i} id={`day-${i + 1}`} className={`day${d.photos.length ? '' : ' is-quiet'}`} data-index={i}>
            <h3 className="day-title">
              <span className="day-num">
                {unit} {i + 1}
              </span>
              <span className="day-place">{d.title}</span>
            </h3>
            <DayGallery photos={d.photos} label={`${unit} ${i + 1}, ${d.title}`} onOpen={(n) => setViewer({ day: i, index: n })} />
            <p className="day-body">{d.body}</p>
          </li>
        ))}
      </ol>

      {viewer ? (
        <Lightbox
          photos={days[viewer.day].photos}
          start={viewer.index}
          title={`${unit} ${viewer.day + 1}, ${days[viewer.day].title}`}
          onClose={() => setViewer(null)}
        />
      ) : null}
    </div>
  );
}
