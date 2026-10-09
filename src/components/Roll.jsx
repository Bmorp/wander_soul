// A label that rolls on hover: the words slide up and a copy rises from below.
// The copy is hidden from assistive technology, so the label is read once.
export default function Roll({ children }) {
  return (
    <span className="roll">
      <span className="roll-a">{children}</span>
      <span className="roll-b" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
