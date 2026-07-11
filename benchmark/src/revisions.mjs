function formatSignedPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function evaluateRevisionComparison(comparison) {
  const upperBound = comparison.confidenceInterval95[1];
  const failures = [];
  if (upperBound >= 0) {
    failures.push(`95% confidence interval upper bound ${formatSignedPercent(upperBound)} is not below 0%`);
  }
  return { failures, passed: failures.length === 0 };
}

export function resolveVariantHostOrigin(variant, hostOrigins) {
  const role = variant.hostRole ?? 'candidate';
  const origin = hostOrigins[role];
  if (!origin) throw new Error(`host origin is unavailable for role: ${role}`);
  return origin;
}
