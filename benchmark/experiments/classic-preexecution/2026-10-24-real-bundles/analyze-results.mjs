import { readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { comparePairedTrials, summarize, evaluateCalibration } from './stats.mjs';
const root = dirname(fileURLToPath(import.meta.url));
const dir = resolve(
  root,
  process.argv[2] ||
    (await readdir(root))
      .filter((s) => s.startsWith('formal-'))
      .sort()
      .at(-1),
);
const status = JSON.parse(await readFile(`${dir}/status.json`, 'utf8'));
assert.equal(status.completed, true);
const samples = (await readFile(`${dir}/samples.jsonl`, 'utf8')).trim().split('\n').map(JSON.parse);
assert.equal(samples.length, 792);
assert.equal(samples.filter((s) => !s.warmup).length, 720);
for (const s of samples) {
  assert.equal(s.executions, 1);
  assert.equal(s.preparationExecutions, 0);
  assert.equal(s.hostPolluted, false);
  assert.equal(s.cleanupPassed, true);
  assert.equal(s.trustedInput, true);
  assert.equal(s.factoryHit, s.arm === 'factory');
  assert.equal(s.prepareStateAtActivation, 'ready');
  assert.equal(s.requests, 2);
  const marks = Object.fromEntries(s.phaseMarks.map((m) => [m.name, m.startTime]));
  s.activationToBusinessMs = marks['business-start'] - marks['activation-start'];
  s.businessToMountMs = marks['mount-end'] - marks['business-start'];
  s.preparationToPaintMs = s.actualLeadMs + s.activationPaintMs;
  assert.ok(s.activationPaintMs >= s.activationMountMs);
  if (s.arm === 'factory') assert.ok(marks['registration-end'] < marks['activation-start']);
}
const output = [];
for (const cpu of [1, 4])
  for (const workload of ['react-cytoscape', 'mermaid']) {
    const cell = samples.filter((s) => !s.warmup && s.cpu === cpu && s.workload === workload);
    for (const trial of [0, 1, 2])
      for (const arm of ['a', 'b', 'factory'])
        assert.equal(cell.filter((s) => s.trial === trial && s.arm === arm).length, 20);
    const row = { cpu, workload, arms: {}, comparisons: {}, calibration: {} };
    const metrics = [
      'activationMountMs',
      'activationPaintMs',
      'activationToBusinessMs',
      'businessMs',
      'renderMs',
      'businessToMountMs',
      'prepareMs',
      'registrationMs',
      'actualLeadMs',
      'hostPaintMs',
      'interactionDelayMs',
      'peakHeapBytes',
      'heapAfterUnmountBytes',
      'preparationToPaintMs',
    ];
    for (const arm of ['a', 'b', 'factory'])
      row.arms[arm] = Object.fromEntries(
        metrics.map((metric) => [metric, summarize(cell.filter((s) => s.arm === arm).map((s) => s[metric]))]),
      );
    for (const metric of metrics.filter((m) => m !== 'registrationMs')) {
      const paired = (arm) =>
        [0, 1, 2].map((trial) => ({
          reference: cell
            .filter((s) => s.trial === trial && s.arm === 'a')
            .sort((a, b) => a.round - b.round)
            .map((s) => s[metric]),
          candidate: cell
            .filter((s) => s.trial === trial && s.arm === arm)
            .sort((a, b) => a.round - b.round)
            .map((s) => s[metric]),
        }));
      row.comparisons[metric] = comparePairedTrials(paired('factory'), { seed: 20261024 });
      if (metric.startsWith('activation') && !metric.includes('Business')) {
        const c = comparePairedTrials(paired('b'), { seed: 20261024 });
        row.calibration[metric] = { ...c, ...evaluateCalibration(c) };
      }
    }
    row.performanceEvidenceValid = Object.values(row.calibration).every((c) => c.passed);
    output.push(row);
  }
await writeFile(
  `${dir}/analysis.json`,
  JSON.stringify(
    { validated: true, rawSamples: samples.length, measuredSamples: 720, warmups: 72, results: output },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    output.map((r) => ({
      cpu: r.cpu,
      workload: r.workload,
      valid: r.performanceEvidenceValid,
      AA: r.calibration,
      mount: r.comparisons.activationMountMs,
      paint: r.comparisons.activationPaintMs,
      preBusiness: r.comparisons.activationToBusinessMs,
      business: r.comparisons.businessMs,
      prepareMedians: [r.arms.a.prepareMs.median, r.arms.factory.prepareMs.median],
      heapMedians: [r.arms.a.peakHeapBytes.median, r.arms.factory.peakHeapBytes.median],
    })),
    null,
    2,
  ),
);
