import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { hashViteEntries } from '../src/hash.mjs';

test('hashViteEntries follows only the selected entry graph', async () => {
  const root = await mkdtemp(join(tmpdir(), 'qiankun-benchmark-hash-'));
  try {
    await Promise.all([mkdir(join(root, '.vite')), mkdir(join(root, 'assets'))]);
    await Promise.all([
      writeFile(join(root, 'core.html'), '<main>core</main>'),
      writeFile(join(root, 'ecosystem.html'), '<main>ecosystem</main>'),
      writeFile(join(root, 'assets/core.js'), 'import "./shared.js";'),
      writeFile(join(root, 'assets/ecosystem.js'), 'console.log("ecosystem");'),
      writeFile(join(root, 'assets/shared.js'), 'console.log("shared");'),
      writeFile(
        join(root, '.vite/manifest.json'),
        JSON.stringify({
          '_shared.js': { file: 'assets/shared.js' },
          'core.html': { file: 'assets/core.js', imports: ['_shared.js'], isEntry: true },
          'ecosystem.html': { file: 'assets/ecosystem.js', isEntry: true },
        }),
      ),
    ]);

    const initial = await hashViteEntries(root, ['core.html']);
    await writeFile(join(root, 'assets/ecosystem.js'), 'console.log("changed ecosystem");');
    assert.equal(await hashViteEntries(root, ['core.html']), initial);

    await writeFile(join(root, 'assets/shared.js'), 'console.log("changed shared");');
    assert.notEqual(await hashViteEntries(root, ['core.html']), initial);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});
