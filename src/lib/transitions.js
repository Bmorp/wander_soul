// Shared-element page transitions. Before a link navigates, the picture that was
// tapped is named, so the browser can grow it into the hero of the page it opens
// (`trip-hero` for trip pages, `page-hero` for the section pages). Only one element
// may carry a name at a time, so any hero already on screen steps aside.

const canMorph = () => typeof document !== 'undefined' && typeof document.startViewTransition === 'function';

export function markSource(el, name = 'trip-hero') {
  if (!canMorph() || !el) return;
  document.querySelectorAll('.vt-src').forEach((n) => {
    n.style.viewTransitionName = '';
    n.classList.remove('vt-src');
  });
  document.querySelectorAll('.trip-hero, .page-hero').forEach((n) => n.classList.add('vt-off'));
  el.style.viewTransitionName = name;
  el.classList.add('vt-src');
}

// onClick helper: name the closest matching element inside the tapped link's card.
export const morphFrom = (selector, name = 'trip-hero') => (e) => {
  const host = e.currentTarget.closest('[data-morph]') || e.currentTarget;
  markSource(selector ? host.querySelector(selector) || host : host, name);
};
