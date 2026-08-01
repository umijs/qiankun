let numInits, numMounts, numUnmounts;

export const timeouts = {
  mount: {
    dieOnTimeout: false,
    millis: 20,
  },
};

export function init() {
  return new Promise((resolve) => {
    numInits++;
    resolve();
  });
}

export function mount() {
  return new Promise((resolve) => {
    numMounts++;
    setTimeout(resolve, 40);
  });
}

export function unmount() {
  return new Promise((resolve) => {
    numUnmounts++;
    resolve();
  });
}

export function reset() {
  numInits = numMounts = numUnmounts = 0;
}

export function inits() {
  return numInits;
}

export function mounts() {
  return numMounts;
}
