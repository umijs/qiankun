import { assertComparableHarness } from './fingerprint.mjs';

function getHarness(result) {
  const harness = result?.metadata?.harness;
  if (!harness) throw new Error('benchmark result is missing its harness fingerprint');
  return harness;
}

function getVariantMedians(result) {
  const variants = result?.product?.report?.variants;
  if (!variants) throw new Error('benchmark result is missing its product report');
  return variants;
}

export function compareBenchmarkResults(reference, candidate) {
  assertComparableHarness(getHarness(reference), getHarness(candidate));
  const referenceVariants = getVariantMedians(reference);
  const candidateVariants = getVariantMedians(candidate);
  const referenceIds = Object.keys(referenceVariants).sort();
  const candidateIds = Object.keys(candidateVariants).sort();
  if (JSON.stringify(referenceIds) !== JSON.stringify(candidateIds)) {
    throw new Error('benchmark results contain different variant sets');
  }

  return referenceIds.map((id) => {
    const referenceMedian = referenceVariants[id].summary?.median;
    const candidateMedian = candidateVariants[id].summary?.median;
    if (!Number.isFinite(referenceMedian) || !Number.isFinite(candidateMedian) || referenceMedian <= 0) {
      throw new Error(`benchmark result has an invalid median for ${id}`);
    }
    return {
      candidateMedian,
      id,
      label: candidateVariants[id].label,
      relativeDeltaPercent: (candidateMedian / referenceMedian - 1) * 100,
      referenceMedian,
    };
  });
}
