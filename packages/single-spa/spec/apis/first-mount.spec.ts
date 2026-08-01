import * as singleSpa from "single-spa";

const dummyApp = {
  init() {
    return Promise.resolve();
  },
  mount() {
    return Promise.resolve();
  },
  unmount() {
    return Promise.resolve();
  },
  unload() {
    return Promise.resolve();
  },
};

describe(`single-spa:first-mount events`, () => {
  it(`fires first-mount exactly once when the first app is mounted`, () => {
    singleSpa.registerApplication("firstMount", dummyApp, () => {
      return window.location.hash.indexOf("#/firstMount") === 0;
    });
    singleSpa.start();
    let numFirstMounts = 0,
      numBeforeFirstMounts = 0;

    window.addEventListener("single-spa:first-mount", () => {
      numBeforeFirstMounts++;
    });

    window.addEventListener("single-spa:first-mount", () => {
      numFirstMounts++;
    });

    window.location.hash = `#/firstMount`;

    return singleSpa
      .triggerAppChange()
      .then(() => {
        // Unmount
        window.location.hash = `#/`;
        return singleSpa.triggerAppChange();
      })
      .then(() => {
        // Remount (shouldn't trigger an event)
        window.location.hash = `#/firstMount`;
        return singleSpa.triggerAppChange();
      })
      .then(() => {
        expect(numBeforeFirstMounts).toBe(1);
        expect(numFirstMounts).toBe(1);
      });
  });
});
