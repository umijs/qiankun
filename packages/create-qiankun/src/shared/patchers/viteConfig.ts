import path from 'node:path';
import fse from 'fs-extra';
import type { ViteTemplate } from '../types';
import { isReactTemplate, isTypeScriptTemplate } from '../types';

export async function writeViteConfig(appRoot: string, template: ViteTemplate): Promise<void> {
  const ext = isTypeScriptTemplate(template) ? 'ts' : 'js';
  const configPath = path.join(appRoot, `vite.config.${ext}`);

  const frameworkImport = isReactTemplate(template)
    ? "import react from '@vitejs/plugin-react';"
    : "import vue from '@vitejs/plugin-vue';";
  const pluginCall = isReactTemplate(template) ? 'react()' : 'vue()';

  const content = `import { defineConfig } from 'vite';
${frameworkImport}
import { qiankun } from '@qiankunjs/bundler-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [${pluginCall}, qiankun()],
  server: {
    // matches the sub-app entry preconfigured in a create-qiankun main app,
    // adjust it per app when you scaffold multiple sub apps
    port: 7101,
  },
});
`;

  await fse.writeFile(configPath, content, 'utf-8');
}
