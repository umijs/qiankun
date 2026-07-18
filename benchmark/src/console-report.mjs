const ANSI_PATTERN = /\u001B\[[0-9;]*m/gu;
const HEADER_WIDTH = 96;

export function createColorizer(enabled) {
  const paint = (code) => (text) => (enabled ? `\u001B[${code}m${text}\u001B[0m` : text);
  return {
    bold: paint('1'),
    dim: paint('2'),
    green: paint('32'),
    red: paint('31'),
    yellow: paint('33'),
  };
}

export function visibleWidth(text) {
  return text.replace(ANSI_PATTERN, '').length;
}

function padCell(text, width, align) {
  const padding = ' '.repeat(Math.max(0, width - visibleWidth(text)));
  return align === 'right' ? padding + text : text + padding;
}

export function renderTable({ columns, rows }) {
  const widths = columns.map((column, index) =>
    Math.max(visibleWidth(column.title), ...rows.map((row) => visibleWidth(row[index]))),
  );
  const border = (left, middle, right) => left + widths.map((width) => '─'.repeat(width + 2)).join(middle) + right;
  const renderRow = (cells) =>
    `│ ${cells.map((cell, index) => padCell(cell, widths[index], columns[index].align)).join(' │ ')} │`;
  return [
    border('┌', '┬', '┐'),
    renderRow(columns.map((column) => column.title)),
    border('├', '┼', '┤'),
    ...rows.map(renderRow),
    border('└', '┴', '┘'),
  ].join('\n');
}

export function comparisonVerdict(comparison) {
  const [lower, upper] = comparison.confidenceInterval95;
  if (upper < 0) return 'faster';
  if (lower > 0) return 'slower';
  return 'unsure';
}

function formatSignedPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function formatMs(value) {
  return Number.isFinite(value) ? value.toFixed(2) : 'n/a';
}

export function formatDuration(durationMs) {
  const totalSeconds = Math.round(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function sectionHeading(title, passed, colors) {
  const status = passed ? colors.green('passed') : colors.red('FAILED');
  const label = ` ${colors.bold(title)} `;
  const suffix = ` ${status} ──`;
  const fillerWidth = Math.max(3, HEADER_WIDTH - visibleWidth(`──${label}${suffix}`));
  return `──${label}${'─'.repeat(fillerWidth)}${suffix}`;
}

function renderCalibrationLine(run, colors) {
  const comparison = run.calibration?.report?.comparisons?.['aa-calibration'];
  if (!comparison) return null;
  const evaluation = run.calibration.evaluation;
  const gate = run.metadata?.options?.calibrationGate ? 'gate enforced' : 'gate disabled (not performance evidence)';
  const status = evaluation?.passed ? colors.green('passed') : colors.red('failed');
  const [lower, upper] = comparison.confidenceInterval95;
  return `A/A calibration: ${formatSignedPercent(comparison.relativeDeltaPercent)} · 95% CI ${formatSignedPercent(lower)} to ${formatSignedPercent(upper)} · ${gate} · ${status}`;
}

function renderVariantsTable(report) {
  return renderTable({
    columns: [
      { align: 'left', title: 'Variant' },
      { align: 'right', title: 'n' },
      { align: 'right', title: 'Median (ms)' },
      { align: 'right', title: 'Mean (ms)' },
      { align: 'right', title: 'p95 (ms)' },
      { align: 'right', title: 'MAD (ms)' },
    ],
    rows: Object.values(report.variants).map((variant) => {
      const summary = variant.summary;
      return [
        variant.label,
        String(summary?.count ?? 0),
        formatMs(summary?.median),
        formatMs(summary?.mean),
        formatMs(summary?.p95),
        formatMs(summary?.mad),
      ];
    }),
  });
}

function renderComparisonsTable(report, colors) {
  const verdictColor = { faster: colors.green, slower: colors.red, unsure: colors.yellow };
  return renderTable({
    columns: [
      { align: 'left', title: 'Comparison (candidate vs reference)' },
      { align: 'right', title: 'Δ median' },
      { align: 'right', title: '95% CI' },
      { align: 'left', title: 'Verdict' },
    ],
    rows: Object.values(report.comparisons).map((comparison) => {
      const verdict = comparisonVerdict(comparison);
      const [lower, upper] = comparison.confidenceInterval95;
      return [
        comparison.label,
        verdictColor[verdict](formatSignedPercent(comparison.relativeDeltaPercent)),
        `${formatSignedPercent(lower)} to ${formatSignedPercent(upper)}`,
        verdictColor[verdict](verdict),
      ];
    }),
  });
}

function renderSuiteSection(result, colors) {
  const { artifactsDir, exitCode, loadError, run, title } = result;
  const passed = exitCode === 0 && run?.passed === true;
  const lines = [sectionHeading(title, passed, colors), ''];
  if (!run) {
    lines.push(`  ${colors.red(loadError ?? `runner exited with code ${exitCode} before writing results`)}`, '');
    return lines.join('\n');
  }
  if (run.fatalError) {
    lines.push(`  ${colors.red(`fatal: ${run.fatalError.split('\n')[0]}`)}`, '');
  }
  const calibrationLine = renderCalibrationLine(run, colors);
  if (calibrationLine) lines.push(`  ${calibrationLine}`, '');
  const report = run.product?.report;
  if (report) {
    lines.push(indent(renderVariantsTable(report)), '', indent(renderComparisonsTable(report, colors)), '');
  } else {
    lines.push(`  ${colors.red('no complete product report was produced')}`, '');
  }
  if (artifactsDir) lines.push(`  ${colors.dim(`artifacts: ${artifactsDir}`)}`, '');
  return lines.join('\n');
}

function indent(block) {
  return block
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
}

export function renderBenchReport({ colorize = false, durationMs, profile, results }) {
  const colors = createColorizer(colorize);
  const firstRun = results.find((result) => result.run)?.run;
  const passedCount = results.filter((result) => result.exitCode === 0 && result.run?.passed === true).length;
  const headerLines = [colors.bold('qiankun unified benchmark')];
  const metadata = firstRun?.metadata;
  if (metadata) {
    const { commit, dirty, browserVersion, options } = metadata;
    headerLines.push(
      `commit ${commit?.slice(0, 8) ?? 'unknown'}${dirty ? ' (dirty)' : ''} · Chromium ${browserVersion ?? 'unknown'} · profile ${profile} · ${options?.trials ?? '?'} trial(s) × ${options?.samples ?? '?'} samples per cell`,
    );
  } else {
    headerLines.push(`profile ${profile}`);
  }
  headerLines.push(
    'Positive deltas mean the candidate is slower than the reference; verdicts come from the paired-bootstrap 95% CI.',
  );
  const sections = results.map((result) => renderSuiteSection(result, colors));
  const summaryStatus = passedCount === results.length ? colors.green : colors.red;
  const footer = `${summaryStatus(`${passedCount}/${results.length} suites passed`)} · total ${formatDuration(durationMs)}`;
  return [...headerLines, '', ...sections, footer].join('\n');
}
