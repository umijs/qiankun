export { startTests } from '@vitest/runner';
import { setSafeTimers } from '@vitest/utils';
import { a as resetRunOnceCounter } from './vendor-run-once.3e5ef7d7.js';
export { g as getCoverageProvider, s as startCoverageInsideWorker, a as stopCoverageInsideWorker, t as takeCoverageInsideWorker } from './vendor-coverage.78040316.js';
import './vendor-global.97e4527c.js';

let globalSetup = false;
async function setupCommonEnv(config) {
  resetRunOnceCounter();
  setupDefines(config.defines);
  if (globalSetup)
    return;
  globalSetup = true;
  setSafeTimers();
  if (config.globals)
    (await import('./chunk-integrations-globals.877c84db.js')).registerApiGlobally();
}
function setupDefines(defines) {
  for (const key in defines)
    globalThis[key] = defines[key];
}

export { setupCommonEnv };
