import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // OneDrive can lock .env while Vite is watching it on Windows.
      ignored: ['**/.env', '**/.env.*'],
    },
  },
});

