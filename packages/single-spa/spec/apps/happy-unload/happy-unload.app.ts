let numInitCalls = 0,
  numMountCalls = 0,
  numUnloadCalls = 0,
  numUnmountCalls = 0;

export function reset() {
  numInitCalls = 0;
  numMountCalls = 0;
  numUnloadCalls = 0;
  numUnmountCalls = 0;
}

export function init() {
  numInitCalls++;
  return Promise.resolve();
}
export function mount() {
  numMountCalls++;
  return Promise.resolve();
}
export function unmount() {
  numUnmountCalls++;
  return Promise.resolve();
}
export function unload() {
  numUnloadCalls++;
  return Promise.resolve();
}
export function getNumInitCalls() {
  return numInitCalls;
}
export function getNumMountCalls() {
  return numMountCalls;
}
export function getNumUnloadCalls() {
  return numUnloadCalls;
}

export function getNumUnmountCalls() {
  return numUnmountCalls;
}
