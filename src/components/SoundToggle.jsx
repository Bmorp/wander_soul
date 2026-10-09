import { useEffect, useState } from 'react';
import Icon from './Icon';
import { subscribeSound, toggleSound } from '../lib/sound';

// The "sounds of India" switch. In the nav it is a speaker; as a pill it adds
// four bars that move while the mix is playing.
export default function SoundToggle({ variant = 'icon', className = '' }) {
  const [state, setState] = useState({ enabled: false });
  useEffect(() => subscribeSound(setState), []);
  const on = state.enabled;

  return (
    <button
      type="button"
      className={`sound-toggle sound-toggle--${variant}${on ? ' is-on' : ''} ${className}`}
      aria-pressed={on}
      aria-label={on ? 'Turn off the sounds of India' : 'Turn on the sounds of India'}
      title={on ? 'Sound on' : 'Sound off'}
      onClick={toggleSound}
    >
      {variant === 'pill' ? (
        <>
          <span className="eq" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="sound-label">{on ? 'Sound on' : 'Sounds of India'}</span>
        </>
      ) : (
        <Icon name={on ? 'volume' : 'volumeOff'} size={20} />
      )}
    </button>
  );
}
