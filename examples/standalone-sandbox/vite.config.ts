import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Keep the classic widget as a fetchable file so the CSP example does not need data: in connect-src.
    assetsInlineLimit: 0,
  },
  server: {
    port: 7103,
    strictPort: true,
  },
  preview: {
    port: 7103,
    strictPort: true,
  },
});
