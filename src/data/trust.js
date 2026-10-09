// What a first-time visitor from abroad looks for before trusting an agency with money:
// who is behind the business, where it is, whether it is registered, and what happens
// if something goes wrong. Nothing here is invented. Each field is shown (on the About
// page, by components/BusinessDetails.jsx) only once it has a real value, so the page
// grows as the details are confirmed.
//
//   legalName      the registered business name, as on the registration papers
//   address        the office address, in one line
//   registrations  [{ label: 'GST number', value: '27ABCDE1234F1Z5' }, ...]
//   memberships    [{ name: 'Association name', url: 'https://...' }]
//   reviews        [{ label: 'Google reviews', url: 'https://...' }]
//   payments       how a booking is paid, in one sentence
//   cancellation   the cancellation and refund terms, in one or two sentences
//   languages      the languages the team speaks with guests, e.g. 'English and Hindi'
export const trust = {
  legalName: null,
  address: null,
  registrations: [],
  memberships: [],
  reviews: [],
  payments: null,
  cancellation: null,
  languages: null,
};

// Real testimonials only. The three quotes carried over from the earlier website have not
// been confirmed with the travellers named, so they stay hidden until they are.
export const SHOW_TESTIMONIALS = false;
