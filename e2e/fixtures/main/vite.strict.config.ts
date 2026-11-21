import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const fromRepo = (relativePath: string) => fileURLToPath(new URL(`../../../${relativePath}`, import.meta.url));

/**
 * Dedicated build for react-strict-host.html using development React/ReactDOM so StrictMode
 * executes its double-setup / cleanup checks while @qiankunjs/react remains the built dist package.
 */
export default defineConfig({
  base: './',
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  resolve: {
    dedupe: ['qiankun', 'react', 'react-dom'],
    alias: {
      '@qiankunjs/react': fromRepo('packages/ui-bindings/react/dist/esm/index.js'),
      'react/jsx-runtime': fromRepo('packages/ui-bindings/react/node_modules/react/jsx-runtime.js'),
      'react-dom/client': fromRepo('packages/ui-bindings/react/node_modules/react-dom/client.js'),
      'react-dom': fromRepo('packages/ui-bindings/react/node_modules/react-dom/index.js'),
      react: fromRepo('packages/ui-bindings/react/node_modules/react/index.js'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        reactStrictHost: fileURLToPath(new URL('react-strict-host.html', import.meta.url)),
      },
    },
  },
});
