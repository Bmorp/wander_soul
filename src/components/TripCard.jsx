import Link from './TLink';
import Icon from './Icon';
import Photo from './Photo';
import VideoClip from './VideoClip';
import { duration, stillOf, sceneOf } from '../data/trips';
import { waLink, tripMessage } from '../data/site';
import { morphFrom } from '../lib/transitions';

// A trip card: the still first, the destination film on hover (desktop only).
export default function TripCard({ trip, scene, index = 0, sizes = '(min-width: 1100px) 300px, (min-width: 700px) 45vw, 46vw' }) {
  const still = stillOf(trip);
  return (
    <article className="card" data-morph data-cursor="Open trip" data-hover-play data-hover-scene={scene || sceneOf(trip)} data-reveal style={{ '--d': index % 4 }}>
      <div className="card-media" data-unveil>
        {trip.video ? (
          <VideoClip video={trip.video} mode="hover" sizes={sizes} label={still.kind === 'photo' ? still.photo.alt : undefined} />
        ) : (
          <Photo photo={still.photo} sizes={sizes} />
        )}
        <span className="card-days">{duration(trip)}</span>
      </div>
      <div className="card-body">
        <h3 className="card-name">
          <Link to={`/trips/${trip.slug}`} onClick={morphFrom('.card-media')}>
            {trip.name}
          </Link>
        </h3>
        <p className="card-facts">
          {trip.places.slice(0, 3).join(' · ')}
          {trip.places.length > 3 ? ' · more' : ''}
        </p>
        <div className="card-foot">
          <a
            className="card-details"
            href={waLink(tripMessage(trip))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get details about the ${trip.name} trip on WhatsApp`}
          >
            <Icon name="whatsapp" size={18} /> Get details
          </a>
        </div>
      </div>
    </article>
  );
}
