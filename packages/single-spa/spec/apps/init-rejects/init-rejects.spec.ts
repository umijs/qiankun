import * as singleSpa from "single-spa";

describe(`init-rejects`, () => {
  let myApp,
    errs = [];

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./init-rejects.app",
      () => import("./init-rejects.app"),
      (location) => location.hash === "#init-rejects",
    );
    singleSpa.start();
  });

  beforeEach(() => {
    errs = [];
    singleSpa.addErrorHandler(handleError);

    return import("./init-rejects.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  afterEach(() => {
    singleSpa.removeErrorHandler(handleError);
  });

  it(`puts the app into SKIP_BECAUSE_BROKEN, fires a window event, and doesn't mount it`, () => {
    location.hash = "#init-rejects";

    return singleSpa.triggerAppChange().then(() => {
      expect(errs.length).toBe(1);
      expect(myApp.wasinitped()).toEqual(true);
      expect(myApp.wasMounted()).toEqual(false);
      expect(singleSpa.getMountedApps()).toEqual([]);
      expect(singleSpa.getAppStatus("./init-rejects.app")).toEqual(
        singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
      );
    });
  });
});
