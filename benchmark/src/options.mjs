const DEFAULT_OPTIONS = {
  baselineDir: null,
  calibrationGate: true,
  calibrationSamples: 100,
  chunkIntervalMs: 50,
  comparisonGate: true,
  mode: 'framework',
  samples: 100,
  scenario: null,
  seed: 20260711,
  suite: 'core',
  timeoutMs: 10_000,
  trials: 3,
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
  ['trials', 'trials'],
  ['warmup', 'warmup'],
]);

export function parseRunnerOptions(args) {
  const options = { ...DEFAULT_OPTIONS };
  let trialsExplicit = false;
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

    if (name === 'scenario') {
      if (rawValue !== 'streaming' && rawValue !== 'sandbox') {
        throw new Error('scenario must be streaming or sandbox');
      }
      options.scenario = rawValue;
      continue;
    }

    if (name === 'suite') {
      if (
        rawValue !== 'core' &&
        rawValue !== 'ci-basic' &&
        rawValue !== 'site-isolation' &&
        rawValue !== 'ssr-streaming' &&
        rawValue !== 'ecosystem-html'
      ) {
        throw new Error('suite must be core, ci-basic, site-isolation, ssr-streaming, or ecosystem-html');
      }
      options.suite = rawValue;
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
    if (name === 'trials') trialsExplicit = true;
  }

  if (options.mode === 'revision' && !options.baselineDir) {
    throw new Error('baseline-dir is required in revision mode');
  }
  if (options.mode === 'framework' && options.baselineDir) {
    throw new Error('baseline-dir requires revision mode');
  }
  if (options.mode === 'framework' && options.scenario) {
    throw new Error('scenario requires revision mode');
  }
  if (options.mode === 'revision' && !options.scenario) {
    options.scenario = 'streaming';
  }
  if (options.mode === 'revision') {
    if (options.suite !== 'core') throw new Error('revision mode requires the core suite');
    if (trialsExplicit && options.trials !== 1) throw new Error('revision mode requires trials=1');
    options.trials = 1;
  }

  return options;
}
