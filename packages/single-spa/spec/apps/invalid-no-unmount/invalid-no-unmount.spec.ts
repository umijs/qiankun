import * as singleSpa from "single-spa";

const activeHash = `#invalid-no-unmount`;

describe(`invalid-no-unmount app`, () => {
  let myApp,
    errs = [];

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./invalid-no-unmount.app",
      () => import("./invalid-no-unmount.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = activeHash;

    errs = [];
    singleSpa.addErrorHandler(handleError);

    return import("./invalid-no-unmount.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  afterEach(() => singleSpa.removeErrorHandler(handleError));

  it(`is never initialized`, () => {
    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.isInitialized()).toEqual(false);
      expect(myApp.isMounted()).toEqual(false);
      expect(singleSpa.getMountedApps()).toEqual([]);
      expect(singleSpa.getAppStatus("./invalid-no-unmount.app")).toEqual(
        "SKIP_BECAUSE_BROKEN",
      );
    });
  });
});
