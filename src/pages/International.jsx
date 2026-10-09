import Link from '../components/TLink';
import Icon from '../components/Icon';
import SplitHeading from '../components/SplitHeading';
import PageHero from '../components/PageHero';
import DestinationPanel from '../components/DestinationPanel';
import ScrubText from '../components/ScrubText';
import Footnotes from '../components/Footnotes';
import { internationalTrips } from '../data/trips';
import { onRequest, greetings } from '../data/international';
import { videos } from '../data/videos';
import { waLink, generalMessage } from '../data/site';
import { SEASON_NOTE, MEDIA_NOTE } from '../data/notes';
import { SOUND_CREDITS } from '../data/sounds';
import { useRouteSeo } from '../lib/useSeo';

const PROMISES = [
  { icon: 'message', title: 'One planner, door to door', body: 'The same person plans your trip and answers on WhatsApp while you’re away.' },
  { icon: 'check', title: 'Inclusions in writing', body: 'Stays, transfers and experiences are listed before you book, so you know what you’re paying for.' },
  { icon: 'support', title: 'Help across time zones', body: 'Support on WhatsApp, 24/7, wherever you are.' },
];

export default function International() {
  useRouteSeo('/international');

  const all = [
    ...internationalTrips.map((t) => ({ key: t.slug, trip: t, greeting: greetings[t.slug] })),
    ...onRequest.map((p) => ({ key: p.slug, place: p, greeting: p.greeting })),
  ];

  return (
    <>
      <PageHero
        size="lg"
        video={videos.maldives}
        title="The world, from India"
        scene="islands"
        lead="Holidays abroad for travellers from India: Thailand, Malaysia and Sri Lanka, plus Bali, the Maldives and Vietnam on request."
      >
        <div className="cta-row">
          <a className="btn btn-gold" href="#destinations">
            See the destinations
          </a>
          <a className="btn btn-glass" href={waLink(generalMessage)} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" /> Ask on WhatsApp
          </a>
        </div>
      </PageHero>

      <section className="statement on-night" aria-label="How we plan abroad" data-scene="world">
        <div className="wrap">
          <ScrubText className="statement-text">
            Six places we know well. Turn the sound on and scroll: every destination has its own film and its own sound.
          </ScrubText>
        </div>
      </section>

      <div id="destinations" className="panels">
        {all.map((d) => (
          <DestinationPanel key={d.key} id={d.key} trip={d.trip} place={d.place} greeting={d.greeting} />
        ))}
      </div>

      <section className="section on-forest" aria-labelledby="promise-head">
        <div className="wrap">
          <SplitHeading id="promise-head" className="t-h2 display" scrub>
            Travelling abroad with us
          </SplitHeading>
          <ul className="promise-grid">
            {PROMISES.map((p, i) => (
              <li key={p.title} data-reveal style={{ '--d': i }}>
                <Icon name={p.icon} size={30} />
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
          <div className="cta-row after-row">
            <a className="btn btn-gold" href={waLink(generalMessage)} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" /> Plan on WhatsApp
            </a>
            <Link className="btn btn-glass" to="/compare?trips=thailand,malaysia,sri-lanka">
              Compare the three
            </Link>
          </div>
        </div>
      </section>

      <Footnotes notes={[SEASON_NOTE, MEDIA_NOTE, `Music and sounds from Pixabay: ${SOUND_CREDITS}.`]} />
    </>
  );
}
