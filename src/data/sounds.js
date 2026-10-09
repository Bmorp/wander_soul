// "Sounds of India": music and ambience from Pixabay (Pixabay Content Licence,
// free to use, no attribution required; credited in the footnotes anyway).
// Streamed from Pixabay's CDN, which allows cross-origin playback, so the
// mix runs through Web Audio and crossfades smoothly on every platform.

const CDN = 'https://cdn.pixabay.com/audio';

export const beds = {
  theme: {
    src: `${CDN}/2025/02/02/audio_69af1a5cf0.mp3`,
    title: 'Indian',
    artist: 'Kulakovka',
    page: 'https://pixabay.com/music/india-indian-295878/',
  },
  flute: {
    src: `${CDN}/2026/03/14/audio_dcea7f149e.mp3`,
    title: 'Bansuri India',
    artist: 'PatrizioYoga',
    page: 'https://pixabay.com/music/meditationspiritual-bansuri-india-olistik-sound-project-502032/',
  },
  bells: {
    src: `${CDN}/2022/03/14/audio_5bec9aa14b.mp3`,
    title: 'Indian Temple Bell',
    artist: 'freesound_community',
    page: 'https://pixabay.com/sound-effects/city-indian-temple-bell-68150/',
  },
  waves: {
    src: `${CDN}/2026/03/10/audio_bd4f80c889.mp3`,
    title: 'Gentle Ocean Waves',
    artist: 'DRAGON-STUDIO',
    page: 'https://pixabay.com/sound-effects/nature-gentle-ocean-waves-499666/',
  },
  birds: {
    src: `${CDN}/2025/11/30/audio_b96506e0f1.mp3`,
    title: 'Birds Forest Nature',
    artist: 'SoundReality',
    page: 'https://pixabay.com/sound-effects/nature-birds-forest-nature-445379/',
  },
  wind: {
    src: `${CDN}/2026/08/12/audio_6216d18311.mp3`,
    title: 'Gentle Wind Sounds',
    artist: 'DRAGON-STUDIO',
    page: 'https://pixabay.com/sound-effects/',
  },
  world: {
    src: `${CDN}/2026/07/18/audio_0abf76c0fc.mp3`,
    title: 'Travel Documentary',
    artist: 'SolarFLEX',
    page: 'https://pixabay.com/music/ambient-travel-documentary-569533/',
  },
};

// A scene is a mix: bed name -> level (0 to 1). Sections and pages pick a scene;
// the engine crossfades between them.
export const scenes = {
  india: { theme: 0.5 },
  ghats: { theme: 0.22, bells: 0.55 },
  backwaters: { flute: 0.42, birds: 0.5 },
  coast: { flute: 0.25, waves: 0.62 },
  mountains: { flute: 0.4, wind: 0.42 },
  city: { theme: 0.42 },
  world: { world: 0.5 },
  islands: { world: 0.32, waves: 0.55 },
};

export const SOUND_CREDITS = Object.values(beds)
  .map((b) => `“${b.title}” by ${b.artist}`)
  .join(', ');
