let initCalled, mountCalled, unmountCalled;

export function init() {
  return new Promise((resolve) => {
    initCalled = true;
    resolve();
  });
}

export function mount() {
  mountCalled = true;
  // doesn't return a promise.
}

export function unmount() {
  return new Promise((resolve) => {
    unmountCalled = true;
    resolve();
  });
}

export function reset() {
  initCalled = false;
  mountCalled = false;
  unmountCalled = false;
}

export function wasInitialized() {
  return initCalled;
}

export function wasMounted() {
  return mountCalled;
}

export function wasUnmounted() {
  return unmountCalled;
}
