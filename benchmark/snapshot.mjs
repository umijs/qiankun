import { execFile } from 'node:child_process';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { assertCleanBaselineGitState, createBaselineSnapshot } from './src/snapshot.mjs';

const execFileAsync = promisify(execFile);
const benchmarkRoot = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(benchmarkRoot);

function parseName(args) {
  if (args.length !== 1) throw new Error('usage: node snapshot.mjs --name=<snapshot-name>');
  const match = /^--name=([\w.-]+)$/u.exec(args[0]);
  if (!match) throw new Error('snapshot name may only contain letters, numbers, dots, underscores, and dashes');
  return match[1];
}

async function getGitState() {
  const [commitResult, statusResult] = await Promise.all([
    execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot }),
    execFileAsync('git', ['status', '--porcelain'], { cwd: repositoryRoot }),
  ]);
  return { commit: commitResult.stdout.trim(), dirty: statusResult.stdout.trim().length > 0 };
}

const name = parseName(process.argv.slice(2));
const targetDirectory = join(benchmarkRoot, 'artifacts', name);
const git = await getGitState();
assertCleanBaselineGitState(git);
const metadata = await createBaselineSnapshot({
  createdAt: new Date().toISOString(),
  git,
  sourceDirectory: join(benchmarkRoot, 'fixtures/host/dist'),
  targetDirectory,
});

console.log(`[benchmark] snapshot: ${targetDirectory}`);
console.log(`[benchmark] bundle: ${metadata.bundleHash}`);
