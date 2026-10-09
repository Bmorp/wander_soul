import Link from '../components/TLink';
import PageHero from '../components/PageHero';
import { useRouteSeo } from '../lib/useSeo';

export default function NotFound() {
  useRouteSeo('/404');
  return (
    <PageHero title="Off the map" lead="The page you’re looking for has moved or doesn’t exist.">
      <div className="cta-row">
        <Link className="btn btn-gold" to="/holidays">
          See the holidays
        </Link>
        <Link className="btn btn-glass" to="/">
          Go home
        </Link>
      </div>
    </PageHero>
  );
}
