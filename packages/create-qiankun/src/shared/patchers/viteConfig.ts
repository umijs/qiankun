import path from 'node:path';
import fse from 'fs-extra';
import type { ViteTemplate } from '../types';
import { isReactTemplate, isTypeScriptTemplate } from '../types';

export async function writeViteConfig(appRoot: string, appName: string, template: ViteTemplate): Promise<void> {
  const ext = isTypeScriptTemplate(template) ? 'ts' : 'js';
  const configPath = path.join(appRoot, `vite.config.${ext}`);

  const content = getViteConfig(appName, template);

  await fse.writeFile(configPath, content, 'utf-8');
}

function getViteConfig(appName: string, template: ViteTemplate): string {
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
  const appNameLiteral = JSON.stringify(appName);

  return `import path from 'node:path';
import ts from 'typescript';
${defineConfigImport}
${frameworkImport}

const qiankunDevHtmlPath = '/__qiankun_dev__.html';
const qiankunDevScriptPath = '/__qiankun_dev__.js';
const qiankunDevModulePath = '/__qiankun_dev_module__';

const normalizePathname = (url) => new URL(url, 'http://localhost').pathname;
const normalizeRequestId = (requestUrl) => {
  const url = new URL(requestUrl);
  const requestId = \`\${url.pathname}\${url.search}\`;
  if (requestId.startsWith('/@id/__x00__')) {
    return \`\\0\${requestId.slice('/@id/__x00__'.length)}\`;
  }
  return requestId;
};
const isStyleRequest = (requestId) => /\\.css(?:$|\\?)/.test(requestId);
const stripReactRefreshArtifacts = (code) =>
  code
    .replace(
      /import\\s+\\{\\s*createHotContext\\s+as\\s+__vite__createHotContext\\s*\\}\\s+from\\s+["'][^"']*\\/@@?vite\\/client["'];?\\s*import\\.meta\\.hot\\s*=\\s*__vite__createHotContext\\([^)]*\\);?/g,
      '',
    )
    .replace(/var\\s+_s\\s*=\\s*\\$RefreshSig\\$\\(\\);\\s*/g, '')
    .replace(/\\n\\s*_s\\(\\);/g, '')
    .replace(/\\n\\s*_s\\([^\\n]*\\);/g, '')
    .replace(/\\n\\s*_c\\s*=\\s*[^;]+;/g, '')
    .replace(/\\n\\s*var\\s+_c;\\s*/g, '\\n')
    .replace(/\\n\\s*\\$RefreshReg\\$\\([^\\n]*\\);/g, '')
    .replace(/\\n\\s*import\\s+\\*\\s+as\\s+RefreshRuntime\\s+from\\s+["'][^"']*["'];?/g, '')
    .replace(/\\n\\s*const\\s+inWebWorker\\s*=\\s*[^;]+;?/g, '')
    .replace(/\\n\\s*import\\s+\\*\\s+as\\s+__vite_react_currentExports\\s+from\\s+["'][^"']*["'];?/g, '')
    .replace(/\\n\\s*if\\s*\\(import\\.meta\\.hot\\s*&&\\s*!inWebWorker\\)\\s*\\{[\\s\\S]*?\\n\\}/g, '')
    .replace(/\\n\\s*function\\s+\\$RefreshReg\\$\\([\\s\\S]*?\\n\\}/g, '')
    .replace(/\\n\\s*function\\s+\\$RefreshSig\\$\\([\\s\\S]*?\\n\\}/g, '');

const printNode = (node, sourceFile) => ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }).printNode(ts.EmitHint.Unspecified, node, sourceFile);

const collectBindingNames = (name) => {
  if (ts.isIdentifier(name)) {
    return [name.text];
  }

  return name.elements.flatMap((element) => {
    if (!ts.isBindingElement(element)) {
      return [];
    }
    return collectBindingNames(element.name);
  });
};

const rewriteModuleSyntax = (sourceFile) => {
  const transformer = (context) => {
    const visitor = (node) => {
      if (ts.isMetaProperty(node) && node.keywordToken === ts.SyntaxKind.ImportKeyword && node.name.text === 'meta') {
        return ts.factory.createIdentifier('__qiankun_import_meta__');
      }

      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0]) {
        return ts.factory.createCallExpression(ts.factory.createIdentifier('__qiankun_import__'), undefined, [
          ts.visitNode(node.arguments[0], visitor),
        ]);
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return (node) => ts.visitNode(node, visitor);
  };

  return ts.transform(sourceFile, [transformer]).transformed[0];
};

function transformViteDevModule(code, moduleId) {
  const sourceFile = rewriteModuleSyntax(ts.createSourceFile(moduleId, code, ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS));
  const statements = [];
  const exportAssignments = [];
  let importCounter = 0;

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      const specifierNode = statement.moduleSpecifier;
      if (!ts.isStringLiteralLike(specifierNode)) {
        continue;
      }
      const specifier = specifierNode.getText(sourceFile);
      const importClause = statement.importClause;

      if (!importClause) {
        if (isStyleRequest(specifierNode.text)) {
          statements.push(\`await __qiankun_load_css__(\${specifier});\`);
        } else {
          statements.push(\`await __qiankun_import__(\${specifier});\`);
        }
        continue;
      }

      const tempName = \`__qiankun_import_\${String(importCounter++)}\`;
      statements.push(\`const \${tempName} = await __qiankun_import__(\${specifier});\`);

      if (importClause.name) {
        statements.push(\`const \${importClause.name.text} = \${tempName}.default;\`);
      }

      if (importClause.namedBindings) {
        if (ts.isNamespaceImport(importClause.namedBindings)) {
          statements.push(\`const \${importClause.namedBindings.name.text} = \${tempName};\`);
        } else {
          const bindings = importClause.namedBindings.elements
            .map((element) => {
              const propertyName = element.propertyName?.text ?? element.name.text;
              return propertyName === element.name.text ? propertyName : \`\${propertyName}: \${element.name.text}\`;
            })
            .join(', ');
          statements.push(\`const { \${bindings} } = \${tempName};\`);
        }
      }
      continue;
    }

    if (ts.isExportDeclaration(statement)) {
      const exportClause = statement.exportClause;
      const specifierNode = statement.moduleSpecifier;
      const moduleSpecifier = specifierNode && ts.isStringLiteralLike(specifierNode) ? specifierNode.getText(sourceFile) : undefined;

      if (moduleSpecifier) {
        const tempName = \`__qiankun_export_\${String(importCounter++)}\`;
        statements.push(\`const \${tempName} = await __qiankun_import__(\${moduleSpecifier});\`);

        if (!exportClause) {
          exportAssignments.push(\`Object.assign(__qiankun_exports__, \${tempName});\`);
        } else if (ts.isNamedExports(exportClause)) {
          for (const element of exportClause.elements) {
            const exportedName = element.name.text;
            const localName = element.propertyName?.text ?? exportedName;
            exportAssignments.push(\`__qiankun_exports__.\${exportedName} = \${tempName}.\${localName};\`);
          }
        } else if (ts.isNamespaceExport(exportClause)) {
          exportAssignments.push(\`__qiankun_exports__.\${exportClause.name.text} = \${tempName};\`);
        }
      } else if (exportClause && ts.isNamedExports(exportClause)) {
        for (const element of exportClause.elements) {
          const exportedName = element.name.text;
          const localName = element.propertyName?.text ?? exportedName;
          exportAssignments.push(\`__qiankun_exports__.\${exportedName} = \${localName};\`);
        }
      }
      continue;
    }

    if (ts.isExportAssignment(statement)) {
      exportAssignments.push(\`__qiankun_exports__.default = \${printNode(statement.expression, sourceFile)};\`);
      continue;
    }

    if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      const filteredModifiers = statement.modifiers.filter((modifier) => modifier.kind !== ts.SyntaxKind.ExportKeyword && modifier.kind !== ts.SyntaxKind.DefaultKeyword);
      const updated = ts.isFunctionDeclaration(statement)
        ? ts.factory.updateFunctionDeclaration(statement, filteredModifiers, statement.asteriskToken, statement.name, statement.typeParameters, statement.parameters, statement.type, statement.body)
        : ts.factory.updateClassDeclaration(statement, filteredModifiers, statement.name, statement.typeParameters, statement.heritageClauses, statement.members);
      statements.push(printNode(updated, sourceFile));

      if (statement.name) {
        if (statement.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)) {
          exportAssignments.push(\`__qiankun_exports__.default = \${statement.name.text};\`);
        }
        exportAssignments.push(\`__qiankun_exports__.\${statement.name.text} = \${statement.name.text};\`);
      }
      continue;
    }

    if (ts.isVariableStatement(statement) && statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      const filteredModifiers = statement.modifiers.filter((modifier) => modifier.kind !== ts.SyntaxKind.ExportKeyword);
      const updated = ts.factory.updateVariableStatement(statement, filteredModifiers, statement.declarationList);
      statements.push(printNode(updated, sourceFile));

      for (const declaration of statement.declarationList.declarations) {
        for (const name of collectBindingNames(declaration.name)) {
          exportAssignments.push(\`__qiankun_exports__.\${name} = \${name};\`);
        }
      }
      continue;
    }

    statements.push(printNode(statement, sourceFile));
  }

  return [...statements, ...exportAssignments].join('\\n');
}

async function getTransformedModuleCode(server, requestUrl) {
  const requestId = normalizeRequestId(requestUrl);
  const transformed = await server.transformRequest(requestId);

  if (!transformed?.code) {
    throw new Error(\`Failed to transform dev module: \${requestId}\`);
  }

  return transformViteDevModule(stripReactRefreshArtifacts(transformed.code), requestId);
}

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

function qiankunDevEntryPlugin()${pluginReturnType} {
  const html = '<!DOCTYPE html>\\n' +
    '<html lang="en">\\n' +
    '  <head>\\n' +
    '    <meta charset="UTF-8" />\\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\\n' +
    '    <title>Qiankun Dev Entry</title>\\n' +
    '  </head>\\n' +
    '  <body>\\n' +
    '    <div id="${rootId}"></div>\\n' +
    '    <script src="' + qiankunDevScriptPath + '" entry></script>\\n' +
    '  </body>\\n' +
    '</html>';
  const script = \`;(function () {
  const scriptUrl = document.currentScript?.src ?? window.location.href;
  const moduleCache = new Map();
  const styleCache = new Map();
  const devModulePath = new URL(${JSON.stringify('/__qiankun_dev_module__')}, scriptUrl).href;
  const createImportMeta = (moduleUrl) => ({
    url: moduleUrl,
    env: { DEV: true, PROD: false, MODE: 'development', BASE_URL: '/' },
    hot: {
      accept() {},
      dispose() {},
      prune() {},
      invalidate(message) { if (message) console.warn(message); },
      on() {},
      off() {},
      send() {},
    },
  });
  const resolveUrl = (specifier, importerUrl) => new URL(specifier, importerUrl).href;
  const loadStyle = async (specifier, importerUrl) => {
    const styleUrl = resolveUrl(specifier, importerUrl);
    if (!styleCache.has(styleUrl)) {
      styleCache.set(styleUrl, new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleUrl;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error('Failed to load style ' + styleUrl));
        document.head.appendChild(link);
      }));
    }
    return styleCache.get(styleUrl);
  };
  const importModule = async (specifier, importerUrl = scriptUrl) => {
    const moduleUrl = resolveUrl(specifier, importerUrl);
    if (!moduleCache.has(moduleUrl)) {
      moduleCache.set(moduleUrl, (async () => {
        const response = await fetch(devModulePath + '?url=' + encodeURIComponent(moduleUrl));
        if (!response.ok) {
          throw new Error('Failed to load dev module ' + moduleUrl);
        }
        const code = await response.text();
        const module = { exports: {} };
        const factory = eval('(async function(__qiankun_module__, __qiankun_exports__, __qiankun_import__, __qiankun_import_meta__, __qiankun_load_css__){' + code + '\\\\n})');
        await factory(
          module,
          module.exports,
          (nextSpecifier) => importModule(nextSpecifier, moduleUrl),
          createImportMeta(moduleUrl),
          (nextSpecifier) => loadStyle(nextSpecifier, moduleUrl),
        );
        return module.exports;
      })());
    }
    return moduleCache.get(moduleUrl);
  };
  const loadAppModule = () => importModule(${JSON.stringify(`/${`src/main.${entryExt}`}`)});

  globalThis[${appNameLiteral}] = {
    bootstrap: (...args) => loadAppModule().then((mod) => mod.bootstrap(...args)),
    mount: (...args) => loadAppModule().then((mod) => mod.mount(...args)),
    unmount: (...args) => loadAppModule().then((mod) => mod.unmount(...args)),
  };
})();\`;

  return {
    name: 'qiankun-dev-entry',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url ? normalizePathname(req.url) : undefined;

        if (pathname === qiankunDevHtmlPath) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
          return;
        }

        if (pathname === qiankunDevScriptPath) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          res.end(script);
          return;
        }

        if (pathname === qiankunDevModulePath) {
          const requestUrl = req.url ? new URL(req.url, 'http://localhost').searchParams.get('url') : undefined;
          if (!requestUrl) {
            res.statusCode = 400;
            res.end('Missing url parameter');
            return;
          }

          void getTransformedModuleCode(server, requestUrl)
            .then((code) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
              res.end(code);
            })
            .catch((error) => {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
              res.end(\`throw new Error(\${JSON.stringify(error instanceof Error ? error.message : String(error))});\`);
            });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const isQiankun = mode === 'qiankun';

  return {
    base: isQiankun ? './' : '/',
    plugins: [${pluginCall}, qiankunDevEntryPlugin(), isQiankun && qiankunEntryHtmlPlugin()].filter(Boolean),
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
