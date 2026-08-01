import * as singleSpa from "single-spa";

describe(`init-times-out-dies`, () => {
  let myApp,
    errs = [];

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./init-times-out-dies.app",
      () => import("./init-times-out-dies.app"),
      (location) => location.hash === "#init-times-out-dies",
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "#";

    errs = [];
    singleSpa.addErrorHandler(handleError);

    return import("./init-times-out-dies.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  afterEach(() => {
    singleSpa.removeErrorHandler(handleError);
  });

  it(`is put into SKIP_BECAUSE_BROKEN if dieOnTimeout is true`, () => {
    location.hash = "#init-times-out-dies";

    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.wasinitped()).toEqual(true);
      expect(myApp.wasMounted()).toEqual(false);
      expect(singleSpa.getMountedApps()).toEqual([]);
      expect(singleSpa.getAppStatus("./init-times-out-dies.app")).toEqual(
        "SKIP_BECAUSE_BROKEN",
      );
      expect(errs.length).toBeGreaterThan(0);
    });
  });
});
