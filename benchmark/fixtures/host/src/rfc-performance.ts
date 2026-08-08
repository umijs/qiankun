import { prepareEsmLexer, rewriteModule } from '../../../../packages/shared';
import { Membrane } from '../../../../packages/sandbox/src/core/membrane';

type RfcPerformanceMetric = 'membrane-get' | 'membrane-set' | 'module-rewrite';

interface RfcPerformanceMeasurement {
  bytesPerOperation: number | null;
  checksum: number;
  duration: number;
  iterations: number;
  metric: RfcPerformanceMetric;
}

const membraneProperty = 'qiankunBenchmarkValue';
const membrane = new Membrane(window, {});
const membraneRecord = membrane as unknown as Record<string, unknown>;
// Baseline-snapshot compatibility: the same fixture bundle is executed against both the
// candidate revision and the pre-rename baseline snapshot, where the membrane view was
// still exposed as `realmGlobal`. This is the single sanctioned use of the retired name
// in the repo (see the compartment-alignment RFC's rename-verification note).
const membraneView = membraneRecord['globalThisView'] ?? membraneRecord['realmGlobal'];
if (!membraneView || (typeof membraneView !== 'object' && typeof membraneView !== 'function')) {
  throw new TypeError('membrane global view is unavailable');
}
const membraneGlobal = membraneView as Record<string, unknown>;
membraneGlobal[membraneProperty] = 1;

const globalsBaseSet = new Set(['console', 'document', 'fetch', 'location', 'window']);
const moduleSource = Array.from(
  { length: 96 },
  (_, index) => `
import { value as dependency${index} } from './dependency-${index}.js';
export const value${index} = dependency${index} + window.location.href.length + document.title.length;
export async function load${index}() {
  console.debug(location.href);
  return import('./lazy-${index}.js');
}
`,
).join('');
const moduleBytes = new TextEncoder().encode(moduleSource).byteLength;
const lexerReady = prepareEsmLexer();

function assertIterations(iterations: number): void {
  if (!Number.isInteger(iterations) || iterations <= 0) {
    throw new TypeError('iterations must be a positive integer');
  }
}

function measureMembraneGet(iterations: number): RfcPerformanceMeasurement {
  let checksum = 0;
  const startedAt = performance.now();
  for (let index = 0; index < iterations; index += 1) {
    checksum += membraneGlobal[membraneProperty] as number;
  }
  const duration = performance.now() - startedAt;
  return { bytesPerOperation: null, checksum, duration, iterations, metric: 'membrane-get' };
}

function measureMembraneSet(iterations: number): RfcPerformanceMeasurement {
  const startedAt = performance.now();
  for (let index = 0; index < iterations; index += 1) {
    membraneGlobal[membraneProperty] = index;
  }
  const duration = performance.now() - startedAt;
  const checksum = membraneGlobal[membraneProperty] as number;
  return { bytesPerOperation: null, checksum, duration, iterations, metric: 'membrane-set' };
}

function measureModuleRewrite(iterations: number): RfcPerformanceMeasurement {
  let checksum = 0;
  const startedAt = performance.now();
  for (let index = 0; index < iterations; index += 1) {
    const result = rewriteModule({
      globalsBaseSet,
      instanceKey: '__qk_benchmark__',
      resolveSpecifier: (specifier, baseUrl) => new URL(specifier, baseUrl).href,
      source: moduleSource,
      url: 'https://benchmark.local/src/entry.js',
    });
    checksum += result.code.length + result.deps.length + result.destructured.length;
  }
  const duration = performance.now() - startedAt;
  return {
    bytesPerOperation: moduleBytes,
    checksum,
    duration,
    iterations,
    metric: 'module-rewrite',
  };
}

window.__RFC_PERFORMANCE__ = {
  async run(metric, iterations) {
    assertIterations(iterations);
    await lexerReady;
    if (metric === 'membrane-get') return measureMembraneGet(iterations);
    if (metric === 'membrane-set') return measureMembraneSet(iterations);
    if (metric === 'module-rewrite') return measureModuleRewrite(iterations);
    throw new TypeError(`unknown RFC performance metric: ${String(metric)}`);
  },
};

declare global {
  interface Window {
    __RFC_PERFORMANCE__: {
      run(metric: RfcPerformanceMetric, iterations: number): Promise<RfcPerformanceMeasurement>;
    };
  }
}
