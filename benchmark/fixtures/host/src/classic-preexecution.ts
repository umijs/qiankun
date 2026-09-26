import { type AppConfiguration, loadMicroApp, start } from 'qiankun';
import { transpileAssets } from '../../../../packages/shared';

type Variant = 'cold' | 'fetch' | 'factory';
type Scenario = 'ready' | 'pending' | 'miss';
type PreparationState = 'disabled' | 'fetching' | 'registering' | 'ready' | 'failed';
type ScriptFactory = (view: WindowProxy) => (this: WindowProxy) => void;

interface ExperimentOptions {
  variant: Variant;
  scenario: Scenario;
  entry: string;
  otherEntry: string;
  activationDelayMs: number;
  hostWorkMs: number;
  interactionWindowMs?: number;
}

interface ExperimentMeasurement {
  activationMountMs: number;
  activationPaintMs: number;
  actualLeadMs: number;
  prepareMs: number;
  hostPaintMs: number;
  interactionDelayMs: number;
  interactionWindowMs: number;
  interactionWindowEndMs: number;
  trustedInput: boolean | null;
  inputDelayMs: number | null;
  inputPaintMs: number | null;
  inputAtMs: number | null;
  peakHeapBytes: number | null;
  heapAfterUnmountBytes: number | null;
  factoryHit: boolean;
  prepareStateAtActivation: PreparationState;
  preparationExecutions: number;
  executions: number;
  checksum: number;
  moduleExecutions: number;
  requests: number;
  bytes: number;
  currentScriptSrc: string;
  hostPolluted: boolean;
  cleanupPassed: boolean;
}

// Experiment-only copy from commit 187287e8: sandbox/src/core/globals.ts,
// Compartment.defaultUnshadowableGlobalNames and StandardSandbox.createStandardGlobals.
// The native wrapper is checked against this profile before any prepared call.
const globalsInES2015 = [
  'Array',
  'ArrayBuffer',
  'Boolean',
  'DataView',
  'Date',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'Error',
  'escape',
  'eval',
  'EvalError',
  'Float32Array',
  'Float64Array',
  'Function',
  'Infinity',
  'Int16Array',
  'Int32Array',
  'Int8Array',
  'isFinite',
  'isNaN',
  'JSON',
  'Map',
  'Math',
  'NaN',
  'Number',
  'Object',
  'parseFloat',
  'parseInt',
  'Promise',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'Reflect',
  'RegExp',
  'Set',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  'Uint16Array',
  'Uint32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'undefined',
  'unescape',
  'URIError',
  'WeakMap',
  'WeakSet',
].filter((name) => name in window);
const standardGlobals = ['window', 'self', 'globalThis', 'hasOwnProperty', 'eval', 'top', 'parent', 'document'];
const globalNames = standardGlobals.concat(
  globalsInES2015
    .concat(['requestAnimationFrame', 'cancelAnimationFrame'])
    .filter((name) => !standardGlobals.includes(name)),
);
const globalDeclaration = `const {${globalNames.join(',')}} = this;`;
const fixtureKeys = [
  '__experimentExecutions',
  '__experimentChecksum',
  '__experimentModulesExecuted',
  '__experimentCurrentScriptSrc',
  'classic-experiment-app',
];
const nativeFetch = window.fetch.bind(window);
const timeoutMs = 30_000;
let hasRun = false;

start();

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const afterTwoFrames = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

function heapBytes(): number | null {
  const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
  return memory?.usedJSHeapSize ?? null;
}

function hostRecord(): Record<string, unknown> {
  return window as unknown as Record<string, unknown>;
}

function hasHostPollution(): boolean {
  return fixtureKeys.some((key) => Object.prototype.hasOwnProperty.call(window, key));
}

