import * as singleSpa from "single-spa";

const activeHash = `#invalid-no-mount`;

describe(`invalid-no-mount app`, () => {
  let myApp,
    errs = [];

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./invalid-no-mount.app",
      import("./invalid-no-mount.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = activeHash;

    singleSpa.addErrorHandler(handleError);

    return import("./invalid-no-mount.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  afterEach(() => singleSpa.removeErrorHandler(handleError));

  it(`is never initialized`, () => {
    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.isInitialized()).toEqual(false);
      expect(singleSpa.getMountedApps()).toEqual([]);
      expect(singleSpa.getAppStatus("./invalid-no-mount.app")).toEqual(
        "SKIP_BECAUSE_BROKEN",
      );
    });
  });
});
