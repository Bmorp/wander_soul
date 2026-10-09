import Link from './TLink';
import Icon from './Icon';

// The last slot of a trip grid: the custom-trip offer, so no row ends half empty.
export default function PlanTile() {
  return (
    <Link to="/contact" className="plan-tile" data-reveal>
      <span className="plan-tile-title">Somewhere else in mind?</span>
      <span className="plan-tile-text">Tell us where and when. We’ll plan it around you and send a price.</span>
      <span className="plan-tile-go">
        Plan your trip <Icon name="arrowRight" size={18} />
      </span>
    </Link>
  );
}
