import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import libraryConfig from '../../vite.library.config';

const copyDeclarationsScript = fileURLToPath(new URL('../../scripts/copy-declarations.mjs', import.meta.url));

function finalizePackage(packageRoot: string): void {
  const commandOptions = { cwd: packageRoot, stdio: 'inherit' } as const;
  execFileSync('tsc', ['-p', 'tsconfig.build.json'], commandOptions);
  execFileSync(process.execPath, [copyDeclarationsScript, 'src', 'dist/esm'], commandOptions);
  execFileSync(process.execPath, [copyDeclarationsScript, 'dist/esm', 'dist/cjs'], commandOptions);

  const esmDirectory = join(packageRoot, 'dist/esm');
  const cjsDirectory = join(packageRoot, 'dist/cjs');
  writeFileSync(join(esmDirectory, 'package.json'), `${JSON.stringify({ type: 'module' }, null, 2)}\n`);
  writeFileSync(join(cjsDirectory, 'package.json'), `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`);

  // Node16/NodeNext require explicit extensions in the ESM declaration scope. Keep the CJS
  // declarations as emitted, and normalize ESM references only after copying ambient declarations.
  const declarationFiles = readdirSync(esmDirectory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.d.ts'))
    .map((entry) => join(entry.parentPath, entry.name));

  for (const file of declarationFiles) {
    const source = readFileSync(file, 'utf8');
    const rewritten = source.replace(
      /(from\s+|import\s*\(\s*|import\s+)(['"])(\.\.?\/[^'"]+)\2/g,
      (match: string, prefix: string, quote: string, specifier: string) => {
        if (/\.[cm]?js$/.test(specifier)) return match;
        const base = resolve(dirname(file), specifier);
        if (existsSync(`${base}.d.ts`)) return `${prefix}${quote}${specifier}.js${quote}`;
        if (existsSync(join(base, 'index.d.ts'))) return `${prefix}${quote}${specifier}/index.js${quote}`;
        return match;
      },
    );
    if (rewritten !== source) writeFileSync(file, rewritten);
  }
}

export default defineConfig((environment) => {
  const config = libraryConfig(environment);
  const packageRoot = process.cwd();
  let finalized = false;
  let buildFailed = false;
  const declarationPlugin: Plugin = {
    name: 'qiankun-package-declarations',
    apply: 'build',
    buildStart() {
      finalized = false;
      buildFailed = false;
    },
    buildEnd(error) {
      if (error) buildFailed = true;
    },
    renderError() {
      buildFailed = true;
    },
    closeBundle() {
      // closeBundle runs after both output formats are written. Guard repeated cleanup calls so
      // declarations are generated and normalized once for the completed library build.
      if (buildFailed || finalized) return;
      finalized = true;
      finalizePackage(packageRoot);
    },
  };

  return {
    ...config,
    plugins: [...(config.plugins ?? []), declarationPlugin],
  };
});
