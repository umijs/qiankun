import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join, relative } from 'node:path';

const workspaceRoot = process.cwd();
const packagesRoot = join(workspaceRoot, 'packages');
const outputFormats = ['esm', 'cjs'];
const lodashSpecifierPattern = /(?:\bfrom\s*|\bimport\s*(?:\(\s*|\s+)|\brequire\s*\(\s*)(['"])(lodash(?:\/[^'"]+)?)\1/g;

async function readManifest(packageRoot) {
  try {
    return JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return undefined;
    }

    throw error;
  }
}

async function collectPackageRoots(directory) {
  const packageRoots = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const entryPath = join(directory, entry.name);
    const manifest = await readManifest(entryPath);

    if (manifest) {
      if (manifest.dependencies?.lodash) {
        packageRoots.push(entryPath);
      }
    } else {
      packageRoots.push(...(await collectPackageRoots(entryPath)));
    }
  }

  return packageRoots;
}

async function collectJavaScriptFiles(directory) {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectJavaScriptFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(entryPath);
    }
  }

  return files;
}

const errors = [];
const packageRoots = await collectPackageRoots(packagesRoot);
let optimizedImportCount = 0;

for (const packageRoot of packageRoots) {
  const packageRequire = createRequire(join(packageRoot, 'package.json'));
  const presentFormats = outputFormats.filter((format) => existsSync(join(packageRoot, 'dist', format)));

  if (presentFormats.length === 0) {
    errors.push(
      `${relative(workspaceRoot, packageRoot)} has no dist output — build the package before checking lodash imports`,
    );
    continue;
  }

  for (const format of presentFormats) {
    const outputRoot = join(packageRoot, 'dist', format);
    let formatImportCount = 0;

    for (const filePath of await collectJavaScriptFiles(outputRoot)) {
      const content = await readFile(filePath, 'utf8');

      for (const match of content.matchAll(lodashSpecifierPattern)) {
        const specifier = match[2];
        const displayPath = relative(workspaceRoot, filePath);

        if (specifier === 'lodash') {
          errors.push(`${displayPath} contains an unoptimized lodash root import`);
          continue;
        }

        formatImportCount += 1;
        optimizedImportCount += 1;

        if (!specifier.endsWith('.js')) {
          errors.push(`${displayPath} imports ${specifier} without the required .js extension`);
          continue;
        }

        try {
          packageRequire.resolve(specifier);
        } catch {
          errors.push(`${displayPath} imports unresolvable module ${specifier}`);
        }
      }
    }

    if (formatImportCount === 0) {
      errors.push(
        `${relative(workspaceRoot, outputRoot)} emits no lodash imports although the package declares a lodash dependency — remove the dependency or fix the build`,
      );
    }
  }
}

if (errors.length > 0) {
  throw new Error(`Invalid lodash imports in package artifacts:\n${errors.map((error) => `- ${error}`).join('\n')}`);
}

console.log(`Verified ${optimizedImportCount} optimized lodash imports across ${packageRoots.length} packages.`);
