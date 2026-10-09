// Questions and answers shared by the pages that show them, the structured data that
// describes them to search engines, and the plain-text copy of each page that the build
// writes for readers that do not run scripts. One source, so all three always agree.
import { site } from './site.js';

export const TIME_ZONE = 'India Standard Time (UTC+5:30)';

export const howItWorksFaq = [
  {
    q: 'Are flights included?',
    a: 'Flights and train fare are not included unless a trip says so. Each trip page lists what’s included and what isn’t.',
  },
  {
    q: 'How do I get the price?',
    a: 'Tap Get details on any trip, or message us on WhatsApp. Your planner replies with the plan and the price for your dates.',
  },
  {
    q: 'Can the plan be changed?',
    a: 'Yes. Tell us your dates, who’s travelling and what you’d like to change, and we’ll adjust the plan and the price.',
  },
  {
    q: 'Do prices change?',
    a: 'Yes. A price depends on your dates, hotel availability and group size. Your planner gives you the price for your dates and confirms it before you book.',
  },
  {
    q: 'How do I book?',
    a: 'Message us on WhatsApp or use the trip planner. We reply with the plan and the price, and confirm the booking with you there.',
  },
  {
    q: 'Where are you based?',
    a: `${site.city}, India. Call ${site.phoneDisplay} or email ${site.email}.`,
  },
];

export const indiaToursFaq = [
  {
    q: 'Can you change a route or add places?',
    a: 'Yes. Every route on this page is a starting point. Add a city, slow the pace, or join two routes together; your planner reshapes the plan and the price.',
  },
  {
    q: 'When is the best time to visit?',
    a: 'For north India and South India, October to March is the most comfortable time. Ask your planner about your exact dates.',
  },
  {
    q: 'Do I need a visa to visit India?',
    a: 'Most visitors do, and the rules depend on your passport. Apply only through the Government of India’s official e-Visa website, indianvisaonline.gov.in, and check the current rules before you book flights.',
  },
  {
    q: 'Do you plan for families and groups?',
    a: 'Yes. Couples, families and groups are all planned the same way: around who is travelling and what you want to see.',
  },
  {
    q: 'How do we talk before the trip?',
    a: `On WhatsApp at ${site.whatsappDisplay}, or by email at ${site.email}. You’ll get a reply from a real person, not a bot.`,
  },
  {
    q: 'What time zone are you in?',
    a: `We are in India, on ${TIME_ZONE}, the same everywhere in the country. Send your message at any hour on WhatsApp and your planner will reply as soon as the team is online.`,
  },
  {
    q: 'Is travel insurance a good idea?',
    a: 'For any international trip, yes. Choose a policy that covers medical care, cancellations and your belongings, and check that it covers the activities on your route.',
  },
];
