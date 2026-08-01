let initialized, mounted;

export function init() {
  return new Promise((resolve) => {
    initialized = true;
    resolve();
  });
}

export function mount() {
  return new Promise((resolve) => {
    mounted = true;
    resolve();
  });
}

export function reset() {
  initialized = false;
  mounted = false;
}

export function isInitialized() {
  return initialized;
}

export function isMounted() {
  return mounted;
}
