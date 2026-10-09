import Link from '../components/TLink';
import Icon from '../components/Icon';
import HeroCinema from '../components/HeroCinema';
import VideoClip, { FULL_BLEED } from '../components/VideoClip';
import CircuitCard from '../components/CircuitCard';
import WordFilm from '../components/WordFilm';
import JourneyProgress from '../components/JourneyProgress';
import StateCard from '../components/StateCard';
import StatesRail from '../components/StatesRail';
import TripCard from '../components/TripCard';
import PlanTile from '../components/PlanTile';
import ScrubText from '../components/ScrubText';
import InkWord from '../components/InkWord';
import Mosaic from '../components/Mosaic';
import SplitHeading from '../components/SplitHeading';
import Footnotes, { Fn } from '../components/Footnotes';
import { inboundTrips, indiaTrips, internationalTrips, sceneOf, duration, tripBySlug } from '../data/trips';
import { states } from '../data/states';
import { onRequest } from '../data/international';
import { videos } from '../data/videos';
import { site, waLink, generalMessage, tripMessage } from '../data/site';
import { INCLUSION_NOTE, MEDIA_NOTE, QUOTES_NOTE } from '../data/notes';
import { SHOW_TESTIMONIALS } from '../data/trust';
import { SOUND_CREDITS } from '../data/sounds';
import { useRouteSeo } from '../lib/useSeo';
import { morphFrom } from '../lib/transitions';

const TRUST = [
  { icon: 'receipt', text: 'Plan and price shared for your dates' },
  { icon: 'check', text: 'Inclusions listed, nothing hidden' },
  { icon: 'whatsapp', text: 'Real planners on WhatsApp, 24/7 help on the road' },
  { icon: 'pin', text: `Based in ${site.city}` },
];

const WAYS = [
  {
    to: '/india-tours',
    title: 'Discover India',
    who: 'For travellers visiting India',
    text: 'The Golden Triangle, South India and Varanasi, planned around your dates.',
    go: 'Explore India tours',
    video: videos.delhi,
    scene: 'india',
  },
  {
    to: '/holidays',
    title: 'Holidays in India',
    who: 'For travellers from India',
    text: 'Kashmir to Kerala, Goa to the Himalayas, with the plan written down.',
    go: 'See holidays in India',
    video: videos.darjeeling,
    scene: 'mountains',
  },
  {
    to: '/international',
    title: 'International',
    who: 'For travellers from India',
    text: 'Thailand, Malaysia and Sri Lanka, plus Bali, the Maldives and Vietnam on request.',
    go: 'See holidays abroad',
    video: videos.thailand,
    scene: 'islands',
  },
];

// India, frame by frame: three columns of photographs from the holidays, each
// opening its trip. [trip, which picture, frame shape]
const FRAMES = [
  [
    ['kashmir', 'photo', 'tall'],
    ['goa', 'tilePhoto', 'square'],
    ['darjeeling', 'tilePhoto', 'portrait'],
  ],
  [
    ['kerala', 'photo', 'portrait'],
    ['shimla-manali', 'photo', 'tall'],
    ['nainital-corbett', 'photo', 'square'],
  ],
  [
    ['goa', 'photo', 'square'],
    ['sikkim', 'photo', 'tall'],
    ['kerala', 'gallery', 'portrait'],
  ],
].map((col) =>
  col.map(([slug, pick, shape]) => {
    const t = tripBySlug(slug);
    const photo = pick === 'gallery' ? t.gallery[0] : t[pick];
    return { photo, shape, to: `/trips/${slug}`, trip: `${t.name} · ${duration(t)}` };
  }),
);

const WHY = [
  { icon: 'message', title: 'A real person, start to finish', text: 'Every trip is planned with you on WhatsApp by the Wander Soul team in Kalyan, Mumbai.' },
  { icon: 'receipt', title: 'The plan before anything else', text: 'Holiday packages list what’s included and what isn’t, and your planner shares the price for your dates on WhatsApp.' },
  { icon: 'shield', title: 'No hidden costs', text: 'What a trip leaves out, like flights, is written on the trip page before you book.', fn: 1 },
  { icon: 'support', title: 'Help at any hour', text: 'Support on WhatsApp, 24/7, while you travel.' },
];

