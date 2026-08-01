let initialized, mounted, unmounted;

export function init() {
  return new Promise((resolve) => {
    initialized = true;
    resolve();
  });
}

export function mount() {
  return new Promise((resolve, reject) => {
    mounted = true;
    reject(`mount-rejects app rejected the mount lifecycle`);
  });
}

export function unmount() {
  return new Promise((resolve) => {
    unmounted = true;
    resolve();
  });
}

export function reset() {
  initialized = false;
  mounted = false;
  unmounted = false;
}

export function wasInitialized() {
  return initialized;
}

export function wasMounted() {
  return mounted;
}

export function wasUnmounted() {
  return unmounted;
}
