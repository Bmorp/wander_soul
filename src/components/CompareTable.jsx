import { useState } from 'react';
import Link from './TLink';
import Icon from './Icon';
import Photo from './Photo';
import { duration, indiaTrips, internationalTrips, tripBySlug } from '../data/trips';
import { waLink, tripMessage } from '../data/site';

const ROWS = [
  { group: 'At a glance' },
  { key: 'duration', icon: 'calendar', label: 'Duration', get: (t) => duration(t) },
  { key: 'places', icon: 'pin', label: 'Places', get: (t) => t.places.join(', ') },
  { group: 'What’s included' },
  { key: 'stay', icon: 'bed', label: 'Stay', get: (t) => t.stay },
  { key: 'meals', icon: 'cup', label: 'Meals', get: (t) => t.meals },
  { key: 'transfers', icon: 'car', label: 'Transfers', get: (t) => t.transfers },
  {
    key: 'excluded',
    icon: 'minus',
    label: 'Not included',
    get: (t) => (t.excluded.length ? t.excluded.join(', ') : 'Ask your planner'),
    muted: (t) => !t.excluded.length,
  },
  { group: 'When to go' },
  { key: 'season', icon: 'sun', label: 'Best time', get: (t) => t.seasonNote },
];

const COMPACT = ['duration', 'places', 'stay', 'meals', 'transfers'];

export default function CompareTable({ initial = ['kashmir', 'kerala', 'goa'], compact = false }) {
  const [picks, setPicks] = useState(initial);
  const rows = compact ? ROWS.filter((r) => COMPACT.includes(r.key)) : ROWS;
  const cols = picks.map(tripBySlug);
  const extra = (c) => (c === 2 ? ' is-extra' : '');

  const choose = (c, slug) => setPicks((p) => p.map((x, i) => (i === c ? slug : x)));

  return (
    <div className="compare">
      {cols.map((t, c) => (
        <div key={`head-${c}`} className={`compare-cell is-head${extra(c)}`}>
          <div className="compare-pick">
            <label className="sr-only" htmlFor={`compare-${compact ? 'c' : 'f'}-${c}`}>
              Trip {c + 1}
            </label>
            <select
              id={`compare-${compact ? 'c' : 'f'}-${c}`}
              value={picks[c]}
              onChange={(e) => choose(c, e.target.value)}
            >
              <optgroup label="India">
                {indiaTrips.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="International">
                {internationalTrips.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <Icon name="chevronDown" />
          </div>
          <Photo photo={t.tilePhoto || t.photo} sizes="(min-width: 834px) 30vw, 45vw" />
          <p className="compare-name">{t.name}</p>
          <div className="cta-row">
            <Link className="btn btn-navy" to={`/trips/${t.slug}`} aria-label={`Learn more about ${t.name}`}>
              Learn more
            </Link>
            <a
              className="link"
              href={waLink(tripMessage(t))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get details about the ${t.name} trip on WhatsApp`}
            >
              <Icon name="whatsapp" size={18} /> Get details
            </a>
          </div>
        </div>
      ))}

      {rows.map((r, ri) =>
        r.group ? (
          <h3 key={`g-${ri}`} className="compare-group">
            {r.group}
          </h3>
        ) : (
          cols.map((t, c) => (
            <div key={`${r.key}-${c}`} className={`compare-cell${extra(c)}${r.muted?.(t) ? ' is-muted' : ''}`}>
              <Icon name={r.icon} />
              <span className="label">{r.label}</span>
              {r.get(t)}
            </div>
          ))
        ),
      )}
    </div>
  );
}
