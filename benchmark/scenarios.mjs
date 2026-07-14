const WUJIE_OPTIONS = {
  alive: false,
  degrade: false,
  fiber: false,
  sync: false,
};

export const PRODUCT_VARIANTS = [
  {
    delivery: 'buffered',
    framework: 'qiankun',
    frameworkOptions: { sandbox: false, styleIsolation: false },
    id: 'qk-no-isolation',
    label: 'qiankun · no isolation',
  },
  {
    delivery: 'buffered',
    framework: 'qiankun',
    frameworkOptions: { sandbox: true, styleIsolation: false },
    id: 'qk-sandbox',
    label: 'qiankun · sandbox',
  },
  {
    delivery: 'buffered',
    framework: 'qiankun',
    frameworkOptions: { sandbox: true, styleIsolation: true },
    id: 'qk-full-isolation',
    label: 'qiankun · sandbox + style isolation',
  },
  {
    delivery: 'buffered',
    framework: 'wujie',
    frameworkOptions: WUJIE_OPTIONS,
    id: 'wujie-isolated',
    label: 'Wujie · iframe + Shadow DOM',
  },
  {
    delivery: 'streamed',
    framework: 'qiankun',
    frameworkOptions: { sandbox: true, styleIsolation: true },
    id: 'qk-streamed',
    label: 'qiankun · streamed',
  },
  {
    delivery: 'streamed',
    framework: 'wujie',
    frameworkOptions: WUJIE_OPTIONS,
    id: 'wujie-streamed',
    label: 'Wujie · streamed response',
  },
];

export const CALIBRATION_VARIANTS = [
  { id: 'calibration-a', label: 'A/A · A', sourceVariant: 'qk-full-isolation' },
  { id: 'calibration-b', label: 'A/A · B', sourceVariant: 'qk-full-isolation' },
];

export const PRODUCT_COMPARISONS = [
  {
    candidate: 'qk-sandbox',
    id: 'sandbox-cost',
    label: 'qiankun sandbox cost',
    reference: 'qk-no-isolation',
  },
  {
    candidate: 'qk-full-isolation',
    id: 'style-isolation-cost',
    label: 'qiankun style isolation cost',
    reference: 'qk-sandbox',
  },
  {
    candidate: 'wujie-isolated',
    id: 'isolated-framework',
    label: 'Wujie vs qiankun under isolation',
    reference: 'qk-full-isolation',
  },
  {
    candidate: 'wujie-streamed',
    id: 'streaming-framework',
    label: 'Wujie vs qiankun with streamed HTML',
    reference: 'qk-streamed',
  },
];

const REVISION_FRAMEWORK_OPTIONS = { sandbox: true, styleIsolation: true };

export const REVISION_VARIANTS = [
  {
    delivery: 'streamed',
    framework: 'qiankun',
    frameworkOptions: REVISION_FRAMEWORK_OPTIONS,
    hostRole: 'baseline',
    id: 'revision-baseline',
    label: 'baseline · qiankun streamed',
  },
  {
    delivery: 'streamed',
    framework: 'qiankun',
    frameworkOptions: REVISION_FRAMEWORK_OPTIONS,
    hostRole: 'candidate',
    id: 'revision-candidate',
    label: 'candidate · qiankun streamed',
  },
];

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
