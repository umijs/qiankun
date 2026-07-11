const DEFAULT_OPTIONS = {
  baselineDir: null,
  calibrationGate: true,
  calibrationSamples: 50,
  chunkIntervalMs: 50,
  comparisonGate: true,
  mode: 'framework',
  samples: 100,
  seed: 20260711,
  timeoutMs: 10_000,
  warmup: 5,
};

const BOOLEAN_OPTIONS = new Map([
  ['calibration-gate', 'calibrationGate'],
  ['comparison-gate', 'comparisonGate'],
]);

const INTEGER_OPTIONS = new Map([
  ['calibration-samples', 'calibrationSamples'],
  ['chunk-interval', 'chunkIntervalMs'],
  ['samples', 'samples'],
  ['seed', 'seed'],
  ['timeout', 'timeoutMs'],
  ['warmup', 'warmup'],
]);

export function parseRunnerOptions(args) {
  const options = { ...DEFAULT_OPTIONS };
  for (const argument of args) {
    const match = /^--([^=]+)=(.+)$/u.exec(argument);
    if (!match) throw new Error(`unknown option: ${argument}`);
    const [, name, rawValue] = match;

    const booleanProperty = BOOLEAN_OPTIONS.get(name);
    if (booleanProperty) {
      if (rawValue !== 'true' && rawValue !== 'false') {
        throw new Error(`${name} must be true or false`);
      }
      options[booleanProperty] = rawValue === 'true';
      continue;
    }

    if (name === 'mode') {
      if (rawValue !== 'framework' && rawValue !== 'revision') {
        throw new Error('mode must be framework or revision');
      }
      options.mode = rawValue;
      continue;
    }

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

  if (options.mode === 'revision' && !options.baselineDir) {
    throw new Error('baseline-dir is required in revision mode');
  }
  if (options.mode === 'framework' && options.baselineDir) {
    throw new Error('baseline-dir requires revision mode');
  }

  return options;
}
