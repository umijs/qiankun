import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import qiankunHtmlPlugin from './config/qiankunHtml';

export default defineConfig(({ mode }) => {
  const isQiankun = mode === 'qiankun';

  return {
    base: isQiankun ? './' : '/',
    // No qiankun-specific vite plugin needed: in dev the app is loaded as a native ESM entry
    // by the qiankun ESM sandbox (lifecycles exported from the entry module), and the
    // qiankun-mode legacy build registers them on window['react'] itself (see src/main.tsx).
    plugins: [
      react(),
      isQiankun && legacy({ renderLegacyChunks: true }),
      isQiankun && qiankunHtmlPlugin(),
    ].filter(Boolean),
    server: {
      port: 7100,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    build: {
      lib: isQiankun ? undefined : {
        entry: './src/main.tsx',
        name: 'react',
        formats: ['umd'],
        fileName: 'react'
      },
      rollupOptions: isQiankun ? undefined : {
        external: [],
        output: {
          globals: {}
        }
      }
    },
  };
});
