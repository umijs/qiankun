import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { discoverPackages } from './commit-utils.mjs';
import { sanitizePreStateFile } from './sanitize-pre-state.mjs';

const PUBLISHABLE_PACKAGES = discoverPackages().map(({ name }) => name);

async function temporaryPreState(t, preState) {
  const directory = await mkdtemp(join(tmpdir(), 'qiankun-pre-state-'));
  const filePath = join(directory, 'pre.json');
  t.after(() => rm(directory, { recursive: true, force: true }));
  if (preState) await writeFile(filePath, `${JSON.stringify(preState, null, 2)}\n`);
  return filePath;
}

test('removes non-publishable workspace packages from initialVersions', async (t) => {
  const preState = {
    mode: 'pre',
    tag: 'rc',
    initialVersions: {
      '@qiankunjs/loader': '0.0.1',
      qiankun: '3.0.0',
      '@qiankunjs/benchmark': '0.0.0',
      '@qiankunjs/e2e': '0.0.0',
      'qiankun-example-main': '0.0.0',
      purehtml: '0.0.0',
      'react-micro-app': '0.0.0',
      'vue-micro-app': '0.0.0',
      'webpack-app': '0.0.0',
    },
    changesets: ['auto-dc274f8'],
  };
  const filePath = await temporaryPreState(t, preState);

  const result = sanitizePreStateFile(filePath, PUBLISHABLE_PACKAGES);
  const sanitized = JSON.parse(await readFile(filePath, 'utf8'));

  assert.deepEqual(result, {
    changed: true,
    removed: [
      '@qiankunjs/benchmark',
      '@qiankunjs/e2e',
      'qiankun-example-main',
      'purehtml',
      'react-micro-app',
      'vue-micro-app',
      'webpack-app',
    ],
  });
  assert.deepEqual(sanitized, {
    mode: 'pre',
    tag: 'rc',
    initialVersions: {
      '@qiankunjs/loader': '0.0.1',
      qiankun: '3.0.0',
    },
    changesets: ['auto-dc274f8'],
  });
});

test('does nothing when the pre-state file does not exist', async (t) => {
  const filePath = await temporaryPreState(t);

  assert.deepEqual(sanitizePreStateFile(filePath, PUBLISHABLE_PACKAGES), {
    changed: false,
    removed: [],
  });
  await assert.rejects(access(filePath), { code: 'ENOENT' });
});

test('is idempotent after non-publishable packages are removed', async (t) => {
  const filePath = await temporaryPreState(t, {
    mode: 'pre',
    tag: 'rc',
    initialVersions: {
      '@qiankunjs/loader': '0.0.1',
      '@qiankunjs/benchmark': '0.0.0',
    },
    changesets: [],
  });

  sanitizePreStateFile(filePath, PUBLISHABLE_PACKAGES);
  const once = await readFile(filePath, 'utf8');
  const secondResult = sanitizePreStateFile(filePath, PUBLISHABLE_PACKAGES);

  assert.deepEqual(secondResult, { changed: false, removed: [] });
  assert.equal(await readFile(filePath, 'utf8'), once);
});
