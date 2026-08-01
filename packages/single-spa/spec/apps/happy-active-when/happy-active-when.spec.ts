import * as singleSpa from "single-spa";

describe(`happy-active-when`, () => {
  let myApp;

  beforeAll(() => {
    singleSpa.registerApplication({
      name: "myApp",
      app: () => import("./happy-active-when.app"),
      activeWhen: [
        "/#/appWithRegularPrefix",
        "/pathname",
        (location) =>
          location.pathname === "/specificCriteria/anything/everything",
        "/#/hashResource/:id/hashSubResource/:hashSubResourceId",
        "/resource/:id/subresource/:subId",
        "pathname/#/subpath/:dynamic/another",
      ],
    });
  });

  beforeEach(() => {
    return import("./happy-active-when.app")
      .then((app) => (myApp = app))
      .then((app) => app.reset());
  });

  it(`goes through the whole lifecycle successfully on multiple activeWhen conditions`, async () => {
    singleSpa.start();
    expect(myApp.isMounted()).toEqual(false);
    expect(singleSpa.getMountedApps()).toEqual([]);

    const validPaths = [
      "/pathname",
      "/#/appWithRegularPrefix",
      "/specificCriteria",
      "/resource/1/subresource/1",
      "/#/hashResource/1/hashSubResource/1",
      "pathname/#/subpath/1/another",
    ];

    for (let index = 0; index < validPaths.length; index++) {
      singleSpa.navigateToUrl(validPaths[index] + "/anything/everything");
      await singleSpa.triggerAppChange();
      expectMyAppToBeMounted();

      singleSpa.navigateToUrl("/#/unregisteredPath");
      await singleSpa.triggerAppChange();
      expectMyAppToBeUnmounted();
    }
  });

  function expectMyAppToBeMounted() {
    expect(myApp.wasInitialized()).toEqual(true);
    expect(myApp.isMounted()).toEqual(true);
    expect(singleSpa.getMountedApps()).toEqual(["myApp"]);
  }

  function expectMyAppToBeUnmounted() {
    expect(myApp.wasInitialized()).toEqual(true);
    expect(myApp.isMounted()).toEqual(false);
    expect(singleSpa.getMountedApps()).toEqual([]);
  }
});
