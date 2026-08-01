let initialized;

export function init() {
  return new Promise((resolve) => {
    initialized = true;
    resolve();
  });
}

export function unmount() {
  return new Promise((resolve) => resolve());
}

export function reset() {
  return (initialized = false);
}

export function isInitialized() {
  return initialized;
}
