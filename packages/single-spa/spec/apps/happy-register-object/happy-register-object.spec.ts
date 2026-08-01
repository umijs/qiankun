import * as singleSpa from "single-spa";

describe(`happy-register-object`, () => {
  let myApp;

  beforeAll(() => {
    singleSpa.registerApplication({
      name: "./happy-register-object.app",
      app: () => import("./happy-register-object.app"),
      activeWhen: (location) => location.hash === "#happy-register-object",
    });
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "#";

    return import("./happy-register-object.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  it(`goes through the whole lifecycle successfully`, () => {
    expect(myApp.isMounted()).toEqual(false);
    expect(singleSpa.getMountedApps()).toEqual([]);

    location.hash = "#happy-register-object";

    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.wasInitialized()).toEqual(true);
      expect(myApp.isMounted()).toEqual(true);
      expect(singleSpa.getMountedApps()).toEqual([
        "./happy-register-object.app",
      ]);

      location.hash = "#not-happy-register-object";

      return singleSpa.triggerAppChange().then(() => {
        expect(myApp.wasInitialized()).toEqual(true);
        expect(myApp.isMounted()).toEqual(false);
        expect(singleSpa.getMountedApps()).toEqual([]);
      });
    });
  });
});
