const WUJIE_OPTIONS = {
  alive: false,
  degrade: false,
  fiber: false,
  sync: false,
};

const QK_NO_ISOLATION = {
  delivery: 'buffered',
  entrySite: 'same-site',
  framework: 'qiankun',
  frameworkOptions: { sandbox: false, styleIsolation: false },
  id: 'qk-no-isolation',
  label: 'qiankun · no isolation',
};

const QK_SANDBOX = {
  delivery: 'buffered',
  entrySite: 'same-site',
  framework: 'qiankun',
  frameworkOptions: { sandbox: true, styleIsolation: false },
  id: 'qk-sandbox',
  label: 'qiankun · sandbox',
};

const QK_FULL_ISOLATION = {
  delivery: 'buffered',
  entrySite: 'same-site',
  framework: 'qiankun',
  frameworkOptions: { sandbox: true, styleIsolation: true },
  id: 'qk-full-isolation',
  label: 'qiankun · sandbox + style isolation',
};

const QK_V2_FULL_ISOLATION = {
  delivery: 'buffered',
  entrySite: 'same-site',
  framework: 'qiankun-v2',
  frameworkOptions: { sandbox: { experimentalStyleIsolation: true } },
  id: 'qk-v2-full-isolation',
  label: 'qiankun v2.10.16 · Proxy sandbox + scoped CSS',
};

const NATIVE_IFRAME = {
  delivery: 'buffered',
  entrySite: 'same-site',
  framework: 'native',
  frameworkOptions: {},
  id: 'native-iframe',
  label: 'Native iframe · same-site · buffered',
};

const WUJIE_ISOLATED = {
  delivery: 'buffered',
  entrySite: 'same-site',
  framework: 'wujie',
  frameworkOptions: WUJIE_OPTIONS,
  id: 'wujie-isolated',
  label: 'Wujie · same-site entry',
};

const MICRO_APP_DEFAULT_ISOLATION = {
  delivery: 'buffered',
  entrySite: 'same-site',
  framework: 'micro-app',
  frameworkOptions: {},
  id: 'microapp-default-isolation',
  label: 'MicroApp · sandbox + scoped CSS',
};

const GARFISH_STRICT_ISOLATION = {
  delivery: 'buffered',
  entrySite: 'same-site',
  framework: 'garfish',
  frameworkOptions: { cache: false, sandbox: { strictIsolation: true } },
  id: 'garfish-strict-isolation',
  label: 'Garfish · VM sandbox + Shadow DOM',
};

const NATIVE_IFRAME_SSR_STREAMED = {
  delivery: 'streamed',
  entrySite: 'same-site',
  framework: 'native',
  frameworkOptions: {},
  htmlFixture: 'ssr',
  id: 'native-iframe-ssr-streamed',
  label: 'Native iframe · SSR streamed',
};

const QK_V3_SSR_DELAYED_BUFFERED = {
  delivery: 'delayed-buffered',
  entrySite: 'same-site',
  framework: 'qiankun',
  frameworkOptions: { sandbox: true, styleIsolation: true },
  htmlFixture: 'ssr',
  id: 'qk-v3-ssr-delayed-buffered',
  label: 'qiankun v3 · SSR delayed-buffer control',
};

const QK_V2_SSR_STREAMED = {
  delivery: 'streamed',
  entrySite: 'same-site',
  framework: 'qiankun-v2',
  frameworkOptions: { sandbox: { experimentalStyleIsolation: true } },
  htmlFixture: 'ssr',
  id: 'qk-v2-ssr-streamed',
  label: 'qiankun v2.10.16 · SSR streamed response',
};

const QK_V3_SSR_STREAMED = {
  delivery: 'streamed',
  entrySite: 'same-site',
  framework: 'qiankun',
  frameworkOptions: { sandbox: true, styleIsolation: true },
  htmlFixture: 'ssr',
  id: 'qk-v3-ssr-streamed',
  label: 'qiankun v3 · SSR progressive stream',
};

const WUJIE_SSR_STREAMED = {
  delivery: 'streamed',
  entrySite: 'same-site',
  framework: 'wujie',
  frameworkOptions: WUJIE_OPTIONS,
  htmlFixture: 'ssr',
  id: 'wujie-ssr-streamed',
  label: 'Wujie · SSR streamed response',
};

