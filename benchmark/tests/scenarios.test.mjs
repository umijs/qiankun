import assert from 'node:assert/strict';
import test from 'node:test';

import * as scenarios from '../scenarios.mjs';

const { CALIBRATION_VARIANTS, PRODUCT_COMPARISONS, PRODUCT_VARIANTS } = scenarios;

test('the core product matrix contains eight explicit variants instead of a cartesian product', () => {
  assert.deepEqual(
    PRODUCT_VARIANTS.map((variant) => variant.id),
    [
      'qk-no-isolation',
      'qk-sandbox',
      'qk-full-isolation',
      'native-iframe',
      'wujie-isolated',
      'native-iframe-streamed',
      'qk-streamed',
      'wujie-streamed',
    ],
  );
});

test('every product variant declares its entry site explicitly', () => {
  assert.deepEqual(
    PRODUCT_VARIANTS.map(({ entrySite, id }) => ({ entrySite, id })),
    [
      { entrySite: 'same-site', id: 'qk-no-isolation' },
      { entrySite: 'same-site', id: 'qk-sandbox' },
      { entrySite: 'same-site', id: 'qk-full-isolation' },
      { entrySite: 'same-site', id: 'native-iframe' },
      { entrySite: 'same-site', id: 'wujie-isolated' },
      { entrySite: 'same-site', id: 'native-iframe-streamed' },
      { entrySite: 'same-site', id: 'qk-streamed' },
      { entrySite: 'same-site', id: 'wujie-streamed' },
    ],
  );
});

test('qiankun variants isolate sandbox and style costs one feature at a time', () => {
  const noIsolation = PRODUCT_VARIANTS[0];
  const sandbox = PRODUCT_VARIANTS[1];
  const fullIsolation = PRODUCT_VARIANTS[2];

  assert.deepEqual(noIsolation.frameworkOptions, { sandbox: false, styleIsolation: false });
  assert.deepEqual(sandbox.frameworkOptions, { sandbox: true, styleIsolation: false });
  assert.deepEqual(fullIsolation.frameworkOptions, { sandbox: true, styleIsolation: true });
});

test('wujie variants use its fastest cold-load isolated configuration', () => {
  for (const variant of PRODUCT_VARIANTS.filter(({ framework }) => framework === 'wujie')) {
    assert.deepEqual(variant.frameworkOptions, {
      alive: false,
      degrade: false,
      fiber: false,
      sync: false,
    });
  }
});

test('core native iframe variants cover same-site buffered and streamed delivery', () => {
  assert.deepEqual(
    PRODUCT_VARIANTS.filter(({ framework }) => framework === 'native').map(
      ({ delivery, entrySite, frameworkOptions, id }) => ({
        delivery,
        entrySite,
        frameworkOptions,
        id,
      }),
    ),
    [
      { delivery: 'buffered', entrySite: 'same-site', frameworkOptions: {}, id: 'native-iframe' },
      { delivery: 'streamed', entrySite: 'same-site', frameworkOptions: {}, id: 'native-iframe-streamed' },
    ],
  );
});

test('ecosystem suite adds canonical isolated cells for qiankun v2, MicroApp, and Garfish', () => {
  const ecosystem = scenarios.SUITES['ecosystem-html'];
  const qiankunV2 = ecosystem.variants.find(({ id }) => id === 'qk-v2-full-isolation');
  const microApp = ecosystem.variants.find(({ id }) => id === 'microapp-default-isolation');
  const garfish = ecosystem.variants.find(({ id }) => id === 'garfish-strict-isolation');

  assert.deepEqual(qiankunV2, {
    delivery: 'buffered',
    entrySite: 'same-site',
    framework: 'qiankun-v2',
    frameworkOptions: { sandbox: { experimentalStyleIsolation: true } },
    id: 'qk-v2-full-isolation',
    label: 'qiankun v2.10.16 · Proxy sandbox + scoped CSS',
  });
  assert.deepEqual(microApp, {
    delivery: 'buffered',
    entrySite: 'same-site',
    framework: 'micro-app',
    frameworkOptions: {},
    id: 'microapp-default-isolation',
    label: 'MicroApp · sandbox + scoped CSS',
  });
  assert.deepEqual(garfish, {
    delivery: 'buffered',
    entrySite: 'same-site',
    framework: 'garfish',
    frameworkOptions: { cache: false, sandbox: { strictIsolation: true } },
    id: 'garfish-strict-isolation',
    label: 'Garfish · VM sandbox + Shadow DOM',
  });
  assert.deepEqual(
    ecosystem.comparisons.map(({ id }) => id),
    [
      'qiankun-native-isolated',
      'wujie-native-isolated',
      'isolated-framework',
      'qiankun-v2-native-isolated',
      'qiankun-v3-v2-isolated',
      'microapp-native-isolated',
      'microapp-qiankun-isolated',
      'garfish-native-isolated',
      'garfish-qiankun-isolated',
      'garfish-qiankun-v2-isolated',
    ],
  );
});

