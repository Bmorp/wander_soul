import { useEffect, useState } from 'react';
import Icon from './Icon';
import ShareButton from './ShareButton';
import { duration } from '../data/trips';

/**
 * Phones only: the trip's name and the WhatsApp button stay within thumb's reach once
 * the opening has scrolled away, and step aside at the details panel and the footer
 * so they never cover the same thing twice.
 */
export default function TripBar({ trip, wa, heroRef }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const ends = [document.getElementById('details'), document.querySelector('.footnotes'), document.querySelector('.footer')].filter(Boolean);
    if (!hero) return undefined;
    let pastHero = false;
    const atEnd = new Set();
    const update = () => setShow(pastHero && atEnd.size === 0);
    const heroIo = new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting;
      update();
    });
    const endIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? atEnd.add(e.target) : atEnd.delete(e.target)));
      update();
    });
    heroIo.observe(hero);
    ends.forEach((el) => endIo.observe(el));
    return () => {
      heroIo.disconnect();
      endIo.disconnect();
    };
  }, [heroRef]);

  return (
    // inert (React 18 takes it as a string attribute): while the bar is tucked away,
    // neither its Share nor its WhatsApp button can be tabbed to or read out.
    <div className={`tripbar${show ? ' is-shown' : ''}`} inert={show ? undefined : ''}>
      <div className="tripbar-trip">
        <span className="tripbar-name">{trip.name}</span>
        <span className="tripbar-length">{duration(trip)}</span>
      </div>
      <ShareButton title={trip.name} text={`${trip.name} with Wander Soul: ${trip.tagline}`} className="tripbar-share" label="Share" />
      <a className="btn btn-gold tripbar-cta" href={wa} target="_blank" rel="noopener noreferrer" aria-label={`Get details about the ${trip.name} trip on WhatsApp`}>
        <Icon name="whatsapp" /> Get details
      </a>
    </div>
  );
}
