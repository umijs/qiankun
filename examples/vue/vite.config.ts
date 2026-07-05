import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Explicitly define the Vue feature flags, Vue's own recommended setup for the esm-bundler
// build (https://link.vuejs.org/feature-flags): it enables proper tree-shaking and keeps the
// build deterministic. The qiankun ESM sandbox also handles the runtime fallback path
// (dunder feature flags bound live), so this is best practice, not a workaround.
const vueFeatureFlags = {
  __VUE_OPTIONS_API__: 'true',
  __VUE_PROD_DEVTOOLS__: 'false',
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
};

export default defineConfig({
  define: vueFeatureFlags,
  // config.define does not reach dep prebundling, the flags must be passed to rolldown too
  // (vite 8 prebundles with rolldown; esbuildOptions is deprecated)
  optimizeDeps: {
    rolldownOptions: {
      transform: {
        define: vueFeatureFlags,
      },
    },
  },
  plugins: [vue(), qiankun()],
  server: {
    port: 7101,
    strictPort: true,
  },
});
