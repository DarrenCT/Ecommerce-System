import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use the environment variable set in docker-compose.yml
const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // This ensures the server listens on all network interfaces
    port: 5173,
    watch: {
      usePolling: true  // This helps with Docker on some systems
    },
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html'
      }
    }
  }
});