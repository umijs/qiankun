import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'http://localhost:3004/',
  server: {
    port: 3004,
    strictPort: true,
    cors: true,
  },
});
