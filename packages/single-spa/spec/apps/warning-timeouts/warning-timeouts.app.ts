let delay = 0;

export function init() {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
    advanceTimers();
  });
}

export function mount() {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
    advanceTimers();
  });
}

export function unmount() {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
    advanceTimers();
  });
}

export const timeouts = {
  init: {
    warningMillis: 2,
  },
  mount: {
    warningMillis: 2,
  },
  unmount: {
    warningMillis: 2,
  },
  unload: {
    warningMillis: 2,
  },
};

export function reset() {
  delay = 0;
}

export function setDelay(millis) {
  delay = millis;
}

function advanceTimers() {
  window.dispatchEvent(
    new CustomEvent("fake-timers-advance", {
      detail: delay,
    }),
  );
}
