#!/usr/bin/env node

/**
 * Remove non-publishable workspace packages that Changesets adds to a
 * prerelease state's initialVersions map.
 *
 * Changesets records every workspace package before it filters private
 * packages from the release plan. Keeping only the packages this repository
 * can publish prevents private examples and tooling from polluting pre.json.
 */

import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

import { ROOT, discoverPackages } from './commit-utils.mjs';

const PRE_STATE_PATH = join(ROOT, '.changeset/pre.json');

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function sanitizePreStateFile(filePath, publishablePackageNames) {
  if (!existsSync(filePath)) return { changed: false, removed: [] };

  const preState = JSON.parse(readFileSync(filePath, 'utf8'));
  if (!isRecord(preState) || !isRecord(preState.initialVersions)) {
    throw new TypeError(`Invalid Changesets pre-state at ${filePath}`);
  }

  const publishable = new Set(publishablePackageNames);
  const keptInitialVersions = {};
  const removed = [];

  for (const [packageName, initialVersion] of Object.entries(preState.initialVersions)) {
    if (publishable.has(packageName)) keptInitialVersions[packageName] = initialVersion;
    else removed.push(packageName);
  }

  if (removed.length === 0) return { changed: false, removed };

  preState.initialVersions = keptInitialVersions;
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    writeFileSync(temporaryPath, `${JSON.stringify(preState, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx',
    });
    renameSync(temporaryPath, filePath);
  } finally {
    rmSync(temporaryPath, { force: true });
  }

  return { changed: true, removed };
}

function main() {
  const publishablePackageNames = discoverPackages().map(({ name }) => name);
  const { removed } = sanitizePreStateFile(PRE_STATE_PATH, publishablePackageNames);
  if (removed.length > 0) {
    console.error(`Removed non-publishable packages from pre.json: ${removed.join(', ')}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