const STEPS = [
  { title: 'Tell us where', body: 'Pick a holiday or an India tour, or describe the trip you have in mind.' },
  { title: 'Get your plan and price', body: 'We reply on WhatsApp with the route, the stays and the price for your dates.' },
  { title: 'Travel with us beside you', body: 'Book when you’re happy. We stay on WhatsApp through the whole trip.' },
];

const QUOTES = [
  {
    quote: 'Loved the way they organized our private trip. It was a seamless, extraordinary experience. They went completely beyond our expectations.',
    name: 'Sandeep Munkar',
  },
  {
    quote: 'Just returned from a private yacht expedition organized by Wandersoul. They truly craft soulful experiences that money alone cannot buy.',
    name: 'Govind Kumar',
  },
  {
    quote: 'One of the best premium travel curators. Our personal concierge was available 24/7 on WhatsApp, guiding us through hidden gems in Sri Lanka.',
    name: 'Rohit Verma',
  },
];

export default function Home() {
  useRouteSeo('/');

  return (
    <>
      <HeroCinema />
      <JourneyProgress />

      <section className="trustbar" aria-label="Why book with Wander Soul">
        <ul className="wrap trustbar-list">
          {TRUST.map((t) => (
            <li key={t.text}>
              <Icon name={t.icon} size={18} />
              {t.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="section ways" aria-labelledby="ways-head" data-chapter="Three ways in">
        <div className="wrap head-row">
          <SplitHeading id="ways-head" className="t-h2 display" scrub>
            Three ways to travel with us
          </SplitHeading>
          <p className="t-lead muted">
            Visiting India, exploring it from home, or flying out to somewhere new. Start with the trips made for you.
          </p>
        </div>
        <div className="wrap ways-grid">
          {WAYS.map((w, i) => (
            <Link
              key={w.to}
              to={w.to}
              className="way"
              data-hover-play
              data-hover-scene={w.scene}
              data-cursor="Explore"
              data-reveal
              style={{ '--d': i }}
              onClick={morphFrom(null, 'page-hero')}
            >
              <VideoClip video={w.video} mode="hover" sizes="(min-width: 900px) 400px, 100vw" />
              <span className="way-shade" />
              <span className="way-body">
                <span className="way-title">{w.title}</span>
                <span className="way-who">{w.who}</span>
                <span className="way-text">{w.text}</span>
                <span className="way-go">
                  {w.go} <Icon name="arrowRight" size={18} />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--tight-top" aria-labelledby="holidays-head" data-scene="mountains" data-chapter="Holidays in India">
        <div className="wrap head-row has-link">
          <div className="head-text">
            <SplitHeading id="holidays-head" className="t-h2 display" scrub>
              Holidays in India
            </SplitHeading>
            <p className="t-lead muted">
              For travellers from India: packages with the stay and the plan written down.
            </p>
          </div>
          <Link className="link" to="/holidays">
            All holidays in India <Icon name="arrowRight" size={18} />
          </Link>
        </div>
        <div className="wrap cards">
          {indiaTrips.map((t, i) => (
            <TripCard key={t.slug} trip={t} scene={sceneOf(t)} index={i} />
          ))}
          <PlanTile />
        </div>
      </section>

      <section className="statement on-night" aria-label="How we plan" data-scene="india" data-chapter="The journey">
        <div className="wrap statement-grid">
          <InkWord word="यात्रा" reading="yātrā" meaning="the journey" className="ink--statement" />
          <ScrubText className="statement-text">
            We plan every journey in conversation: the route, the stays and the price, written down before you book.
            Then we stay on WhatsApp with you until you are home.
          </ScrubText>
        </div>
      </section>

      <section className="section mosaic-section" aria-labelledby="frames-head" data-scene="mountains" data-chapter="Frame by frame">
        <div className="wrap head-row has-link">
          <div className="head-text">
            <SplitHeading id="frames-head" className="t-h2 display" scrub>
              India, frame by frame
            </SplitHeading>
            <p className="t-lead muted">Lakes, tea hills, snow and sea, from the holidays we plan. Open any picture to see its trip.</p>
          </div>
          <Link className="link" to="/holidays">
            See every holiday <Icon name="arrowRight" size={18} />
          </Link>
        </div>
        <div className="wrap">
          <Mosaic columns={FRAMES} />
        </div>
      </section>

      <section id="india-tours" className="section on-dark circuits" aria-labelledby="circuits-head" data-scene="india" data-chapter="Signature routes">
        <div className="wrap head-row">
          <SplitHeading id="circuits-head" className="t-h2 display" scrub>
            Signature routes of India
          </SplitHeading>
          <p className="t-lead muted">
            For travellers visiting from abroad, planned around your dates, your pace and your budget.
          </p>
        </div>
        <div className="wrap circuit-list">
          {inboundTrips.map((t, i) => (
            <CircuitCard key={t.slug} trip={t} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      <div data-scene="ghats" data-chapter="India, up close">
        <WordFilm video={videos.varanasiBoats} title="India, up close">
          <p className="t-lead">From the ghats of Varanasi to the backwaters of Kerala, every route is planned with you.</p>
          <Link className="btn btn-gold" to="/india-tours">
            Plan an India tour
          </Link>
        </WordFilm>
      </div>

      <StatesRail
        className="band-mist"
        data-chapter="Five states"
        label="States"
        aria-labelledby="states-head"
        data-scene="india"
        head={
          <div className="wrap head-row rail-head">
            <SplitHeading id="states-head" className="t-h2 display" scrub>
              Five states to begin with
            </SplitHeading>
            <p className="t-lead muted">
              <span className="hover-hint">Hover a state to hear it. </span>Tell us which one calls you and we’ll build the trip around it.
            </p>
          </div>
        }
      >
        {states.map((s) => (
          <StateCard key={s.slug} state={s} />
        ))}
      </StatesRail>

      <section className="section on-night abroad" aria-labelledby="abroad-head" data-scene="world" data-chapter="The world">
        <div className="wrap head-row has-link">
          <div className="head-text">
            <SplitHeading id="abroad-head" className="t-h2 display" scrub>
              The world, from India
            </SplitHeading>
            <p className="t-lead muted">
              Holidays abroad, planned the same way: clear inclusions, one planner, and help on WhatsApp the whole way.
            </p>
          </div>
          <Link className="link link-light" to="/international">
            All international holidays <Icon name="arrowRight" size={18} />
          </Link>
        </div>
        <div className="wrap abroad-grid">
          {internationalTrips.map((t, i) => (
            <article
              key={t.slug}
              className="abroad-card"
              data-morph
              data-cursor="Open trip"
              data-hover-play
              data-hover-scene={sceneOf(t)}
              data-reveal
              style={{ '--d': i }}
            >
              <VideoClip video={t.video} mode="hover" sizes="(min-width: 900px) 400px, 100vw" />
              <span className="way-shade" />
              <Link className="abroad-link" to={`/trips/${t.slug}`} onClick={morphFrom(null)} aria-label={`${t.name}, ${duration(t)}`} />
              <div className="abroad-body">
                <h3 className="abroad-name">{t.name}</h3>
                <p className="abroad-meta">{duration(t)}</p>
                <a
                  className="abroad-details"
                  href={waLink(tripMessage(t))}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get details about the ${t.name} trip on WhatsApp`}
                >
                  <Icon name="whatsapp" size={18} /> Get details
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="wrap abroad-more">
          <p>Also planned on request</p>
          <ul>
            {onRequest.map((p) => (
              <li key={p.slug}>
                <Link to={`/international#${p.slug}`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section on-forest" aria-labelledby="why-head" data-chapter="Why us">
        <div className="wrap why">
          <div className="why-intro">
            <SplitHeading id="why-head" className="t-h2 display" scrub>
              Why travellers trust us
            </SplitHeading>
            <img
              className="why-seal"
              loading="lazy"
              src="/brand/seal-320.webp"
              srcSet="/brand/seal-160.webp 160w, /brand/seal-320.webp 320w, /brand/seal-640.webp 640w"
              sizes="140px"
              alt=""
              width="140"
              height="140"
            />
          </div>
          <ul className="why-list">
            {WHY.map((w, i) => (
              <li key={w.title} data-reveal style={{ '--d': i }}>
                <Icon name={w.icon} size={24} />
                <div>
                  <h3>{w.title}</h3>
                  <p>
                    {w.text}
                    {w.fn ? <Fn n={w.fn} /> : null}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="how-head" data-chapter="How it works">
        <div className="wrap head-row">
          <SplitHeading id="how-head" className="t-h2 display" scrub>
            How it works
          </SplitHeading>
          <p className="t-lead muted">One conversation on WhatsApp, from the first question to the last day of your trip.</p>
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

      {SHOW_TESTIMONIALS ? (
        <section className="section band-mist" aria-labelledby="quotes-head" data-chapter="In their words">
          <div className="wrap head-row has-link">
            <SplitHeading id="quotes-head" className="t-h2 display" scrub>
              In their words
              <Fn n={2} />
            </SplitHeading>
            <a className="link" href={site.instagram} target="_blank" rel="noopener noreferrer">
              See real trips on Instagram <Icon name="arrowRight" size={18} />
            </a>
          </div>
          <div className="wrap quotes">
            {QUOTES.map((q, i) => (
              <figure key={q.name} className="quote" data-reveal style={{ '--d': i }}>
                <blockquote>“{q.quote}”</blockquote>
                <figcaption>{q.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : (
        <section className="section band-mist" aria-labelledby="insta-head" data-chapter="On Instagram">
          <div className="wrap head-row has-link">
            <SplitHeading id="insta-head" className="t-h2 display" scrub>
              Real trips, on Instagram
            </SplitHeading>
            <a className="link" href={site.instagram} target="_blank" rel="noopener noreferrer">
              Follow {site.instagramHandle} <Icon name="arrowRight" size={18} />
            </a>
          </div>
        </section>
      )}

      <section className="finale" aria-labelledby="finale-head" data-scene="coast" data-chapter="Where to next">
        <VideoClip video={videos.goa} mode="inview" sizes={FULL_BLEED} />
        <div className="finale-shade" />
        <div className="page-hero-aside finale-aside">
          <InkWord word="चलो" reading="chalo" meaning="let’s go" className="ink--hero" />
        </div>
        <div className="wrap finale-body">
          <SplitHeading id="finale-head" className="t-hero display" variant="chars" animate>
            Where to next?
          </SplitHeading>
          <p className="t-lead">Tell us where and when. We’ll reply on WhatsApp with a plan and a price.</p>
          <div className="cta-row">
            <a className="btn btn-gold" href={waLink(generalMessage)} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" /> Plan on WhatsApp
            </a>
            <Link className="btn btn-glass" to="/contact">
              Use the trip planner
            </Link>
          </div>
          <div className="contact-line">
            <a href={site.phoneHref}>
              <Icon name="phone" size={16} /> {site.phoneDisplay}
            </a>
            <a href={`mailto:${site.email}`}>
              <Icon name="mail" size={16} /> {site.email}
            </a>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={16} /> {site.city}
            </a>
          </div>
        </div>
      </section>

      <Footnotes items={SHOW_TESTIMONIALS ? [INCLUSION_NOTE, QUOTES_NOTE] : [INCLUSION_NOTE]} notes={[MEDIA_NOTE, `Music and sounds from Pixabay: ${SOUND_CREDITS}.`]} />
    </>
  );
}
