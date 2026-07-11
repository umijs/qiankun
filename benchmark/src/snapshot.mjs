import { createHash } from 'node:crypto';
import { access, cp, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

async function listFiles(directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

async function hashDirectory(directory) {
  const hash = createHash('sha256');
  for (const file of await listFiles(directory)) {
    hash.update(relative(directory, file));
    hash.update('\0');
    hash.update(await readFile(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

async function assertMissing(path) {
  try {
    await access(path);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return;
    throw error;
  }
  throw new Error(`baseline snapshot already exists: ${path}`);
}

export async function createBaselineSnapshot({ createdAt, git, sourceDirectory, targetDirectory }) {
  await assertMissing(targetDirectory);
  const stagingDirectory = `${targetDirectory}.tmp-${process.pid}`;
  await assertMissing(stagingDirectory);
  await mkdir(dirname(targetDirectory), { recursive: true });

  try {
    await mkdir(stagingDirectory);
    await cp(sourceDirectory, join(stagingDirectory, 'host'), { recursive: true });
    const bundleHash = await hashDirectory(join(stagingDirectory, 'host'));
    const metadata = { bundleHash, createdAt, git, schemaVersion: 1 };
    await writeFile(join(stagingDirectory, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);
    await rename(stagingDirectory, targetDirectory);
    return metadata;
  } catch (error) {
    await rm(stagingDirectory, { force: true, recursive: true });
    throw error;
  }
}

export function assertCleanBaselineGitState(git) {
  if (git.dirty) throw new Error('baseline snapshot requires a clean git worktree');
}

function validateMetadata(metadata) {
  if (
    !metadata ||
    typeof metadata !== 'object' ||
    metadata.schemaVersion !== 1 ||
    typeof metadata.bundleHash !== 'string' ||
    !/^[a-f\d]{64}$/u.test(metadata.bundleHash) ||
    typeof metadata.createdAt !== 'string' ||
    !metadata.git ||
    typeof metadata.git !== 'object' ||
    typeof metadata.git.commit !== 'string' ||
    typeof metadata.git.dirty !== 'boolean'
  ) {
    throw new Error('baseline snapshot metadata is invalid');
  }
  return metadata;
}

export async function readBaselineSnapshot(directory) {
  const metadata = validateMetadata(JSON.parse(await readFile(join(directory, 'metadata.json'), 'utf8')));
  const actualHash = await hashDirectory(join(directory, 'host'));
  if (actualHash !== metadata.bundleHash) {
    throw new Error(`baseline bundle hash mismatch: expected ${metadata.bundleHash}, received ${actualHash}`);
  }
  return metadata;
}