const GARFISH_SSR_STREAMED = {
  delivery: 'streamed',
  entrySite: 'same-site',
  framework: 'garfish',
  frameworkOptions: { cache: false, sandbox: { strictIsolation: true } },
  htmlFixture: 'ssr',
  id: 'garfish-ssr-streamed',
  label: 'Garfish · SSR streamed response',
};

const QK_FULL_ISOLATION_CROSS_SITE = {
  delivery: 'buffered',
  entrySite: 'cross-site',
  framework: 'qiankun',
  frameworkOptions: { sandbox: true, styleIsolation: true },
  id: 'qk-full-isolation-cross-site',
  label: 'qiankun · cross-site entry · full isolation',
};

const NATIVE_IFRAME_CROSS_SITE = {
  delivery: 'buffered',
  entrySite: 'cross-site',
  framework: 'native',
  frameworkOptions: {},
  id: 'native-iframe-cross-site',
  label: 'Native iframe · cross-site · buffered',
};

const WUJIE_CROSS_SITE = {
  delivery: 'buffered',
  entrySite: 'cross-site',
  framework: 'wujie',
  frameworkOptions: WUJIE_OPTIONS,
  id: 'wujie-cross-site-entry',
  label: 'Wujie · cross-site entry',
};

const NATIVE_IFRAME_STREAMED = {
  delivery: 'streamed',
  entrySite: 'same-site',
  framework: 'native',
  frameworkOptions: {},
  id: 'native-iframe-streamed',
  label: 'Native iframe · same-site · streamed',
};

const QK_STREAMED = {
  delivery: 'streamed',
  entrySite: 'same-site',
  framework: 'qiankun',
  frameworkOptions: { sandbox: true, styleIsolation: true },
  id: 'qk-streamed',
  label: 'qiankun · streamed',
};

const WUJIE_STREAMED = {
  delivery: 'streamed',
  entrySite: 'same-site',
  framework: 'wujie',
  frameworkOptions: WUJIE_OPTIONS,
  id: 'wujie-streamed',
  label: 'Wujie · streamed response',
};

const SANDBOX_COST_COMPARISON = {
  candidate: 'qk-sandbox',
  id: 'sandbox-cost',
  label: 'qiankun sandbox cost',
  reference: 'qk-no-isolation',
};

const SSR_STREAMING_GAIN_COMPARISON = {
  candidate: 'qk-v3-ssr-streamed',
  id: 'qiankun-v3-ssr-streaming-gain',
  label: 'qiankun v3 streamed vs delayed-buffered SSR',
  reference: 'qk-v3-ssr-delayed-buffered',
};

const SAME_SITE_COMPARISONS = [
  {
    candidate: 'qk-full-isolation',
    id: 'qiankun-native-isolated',
    label: 'qiankun vs native iframe under same-site isolation',
    reference: 'native-iframe',
  },
  {
    candidate: 'wujie-isolated',
    id: 'wujie-native-isolated',
    label: 'Wujie vs native iframe with same-site entries',
    reference: 'native-iframe',
  },
  {
    candidate: 'wujie-isolated',
    id: 'isolated-framework',
    label: 'Wujie vs qiankun with same-site entries',
    reference: 'qk-full-isolation',
  },
];

const CORE_COMPARISONS = [
  SANDBOX_COST_COMPARISON,
  {
    candidate: 'qk-full-isolation',
    id: 'style-isolation-cost',
    label: 'qiankun style isolation cost',
    reference: 'qk-sandbox',
  },
  ...SAME_SITE_COMPARISONS,
  {
    candidate: 'qk-streamed',
    id: 'qiankun-native-streamed',
    label: 'qiankun vs native iframe with streamed HTML',
    reference: 'native-iframe-streamed',
  },
  {
    candidate: 'wujie-streamed',
    id: 'wujie-native-streamed',
    label: 'Wujie vs native iframe with streamed HTML',
    reference: 'native-iframe-streamed',
  },
  {
    candidate: 'wujie-streamed',
    id: 'streaming-framework',
    label: 'Wujie vs qiankun with streamed HTML',
    reference: 'qk-streamed',
  },
];

