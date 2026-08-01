let mountCalled, unmountCalled;

export function bootstrap() {
  // doesn't return a promise
  return;
}

export function mount() {
  return new Promise((resolve) => {
    mountCalled = true;
    resolve();
  });
}

export function unmount() {
  return new Promise((resolve) => {
    unmountCalled = true;
    resolve();
  });
}

export function mountWasCalled() {
  return mountCalled;
}

export function unmountWasCalled() {
  return unmountCalled;
}

export function reset() {
  mountCalled = false;
  unmountCalled = false;
}
