export function evaluateRunVerdict({
  calibrationEvaluation,
  comparisonEvaluation,
  expectedProductSamples,
  fatalError,
  hasComparisonGates,
  hasInvalidProductSample,
  options,
  productSampleCount,
  revisionEvaluation,
}) {
  const comparisonPassed =
    !options.comparisonGate ||
    (options.mode === 'revision'
      ? revisionEvaluation?.passed === true
      : !hasComparisonGates || comparisonEvaluation?.passed === true);

  return (
    !fatalError &&
    (!options.calibrationGate || calibrationEvaluation?.passed === true) &&
    comparisonPassed &&
    !hasInvalidProductSample &&
    productSampleCount === expectedProductSamples
  );
}
