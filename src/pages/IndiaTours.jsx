import Link from '../components/TLink';
import Icon from '../components/Icon';
import SplitHeading from '../components/SplitHeading';
import PageHero from '../components/PageHero';
import CircuitCard from '../components/CircuitCard';
import StateCard from '../components/StateCard';
import StatesRail from '../components/StatesRail';
import ScrubText from '../components/ScrubText';
import InkWord from '../components/InkWord';
import Footnotes from '../components/Footnotes';
import { inboundTrips } from '../data/trips';
import { states } from '../data/states';
import { videos } from '../data/videos';
import { site, waLink } from '../data/site';
import { SEASON_NOTE, MEDIA_NOTE } from '../data/notes';
import { SOUND_CREDITS } from '../data/sounds';
import { useRouteSeo } from '../lib/useSeo';
import { indiaToursFaq } from '../data/faq';

const ABROAD_MESSAGE = 'Hello Wander Soul, I am planning a trip to India and would like help with a tour.';

const STEPS = [
  { title: 'Message us', body: `WhatsApp ${site.whatsappDisplay} or email ${site.email} with your dates and the places you’d like to see.` },
  { title: 'Get your route and price', body: 'Your planner sends a day-by-day route, the stays and the price, and adjusts it with you.' },
  { title: 'Travel India with us', body: 'Arrive to a plan that’s ready, with someone to message on WhatsApp, 24/7, throughout.' },
];

export default function IndiaTours() {
  useRouteSeo('/india-tours');

  return (
    <>
      <PageHero
        size="lg"
        video={videos.tajClose}
        title="Discover India"
        scene="india"
        aside={<InkWord word="नमस्ते" reading="namaste" meaning="welcome" immediate delay={0.7} className="ink--hero" />}
        lead="Tours for travellers visiting India: the Golden Triangle, South India and Varanasi, planned around your dates with a real person on WhatsApp."
      >
        <div className="cta-row">
          <a className="btn btn-gold" href={waLink(ABROAD_MESSAGE)} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" /> Plan your India tour
          </a>
          <a className="btn btn-glass" href="#routes">
            See the routes
          </a>
        </div>
      </PageHero>

      <section className="statement on-night" aria-label="Our approach" data-scene="india">
        <div className="wrap statement-grid">
          <InkWord word="भारत" reading="bhārat" meaning="India" className="ink--statement" />
          <ScrubText className="statement-text">
            India rewards the traveller who slows down. We plan the route around your pace, book stays we know, and stay
            a message away while you discover it.
          </ScrubText>
        </div>
      </section>

      <section id="routes" className="section on-dark circuits" aria-labelledby="routes-head" data-scene="india">
        <div className="wrap head-row">
          <SplitHeading id="routes-head" className="t-h2 display" scrub>
            Signature routes
          </SplitHeading>
          <p className="t-lead muted">
            Three ways to see India for the first time. Each one is a starting point that we shape around you.
          </p>
        </div>
        <div className="wrap circuit-list">
          {inboundTrips.map((t, i) => (
            <CircuitCard key={t.slug} trip={t} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      <StatesRail
        id="states"
        className="band-mist"
        label="States"
        aria-labelledby="states-head"
        data-scene="india"
        head={
          <div className="wrap head-row rail-head">
            <SplitHeading id="states-head" className="t-h2 display" scrub>
              Explore by state
            </SplitHeading>
            <p className="t-lead muted">Prefer to go deep in one region? Start with one of these five and we’ll plan the rest.</p>
          </div>
        }
      >
        {states.map((s) => (
          <StateCard key={s.slug} state={s} />
        ))}
      </StatesRail>

      <section className="section" aria-labelledby="abroad-head">
        <div className="wrap head-row">
          <SplitHeading id="abroad-head" className="t-h2 display" scrub>
            Planning from abroad
          </SplitHeading>
          <p className="t-lead muted">
            No forms to wade through. Just a conversation with your planner in Mumbai.
          </p>
        </div>
        <ol className="wrap steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step" data-reveal style={{ '--d': i }}>
              <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section band-mist" aria-labelledby="faq-head">
        <div className="wrap narrow">
          <SplitHeading id="faq-head" className="t-h2 display" scrub>
            Questions
          </SplitHeading>
          <div className="faq">
            {indiaToursFaq.map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <Icon name="plus" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="cta-row after-row">
            <a className="btn btn-navy" href={waLink(ABROAD_MESSAGE)} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" /> Ask on WhatsApp
            </a>
            <Link className="link" to="/contact?from=abroad">
              Use the trip planner <Icon name="arrowRight" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footnotes notes={[SEASON_NOTE, MEDIA_NOTE, `Music and sounds from Pixabay: ${SOUND_CREDITS}.`]} />
    </>
  );
}
