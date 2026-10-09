import Link from './TLink';
import Icon from './Icon';
import VideoClip, { FULL_BLEED } from './VideoClip';
import SplitHeading from './SplitHeading';
import { bestTime, duration, sceneOf } from '../data/trips';
import { waLink, tripMessage, generalMessage } from '../data/site';

/**
 * A full-screen destination panel. Panels stack: each one pins while the next
 * slides over it. Works for a packaged trip (`trip`) or an on-request
 * destination (`place`).
 */
export default function DestinationPanel({ trip, place, greeting, id }) {
  const item = trip || place;
  const message = trip
    ? tripMessage(trip)
    : `${generalMessage} I'm interested in ${place.name}. Could you share ideas and the details?`;

  return (
    <section id={id} className="panel" data-scene={trip ? sceneOf(trip) : place.scene} aria-labelledby={`panel-${item.slug}`}>
      <VideoClip video={item.video} mode="inview" sizes={FULL_BLEED} />
      <div className="panel-shade" />
      <div className="wrap panel-body">
        <SplitHeading id={`panel-${item.slug}`} className="panel-name display" variant="spread" animate>
          {item.name}
        </SplitHeading>
        {greeting ? (
          <p className="panel-greeting" lang="und">
            {greeting}
          </p>
        ) : null}
        <p className="panel-line">{trip ? trip.tagline : place.line}</p>
        <ul className="trip-facts">
          {trip ? (
            <>
              <li>
                <Icon name="calendar" size={18} /> {duration(trip)}
              </li>
              <li>
                <Icon name="sun" size={18} /> {bestTime(trip)}
              </li>
            </>
          ) : (
            <li>
              <Icon name="sliders" size={18} /> Planned on request
            </li>
          )}
        </ul>
        <div className="cta-row">
          {trip ? (
            <Link className="btn btn-gold" to={`/trips/${trip.slug}`}>
              Explore {trip.name}
            </Link>
          ) : null}
          <a
            className={`btn ${trip ? 'btn-glass' : 'btn-gold'}`}
            href={waLink(message)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" /> {trip ? 'Get details on WhatsApp' : `Ask about ${item.name}`}
          </a>
        </div>
      </div>
      <span className="media-tag panel-tag">{item.video.label}</span>
    </section>
  );
}
