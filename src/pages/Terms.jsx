import PageHero from '../components/PageHero';
import { site } from '../data/site';
import { useRouteSeo } from '../lib/useSeo';

// Website terms only. Booking terms for each trip are shared by the planner before payment.
export default function Terms() {
  useRouteSeo('/terms');

  return (
    <>
      <PageHero size="sm" title="Terms" lead="How to read the trip details on this website." />
      <section className="section page-body">
        <div className="wrap narrow legal">
          <p className="legal-updated">Last updated: October 2026</p>

          <h2>Prices</h2>
          <p>
            This website does not list prices. Your planner shares the price for your dates on WhatsApp. A price can
            change with travel dates, hotel availability and group size, and your planner confirms the price for your
            dates before you book.
          </p>

          <h2>What’s included</h2>
          <p>
            Each trip page lists what is included and, where known, what is not. Flights and train fare are not included
            unless a trip says so. Your planner confirms the final inclusions in writing before you book.
          </p>

          <h2>Bookings and payments</h2>
          <p>
            Bookings are made directly with Wander Soul. The booking, payment and cancellation terms for your trip are
            shared with you before you pay.
          </p>

          <h2>Photographs, films and sounds</h2>
          <p>
            Films and photographs show the places on each trip and come from Pexels and Unsplash; they are not pictures
            of specific Wander Soul guests or hotels. Music and sounds come from Pixabay.
          </p>

          <h2>Contact</h2>
          <p>
            Wander Soul, {site.city}, India. <a className="text-link" href={`mailto:${site.email}`}>{site.email}</a> ·{' '}
            <a className="text-link" href={site.phoneHref}>
              {site.phoneDisplay}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
