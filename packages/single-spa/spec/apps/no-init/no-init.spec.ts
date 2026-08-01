import * as singleSpa from "single-spa";

const activeHash = "#no-init";

describe(`no-init app`, () => {
  let myApp;

  beforeAll(() => {
    singleSpa.registerApplication({
      name: "no-init",
      app: () => import("./no-init.app"),
      activeWhen: (location) => location.hash === activeHash,
    });
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "#";
  });

  it(`allows an application to omit the init lifecycle`, async () => {
    expect(singleSpa.getAppStatus("no-init")).toBe(
      singleSpa.AppOrParcelStatus.NOT_LOADED,
    );

    location.hash = activeHash;

    await singleSpa.triggerAppChange();

    expect(singleSpa.getAppStatus("no-init")).toBe(
      singleSpa.AppOrParcelStatus.MOUNTED,
    );
  });
});
