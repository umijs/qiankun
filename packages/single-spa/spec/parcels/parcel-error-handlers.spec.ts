import * as singleSpa from "single-spa";

describe("parcel errors", () => {
  beforeAll(() => {
    singleSpa.start();
  });

  describe("lifecycle errors", () => {
    describe("initialize errors", () => {
      it(`should throw an error when initializing fails`, async () => {
        const app = createApp();
        let shouldAppBeMounted = true;

        singleSpa.registerApplication(
          "parcel-initialize-errors",
          app,
          () => shouldAppBeMounted,
        );
        await singleSpa.triggerAppChange();
        expect(app.mountCalls).toBe(1);

        const parcelConfig1 = createParcelConfig("initialize");
        parcelConfig1.name = "initialize-error";
        const parcel1 = app.mountProps.mountParcel(parcelConfig1, {
          domElement: document.createElement("div"),
        });

        // avoid unhandled rejection causing test failure
        parcel1.mountPromise.catch((err) => {});

        await parcel1.initPromise.catch((err) => {
          expect(err.appOrParcelName).toBe("initialize-error");
          expect(err.message).toMatch(`INITIALIZING`);
          expect(err.message.indexOf(`init-error`)).toBeGreaterThan(-1);
          expect(parcel1.getStatus()).toBe("SKIP_BECAUSE_BROKEN");
        });
      });
    });

    describe("mount errors", () => {
      it(`should throw an error when mounting fails`, async () => {
        const app = createApp();
        let shouldAppBeMounted = true;

        singleSpa.registerApplication(
          "parcel-mount-errors",
          app,
          () => shouldAppBeMounted,
        );
        await singleSpa.triggerAppChange();
        expect(app.mountCalls).toBe(1);

        const parcelConfig1 = createParcelConfig("mount");
        parcelConfig1.name = "mount-error";
        const parcel1 = app.mountProps.mountParcel(parcelConfig1, {
          domElement: document.createElement("div"),
        });
        try {
          await parcel1.mountPromise;
          throw Error("Mount should have failed");
        } catch (err) {
          expect(err.appOrParcelName).toBe("mount-error");
          expect(err.message).toMatch("NOT_MOUNTED");
          expect(parcel1.getStatus()).toBe(
            singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
          );
        }
      });
    });

    describe("update errors", () => {
      it(`should throw an error if you call update on a parcel does not implement the 'update' lifecycle`, () => {
        const parcelConfig = createParcelConfig();
        const parcel = singleSpa.mountRootParcel(parcelConfig, {
          domElement: document.createElement("div"),
        });

        return parcel.mountPromise.then(() => {
          expect(() => parcel.update({})).toThrow();
        });
      });
    });

    describe("ummount errors", () => {
      describe(`parcel unmount itself errors`, () => {
        it(`should throw an error that you can catch when a parcel fails to unmount outside an app lifecycle`, async () => {
          const app = createApp();
          let shouldAppBeMounted = true;

          singleSpa.registerApplication(
            "parcel-unmount-parcel-errors",
            app,
            () => shouldAppBeMounted,
          );
          await singleSpa.triggerAppChange();

          expect(app.mountCalls).toBe(1);

          const parcelConfig1 = createParcelConfig("unmount");
          parcelConfig1.name = "unmount-error1";
          const parcel1 = app.mountProps.mountParcel(parcelConfig1, {
            domElement: document.createElement("div"),
          });

          // avoid unhandled rejections causing test failures
          parcel1.unmountPromise.catch((err) => {});

          await parcel1.mountPromise;
          expect(parcel1.getStatus()).toBe("MOUNTED");
          expect(parcelConfig1.initCalls).toBe(1);
          expect(parcelConfig1.mountCalls).toBe(1);
          expect(parcelConfig1.unmountCalls).toBe(0);

          // avoid unhandled rejection errors
          parcel1.unmount().catch((err) => {});

          expect(parcelConfig1.unmountCalls).toBe(0);
          try {
            await parcel1.unmountPromise;
          } catch (err) {
            expect(err.appOrParcelName).toBe("unmount-error1");
            expect(err.message.indexOf(`UNMOUNTING`)).toBeGreaterThan(-1);
            expect(err.message.indexOf(`unmount-error1`)).toBeGreaterThan(-1);
          }
          expect(parcel1.getStatus()).toBe("SKIP_BECAUSE_BROKEN");
        });
      });

      describe(`parcel unmounted by app unmount errors`, () => {
        let errs;

        function handleError(err) {
          errs.push(err);
        }

        beforeEach(() => {
          errs = [];
          singleSpa.addErrorHandler(handleError);
        });

        afterEach(() => {
          expect(singleSpa.removeErrorHandler(handleError)).toBe(true);
        });

        it(`should throw an error when unmounting a parcel fails during app unmount`, async () => {
          const app = createApp();
          let shouldAppBeMounted = true;

          singleSpa.registerApplication(
            "app-parcel-unmount-errors",
            app,
            () => shouldAppBeMounted,
          );

          await singleSpa.triggerAppChange();
          expect(app.mountCalls).toBe(1);

          const parcelConfig1 = createParcelConfig("unmount");
          parcelConfig1.name = "unmount-error2";
          const parcel1 = app.mountProps.mountParcel(parcelConfig1, {
            domElement: document.createElement("div"),
          });

          // avoid unhandled rejection causing test failures
          parcel1.unmountPromise.catch((err) => {});

          await parcel1.mountPromise;
          expect(parcelConfig1.initCalls).toBe(1);
          expect(parcelConfig1.mountCalls).toBe(1);
          expect(parcelConfig1.unmountCalls).toBe(0);

          shouldAppBeMounted = false;
          await singleSpa.triggerAppChange();

          try {
            await parcel1.unmountPromise;
            throw Error("Expected unmount error");
          } catch (err) {
            expect(err.appOrParcelName).toBe("unmount-error2");
            expect(err.message.indexOf(`UNMOUNTING`)).toBeGreaterThan(-1);
            expect(err.message.indexOf(`unmount-error2`)).toBeGreaterThan(-1);
          }

          expect(errs.length).toBe(1);
          expect(errs[0].appOrParcelName).toBe("app-parcel-unmount-errors");
          expect(errs[0].message).toMatch(
            /application 'app-parcel-unmount-errors' died in status NOT_MOUNTED: parcel 'unmount-error2' died in status UNMOUNTING: unmount error/,
          );
        });
      });
    });
  });

  describe(`invalid config`, () => {
    it(`throws an error immediately if you don't provide a config object`, () => {
      expect(() => {
        singleSpa.mountRootParcel(null, {
          domElement: document.createElement("div"),
        });
      }).toThrow();
    });

    it(`throws if your loading function doesn't return a valid config promise`, () => {
      expect(() => {
        // loading function should return promise
        singleSpa.mountRootParcel(() => createParcelConfig(), {
          domElement: document.createElement("div"),
        });
      }).toThrow();
    });

    it(`rejects the load promise if loading function returns a promise that resolves with undefined`, async () => {
      const parcel = singleSpa.mountRootParcel(() => Promise.resolve(), {
        domElement: document.createElement("div"),
      });

      // avoid unhandled rejection errors
      parcel.initPromise.catch((err) => {});
      parcel.mountPromise.catch((err) => {});

      try {
        await parcel.loadPromise;
        throw new Error("load promise should not have succeeded");
      } catch (err) {
        expect(
          err.message.indexOf("did not resolve with a parcel config"),
        ).toBeGreaterThan(-1);
      }
    });

    it(`rejects the load promise if the config doesn't have a valid mount function`, async () => {
      const parcel = singleSpa.mountRootParcel(
        { init() {}, unmount() {} },
        { domElement: document.createElement("div") },
      );

      // avoid unhandled rejection errors
      parcel.initPromise.catch((err) => {});
      parcel.mountPromise.catch((err) => {});

      try {
        await parcel.loadPromise;
        throw new Error("load promise should not have succeeded");
      } catch (err) {
        expect(
          err.message.indexOf("must have a valid mount function"),
        ).toBeGreaterThan(-1);
      }
    });

    it(`rejects the load promise if the config doesn't have a valid unmount function`, async () => {
      const parcel = singleSpa.mountRootParcel(
        { init() {}, mount() {} },
        { domElement: document.createElement("div") },
      );

      // avoid unhandled rejection errors
      parcel.initPromise.catch((err) => {});
      parcel.mountPromise.catch((err) => {});

      try {
        await parcel.loadPromise;
        throw new Error("load promise should not have succeeded");
      } catch (err) {
        expect(
          err.message.indexOf("must have a valid unmount function"),
        ).toBeGreaterThan(-1);
      }
    });
  });
});

