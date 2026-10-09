import { videos } from './videos.js';

// Priority states for India tours, from Wander Soul's inbound research.
// `hindi` is the state's name in Devanagari, written in gold beside the name on each card.
export const states = [
  {
    slug: 'maharashtra',
    name: 'Maharashtra',
    hindi: 'महाराष्ट्र',
    line: 'Mumbai’s seafront, the Ajanta and Ellora caves, and the hills of Lonavala.',
    places: ['Mumbai', 'Ajanta & Ellora', 'Lonavala'],
    video: videos.mumbai,
    scene: 'city',
  },
  {
    slug: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    hindi: 'उत्तर प्रदेश',
    line: 'The Taj Mahal in Agra, the ghats of Varanasi, and Lucknow’s old city.',
    places: ['Agra', 'Varanasi', 'Lucknow'],
    video: videos.tajClose,
    scene: 'ghats',
  },
  {
    slug: 'kerala',
    name: 'Kerala',
    hindi: 'केरल',
    line: 'Backwaters by houseboat, tea hills in Munnar, and Fort Kochi by the sea.',
    places: ['Kochi', 'Munnar', 'Alleppey'],
    video: videos.keralaHills,
    scene: 'backwaters',
  },
  {
    slug: 'rajasthan',
    name: 'Rajasthan',
    hindi: 'राजस्थान',
    line: 'Hill forts and palaces in Jaipur, the lakes of Udaipur, and the Jaisalmer desert.',
    places: ['Jaipur', 'Udaipur', 'Jaisalmer'],
    video: videos.jaipur,
    scene: 'india',
  },
  {
    slug: 'punjab',
    name: 'Punjab',
    hindi: 'पंजाब',
    line: 'The Golden Temple in Amritsar, and the ceremony at the Wagah border.',
    places: ['Amritsar', 'Golden Temple', 'Wagah Border'],
    video: videos.amritsar,
    scene: 'ghats',
  },
];
