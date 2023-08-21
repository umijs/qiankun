import { relative } from 'pathe';
import 'std-env';
import '@vitest/runner/utils';
import '@vitest/utils';
import { g as getWorkerState } from './vendor-global.97e4527c.js';

var _a;
const isNode = typeof process < "u" && typeof process.stdout < "u" && !((_a = process.versions) == null ? void 0 : _a.deno) && !globalThis.window;

const isWindows = isNode && process.platform === "win32";
function getRunMode() {
  return getWorkerState().config.mode;
}
function isRunningInBenchmark() {
  return getRunMode() === "benchmark";
}
const relativePath = relative;
function removeUndefinedValues(obj) {
  for (const key in Object.keys(obj)) {
    if (obj[key] === void 0)
      delete obj[key];
  }
  return obj;
}

export { isNode as a, removeUndefinedValues as b, isWindows as c, isRunningInBenchmark as i, relativePath as r };
