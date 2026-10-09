import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Link from '../components/TLink';
import Icon from '../components/Icon';
import Photo from '../components/Photo';
import Shelf from '../components/Shelf';
import DayByDay from '../components/DayByDay';
import TripCard from '../components/TripCard';
import TripBar from '../components/TripBar';
import ShareButton from '../components/ShareButton';
import InkWord from '../components/InkWord';
import VideoClip, { FULL_BLEED } from '../components/VideoClip';
import RouteStops from '../components/RouteStops';
import SplitHeading from '../components/SplitHeading';
import Footnotes from '../components/Footnotes';
import NotFound from './NotFound';
import { MONTHS, bestTime, duration, trips, tripBySlug } from '../data/trips';
import { daysOf, HINDI_NAMES } from '../data/dayPhotos';
import { site, waLink, tripMessage } from '../data/site';
import { SEASON_NOTE, MEDIA_NOTE } from '../data/notes';
import useSeo from '../lib/useSeo';
import { seoFor } from '../data/seo';
import { useExitDepth } from '../lib/useDepth';
import { glideTo } from '../lib/smoothScroll';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function Lead({ parts }) {
  return parts.map((p, i) => (typeof p === 'string' ? <span key={i}>{p}</span> : <b key={i}>{p.b}</b>));
}

// The trip's sections, with the one being read lit in the bar.
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: '-25% 0px -70% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join()]);
  return active;
}

