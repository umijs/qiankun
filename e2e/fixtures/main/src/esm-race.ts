import { EsmSandboxEngine } from '@qiankunjs/shared';
import { SUB_APP_ENTRIES } from '../../../ports';

function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const nativeImport = (moduleUrl: string): Promise<Record<string, unknown>> =>
  import(/* @vite-ignore */ moduleUrl) as Promise<Record<string, unknown>>;

function collectDomImportMapKeys(): string[] {
  const keys: string[] = [];
  document.querySelectorAll('script[type="importmap"]').forEach((script) => {
    try {
      const parsed = JSON.parse(script.textContent ?? '{}') as { imports?: Record<string, string> };
      if (parsed.imports) keys.push(...Object.keys(parsed.imports));
    } catch {
      // ignore malformed script tags if any
    }
  });
  return keys;
}

const esmBaseUrl = new URL('.', SUB_APP_ENTRIES['sub-esm']).href;

declare global {
  interface Window {
    __CONCURRENT_SHARED__?: string;
    __CONCURRENT_INDEPENDENT__?: string;
    __ESM_RACE__?: {
      verifySharedProbeBarrier(): Promise<{
        initialCollisionProbeCalls: number;
        bSettledDuringGate: boolean;
        aSettledDuringGate: boolean;
        sharedInImportMapDuringGate: boolean;
        branchA: unknown;
        branchB: unknown;
        sandboxValue: unknown;
        mainValue: unknown;
      }>;
      verifyIndependentFlushBarrier(): Promise<{
        fastResult: unknown;
        slowInImportMapWhilePending: boolean;
        slowSettledWhilePending: boolean;
        slowResult: unknown;
        slowInImportMapAfterRelease: boolean;
        sandboxValue: unknown;
        mainValue: unknown;
      }>;
    };
  }
}

window.__ESM_RACE__ = {
  async verifySharedProbeBarrier() {
    const view: Record<string, unknown> = {};
    view.window = view;
    view.self = view;
    view.globalThis = view;
    view.location = window.location;
    const sharedProbeEntered = createDeferred();
    const sharedProbeGate = createDeferred();
    const branchBReachedProbe = createDeferred();
    let initialCollisionProbeCalls = 0;
    let firstSharedProbePaused = false;
    let firstSharedProbeReleased = false;

    const engine = new EsmSandboxEngine({
      appName: 'esm-race-shared',
      instanceId: 1,
      entryUrl: esmBaseUrl,
      fetch: window.fetch.bind(window),
      getGlobalsView: () => view,
      globalsBaseSet: ['window', 'history', 'location'],
      moduleImporter: async (moduleUrl) => {
        if (moduleUrl.startsWith('blob:')) {
          const code = await fetch(moduleUrl).then((r) => r.text());
          const isSharedInitialCollisionProbe =
            code.includes('/__probe__') &&
            code.includes("kind: 'shared-colliding'") &&
            /const \{ [^}]*history[^}]*\} = /.test(code);

          if (isSharedInitialCollisionProbe) {
            initialCollisionProbeCalls += 1;
            if (!firstSharedProbePaused) {
              firstSharedProbePaused = true;
              sharedProbeEntered.resolve();
              await sharedProbeGate.promise;
              firstSharedProbeReleased = true;
            }
          } else if (code.includes('/__probe__') && code.includes('branchBLocal')) {
            try {
              return await nativeImport(moduleUrl);
            } finally {
              branchBReachedProbe.resolve();
            }
          }
        }
        return nativeImport(moduleUrl);
      },
    });

    let aSettled = false;
    let bSettled = false;
    const pA = engine.import('./modules/concurrent-a.js').then((ns) => {
      aSettled = true;
      return ns;
    });
    let pB: Promise<Record<string, unknown>> | undefined;

    try {
      await sharedProbeEntered.promise;
      pB = engine.import('./modules/concurrent-b.js').then((ns) => {
        bSettled = true;
        return ns;
      });
      await branchBReachedProbe.promise;

      const bSettledDuringGate = bSettled;
      const aSettledDuringGate = aSettled;
      const sharedInImportMapDuringGate = collectDomImportMapKeys().some(
        (key) => key.startsWith(engine.instanceKey) && key.endsWith('/modules/shared-colliding.js'),
      );

      if (!firstSharedProbeReleased) {
        sharedProbeGate.resolve();
      }
      const [nsA, nsB] = await Promise.all([pA, pB]);

      return {
        initialCollisionProbeCalls,
        bSettledDuringGate,
        aSettledDuringGate,
        sharedInImportMapDuringGate,
        branchA: nsA.branchA,
        branchB: nsB.branchB,
        sandboxValue: view.__CONCURRENT_SHARED__,
        mainValue: window.__CONCURRENT_SHARED__,
      };
    } finally {
      sharedProbeGate.resolve();
      await Promise.allSettled([pA, pB].filter(Boolean));
      engine.dispose();
    }
  },

  async verifyIndependentFlushBarrier() {
    const view: Record<string, unknown> = {};
    view.window = view;
    view.self = view;
    view.globalThis = view;
    view.location = window.location;
    const slowProbeEntered = createDeferred();
    const slowProbeGate = createDeferred();
    let pausedOnce = false;

    const engine = new EsmSandboxEngine({
      appName: 'esm-race-independent',
      instanceId: 2,
      entryUrl: esmBaseUrl,
      fetch: window.fetch.bind(window),
      getGlobalsView: () => view,
      globalsBaseSet: ['window', 'history', 'location'],
      moduleImporter: async (moduleUrl) => {
        if (moduleUrl.startsWith('blob:')) {
          const code = await fetch(moduleUrl).then((r) => r.text());
          if (!pausedOnce && code.includes('/__probe__') && code.includes("kind: 'independent-colliding'")) {
            pausedOnce = true;
            slowProbeEntered.resolve();
            await slowProbeGate.promise;
          }
        }
        return nativeImport(moduleUrl);
      },
    });

    let slowSettled = false;
    const pSlow = engine.import('./modules/independent-colliding.js').then((ns) => {
      slowSettled = true;
      return ns;
    });

    try {
      await slowProbeEntered.promise;
      const nsFast = await engine.import('./modules/independent-fast.js');
      const slowInImportMapWhilePending = collectDomImportMapKeys().some(
        (key) => key.startsWith(engine.instanceKey) && key.endsWith('/modules/independent-colliding.js'),
      );
      const slowSettledWhilePending = slowSettled;

      slowProbeGate.resolve();
      const nsSlow = await pSlow;
      const slowInImportMapAfterRelease = collectDomImportMapKeys().some(
        (key) => key.startsWith(engine.instanceKey) && key.endsWith('/modules/independent-colliding.js'),
      );

      return {
        fastResult: nsFast.independentFast,
        slowInImportMapWhilePending,
        slowSettledWhilePending,
        slowResult: nsSlow.independentColliding,
        slowInImportMapAfterRelease,
        sandboxValue: view.__CONCURRENT_INDEPENDENT__,
        mainValue: window.__CONCURRENT_INDEPENDENT__,
      };
    } finally {
      slowProbeGate.resolve();
      await Promise.allSettled([pSlow]);
      engine.dispose();
    }
  },
};
