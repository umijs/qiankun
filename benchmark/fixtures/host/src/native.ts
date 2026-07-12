import { type BenchmarkPaintObserver, installBenchmark } from './benchmark';

const NATIVE_BENCHMARK_QUERY_VALUE = 'native-iframe';
const NATIVE_CORE_PAINTED = 'native-core-painted';
const NATIVE_APP_MOUNTED = 'native-app-mounted';
const MESSAGE_VERSION = 1;

interface ActiveRun {
  expectedOrigin: string;
  iframe?: HTMLIFrameElement;
  mounted: boolean;
  paintMessage?: Promise<Record<string, unknown>>;
  token: string;
}

let activeRun: ActiveRun | undefined;

function getExpectedMessage(
  event: MessageEvent<unknown>,
  run: ActiveRun,
  type: string,
): Record<string, unknown> | undefined {
  if (event.origin !== run.expectedOrigin || event.source !== run.iframe?.contentWindow) return;
  if (typeof event.data !== 'object' || event.data === null) return;

  const message = event.data as Record<string, unknown>;
  if (message.type !== type || message.version !== MESSAGE_VERSION || message.token !== run.token) return;
  return message;
}

function waitForIframeMessage(type: string, run: ActiveRun, timeoutMs: number): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(`${type} timed out`));
    }, timeoutMs);
    const onMessage = (event: MessageEvent<unknown>) => {
      const message = getExpectedMessage(event, run, type);
      if (!message) return;
      cleanup();
      resolve(message);
    };
    function cleanup() {
      window.clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
    }
    window.addEventListener('message', onMessage);
  });
}

function waitForIframeLoad(iframe: HTMLIFrameElement, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('native iframe load timed out'));
    }, timeoutMs);
    const onError = () => {
      cleanup();
      reject(new Error('native iframe failed to load'));
    };
    const onLoad = () => {
      cleanup();
      resolve();
    };
    function cleanup() {
      window.clearTimeout(timeout);
      iframe.removeEventListener('error', onError);
      iframe.removeEventListener('load', onLoad);
    }
    iframe.addEventListener('error', onError);
    iframe.addEventListener('load', onLoad);
  });
}

const nativePaintObserver: BenchmarkPaintObserver = {
  assertMounted() {
    if (!activeRun?.mounted) throw new Error('native iframe settled without mounting its core element');
  },
  prepare(options) {
    const run: ActiveRun = {
      expectedOrigin: new URL(options.entry).origin,
      mounted: false,
      token: crypto.randomUUID(),
    };
    run.paintMessage = waitForIframeMessage(NATIVE_CORE_PAINTED, run, options.timeoutMs);
    activeRun = run;
  },
  async waitForPaint(t0, options) {
    const startEpoch = performance.timeOrigin + t0;
    const run = activeRun;
    if (!run?.paintMessage) throw new Error('native iframe paint observer is not prepared');

    const message = await run.paintMessage;
    const paintedAt = message.paintedAt;
    const receivedAt = performance.timeOrigin + performance.now();
    if (
      typeof paintedAt !== 'number' ||
      !Number.isFinite(paintedAt) ||
      paintedAt < startEpoch ||
      paintedAt > receivedAt + 1 ||
      paintedAt - startEpoch > options.timeoutMs
    ) {
      throw new Error('native iframe reported an invalid paint timestamp');
    }
    return paintedAt - startEpoch;
  },
};

installBenchmark(({ entry, timeoutMs }, container) => {
  if (!activeRun) throw new Error('native iframe paint observer is not ready');

  const run = activeRun;
  const iframe = document.createElement('iframe');
  iframe.style.border = '0';
  iframe.style.display = 'block';
  iframe.style.height = '480px';
  iframe.style.width = '960px';
  iframe.title = 'Native iframe benchmark app';
  run.iframe = iframe;

  const entryUrl = new URL(entry);
  entryUrl.searchParams.set('benchmark', NATIVE_BENCHMARK_QUERY_VALUE);
  entryUrl.searchParams.set('benchmark-parent-origin', window.location.origin);
  entryUrl.searchParams.set('benchmark-token', run.token);
  const loadPromise = waitForIframeLoad(iframe, timeoutMs);
  const mountPromise = waitForIframeMessage(NATIVE_APP_MOUNTED, run, timeoutMs).then(() => {
    run.mounted = true;
  });

  iframe.src = entryUrl.href;
  container.appendChild(iframe);
  const settled = Promise.all([loadPromise, mountPromise]).then(() => {});
  return {
    async cleanup() {
      await settled.catch(() => {});
      iframe.remove();
      activeRun = undefined;
    },
    settled,
  };
}, nativePaintObserver);
