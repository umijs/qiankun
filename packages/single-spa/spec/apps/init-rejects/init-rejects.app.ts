let initCalled, mountCalled;

export function init() {
  return new Promise((resolve, reject) => {
    initCalled = true;
    reject(new Error("the init-rejects app failed to init"));
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
