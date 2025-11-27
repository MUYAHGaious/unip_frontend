import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import Loading from './components/common/Loading';

// Lazy load all page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AnalyzePage = lazy(() => import('./pages/AnalyzePage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const ApiDocsPage = lazy(() => import('./pages/ApiDocsPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loading message="Loading page..." />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'analyze',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AnalyzePage />
          </Suspense>
        ),
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HistoryPage />
          </Suspense>
        ),
      },
      {
        path: 'api-docs',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ApiDocsPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
