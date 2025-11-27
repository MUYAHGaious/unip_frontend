import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';
import { logger } from './utils/logger';
import './styles/index.css';

// Logger initializes automatically on import and starts capturing console logs
logger.info('UNIP Application Starting', {
  environment: import.meta.env.MODE,
  apiUrl: import.meta.env.VITE_API_URL,
  timestamp: new Date().toISOString(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <HistoryProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </HistoryProvider>
    </ThemeProvider>
  </React.StrictMode>
);

logger.info('UNIP Application Mounted Successfully');
