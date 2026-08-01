import * as singleSpa from "single-spa";

describe("unregisterApplication", function () {
  let app;
  beforeAll(() => {
    singleSpa.start();
  });

  beforeEach(() => {
    app = {
      mount() {
        return Promise.resolve();
      },
      unmount() {
        return Promise.resolve();
      },
      init() {
        return Promise.resolve();
      },
    };
  });

  it(`should throw an error if no such application exists`, () => {
    expect(() => {
      window.__SINGLE_SPA_DEVTOOLS__.exposedMethods.unregisterApplication(
        `app that doesn't exist`,
      );
    }).toThrow();
  });

  it(`should remove the application so it can be re-registered`, () => {
    singleSpa.registerApplication("about to unregister", app, () => false);
    expect(singleSpa.getAppStatus("about to unregister")).toBeTruthy();

    return singleSpa.unregisterApplication("about to unregister").then(() => {
      expect(singleSpa.getAppStatus("about to unregister")).toBeFalsy();
    });
  });

  // https://github.com/single-spa/single-spa/issues/871
  it(`should immediately unmount and unload the application, rather than waiting for it to naturally unmount and unload`, async () => {
    let mounted = false;
    const slowMountApp = {
      async mount() {
        mounted = true;
        await new Promise((r) => setTimeout(r, 1000));
      },
      async unmount() {
        mounted = false;
      },
    };

    singleSpa.registerApplication({
      name: "about to unregister",
      app: slowMountApp,
      activeWhen: () => true,
    });

    expect(mounted).toBe(false);

    const appChangePromise = singleSpa.triggerAppChange();

    await tick();

    expect(mounted).toBe(true);

    expect(singleSpa.getAppStatus("about to unregister")).toBe(
      singleSpa.AppOrParcelStatus.MOUNTING,
    );

    return singleSpa.unregisterApplication("about to unregister").then(() => {
      expect(singleSpa.getAppNames()).not.toContain("about to unregister");
      expect(mounted).toBe(false);
      return appChangePromise;
    });
  });
});

function tick() {
  return new Promise((r) => setTimeout(r));
}
