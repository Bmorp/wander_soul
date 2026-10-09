import { useEffect, useRef, useState } from 'react';
import Link from './TLink';
import Icon from './Icon';
import VideoClip, { FULL_BLEED } from './VideoClip';
import SplitHeading from './SplitHeading';
import SoundToggle from './SoundToggle';
import { videos } from '../data/videos';
import { useExitDepth } from '../lib/useDepth';
import { markSource } from '../lib/transitions';
import Roll from './Roll';
import { INTRO_DONE } from './Intro';

// The opening film: five destinations, each with its own route into the site.
const CLIPS = [
  { video: videos.taj, to: '/trips/golden-triangle', line: 'The Golden Triangle · India tour' },
  { video: videos.kashmir, to: '/trips/kashmir', line: 'Kashmir · 4 days, 3 nights' },
  { video: videos.varanasi, to: '/trips/classic-india-varanasi', line: 'Classic India and Varanasi · India tour' },
  { video: videos.goa, to: '/trips/goa', line: 'Goa · 4 days, 3 nights' },
  { video: videos.keralaCanoe, to: '/trips/south-india', line: 'South India · India tour' },
];

const DURATION = 7000;
const motionAllowed = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function HeroCinema() {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(motionAllowed);
  const [onScreen, setOnScreen] = useState(true);
  const clip = CLIPS[index];
  const next = (index + 1) % CLIPS.length;
  const prev = (index - 1 + CLIPS.length) % CLIPS.length;
  const running = playing && onScreen;
  // On a first visit the opening plays over the film: the film runs beneath it, but its
  // clock and the lines under the headline wait for the curtain to lift.
  const [held, setHeld] = useState(() => typeof window !== 'undefined' && Boolean(window.__wsIntro));
  useExitDepth(ref, '.hero-media', '.hero-body');

  useEffect(() => {
    if (!held) return undefined;
    const go = () => setHeld(false);
    if (!window.__wsIntro) go();
    window.addEventListener(INTRO_DONE, go, { once: true });
    return () => window.removeEventListener(INTRO_DONE, go);
  }, [held]);

  // The film only advances while someone can see it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`hero${held ? ' is-held' : ''}`} aria-labelledby="hero-title" data-scene="india" data-chapter="Welcome">
      <div className="hero-media" aria-hidden="true">
        {CLIPS.map((c, n) =>
          // Only the film on screen, the one fading out and the next one are mounted.
          n === index || n === next || n === prev ? (
            <div key={c.to} className={`hero-slide${n === index ? ' is-on' : ''}`}>
              <VideoClip video={c.video} mode="manual" active={n === index && running} warm={n === next} priority={n === 0} sizes={FULL_BLEED} label="" />
            </div>
          ) : null,
        )}
        <div className="hero-shade" />
      </div>

      <div className="hero-body wrap">
        <SplitHeading as="h1" id="hero-title" className="hero-title display" variant="chars" immediate delay={0.1}>
          Travel with feeling.
        </SplitHeading>
        <p className="hero-lead hero-enter" style={{ '--enter': 1 }}>
          Holidays across India and abroad, and India tours for visitors from around the world.
        </p>
        <div className="cta-row hero-enter" style={{ '--enter': 2 }}>
          <Link className="btn btn-gold" to="/contact">
            <Roll>Plan your trip</Roll>
          </Link>
          <Link className="btn btn-glass" to="/india-tours">
            <Roll>Discover India</Roll>
          </Link>
        </div>
      </div>

      <div className="hero-foot wrap hero-enter" style={{ '--enter': 3 }}>
        <Link className="hero-now" to={clip.to} onClick={() => markSource(ref.current?.querySelector('.hero-slide.is-on .clip'))}>
          <span className="hero-now-label">{clip.video.label}</span>
          <span className="hero-now-line">
            {clip.line} <Icon name="chevronRight" size={16} />
          </span>
        </Link>

        <div className="hero-controls">
          <SoundToggle variant="pill" />
          <div className="segs" role="group" aria-label="Choose a film">
            {CLIPS.map((c, n) => (
              <button
                key={c.to}
                type="button"
                className={`seg${n < index ? ' is-done' : ''}${n === index ? ' is-on' : ''}`}
                aria-label={`Show ${c.video.label}`}
                aria-current={n === index ? 'true' : undefined}
                onClick={() => setIndex(n)}
              >
                <span
                  key={n === index ? `on-${index}` : 'off'}
                  style={{ animationDuration: `${DURATION}ms`, animationPlayState: running && !held ? 'running' : 'paused' }}
                  onAnimationEnd={n === index ? () => setIndex(next) : undefined}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="hero-pause"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause the film' : 'Play the film'}
          >
            <Icon name={playing ? 'pause' : 'play'} size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
