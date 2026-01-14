import path from 'node:path';
import fse from 'fs-extra';
import type { ViteTemplate } from '../types';
import { isReactTemplate, isTypeScriptTemplate } from '../types';

export async function writeViteConfig(appRoot: string, template: ViteTemplate): Promise<void> {
  const ext = isTypeScriptTemplate(template) ? 'ts' : 'js';
  const configPath = path.join(appRoot, `vite.config.${ext}`);

  const content = isTypeScriptTemplate(template) ? getTypeScriptConfig(template) : getJavaScriptConfig(template);

  await fse.writeFile(configPath, content, 'utf-8');
}

function getTypeScriptConfig(template: ViteTemplate): string {
  const frameworkImport = isReactTemplate(template)
    ? "import react from '@vitejs/plugin-react';"
    : "import vue from '@vitejs/plugin-vue';";
  const pluginCall = isReactTemplate(template) ? 'react()' : 'vue()';

  return `import { defineConfig } from 'vite';
${frameworkImport}
import legacy from '@vitejs/plugin-legacy';
import qiankunHtmlPlugin from './config/qiankunHtml';

export default defineConfig(({ mode }) => {
  const isQiankun = mode === 'qiankun';

  return {
    base: isQiankun ? './' : '/',
    plugins: [
      ${pluginCall},
      isQiankun && legacy({ renderLegacyChunks: true }),
      isQiankun && qiankunHtmlPlugin(),
    ].filter(Boolean),
    server: {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  };
});
`;
}

function getJavaScriptConfig(template: ViteTemplate): string {
  const frameworkImport = isReactTemplate(template)
    ? "import react from '@vitejs/plugin-react';"
    : "import vue from '@vitejs/plugin-vue';";
  const pluginCall = isReactTemplate(template) ? 'react()' : 'vue()';

  return `import { defineConfig } from 'vite';
${frameworkImport}
import legacy from '@vitejs/plugin-legacy';
import qiankunHtmlPlugin from './config/qiankunHtml';

export default defineConfig(({ mode }) => {
  const isQiankun = mode === 'qiankun';

  return {
    base: isQiankun ? './' : '/',
    plugins: [
      ${pluginCall},
      isQiankun && legacy({ renderLegacyChunks: true }),
      isQiankun && qiankunHtmlPlugin(),
    ].filter(Boolean),
    server: {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  };
});
`;
}
