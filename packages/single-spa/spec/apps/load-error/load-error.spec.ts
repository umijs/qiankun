import * as singleSpa from "single-spa";

describe(`load-error`, () => {
  it(`will mount an application before loading another application finishes`, async () => {
    singleSpa.addErrorHandler(handleError);
    singleSpa.registerApplication(
      "load-error",
      () => Promise.reject(Error(`load failed`)),
      (location) => location.hash === "#load-error",
    );
    location.hash = "#load-error";
    await singleSpa.triggerAppChange();
    expect(singleSpa.getAppStatus("load-error")).toBe(
      singleSpa.AppOrParcelStatus.LOAD_ERROR,
    );
    singleSpa.removeErrorHandler(handleError);

    function handleError(err) {
      console.error(err);
    }
  });

  it(`puts app into LOAD_ERROR status before firing error event`, async () => {
    let numErrs = 0;

    await singleSpa.triggerAppChange();
    singleSpa.addErrorHandler(handleError);

    singleSpa.registerApplication(
      "load-error-2",
      () => Promise.reject(Error(`load failed`)),
      (location) => location.hash === "#load-error-2",
    );
    location.hash = "#load-error-2";
    await singleSpa.triggerAppChange();
    singleSpa.removeErrorHandler(handleError);
    expect(numErrs).toBe(1);

    function handleError(evt) {
      numErrs++;
      const appName = evt.appOrParcelName;
      expect(singleSpa.getAppStatus(appName)).toBe(
        singleSpa.AppOrParcelStatus.LOAD_ERROR,
      );
    }
  });

  it(`lets you unload an application that is in LOAD_ERROR status`, async () => {
    await singleSpa.triggerAppChange();

    singleSpa.addErrorHandler(errHandler);

    singleSpa.registerApplication({
      name: "load-error-unload",
      app: () => Promise.reject(Error("load failed")),
      activeWhen: ["#load-error-unload"],
    });

    location.hash = "#load-error-unload";

    await singleSpa.triggerAppChange();

    expect(singleSpa.getAppStatus("load-error-unload")).toBe(
      singleSpa.AppOrParcelStatus.LOAD_ERROR,
    );

    const unloadPromise = singleSpa.unloadApplication("load-error-unload");
    location.hash = "#no-longer-active";

    await singleSpa.triggerAppChange();

    await unloadPromise;

    expect(singleSpa.getAppStatus("load-error-unload")).toBe(
      singleSpa.AppOrParcelStatus.NOT_LOADED,
    );

    function errHandler() {
      singleSpa.removeErrorHandler(errHandler);
    }
  });

  it(`doesn't try to reload an application that should not be active`, async () => {
    let numLoads = 0;
    await singleSpa.triggerAppChange();
    singleSpa.addErrorHandler(handleError);
    singleSpa.registerApplication({
      name: "load-error-3",
      app: async () => {
        numLoads++;
        throw Error("this app never loads");
      },
      activeWhen: ["#load-error-3"],
    });

    location.hash = "#load-error-3";

    expect(numLoads).toBe(0);
    await singleSpa.triggerAppChange();
    expect(numLoads).toBe(1);

    location.hash = "#something-else";

    await singleSpa.triggerAppChange();
    expect(numLoads).toBe(1);
    // single-spa retries loading apps in LOAD_ERROR state after 200ms
    await twoHundredMs();
    await singleSpa.triggerAppChange();
    expect(numLoads).toBe(1);
    singleSpa.removeErrorHandler(handleError);

    function handleError(err) {
      console.error(err);
    }
  });
});

function twoHundredMs() {
  return new Promise((resolve) => {
    setTimeout(resolve, 205);
  });
}
