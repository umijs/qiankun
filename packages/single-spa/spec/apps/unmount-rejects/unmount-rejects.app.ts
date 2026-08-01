let _numInits, _numMounts, _numUnmounts;

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
  return new Promise((resolve, reject) => {
    _numUnmounts++;
    reject();
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
