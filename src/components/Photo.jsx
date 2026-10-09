import { photoUrl } from '../data/trips';
import { fadeIn, FADE_CLASS } from '../lib/fadeIn';

const WIDTHS = [480, 768, 1080, 1440, 1920, 2400];

export default function Photo({ photo, sizes = '100vw', priority = false, className, alt }) {
  if (!photo) return null;
  return (
    // `loading` comes before `src`: React sets props in this order, and an image whose
    // src is set before loading="lazy" is fetched at once instead of when it nears the screen.
    <img
      {...(priority ? {} : fadeIn)}
      className={priority ? className : `${className ? `${className} ` : ''}${FADE_CLASS}`}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
      src={photoUrl(photo.id, 1440)}
      srcSet={WIDTHS.map((w) => `${photoUrl(photo.id, w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={alt ?? photo.alt}
    />
  );
}
