let _wasInitialized, _wasMounted, _wasUnmounted;

export function reset() {
  _wasInitialized = _wasMounted = _wasUnmounted = false;
}

export function init() {
  _wasInitialized = true;
  return nonNativePromise();
}

export function mount() {
  _wasMounted = true;
  return nonNativePromise();
}

export function unmount() {
  _wasUnmounted = true;
  return nonNativePromise();
}

export function wasInitialized() {
  return _wasInitialized;
}

export function wasMounted() {
  return _wasMounted;
}

export function wasUnmounted() {
  return _wasUnmounted;
}

function nonNativePromise() {
  return {
    then(callback) {
      callback();
      return this;
    },
    catch(callback) {
      return this;
    },
  };
}
