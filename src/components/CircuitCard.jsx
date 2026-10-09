import { useRef } from 'react';
import Link from './TLink';
import Icon from './Icon';
import VideoClip from './VideoClip';
import RouteStops from './RouteStops';
import { waLink, tripMessage } from '../data/site';
import { useDepth } from '../lib/useDepth';
import { morphFrom } from '../lib/transitions';

export default function CircuitCard({ trip, flip = false }) {
  const depth = useRef(null);
  useDepth(depth, 6);

  return (
    <article className={`circuit${flip ? ' is-flip' : ''}`} data-reveal data-morph>
      <Link to={`/trips/${trip.slug}`} className="circuit-media" tabIndex={-1} aria-hidden="true" data-unveil data-cursor="Open route" onClick={morphFrom('.circuit-media')}>
        <span ref={depth} className="depth">
          <VideoClip video={trip.video} mode="inview" sizes="(min-width: 900px) 55vw, 100vw" />
        </span>
        <span className="media-tag">{trip.video.label}</span>
      </Link>
      <div className="circuit-body">
        <h3 className="circuit-name">
          <Link to={`/trips/${trip.slug}`} onClick={morphFrom('.circuit-media')}>
            {trip.name}
          </Link>
        </h3>
        <p className="circuit-line">{trip.tagline}</p>
        <RouteStops places={trip.places} label={`${trip.name} route`} />
        <p className="circuit-meta">
          <Icon name="sun" size={16} /> Best {trip.seasonNote.split(',')[0]} · Length and price set with you
        </p>
        <div className="cta-row">
          <Link className="btn btn-gold" to={`/trips/${trip.slug}`} onClick={morphFrom('.circuit-media')}>
            See the route
          </Link>
          <a className="link link-light" href={waLink(tripMessage(trip))} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={18} /> Ask about this tour
          </a>
        </div>
      </div>
    </article>
  );
}
