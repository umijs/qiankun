import { writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function writeMainViteConfig(appRoot: string): Promise<void> {
  const configPath = path.join(appRoot, 'vite.config.ts');

  const content = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7099,
  },
});
`;

  await writeFile(configPath, content, 'utf8');
}
