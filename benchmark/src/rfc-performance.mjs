export const RFC_REGRESSION_BUDGET_PERCENT = 5;

// Resolution guard: a run only counts as conclusive when the bootstrap 95% CI is
// narrower than this many percent points; otherwise the gate fails as inconclusive
// instead of passing on noise.
export const RFC_INTERVAL_WIDTH_GUARD_PERCENT_POINTS = 10;

export const RFC_PERFORMANCE_METRICS = [
  {
    browserMetric: 'membrane-get',
    displayUnit: 'Mops/s',
    id: 'membrane-get',
    iterations: 500_000,
    kind: 'micro',
    label: 'membrane get',
  },
  {
    browserMetric: 'membrane-set',
    displayUnit: 'Mops/s',
    id: 'membrane-set',
    iterations: 500_000,
    kind: 'micro',
    label: 'membrane set',
  },
  {
    browserMetric: 'module-rewrite',
    displayUnit: 'MiB/s',
    id: 'module-rewrite',
    iterations: 20,
    kind: 'micro',
    label: 'ESM module rewrite',
  },
  {
    browserMetric: null,
    displayUnit: 'ms',
    id: 'load-chain',
    iterations: 1,
    kind: 'load',
    label: 'sandbox load chain',
  },
];

const DEFAULT_OPTIONS = {
  baselineDir: 'artifacts/baseline',
  samples: 100,
  seed: 20260718,
  timeoutMs: 10_000,
  warmup: 5,
};

const INTEGER_OPTIONS = new Map([
  ['samples', 'samples'],
  ['seed', 'seed'],
  ['timeout', 'timeoutMs'],
  ['warmup', 'warmup'],
]);

export function parseRfcPerformanceOptions(args) {
  const options = { ...DEFAULT_OPTIONS };
  for (const argument of args) {
    const match = /^--([^=]+)=(.+)$/u.exec(argument);
    if (!match) throw new Error(`unknown option: ${argument}`);
    const [, name, rawValue] = match;
    if (name === 'baseline-dir') {
      options.baselineDir = rawValue;
      continue;
    }

    const property = INTEGER_OPTIONS.get(name);
    if (!property) throw new Error(`unknown option: --${name}`);
    const value = Number(rawValue);
    if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`);
    options[property] = value;
  }
  return options;
}
