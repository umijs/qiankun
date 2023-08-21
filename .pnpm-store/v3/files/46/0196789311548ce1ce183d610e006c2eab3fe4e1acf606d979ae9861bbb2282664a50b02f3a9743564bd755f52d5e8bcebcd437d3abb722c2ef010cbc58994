function getWorkerState() {
  return globalThis.__vitest_worker__;
}
function getCurrentEnvironment() {
  const state = getWorkerState();
  return state == null ? void 0 : state.environment.name;
}

export { getCurrentEnvironment as a, getWorkerState as g };
