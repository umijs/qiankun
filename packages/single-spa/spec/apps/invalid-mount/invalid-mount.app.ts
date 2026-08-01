let bootstrapCalled, mountCalled, unmountCalled;

export function bootstrap() {
  return new Promise((resolve) => {
    bootstrapCalled = true;
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
  bootstrapCalled = false;
  mountCalled = false;
  unmountCalled = false;
}

export function wasInitialized() {
  return bootstrapCalled;
}

export function wasMounted() {
  return mountCalled;
}

export function wasUnmounted() {
  return unmountCalled;
}