async function renderHost(host: HTMLElement, workMs: number, startedAt: number): Promise<number> {
  let remaining = workMs;
  let checksum = 0;
  // Fixed total CPU-time budget, yielded in 5 ms chunks. This is synthetic host
  // contention, not a claim to model the work distribution of a real application.
  while (remaining > 0) {
    await delay(0);
    const chunkMs = Math.min(5, remaining);
    const chunkStartedAt = performance.now();
    while (performance.now() - chunkStartedAt < chunkMs) checksum = (checksum + 17) % 1009;
    remaining -= chunkMs;
    host.textContent = `Host rendering ${checksum}`;
  }
  host.textContent = 'Host ready';
  await afterTwoFrames();
  return performance.now() - startedAt;
}

function waitForCorePaint(container: HTMLElement, activatedAt: number): Promise<number> {
  return new Promise((resolve, reject) => {
    let frame = 0;
    let stableFrames = 0;
    const timeout = window.setTimeout(() => {
      cancelAnimationFrame(frame);
      reject(new Error('experiment core did not become paintable'));
    }, timeoutMs);
    const check = () => {
      const core = container.querySelector<HTMLElement>('#experiment-core');
      const bounds = core?.getBoundingClientRect();
      const style = core ? getComputedStyle(core) : null;
      const visible =
        core !== null &&
        bounds !== undefined &&
        bounds.width > 0 &&
        bounds.height > 0 &&
        core.querySelector('[data-benchmark-critical]') !== null &&
        style?.display !== 'none' &&
        style?.visibility !== 'hidden' &&
        style?.opacity !== '0' &&
        style?.getPropertyValue('--benchmark-style-ready').trim() === '1';
      stableFrames = visible ? stableFrames + 1 : 0;
      if (stableFrames >= 3) {
        window.clearTimeout(timeout);
        resolve(performance.now() - activatedAt);
      } else {
        frame = requestAnimationFrame(check);
      }
    };
    frame = requestAnimationFrame(check);
  });
}

