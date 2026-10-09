// A picture that fades in once it has loaded, instead of popping in. Spread it onto an
// <img> with the class below. A picture that is already loaded (from the cache) or that
// fails still ends up visible. Not for the first screen's pictures: browsers ignore an
// invisible image when timing the largest paint.
export const FADE_CLASS = 'fade-in';

export const fadeIn = {
  ref: (el) => {
    if (el && el.complete) el.classList.add('is-loaded');
  },
  onLoad: (e) => e.currentTarget.classList.add('is-loaded'),
  onError: (e) => e.currentTarget.classList.add('is-loaded'),
};
