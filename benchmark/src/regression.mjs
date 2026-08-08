function formatSignedPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

/**
 * Evaluate the RFC hard-metric gate on a paired comparison.
 *
 * Two checks compose the gate:
 * 1. Budget — the paired median log-ratio point estimate must not regress beyond
 *    `maxRegressionPercent`.
 * 2. Resolution — the bootstrap 95% confidence interval must be narrow enough
 *    (`maxIntervalWidthPercentPoints`) for the run to actually resolve that budget;
 *    otherwise a noisy run could pass (or fail) on noise alone. Pass `null` to
 *    disable the resolution guard explicitly.
 */
export function evaluateRegressionBudget(
  comparison,
  { maxRegressionPercent = 5, maxIntervalWidthPercentPoints = 10 } = {},
) {
  if (!Number.isFinite(maxRegressionPercent) || maxRegressionPercent < 0) {
    throw new TypeError('maxRegressionPercent must be a non-negative finite number');
  }
  if (
    maxIntervalWidthPercentPoints !== null &&
    (!Number.isFinite(maxIntervalWidthPercentPoints) || maxIntervalWidthPercentPoints <= 0)
  ) {
    throw new TypeError('maxIntervalWidthPercentPoints must be a positive finite number or null');
  }
  const relativeDeltaPercent = comparison?.relativeDeltaPercent;
  if (!Number.isFinite(relativeDeltaPercent)) {
    throw new TypeError('comparison must contain a finite relative delta');
  }

  const failures = [];
  if (relativeDeltaPercent > maxRegressionPercent) {
    failures.push(
      `paired median regression ${formatSignedPercent(relativeDeltaPercent)} exceeds the +${maxRegressionPercent.toFixed(2)}% regression budget`,
    );
  }

  if (maxIntervalWidthPercentPoints !== null) {
    const confidenceInterval95 = comparison?.confidenceInterval95;
    const [lower, upper] = Array.isArray(confidenceInterval95) ? confidenceInterval95 : [];
    if (!Number.isFinite(lower) || !Number.isFinite(upper)) {
      failures.push('comparison lacks a finite 95% confidence interval, so the run resolution cannot be assessed');
    } else if (upper - lower > maxIntervalWidthPercentPoints) {
      failures.push(
        `inconclusive: 95% confidence interval width ${(upper - lower).toFixed(2)}pp exceeds ${maxIntervalWidthPercentPoints.toFixed(2)}pp — increase sample rounds until the run can resolve the +${maxRegressionPercent.toFixed(2)}% budget`,
      );
    }
  }

  return { failures, maxIntervalWidthPercentPoints, maxRegressionPercent, passed: failures.length === 0 };
}
