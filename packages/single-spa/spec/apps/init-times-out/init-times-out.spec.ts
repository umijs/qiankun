import * as singleSpa from "single-spa";

describe(`init-times-out`, () => {
  let myApp,
    errs = [];

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./init-times-out.app",
      () => import("./init-times-out.app"),
      (location) => location.hash === "#init-times-out",
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "#";

    errs = [];
    singleSpa.addErrorHandler(handleError);

    return import("./init-times-out.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  afterEach(() => {
    singleSpa.removeErrorHandler(handleError);
  });

  it(`is just waited for if dieOnTimeout is false`, () => {
    location.hash = "#init-times-out";

    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.wasinitped()).toEqual(true);
      expect(myApp.wasMounted()).toEqual(true);
      expect(singleSpa.getMountedApps()).toEqual(["./init-times-out.app"]);
      expect(singleSpa.getAppStatus("./init-times-out.app")).toEqual(
        singleSpa.AppOrParcelStatus.MOUNTED,
      );
      expect(errs.length).toBe(0);
    });
  });
});
