function formatSignedPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function evaluateComparisonGates(comparisons, gates) {
  const seen = new Set();
  const evaluations = {};
  const failures = [];

  for (const gate of gates) {
    if (seen.has(gate.comparison)) throw new Error(`duplicate comparison gate: ${gate.comparison}`);
    seen.add(gate.comparison);

    const comparison = comparisons[gate.comparison];
    if (!comparison) throw new Error(`comparison gate references an unknown comparison: ${gate.comparison}`);
    const upperBound = comparison.confidenceInterval95?.[1];
    if (!Number.isFinite(upperBound)) {
      throw new Error(`comparison gate received an invalid confidence interval: ${gate.comparison}`);
    }
    if (!Number.isFinite(gate.maxUpperBoundPercent)) {
      throw new Error(`comparison gate has an invalid upper-bound threshold: ${gate.comparison}`);
    }

    const gateFailures = [];
    if (upperBound > gate.maxUpperBoundPercent) {
      gateFailures.push(
        `${gate.comparison}: 95% confidence interval upper bound ${formatSignedPercent(upperBound)} exceeds ${formatSignedPercent(gate.maxUpperBoundPercent)}`,
      );
    }
    failures.push(...gateFailures);
    evaluations[gate.comparison] = {
      comparison: gate.comparison,
      failures: gateFailures,
      label: comparison.label,
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
    '| Comparison | 95% CI upper bound | Allowed upper bound | Status |',
    '| --- | ---: | ---: | --- |',
  ];
  Object.values(evaluation.evaluations).forEach((gate) => {
    lines.push(
      `| ${gate.label} (\`${gate.comparison}\`) | ${formatSignedPercent(gate.upperBound)} | ≤ ${formatSignedPercent(gate.maxUpperBoundPercent)} | ${gate.passed ? 'passed' : 'FAILED'} |`,
    );
  });
  lines.push('');
  return lines.join('\n');
}
