let initialized, mounted, unmounted;

export function init() {
  return Promise.resolve().then(() => {
    initialized = true;
  });
}

export function mount() {
  return Promise.resolve().then(() => {
    mounted = true;
    throw Error("mount failed");
  });
}

export function unmount() {
  return Promise.resolve().then(() => {
    unmounted = true;
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
