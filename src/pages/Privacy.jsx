import Link from '../components/TLink';
import PageHero from '../components/PageHero';
import { site } from '../data/site';
import { useRouteSeo } from '../lib/useSeo';

// Describes what this website actually does with information. Keep it in step with the code.
export default function Privacy() {
  useRouteSeo('/privacy');

  return (
    <>
      <PageHero size="sm" title="Privacy" lead="What this website does with your information, in plain words." />
      <section className="section page-body">
        <div className="wrap narrow legal">
          <p className="legal-updated">Last updated: October 2026</p>

          <h2>What we collect</h2>
          <p>
            When you use the trip planner, your answers (name, phone number, destination, dates, budget and, if you are
            visiting India, your country) are written into a WhatsApp message on your own device. Nothing reaches us
            until you press send in WhatsApp.
          </p>
          <p>
            A copy of each enquiry is kept in your browser’s local storage so you can see it on the{' '}
            <Link className="text-link" to="/account">
              Your enquiries
            </Link>{' '}
            page. It stays on your device; clearing this site’s data removes it.
          </p>

          <h2>What we don’t do</h2>
          <p>This website does not use advertising cookies, tracking pixels or analytics, and it does not sell or share your information.</p>

          <h2>Content from other services</h2>
          <p>
            To show films, photographs, fonts and sounds, your browser loads files from Pexels, Unsplash, Google Fonts and
            Pixabay. Like any website request, this shares your IP address with those services. Sounds play only if you
            turn them on.
          </p>

          <h2>When you contact us</h2>
          <p>
            Messages you send on WhatsApp, by phone or by email are used to plan and support your trip, and are handled
            under those services’ own terms.
          </p>

          <h2>Questions</h2>
          <p>
            Write to <a className="text-link" href={`mailto:${site.email}`}>{site.email}</a> or call{' '}
            <a className="text-link" href={site.phoneHref}>
              {site.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
