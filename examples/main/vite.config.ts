import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Inside the qiankun monorepo, alias to the local workspace source so the examples
// always demo the current code (including the ESM sandbox). When this example is
// copied out standalone, the alias is skipped and the npm package is used instead.
const localQiankun = path.resolve(__dirname, '../../packages/qiankun/src/index.ts')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      ...(fs.existsSync(localQiankun) ? { qiankun: localQiankun } : {}),
    },
  },
  server: {
    port: 7099,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
