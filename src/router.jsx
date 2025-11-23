import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import ApiDocsPage from './pages/ApiDocsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'analyze',
        element: <AnalyzePage />,
      },
      {
        path: 'api-docs',
        element: <ApiDocsPage />,
      },
    ],
  },
]);

export default router;
