import { useRouteError } from 'react-router-dom';
import Icon from './Icon';
import { site, waLink, generalMessage } from '../data/site';
import { isStaleBuildError, reloadOnce } from '../lib/staleBuild';

// Shown inside the site's frame when a page fails to load or render, in place of the
// router's developer screen.
export default function RouteError() {
  const error = useRouteError();
  if (isStaleBuildError(error) && reloadOnce()) return <div className="page-loading" aria-hidden="true" />;
  if (error) console.error(error);

  return (
    <section className="page-hero page-hero--md">
      <div className="wrap page-hero-body">
        <h1 className="t-hero display">This page didn’t load</h1>
        <p className="t-lead">Check your connection and try again. If it keeps happening, message us on WhatsApp at {site.whatsappDisplay}.</p>
        <div className="cta-row">
          <button type="button" className="btn btn-gold" onClick={() => window.location.reload()}>
            Try again
          </button>
          <a className="btn btn-glass" href={waLink(generalMessage)} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" /> WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}
