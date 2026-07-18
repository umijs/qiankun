import { comparePairedTrials, summarize } from './stats.mjs';

function formatSignedPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function indexByRound(samples, comparisonId, trial, role) {
  const byRound = new Map();
  for (const sample of samples) {
    if (byRound.has(sample.round)) {
      throw new Error(`${comparisonId} trial ${trial} has duplicate ${role} round ${sample.round}`);
    }
    byRound.set(sample.round, sample.duration);
  }
  return byRound;
}

function summarizeMetric(samples, select) {
  const values = samples.map(select).filter((value) => Number.isFinite(value));
  return values.length > 0 ? summarize(values) : null;
}

function buildPhaseDiagnostics(samples) {
  return {
    entryResponseEndDuration: summarizeMetric(samples, (sample) => sample.entryResponseEndDuration),
    paintLeadBeforeResponseEnd: summarizeMetric(samples, (sample) =>
      Number.isFinite(sample.entryResponseEndDuration) ? sample.entryResponseEndDuration - sample.duration : null,
    ),
    settledDuration: summarizeMetric(samples, (sample) => sample.settledDuration),
  };
}

export function buildReport({ comparisons, samples, seed, variants }) {
  const variantReports = {};
  for (const variant of variants) {
    const matching = samples.filter((sample) => sample.variant === variant.id);
    const valid = matching.filter((sample) => sample.valid);
    const trialIds = [...new Set(valid.map((sample) => sample.trial ?? 0))].sort((left, right) => left - right);
    variantReports[variant.id] = {
      diagnostics: buildPhaseDiagnostics(valid),
      invalidCount: matching.length - valid.length,
      label: variant.label,
      summary: valid.length === 0 ? null : summarize(valid.map((sample) => sample.duration)),
      trialSummaries: trialIds.map((trial) => ({
        summary: summarize(valid.filter((sample) => (sample.trial ?? 0) === trial).map((sample) => sample.duration)),
        trial,
      })),
    };
  }

  const comparisonReports = {};
  comparisons.forEach((comparison, comparisonIndex) => {
    const validComparisonSamples = samples.filter(
      (sample) => sample.valid && (sample.variant === comparison.reference || sample.variant === comparison.candidate),
    );
    const trialIds = [...new Set(validComparisonSamples.map((sample) => sample.trial ?? 0))].sort(
      (left, right) => left - right,
    );
    const pairedTrials = trialIds.flatMap((trial) => {
      const trialSamples = validComparisonSamples.filter((sample) => (sample.trial ?? 0) === trial);
      const referenceByRound = indexByRound(
        trialSamples.filter((sample) => sample.variant === comparison.reference),
        comparison.id,
        trial,
        'reference',
      );
      const candidateByRound = indexByRound(
        trialSamples.filter((sample) => sample.variant === comparison.candidate),
        comparison.id,
        trial,
        'candidate',
      );
      const pairedRounds = [...referenceByRound.keys()].filter((round) => candidateByRound.has(round));
      if (referenceByRound.size !== candidateByRound.size || pairedRounds.length !== referenceByRound.size) {
        throw new Error(`${comparison.id} trial ${trial} has unpaired rounds`);
      }
      if (pairedRounds.length === 0) return [];
      pairedRounds.sort((left, right) => left - right);
      return [
        {
          candidate: pairedRounds.map((round) => candidateByRound.get(round)),
          reference: pairedRounds.map((round) => referenceByRound.get(round)),
        },
      ];
    });
    const measured = comparePairedTrials(pairedTrials, { seed: seed + comparisonIndex });
    comparisonReports[comparison.id] = {
      ...measured,
      candidate: comparison.candidate,
      label: comparison.label,
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

  const hasPhaseDiagnostics = Object.values(report.variants).some((variant) =>
    Object.values(variant.diagnostics).some(Boolean),
  );
  if (hasPhaseDiagnostics) {
    lines.push(
      '',
      `${sectionHeading} Phase diagnostics`,
      '',
      '> Paint lead is HTML response end minus core paint; positive values prove the core painted before the full response completed.',
      '',
      '| Variant | Mount settled median (ms) | HTML response end median (ms) | Paint lead median (ms) |',
      '| --- | ---: | ---: | ---: |',
    );
    Object.values(report.variants).forEach((variant) => {
      const diagnostics = variant.diagnostics;
      lines.push(
        `| ${variant.label} | ${diagnostics.settledDuration?.median.toFixed(2) ?? 'n/a'} | ${diagnostics.entryResponseEndDuration?.median.toFixed(2) ?? 'n/a'} | ${diagnostics.paintLeadBeforeResponseEnd?.median.toFixed(2) ?? 'n/a'} |`,
      );
    });
  }

  lines.push(
    '',
    `${sectionHeading} Comparisons`,
    '',
    '| Comparison | Relative delta | 95% CI | Trials | Paired samples |',
    '| --- | ---: | ---: | ---: | ---: |',
  );
  Object.values(report.comparisons).forEach((comparison) => {
    const [lower, upper] = comparison.confidenceInterval95;
    lines.push(
      `| ${comparison.label} | ${formatSignedPercent(comparison.relativeDeltaPercent)} | ${formatSignedPercent(lower)} to ${formatSignedPercent(upper)} | ${comparison.trialCount} | ${comparison.pairedCount} |`,
    );
  });

  lines.push('');
  return lines.join('\n');
}
