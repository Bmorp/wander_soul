import { site, waLink, generalMessage } from '../data/site';
import { TIME_ZONE } from '../data/faq';
import { trust } from '../data/trust';

const ext = { target: '_blank', rel: 'noopener noreferrer' };

/**
 * Who a visitor from abroad is booking with: where the business is, how to reach it, and
 * (once they are confirmed and added to data/trust.js) its registration, memberships,
 * reviews, payment and cancellation terms. Only details that have a real value are shown.
 */
export default function BusinessDetails() {
  const rows = [
    trust.legalName && ['Registered as', trust.legalName],
    ['Based in', trust.address ? `${trust.address}, ${site.city}, India` : `${site.city}, Maharashtra, India`],
    ['WhatsApp', <a key="wa" href={waLink(generalMessage)} {...ext}>{site.phoneDisplay}</a>],
    ['Email', <a key="mail" href={`mailto:${site.email}`}>{site.email}</a>],
    ['Time zone', TIME_ZONE],
    trust.languages && ['Languages', trust.languages],
    ...trust.registrations.map((r) => [r.label, r.value]),
    ...trust.memberships.map((m) => ['Member of', m.url ? <a key={m.name} href={m.url} {...ext}>{m.name}</a> : m.name]),
    ...trust.reviews.map((r) => ['Reviews', <a key={r.url} href={r.url} {...ext}>{r.label}</a>]),
    trust.payments && ['How you pay', trust.payments],
    trust.cancellation && ['Cancellations', trust.cancellation],
    ['Instagram', <a key="ig" href={site.instagram} {...ext}>{site.instagramHandle}</a>],
  ].filter(Boolean);

  return (
    <dl className="facts facts--details">
      {rows.map(([label, value], i) => (
        <div className="fact fact--sm" key={`${label}-${i}`}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
