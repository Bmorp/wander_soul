import { useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import CompareTable from '../components/CompareTable';
import Footnotes from '../components/Footnotes';
import { tripBySlug } from '../data/trips';
import { SEASON_NOTE, MEDIA_NOTE } from '../data/notes';
import { useRouteSeo } from '../lib/useSeo';

const DEFAULTS = ['kashmir', 'kerala', 'goa', 'sikkim'];

export default function Compare() {
  const [params] = useSearchParams();
  useRouteSeo('/compare');

  const asked = (params.get('trips') || '').split(',').filter((s) => tripBySlug(s) && tripBySlug(s).region !== 'inbound');
  const initial = [...new Set([...asked, ...DEFAULTS])].slice(0, 3);

  return (
    <>
      <PageHero
        size="sm"
        title="Compare holidays"
        lead="Put any three side by side: days, places, stays, meals, and what’s not included."
      />
      <section className="section page-body">
        <div className="wrap">
          <CompareTable key={initial.join()} initial={initial} />
        </div>
      </section>
      <Footnotes notes={[SEASON_NOTE, MEDIA_NOTE]} />
    </>
  );
}
