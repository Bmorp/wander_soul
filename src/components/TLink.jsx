import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

// Every internal link moves between pages with a view transition: the page you leave
// dissolves into the next, and a marked picture (lib/transitions) grows into its hero.
const TLink = forwardRef(function TLink(props, ref) {
  return <Link ref={ref} viewTransition {...props} />;
});

export default TLink;
