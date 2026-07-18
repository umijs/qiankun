import { access, cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { assertComparableHarness } from './fingerprint.mjs';
import { hashDirectory } from './hash.mjs';

async function assertMissing(path) {
  try {
    await access(path);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return;
    throw error;
  }
  throw new Error(`baseline snapshot already exists: ${path}`);
}

export async function createBaselineSnapshot({ createdAt, git, harness, sourceDirectory, targetDirectory }) {
  assertComparableHarness(harness, harness);
  await assertMissing(targetDirectory);
  const stagingDirectory = `${targetDirectory}.tmp-${process.pid}`;
  await assertMissing(stagingDirectory);
  await mkdir(dirname(targetDirectory), { recursive: true });

  try {
    await mkdir(stagingDirectory);
    await cp(sourceDirectory, join(stagingDirectory, 'host'), { recursive: true });
    const bundleHash = await hashDirectory(join(stagingDirectory, 'host'));
    const metadata = { bundleHash, createdAt, git, harness, schemaVersion: 2 };
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
  if (metadata?.schemaVersion !== 2) {
    throw new Error('baseline snapshot metadata is incompatible; recreate the snapshot');
  }
  if (
    !metadata ||
    typeof metadata !== 'object' ||
    typeof metadata.bundleHash !== 'string' ||
    !/^[a-f\d]{64}$/u.test(metadata.bundleHash) ||
    typeof metadata.createdAt !== 'string' ||
    !metadata.git ||
    typeof metadata.git !== 'object' ||
    typeof metadata.git.commit !== 'string' ||
    typeof metadata.git.dirty !== 'boolean' ||
    !metadata.harness ||
    typeof metadata.harness !== 'object'
  ) {
    throw new Error('baseline snapshot metadata is invalid');
  }
  try {
    assertComparableHarness(metadata.harness, metadata.harness);
  } catch {
    throw new Error('baseline snapshot metadata is invalid');
  }
  return metadata;
}

export function assertBaselineHarnessCompatible(metadata, currentHarness) {
  assertComparableHarness(metadata.harness, currentHarness);
}

export async function readBaselineSnapshot(directory) {
  const metadata = validateMetadata(JSON.parse(await readFile(join(directory, 'metadata.json'), 'utf8')));
  const actualHash = await hashDirectory(join(directory, 'host'));
  if (actualHash !== metadata.bundleHash) {
    throw new Error(`baseline bundle hash mismatch: expected ${metadata.bundleHash}, received ${actualHash}`);
  }
  return metadata;
}
