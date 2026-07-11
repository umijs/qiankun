import { comparePairedSamples, summarize } from './stats.mjs';

function formatSignedPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function buildReport({ comparisons, samples, seed, variants }) {
  const variantReports = {};
  for (const variant of variants) {
    const matching = samples.filter((sample) => sample.variant === variant.id);
    const valid = matching.filter((sample) => sample.valid);
    variantReports[variant.id] = {
      invalidCount: matching.length - valid.length,
      label: variant.label,
      summary: valid.length === 0 ? null : summarize(valid.map((sample) => sample.duration)),
    };
  }

  const comparisonReports = {};
  comparisons.forEach((comparison, comparisonIndex) => {
    const referenceByRound = new Map(
      samples
        .filter((sample) => sample.valid && sample.variant === comparison.reference)
        .map((sample) => [sample.round, sample.duration]),
    );
    const candidateByRound = new Map(
      samples
        .filter((sample) => sample.valid && sample.variant === comparison.candidate)
        .map((sample) => [sample.round, sample.duration]),
    );
    const pairedRounds = [...referenceByRound.keys()].filter((round) => candidateByRound.has(round));
    const measured = comparePairedSamples(
      pairedRounds.map((round) => referenceByRound.get(round)),
      pairedRounds.map((round) => candidateByRound.get(round)),
      { seed: seed + comparisonIndex },
    );
    comparisonReports[comparison.id] = {
      ...measured,
      candidate: comparison.candidate,
      label: comparison.label,
      pairedCount: pairedRounds.length,
      reference: comparison.reference,
    };
  });

  return { comparisons: comparisonReports, variants: variantReports };
}

export function renderSummaryMarkdown(report, { headingLevel = 1, title }) {
  if (!Number.isInteger(headingLevel) || headingLevel < 1 || headingLevel > 5) {
    throw new Error('headingLevel must be an integer from 1 to 5');
  }
  const heading = '#'.repeat(headingLevel);
  const sectionHeading = `${heading}#`;
  const lines = [
    `${heading} ${title}`,
    '',
    `${sectionHeading} Variants`,
    '',
    '| Variant | Valid | Invalid | Median (ms) | p95 (ms) | MAD (ms) |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
  ];

  Object.values(report.variants).forEach((variant) => {
    const summary = variant.summary;
    lines.push(
      `| ${variant.label} | ${summary?.count ?? 0} | ${variant.invalidCount} | ${summary ? summary.median.toFixed(2) : 'n/a'} | ${summary ? summary.p95.toFixed(2) : 'n/a'} | ${summary ? summary.mad.toFixed(2) : 'n/a'} |`,
    );
  });

  lines.push(
    '',
    `${sectionHeading} Comparisons`,
    '',
    '| Comparison | Relative delta | 95% CI | Paired samples |',
    '| --- | ---: | ---: | ---: |',
  );
  Object.values(report.comparisons).forEach((comparison) => {
    const [lower, upper] = comparison.confidenceInterval95;
    lines.push(
      `| ${comparison.label} | ${formatSignedPercent(comparison.relativeDeltaPercent)} | ${formatSignedPercent(lower)} to ${formatSignedPercent(upper)} | ${comparison.pairedCount} |`,
    );
  });

  lines.push('');
  return lines.join('\n');
}
