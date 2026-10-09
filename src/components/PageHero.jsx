import { useRef } from 'react';
import VideoClip, { FULL_BLEED } from './VideoClip';
import SplitHeading from './SplitHeading';
import { useExitDepth } from '../lib/useDepth';

// The dark opening band every inner page shares: an optional destination film,
// the page title rising into place, an optional `aside` (a Hindi word that writes
// itself), and a scene for the sound mix.
export default function PageHero({ title, lead, video, size = 'md', scene, aside, children }) {
  const ref = useRef(null);
  useExitDepth(ref, '.clip', '.page-hero-body');

  return (
    <section
      ref={ref}
      className={`page-hero page-hero--${size}${video ? ' has-video' : ''}${aside ? ' has-aside' : ''}`}
      data-scene={scene}
      aria-labelledby="page-title"
    >
      {video ? <VideoClip video={video} mode="inview" priority sizes={FULL_BLEED} /> : null}
      <div className="page-hero-shade" />
      {aside ? <div className="page-hero-aside">{aside}</div> : null}
      <div className="wrap page-hero-body">
        <SplitHeading as="h1" id="page-title" className="t-hero display" immediate>
          {title}
        </SplitHeading>
        {lead ? <p className="t-lead hero-enter" style={{ '--enter': 1 }}>{lead}</p> : null}
        {children ? (
          <div className="hero-enter" style={{ '--enter': 2 }}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
