import Link from '../components/TLink';
import Icon from '../components/Icon';
import SplitHeading from '../components/SplitHeading';
import PageHero from '../components/PageHero';
import { site, waLink, generalMessage } from '../data/site';
import { videos } from '../data/videos';
import { useRouteSeo } from '../lib/useSeo';
import { howItWorksFaq } from '../data/faq';

const STEPS = [
  { title: 'Tell us where', body: 'Pick a holiday or an India tour, or describe the trip you have in mind: where, when and who’s coming.' },
  { title: 'Get your plan and price', body: 'We reply on WhatsApp with the day-by-day plan, the stays and the price for your dates.' },
  { title: 'Travel with us beside you', body: 'Book when you’re happy with it. We stay on WhatsApp through the trip, 24/7.' },
];

const SERVICES = [
  { icon: 'route', title: 'Trip planning', body: 'A day-by-day plan for your dates, shared with you before you book.' },
  { icon: 'bed', title: 'Hotels and stays', body: 'Hotels, resorts and houseboats chosen for each trip and listed in the package.' },
  { icon: 'car', title: 'Transfers and sightseeing', body: 'Private cabs and SUVs between stops, with sightseeing as per the itinerary.' },
  { icon: 'ticket', title: 'Permits', body: 'Where a trip needs them, like Tsomgo Lake and Nathula Pass in Sikkim, permits are arranged (subject to approval).' },
  { icon: 'support', title: 'Support on the way', body: 'Someone to message on WhatsApp, 24/7, while you travel.' },
  { icon: 'sliders', title: 'Custom trips', body: 'Honeymoons, family holidays, group trips and India tours, shaped around your dates and budget.' },
];

export default function HowItWorks() {
  useRouteSeo('/how-it-works');

  return (
    <>
      <PageHero
        video={videos.keralaBackwaters}
        title="How it works"
        lead="One conversation on WhatsApp, from the first question to the last day of your trip."
      />

      <section className="section" aria-label="The three steps">
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

      <section className="section band-mist" aria-labelledby="services-head">
        <div className="wrap head-row">
          <SplitHeading id="services-head" className="t-h2 display" scrub>
            What we
            <br />
            take care of
          </SplitHeading>
          <p className="t-lead muted">So the only thing left for you is the trip itself.</p>
        </div>
        <ul className="wrap services">
          {SERVICES.map((s, i) => (
            <li key={s.title} className="service" data-reveal style={{ '--d': i % 2 }}>
              <Icon name={s.icon} size={28} />
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="faq-head">
        <div className="wrap narrow">
          <SplitHeading id="faq-head" className="t-h2 display" scrub>
            Questions
          </SplitHeading>
          <div className="faq">
            {howItWorksFaq.map((f) => (
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
            <a className="btn btn-navy" href={waLink(generalMessage)} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" /> Ask on WhatsApp
            </a>
            <Link className="link" to="/contact">
              Use the trip planner <Icon name="arrowRight" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
