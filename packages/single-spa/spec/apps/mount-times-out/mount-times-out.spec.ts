import * as singleSpa from "single-spa";

const activeHash = `#mount-times-out`;

describe(`mount-times-out app`, () => {
  let myApp, errs;

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./mount-times-out.app",
      () => import("./mount-times-out.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "#";

    errs = [];
    singleSpa.addErrorHandler(handleError);

    return import("./mount-times-out.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  afterEach(() => singleSpa.removeErrorHandler(handleError));

  it(`is just waited for if dieOnTimeout is false`, () => {
    location.hash = activeHash;

    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.inits()).toEqual(1);
      expect(myApp.mounts()).toEqual(1);
      expect(singleSpa.getMountedApps()).toEqual(["./mount-times-out.app"]);
      expect(singleSpa.getAppStatus("./mount-times-out.app")).toEqual(
        "MOUNTED",
      );
    });
  });
});
