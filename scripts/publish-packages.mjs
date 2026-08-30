import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PRE_STATE_PATH = resolve(ROOT_DIR, '.changeset/pre.json');

export function getPublishArgs(preState) {
  const args = ['publish'];

  if (preState?.mode !== 'pre') return args;

  if (typeof preState.tag !== 'string' || preState.tag.trim() === '') {
    throw new Error('Prerelease mode requires a non-empty tag in .changeset/pre.json');
  }

  return [...args, '--tag', preState.tag];
}

export function readPreState(filePath = PRE_STATE_PATH) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return undefined;
    throw error;
  }
}

function publishPackages() {
  const changesetBin = fileURLToPath(import.meta.resolve('@changesets/cli/bin.js'));
  const result = spawnSync(process.execPath, [changesetBin, ...getPublishArgs(readPreState())], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.signal) throw new Error(`Changesets publish terminated by ${result.signal}`);

  return result.status ?? 1;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  process.exitCode = publishPackages();
}