async function run(options: ExperimentOptions): Promise<ExperimentMeasurement> {
  if (hasRun) throw new Error('each experiment sample requires a fresh page');
  hasRun = true;
  if (hasHostPollution()) throw new Error('fixture globals existed before the sample');
  if (!Number.isFinite(options.activationDelayMs) || options.activationDelayMs < 0) {
    throw new Error('activationDelayMs must be finite and non-negative');
  }
  if (!Number.isFinite(options.hostWorkMs) || options.hostWorkMs < 0) {
    throw new Error('hostWorkMs must be finite and non-negative');
  }
  const interactionWindowMs = options.interactionWindowMs ?? 500;
  if (!Number.isFinite(interactionWindowMs) || interactionWindowMs <= 0) {
    throw new Error('interactionWindowMs must be finite and positive');
  }
  const container = document.querySelector<HTMLElement>('#micro-app-container');
  const host = document.querySelector<HTMLElement>('#experiment-host');
  const inputButton = document.querySelector<HTMLButtonElement>('#experiment-input');
  if (!container || !host || !inputButton) throw new Error('experiment containers are missing');

  const responses = new Map<string, Promise<Response>>();
  const prepared = new Map<string, { source: string; factory: ScriptFactory }>();
  const registrations = new Map<string, ScriptFactory>();
  const registrationCleanups = new Set<() => void>();
  const bodyReads: Array<Promise<void>> = [];
  let requests = 0;
  let bytes = 0;
  let factoryHit = false;
  let disposed = false;
  let preparationState: PreparationState = options.variant === 'cold' ? 'disabled' : 'fetching';
  let prepareMs = 0;
  let sandboxView: WindowProxy | undefined;
  let peakHeapBytes = heapBytes();
  let interactionDelayMs = 0;
  let taskTimer = 0;
  let tracking = true;
  const startedAt = performance.now();

  const sampleHeap = () => {
    const current = heapBytes();
    if (current !== null) peakHeapBytes = Math.max(peakHeapBytes ?? 0, current);
  };
  const sampleTaskDelay = () => {
    const scheduledAt = performance.now();
    taskTimer = window.setTimeout(() => {
      // Maximum delay beyond an 8 ms timer request; a task-delay proxy, NOT INP.
      interactionDelayMs = Math.max(interactionDelayMs, performance.now() - scheduledAt - 8);
      if (tracking) sampleTaskDelay();
    }, 8);
  };
  sampleTaskDelay();
  let observationTimer = 0;
  const interactionObservation = new Promise<number>((resolve) => {
    observationTimer = window.setTimeout(
      () => {
        tracking = false;
        window.clearTimeout(taskTimer);
        // The target window is identical across variants; report when its closing
        // task actually ran so a main-thread stall cannot masquerade as 500 ms.
        resolve(performance.now() - startedAt);
      },
      Math.max(0, startedAt + interactionWindowMs - performance.now()),
    );
  });
  const heapTimer = window.setInterval(sampleHeap, 16);

  type InputMeasurement = Pick<ExperimentMeasurement, 'trustedInput' | 'inputDelayMs' | 'inputPaintMs' | 'inputAtMs'>;
  const inputStart = window.__CLASSIC_PREEXECUTION_INPUT_START__;
  const emptyInput: InputMeasurement = {
    trustedInput: null,
    inputDelayMs: null,
    inputPaintMs: null,
    inputAtMs: null,
  };
  let inputTimer = 0;
  let inputListener: (event: PointerEvent) => void = () => {};
  const inputObservation = new Promise<InputMeasurement>((resolve, reject) => {
    inputListener = (event) => {
      const receivedAt = performance.now();
      const trustedInput = event.isTrusted;
      const inputDelayMs = Math.max(0, receivedAt - event.timeStamp);
      const inputAtMs = receivedAt - startedAt;
      inputButton.textContent = 'Input handled';
      // Native-input queue and paint diagnostics, not Event Timing or INP.
      void afterTwoFrames().then(() => {
        window.clearTimeout(inputTimer);
        resolve({
          trustedInput,
          inputDelayMs,
          inputPaintMs: Math.max(0, performance.now() - event.timeStamp),
          inputAtMs,
        });
      });
    };
    inputButton.addEventListener('pointerdown', inputListener, { once: true });
    if (inputStart) {
      inputTimer = window.setTimeout(() => reject(new Error('native input probe timed out')), timeoutMs);
    }
  });
  void inputObservation.catch(() => {});
  // The runner schedules native input from this notification; never gate preparation
  // on the cross-process callback, or its round trip would become artificial lead time.
  void inputStart?.();

  // Every variant uses this page-owned cache. In-flight preparation and activation
  // share one network request; cloned responses keep their body streams independent.
  const fetchShared: typeof window.fetch = async (input, init) => {
    const request = new Request(input, init);
    const key = JSON.stringify([request.url, request.credentials]);
    let response = responses.get(key);
    if (!response) {
      requests += 1;
      response = nativeFetch(request).then((result) => {
        if (!result.ok) throw new Error(`fixture request failed: ${request.url} (${String(result.status)})`);
        bodyReads.push(
          result
            .clone()
            .arrayBuffer()
            .then((body) => {
              bytes += body.byteLength;
            }),
        );
        return result;
      });
      responses.set(key, response);
    }
    return (await response).clone();
  };

  window.__CLASSIC_PREEXECUTION_REGISTER__ = (key, factory) => {
    if (!disposed && typeof factory === 'function') registrations.set(key, factory);
  };

  const registerFactory = (source: string, url: string): Promise<ScriptFactory> =>
    new Promise((resolve, reject) => {
      const node = document.createElement('script');
      const code = `window.__CLASSIC_PREEXECUTION_REGISTER__(${JSON.stringify(url)}, (function(compartmentGlobalThis){if(!compartmentGlobalThis){return;}return (function(){with(this){${globalDeclaration}${source}\n//# sourceURL=${url}\n}});}));`;
      const blobUrl = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
      let settled = false;
      const timeout = window.setTimeout(() => finish(new Error('factory registration timed out')), timeoutMs);
      const cleanup = () => {
        window.clearTimeout(timeout);
        node.onload = null;
        node.onerror = null;
        node.remove();
        URL.revokeObjectURL(blobUrl);
        registrations.delete(url);
        registrationCleanups.delete(cancel);
      };
      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        const factory = registrations.get(url);
        cleanup();
        if (error || !factory) reject(error ?? new Error('blob loaded without registering its factory'));
        else resolve(factory);
      };
      const cancel = () => finish(new Error('factory registration was cancelled'));
      registrationCleanups.add(cancel);
      node.onload = () => finish();
      node.onerror = () => finish(new Error('factory registration failed'));
      node.src = blobUrl;
      document.head.appendChild(node);
    });

  const hostPaint = renderHost(host, options.hostWorkMs, startedAt);
  const prepare = async () => {
    if (options.variant === 'cold') return;
    try {
      const targetEntry = options.scenario === 'miss' ? options.otherEntry : options.entry;
      const html = await (await fetchShared(targetEntry)).text();
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const entries = parsed.querySelectorAll<HTMLScriptElement>('script[entry][src]');
      if (entries.length !== 1) throw new Error('experiment fixture must contain one external entry');
      const entryScript = entries[0];
      const url = new URL(entryScript.getAttribute('src') ?? '', targetEntry).href;
      const credentials = entryScript.crossOrigin === 'use-credentials' ? 'include' : 'same-origin';
      const source = await (await fetchShared(url, { credentials })).text();
      if (options.variant === 'factory') {
        // An idle opportunity is an experiment control, not a compile-completion promise.
        await delay(0);
        if (disposed) return;
        preparationState = 'registering';
        const factory = await registerFactory(source, url);
        if (!disposed) prepared.set(url, { factory, source });
      }
      preparationState = 'ready';
      prepareMs = performance.now() - startedAt;
      sampleHeap();
    } catch (error) {
      preparationState = 'failed';
      throw error;
    }
  };
  const preparation = prepare();
  // The activation path may deliberately continue while this promise is pending.
  void preparation.catch(() => {});
  let app: ReturnType<typeof loadMicroApp> | undefined;

  try {
    // All three groups receive the same minimum lead time, including cold.
    await delay(options.activationDelayMs);
    if (options.scenario !== 'pending') await preparation;
    const preparationExecutions = Number(hostRecord().__experimentExecutions ?? 0);
    if (preparationExecutions !== 0 || hasHostPollution()) throw new Error('preparation executed fixture code');
    const prepareStateAtActivation = preparationState;
    const activatedAt = performance.now();
    const nodeTransformer: NonNullable<AppConfiguration['nodeTransformer']> = (node, opts) => {
      const transform = opts.classicScriptTransformer;
      return transpileAssets(node, options.entry, {
        ...opts,
        classicScriptTransformer: (source, sourceURL) => {
          if (!transform) throw new Error('the native classic transformer is missing');
          const artifact = sourceURL ? prepared.get(sourceURL) : undefined;
          if (!artifact || artifact.source !== source) return transform(source, sourceURL);
          const originalWrapper = transform('', sourceURL);
          if (!originalWrapper.includes(globalDeclaration)) throw new Error('default classic wrapper profile changed');
          factoryHit = true;
          return transform(`__benchInvokePrepared(this, ${JSON.stringify(sourceURL)});`, sourceURL);
        },
      });
    };
    app = loadMicroApp(
      { name: 'classic-experiment-app', entry: options.entry, container },
      {
        fetch: fetchShared,
        nodeTransformer,
        sandbox: {
          globals: {
            __benchInvokePrepared: (view: WindowProxy, key: string) => {
              const artifact = prepared.get(key);
              if (!artifact || disposed) throw new Error('prepared factory is unavailable at execution');
              sandboxView = view;
              artifact.factory(view).call(view);
            },
          },
        },
      },
      {
        beforeMount: async (_app, view) => {
          sandboxView = view;
        },
      },
    );
    const [activationMountMs, activationPaintMs, hostPaintMs] = await Promise.all([
      app.mountPromise.then(() => performance.now() - activatedAt),
      waitForCorePaint(container, activatedAt),
      hostPaint,
    ]);
    const view = sandboxView as unknown as Record<string, unknown> | undefined;
    const executions = Number(view?.__experimentExecutions ?? 0);
    const checksum = Number(view?.__experimentChecksum);
    const moduleExecutions = Number(view?.__experimentModulesExecuted);
    const currentScriptSrc = String(view?.__experimentCurrentScriptSrc ?? '');
    const mountedCore = container.querySelector<HTMLElement>('#experiment-core');
    const hostPolluted = hasHostPollution();
    if (executions !== 1 || hostPolluted || mountedCore?.dataset.mounted !== 'true') {
      throw new Error('fixture execution, isolation, or mount contract failed');
    }
    if (
      !Number.isFinite(checksum) ||
      !Number.isFinite(moduleExecutions) ||
      mountedCore.dataset.checksum !== String(checksum)
    ) {
      throw new Error('fixture checksum or module execution contract failed');
    }
    // The fixture's mount replaces container.innerHTML, including its entry node.
    const expectedScriptSrc = new URL('./entry.js', options.entry).href;
    if (currentScriptSrc !== expectedScriptSrc) {
      throw new Error('document.currentScript did not expose the original entry URL');
    }
    await preparation;
    await Promise.all(bodyReads);
    const interactionWindowEndMs = await interactionObservation;
    const input = inputStart ? await inputObservation : emptyInput;
    sampleHeap();
    await app.unmount();
    const cleanupPassed = container.childNodes.length === 0;
    if (!cleanupPassed) throw new Error('unmount left micro-app container nodes');
    return {
      activationMountMs,
      activationPaintMs,
      actualLeadMs: activatedAt - startedAt,
      prepareMs,
      hostPaintMs,
      interactionDelayMs: Math.max(0, interactionDelayMs),
      interactionWindowMs,
      interactionWindowEndMs,
      ...input,
      peakHeapBytes,
      // Sampled after unmount, before fixture caches are released; no forced GC.
      heapAfterUnmountBytes: heapBytes(),
      factoryHit,
      prepareStateAtActivation,
      preparationExecutions,
      executions,
      checksum,
      moduleExecutions,
      // Custom-fetch request count and decoded response bytes; native preload/blob
      // traffic is a separate browser/network diagnostic, not included here.
      requests,
      bytes,
      currentScriptSrc,
      hostPolluted,
      cleanupPassed,
    };
  } finally {
    disposed = true;
    tracking = false;
    window.clearTimeout(taskTimer);
    window.clearTimeout(observationTimer);
    window.clearTimeout(inputTimer);
    window.clearInterval(heapTimer);
    inputButton.removeEventListener('pointerdown', inputListener);
    registrationCleanups.forEach((cancel) => cancel());
    prepared.clear();
    responses.clear();
    registrations.clear();
    delete window.__CLASSIC_PREEXECUTION_REGISTER__;
    if (app?.getStatus() === 'MOUNTED') await app.unmount();
  }
}

window.__CLASSIC_PREEXECUTION__ = { run };

declare global {
  interface Window {
    __CLASSIC_PREEXECUTION__: { run(options: ExperimentOptions): Promise<ExperimentMeasurement> };
    __CLASSIC_PREEXECUTION_REGISTER__?: (key: string, factory: ScriptFactory) => void;
    __CLASSIC_PREEXECUTION_INPUT_START__?: () => void | Promise<void>;
  }
}
