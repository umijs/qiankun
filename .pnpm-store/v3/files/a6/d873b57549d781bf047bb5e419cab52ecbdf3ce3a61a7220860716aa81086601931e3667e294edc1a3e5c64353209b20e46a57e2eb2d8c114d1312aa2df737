import { performance } from 'node:perf_hooks';
import { c as createBirpc } from './vendor-index.b271ebe4.js';
import { workerId } from 'tinypool';
import { g as getWorkerState } from './vendor-global.97e4527c.js';
import { l as loadEnvironment } from './vendor-environments.443ecd82.js';
import { s as startViteNode, m as moduleCache, a as mockMap } from './vendor-execute.9ab1c1a7.js';
import { s as setupInspect } from './vendor-inspector.47fc8cbb.js';
import { r as rpcDone, c as createSafeRpc } from './vendor-rpc.cbd8e972.js';
import 'node:url';
import 'pathe';
import 'local-pkg';
import 'node:console';
import 'node:vm';
import 'vite-node/client';
import 'vite-node/utils';
import '@vitest/utils/error';
import './vendor-paths.84fc7a99.js';
import 'node:fs';
import '@vitest/utils';
import './vendor-base.9c08bbd0.js';
import 'node:path';
import 'node:module';
import 'vite-node/constants';

async function init(ctx) {
  if (typeof __vitest_worker__ !== "undefined" && ctx.config.threads && ctx.config.isolate)
    throw new Error(`worker for ${ctx.files.join(",")} already initialized by ${getWorkerState().ctx.files.join(",")}. This is probably an internal bug of Vitest.`);
  const { config, port, workerId: workerId$1 } = ctx;
  process.env.VITEST_WORKER_ID = String(workerId$1);
  process.env.VITEST_POOL_ID = String(workerId);
  let setCancel = (_reason) => {
  };
  const onCancel = new Promise((resolve) => {
    setCancel = resolve;
  });
  const rpc = createBirpc(
    {
      onCancel: setCancel
    },
    {
      eventNames: ["onUserConsoleLog", "onFinished", "onCollected", "onWorkerExit", "onCancel"],
      post(v) {
        port.postMessage(v);
      },
      on(fn) {
        port.addListener("message", fn);
      }
    }
  );
  const environment = await loadEnvironment(ctx.environment.name, ctx.config.root);
  if (ctx.environment.transformMode)
    environment.transformMode = ctx.environment.transformMode;
  const state = {
    ctx,
    moduleCache,
    config,
    mockMap,
    onCancel,
    environment,
    durations: {
      environment: 0,
      prepare: performance.now()
    },
    rpc: createSafeRpc(rpc)
  };
  globalThis.__vitest_worker__ = state;
  if (ctx.invalidates) {
    ctx.invalidates.forEach((fsPath) => {
      moduleCache.delete(fsPath);
      moduleCache.delete(`mock:${fsPath}`);
    });
  }
  ctx.files.forEach((i) => moduleCache.delete(i));
  return state;
}
async function run(ctx) {
  const inspectorCleanup = setupInspect(ctx.config);
  try {
    const state = await init(ctx);
    const { run: run2, executor } = await startViteNode({ state });
    await run2(ctx.files, ctx.config, { environment: state.environment, options: ctx.environment.options }, executor);
    await rpcDone();
  } finally {
    inspectorCleanup();
  }
}

export { run };
