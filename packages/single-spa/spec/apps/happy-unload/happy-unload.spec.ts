import * as singleSpa from "single-spa";

const activeHash = `#happy-unload`;

describe(`happy-unload app :`, () => {
  let myApp;

  beforeAll(() => {
    singleSpa.registerApplication(
      "./happy-unload.app",
      () => import("./happy-unload.app"),
      (location) => location.hash === activeHash,
    );
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = "";

    return import("./happy-unload.app")
      .then((app) => (myApp = app))
      .then(() => singleSpa.unloadApplication("./happy-unload.app"))
      .then(() => singleSpa.triggerAppChange())
      .then(() => myApp.reset());
  });

  describe(`when waitForUnmount = false :`, () => {
    it(`unloads an app that is mounted, and then remounts it`, () => {
      location.hash = activeHash;

      return singleSpa
        .triggerAppChange()
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "MOUNTED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(0);
          expect(myApp.getNumUnloadCalls()).toBe(0);
          location.hash = "#";
          return singleSpa.unloadApplication("./happy-unload.app");
        })
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "NOT_LOADED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(1);
          expect(myApp.getNumUnloadCalls()).toBe(1);
          return singleSpa.triggerAppChange();
        })
        .then(() => {
          window.location.hash = activeHash;
          return singleSpa.triggerAppChange();
        })
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "MOUNTED",
          );
          expect(myApp.getNumInitCalls()).toBe(2);
          expect(myApp.getNumMountCalls()).toBe(2);
          expect(myApp.getNumUnmountCalls()).toBe(1);
          expect(myApp.getNumUnloadCalls()).toBe(1);
        });
    });

    it(`unloads an app that isn't loaded, and then keeps it in NOT_LOADED status`, () => {
      return singleSpa
        .triggerAppChange()
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "NOT_LOADED",
          );
          expect(myApp.getNumInitCalls()).toBe(0);
          expect(myApp.getNumMountCalls()).toBe(0);
          expect(myApp.getNumUnmountCalls()).toBe(0);
          expect(myApp.getNumUnloadCalls()).toBe(0);

          window.location.hash = activeHash;
          return singleSpa.triggerAppChange();
        })
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "MOUNTED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(0);
          expect(myApp.getNumUnloadCalls()).toBe(0);

          window.location.hash = "#";
          return singleSpa.triggerAppChange();
        })
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "NOT_MOUNTED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(1);
          expect(myApp.getNumUnloadCalls()).toBe(0);
          return singleSpa.unloadApplication("./happy-unload.app");
        })
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "NOT_LOADED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(1);
          expect(myApp.getNumUnloadCalls()).toBe(1);
        });
    });

    it(`is a no-op if the app is NOT_LOADED when you call unloadApplication on it`, () => {
      return singleSpa
        .triggerAppChange()
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "NOT_LOADED",
          );
          expect(myApp.getNumInitCalls()).toBe(0);
          expect(myApp.getNumMountCalls()).toBe(0);
          expect(myApp.getNumUnmountCalls()).toBe(0);
          expect(myApp.getNumUnloadCalls()).toBe(0);
        })
        .then(() => singleSpa.unloadApplication("./happy-unload.app"))
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "NOT_LOADED",
          );
          expect(myApp.getNumInitCalls()).toBe(0);
          expect(myApp.getNumMountCalls()).toBe(0);
          expect(myApp.getNumUnmountCalls()).toBe(0);
          expect(myApp.getNumUnloadCalls()).toBe(0);
        });
    });

    it(`immediately unloads apps in NOT_MOUNTED status, and then puts them into NOT_LOADED status (ready for next time they are activated)`, () => {
      window.location.hash = activeHash;

      return singleSpa
        .triggerAppChange()
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "MOUNTED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(0);
          expect(myApp.getNumUnloadCalls()).toBe(0);

          window.location.hash = "#";
          return singleSpa.triggerAppChange();
        })
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "NOT_MOUNTED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(1);
          expect(myApp.getNumUnloadCalls()).toBe(0);
          return singleSpa.unloadApplication("./happy-unload.app");
        })
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "NOT_LOADED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(1);
          expect(myApp.getNumUnloadCalls()).toBe(1);

          window.location.hash = activeHash;
          return singleSpa.triggerAppChange();
        })
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "MOUNTED",
          );
          expect(myApp.getNumInitCalls()).toBe(2);
          expect(myApp.getNumMountCalls()).toBe(2);
          expect(myApp.getNumUnmountCalls()).toBe(1);
          expect(myApp.getNumUnloadCalls()).toBe(1);
        });
    });
  });

  describe(`when waitForUnmount = true :`, () => {
    it(`delays unloading the app until the app is no longer active`, () => {
      window.location.hash = activeHash;

      let originalUnloadPromise;

      return singleSpa
        .triggerAppChange()
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "MOUNTED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(0);
          expect(myApp.getNumUnloadCalls()).toBe(0);

          originalUnloadPromise = singleSpa
            .unloadApplication("./happy-unload.app", {
              waitForUnmount: true,
            })
            .then(() => {
              /* This will get called only once the app is unloaded. And it will not
               * wait for the app to get remounted before it is called.
               */
              expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
                "NOT_LOADED",
              );

              expect(myApp.getNumInitCalls()).toBe(1);
              expect(myApp.getNumMountCalls()).toBe(1);
              expect(myApp.getNumUnmountCalls()).toBe(1);
              expect(myApp.getNumUnloadCalls()).toBe(1);
            });

          /* Triggering an app change after calling unloadApplication will
           * not cause the app to unload, since it is still mounted and we set
           * waitForUnmount: true.
           */
          return singleSpa.triggerAppChange();
        })
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "MOUNTED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(0);
          expect(myApp.getNumUnloadCalls()).toBe(0);

          window.location.hash = `#`;
          return singleSpa.triggerAppChange();
        })
        .then(() => {
          expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual(
            "NOT_LOADED",
          );
          expect(myApp.getNumInitCalls()).toBe(1);
          expect(myApp.getNumMountCalls()).toBe(1);
          expect(myApp.getNumUnmountCalls()).toBe(1);
          expect(myApp.getNumUnloadCalls()).toBe(1);

          return originalUnloadPromise;
        });
    });
  });

  it(`resolves the promise for all callers to unloadApplication when the app is unloaded`, () => {
    window.location.hash = activeHash;

    let firstCallerResolved = false,
      secondCallerResolved = false;

    return singleSpa
      .triggerAppChange()
      .then(() => {
        expect(singleSpa.getAppStatus("./happy-unload.app")).toEqual("MOUNTED");
        expect(myApp.getNumInitCalls()).toBe(1);
        expect(myApp.getNumMountCalls()).toBe(1);
        expect(myApp.getNumUnmountCalls()).toBe(0);
        expect(myApp.getNumUnloadCalls()).toBe(0);
      })
      .then(() => {
        // First caller to unloadApplication wants to waitForUnmount
        const promise1 = singleSpa.unloadApplication("./happy-unload.app", {
          waitForUnmount: true,
        });

        // Second caller to unloadApplication doesn't want to waitForUnmount
        const promise2 = singleSpa.unloadApplication("./happy-unload.app", {
          waitForUnmount: false,
        });

        return Promise.all([promise1, promise2]);
      });
  });
});
