import SplitHeading from '../components/SplitHeading';
import Link from '../components/TLink';
import PageHero from '../components/PageHero';
import TripCard from '../components/TripCard';
import PlanTile from '../components/PlanTile';
import Footnotes from '../components/Footnotes';
import { indiaTrips } from '../data/trips';
import { videos } from '../data/videos';
import { MEDIA_NOTE } from '../data/notes';
import { useRouteSeo } from '../lib/useSeo';

export default function Holidays() {
  useRouteSeo('/holidays');

  return (
    <>
      <PageHero
        video={videos.kashmir}
        title="Holidays in India"
        scene="mountains"
        lead="For travellers from India: packages with the stay and the plan written down. Pick one, or ask us to shape it around you."
      />

      <section className="section page-body" aria-labelledby="list-head" data-scene="mountains">
        <div className="wrap head-row">
          <SplitHeading id="list-head" className="t-h2 display" scrub>
            {indiaTrips.length} journeys to choose from
          </SplitHeading>
          <p className="t-lead muted">
            Tap Get details on any trip and we’ll reply on WhatsApp.
            <span className="hover-hint"> Hover a card to see and hear the place.</span>
          </p>
        </div>
        <div className="wrap cards">
          {indiaTrips.map((t, i) => (
            <TripCard key={t.slug} trip={t} index={i} />
          ))}
          <PlanTile />
        </div>
        <p className="wrap region-note">
          Looking further afield? <Link className="text-link" to="/international">See international holidays</Link>. Or{' '}
          <Link className="text-link" to="/compare">
            compare trips side by side
          </Link>
          .
        </p>
      </section>

      <Footnotes notes={[MEDIA_NOTE]} />
    </>
  );
}
