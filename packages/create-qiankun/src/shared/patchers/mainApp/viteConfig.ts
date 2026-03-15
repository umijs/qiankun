import path from 'node:path';
import fse from 'fs-extra';

export async function writeMainViteConfig(appRoot: string): Promise<void> {
  const configPath = path.join(appRoot, 'vite.config.ts');

  const content = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7099,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
`;

  await fse.writeFile(configPath, content, 'utf-8');
}
