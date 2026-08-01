let _numInits, _numMounts, _numUnmounts;

export const timeouts = {
  unmount: {
    dieOnTimeout: false,
    millis: 20,
  },
};

export function init() {
  return new Promise((resolve) => {
    _numInits++;
    resolve();
  });
}

export function mount() {
  return new Promise((resolve) => {
    _numMounts++;
    resolve();
  });
}

export function unmount() {
  return new Promise((resolve) => {
    _numUnmounts++;
    setTimeout(resolve, 40);
  });
}

export function reset() {
  _numInits = _numMounts = _numUnmounts = 0;
}

export function numInits() {
  return _numInits;
}

export function numMounts() {
  return _numMounts;
}

export function numUnmounts() {
  return _numUnmounts;
}
