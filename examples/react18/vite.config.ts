import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Refresh
      include: '**/*.{jsx,tsx}',
    }),
    svgr({
      // Enable SVG as React components
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  
  // Build configuration for qiankun micro-app
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Generate library format for qiankun
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'ModernReactMicroApp',
      formats: ['umd'],
      fileName: () => 'modern-react.js',
    },
    
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: ['react', 'react-dom', 'qiankun'],
      output: {
        // Global variable names for external dependencies
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          qiankun: 'qiankun',
        },
      },
    },
    
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('tailwindcss'),
      ],
    },
  },
  
  // Development server configuration
  server: {
    port: 3000,
    strictPort: true,
    open: false,
    cors: true,
    hmr: {
      overlay: true,
    },
  },
    },
    
    // Hot module replacement
    hmr: {
      overlay: true,
    },
    
    // Watch options
    watch: {
      usePolling: false,
      interval: 1000,
    },
  },
  
  // Preview server (for production build testing)
  preview: {
    port: 5000,
    strictPort: false,
    open: false,
    cors: true,
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'zustand',
      'axios',
      'clsx',
      'tailwind-merge',
    ],
    exclude: ['qiankun'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  
  // Environment variables
  envPrefix: 'VITE_',
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __QIANKUN_VERSION__: JSON.stringify('3.0.0'),
  },
  
  // JSON handling
  json: {
    namedExports: true,
    stringify: false,
  },
  
  // Worker configuration
  worker: {
    format: 'es',
    plugins: [],
  },
  
  // Experimental features
  experimental: {
    // Enable CSS source maps in production
    cssSourcemaps: true,
  },
});
