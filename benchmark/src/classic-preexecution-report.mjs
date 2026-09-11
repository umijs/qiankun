import { comparePairedTrials, summarize } from './stats.mjs';

const VARIANTS = ['cold', 'fetch', 'factory'];
const SCENARIOS = ['ready', 'pending', 'miss'];
const TIMING_METRICS = ['activationMountMs', 'activationPaintMs', 'prepareMs', 'hostPaintMs', 'interactionDelayMs'];
const COMPARISON_METRICS = TIMING_METRICS.filter((metric) => metric !== 'prepareMs');
const INPUT_COMPARISON_METRICS = ['inputDelayMs', 'inputPaintMs'];
const DIAGNOSTIC_METRICS = [
  'actualLeadMs',
  'requests',
  'bytes',
  'serverRequests',
  ...INPUT_COMPARISON_METRICS,
  'inputAtMs',
];
const POSITIVE_METRICS = new Set(['activationMountMs', 'activationPaintMs', 'hostPaintMs']);
const COMPARISONS = [
  { candidate: 'fetch', primary: false, reference: 'cold' },
  { candidate: 'factory', primary: true, reference: 'fetch' },
  { candidate: 'factory', primary: false, reference: 'cold' },
];
const VARIANT_LABELS = { cold: '无预取', fetch: '仅资源预取', factory: '资源预取 + 工厂注册' };
const SCENARIO_LABELS = { ready: '准备完成后激活', pending: '准备中激活', miss: '未命中' };

function validateSample(sample, index) {
  const label = `sample ${index}`;
  if (!sample || typeof sample !== 'object') throw new Error(`${label} must be an object`);
  if (sample.error != null || sample.success === false || sample.failed === true) {
    throw new Error(`${label} records a failure; failed samples must not enter the summary`);
  }
  if (!VARIANTS.includes(sample.variant)) throw new Error(`${label} has an unknown variant`);
  if (!SCENARIOS.includes(sample.scenario)) throw new Error(`${label} has an unknown scenario`);
  for (const field of ['trial', 'round']) {
    if (!Number.isInteger(sample[field]) || sample[field] < 0) {
      throw new Error(`${label}.${field} must be a non-negative integer`);
    }
  }
  if (!Number.isInteger(sample.size) || sample.size <= 0) {
    throw new Error(`${label}.size must be a positive integer byte count`);
  }
  if (typeof sample.warmup !== 'boolean') throw new Error(`${label}.warmup must be a boolean`);
  for (const metric of TIMING_METRICS) {
    const positive = POSITIVE_METRICS.has(metric);
    if (!Number.isFinite(sample[metric]) || (positive ? sample[metric] <= 0 : sample[metric] < 0)) {
      throw new Error(`${label}.${metric} must be a ${positive ? 'positive' : 'non-negative'} finite number`);
    }
  }
  if (sample.peakHeapBytes !== null && (!Number.isFinite(sample.peakHeapBytes) || sample.peakHeapBytes < 0)) {
    throw new Error(`${label}.peakHeapBytes must be a non-negative finite number or explicit null`);
  }
  for (const metric of DIAGNOSTIC_METRICS) {
    if (sample[metric] != null && (!Number.isFinite(sample[metric]) || sample[metric] < 0)) {
      throw new Error(`${label}.${metric} must be a non-negative finite number when provided`);
    }
  }
  if (sample.factoryHit != null && typeof sample.factoryHit !== 'boolean') {
    throw new Error(`${label}.factoryHit must be a boolean when provided`);
  }
  if (sample.trustedInput != null && typeof sample.trustedInput !== 'boolean') {
    throw new Error(`${label}.trustedInput must be a boolean when provided`);
  }
  if (
    sample.prepareStateAtActivation != null &&
    (typeof sample.prepareStateAtActivation !== 'string' || !sample.prepareStateAtActivation)
  ) {
    throw new Error(`${label}.prepareStateAtActivation must be a non-empty string when provided`);
  }
}

