import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import { isContext } from 'node:vm';
import { ModuleCacheMap } from 'vite-node/client';
import { workerId } from 'tinypool';
import { c as createBirpc } from './vendor-index.b271ebe4.js';
import { resolve } from 'pathe';
import { installSourcemapsSupport } from 'vite-node/source-map';
import { d as distDir } from './vendor-paths.84fc7a99.js';
import { l as loadEnvironment } from './vendor-environments.443ecd82.js';
import { b as startVitestExecutor } from './vendor-execute.9ab1c1a7.js';
import { createCustomConsole } from './chunk-runtime-console.ea222ffb.js';
import { c as createSafeRpc } from './vendor-rpc.cbd8e972.js';
import 'local-pkg';
import 'node:console';
import 'vite-node/utils';
import '@vitest/utils/error';
import './vendor-global.97e4527c.js';
import 'node:fs';
import '@vitest/utils';
import './vendor-base.9c08bbd0.js';
import 'node:path';
import 'node:module';
import 'vite-node/constants';
import 'node:stream';
import './vendor-date.6e993429.js';

const entryFile = pathToFileURL(resolve(distDir, "entry-vm.js")).href;
async function run(ctx) {
  var _a;
  const moduleCache = new ModuleCacheMap();
  const mockMap = /* @__PURE__ */ new Map();
  const { config, port } = ctx;
  let setCancel = (_reason) => {
  };
  const onCancel = new Promise((resolve2) => {
    setCancel = resolve2;
  });
  const rpc = createBirpc(
    {
      onCancel: setCancel
    },
    {
      eventNames: ["onUserConsoleLog", "onFinished", "onCollected", "onWorkerExit"],
      post(v) {
        port.postMessage(v);
      },
      on(fn) {
        port.addListener("message", fn);
      }
    }
  );
  const environment = await loadEnvironment(ctx.environment.name, ctx.config.root);
  if (!environment.setupVM) {
    const envName = ctx.environment.name;
    const packageId = envName[0] === "." ? envName : `vitest-environment-${envName}`;
    throw new TypeError(
      `Environment "${ctx.environment.name}" is not a valid environment. Path "${packageId}" doesn't support vm environment because it doesn't provide "setupVM" method.`
    );
  }
  const state = {
    ctx,
    moduleCache,
    config,
    mockMap,
    onCancel,
    environment,
    durations: {
      environment: performance.now(),
      prepare: performance.now()
    },
    rpc: createSafeRpc(rpc)
  };
  installSourcemapsSupport({
    getSourceMap: (source) => moduleCache.getSourceMap(source)
  });
  const vm = await environment.setupVM(ctx.environment.options || ctx.config.environmentOptions || {});
  state.durations.environment = performance.now() - state.durations.environment;
  process.env.VITEST_WORKER_ID = String(ctx.workerId);
  process.env.VITEST_POOL_ID = String(workerId);
  process.env.VITEST_VM_POOL = "1";
  if (!vm.getVmContext)
    throw new TypeError(`Environment ${ctx.environment.name} doesn't provide "getVmContext" method. It should return a context created by "vm.createContext" method.`);
  const context = vm.getVmContext();
  if (!isContext(context))
    throw new TypeError(`Environment ${ctx.environment.name} doesn't provide a valid context. It should be created by "vm.createContext" method.`);
  context.__vitest_worker__ = state;
  context.process = process;
  context.global = context;
  context.console = createCustomConsole(state);
  if (ctx.invalidates) {
    ctx.invalidates.forEach((fsPath) => {
      moduleCache.delete(fsPath);
      moduleCache.delete(`mock:${fsPath}`);
    });
  }
  ctx.files.forEach((i) => moduleCache.delete(i));
  const executor = await startVitestExecutor({
    context,
    moduleCache,
    mockMap,
    state
  });
  context.__vitest_mocker__ = executor.mocker;
  const { run: run2 } = await executor.importExternalModule(entryFile);
  try {
    await run2(ctx.files, ctx.config, executor);
  } finally {
    await ((_a = vm.teardown) == null ? void 0 : _a.call(vm));
    state.environmentTeardownRun = true;
  }
}

export { run };
