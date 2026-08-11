import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { builtinModules, createRequire } from 'node:module';
import { extname, join, relative, resolve, sep } from 'node:path';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import { defineConfig } from 'vite';

interface PackageManifest {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface GlobalsPackage {
  browser: Record<string, boolean>;
  es2015: Record<string, boolean>;
}

const configRequire = createRequire(import.meta.url);
const browserTarget = ['chrome61', 'firefox60', 'safari11'];
const sourceExtensionRE = /\.(?:[cm]?ts|tsx)$/;
const declarationExtensionRE = /\.d\.(?:[cm]?ts|tsx)$/;
const testFileRE = /\.(?:spec|test)\.(?:[cm]?ts|tsx)$/;

function readManifest(packageRoot: string): PackageManifest {
  return JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')) as PackageManifest;
}

function writeFileIfChanged(filePath: string, content: string): void {
  let currentContent: string | undefined;

  try {
    currentContent = readFileSync(filePath, 'utf8');
  } catch {
    // The generated file may not exist in a fresh source archive.
  }

  if (currentContent !== content) {
    writeFileSync(filePath, content);
  }
}

function generatePackageSources(packageRoot: string, manifest: PackageManifest): void {
  if (manifest.name === '@qiankunjs/sandbox') {
    const globals = configRequire('globals') as GlobalsPackage;
    // globals >=14 reclassified Intl from browser to es2015, but qiankun needs it in the browser
    // list: it must stay routed through the membrane (esm-globals base set / rebind whitelist) and
    // out of the classic const preamble, where it would collide with `var Intl` polyfills.
    const es2015Names = Object.keys(globals.es2015).filter((name) => name !== 'Intl');
    const browserNames = Object.keys(globals.browser);
    if (!browserNames.includes('Intl')) {
      // the upstream list is sorted case-insensitively
      const insertAt = browserNames.findIndex((name) => name.toLowerCase() > 'intl');
      browserNames.splice(insertAt === -1 ? browserNames.length : insertAt, 0, 'Intl');
    }
    const globalsFile = `// generated from https://github.com/sindresorhus/globals/blob/main/globals.json es2015 part
// only init its values while Proxy is supported
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const globalsInES2015 = window.Proxy ? ${JSON.stringify(
      es2015Names,
      null,
      2,
    )}.filter(p => /* just keep the available properties in current window context */ p in window) : [];

export const globalsInBrowser = ${JSON.stringify(browserNames, null, 2)};
  `;

    writeFileIfChanged(join(packageRoot, 'src/core/globals.ts'), globalsFile);
  }
}

function isProductionSource(filePath: string): boolean {
  const normalizedPath = filePath.split(sep).join('/');

  return (
    sourceExtensionRE.test(filePath) &&
    !declarationExtensionRE.test(filePath) &&
    !testFileRE.test(filePath) &&
    !normalizedPath.includes('/__tests__/') &&
    !normalizedPath.includes('/__mocks__/')
  );
}

function getLodashParseLanguage(filePath: string): 'js' | 'ts' | 'tsx' {
  if (filePath.endsWith('.tsx')) {
    return 'tsx';
  }

  if (sourceExtensionRE.test(filePath)) {
    return 'ts';
  }

  return 'js';
}

function collectSourceEntries(sourceRoot: string): Record<string, string> {
  const files: string[] = [];

  function visit(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const entryPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        visit(entryPath);
      } else if (entry.isFile() && isProductionSource(entryPath)) {
        files.push(entryPath);
      }
    }
  }

  visit(sourceRoot);

  return Object.fromEntries(
    files.sort().map((filePath) => {
      const entryName = relative(sourceRoot, filePath).slice(0, -extname(filePath).length).split(sep).join('/');

      return [entryName, filePath];
    }),
  );
}

function createExternalMatcher(manifest: PackageManifest): (id: string) => boolean {
  const externalPackages = new Set([
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.optionalDependencies ?? {}),
    ...Object.keys(manifest.peerDependencies ?? {}),
  ]);
  const nodeBuiltins = new Set([...builtinModules, ...builtinModules.map((name) => `node:${name}`)]);

  return (id: string): boolean => {
    if (id.startsWith('node:') || nodeBuiltins.has(id)) {
      return true;
    }

    for (const packageName of externalPackages) {
      if (id === packageName || id.startsWith(`${packageName}/`)) {
        return true;
      }
    }

    return false;
  };
}

export default defineConfig(() => {
  const packageRoot = process.cwd();
  const manifest = readManifest(packageRoot);
  const sourceRoot = resolve(packageRoot, 'src');

  generatePackageSources(packageRoot, manifest);

  const entries = collectSourceEntries(sourceRoot);
  if (Object.keys(entries).length === 0) {
    throw new Error(`No production source entries found in ${sourceRoot}`);
  }

  if (manifest.name === '@qiankunjs/single-spa') {
    // The profile variant entry (and the profiler API it re-exports) is not built or published yet;
    // the sources stay vendored for a future opt-in profile build.
    delete entries['single-spa.profile'];
    delete entries['devtools/profiler-api'];
  }

  const commonOutput = {
    entryFileNames: '[name].js',
    preserveModules: true,
    preserveModulesRoot: sourceRoot,
  } as const;

  return {
    root: packageRoot,
    publicDir: false as const,
    define:
      manifest.name === 'qiankun'
        ? {
            __QIANKUN_VERSION__: JSON.stringify(manifest.version),
          }
        : manifest.name === '@qiankunjs/single-spa'
          ? {
              // Upstream single-spa relies on rollup-injected compile-time constants. __DEV__ stays a
              // NODE_ENV probe in the emitted code so the consumer's bundler can constant-fold it.
              __DEV__: '(process.env.NODE_ENV !== "production")',
              __PROFILE__: 'false',
              'process.env.BABEL_ENV': 'undefined',
            }
          : undefined,
    plugins: [
      optimizeLodashImports({
        parseOptions: (filePath) => ({
          lang: getLodashParseLanguage(filePath),
        }),
      }),
    ],
    build: {
      copyPublicDir: false,
      emptyOutDir: true,
      lib: {
        entry: entries,
      },
      minify: false,
      outDir: 'dist',
      reportCompressedSize: false,
      sourcemap: true,
      target: browserTarget,
      rolldownOptions: {
        external: createExternalMatcher(manifest),
        treeshake: false,
        output: [
          {
            ...commonOutput,
            dir: 'dist/esm',
            format: 'es' as const,
          },
          {
            ...commonOutput,
            dir: 'dist/cjs',
            exports: 'named' as const,
            format: 'cjs' as const,
          },
        ],
      },
    },
  };
});
