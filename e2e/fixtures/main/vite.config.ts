import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  // built output is served by servers/serve.mjs, keep everything self-contained
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // keep the bundle readable when debugging trace snapshots
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        // loadMicroApp playground driven via window.__E2E__
        index: fileURLToPath(new URL('index.html', import.meta.url)),
        // registerMicroApps + activeRule routing mode
        register: fileURLToPath(new URL('register.html', import.meta.url)),
      },
    },
  },
});
