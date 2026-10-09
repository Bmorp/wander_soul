// One place decides which films play. Only the most visible ones run, one at a
// time on phones and two on larger screens, none while the tab is hidden, and
// none that another layer covers (a stacked panel, the open menu). Films far off
// screen give their decoder back; everything else rests on its poster frame.
// Each clip registers an object with:
//   wants()            -> should it play if there is room?
//   rank()             -> higher plays first
//   setPlaying(bool)   -> start or pause
//   setNear(bool)      -> within a few screens of the viewport?

const clips = new Map();
let visibility = null;
let nearness = null;
let frame = 0;

const limit = () => (window.matchMedia('(max-width: 767px)').matches ? 1 : 2);

// Is something else painted over the middle of this film?
function covered(el) {
  const r = el.getBoundingClientRect();
  const x = Math.min(Math.max(r.left + r.width / 2, 1), window.innerWidth - 2);
  const y = Math.min(Math.max(r.top + r.height / 2, 1), window.innerHeight - 2);
  const hit = document.elementFromPoint(x, y);
  // The opening's curtain lifts into the film, so the film runs beneath it.
  if (!hit || hit.closest('.intro')) return false;
  const host = el.closest('section, article, figure, a') || el.parentElement;
  return !host.contains(hit);
}

function decide() {
  frame = 0;
  const hidden = document.visibilityState === 'hidden';
  const ranked = [];
  clips.forEach((clip, el) => {
    if (!hidden && clip.wants() && !covered(el)) ranked.push(clip);
  });
  ranked.sort((a, b) => b.rank() - a.rank());
  const winners = new Set(ranked.slice(0, limit()));
  clips.forEach((clip) => clip.setPlaying(winners.has(clip)));
}

export function requestPlaybackDecision() {
  if (!frame) frame = requestAnimationFrame(decide);
}

function observers() {
  if (!visibility) {
    visibility = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const clip = clips.get(entry.target);
          if (!clip) return;
          clip.ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
          clip.area = entry.isIntersecting ? entry.intersectionRect.width * entry.intersectionRect.height : 0;
        });
        requestPlaybackDecision();
      },
      { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1] },
    );
    nearness = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => clips.get(entry.target)?.setNear(entry.isIntersecting));
      },
      { rootMargin: '150% 0px 150% 0px' },
    );
    document.addEventListener('visibilitychange', requestPlaybackDecision);
  }
  return { visibility, nearness };
}

export function registerClip(el, clip) {
  const { visibility: v, nearness: n } = observers();
  clips.set(el, clip);
  v.observe(el);
  n.observe(el);
  return () => {
    v.unobserve(el);
    n.unobserve(el);
    clips.delete(el);
    requestPlaybackDecision();
  };
}
