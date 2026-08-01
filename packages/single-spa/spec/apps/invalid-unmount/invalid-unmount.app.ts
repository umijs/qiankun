let initCalled, mountCalled, unmountCalled;

export function init() {
  return new Promise((resolve) => {
    initCalled++;
    resolve();
  });
}

export function mount() {
  return new Promise((resolve) => {
    mountCalled++;
    resolve();
  });
}

export function unmount() {
  unmountCalled++;
  // doesn't return a promise
}

export function reset() {
  initCalled = 0;
  mountCalled = 0;
  unmountCalled = 0;
}

export function numInits() {
  return initCalled;
}

export function numMounts() {
  return mountCalled;
}

export function numUnmounts() {
  return unmountCalled;
}
