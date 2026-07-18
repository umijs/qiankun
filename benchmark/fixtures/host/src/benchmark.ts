export interface BenchmarkOptions {
  entry: string;
  frameworkOptions: Record<string, unknown>;
  timeoutMs: number;
}

export interface BenchmarkMeasurement {
  cleaned: boolean;
  duration: number;
  entryResponseEndDuration: number | null;
  settled: boolean;
  settledDuration: number;
  t0: number;
  t1: number;
}

export interface BenchmarkMountHandle {
  cleanup(): Promise<void>;
  settled: Promise<void>;
}

type MountMicroApp = (options: BenchmarkOptions, container: HTMLElement) => BenchmarkMountHandle;

export interface BenchmarkPaintObserver {
  assertMounted(): void;
  prepare?(options: BenchmarkOptions): void;
  waitForPaint(t0: number, options: BenchmarkOptions): Promise<number>;
}

export type FindCoreElement = () => HTMLElement | null;

const findDirectCoreElement: FindCoreElement = () => document.querySelector<HTMLElement>('#benchmark-core');

function isPaintable(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    element.querySelector('[data-benchmark-critical]') !== null &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    style.getPropertyValue('--benchmark-style-ready').trim() === '1'
  );
}

function getEntryResponseEndDuration(entry: string, t0: number): number | null {
  const timing = performance.getEntriesByName(entry, 'resource').at(-1);
  if (!(timing instanceof PerformanceResourceTiming)) return null;
  const duration = timing.responseEnd - t0;
  return Number.isFinite(duration) && duration >= 0 ? duration : null;
}

function waitForDomPaint(t0: number, timeoutMs: number, findCoreElement: FindCoreElement): Promise<number> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('core element paint timed out')), timeoutMs);

    const check = () => {
      const core = findCoreElement();
      if (!core || !isPaintable(core)) {
        requestAnimationFrame(check);
        return;
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const paintedCore = findCoreElement();
          if (!paintedCore || !isPaintable(paintedCore)) {
            requestAnimationFrame(check);
            return;
          }
          window.clearTimeout(timeout);
          resolve(performance.now() - t0);
        });
      });
    };

    requestAnimationFrame(check);
  });
}

export function createDomPaintObserver(
  findCoreElement: FindCoreElement = findDirectCoreElement,
): BenchmarkPaintObserver {
  return {
    assertMounted() {
      const mountedCore = findCoreElement();
      if (mountedCore?.dataset.mounted !== 'true') {
        throw new Error('micro app settled without mounting its core element');
      }
    },
    waitForPaint(t0, options) {
      return waitForDomPaint(t0, options.timeoutMs, findCoreElement);
    },
  };
}

export function installBenchmark(
  mountMicroApp: MountMicroApp,
  paintObserver: BenchmarkPaintObserver = createDomPaintObserver(),
): void {
  window.__BENCHMARK__ = {
    async run(options) {
      const container = document.querySelector<HTMLElement>('#micro-app-container');
      if (!container) throw new Error('micro app container is missing');
      container.replaceChildren();

      paintObserver.prepare?.(options);
      const t0 = performance.now();
      const handle = mountMicroApp(options, container);
      const paintPromise = paintObserver.waitForPaint(t0, options);
      const settledPromise = handle.settled.then(() => performance.now() - t0);
      let duration: number;
      let settledDuration: number;
      try {
        [duration, settledDuration] = await Promise.all([paintPromise, settledPromise]);
        paintObserver.assertMounted();
      } finally {
        await handle.cleanup();
        if (container.childNodes.length > 0) {
          throw new Error('framework adapter cleanup left nodes in the micro app container');
        }
      }
      return {
        cleaned: true,
        duration,
        entryResponseEndDuration: getEntryResponseEndDuration(options.entry, t0),
        settled: true,
        settledDuration,
        t0,
        t1: t0 + duration,
      };
    },
  };
}

declare global {
  interface Window {
    __BENCHMARK__: {
      run(options: BenchmarkOptions): Promise<BenchmarkMeasurement>;
    };
  }
}
