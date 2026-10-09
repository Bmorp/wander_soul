import { Navigate, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import RouteError from './components/RouteError';
import Home from './pages/Home';

// The home page ships in the main bundle. Every other page loads on demand, and the
// router waits for it before switching, so a page never flashes in half-built and
// view transitions can morph from the page you left into the one you open.
const page = (load) => async () => ({ Component: (await load()).default });

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      errorElement: <RouteError />,
      children: [
        {
          // A page that fails to load shows its error inside the site's nav and footer.
          errorElement: <RouteError />,
          children: [
            { index: true, element: <Home /> },
            { path: 'india-tours', lazy: page(() => import('./pages/IndiaTours')) },
            { path: 'international', lazy: page(() => import('./pages/International')) },
            { path: 'holidays', lazy: page(() => import('./pages/Holidays')) },
            { path: 'trips/:slug', lazy: page(() => import('./pages/Trip')) },
            { path: 'compare', lazy: page(() => import('./pages/Compare')) },
            { path: 'how-it-works', lazy: page(() => import('./pages/HowItWorks')) },
            { path: 'about', lazy: page(() => import('./pages/About')) },
            { path: 'contact', lazy: page(() => import('./pages/Contact')) },
            { path: 'account', lazy: page(() => import('./pages/Account')) },
            { path: 'privacy', lazy: page(() => import('./pages/Privacy')) },
            { path: 'terms', lazy: page(() => import('./pages/Terms')) },

            // Older addresses
            { path: 'trips', element: <Navigate to="/holidays" replace /> },
            { path: 'tour', element: <Navigate to="/holidays" replace /> },
            { path: 'services', element: <Navigate to="/how-it-works" replace /> },
            { path: 'profile', element: <Navigate to="/account" replace /> },
            { path: 'itinerary', element: <Navigate to="/account" replace /> },

            { path: '*', lazy: page(() => import('./pages/NotFound')) },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);
