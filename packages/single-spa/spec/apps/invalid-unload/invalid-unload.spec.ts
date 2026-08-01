import * as singleSpa from "single-spa";

const activeHash = `#invalid-unload`;

describe(`invalid-unload app :`, () => {
  let myApp, errs;

  function handleError(err) {
    errs.push(err);
  }

  beforeAll(() => {
    singleSpa.registerApplication(
      "./invalid-unload.app",
      () => import("./invalid-unload.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "";

    errs = [];
    singleSpa.addErrorHandler(handleError);

    return singleSpa.triggerAppChange();
  });

  afterEach(() => singleSpa.removeErrorHandler(handleError));

  it(`throws an error if you call unloadApplication incorrectly`, () => {
    expect(() => {
      // The parameters are in the reverse order
      singleSpa.unloadApplication({ waitForUnmount }, "./invalid-unload.app");
    }).toThrow();

    expect(() => {
      // Trying to unload an app that doesn't exist
      singleSpa.unloadApplication("App that doesn't exist");
    }).toThrow();
  });

  it(`puts the app into SKIP_BECAUSE_BROKEN because it has an incorrect unload lifecycle`, () => {
    location.hash = activeHash;
    return singleSpa
      .triggerAppChange()
      .then(() => {
        // The unload lifecycle hasn't been called yet, so single-spa doesn't know it is a bad impl yet.
        expect(singleSpa.getAppStatus("./invalid-unload.app")).toBe("MOUNTED");
        return singleSpa.unloadApplication("./invalid-unload.app");
      })
      .then(() => {
        fail(
          `unloadApplication() should have rejected the promise it returned because the app has a bad implementation of the unload lifecycle`,
        );
      })
      .catch((err) => {
        // Now the unload lifecycle has been called and has been determined to be invalid
        expect(singleSpa.getAppStatus("./invalid-unload.app")).toBe(
          "SKIP_BECAUSE_BROKEN",
        );
      });
  });
});
