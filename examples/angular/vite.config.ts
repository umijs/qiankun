import { defineConfig } from 'vite';
import angular from '@vitejs/plugin-angular';
import path from 'path';

export default defineConfig({
  plugins: [angular()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'AngularMicroApp',
      formats: ['umd'],
      fileName: () => 'angular.js',
    },
    
    rollupOptions: {
      external: ['@angular/core', '@angular/common', '@angular/platform-browser', '@angular/router', 'qiankun'],
      output: {
        globals: {
          '@angular/core': 'ng.core',
          '@angular/common': 'ng.common',
          '@angular/platform-browser': 'ng.platformBrowser',
          '@angular/router': 'ng.router',
          'qiankun': 'qiankun',
        },
      },
    },
  },
  
  server: {
    port: 3003,
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
