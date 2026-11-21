import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const fromRepo = (relativePath: string) => fileURLToPath(new URL(`../../../${relativePath}`, import.meta.url));

export default defineConfig({
  // built output is served by servers/serve.mjs, keep everything self-contained
  base: './',
  resolve: {
    // point directly at workspace built dist & linked peer deps so e2e tests the built packages
    dedupe: ['qiankun', 'react', 'react-dom', 'vue'],
    alias: {
      '@qiankunjs/shared': fromRepo('packages/shared/dist/esm/index.js'),
      '@qiankunjs/react': fromRepo('packages/ui-bindings/react/dist/esm/index.js'),
      '@qiankunjs/vue': fromRepo('packages/ui-bindings/vue/dist/esm/index.js'),
      '@writable-dom-under-test': fromRepo('packages/loader/src/writable-dom/index.ts'),
      'react/jsx-runtime': fromRepo('packages/ui-bindings/react/node_modules/react/jsx-runtime.js'),
      'react-dom/client': fromRepo('packages/ui-bindings/react/node_modules/react-dom/client.js'),
      'react-dom': fromRepo('packages/ui-bindings/react/node_modules/react-dom/index.js'),
      react: fromRepo('packages/ui-bindings/react/node_modules/react/index.js'),
      vue: fromRepo('packages/ui-bindings/vue/node_modules/vue/dist/vue.esm-bundler.js'),
    },
  },
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
        // @qiankunjs/react host fixture (lifecycle updates, rapid switch, overlay occlusion)
        reactHost: fileURLToPath(new URL('react-host.html', import.meta.url)),
        // @qiankunjs/vue host fixture (props updates, rapid switch, unmount, overlay occlusion)
        vueHost: fileURLToPath(new URL('vue-host.html', import.meta.url)),
        // generic writable-dom sink minimal browser verification page
        writableDom: fileURLToPath(new URL('writable-dom.html', import.meta.url)),
        // real-browser EsmSandboxEngine concurrency race harness
        esmRace: fileURLToPath(new URL('esm-race.html', import.meta.url)),
      },
    },
  },
});
