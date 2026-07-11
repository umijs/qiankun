const DEFAULT_OPTIONS = {
  calibrationGate: true,
  calibrationSamples: 50,
  chunkIntervalMs: 50,
  samples: 100,
  seed: 20260711,
  timeoutMs: 10_000,
  warmup: 5,
};

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

    if (name === 'calibration-gate') {
      if (rawValue !== 'true' && rawValue !== 'false') {
        throw new Error('calibration-gate must be true or false');
      }
      options.calibrationGate = rawValue === 'true';
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