function compareMetric(trials, seed) {
  const containsZero = trials.some(({ candidate, reference }) =>
    [...candidate, ...reference].some((value) => value === 0),
  );
  if (!containsZero) return comparePairedTrials(trials, { seed });

  // Translating both members of each pair leaves the absolute delta and its hierarchical
  // bootstrap unchanged. The shared helper requires positive inputs for its log ratios;
  // discard those translated ratios because they do not describe the measured values.
  const comparison = comparePairedTrials(
    trials.map(({ candidate, reference }) => ({
      candidate: candidate.map((value) => value + 1),
      reference: reference.map((value) => value + 1),
    })),
    { seed },
  );
  return {
    ...comparison,
    confidenceInterval95: null,
    relativeDeltaPercent: null,
    trialRelativeDeltas: null,
  };
}

export function summarizeClassicExperiment(samples, { seed = 20260912 } = {}) {
  if (!Array.isArray(samples) || samples.length === 0) throw new Error('at least one sample is required');
  if (!Number.isInteger(seed) || seed < 0) throw new Error('seed must be a non-negative integer');

  const pairs = new Map();
  samples.forEach((sample, index) => {
    validateSample(sample, index);
    const pairKey = JSON.stringify([sample.trial, sample.round, sample.warmup, sample.scenario, sample.size]);
    if (!pairs.has(pairKey)) pairs.set(pairKey, new Map());
    const pair = pairs.get(pairKey);
    if (pair.has(sample.variant)) throw new Error(`duplicate ${sample.variant} sample in pair ${pairKey}`);
    pair.set(sample.variant, sample);
  });
  for (const [pairKey, pair] of pairs) {
    const missing = VARIANTS.filter((variant) => !pair.has(variant));
    if (missing.length) throw new Error(`incomplete pair ${pairKey}: missing ${missing.join(', ')}`);
  }

  const measured = samples.filter(({ warmup }) => !warmup);
  if (!measured.length) throw new Error('at least one non-warmup sample is required');
  const inputComparisons = INPUT_COMPARISON_METRICS.filter((metric) =>
    measured.every((sample) => sample[metric] != null),
  );
  const groups = new Map();
  for (const sample of measured) {
    const groupKey = JSON.stringify([sample.scenario, sample.size]);
    if (!groups.has(groupKey)) groups.set(groupKey, { scenario: sample.scenario, size: sample.size, samples: [] });
    groups.get(groupKey).samples.push(sample);
  }

  const cells = [];
  const comparisons = [];
  const orderedGroups = [...groups.values()].sort(
    (left, right) => SCENARIOS.indexOf(left.scenario) - SCENARIOS.indexOf(right.scenario) || left.size - right.size,
  );
  for (const { scenario, size, samples: groupSamples } of orderedGroups) {
    const ordered = [...groupSamples].sort((left, right) => left.trial - right.trial || left.round - right.round);
    const trialIds = [...new Set(ordered.map(({ trial }) => trial))];
    for (const variant of VARIANTS) {
      const values = ordered.filter((sample) => sample.variant === variant);
      const heap = values.map(({ peakHeapBytes }) => peakHeapBytes).filter((value) => value !== null);
      const factoryHits = values.map(({ factoryHit }) => factoryHit).filter((value) => value != null);
      const trustedInputs = values.map(({ trustedInput }) => trustedInput).filter((value) => value != null);
      const prepareStates = new Map();
      for (const { prepareStateAtActivation: state } of values) {
        if (state != null) prepareStates.set(state, (prepareStates.get(state) ?? 0) + 1);
      }
      cells.push({
        diagnostics: Object.fromEntries(
          DIAGNOSTIC_METRICS.map((metric) => {
            const present = values.map((row) => row[metric]).filter((value) => value != null);
            return [metric, present.length ? summarize(present) : null];
          }),
        ),
        factoryHits: {
          count: factoryHits.length,
          hit: factoryHits.filter(Boolean).length,
          miss: factoryHits.filter((hit) => !hit).length,
        },
        heapMissingCount: values.length - heap.length,
        metrics: {
          ...Object.fromEntries(TIMING_METRICS.map((metric) => [metric, summarize(values.map((row) => row[metric]))])),
          peakHeapBytes: heap.length ? summarize(heap) : null,
        },
        prepareStates: Object.fromEntries([...prepareStates].sort(([left], [right]) => left.localeCompare(right))),
        sampleCount: values.length,
        scenario,
        size,
        trialCount: trialIds.length,
        trustedInputs: {
          count: trustedInputs.length,
          trusted: trustedInputs.filter(Boolean).length,
          untrusted: trustedInputs.filter((trusted) => !trusted).length,
        },
        variant,
      });
    }
    for (const { candidate, primary, reference } of COMPARISONS) {
      for (const metric of [...COMPARISON_METRICS, ...inputComparisons]) {
        const trials = trialIds.map((trial) => ({
          candidate: ordered
            .filter((row) => row.trial === trial && row.variant === candidate)
            .map((row) => row[metric]),
          reference: ordered
            .filter((row) => row.trial === trial && row.variant === reference)
            .map((row) => row[metric]),
        }));
        comparisons.push({
          candidate,
          metric,
          primary,
          reference,
          scenario,
          size,
          ...compareMetric(trials, seed),
        });
      }
    }
  }
  return {
    cells,
    comparisons,
    measuredSampleCount: measured.length,
    warmupSampleCount: samples.length - measured.length,
  };
}