const ECOSYSTEM_COMPARISONS = [
  ...SAME_SITE_COMPARISONS,
  {
    candidate: 'qk-v2-full-isolation',
    id: 'qiankun-v2-native-isolated',
    label: 'qiankun v2 vs native iframe under isolation',
    reference: 'native-iframe',
  },
  {
    candidate: 'qk-full-isolation',
    id: 'qiankun-v3-v2-isolated',
    label: 'qiankun v3 vs qiankun v2 under isolation',
    reference: 'qk-v2-full-isolation',
  },
  {
    candidate: 'microapp-default-isolation',
    id: 'microapp-native-isolated',
    label: 'MicroApp vs native iframe under default isolation',
    reference: 'native-iframe',
  },
  {
    candidate: 'microapp-default-isolation',
    id: 'microapp-qiankun-isolated',
    label: 'MicroApp vs qiankun under default isolation',
    reference: 'qk-full-isolation',
  },
  {
    candidate: 'garfish-strict-isolation',
    id: 'garfish-native-isolated',
    label: 'Garfish vs native iframe under strict isolation',
    reference: 'native-iframe',
  },
  {
    candidate: 'garfish-strict-isolation',
    id: 'garfish-qiankun-isolated',
    label: 'Garfish vs qiankun under isolation',
    reference: 'qk-full-isolation',
  },
  {
    candidate: 'garfish-strict-isolation',
    id: 'garfish-qiankun-v2-isolated',
    label: 'Garfish vs qiankun v2 under isolation',
    reference: 'qk-v2-full-isolation',
  },
];

const SITE_ISOLATION_COMPARISONS = [
  ...SAME_SITE_COMPARISONS,
  {
    candidate: 'qk-full-isolation-cross-site',
    id: 'qiankun-cross-site-cost',
    label: 'qiankun cross-site entry cost',
    reference: 'qk-full-isolation',
  },
  {
    candidate: 'native-iframe-cross-site',
    id: 'native-cross-site-cost',
    label: 'native iframe cross-site navigation cost (OOPIF verified)',
    reference: 'native-iframe',
  },
  {
    candidate: 'wujie-cross-site-entry',
    id: 'wujie-cross-site-cost',
    label: 'Wujie cross-site entry cost',
    reference: 'wujie-isolated',
  },
  {
    candidate: 'qk-full-isolation-cross-site',
    id: 'qiankun-native-cross-site',
    label: 'qiankun vs native iframe with cross-site entries',
    reference: 'native-iframe-cross-site',
  },
  {
    candidate: 'wujie-cross-site-entry',
    id: 'wujie-native-cross-site',
    label: 'Wujie vs native iframe with cross-site entries',
    reference: 'native-iframe-cross-site',
  },
  {
    candidate: 'wujie-cross-site-entry',
    id: 'cross-site-framework',
    label: 'Wujie vs qiankun with cross-site entries',
    reference: 'qk-full-isolation-cross-site',
  },
];

const SSR_STREAMING_COMPARISONS = [
  SSR_STREAMING_GAIN_COMPARISON,
  {
    candidate: 'qk-v3-ssr-streamed',
    id: 'qiankun-v3-native-ssr-streamed',
    label: 'qiankun v3 vs native iframe with streamed SSR',
    reference: 'native-iframe-ssr-streamed',
  },
  {
    candidate: 'qk-v2-ssr-streamed',
    id: 'qiankun-v2-v3-ssr-streamed',
    label: 'qiankun v2 vs v3 with streamed SSR',
    reference: 'qk-v3-ssr-streamed',
  },
  {
    candidate: 'wujie-ssr-streamed',
    id: 'wujie-qiankun-v3-ssr-streamed',
    label: 'Wujie vs qiankun v3 with streamed SSR',
    reference: 'qk-v3-ssr-streamed',
  },
  {
    candidate: 'garfish-ssr-streamed',
    id: 'garfish-qiankun-v3-ssr-streamed',
    label: 'Garfish vs qiankun v3 with streamed SSR',
    reference: 'qk-v3-ssr-streamed',
  },
];