test('SSR streaming suite isolates progressive reveal from full-response buffering', () => {
  const suite = scenarios.SUITES['ssr-streaming'];

  assert.deepEqual(
    suite.variants.map(({ delivery, framework, htmlFixture, id }) => ({ delivery, framework, htmlFixture, id })),
    [
      {
        delivery: 'streamed',
        framework: 'native',
        htmlFixture: 'ssr',
        id: 'native-iframe-ssr-streamed',
      },
      {
        delivery: 'delayed-buffered',
        framework: 'qiankun',
        htmlFixture: 'ssr',
        id: 'qk-v3-ssr-delayed-buffered',
      },
      {
        delivery: 'streamed',
        framework: 'qiankun-v2',
        htmlFixture: 'ssr',
        id: 'qk-v2-ssr-streamed',
      },
      {
        delivery: 'streamed',
        framework: 'qiankun',
        htmlFixture: 'ssr',
        id: 'qk-v3-ssr-streamed',
      },
      {
        delivery: 'streamed',
        framework: 'wujie',
        htmlFixture: 'ssr',
        id: 'wujie-ssr-streamed',
      },
      {
        delivery: 'streamed',
        framework: 'garfish',
        htmlFixture: 'ssr',
        id: 'garfish-ssr-streamed',
      },
    ],
  );
  assert.deepEqual(
    suite.comparisons.map(({ candidate, id, reference }) => ({ candidate, id, reference })),
    [
      {
        candidate: 'qk-v3-ssr-streamed',
        id: 'qiankun-v3-ssr-streaming-gain',
        reference: 'qk-v3-ssr-delayed-buffered',
      },
      {
        candidate: 'qk-v3-ssr-streamed',
        id: 'qiankun-v3-native-ssr-streamed',
        reference: 'native-iframe-ssr-streamed',
      },
      {
        candidate: 'qk-v2-ssr-streamed',
        id: 'qiankun-v2-v3-ssr-streamed',
        reference: 'qk-v3-ssr-streamed',
      },
      {
        candidate: 'wujie-ssr-streamed',
        id: 'wujie-qiankun-v3-ssr-streamed',
        reference: 'qk-v3-ssr-streamed',
      },
      {
        candidate: 'garfish-ssr-streamed',
        id: 'garfish-qiankun-v3-ssr-streamed',
        reference: 'qk-v3-ssr-streamed',
      },
    ],
  );
});

test('the matrix defines framework and native-baseline comparisons', () => {
  assert.deepEqual(
    PRODUCT_COMPARISONS.map((comparison) => comparison.id),
    [
      'sandbox-cost',
      'style-isolation-cost',
      'qiankun-native-isolated',
      'wujie-native-isolated',
      'isolated-framework',
      'qiankun-native-streamed',
      'wujie-native-streamed',
      'streaming-framework',
    ],
  );

  assert.deepEqual(
    PRODUCT_COMPARISONS.filter(({ id }) => id.includes('native')).map(({ candidate, id, reference }) => ({
      candidate,
      id,
      reference,
    })),
    [
      {
        candidate: 'qk-full-isolation',
        id: 'qiankun-native-isolated',
        reference: 'native-iframe',
      },
      {
        candidate: 'wujie-isolated',
        id: 'wujie-native-isolated',
        reference: 'native-iframe',
      },
      {
        candidate: 'qk-streamed',
        id: 'qiankun-native-streamed',
        reference: 'native-iframe-streamed',
      },
      {
        candidate: 'wujie-streamed',
        id: 'wujie-native-streamed',
        reference: 'native-iframe-streamed',
      },
    ],
  );
});

test('A/A calibration aliases the exact same qiankun variant', () => {
  assert.equal(CALIBRATION_VARIANTS.length, 2);
  assert.deepEqual(
    CALIBRATION_VARIANTS.map(({ sourceVariant }) => sourceVariant),
    ['qk-full-isolation', 'qk-full-isolation'],
  );
});

test('revision comparison variants differ only by revision host role', () => {
  const { REVISION_CALIBRATION_VARIANTS, REVISION_COMPARISONS, createRevisionVariants } = scenarios;
  const revisionVariants = createRevisionVariants('streaming');

  assert.deepEqual(
    revisionVariants.map(({ hostRole, id }) => ({ hostRole, id })),
    [
      { hostRole: 'baseline', id: 'revision-baseline' },
      { hostRole: 'candidate', id: 'revision-candidate' },
    ],
  );
  assert.deepEqual(
    revisionVariants.map(({ delivery, entrySite, framework, frameworkOptions }) => ({
      delivery,
      entrySite,
      framework,
      frameworkOptions,
    })),
    [
      {
        delivery: 'streamed',
        entrySite: 'same-site',
        framework: 'qiankun',
        frameworkOptions: { sandbox: true, styleIsolation: true },
      },
      {
        delivery: 'streamed',
        entrySite: 'same-site',
        framework: 'qiankun',
        frameworkOptions: { sandbox: true, styleIsolation: true },
      },
    ],
  );
  assert.deepEqual(REVISION_COMPARISONS, [
    {
      candidate: 'revision-candidate',
      id: 'candidate-vs-baseline',
      label: 'candidate vs baseline',
      reference: 'revision-baseline',
    },
  ]);
  assert.deepEqual(
    REVISION_CALIBRATION_VARIANTS.map(({ sourceVariant }) => sourceVariant),
    ['revision-candidate', 'revision-candidate'],
  );
});

test('sandbox revision scenario isolates sandbox work from streaming and style isolation', () => {
  const revisionVariants = scenarios.createRevisionVariants('sandbox');

  assert.deepEqual(
    revisionVariants.map(({ delivery, entrySite, framework, frameworkOptions }) => ({
      delivery,
      entrySite,
      framework,
      frameworkOptions,
    })),
    [
      {
        delivery: 'buffered',
        entrySite: 'same-site',
        framework: 'qiankun',
        frameworkOptions: { sandbox: true, styleIsolation: false },
      },
      {
        delivery: 'buffered',
        entrySite: 'same-site',
        framework: 'qiankun',
        frameworkOptions: { sandbox: true, styleIsolation: false },
      },
    ],
  );
});

test('revision scenarios reject unknown names', () => {
  assert.throws(() => scenarios.createRevisionVariants('unknown'), /unknown revision scenario: unknown/u);
});
