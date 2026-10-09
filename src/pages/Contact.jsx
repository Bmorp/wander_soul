import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Link from '../components/TLink';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import { inboundTrips, indiaTrips, internationalTrips, tripBySlug } from '../data/trips';
import { states } from '../data/states';
import { site, waLink, generalMessage, saveLead, sendLead } from '../data/site';
import { TIME_ZONE } from '../data/faq';
import { useRouteSeo } from '../lib/useSeo';

const ORIGINS = [
  { value: 'india', label: 'I live in India', sub: 'Holidays in India and abroad' },
  { value: 'abroad', label: 'I’m visiting India', sub: 'India tours from abroad' },
];

const WHO = [
  { value: 'Couple', sub: 'Two of us' },
  { value: 'Family', sub: 'With kids or parents' },
  { value: 'Friends', sub: 'A group of friends' },
  { value: 'Solo', sub: 'Just me' },
  { value: 'Large group', sub: '10 or more people' },
];

const BUDGETS_INR = ['Up to ₹30,000', '₹30,000 to ₹60,000', '₹60,000 to ₹1 lakh', 'Above ₹1 lakh'];

const nextMonths = () => {
  const out = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < 12; i += 1) {
    out.push(d.toLocaleString('en-IN', { month: 'long', year: 'numeric' }));
    d.setMonth(d.getMonth() + 1);
  }
  return out;
};

function Choice({ name, value, label, sub, checked, onChange, id }) {
  return (
    <label className="choice">
      <input id={id} type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span className="choice-box">
        <strong>{label}</strong>
        {sub ? <small>{sub}</small> : null}
      </span>
    </label>
  );
}

