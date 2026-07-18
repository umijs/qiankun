import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FRAMEWORK_ADAPTERS,
  assertFrameworkVariantSupported,
  getFrameworkAdapter,
  getVariantHostPage,
} from '../frameworks.mjs';
import { SUITES } from '../scenarios.mjs';

test('every suite variant resolves through an explicit framework adapter', () => {
  for (const variant of Object.values(SUITES).flatMap((suite) => suite.variants)) {
    const adapter = getFrameworkAdapter(variant.framework);
    assert.equal(getVariantHostPage(variant), adapter.hostPage);
    assert.equal(adapter.capabilities.htmlEntry, true);
    assert.doesNotThrow(() => assertFrameworkVariantSupported(variant));
  }
});

test('framework adapters own host filenames and reject unknown ids', () => {
  assert.deepEqual(Object.keys(FRAMEWORK_ADAPTERS).sort(), [
    'garfish',
    'micro-app',
    'native',
    'qiankun',
    'qiankun-v2',
    'wujie',
  ]);
  assert.equal(getVariantHostPage({ framework: 'qiankun' }), 'qiankun.html');
  assert.equal(getVariantHostPage({ framework: 'qiankun-v2' }), 'qiankun-v2.html');
  assert.equal(FRAMEWORK_ADAPTERS.native.capabilities.progressiveHtmlParsing, true);
  assert.equal(FRAMEWORK_ADAPTERS.qiankun.capabilities.progressiveHtmlParsing, true);
  for (const id of ['garfish', 'micro-app', 'qiankun-v2', 'wujie']) {
    assert.equal(FRAMEWORK_ADAPTERS[id].capabilities.acceptsChunkedResponse, true);
    assert.equal(FRAMEWORK_ADAPTERS[id].capabilities.progressiveHtmlParsing, false);
  }
  assert.throws(() => getFrameworkAdapter('unknown'), /unknown benchmark framework adapter: unknown/u);
});
