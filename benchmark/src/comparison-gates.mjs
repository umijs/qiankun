function formatSignedPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function formatSignedMs(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}ms`;
}

/**
 * A gate may bound the relative delta (maxUpperBoundPercent), the absolute paired delta in
 * milliseconds (maxUpperBoundMs), or both. The percentage bound guards proportional regressions;
 * the millisecond bound guards the fixed constant cost that a small fixture would otherwise
 * disguise inside the percentage — both are judged on 95% confidence-interval upper bounds.
 */
export function evaluateComparisonGates(comparisons, gates) {
  const seen = new Set();
  const evaluations = {};
  const failures = [];

  for (const gate of gates) {
    if (seen.has(gate.comparison)) throw new Error(`duplicate comparison gate: ${gate.comparison}`);
    seen.add(gate.comparison);

    const comparison = comparisons[gate.comparison];
    if (!comparison) throw new Error(`comparison gate references an unknown comparison: ${gate.comparison}`);
    const hasPercentBound = gate.maxUpperBoundPercent !== undefined;
    const hasAbsoluteBound = gate.maxUpperBoundMs !== undefined;
    if (!hasPercentBound && !hasAbsoluteBound) {
      throw new Error(`comparison gate defines no upper-bound threshold: ${gate.comparison}`);
    }
    if (hasPercentBound && !Number.isFinite(gate.maxUpperBoundPercent)) {
      throw new Error(`comparison gate has an invalid upper-bound threshold: ${gate.comparison}`);
    }
    if (hasAbsoluteBound && !Number.isFinite(gate.maxUpperBoundMs)) {
      throw new Error(`comparison gate has an invalid absolute upper-bound threshold: ${gate.comparison}`);
    }

    const upperBound = comparison.confidenceInterval95?.[1];
    if (hasPercentBound && !Number.isFinite(upperBound)) {
      throw new Error(`comparison gate received an invalid confidence interval: ${gate.comparison}`);
    }
    const absoluteUpperBoundMs = comparison.absoluteDeltaConfidenceInterval95Ms?.[1];
    if (hasAbsoluteBound && !Number.isFinite(absoluteUpperBoundMs)) {
      throw new Error(`comparison gate received an invalid absolute confidence interval: ${gate.comparison}`);
    }

    const gateFailures = [];
    if (hasPercentBound && upperBound > gate.maxUpperBoundPercent) {
      gateFailures.push(
        `${gate.comparison}: 95% confidence interval upper bound ${formatSignedPercent(upperBound)} exceeds ${formatSignedPercent(gate.maxUpperBoundPercent)}`,
      );
    }
    if (hasAbsoluteBound && absoluteUpperBoundMs > gate.maxUpperBoundMs) {
      gateFailures.push(
        `${gate.comparison}: absolute 95% confidence interval upper bound ${formatSignedMs(absoluteUpperBoundMs)} exceeds ${formatSignedMs(gate.maxUpperBoundMs)}`,
      );
    }
    failures.push(...gateFailures);
    evaluations[gate.comparison] = {
      absoluteUpperBoundMs,
      comparison: gate.comparison,
      failures: gateFailures,
      label: comparison.label,
      maxUpperBoundMs: gate.maxUpperBoundMs,
      maxUpperBoundPercent: gate.maxUpperBoundPercent,
      passed: gateFailures.length === 0,
      upperBound,
    };
  }

  return { evaluations, failures, passed: failures.length === 0 };
}

export function renderComparisonGateSummary(evaluation) {
  const lines = [
    '## Performance budgets',
    '',
    '| Comparison | 95% CI upper bound | Allowed | Absolute upper bound | Allowed absolute | Status |',
    '| --- | ---: | ---: | ---: | ---: | --- |',
  ];
  Object.values(evaluation.evaluations).forEach((gate) => {
    const percentCells =
      gate.maxUpperBoundPercent !== undefined
        ? `${formatSignedPercent(gate.upperBound)} | ≤ ${formatSignedPercent(gate.maxUpperBoundPercent)}`
        : '— | —';
    const absoluteCells =
      gate.maxUpperBoundMs !== undefined
        ? `${formatSignedMs(gate.absoluteUpperBoundMs)} | ≤ ${formatSignedMs(gate.maxUpperBoundMs)}`
        : '— | —';
    lines.push(
      `| ${gate.label} (\`${gate.comparison}\`) | ${percentCells} | ${absoluteCells} | ${gate.passed ? 'passed' : 'FAILED'} |`,
    );
  });
  lines.push('');
  return lines.join('\n');
}
