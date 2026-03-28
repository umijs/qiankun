import path from 'node:path';
import fse from 'fs-extra';
import type { ViteTemplate } from '../types';
import { isReactTemplate, isTypeScriptTemplate } from '../types';

export async function writeViteConfig(appRoot: string, template: ViteTemplate): Promise<void> {
  const ext = isTypeScriptTemplate(template) ? 'ts' : 'js';
  const configPath = path.join(appRoot, `vite.config.${ext}`);

  const content = getViteConfig(template);

  await fse.writeFile(configPath, content, 'utf-8');
}

function getViteConfig(template: ViteTemplate): string {
  const isTs = isTypeScriptTemplate(template);
  const isReact = isReactTemplate(template);

  const frameworkImport = isReact
    ? "import react from '@vitejs/plugin-react';"
    : "import vue from '@vitejs/plugin-vue';";
  const pluginCall = isReact ? 'react()' : 'vue()';
  const rootId = isReact ? 'root' : 'app';

  const defineConfigImport = isTs
    ? "import { defineConfig, type PluginOption } from 'vite';"
    : "import { defineConfig } from 'vite';";
  const pluginReturnType = isTs ? ': PluginOption' : '';

  const entryExt = isReact ? (isTs ? 'tsx' : 'jsx') : isTs ? 'ts' : 'js';

  return `import path from 'node:path';
${defineConfigImport}
${frameworkImport}

function qiankunEntryHtmlPlugin()${pluginReturnType} {
  return {
    name: 'qiankun-entry-html',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const entryChunk = Object.values(bundle).find((item) => item.type === 'chunk' && item.isEntry);

      if (!entryChunk || entryChunk.type !== 'chunk') {
        throw new Error('No qiankun entry chunk generated');
      }

      const cssAssets = Object.values(bundle).filter(
        (item) => item.type === 'asset' && item.fileName.endsWith('.css'),
      );

      const styleTags = cssAssets
        .map((asset) => '<link rel="stylesheet" href="./' + asset.fileName + '">')
        .join('\\n    ');

      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        name: 'index.html',
        source:
          '<!DOCTYPE html>\\n' +
          '<html lang="en">\\n' +
          '  <head>\\n' +
          '    <meta charset="UTF-8" />\\n' +
          '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\\n' +
          (styleTags ? '    ' + styleTags + '\\n' : '') +
          '  </head>\\n' +
          '  <body>\\n' +
          '    <div id="${rootId}"></div>\\n' +
          '    <script src="./' + entryChunk.fileName + '" entry></script>\\n' +
          '  </body>\\n' +
          '</html>',
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const isQiankun = mode === 'qiankun';

  return {
    base: isQiankun ? './' : '/',
    plugins: [${pluginCall}, isQiankun && qiankunEntryHtmlPlugin()].filter(Boolean),
    define: isQiankun
      ? {
          'process.env.NODE_ENV': JSON.stringify('production'),
        }
      : undefined,
    build: isQiankun
      ? {
          cssCodeSplit: false,
          lib: {
            entry: path.resolve(__dirname, 'src/main.${entryExt}'),
            formats: ['iife'],
            name: 'SubAppBundle',
            fileName: () => 'sub-app',
          },
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
              entryFileNames: 'assets/[name]-[hash].js',
              assetFileNames: 'assets/[name]-[hash][extname]',
            },
          },
        }
      : undefined,
    server: {
      port: 7100,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  };
});
`;
}