function formatSize(size) {
  return size < 1024 * 1024 ? `${(size / 1024).toFixed(0)} KiB` : `${(size / 1024 / 1024).toFixed(0)} MiB`;
}

function formatDistribution(distribution, divisor = 1) {
  return distribution
    ? `${(distribution.median / divisor).toFixed(2)} / ${(distribution.p95 / divisor).toFixed(2)}`
    : '未提供';
}

function formatComparison(comparison) {
  const absolute = `${comparison.absoluteDeltaMs.toFixed(2)} [${comparison.absoluteDeltaConfidenceInterval95Ms.map((value) => value.toFixed(2)).join(', ')}] ms`;
  if (comparison.relativeDeltaPercent === null) return `${absolute}；比例不适用（含零值）`;
  return `${absolute}；${comparison.relativeDeltaPercent.toFixed(2)}% [${comparison.confidenceInterval95.map((value) => `${value.toFixed(2)}%`).join(', ')}]`;
}

function formatDiagnostic(distribution, divisor = 1) {
  return distribution ? `${formatDistribution(distribution, divisor)}（n=${distribution.count}）` : 'n/a';
}

export function renderClassicExperimentReport({ environment, options, fixtures, samples, summary }) {
  if (summary.measuredSampleCount + summary.warmupSampleCount !== samples.length) {
    throw new Error('summary sample counts do not match the raw samples');
  }
  const lines = [
    '### 运行环境与参数',
    '',
    '```json',
    JSON.stringify({ environment, options, fixtures }, null, 2),
    '```',
    '',
    `正式样本 ${summary.measuredSampleCount} 个，预热样本 ${summary.warmupSampleCount} 个。所有样本均先校验，再排除预热样本进行汇总；不剔除离群值或失败样本，发现失败即中止汇总。每个样本使用独立 BrowserContext，按 trial、round、场景和目标字节数配对。`,
    '',
    '下表给出 median / p95。激活耗时、准备耗时和主应用影响的单位为 ms；内存单位为 MiB。交互指标是任务调度延迟代理，不是 INP。内存是采样得到的 JavaScript 堆峰值，不是真实浏览器进程峰值；未提供的内存指标单独计数，不按零值计算。',
  ];
  if (summary.performanceEvidenceValid === false) {
    lines.push(
      '',
      '**性能证据无效：本次运行未通过有效性检查，不可据此判断性能或得出优化收益结论。下列数值仅供排查实验问题。**',
    );
  }
  if (summary.calibration) {
    lines.push(
      '',
      '### A/A 校准',
      '',
      '同一「仅资源预取」实现分别作为 A、B 两组，在独立 BrowserContext 中成对采样。差值为 B 减去 A，格式为绝对毫秒差及 95% 区间、比例变化及 95% 区间。',
      '',
      '| 指标 | 成对差值及区间 | 配对数 / trials | 校准结果 |',
      '| --- | --- | --- | --- |',
    );
    for (const [metric, label] of [
      ['activationMountMs', '激活 → mount'],
      ['activationPaintMs', '激活 → 核心首屏'],
    ]) {
      const calibration = summary.calibration[metric];
      if (!calibration) throw new Error(`missing calibration metric ${metric}`);
      const result = calibration.passed ? '通过' : `失败：${calibration.failures?.join('；') || '未提供失败原因'}`;
      lines.push(
        `| ${label} | ${formatComparison(calibration)} | ${calibration.pairedCount} / ${calibration.trialCount} | ${result} |`,
      );
    }
  }
  lines.push(
    '',
    '### 各组分布',
    '',
    '| 场景 | 目标大小 | 组别 | n / trials | 激活 → mount | 激活 → 核心首屏 | 准备耗时 | 主应用首屏 | 任务延迟 | 采样堆峰值（MiB） | 缺失内存样本 |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  );
  for (const cell of summary.cells) {
    lines.push(
      `| ${SCENARIO_LABELS[cell.scenario]} | ${formatSize(cell.size)} | ${VARIANT_LABELS[cell.variant]} | ${cell.sampleCount} / ${cell.trialCount} | ${TIMING_METRICS.map((metric) => formatDistribution(cell.metrics[metric])).join(' | ')} | ${formatDistribution(cell.metrics.peakHeapBytes, 1024 * 1024)} | ${cell.heapMissingCount} |`,
    );
  }

  lines.push(
    '',
    '### 受信输入诊断',
    '',
    `通过 CDP 注入受信任的 mousePressed 输入。runner 收到页面的实验启动通知后，按配置等待 ${options.inputDelayMs ?? '未提供'} ms，再发送输入；事件时间戳来自实际发出输入时的 Date.now。inputDelayMs 表示输入注入至处理的延迟，inputPaintMs 表示输入注入至两帧界面更新完成的耗时，inputAtMs 记录输入处理器接收事件时距页面实验起点的时间，包含通知传递、配置等待和输入排队的耗时。它们不是 Web Vitals INP，也不能替代真实用户交互的长周期采样。下表为 median / p95（ms），n 只计提供该指标的正式样本。`,
    '',
    '| 场景 | 目标大小 | 组别 | 输入处理延迟（ms） | 两帧更新耗时（ms） | 处理器接收时刻（ms） | 受信输入 / 已记录 |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  );
  for (const cell of summary.cells) {
    const inputs = cell.trustedInputs;
    lines.push(
      `| ${SCENARIO_LABELS[cell.scenario]} | ${formatSize(cell.size)} | ${VARIANT_LABELS[cell.variant]} | ${formatDiagnostic(cell.diagnostics.inputDelayMs)} | ${formatDiagnostic(cell.diagnostics.inputPaintMs)} | ${formatDiagnostic(cell.diagnostics.inputAtMs)} | ${inputs.count ? `${inputs.trusted} / ${inputs.count}` : 'n/a'} |`,
    );
  }

  lines.push(
    '',
    '### 激活时机与命中诊断',
    '',
    `三组使用共同的最低激活等待时间：准备完成后激活及未命中场景为 ${options.readyLeadMs ?? 'n/a'} ms，准备中激活场景为 ${options.pendingLeadMs ?? 'n/a'} ms。actualLeadMs 记录准备起点至实际激活的时间；准备完成及未命中场景还会等待准备结束，实际等待时间可能超过下限。`,
    '',
    '准备中激活的样本在激活时仍可能处于 fetching / registering，随后真正执行源码时工厂可能已经就绪；应结合实际工厂命中数解释结果。下表数值为 median / p95，n 只计提供该字段的正式样本。请求数及 body 字节数来自实验 fetch 路径；服务器请求数用于核对网络访问。工厂命中与准备状态仅统计提供该字段的样本，缺失字段不计作未命中。',
    '',
    '| 场景 | 目标大小 | 组别 | 实际等待（ms） | fetch 请求数 | body（KiB） | 服务器请求数 | 工厂命中 / 已记录 | 激活时准备状态分布 |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  );
  for (const cell of summary.cells) {
    const hits = cell.factoryHits;
    const states =
      Object.entries(cell.prepareStates)
        .map(([state, count]) => `${state}: ${count}`)
        .join('，') || 'n/a';
    lines.push(
      `| ${SCENARIO_LABELS[cell.scenario]} | ${formatSize(cell.size)} | ${VARIANT_LABELS[cell.variant]} | ${formatDiagnostic(cell.diagnostics.actualLeadMs)} | ${formatDiagnostic(cell.diagnostics.requests)} | ${formatDiagnostic(cell.diagnostics.bytes, 1024)} | ${formatDiagnostic(cell.diagnostics.serverRequests)} | ${hits.count ? `${hits.hit} / ${hits.count}` : 'n/a'} | ${states} |`,
    );
  }

  lines.push(
    '',
    '### 成对比较',
    '',
    '所有差值均为候选组减去参考组；正值表示候选组更慢，负值表示候选组更快。每格依次给出绝对毫秒差及其 95% 区间、比例变化及其 95% 区间。分层 bootstrap 先重采样 trial，再在 trial 内重采样配对 round，各 trial 权重相同。主比较为「工厂注册相对仅资源预取」，用于判断工厂注册本身的增量收益。',
  );
  for (const [label, metrics] of [
    ['激活收益', ['activationMountMs', 'activationPaintMs']],
    ['主应用影响', ['hostPaintMs', 'interactionDelayMs']],
  ]) {
    lines.push(
      '',
      `#### ${label}`,
      '',
      `| 场景 | 目标大小 | 候选组相对参考组 | ${label === '激活收益' ? '激活 → mount | 激活 → 核心首屏' : '主应用首屏 | 任务延迟'} |`,
      '| --- | --- | --- | --- | --- |',
    );
    for (const first of summary.comparisons.filter(({ metric }) => metric === metrics[0])) {
      const second = summary.comparisons.find(
        (row) =>
          row.scenario === first.scenario &&
          row.size === first.size &&
          row.reference === first.reference &&
          row.candidate === first.candidate &&
          row.metric === metrics[1],
      );
      if (!second) throw new Error(`missing comparison metric ${metrics[1]}`);
      lines.push(
        `| ${SCENARIO_LABELS[first.scenario]} | ${formatSize(first.size)} | ${VARIANT_LABELS[first.candidate]} 相对 ${VARIANT_LABELS[first.reference]}${first.primary ? '（主比较）' : ''} | ${formatComparison(first)} | ${formatComparison(second)} |`,
      );
    }
  }
  lines.push(
    '',
    '#### 受信输入影响',
    '',
    '每个输入指标仅在全部正式样本均提供数值时进行成对比较；缺失值不补零，也不删除缺失样本后缩小比较范围。差值方向与上述比较一致，正值表示候选组更慢。',
    '',
    '| 指标 | 场景 | 目标大小 | 候选组相对参考组 | 成对差值及区间 |',
    '| --- | --- | --- | --- | --- |',
  );
  for (const [metric, label] of [
    ['inputDelayMs', '输入处理延迟'],
    ['inputPaintMs', '两帧更新耗时'],
  ]) {
    const comparisons = summary.comparisons.filter((comparison) => comparison.metric === metric);
    if (!comparisons.length) {
      lines.push(`| ${label} | n/a | n/a | n/a | 正式样本未全部提供该指标，不作配对比较 |`);
      continue;
    }
    for (const comparison of comparisons) {
      lines.push(
        `| ${label} | ${SCENARIO_LABELS[comparison.scenario]} | ${formatSize(comparison.size)} | ${VARIANT_LABELS[comparison.candidate]} 相对 ${VARIANT_LABELS[comparison.reference]}${comparison.primary ? '（主比较）' : ''} | ${formatComparison(comparison)} |`,
      );
    }
  }
  return `${lines.join('\n')}\n`;
}