export default function Contact() {
  useRouteSeo('/contact');
  const [params] = useSearchParams();
  const presetTrip = tripBySlug(params.get('trip') || '');
  const presetState = states.find((s) => s.slug === params.get('state'));
  const months = useMemo(nextMonths, []);

  const [origin, setOrigin] = useState(
    params.get('from') === 'abroad' || presetState || presetTrip?.region === 'inbound' ? 'abroad' : 'india',
  );
  const [dest, setDest] = useState(presetTrip?.name || presetState?.name || '');
  const [who, setWho] = useState('');
  const [when, setWhen] = useState('');
  const [budget, setBudget] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [tried, setTried] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  const abroad = origin === 'abroad';
  const phoneOk = abroad ? /^\+?[\d\s-]{8,18}$/.test(phone.trim()) : /^[6-9]\d{9}$/.test(phone);
  const nameOk = name.trim().length > 1;
  const destOk = dest !== '';

  const destinations = abroad
    ? [
        ...inboundTrips.map((t) => ({ value: t.name, sub: t.places.length > 4 ? `${t.places.length} stops` : t.places.join(' · ') })),
        ...states.map((s) => ({ value: s.name, sub: s.places.join(' · ') })),
        { value: 'Not sure yet', sub: 'Help me choose' },
      ]
    : [
        ...indiaTrips.map((t) => ({ value: t.name, sub: `${t.days} days · India` })),
        ...internationalTrips.map((t) => ({ value: t.name, sub: `${t.days} days · Abroad` })),
        { value: 'Somewhere else', sub: 'Tell us on WhatsApp' },
      ];

  const message = [
    abroad ? `Hello Wander Soul, I'm ${name.trim() || 'planning a trip to India'}${country.trim() ? ` from ${country.trim()}` : ''}.` : `Hi Wander Soul, I'm ${name.trim() || 'planning a trip'}.`,
    `Trip: ${dest || 'Not decided yet'}`,
    who && `Travelling: ${who}`,
    when && `When: ${when}`,
    budget && `Budget: ${budget}`,
    phone && `Phone: ${phone}`,
    'Could you share a plan and price?',
  ]
    .filter(Boolean)
    .join('\n');

  const switchOrigin = (value) => {
    setOrigin(value);
    setDest('');
    setBudget('');
    setTried(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setTried(true);
    if (!destOk || !nameOk || !phoneOk) {
      const firstBad = !destOk ? 'dest-0' : !nameOk ? 'plan-name' : 'plan-phone';
      document.getElementById(firstBad)?.focus();
      return;
    }
    const lead = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      country: country.trim() || (abroad ? 'Not given' : 'India'),
      destination: dest,
      travellers: who || 'Not given',
      when: when || 'Flexible',
      budget: budget || 'Not given',
      timestamp: new Date().toLocaleString('en-IN'),
      // We only know WhatsApp opened, not that the visitor pressed send.
      status: 'WhatsApp opened',
    };
    saveLead(lead);
    sendLead(lead);
    window.open(waLink(message), '_blank', 'noopener');
    setSentMessage(message);
  };

  if (sentMessage) {
    return (
      <PageHero title="Message ready" lead="Send it from WhatsApp and your planner will reply with a plan and a price. If WhatsApp didn’t open, use the button below.">
        <div className="cta-row">
          <a className="btn btn-gold" href={waLink(sentMessage)} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" /> Open WhatsApp
          </a>
          <Link className="btn btn-glass" to="/account">
            Your enquiries
          </Link>
        </div>
      </PageHero>
    );
  }

  return (
    <>
      <PageHero size="sm" title="Plan your trip" lead="Tell us a little. We’ll reply on WhatsApp with a plan and a price for your dates." />

      <section className="section page-body">
        <div className="wrap planner">
          <form onSubmit={onSubmit} noValidate>
            <fieldset className="fieldset">
              <legend>Where are you travelling from?</legend>
              <div className="choices choices--2">
                {ORIGINS.map((o) => (
                  <Choice key={o.value} name="origin" value={o.value} label={o.label} sub={o.sub} checked={origin === o.value} onChange={switchOrigin} />
                ))}
              </div>
            </fieldset>

            <fieldset className="fieldset" aria-describedby={tried && !destOk ? 'dest-error' : undefined}>
              <legend>{abroad ? 'Which part of India?' : 'Where would you like to go?'}</legend>
              <p className="hint">{abroad ? 'Pick a route or a state. You can change everything later.' : 'Pick a holiday, or choose “Somewhere else”.'}</p>
              <div className="choices">
                {destinations.map((d, i) => (
                  <Choice key={d.value} id={`dest-${i}`} name="destination" value={d.value} label={d.value} sub={d.sub} checked={dest === d.value} onChange={setDest} />
                ))}
              </div>
              {tried && !destOk ? (
                <p id="dest-error" className="field-error">
                  Choose where you’d like to go, or “{abroad ? 'Not sure yet' : 'Somewhere else'}”.
                </p>
              ) : null}
            </fieldset>

            <fieldset className="fieldset">
              <legend>Who’s travelling?</legend>
              <p className="hint">Optional, but it helps us suggest the right stays.</p>
              <div className="choices choices--5">
                {WHO.map((w) => (
                  <Choice key={w.value} name="who" value={w.value} label={w.value} sub={w.sub} checked={who === w.value} onChange={setWho} />
                ))}
              </div>
            </fieldset>

            <fieldset className="fieldset">
              <legend>{abroad ? 'When are you coming?' : 'When, and what budget?'}</legend>
              <p className="hint">Optional. A rough idea is enough.</p>
              <div className="fields-2">
                <div className="field">
                  <select id="plan-when" value={when} onChange={(e) => setWhen(e.target.value)}>
                    <option value="">Flexible</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="plan-when">Month of travel</label>
                  <Icon name="chevronDown" className="chev" />
                </div>
                {abroad ? (
                  <div className="field">
                    <input id="plan-country" type="text" autoComplete="country-name" placeholder=" " value={country} onChange={(e) => setCountry(e.target.value)} />
                    <label htmlFor="plan-country">Country you’re travelling from</label>
                  </div>
                ) : (
                  <div className="field">
                    <select id="plan-budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
                      <option value="">Not sure yet</option>
                      {BUDGETS_INR.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="plan-budget">Budget for the trip</label>
                    <Icon name="chevronDown" className="chev" />
                  </div>
                )}
              </div>
            </fieldset>

            <fieldset className="fieldset">
              <legend>How do we reach you?</legend>
              <p className="hint">We reply on WhatsApp from {site.whatsappDisplay}.</p>
              <div className="fields-2">
                <div>
                  <div className={`field${tried && !nameOk ? ' is-invalid' : ''}`}>
                    <input
                      id="plan-name"
                      type="text"
                      autoComplete="name"
                      placeholder=" "
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={tried && !nameOk}
                      aria-describedby={tried && !nameOk ? 'name-error' : undefined}
                    />
                    <label htmlFor="plan-name">Your name</label>
                  </div>
                  {tried && !nameOk ? (
                    <p id="name-error" className="field-error">
                      Enter your name so your planner knows who to reply to.
                    </p>
                  ) : null}
                </div>
                <div>
                  <div className={`field${tried && !phoneOk ? ' is-invalid' : ''}`}>
                    <input
                      id="plan-phone"
                      type="tel"
                      inputMode={abroad ? 'tel' : 'numeric'}
                      autoComplete={abroad ? 'tel' : 'tel-national'}
                      placeholder=" "
                      maxLength={abroad ? 18 : 10}
                      value={phone}
                      onChange={(e) =>
                        setPhone(abroad ? e.target.value.replace(/[^\d+\s-]/g, '') : e.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      aria-invalid={tried && !phoneOk}
                      aria-describedby={tried && !phoneOk ? 'phone-error' : undefined}
                    />
                    <label htmlFor="plan-phone">{abroad ? 'WhatsApp number, with country code' : 'Mobile number'}</label>
                  </div>
                  {tried && !phoneOk ? (
                    <p id="phone-error" className="field-error">
                      {abroad ? 'Enter your WhatsApp number with the country code, like +44 7700 900123.' : 'Enter a 10-digit mobile number, like 98765 43210.'}
                    </p>
                  ) : null}
                </div>
              </div>
            </fieldset>

            <div className="summary" aria-live="polite">
              <span className="summary-label">Your message so far</span>
              {dest ? (
                <p>
                  <b>{dest}</b>
                  {who ? ` for ${who.toLowerCase()}` : ''}
                  {when ? `, ${when}` : ''}
                  {budget ? `, budget ${budget}` : ''}
                  {country ? `, from ${country}` : ''}.
                </p>
              ) : (
                <p>Pick where you’d like to go and we’ll write the message for you.</p>
              )}
            </div>

            <div className="submit-row">
              <button type="submit" className="btn btn-navy">
                <Icon name="whatsapp" /> Continue on WhatsApp
              </button>
              <p className="t-small">Opens WhatsApp with your answers filled in. Nothing is sent until you press send.</p>
            </div>
          </form>

          <aside className="aside-card" aria-labelledby="reach-head">
            <h2 id="reach-head">Rather talk now?</h2>
            <p>Message or call the Wander Soul team.</p>
            <p className="t-small">
              We are in India, on {TIME_ZONE}. Message at any hour; your planner replies as soon as the team is online.
            </p>
            <div className="aside-list">
              <a href={waLink(generalMessage)} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" /> WhatsApp {site.whatsappDisplay}
              </a>
              <a href={site.phoneHref}>
                <Icon name="phone" /> Call {site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`}>
                <Icon name="mail" /> {site.email}
              </a>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer">
                <Icon name="instagram" /> {site.instagramHandle}
              </a>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="pin" /> {site.city}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
