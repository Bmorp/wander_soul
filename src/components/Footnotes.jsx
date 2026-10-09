// Apple-style footnotes: numbered, linked from superscripts, set in the footer band.
export function Fn({ n }) {
  return (
    <sup>
      <a href={`#fn-${n}`} aria-label={`Footnote ${n}`}>
        {n}
      </a>
    </sup>
  );
}

export default function Footnotes({ items = [], notes = [] }) {
  if (!items.length && !notes.length) return null;
  return (
    <section className="footnotes" aria-label="Footnotes">
      <div className="wrap-wide">
        <ol>
          {items.map((text, i) => (
            <li key={`n-${i}`} id={`fn-${i + 1}`}>
              <span>{i + 1}.</span>
              {text}
            </li>
          ))}
          {notes.map((text, i) => (
            <li key={`p-${i}`}>{text}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
