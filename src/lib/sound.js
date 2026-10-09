import { beds, scenes } from '../data/sounds';

// The "sounds of India" mixer. Off until the visitor turns it on (browsers
// block audio before a gesture anyway). Each bed is a looping <audio> routed
// through its own Web Audio gain, so scenes crossfade smoothly everywhere,
// including iOS, where element volume is fixed.

const listeners = new Set();
const tracks = {};
let ctx = null;
let master = null;
let enabled = false;
let pageScene = 'india';
let sectionScene = null;
let hoverScene = null;
let current = 'india';

const notify = () => listeners.forEach((fn) => fn({ enabled, scene: current }));

export function subscribeSound(fn) {
  listeners.add(fn);
  fn({ enabled, scene: current });
  return () => listeners.delete(fn);
}

function context() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (enabled) ctx.resume();
  });
  return ctx;
}

function track(name) {
  if (tracks[name]) return tracks[name];
  const bed = beds[name];
  if (!bed || !ctx) return null;
  const el = new Audio();
  el.crossOrigin = 'anonymous';
  el.loop = true;
  el.preload = 'none';
  el.src = bed.src;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  ctx.createMediaElementSource(el).connect(gain).connect(master);
  tracks[name] = { el, gain, stop: 0 };
  return tracks[name];
}

function ramp(param, value, seconds) {
  const now = ctx.currentTime;
  param.cancelScheduledValues(now);
  param.setValueAtTime(param.value, now);
  param.linearRampToValueAtTime(value, now + seconds);
}

function mix(seconds = 2.4) {
  if (!ctx || !enabled) return;
  const levels = scenes[current] || scenes.india;
  Object.entries(levels).forEach(([name, level]) => {
    const t = track(name);
    if (!t) return;
    window.clearTimeout(t.stop);
    if (t.el.paused) t.el.play().catch(() => {});
    ramp(t.gain.gain, level, seconds);
  });
  Object.entries(tracks).forEach(([name, t]) => {
    if (name in levels) return;
    ramp(t.gain.gain, 0, seconds);
    window.clearTimeout(t.stop);
    t.stop = window.setTimeout(() => t.el.pause(), seconds * 1000 + 150);
  });
}

function resolve() {
  const next = hoverScene || sectionScene || pageScene;
  if (next === current || !scenes[next]) return;
  current = next;
  mix();
  notify();
}

export function enableSound() {
  if (!context()) return;
  ctx.resume();
  enabled = true;
  ramp(master.gain, 1, 1.4);
  mix(1.8);
  notify();
}

export function disableSound() {
  enabled = false;
  if (ctx) {
    ramp(master.gain, 0, 0.8);
    window.setTimeout(() => {
      if (!enabled) Object.values(tracks).forEach((t) => t.el.pause());
    }, 900);
  }
  notify();
}

export const toggleSound = () => (enabled ? disableSound() : enableSound());
export const isSoundOn = () => enabled;

export function setPageScene(name) {
  pageScene = name || 'india';
  sectionScene = null;
  hoverScene = null;
  resolve();
}

export function setSectionScene(name) {
  sectionScene = name;
  resolve();
}

export function setHoverScene(name) {
  hoverScene = name;
  resolve();
}
