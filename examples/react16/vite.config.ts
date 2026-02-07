import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'React16MicroApp',
      formats: ['umd'],
      fileName: () => 'react16.js',
    },
    
    rollupOptions: {
      external: ['react', 'react-dom', 'qiankun'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          qiankun: 'qiankun',
        },
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  
  server: {
    port: 3000,
    strictPort: false,
    open: false,
    cors: true,
    hmr: {
      overlay: true,
    },
  },
  
  preview: {
    port: 5000,
    strictPort: false,
    open: false,
    cors: true,
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['qiankun'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
});
