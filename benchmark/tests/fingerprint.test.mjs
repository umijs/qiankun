import assert from 'node:assert/strict';
import test from 'node:test';

import { assertComparableHarness, createHarnessFingerprint } from '../src/fingerprint.mjs';

const descriptor = {
  browser: {
    launchArgs: ['--site-per-process'],
    name: 'chromium',
    version: '149.0.7756.0',
  },
  fixture: {
    bundleHash: 'fixture-sha256',
    chunkIntervalMs: 50,
  },
  frameworks: {
    qiankun: '3.0.0-alpha.0',
    wujie: '2.1.0',
  },
  harnessSourceHash: 'harness-sha256',
  measurement: {
    end: 'core-element-visible-after-two-animation-frames',
    start: 'immediately-before-framework-load',
  },
  variants: [
    { delivery: 'buffered', framework: 'native', id: 'native-iframe' },
    { delivery: 'buffered', framework: 'qiankun', id: 'qiankun-full' },
  ],
};

function harnessRecord(value) {
  return { descriptor: value, fingerprint: createHarnessFingerprint(value) };
}

test('createHarnessFingerprint is canonical and sensitive to execution-path inputs', () => {
  const reordered = {
    variants: descriptor.variants.map(({ delivery, framework, id }) => ({ id, framework, delivery })),
    measurement: { start: descriptor.measurement.start, end: descriptor.measurement.end },
    harnessSourceHash: descriptor.harnessSourceHash,
    frameworks: { wujie: descriptor.frameworks.wujie, qiankun: descriptor.frameworks.qiankun },
    fixture: { chunkIntervalMs: descriptor.fixture.chunkIntervalMs, bundleHash: descriptor.fixture.bundleHash },
    browser: {
      version: descriptor.browser.version,
      name: descriptor.browser.name,
      launchArgs: descriptor.browser.launchArgs,
    },
  };
  const fingerprint = createHarnessFingerprint(descriptor);

  assert.match(fingerprint, /^[a-f\d]{64}$/u);
  assert.equal(createHarnessFingerprint(reordered), fingerprint);

  const changedLaunchArgs = structuredClone(descriptor);
  changedLaunchArgs.browser.launchArgs.push('--disable-background-timer-throttling');
  assert.notEqual(createHarnessFingerprint(changedLaunchArgs), fingerprint);

  const changedFramework = structuredClone(descriptor);
  changedFramework.frameworks.wujie = '2.2.0';
  assert.notEqual(createHarnessFingerprint(changedFramework), fingerprint);

  const changedVariants = structuredClone(descriptor);
  changedVariants.variants.reverse();
  assert.notEqual(createHarnessFingerprint(changedVariants), fingerprint);
});

test('assertComparableHarness rejects cross-run comparisons and identifies the changed field', () => {
  const left = harnessRecord(descriptor);
  const sameHarness = harnessRecord(structuredClone(descriptor));
  assert.doesNotThrow(() => assertComparableHarness(left, sameHarness));

  const changed = structuredClone(descriptor);
  changed.browser.launchArgs.push('--disable-renderer-backgrounding');
  assert.throws(() => assertComparableHarness(left, harnessRecord(changed)), /browser\.launchArgs/u);
  assert.throws(() => assertComparableHarness(left, { descriptor, fingerprint: '0'.repeat(64) }), /fingerprint/u);
});
