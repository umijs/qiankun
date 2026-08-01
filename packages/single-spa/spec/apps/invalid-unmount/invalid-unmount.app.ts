let bootstrapCalled, mountCalled, unmountCalled;

export function bootstrap() {
  return new Promise((resolve) => {
    bootstrapCalled++;
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
  bootstrapCalled = 0;
  mountCalled = 0;
  unmountCalled = 0;
}

export function numInits() {
  return bootstrapCalled;
}

export function numMounts() {
  return mountCalled;
}

export function numUnmounts() {
  return unmountCalled;
}
