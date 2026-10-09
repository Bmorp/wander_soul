import { useState } from 'react';
import Icon from './Icon';

// Share a trip: the phone's own share sheet where there is one (WhatsApp, Messages…),
// otherwise the link is copied.
export default function ShareButton({ title, text, className = '', label = 'Share' }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href.split('#')[0];
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        /* closed without sharing */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt('Copy this link', url);
    }
  };

  return (
    <button type="button" className={`share-btn ${className}`} onClick={share} aria-label={copied ? 'Link copied' : `${label} this trip`}>
      <Icon name={copied ? 'check' : 'share'} size={18} />
      <span className="share-label" aria-live="polite">
        {copied ? 'Copied' : label}
      </span>
    </button>
  );
}
