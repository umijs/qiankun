let initCalled, mountCalled;

export const timeouts = {
  init: {
    millis: 20,
    dieOnTimeout: true,
  },
};

export function init() {
  return new Promise((resolve) => {
    initCalled = true;
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
  initCalled = false;
  mountCalled = false;
}

reset();

export function wasinitped() {
  return initCalled;
}

export function wasMounted() {
  return mountCalled;
}
