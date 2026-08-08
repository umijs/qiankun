import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  // library mode leaves process.env.NODE_ENV to the consumer; this bundle runs straight in a
  // browser (inside the outer sandbox), so it has to be resolved at build time
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // keep the bundle readable when debugging trace snapshots
    minify: false,
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('src/main.ts', import.meta.url)),
      // classic script output: the outer app must load this as a UMD-shaped `entry` script,
      // which is what exercises the classic evaluation path of the outer sandbox
      formats: ['iife'],
      name: '__subNestedBundle',
      fileName: () => 'entry.js',
    },
  },
});
