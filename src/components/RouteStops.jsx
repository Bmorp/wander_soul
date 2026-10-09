import Icon from './Icon';

// A route as one line of stops that wraps naturally: Delhi › Agra › Jaipur.
export default function RouteStops({ places, label = 'Route' }) {
  return (
    <ol className="stops" aria-label={label}>
      {places.map((p, i) => (
        <li key={p} className="stop">
          <span className="stop-name">{p}</span>
          {i < places.length - 1 ? <Icon name="chevronRight" size={14} className="stop-sep" /> : null}
        </li>
      ))}
    </ol>
  );
}
