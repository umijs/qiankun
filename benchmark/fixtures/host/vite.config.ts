import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: true,
    manifest: true,
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      input: {
        garfish: fileURLToPath(new URL('garfish.html', import.meta.url)),
        microApp: fileURLToPath(new URL('micro-app.html', import.meta.url)),
        native: fileURLToPath(new URL('native.html', import.meta.url)),
        qiankun: fileURLToPath(new URL('qiankun.html', import.meta.url)),
        qiankunV2: fileURLToPath(new URL('qiankun-v2.html', import.meta.url)),
        wujie: fileURLToPath(new URL('wujie.html', import.meta.url)),
      },
    },
    sourcemap: false,
  },
});