export const SUITES = {
  core: {
    comparisons: CORE_COMPARISONS,
    id: 'core',
    title: 'Core HTML-entry matrix',
    variants: [
      QK_NO_ISOLATION,
      QK_SANDBOX,
      QK_FULL_ISOLATION,
      NATIVE_IFRAME,
      WUJIE_ISOLATED,
      NATIVE_IFRAME_STREAMED,
      QK_STREAMED,
      WUJIE_STREAMED,
    ],
  },
  'site-isolation': {
    comparisons: SITE_ISOLATION_COMPARISONS,
    id: 'site-isolation',
    title: 'Same-site and cross-site matrix',
    variants: [
      QK_FULL_ISOLATION,
      NATIVE_IFRAME,
      WUJIE_ISOLATED,
      QK_FULL_ISOLATION_CROSS_SITE,
      NATIVE_IFRAME_CROSS_SITE,
      WUJIE_CROSS_SITE,
    ],
  },
  'ssr-streaming': {
    calibrationSourceVariant: 'qk-v3-ssr-streamed',
    comparisons: SSR_STREAMING_COMPARISONS,
    id: 'ssr-streaming',
    title: 'SSR streaming matrix',
    variants: [
      NATIVE_IFRAME_SSR_STREAMED,
      QK_V3_SSR_DELAYED_BUFFERED,
      QK_V2_SSR_STREAMED,
      QK_V3_SSR_STREAMED,
      WUJIE_SSR_STREAMED,
      GARFISH_SSR_STREAMED,
    ],
  },
  'ecosystem-html': {
    comparisons: ECOSYSTEM_COMPARISONS,
    id: 'ecosystem-html',
    title: 'HTML-entry ecosystem matrix',
    variants: [
      NATIVE_IFRAME,
      QK_V2_FULL_ISOLATION,
      QK_FULL_ISOLATION,
      WUJIE_ISOLATED,
      MICRO_APP_DEFAULT_ISOLATION,
      GARFISH_STRICT_ISOLATION,
    ],
  },
  'ci-basic': {
    calibrationSourceVariant: 'qk-sandbox',
    ciOnly: true,
    comparisonGates: [
      { comparison: 'sandbox-cost', maxUpperBoundPercent: 25 },
      { comparison: 'qiankun-sandbox-native', maxUpperBoundPercent: 30 },
      { comparison: 'qiankun-v3-ssr-streaming-gain', maxUpperBoundPercent: -30 },
    ],
    comparisons: [
      SANDBOX_COST_COMPARISON,
      {
        candidate: 'qk-sandbox',
        id: 'qiankun-sandbox-native',
        label: 'qiankun sandbox vs native iframe',
        reference: 'native-iframe',
      },
      SSR_STREAMING_GAIN_COMPARISON,
    ],
    id: 'ci-basic',
    title: 'Basic performance gate',
    variants: [QK_NO_ISOLATION, QK_SANDBOX, NATIVE_IFRAME, QK_V3_SSR_DELAYED_BUFFERED, QK_V3_SSR_STREAMED],
  },
};

export const DEFAULT_SUITE_IDS = Object.values(SUITES)
  .filter((suite) => suite.ciOnly !== true)
  .map((suite) => suite.id);

export const PRODUCT_VARIANTS = SUITES.core.variants;
export const PRODUCT_COMPARISONS = SUITES.core.comparisons;

export const CALIBRATION_VARIANTS = [
  { id: 'calibration-a', label: 'A/A · A', sourceVariant: 'qk-full-isolation' },
  { id: 'calibration-b', label: 'A/A · B', sourceVariant: 'qk-full-isolation' },
];

const REVISION_SCENARIOS = {
  sandbox: {
    delivery: 'buffered',
    frameworkOptions: { sandbox: true, styleIsolation: false },
    label: 'qiankun sandbox',
  },
  streaming: {
    delivery: 'streamed',
    frameworkOptions: { sandbox: true, styleIsolation: true },
    label: 'qiankun streamed',
  },
};

export function createRevisionVariants(scenario = 'streaming') {
  const config = REVISION_SCENARIOS[scenario];
  if (!config) throw new Error(`unknown revision scenario: ${scenario}`);

  return [
    {
      delivery: config.delivery,
      entrySite: 'same-site',
      framework: 'qiankun',
      frameworkOptions: config.frameworkOptions,
      hostRole: 'baseline',
      id: 'revision-baseline',
      label: `baseline · ${config.label}`,
    },
    {
      delivery: config.delivery,
      entrySite: 'same-site',
      framework: 'qiankun',
      frameworkOptions: config.frameworkOptions,
      hostRole: 'candidate',
      id: 'revision-candidate',
      label: `candidate · ${config.label}`,
    },
  ];
}

export const REVISION_VARIANTS = createRevisionVariants();

export const REVISION_CALIBRATION_VARIANTS = [
  { id: 'calibration-a', label: 'A/A · A', sourceVariant: 'revision-candidate' },
  { id: 'calibration-b', label: 'A/A · B', sourceVariant: 'revision-candidate' },
];

export const REVISION_COMPARISONS = [
  {
    candidate: 'revision-candidate',
    id: 'candidate-vs-baseline',
    label: 'candidate vs baseline',
    reference: 'revision-baseline',
  },
];
