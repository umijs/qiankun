import * as singleSpa from "single-spa";

const activeHash = `#multiple-lifecycle-functions`;

describe(`multiple-lifecycle-functions app`, () => {
  let myApp;

  beforeAll(() => {
    singleSpa.registerApplication(
      "./multiple-lifecycle-functions.app",
      () => import("./multiple-lifecycle-functions.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = activeHash;

    return import("./multiple-lifecycle-functions.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  it(`waits for each of the functions one by one, in order`, () => {
    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.initsCalledOutOfOrder()).toEqual(undefined);
      expect(myApp.init1Called()).toEqual(true);
      expect(myApp.init2Called()).toEqual(true);
      expect(myApp.init3Called()).toEqual(true);

      expect(myApp.mountsCalledOutOfOrder()).toEqual(undefined);
      expect(myApp.mount1Called()).toEqual(true);
      expect(myApp.mount2Called()).toEqual(true);
      expect(myApp.mount3Called()).toEqual(true);

      location.hash = "#not-multiple-lifecycle-functions";
      singleSpa.triggerAppChange().then(() => {
        expect(myApp.unmountsCalledOutOfOrder()).toEqual(undefined);
        expect(myApp.unmount1Called()).toEqual(true);
        expect(myApp.unmount2Called()).toEqual(true);
        expect(myApp.unmount3Called()).toEqual(true);
      });
    });
  });
});
