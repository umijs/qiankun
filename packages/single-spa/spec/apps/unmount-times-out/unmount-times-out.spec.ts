import * as singleSpa from "single-spa";

const activeHash = `#unmount-times-out`;

describe(`unmount-times-out app`, () => {
  let myApp, errs;

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./unmount-times-out.app",
      () => import("./unmount-times-out.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  beforeEach(() => {
    errs = [];
    singleSpa.addErrorHandler(handleError);

    location.hash = "#";

    return import("./unmount-times-out.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  afterEach(() => singleSpa.removeErrorHandler(handleError));

  it(`is just waited for if dieOnTimeout is false`, () => {
    location.hash = activeHash;

    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.numInits()).toEqual(1);
      expect(myApp.numMounts()).toEqual(1);
      expect(singleSpa.getMountedApps()).toEqual(["./unmount-times-out.app"]);
      expect(singleSpa.getAppStatus("./unmount-times-out.app")).toEqual(
        "MOUNTED",
      );

      location.hash = "#not-unmount-times-out";

      return singleSpa.triggerAppChange().then(() => {
        expect(myApp.numUnmounts()).toEqual(1);
        expect(singleSpa.getMountedApps()).toEqual([]);
        expect(singleSpa.getAppStatus("./unmount-times-out.app")).toEqual(
          "NOT_MOUNTED",
        );
      });
    });
  });
});
