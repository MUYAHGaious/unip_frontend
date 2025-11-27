import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to handle SPA routing
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Don't interfere with Vite's internal routes
          if (req.url.startsWith('/@') || req.url.startsWith('/node_modules') || req.url.startsWith('/src')) {
            return next();
          }
          // If requesting a route (not a file with extension), serve index.html
          // Only exclude actual API routes (starting with /api/)
          if (!req.url.includes('.') && !req.url.startsWith('/api/')) {
            req.url = '/index.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 3000,
    host: true, // Allow external connections
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts', 'chart.js', 'react-chartjs-2'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
  envPrefix: 'VITE_',
});
