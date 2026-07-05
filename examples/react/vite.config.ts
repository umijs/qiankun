import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import qiankunHtmlPlugin from './config/qiankunHtml';
import qiankun from 'vite-plugin-qiankun';

export default defineConfig(({ mode }) => {
  const isQiankun = mode === 'qiankun';

  return {
    base: isQiankun ? './' : '/',
    plugins: [
      react(),
      // vite-plugin-qiankun only serves the legacy (qiankun-mode) build. In dev the app is
      // loaded as a native ESM entry by the qiankun ESM sandbox; the plugin's dev bridge
      // (renderWithQiankun protocol) would hijack the entry and hang the mount instead.
      isQiankun && qiankun('react', {
        useDevMode: true
      }),
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
