import { useState } from 'react';
import Link from '../components/TLink';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import { readLeads, waLink } from '../data/site';
import { useRouteSeo } from '../lib/useSeo';

// Enquiries live only in this browser (there is no account server yet).
const describe = (lead) => lead.destination || lead.interest || 'A trip';

const followUp = (lead) =>
  `Hi Wander Soul, I'm ${lead.name || 'following up'}. I asked about ${describe(lead)} on ${lead.timestamp}. Any update?`;

export default function Account() {
  useRouteSeo('/account');
  const [leads] = useState(() => readLeads().slice().reverse());

  return (
    <>
      <PageHero size="sm" title="Your enquiries" lead="Trips you’ve asked about from this device. Your planner replies on WhatsApp." />

      <section className="section page-body">
        <div className="wrap narrow">
          {leads.length ? (
            <ul className="enquiries">
              {leads.map((lead) => (
                <li key={lead.id}>
                  <div>
                    <p className="what">{describe(lead)}</p>
                    <p className="meta">
                      {lead.timestamp}
                      {lead.travellers || lead.groupSize ? ` · ${lead.travellers || lead.groupSize}` : ''}
                      {lead.when ? ` · ${lead.when}` : ''}
                    </p>
                  </div>
                  <a className="link" href={waLink(followUp(lead))} target="_blank" rel="noopener noreferrer">
                    Follow up on WhatsApp <Icon name="arrowRight" size={18} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <p>No enquiries from this device yet.</p>
              <div className="cta-row after-row">
                <Link className="btn btn-navy" to="/contact">
                  Plan a trip
                </Link>
                <Link className="link" to="/holidays">
                  Explore holidays <Icon name="arrowRight" size={18} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
