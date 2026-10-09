import Link from '../components/TLink';
import Icon from '../components/Icon';
import { holidayTrips, inboundTrips } from '../data/trips';
import { site, waLink, generalMessage } from '../data/site';
import { useRouteSeo } from '../lib/useSeo';
import SplitHeading from '../components/SplitHeading';
import BusinessDetails from '../components/BusinessDetails';

const PROMISES = [
  { icon: 'receipt', title: 'Your price, in writing', body: 'Your planner shares the price for your dates on WhatsApp, with the conditions in plain words.' },
  { icon: 'check', title: 'Everything written down', body: 'What’s included and what isn’t, listed on each trip before you book.' },
  { icon: 'message', title: 'A real person', body: 'Planning and help on WhatsApp, before and during the trip.' },
];

export default function About() {
  useRouteSeo('/about');

  return (
    <>
      <section className="about-hero on-dark" aria-labelledby="about-title">
        <div className="wrap about-hero-body">
          <img
            className="about-seal"
            src="/brand/seal-640.webp"
            alt="The Wander Soul seal: a globe, a compass rose and flight paths in gold"
            width="320"
            height="320"
          />
          <div>
            <SplitHeading as="h1" id="about-title" className="t-hero display" immediate>
              Wander Soul
            </SplitHeading>
            <p className="t-lead hero-enter" style={{ '--enter': 1 }}>
              A travel agency in {site.city}, planning holidays across India and abroad, and India tours for visitors
              from around the world.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="belief-head">
        <div className="wrap head-row">
          <SplitHeading id="belief-head" className="t-h2 display" scrub>
            What we
            <br />
            believe
          </SplitHeading>
          <div className="prose">
            <p>
              Wander Soul was born from a simple belief: <b>every traveller deserves a trip that feels designed for them.</b>{' '}
              Not a copy of someone else’s itinerary, but a journey shaped around who you’re travelling with and what you
              want to feel.
            </p>
            <p>
              So we plan with you, in conversation. <b>You see the stay, the plan and the price before you book</b>, and
              you can reach us on WhatsApp while you travel.
            </p>
          </div>
        </div>
      </section>

      <section className="section band-mist" aria-label="Wander Soul at a glance">
        <div className="wrap">
          <dl className="facts">
            <div className="fact">
              <dt>Based in</dt>
              <dd>{site.city}</dd>
            </div>
            <div className="fact">
              <dt>Trips</dt>
              <dd>
                {holidayTrips.length} holidays and {inboundTrips.length} India tours
              </dd>
            </div>
            <div className="fact">
              <dt>Talk to us</dt>
              <dd>
                <a href={site.phoneHref}>{site.phoneDisplay}</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="details-head">
        <div className="wrap">
          <h2 id="details-head" className="t-h2 display">
            Who you’re booking with
          </h2>
          <p className="t-lead muted">Where we are and how to reach us, whichever country you are writing from.</p>
          <BusinessDetails />
        </div>
      </section>

      <section className="section on-forest" aria-labelledby="promise-head">
        <div className="wrap">
          <SplitHeading id="promise-head" className="t-h2 display" scrub>
            Our promises
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
            <Link className="btn btn-glass" to="/holidays">
              See the holidays
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
