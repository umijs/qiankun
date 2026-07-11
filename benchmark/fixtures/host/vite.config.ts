import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: true,
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      input: {
        qiankun: fileURLToPath(new URL('qiankun.html', import.meta.url)),
        wujie: fileURLToPath(new URL('wujie.html', import.meta.url)),
      },
    },
    sourcemap: false,
  },
});
