import { performance } from 'node:perf_hooks';
import v8 from 'node:v8';
import { c as createBirpc } from './vendor-index.b271ebe4.js';
import { parseRegexp } from '@vitest/utils';
import { l as loadEnvironment } from './vendor-environments.443ecd82.js';
import { s as startViteNode, m as moduleCache, a as mockMap } from './vendor-execute.9ab1c1a7.js';
import { r as rpcDone, c as createSafeRpc } from './vendor-rpc.cbd8e972.js';
import { s as setupInspect } from './vendor-inspector.47fc8cbb.js';
import 'node:url';
import 'pathe';
import 'local-pkg';
import 'node:console';
import 'node:vm';
import 'vite-node/client';
import 'vite-node/utils';
import '@vitest/utils/error';
import './vendor-paths.84fc7a99.js';
import './vendor-global.97e4527c.js';
import 'node:fs';
import './vendor-base.9c08bbd0.js';
import 'node:path';
import 'node:module';
import 'vite-node/constants';

async function init(ctx) {
  const { config } = ctx;
  process.env.VITEST_WORKER_ID = "1";
  process.env.VITEST_POOL_ID = "1";
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
      serialize: v8.serialize,
      deserialize: (v) => v8.deserialize(Buffer.from(v)),
      post(v) {
        var _a;
        (_a = process.send) == null ? void 0 : _a.call(process, v);
      },
      on(fn) {
        process.on("message", fn);
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
function parsePossibleRegexp(str) {
  const prefix = "$$vitest:";
  if (typeof str === "string" && str.startsWith(prefix))
    return parseRegexp(str.slice(prefix.length));
  return str;
}
function unwrapConfig(config) {
  if (config.testNamePattern)
    config.testNamePattern = parsePossibleRegexp(config.testNamePattern);
  return config;
}
async function run(ctx) {
  const inspectorCleanup = setupInspect(ctx.config);
  try {
    const state = await init(ctx);
    const { run: run2, executor } = await startViteNode({
      state
    });
    await run2(ctx.files, ctx.config, { environment: state.environment, options: ctx.environment.options }, executor);
    await rpcDone();
  } finally {
    inspectorCleanup();
  }
}
const procesExit = process.exit;
process.on("message", async (message) => {
  if (typeof message === "object" && message.command === "start") {
    try {
      message.config = unwrapConfig(message.config);
      await run(message);
    } finally {
      procesExit();
    }
  }
});

export { run };
