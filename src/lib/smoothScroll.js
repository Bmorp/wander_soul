import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduceMotion } from './motion';

// One Lenis instance for the whole site, driven by GSAP's ticker so smooth
// scrolling and scroll-linked animation stay in step. Touch keeps native
// scrolling; reduced motion turns smoothing off entirely.
let lenis = null;
const tick = (time) => lenis?.raf(time * 1000);

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined' || reduceMotion()) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -96 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function stopSmoothScroll() {
  gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
}

export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
};

export const scrollToElement = (el) => {
  if (lenis) lenis.scrollTo(el, { immediate: true, offset: -96, force: true });
  else el.scrollIntoView();
};

// An instant jump to a point on the page.
export const jumpTo = (y) => {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
};

// A smooth glide to a section, clearing the sticky bars above it.
export const glideTo = (el, offset = -88) => {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.1 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduceMotion() ? 'auto' : 'smooth' });
};

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
