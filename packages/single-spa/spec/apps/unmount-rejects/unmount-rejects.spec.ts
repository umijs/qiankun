import * as singleSpa from "single-spa";

const activeHash = `#unmount-rejects`;

describe(`unmount-rejects app`, () => {
  let myApp, errs;

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./unmount-rejects.app",
      () => import("./unmount-rejects.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "#";

    errs = [];
    singleSpa.addErrorHandler(handleError);

    return import("./unmount-rejects.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  afterEach(() => singleSpa.removeErrorHandler(handleError));

  it(`initializes and mounts, but then is put into SKIP_BECAUSE_BROKEN once it unmounts`, () => {
    location.hash = activeHash;

    return singleSpa.triggerAppChange().then(() => {
      expect(myApp.numInits()).toEqual(1);
      expect(myApp.numMounts()).toEqual(1);
      expect(myApp.numUnmounts()).toEqual(0);
      expect(singleSpa.getMountedApps()).toEqual(["./unmount-rejects.app"]);
      expect(singleSpa.getAppStatus("./unmount-rejects.app")).toEqual(
        "MOUNTED",
      );

      location.hash = "#not-unmount-rejects";

      return singleSpa.triggerAppChange().then(() => {
        expect(myApp.numUnmounts()).toEqual(1);
        expect(singleSpa.getMountedApps()).toEqual([]);
        expect(singleSpa.getAppStatus("./unmount-rejects.app")).toEqual(
          "SKIP_BECAUSE_BROKEN",
        );

        location.hash = "#unmount-rejects";

        return singleSpa.triggerAppChange().then(() => {
          // it shouldn't be mounted again
          expect(myApp.numMounts()).toEqual(1);
          expect(singleSpa.getMountedApps()).toEqual([]);
          expect(singleSpa.getAppStatus("./unmount-rejects.app")).toEqual(
            "SKIP_BECAUSE_BROKEN",
          );
        });
      });
    });
  });
});
