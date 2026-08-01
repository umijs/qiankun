import * as singleSpa from "single-spa";

describe(`delayed-start`, () => {
  let myApp;

  // https://github.com/single-spa/single-spa/issues/555
  it("will mount an application that began loading before start() was called", async () => {
    let loadPromise;

    singleSpa.registerApplication({
      name: "delayed-start",
      app: () =>
        (loadPromise = (async () => {
          // wait a tick before resolving the promise
          await tick();
          return await import("./delayed-start.app");
        })()),
      activeWhen: () => true,
    });

    expect(singleSpa.getAppStatus("delayed-start")).toBe(
      singleSpa.AppOrParcelStatus.NOT_LOADED,
    );

    await tick();

    expect(singleSpa.getAppStatus("delayed-start")).toBe(
      singleSpa.AppOrParcelStatus.LOADING_SOURCE_CODE,
    );

    await singleSpa.triggerAppChange();

    expect(singleSpa.getAppStatus("delayed-start")).toBe(
      singleSpa.AppOrParcelStatus.NOT_INITIALIZED,
    );

    singleSpa.start();

    await Promise.all([loadPromise, routingEvent()]);

    // Before fixing https://github.com/single-spa/single-spa/issues/555,
    // this assertion failed - status was NOT_initPED
    expect(singleSpa.getAppStatus("delayed-start")).toBe(
      singleSpa.AppOrParcelStatus.MOUNTED,
    );
  });
});

function tick() {
  return new Promise((resolve) => {
    setTimeout(resolve);
  });
}

function routingEvent() {
  return new Promise((resolve) => {
    window.addEventListener("single-spa:routing-event", handleEvent);
    function handleEvent() {
      window.removeEventListener("single-spa:routing-event", handleEvent);
      resolve();
    }
  });
}