function createApp() {
  const app = {
    initCalls: 0,
    init() {
      app.initCalls++;
      return Promise.resolve();
    },
    mountCalls: 0,
    mountProps: null,
    mount(props) {
      app.mountCalls++;
      app.mountProps = props;
      return Promise.resolve();
    },
    unmountCalls: 0,
    unmount() {
      app.unmountCalls++;
      return Promise.resolve();
    },
  };

  return app;
}

function createParcelConfig(errLocation) {
  const parcelConfig = {
    initCalls: 0,
    init() {
      if (errLocation === "init") {
        return delayedSettle(Promise.reject(new Error("init error")));
      } else {
        parcelConfig.initCalls++;
        return delayedSettle(Promise.resolve());
      }
    },
    mountCalls: 0,
    mountProps: null,
    mount(props) {
      if (errLocation === "mount") {
        return delayedSettle(Promise.reject(new Error("mount error")));
      } else {
        parcelConfig.mountCalls++;
        parcelConfig.mountProps = props;
        return delayedSettle(Promise.resolve());
      }
    },
    unmountCalls: 0,
    unmount() {
      if (errLocation === "unmount") {
        return delayedSettle(Promise.reject(new Error("unmount error")));
      } else {
        parcelConfig.unmountCalls++;
        return delayedSettle(Promise.resolve());
      }
    },
  };

  return parcelConfig;
}

function delayedSettle(promise) {
  // avoid the promise rejection failing the jest test
  promise.catch((err) => {});

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(promise);
    });
  });
}
