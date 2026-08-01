import * as singleSpa from "single-spa";

const activeHash = `#mount-rejects`;

describe(`mount-rejects app`, () => {
  let myApp, errs;

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./mount-rejects.app",
      () => import("./mount-rejects.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = `#`;

    errs = [];
    singleSpa.addErrorHandler(handleError);

    return import("./mount-rejects.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  afterEach(() => singleSpa.removeErrorHandler(handleError));

  it(`initializes and mounts, but then is put into SKIP_BECAUSE_BROKEN and never unmounts`, () => {
    location.hash = activeHash;

    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.wasInitialized()).toEqual(true);
      expect(myApp.wasMounted()).toEqual(true);
      expect(singleSpa.getMountedApps()).toEqual([]);
      expect(singleSpa.getAppStatus("./mount-rejects.app")).toEqual(
        "SKIP_BECAUSE_BROKEN",
      );

      location.hash = "#not-mount-rejects";
      return singleSpa.triggerAppChange().then(() => {
        expect(singleSpa.getMountedApps()).toEqual([]);
        expect(singleSpa.getAppStatus("./mount-rejects.app")).toEqual(
          "SKIP_BECAUSE_BROKEN",
        );
      });
    });
  });
});
