import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// This shell is a host, not a micro app, so it carries no @qiankunjs/bundler-plugin — only the
// Vue feature flags every esm-bundler build should define (https://link.vuejs.org/feature-flags).
export default defineConfig({
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  // @qiankunjs/vue reaches Vue through vue-demi, which resolves it from the binding's own
  // node_modules — a different physical copy than this app's in a pnpm workspace. Two Vue runtimes
  // means the binding's onMounted/watch never fire and nothing mounts, so dedupe is mandatory here
  // (this is what @vitejs/plugin-react does for react/react-dom out of the box).
  resolve: {
    dedupe: ['vue'],
  },
  plugins: [vue()],
  server: {
    port: 7105,
    strictPort: true,
  },
});
