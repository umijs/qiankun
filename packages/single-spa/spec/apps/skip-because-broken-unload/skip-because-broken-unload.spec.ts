import * as singleSpa from "single-spa";

const activeHash = `#skip-because-broken`;

describe(`happy-unload app :`, () => {
  let myApp;

  beforeAll(() => {
    singleSpa.registerApplication(
      "skip-because-broken-unload",
      () => import("./skip-because-broken-unload.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  it(`can unload an app in SKIP_BECAUSE_BROKEN`, async () => {
    location.hash = activeHash;

    await singleSpa.triggerAppChange();

    expect(singleSpa.getAppStatus("skip-because-broken-unload")).toBe(
      singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
    );

    await singleSpa.unloadApplication("skip-because-broken-unload");

    expect(singleSpa.getAppStatus("skip-because-broken-unload")).toBe(
      singleSpa.AppOrParcelStatus.NOT_LOADED,
    );
  });
});
