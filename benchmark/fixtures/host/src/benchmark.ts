export interface BenchmarkOptions {
  entry: string;
  frameworkOptions: Record<string, unknown>;
  timeoutMs: number;
}

export interface BenchmarkMeasurement {
  duration: number;
  settled: boolean;
  t0: number;
  t1: number;
}

type StartMicroApp = (options: BenchmarkOptions) => Promise<void>;

export interface BenchmarkPaintObserver {
  assertMounted(): void;
  waitForPaint(t0: number, options: BenchmarkOptions): Promise<number>;
}

function findCoreElement(): HTMLElement | null {
  const direct = document.querySelector<HTMLElement>('#benchmark-core');
  if (direct) return direct;
  const wujieApp = document.querySelector('wujie-app');
  return wujieApp?.shadowRoot?.querySelector<HTMLElement>('#benchmark-core') ?? null;
}

function isPaintable(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    style.getPropertyValue('--benchmark-style-ready').trim() === '1'
  );
}

function waitForDomPaint(t0: number, timeoutMs: number): Promise<number> {
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

const domPaintObserver: BenchmarkPaintObserver = {
  assertMounted() {
    const mountedCore = findCoreElement();
    if (mountedCore?.dataset.mounted !== 'true') {
      throw new Error('micro app settled without mounting its core element');
    }
  },
  waitForPaint(t0, options) {
    return waitForDomPaint(t0, options.timeoutMs);
  },
};

export function installBenchmark(
  startMicroApp: StartMicroApp,
  paintObserver: BenchmarkPaintObserver = domPaintObserver,
): void {
  window.__BENCHMARK__ = {
    async run(options) {
      const container = document.querySelector<HTMLElement>('#micro-app-container');
      if (!container) throw new Error('micro app container is missing');
      container.replaceChildren();

      const t0 = performance.now();
      const paintPromise = paintObserver.waitForPaint(t0, options);
      const settlePromise = startMicroApp(options);
      const [duration] = await Promise.all([paintPromise, settlePromise]);
      paintObserver.assertMounted();
      return { duration, settled: true, t0, t1: t0 + duration };
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
