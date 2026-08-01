import * as singleSpa from "single-spa";

let initialized, mounted;

const app = {
  init() {
    initialized = true;
    return Promise.resolve();
  },
  mount() {
    mounted = true;
    return Promise.resolve();
  },
  unmount() {
    mounted = false;
    return Promise.resolve();
  },
};

describe(`register-with-object`, () => {
  beforeAll(() => {
    singleSpa.registerApplication(
      "register-with-object",
      app,
      (location) => location.hash === "#register-with-object",
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "#not-register-with-object";

    initialized = false;
    mounted = false;
  });

  it(`goes through the whole lifecycle successfully`, () => {
    expect(mounted).toEqual(false);
    expect(singleSpa.getMountedApps()).toEqual([]);

    location.hash = "#register-with-object";

    return singleSpa.triggerAppChange().then(() => {
      expect(initialized).toEqual(true);
      expect(mounted).toEqual(true);
      expect(singleSpa.getMountedApps()).toEqual(["register-with-object"]);

      location.hash = "#not-register-with-object";

      return singleSpa.triggerAppChange().then(() => {
        expect(initialized).toEqual(true);
        expect(mounted).toEqual(false);
        expect(singleSpa.getMountedApps()).toEqual([]);
      });
    });
  });
});
