import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './App.jsx';
import { reloadOnce } from './lib/staleBuild';
import 'lenis/dist/lenis.css';
import './index.css';

// A page file from an older deploy is gone: reload onto the new build (once).
window.addEventListener('vite:preloadError', (e) => {
  if (reloadOnce()) e.preventDefault();
});

// Motion-dependent styles (hidden-until-animated headings, reveals) only apply when motion is welcome.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('can-reveal');
}
// Browsers that can morph one page into the next skip the plain fade.
if (typeof document.startViewTransition === 'function') {
  document.documentElement.classList.add('has-vt');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </React.StrictMode>,
);
