import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'VueMicroApp',
      formats: ['umd'],
      fileName: () => 'vue.js',
    },
    
    rollupOptions: {
      external: ['vue', 'vue-router', 'qiankun'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          qiankun: 'qiankun',
        },
      },
    },
  },
  
  server: {
    port: 3002,
    strictPort: true,
    open: false,
    cors: true,
  },
  
  preview: {
    port: 5000,
    strictPort: false,
    open: false,
    cors: true,
  },
});
