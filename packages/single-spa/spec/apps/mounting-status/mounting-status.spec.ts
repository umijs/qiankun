import * as singleSpa from "single-spa";

const activeHash = "#mounting-status";

describe(`mounting-status`, () => {
  let app;

  beforeAll(async () => {
    singleSpa.registerApplication({
      name: "mounting-status",
      app: () => import("./mounting-status.app"),
      activeWhen: (location) => location.hash === activeHash,
    });
    singleSpa.start();

    app = await import("./mounting-status.app");
  });

  beforeEach(() => {
    location.hash = "#";
  });

  it(`puts application into MOUNTING status when it's mounting`, async () => {
    await singleSpa.triggerAppChange();

    let mountStartResolve,
      mountStartPromise = new Promise((r) => (mountStartResolve = r));
    app.getEventTarget().addEventListener("mount-start", mountStartResolve);

    expect(singleSpa.getAppStatus("mounting-status")).toEqual(
      singleSpa.AppOrParcelStatus.NOT_LOADED,
    );
    singleSpa.navigateToUrl(activeHash);
    const routingPromise = singleSpa.triggerAppChange();

    await mountStartPromise;
    expect(singleSpa.getAppStatus("mounting-status")).toEqual(
      singleSpa.AppOrParcelStatus.MOUNTING,
    );

    await routingPromise;
    expect(singleSpa.getAppStatus("mounting-status")).toEqual(
      singleSpa.AppOrParcelStatus.MOUNTED,
    );

    app.getEventTarget().removeEventListener("mount-start", mountStartResolve);
  });
});
