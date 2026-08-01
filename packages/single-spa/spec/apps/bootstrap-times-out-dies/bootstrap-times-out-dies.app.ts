let bootstrapCalled, mountCalled;

export const timeouts = {
  bootstrap: {
    millis: 20,
    dieOnTimeout: true,
  },
};

export function bootstrap() {
  return new Promise((resolve) => {
    bootstrapCalled = true;
    setTimeout(resolve, 30);
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
