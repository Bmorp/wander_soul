import Link from './TLink';
import Icon from './Icon';
import VideoClip from './VideoClip';

export default function StateCard({ state }) {
  return (
    <article className="state" data-hover-play data-hover-scene={state.scene} data-cursor="Plan a trip" role="listitem">
      <VideoClip video={state.video} mode="hover" sizes="(min-width: 1024px) 380px, 80vw" />
      <div className="state-shade" />
      <span className="media-tag state-tag">{state.video.label}</span>
      <div className="state-body">
        <h3 className="state-name">
          <Link to={`/contact?state=${state.slug}`}>{state.name}</Link>
          <span className="state-hindi" lang="hi" aria-hidden="true" data-ink>
            <span>{state.hindi}</span>
          </span>
        </h3>
        <p className="state-line">{state.line}</p>
        <span className="state-go">
          Plan a trip here <Icon name="arrowRight" size={16} />
        </span>
      </div>
    </article>
  );
}