export default function Trip() {
  const { slug } = useParams();
  const trip = tripBySlug(slug);
  const heroRef = useRef(null);
  const chipsRef = useRef(null);
  useExitDepth(heroRef, '.clip', '.trip-hero-body');
  useSeo(
    trip
      ? seoFor(`/trips/${trip.slug}`, window.location.origin)
      : { title: 'Trip not found', description: 'This trip is not on the site.', noindex: true },
  );

  const isTour = trip?.region === 'inbound';
  const byDay = trip?.plan === 'days';
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'plan', label: byDay ? 'Day by day' : 'The route' },
    { id: 'included', label: isTour ? 'Planned with you' : 'Included' },
    { id: 'when', label: 'When to go' },
    { id: 'details', label: 'Details' },
  ];
  const active = useActiveSection(sections.map((s) => s.id));

  // Keep the lit chip in view on phones, where the section bar scrolls sideways.
  useEffect(() => {
    const bar = chipsRef.current;
    const chip = bar?.querySelector(`[href="#${active}"]`);
    if (!bar || !chip || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.offsetWidth / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [active]);

  if (!trip) return <NotFound />;

  const wa = waLink(tripMessage(trip));
  const others = trips.filter((t) => t.region === trip.region && t.slug !== trip.slug);
  const moreLabel = { inbound: 'More India tours', india: 'More holidays in India', international: 'More holidays abroad' }[trip.region];
  const days = daysOf(trip);
  const hindi = HINDI_NAMES[trip.slug];
  const kind = isTour ? 'India tour' : trip.region === 'india' ? 'Holiday in India' : 'Holiday abroad';
  const go = (id) => (e) => {
    e.preventDefault();
    glideTo(document.getElementById(id), id === 'overview' ? 0 : -72);
  };

  return (
    <>
      <section ref={heroRef} id="overview" className="trip-hero" aria-labelledby="trip-title">
        {trip.video ? (
          <VideoClip video={trip.video} mode="inview" priority sizes={FULL_BLEED} />
        ) : (
          <div className="clip">
            <Photo photo={trip.photo} priority className="clip-poster" sizes="100vw" />
          </div>
        )}
        <div className="trip-hero-shade" />
        {hindi ? (
          <div className="page-hero-aside">
            <InkWord word={hindi} label={`${trip.name}, written in Hindi`} immediate delay={0.8} className="ink--trip" />
          </div>
        ) : null}
        <div className="wrap trip-hero-body">
          <SplitHeading as="h1" id="trip-title" className="t-hero display" immediate>
            {trip.name}
          </SplitHeading>
          <p className="t-lead hero-enter" style={{ '--enter': 1 }}>
            {trip.tagline}
          </p>
          <dl className="keyfacts hero-enter" style={{ '--enter': 2 }}>
            <div>
              <dt>Trip</dt>
              <dd>{kind}</dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{duration(trip)}</dd>
            </div>
            <div>
              <dt>Route</dt>
              <dd>{trip.places.length > 4 ? `${trip.places.length} stops, ${trip.places[0]} to ${trip.places[trip.places.length - 1]}` : trip.places.join(', ')}</dd>
            </div>
            <div>
              <dt>Best time</dt>
              <dd>{bestTime(trip)}</dd>
            </div>
          </dl>
          <div className="cta-row hero-enter" style={{ '--enter': 3 }}>
            <a className="btn btn-gold" href={wa} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" /> Get details on WhatsApp
            </a>
            <a className="btn btn-glass" href="#plan" onClick={go('plan')}>
              {byDay ? 'See the day-by-day plan' : 'See the route'}
            </a>
            <ShareButton title={trip.name} text={`${trip.name} with Wander Soul: ${trip.tagline}`} className="share-btn--glass" />
          </div>
        </div>
        <span className="media-tag trip-hero-tag">{trip.video ? trip.video.label : trip.photo.caption}</span>
      </section>

      <nav className="lnav" aria-label={`${trip.name} sections`}>
        <div className="lnav-inner wrap">
          <a className="lnav-title" href="#overview" onClick={go('overview')}>
            {trip.name}
          </a>
          <ul className="lnav-links" ref={chipsRef}>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined} onClick={go(s.id)}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn-gold btn-sm lnav-plan" href={wa} target="_blank" rel="noopener noreferrer">
            Plan
          </a>
        </div>
      </nav>

      <section className="section trip-intro" aria-label={`About ${trip.name}`}>
        <div className="wrap">
          <p className="lead-mix" data-reveal>
            <Lead parts={trip.lead} />
          </p>
          {isTour ? (
            <div className="trip-route" data-reveal>
              <RouteStops places={trip.places} label={`${trip.name} route`} />
            </div>
          ) : null}
        </div>
      </section>

      {trip.gallery?.length ? (
        <section className="trip-gallery" aria-label={`${trip.name} highlights`}>
          <Shelf label={`${trip.name} highlights`} fit={trip.gallery.length <= 4}>
            {trip.gallery.map((g) => (
              <figure key={g.id || g.video.id} className="strip-item" data-hover-play>
                <div className="strip-media">
                  {g.video ? (
                    <VideoClip video={g.video} mode="hover" sizes="(min-width: 900px) 25vw, 74vw" />
                  ) : (
                    <Photo photo={g} sizes="(min-width: 900px) 25vw, 74vw" />
                  )}
                </div>
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </Shelf>
        </section>
      ) : null}

      <section id="plan" className="section band-mist plan-section" aria-labelledby="plan-head">
        <div className="wrap">
          <div className="head-row">
            <SplitHeading id="plan-head" className="t-h2 display" scrub>
              {byDay ? 'Day by day' : 'The route'}
            </SplitHeading>
            <p className="t-lead muted">
              {byDay ? `${trip.days} days, planned in full. Tap any photo to see it larger.` : `${trip.itinerary.length} stops, in the order your planner confirms for your dates.`}
            </p>
          </div>
          <DayByDay trip={trip} days={days} />
        </div>
      </section>

      <section id="included" className="section" aria-labelledby="inc-head">
        <div className="wrap">
          <div className="head-row">
            <SplitHeading id="inc-head" className="t-h2 display" scrub>
              {isTour ? 'Planned with you' : 'What’s in the package'}
            </SplitHeading>
            <p className="t-lead muted">
              {isTour ? 'Your planner confirms exactly what’s included, and the price, before you book.' : 'And what isn’t. Written down before you book.'}
            </p>
          </div>
          {isTour ? (
            <ul className="inc-grid">
              {trip.plannedWithYou.map((item) => (
                <li key={item.text}>
                  <Icon name={item.icon} size={28} />
                  {item.text}
                </li>
              ))}
            </ul>
          ) : (
            <div className="box">
              <div>
                <h3>Included</h3>
                <ul className="inc-list">
                  {trip.included.map((item) => (
                    <li key={item.text}>
                      <Icon name={item.icon} />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="box-side">
                <h3>Not included</h3>
                {trip.excluded.length ? (
                  <ul className="inc-list is-out">
                    {trip.excluded.map((x) => (
                      <li key={x}>
                        <Icon name="minus" />
                        {x}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="box-note">Ask your planner what this trip leaves out for your dates, such as flights.</p>
                )}
                {trip.optional?.length ? (
                  <>
                    <h3>Optional extras</h3>
                    <ul className="inc-list is-out">
                      {trip.optional.map((x) => (
                        <li key={x}>
                          <Icon name="plus" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="when" className="section band-mist" aria-labelledby="when-head">
        <div className="wrap">
          <div className="head-row">
            <SplitHeading id="when-head" className="t-h2 display" scrub>
              When to go
            </SplitHeading>
            <p className="t-lead muted">{trip.seasonNote}</p>
          </div>
          <ol className="months" aria-label="Months of the year; the best months to go are highlighted">
            {MONTHS.map((m, i) => {
              const best = trip.bestMonths.includes(i + 1);
              return (
                <li key={m} className={`month${best ? ' is-best' : ''}`}>
                  <span aria-hidden="true">{m}</span>
                  <span className="sr-only">
                    {MONTH_NAMES[i]}
                    {best ? ', a good time to go' : ''}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="details" className="section" aria-labelledby="details-head">
        <div className="wrap">
          <div className="buy" data-reveal>
            <div>
              <h2 id="details-head" className="buy-name display">
                {trip.name}
              </h2>
              <p className="buy-meta">
                {duration(trip)} · {trip.places.join(', ')}
              </p>
              <p className="buy-lead">Want the details?</p>
              <p className="buy-basis">Tell us your dates and who’s travelling, and your planner will send the plan and the price on WhatsApp.</p>
            </div>
            <div className="buy-actions">
              <a className="btn btn-gold" href={wa} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" /> Get details on WhatsApp
              </a>
              <a className="btn btn-outline-light" href={site.phoneHref}>
                <Icon name="phone" /> Call {site.phoneDisplay}
              </a>
              {!isTour ? (
                <Link className="link link-light" to={`/compare?trips=${trip.slug}`}>
                  Compare with other trips <Icon name="arrowRight" size={18} />
                </Link>
              ) : (
                <a className="link link-light" href={`mailto:${site.email}?subject=${encodeURIComponent(trip.name)}`}>
                  Or email {site.email} <Icon name="arrowRight" size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {others.length ? (
        <section className="section band-mist" aria-labelledby="more-head">
          <div className="wrap head-row">
            <SplitHeading id="more-head" className="t-h2 display" scrub>
              {moreLabel}
            </SplitHeading>
          </div>
          <Shelf label={moreLabel}>
            {others.map((t) => (
              <TripCard key={t.slug} trip={t} sizes="320px" />
            ))}
          </Shelf>
        </section>
      ) : null}

      <Footnotes notes={[SEASON_NOTE, MEDIA_NOTE]} />
      <TripBar trip={trip} wa={wa} heroRef={heroRef} />
    </>
  );
}
