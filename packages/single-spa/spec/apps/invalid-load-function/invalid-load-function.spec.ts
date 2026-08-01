import * as singleSpa from "single-spa";

describe(`invalid-load-function`, () => {
  let errs = [];

  function handleError(err) {
    errs.push(err);
  }

  beforeEach(() => {
    location.hash = "#";
    errs = [];
    singleSpa.addErrorHandler(handleError);
  });

  afterEach(() => {
    location.hash = "#";
    singleSpa.removeErrorHandler(handleError);
  });

  it("Dies if the load function returns nothing", () => {
    function loadFunction() {
      // return nothing
    }
    singleSpa.registerApplication(
      "invalid-load-1",
      loadFunction,
      (location) => location.hash === "#invalid-load-function",
    );

    location.hash = "#invalid-load-function";

    return singleSpa.triggerAppChange().then(() => {
      expect(errs.length).toBeGreaterThan(0);
      expect(errs[0].appOrParcelName).toBe("invalid-load-1");
      expect(
        errs[0].message.indexOf(
          "single-spa loading function did not return a promise. Check the second argument to registerApplication",
        ),
      ).toBeGreaterThan(-1);
      expect(singleSpa.getAppStatus("invalid-load-1")).toBe(
        singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
      );
    });
  });

  it("Dies if the load function returns a function instead of a promise", () => {
    function loadFunction() {
      // return nothing
    }
    singleSpa.registerApplication(
      "invalid-load-2",
      loadFunction,
      (location) => location.hash === "#invalid-load-function",
    );

    location.hash = "#invalid-load-function";

    return singleSpa.triggerAppChange().then(() => {
      expect(errs.length).toBeGreaterThan(0);
      expect(errs[0].appOrParcelName).toBe("invalid-load-2");
      expect(
        errs[0].message.indexOf(
          "single-spa loading function did not return a promise. Check the second argument to registerApplication",
        ),
      ).toBeGreaterThan(-1);
      expect(singleSpa.getAppStatus("invalid-load-2")).toBe(
        singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
      );
    });
  });

  it("Dies if the load function returns a non-thenable object", () => {
    function loadFunction() {
      // return nothing
    }
    singleSpa.registerApplication(
      "invalid-load-3",
      loadFunction,
      (location) => location.hash === "#invalid-load-function",
    );

    location.hash = "#invalid-load-function";

    return singleSpa.triggerAppChange().then(() => {
      expect(errs.length).toBeGreaterThan(0);
      expect(errs[0].appOrParcelName).toBe("invalid-load-3");
      expect(
        errs[0].message.indexOf(
          "single-spa loading function did not return a promise. Check the second argument to registerApplication",
        ),
      ).toBeGreaterThan(-1);
      expect(singleSpa.getAppStatus("invalid-load-3")).toBe(
        singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
      );
    });
  });

  it("It retries loading an application that previously failed", () => {
    let count = 0;
    function loadFunction() {
      count++;
      if (count === 1) return Promise.reject(`It didn't load`);
      else
        return Promise.resolve({
          init: () => new Promise(),
          mount: () => new Promise(),
          unmount: () => new Promise(),
        });
    }
    singleSpa.registerApplication("invalid-load-4", loadFunction, (location) =>
      location.hash.includes("#invalid-load-function"),
    );

    location.hash = "#invalid-load-function";

    return singleSpa.triggerAppChange().then(() => {
      expect(errs.length).toBeGreaterThan(0);
      expect(errs[0].appOrParcelName).toBe("invalid-load-4");
      expect(errs[0].message.indexOf(`It didn't load`)).toBeGreaterThan(-1);

      location.hash = "#invalid-load-function-1";

      return new Promise((resolve) => setTimeout(resolve, 201)).then(() =>
        singleSpa.triggerAppChange().then(() => {
          expect(singleSpa.getAppStatus("invalid-load-4")).toBe(
            singleSpa.AppOrParcelStatus.NOT_INITIALIZED,
          );
        }),
      );
    });
  });
});
