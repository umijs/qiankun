let bootstrapCalled, mountCalled;

export function bootstrap() {
  return new Promise((resolve, reject) => {
    bootstrapCalled = true;
    reject(new Error('the bootstrap-rejects app failed to bootstrap'));
  });
}

export function mount() {
  return new Promise((resolve) => {
    mountCalled = true;
    resolve();
  });
}

export function unmount() {
  return new Promise((resolve) => {
    resolve();
  });
}

export function reset() {
  bootstrapCalled = false;
  mountCalled = false;
}

reset();

export function wasinitped() {
  return bootstrapCalled;
}

export function wasMounted() {
  return mountCalled;
}
