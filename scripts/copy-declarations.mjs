import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

const packageRoot = process.cwd();
const declarationSource = resolve(packageRoot, process.argv[2] ?? 'dist/esm');
const declarationTargets = (process.argv.length > 3 ? process.argv.slice(3) : ['dist/cjs']).map((target) =>
  resolve(packageRoot, target),
);
const declarationFileRE = /\.d\.(?:[cm]?ts)(?:\.map)?$/;

async function collectDeclarations(rootDirectory) {
  const declarations = [];

  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const entryPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== '__tests__' && entry.name !== '__mocks__') {
          await visit(entryPath);
        }
      } else if (entry.isFile() && declarationFileRE.test(entry.name)) {
        declarations.push(entryPath);
      }
    }
  }

  await visit(rootDirectory);
  return declarations;
}

async function copyDeclarations(sourceRoot, targetRoots) {
  const declarations = await collectDeclarations(sourceRoot);

  await Promise.all(
    targetRoots.flatMap((targetRoot) =>
      declarations.map(async (sourceFile) => {
        const targetFile = join(targetRoot, relative(sourceRoot, sourceFile));
        await mkdir(dirname(targetFile), { recursive: true });
        await copyFile(sourceFile, targetFile);
      }),
    ),
  );

  // an empty sweep from a dist directory means tsc emitted nothing there — surface it in build logs
  const sourceLabel = relative(packageRoot, sourceRoot) || '.';
  const targetLabel = targetRoots.map((targetRoot) => relative(packageRoot, targetRoot)).join(', ');
  console.log(`[copy-declarations] ${declarations.length} declaration file(s): ${sourceLabel} -> ${targetLabel}`);
}

await copyDeclarations(declarationSource, declarationTargets);
