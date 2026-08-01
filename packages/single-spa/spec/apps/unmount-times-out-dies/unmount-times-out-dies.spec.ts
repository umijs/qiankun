import * as singleSpa from "single-spa";

const activeHash = `#unmount-times-out-dies`;

describe(`unmount-times-out-dies app`, () => {
  let myApp, errs;

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./unmount-times-out-dies.app",
      () => import("./unmount-times-out-dies.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "#";

    errs = [];
    singleSpa.addErrorHandler(handleError);

    return import("./unmount-times-out-dies.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  afterEach(() => singleSpa.removeErrorHandler(handleError));

  it(`is put into SKIP_BECAUSE_BROKEN when dieOnTimeout is true`, () => {
    location.hash = activeHash;

    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.numInits()).toEqual(1);
      expect(myApp.numMounts()).toEqual(1);
      expect(singleSpa.getMountedApps()).toEqual([
        "./unmount-times-out-dies.app",
      ]);
      expect(singleSpa.getAppStatus("./unmount-times-out-dies.app")).toEqual(
        "MOUNTED",
      );

      location.hash = "#not-unmount-times-out";

      return singleSpa.triggerAppChange().then(() => {
        expect(myApp.numUnmounts()).toEqual(1);
        expect(singleSpa.getMountedApps()).toEqual([]);
        expect(singleSpa.getAppStatus("./unmount-times-out-dies.app")).toEqual(
          "SKIP_BECAUSE_BROKEN",
        );
      });
    });
  });
});
