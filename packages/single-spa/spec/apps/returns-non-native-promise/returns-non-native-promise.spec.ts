import * as singleSpa from "single-spa";

describe(`returns-non-native-promise`, () => {
  let myApp;

  beforeAll(() => {
    singleSpa.registerApplication(
      "./returns-non-native-promise.app.js",
      () => import("./returns-non-native-promise.app"),
      (location) => location.hash === "#returns-non-native-promise",
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "#";

    return import("./returns-non-native-promise.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  it(`goes through the whole lifecycle successfully`, () => {
    expect(myApp.wasMounted()).toEqual(false);
    expect(singleSpa.getMountedApps()).toEqual([]);

    location.hash = "#returns-non-native-promise";

    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.wasInitialized()).toEqual(true);
      expect(myApp.wasMounted()).toEqual(true);
      expect(singleSpa.getMountedApps()).toEqual([
        "./returns-non-native-promise.app.js",
      ]);

      location.hash = "#something-else";

      return singleSpa.triggerAppChange().then(() => {
        expect(myApp.wasInitialized()).toEqual(true);
        expect(myApp.wasUnmounted()).toEqual(true);
        expect(singleSpa.getMountedApps()).toEqual([]);
      });
    });
  });
});
