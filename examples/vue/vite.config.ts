import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import qiankunHtmlPlugin from './config/qiankunHtml';

// Explicitly define the Vue feature flags, Vue's own recommended setup for the esm-bundler
// build (https://link.vuejs.org/feature-flags): it enables proper tree-shaking and keeps the
// legacy (qiankun-mode) build deterministic. The qiankun ESM sandbox also handles the runtime
// fallback path (dunder feature flags bound live), so this is best practice, not a workaround.
const vueFeatureFlags = {
  __VUE_OPTIONS_API__: 'true',
  __VUE_PROD_DEVTOOLS__: 'false',
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
};

export default defineConfig(({ mode }) => {
  const isQiankun = mode === 'qiankun';

  return {
    base: isQiankun ? './' : '/',
    define: vueFeatureFlags,
    // config.define does not reach dep prebundling, the flags must be passed to esbuild too
    optimizeDeps: {
      esbuildOptions: {
        define: vueFeatureFlags,
      },
    },
    plugins: [
      vue(),
      isQiankun && legacy({ renderLegacyChunks: true }),
      isQiankun && qiankunHtmlPlugin(),
    ].filter(Boolean),
    server: {
      port: 7101,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  };
});
