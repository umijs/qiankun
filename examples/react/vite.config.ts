import path from 'node:path';
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { qiankunDevEntryPlugin } from '../shared/vite/qiankunDevPlugin';

function qiankunEntryHtmlPlugin(): PluginOption {
  return {
    name: 'qiankun-entry-html',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const entryChunk = Object.values(bundle).find((item) => item.type === 'chunk' && item.isEntry);

      if (!entryChunk || entryChunk.type !== 'chunk') {
        throw new Error('No qiankun entry chunk generated');
      }

      const cssAssets = Object.values(bundle).filter(
        (item) => item.type === 'asset' && item.fileName.endsWith('.css'),
      );

      const styleTags = cssAssets
        .map((asset) => `<link rel="stylesheet" href="./${asset.fileName}">`)
        .join('\n    ');

      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        name: 'index.html',
        source: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${styleTags}
  </head>
  <body>
    <div id="root"></div>
    <script src="./${entryChunk.fileName}" entry></script>
  </body>
</html>`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const isQiankun = mode === 'qiankun';

  return {
    base: isQiankun ? './' : '/',
    plugins: [
      react(),
      qiankunDevEntryPlugin({ appName: 'reactApp', rootId: 'root', moduleEntry: '/src/main.tsx' }),
      isQiankun && qiankunEntryHtmlPlugin(),
    ].filter(Boolean),
    define: isQiankun
      ? {
          'process.env.NODE_ENV': JSON.stringify('production'),
        }
      : undefined,
    build: isQiankun
      ? {
          cssCodeSplit: false,
          lib: {
            entry: path.resolve(__dirname, 'src/main.tsx'),
            formats: ['iife'],
            name: 'reactApp',
            fileName: () => 'sub-app',
          },
          rollupOptions: {
            output: {
              extend: true,
              inlineDynamicImports: true,
              entryFileNames: 'assets/[name]-[hash].js',
              assetFileNames: 'assets/[name]-[hash][extname]',
            },
          },
        }
      : undefined,
    server: {
      port: 7100,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  };
});
