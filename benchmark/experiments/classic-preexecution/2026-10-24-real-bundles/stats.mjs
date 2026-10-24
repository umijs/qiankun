function validateSamples(samples, { positive = false } = {}) {
  if (samples.length === 0) throw new Error('at least one sample is required');
  const valid = samples.every((sample) => Number.isFinite(sample) && (!positive || sample > 0));
  if (!valid) {
    throw new Error(positive ? 'samples must be positive finite numbers' : 'samples must be finite numbers');
  }
}

function quantileSorted(sorted, probability) {
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

function medianSorted(sorted) {
  return quantileSorted(sorted, 0.5);
}

function createSeededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function summarize(samples) {
  validateSamples(samples);
  const sorted = [...samples].sort((left, right) => left - right);
  const count = sorted.length;
  const mean = sorted.reduce((total, sample) => total + sample, 0) / count;
  const median = medianSorted(sorted);
  const absoluteDeviations = sorted.map((sample) => Math.abs(sample - median)).sort((left, right) => left - right);
  const variance = sorted.reduce((total, sample) => total + (sample - mean) ** 2, 0) / count;
  const standardDeviation = Math.sqrt(variance);

  return {
    count,
    cv: mean === 0 ? null : standardDeviation / mean,
    mad: medianSorted(absoluteDeviations),
    mean,
    median,
    p75: quantileSorted(sorted, 0.75),
    p95: quantileSorted(sorted, 0.95),
    standardDeviation,
  };
}

export function comparePairedSamples(reference, candidate, { iterations = 10_000, seed = 20260711 } = {}) {
  if (reference.length !== candidate.length) throw new Error('paired sample arrays must have the same length');
  validateSamples(reference, { positive: true });
  validateSamples(candidate, { positive: true });
  if (!Number.isInteger(iterations) || iterations <= 0) {
    throw new Error('bootstrap iterations must be a positive integer');
  }

  const logRatios = reference.map((sample, index) => Math.log(candidate[index] / sample));
  const estimate = medianSorted([...logRatios].sort((left, right) => left - right));
  const random = createSeededRandom(seed);
  const bootstrap = [];

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const resampled = [];
    for (let index = 0; index < logRatios.length; index += 1) {
      resampled.push(logRatios[Math.floor(random() * logRatios.length)]);
    }
    resampled.sort((left, right) => left - right);
    bootstrap.push(Math.expm1(medianSorted(resampled)) * 100);
  }
  bootstrap.sort((left, right) => left - right);

  return {
    confidenceInterval95: [quantileSorted(bootstrap, 0.025), quantileSorted(bootstrap, 0.975)],
    relativeDeltaPercent: Math.expm1(estimate) * 100,
  };
}

export function comparePairedTrials(trials, { iterations = 10_000, seed = 20260711 } = {}) {
  if (trials.length === 0) throw new Error('at least one trial is required');
  if (!Number.isInteger(iterations) || iterations <= 0) {
    throw new Error('bootstrap iterations must be a positive integer');
  }

  // The absolute paired delta (milliseconds) rides the exact same hierarchical bootstrap as the
  // log ratio, sharing every resample draw: the ratio expresses proportional overhead, while the
  // absolute delta exposes the fixed constant cost a small fixture would otherwise disguise as a
  // percentage. Sharing the draw sequence keeps the relative results bit-identical to before.
  const pairsByTrial = trials.map(({ candidate, reference }) => {
    if (reference.length !== candidate.length) throw new Error('paired sample arrays must have the same length');
    validateSamples(reference, { positive: true });
    validateSamples(candidate, { positive: true });
    return {
      absoluteDeltas: reference.map((sample, index) => candidate[index] - sample),
      logRatios: reference.map((sample, index) => Math.log(candidate[index] / sample)),
    };
  });
  const ascending = (left, right) => left - right;
  const trialMedianLogRatios = pairsByTrial.map(({ logRatios }) => medianSorted([...logRatios].sort(ascending)));
  const trialMedianAbsoluteDeltas = pairsByTrial.map(({ absoluteDeltas }) =>
    medianSorted([...absoluteDeltas].sort(ascending)),
  );
  const estimate = medianSorted([...trialMedianLogRatios].sort(ascending));
  const absoluteEstimate = medianSorted([...trialMedianAbsoluteDeltas].sort(ascending));
  const random = createSeededRandom(seed);
  const bootstrap = [];
  const absoluteBootstrap = [];

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const resampledTrialMedians = [];
    const resampledTrialAbsoluteMedians = [];
    for (let trialIndex = 0; trialIndex < pairsByTrial.length; trialIndex += 1) {
      const selectedTrial = pairsByTrial[Math.floor(random() * pairsByTrial.length)];
      const resampledRatios = [];
      const resampledDeltas = [];
      for (let index = 0; index < selectedTrial.logRatios.length; index += 1) {
        const draw = Math.floor(random() * selectedTrial.logRatios.length);
        resampledRatios.push(selectedTrial.logRatios[draw]);
        resampledDeltas.push(selectedTrial.absoluteDeltas[draw]);
      }
      resampledRatios.sort(ascending);
      resampledDeltas.sort(ascending);
      resampledTrialMedians.push(medianSorted(resampledRatios));
      resampledTrialAbsoluteMedians.push(medianSorted(resampledDeltas));
    }
    resampledTrialMedians.sort(ascending);
    resampledTrialAbsoluteMedians.sort(ascending);
    bootstrap.push(Math.expm1(medianSorted(resampledTrialMedians)) * 100);
    absoluteBootstrap.push(medianSorted(resampledTrialAbsoluteMedians));
  }
  bootstrap.sort(ascending);
  absoluteBootstrap.sort(ascending);

  return {
    absoluteDeltaConfidenceInterval95Ms: [
      quantileSorted(absoluteBootstrap, 0.025),
      quantileSorted(absoluteBootstrap, 0.975),
    ],
    absoluteDeltaMs: absoluteEstimate,
    confidenceInterval95: [quantileSorted(bootstrap, 0.025), quantileSorted(bootstrap, 0.975)],
    pairedCount: pairsByTrial.reduce((total, { logRatios }) => total + logRatios.length, 0),
    relativeDeltaPercent: Math.expm1(estimate) * 100,
    trialCount: trials.length,
    trialRelativeDeltas: trialMedianLogRatios.map((value) => Math.expm1(value) * 100),
  };
}

export function evaluateCalibration(
  comparison,
  { maxAbsoluteDeltaPercent = 3, maxIntervalWidthPercentPoints = 10 } = {},
) {
  const [lower, upper] = comparison.confidenceInterval95;
  const width = upper - lower;
  const failures = [];

  if (Math.abs(comparison.relativeDeltaPercent) > maxAbsoluteDeltaPercent) {
    failures.push(
      `absolute median delta ${Math.abs(comparison.relativeDeltaPercent).toFixed(2)}% exceeds ${maxAbsoluteDeltaPercent.toFixed(2)}%`,
    );
  }
  if (lower > 0 || upper < 0) failures.push('95% confidence interval does not include 0%');
  if (width > maxIntervalWidthPercentPoints) {
    failures.push(
      `95% confidence interval width ${width.toFixed(2)}pp exceeds ${maxIntervalWidthPercentPoints.toFixed(2)}pp`,
    );
  }

  return { failures, passed: failures.length === 0 };
}
