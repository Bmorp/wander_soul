import { videos } from './videos.js';

// Destinations abroad that Wander Soul plans on request (named on the previous
// site), shown alongside the three international packages. No package details
// are published for these, so the page says so.
export const onRequest = [
  {
    slug: 'bali',
    name: 'Bali',
    greeting: 'Om Swastiastu',
    line: 'Rice terraces, temples and the beaches of the south.',
    video: videos.bali,
    scene: 'islands',
  },
  {
    slug: 'maldives',
    name: 'Maldives',
    greeting: null,
    line: 'Overwater villas, reefs and very little else to do.',
    video: videos.maldives,
    scene: 'islands',
  },
  {
    slug: 'vietnam',
    name: 'Vietnam',
    greeting: 'Xin chào',
    line: 'Ha Long Bay by boat, old Hanoi and the lanterns of Hoi An.',
    video: videos.vietnam,
    scene: 'world',
  },
];

// A greeting from each packaged country, shown on the international page.
export const greetings = {
  thailand: 'สวัสดี · Sawasdee',
  malaysia: 'Selamat datang',
  'sri-lanka': 'ආයුබෝවන් · Ayubowan',
};
