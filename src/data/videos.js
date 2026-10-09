// Destination footage from Pexels (free licence, no attribution required).
// Each clip carries every size Pexels publishes for it (checked by loading each file):
// 540p for cards, 720p for mid-size slots, 1080p for full-screen films, and 1440p
// only where that file stays small (the Taj films). Posters come in several widths so
// each slot fetches only what it shows.
// Clips whose Pexels files are long and heavy (Manali's 720p file alone is 50 MB) are
// served instead as 10-second loops cut from their opening, in public/films/
// (`local`): about 0.7, 1.5 and 3 MB at 540p, 720p and 1080p.
// Source pages: https://www.pexels.com/video/<id>/

const FILES = 'https://videos.pexels.com/video-files';
const POSTERS = 'https://images.pexels.com/videos';
const POSTER_WIDTHS = [480, 800, 1280, 1920, 2560];
const LOCAL_POSTER_WIDTHS = [480, 800, 1280];

function pexels(id, fps, posterFile, { label, hd = true, sd = true, fhd = true, qhd = false, local } = {}) {
  const file = (size) => `${FILES}/${id}/${id}-${size}_${fps}fps.mp4`;
  const loop = (h) => `/films/${local}-${h}.mp4`;
  const hdUrl = file('hd_1280_720');
  const sdUrl = file('sd_960_540');
  const posterAt = (w) => `${POSTERS}/${id}/${posterFile}?auto=compress&cs=tinysrgb&w=${w}`;
  // A film served from this site has its preview picture here too, cut from the film's own
  // frame (see LOCAL_POSTER_WIDTHS), so the picture and the film match and nothing waits on Pexels.
  const localPosterAt = (w) => `/films/${local}-poster-${w}.webp`;
  const files = local
    ? { sd: loop(540), hd: loop(720), fhd: loop(1080), qhd: null }
    : { sd: sd ? sdUrl : hdUrl, hd: hd ? hdUrl : sdUrl, fhd: fhd ? file('hd_1920_1080') : null, qhd: qhd ? file('uhd_2560_1440') : null };
  return {
    id,
    label,
    ...files,
    poster: local ? localPosterAt(1280) : posterAt(1280),
    posterSet: local
      ? LOCAL_POSTER_WIDTHS.map((w) => `${localPosterAt(w)} ${w}w`).join(', ')
      : POSTER_WIDTHS.map((w) => `${posterAt(w)} ${w}w`).join(', '),
    source: `https://www.pexels.com/video/${id}/`,
  };
}

export const videos = {
  taj: pexels(19705899, 30, 'taj-mahal-taj-mahal-palace-19705899.jpeg', { label: 'Taj Mahal, Agra', qhd: true }),
  tajClose: pexels(19717370, 30, 'taj-mahal-taj-mahal-palace-19717370.jpeg', { label: 'Taj Mahal, Agra', qhd: true }),
  jaipur: pexels(18983875, 25, 'pexels-photo-18983875.jpeg', { label: 'Hill forts above Jaipur', local: 'jaipur' }),
  varanasi: pexels(16668724, 24, 'pexels-photo-16668724.jpeg', { label: 'The ghats of Varanasi' }),
  varanasiBoats: pexels(16668743, 24, 'pexels-photo-16668743.jpeg', { label: 'Boats on the Ganges, Varanasi' }),
  keralaBackwaters: pexels(10513597, 30, 'india-kadamakkudy-kerala-kochi-10513597.jpeg', { label: 'Backwaters near Kochi, Kerala', hd: false, fhd: false }),
  keralaCanoe: pexels(9550276, 24, 'pexels-photo-9550276.jpeg', { label: 'A canoe on the Kerala backwaters' }),
  keralaHills: pexels(13852873, 30, 'clouds-green-hyperlapse-kerala-13852873.jpeg', { label: 'Clouds over the Kerala hills' }),
  delhi: pexels(6583583, 25, 'pexels-photo-6583583.jpeg', { label: 'India Gate, Delhi' }),
  amritsar: pexels(10307864, 25, 'pexels-photo-10307864.jpeg', { label: 'Golden Temple, Amritsar' }),
  mumbai: pexels(5025258, 30, 'pexels-photo-5025258.jpeg', { label: 'Marine Drive, Mumbai', local: 'mumbai' }),
  kashmir: pexels(16026025, 25, 'pexels-photo-16026025.jpeg', { label: 'Shikaras on Dal Lake, Srinagar', local: 'kashmir' }),
  goa: pexels(15455610, 30, 'aerial-view-aqua-beach-beach-shack-15455610.jpeg', { label: 'The Goa coast' }),
  manali: pexels(15456970, 25, 'manali-15456970.jpeg', { label: 'Snow above Manali', local: 'manali' }),
  // Its "1080p" file is really 720p, so it isn't offered as one.
  darjeeling: pexels(5037971, 30, 'people-train-5037971.jpeg', { label: 'The toy train, Darjeeling', sd: false, fhd: false }),
  himalaya: pexels(1439950, 30, 'free-video-1439950.jpg', { label: 'In the Himalayas', local: 'himalaya' }),
  thailand: pexels(10828553, 30, 'island-phuket-thailand-10828553.jpeg', { label: 'The Andaman coast, Thailand' }),
  malaysia: pexels(12937422, 30, 'buildings-kuala-lumpur-petronas-towers-skyscrapers-12937422.jpeg', { label: 'Kuala Lumpur skyline', local: 'malaysia' }),
  srilanka: pexels(13249508, 30, 'pexels-photo-13249508.jpeg', { label: 'Nine Arches Bridge, Ella' }),
  bali: pexels(17576166, 30, 'bali-cliff-farm-farming-17576166.jpeg', { label: 'Rice terraces, Bali' }),
  maldives: pexels(4701090, 30, 'beachfront-coral-indian-ocean-luxury-4701090.jpeg', { label: 'Overwater villas, Maldives', local: 'maldives' }),
  vietnam: pexels(3783927, 24, 'pexels-photo-3783927.jpeg', { label: 'Ha Long Bay, Vietnam', local: 'vietnam' }),
};
