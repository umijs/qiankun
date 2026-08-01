import * as singleSpa from "single-spa";

const russellApp = {
  initCount: 0,
  mountCount: 0,
  unmountCount: 0,
  unloadCount: 0,
  init: async () => {
    russellApp.initCount++;
  },
  mount: async () => {
    russellApp.mountCount++;
  },
  unmount: async () => {
    russellApp.unmountCount++;
  },
  unload: async () => {
    russellApp.unloadCount++;
  },
};

const boomApp = {
  initCount: 0,
  mountCount: 0,
  unmountCount: 0,
  unloadCount: 0,
  init: async () => {
    boomApp.initCount++;
  },
  mount: async () => {
    boomApp.mountCount++;
  },
  unmount: async () => {
    boomApp.unmountCount++;
  },
  unload: async () => {
    boomApp.unloadCount++;
  },
};

describe(`events api :`, () => {
  let boom = false;

  beforeAll(() => {
    singleSpa.registerApplication(
      "russell",
      russellApp,
      () => window.location.hash.indexOf("#/russell") === 0,
    );
    singleSpa.registerApplication("boom", boomApp, () => boom);
    singleSpa.start();
  });

  afterEach(async () => {
    russellApp.initCount = 0;
    russellApp.mountCount = 0;
    russellApp.unmountCount = 0;
    russellApp.unloadCount = 0;

    boomApp.initCount = 0;
    boomApp.mountCount = 0;
    boomApp.unmountCount = 0;
    boomApp.unloadCount = 0;

    boom = false;
    location.hash = "#/";
    await singleSpa.triggerAppChange();
  });

  describe(`single-spa:routing-event`, () => {
    beforeEach(() => {
      window.location.hash = ``;
      boom = false;
    });

    it(`is fired on the window whenever the hash changes`, async () => {
      await singleSpa.triggerAppChange(); // start with a clean slate (no previous tests doing anything)

      window.addEventListener("single-spa:routing-event", finishTest);
      window.location.hash = `#/hash-was-changed`;

      let finish;
      await new Promise((r) => (finish = r));

      function finishTest() {
        window.removeEventListener("single-spa:routing-event", finishTest);
        finish();
      }
    });

    it(`is fired on the window whenever the url changes`, async () => {
      await singleSpa.triggerAppChange();
      window.addEventListener("single-spa:routing-event", finishTest);
      window.history.pushState({}, null, `#/push-state-called`);
      let finish;
      await new Promise((r) => (finish = r));

      function finishTest() {
        window.removeEventListener("single-spa:routing-event", finishTest);
        finish();
      }
    });

    // Excluded because of https://github.com/facebook/jest/issues/5620
    xit(`doesn't destroy single-spa when you throw an error inside of an event listener`, async () => {
      const counterFn = jest.fn();
      let finish,
        finishPromise = new Promise((r) => (finish = r));

      process.on("uncaughtException", errHandler);

      // If the counterFn had been called thrice, it means all listener be invoked.
      function doneIfAllListenerHadBeenInvoked() {
        if (counterFn.mock.calls.length === 3) {
          process.off("uncaughtException", errHandler);
          finish();
        }
      }

      function listener() {
        window.removeEventListener("single-spa:routing-event", listener);
        throw Error("Mwahaha I threw an error in an event listener");
      }
      window.addEventListener("single-spa:routing-event", listener);

      function hashchangeListenerWithErr() {
        window.removeEventListener("hashchange", hashchangeListenerWithErr);
        throw Error("Mwahaha I threw an error in an hashchange event listener");
      }
      window.addEventListener("hashchange", hashchangeListenerWithErr);

      function hashchangeListener() {
        counterFn();
        window.removeEventListener("hashchange", hashchangeListener);
        doneIfAllListenerHadBeenInvoked();
      }
      window.addEventListener("hashchange", hashchangeListener);

      try {
        await singleSpa.triggerAppChange();
        window.location.hash = "#/hashchange";
      } catch {
        window.removeEventListener("single-spa:routing-event", listener);
        window.removeEventListener("hashchange", hashchangeListener);
        window.removeEventListener("hashchange", hashchangeListenerWithErr);
        process.off("uncaughtException", errHandler);
        throw err;
      }

      await finishPromise;

      function errHandler(err) {
        counterFn();
        console.error(err);
        doneIfAllListenerHadBeenInvoked();
      }
    });
  });

  describe("single-spa:before-mount-routing-event", () => {
    it(`is fired after before-routing-event but before routing-event`, async () => {
      let firedEvents = [];

      await singleSpa.triggerAppChange(); // start with a clean slate (no previous tests doing anything)
      window.addEventListener(
        "single-spa:before-routing-event",
        beforeRoutingEvent,
      );
      window.addEventListener(
        "single-spa:before-mount-routing-event",
        beforeMountRoutingEvent,
      );
      window.addEventListener("single-spa:routing-event", afterRoutingEvent);

      window.location.hash = `#/hash-was-changed`;
      await singleSpa.triggerAppChange();

      expect(firedEvents).toEqual([
        "before-routing-event",
        "before-mount-routing-event",
        "routing-event",
      ]);

      function beforeRoutingEvent() {
        window.removeEventListener(
          "single-spa:before-routing-event",
          beforeRoutingEvent,
        );
        firedEvents.push("before-routing-event");
      }

      function beforeMountRoutingEvent() {
        window.removeEventListener(
          "single-spa:before-mount-routing-event",
          beforeMountRoutingEvent,
        );
        firedEvents.push("before-mount-routing-event");
      }

      function afterRoutingEvent() {
        window.removeEventListener(
          "single-spa:routing-event",
          afterRoutingEvent,
        );
        firedEvents.push("routing-event");
      }
    });

    it(`is fired after all applications have been unmounted, and before any have been mounted`, async () => {
      await singleSpa.triggerAppChange(); // start with a clean slate (no previous tests doing anything)

      // make sure boomApp is not mounted
      boom = false;

      location.hash = "#/russell";
      await singleSpa.triggerAppChange();

      window.addEventListener(
        "single-spa:before-mount-routing-event",
        listener,
      );

      expect(singleSpa.getAppStatus("russell")).toBe(
        singleSpa.AppOrParcelStatus.MOUNTED,
      );
      expect(russellApp.unmountCount).toBe(0);
      expect(boomApp.mountCount).toBe(0);

      // now mount boomApp
      boom = true;
      location.hash = "#/other";
      await singleSpa.triggerAppChange();

      expect(singleSpa.getAppStatus("russell")).toBe(
        singleSpa.AppOrParcelStatus.NOT_MOUNTED,
      );
      expect(russellApp.unmountCount).toBe(1);
      expect(boomApp.mountCount).toBe(1);

      function listener() {
        window.removeEventListener(
          "single-spa:before-mount-routing-event",
          listener,
        );

        // unmounts have been called
        expect(russellApp.unmountCount).toBe(1);

        // but mounts have not
        expect(boomApp.mountCount).toBe(0);
      }
    });
  });

  describe(`single-spa:app-change`, () => {
    it(`is fired when an app is mounted`, async () => {
      window.location.hash = `#`;

      await singleSpa.triggerAppChange();

      window.addEventListener("single-spa:app-change", finishTest);
      window.location.hash = `#/russell`;

      let finish,
        testFinishPromise = new Promise((r) => (finish = r));

      function finishTest(evt) {
        const {
          detail: { appsByNewStatus, newAppStatuses, totalAppChanges },
        } = evt;
        window.removeEventListener("single-spa:app-change", finishTest);
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.NOT_LOADED].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[
            singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN
          ].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.NOT_MOUNTED].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.MOUNTED].sort(),
        ).toEqual(["russell"].sort());

        expect(totalAppChanges).toBe(1);

        expect(newAppStatuses).toEqual({
          russell: singleSpa.AppOrParcelStatus.MOUNTED,
        });

        finish();
      }

      await singleSpa.triggerAppChange();
      await testFinishPromise;
    });

    it(`is fired with multiple apps that changed`, async () => {
      window.location.hash = `#`;

      await singleSpa.triggerAppChange();
      boom = true; // turn on the boom application
      window.addEventListener("single-spa:app-change", finishTest);
      window.location.hash = `#/russell`;

      let finish,
        testFinishPromise = new Promise((r) => (finish = r));

      function finishTest(evt) {
        window.removeEventListener("single-spa:app-change", finishTest);
        const {
          detail: { appsByNewStatus, newAppStatuses, totalAppChanges },
        } = evt;
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.NOT_LOADED].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[
            singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN
          ].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.NOT_MOUNTED].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.MOUNTED].sort(),
        ).toEqual(["russell", "boom"].sort());

        expect(totalAppChanges).toBe(2);

        expect(newAppStatuses).toEqual({
          russell: singleSpa.AppOrParcelStatus.MOUNTED,
          boom: singleSpa.AppOrParcelStatus.MOUNTED,
        });
        finish();
      }

      await singleSpa.triggerAppChange();
      await testFinishPromise;
    });

    it(`is fired for unmounts`, async () => {
      window.location.hash = `#/russell`;

      await singleSpa.triggerAppChange();
      let finish,
        testFinishPromise = new Promise((r) => (finish = r));
      window.addEventListener("single-spa:app-change", finishTest);
      window.location.hash = `#`;

      function finishTest(evt) {
        window.removeEventListener("single-spa:app-change", finishTest);
        const {
          detail: { appsByNewStatus, newAppStatuses, totalAppChanges },
        } = evt;
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.NOT_LOADED].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[
            singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN
          ].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.MOUNTED].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.NOT_MOUNTED].sort(),
        ).toEqual(["russell"].sort());

        expect(totalAppChanges).toBe(1);

        expect(newAppStatuses).toEqual({
          russell: singleSpa.AppOrParcelStatus.NOT_MOUNTED,
        });
        finish();
      }

      await singleSpa.triggerAppChange();
      await testFinishPromise;
    });

    it(`fires with multiple statuses when things are both mounted and unmounted`, async () => {
      window.location.hash = `#`; // unmount russell
      boom = true; // mount boom

      await singleSpa.triggerAppChange();
      let finish,
        testFinishPromise = new Promise((r) => (finish = r));

      window.addEventListener("single-spa:app-change", finishTest);
      window.location.hash = `#/russell`; // mount russell
      boom = false; // unmount boom

      function finishTest(evt) {
        const {
          detail: { appsByNewStatus, newAppStatuses, totalAppChanges },
        } = evt;
        window.removeEventListener("single-spa:app-change", finishTest);
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.NOT_LOADED].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[
            singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN
          ].sort(),
        ).toEqual([]);
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.NOT_MOUNTED].sort(),
        ).toEqual(["boom"].sort());
        expect(
          appsByNewStatus[singleSpa.AppOrParcelStatus.MOUNTED].sort(),
        ).toEqual(["russell"].sort());

        expect(totalAppChanges).toBe(2);

        expect(newAppStatuses).toEqual({
          boom: singleSpa.AppOrParcelStatus.NOT_MOUNTED,
          russell: singleSpa.AppOrParcelStatus.MOUNTED,
        });
        finish();
      }

      await singleSpa.triggerAppChange();
      await testFinishPromise;
    });

    it(`is not fired when no app is mounted`, async () => {
      let appChangeCalls = 0;
      function failTest() {
        appChangeCalls++;
        window.removeEventListener("single-spa:app-change", failTest);
      }

      window.location.hash = `#`;

      await singleSpa.triggerAppChange();
      await singleSpa.triggerAppChange();
      window.addEventListener("single-spa:app-change", failTest);
      window.location.hash = `#/not-a-real-app`;

      await singleSpa.triggerAppChange();
      window.removeEventListener("single-spa:app-change", failTest);
      expect(appChangeCalls).toBe(0);
    });
  });

  describe(`single-spa:no-app-change`, () => {
    it(`is fired when no app is loaded, initped, mounted, unmounted, or unloaded`, async () => {
      window.location.hash = `#`;

      await singleSpa.triggerAppChange();
      window.addEventListener("single-spa:no-app-change", finishTest);
      window.location.hash = `#not-a-real-app`;
      let finish,
        testFinishPromise = new Promise((r) => (finish = r));

      function finishTest() {
        window.removeEventListener("single-spa:no-app-change", finishTest);
        finish();
      }

      await testFinishPromise;
    });
  });

  describe(`single-spa:before-app-change`, () => {
    it(`is fired before apps will change, and not fired if no apps are changing`, async () => {
      window.location.hash = `#/russell`;

      await singleSpa.triggerAppChange();

      expect(singleSpa.getAppStatus("boom")).toMatch(/NOT_MOUNTED|NOT_LOADED/);
      expect(singleSpa.getAppStatus("russell")).toBe(
        singleSpa.AppOrParcelStatus.MOUNTED,
      );
      window.addEventListener("single-spa:before-app-change", finishTest);
      window.addEventListener("single-spa:before-no-app-change", finishTest);
      boom = true;
      window.location.hash = `#not-a-real-app`;

      let finish;
      await new Promise((resolve) => {
        finish = resolve;
      });

      function finishTest(evt) {
        window.removeEventListener("single-spa:before-app-change", finishTest);
        window.removeEventListener(
          "single-spa:before-no-app-change",
          finishTest,
        );
        expect(evt.type).toBe("single-spa:before-app-change");
        expect(singleSpa.getAppStatus("boom")).toMatch(
          /NOT_MOUNTED|NOT_LOADED/,
        );
        expect(singleSpa.getAppStatus("russell")).toBe(
          singleSpa.AppOrParcelStatus.MOUNTED,
        );
        expect(
          evt.detail.appsByNewStatus[singleSpa.AppOrParcelStatus.MOUNTED],
        ).toEqual(["boom"]);
        expect(
          evt.detail.appsByNewStatus[singleSpa.AppOrParcelStatus.NOT_MOUNTED],
        ).toEqual(["russell"]);
        finish();
      }
    });
  });

  describe(`single-spa:before-no-app-change`, () => {
    it(`is fired before apps will not change, and not fired if apps are changing`, async () => {
      let finish,
        testFinishPromise = new Promise((r) => (finish = r));
      window.location.hash = `#/russell`;

      await singleSpa.triggerAppChange();
      expect(singleSpa.getAppStatus("boom")).toMatch(/NOT_MOUNTED|NOT_LOADED/);
      expect(singleSpa.getAppStatus("russell")).toBe(
        singleSpa.AppOrParcelStatus.MOUNTED,
      );
      window.addEventListener("single-spa:before-no-app-change", finishTest);
      window.addEventListener("single-spa:before-app-change", finishTest);
      await singleSpa.triggerAppChange();

      function finishTest(evt) {
        window.removeEventListener(
          "single-spa:before-no-app-change",
          finishTest,
        );
        window.removeEventListener("single-spa:before-app-change", finishTest);
        expect(evt.type).toEqual("single-spa:before-no-app-change");
        expect(
          evt.detail.appsByNewStatus[singleSpa.AppOrParcelStatus.MOUNTED],
        ).toEqual([]);
        expect(
          evt.detail.appsByNewStatus[singleSpa.AppOrParcelStatus.NOT_MOUNTED],
        ).toEqual([]);
        finish();
      }
      await testFinishPromise;
    });
  });

  describe(`cancelNavigation`, () => {
    it(`allows you to cancel a hash navigation event in the before-routing-event handler`, async () => {
      const beforeRoutingEvent = (evt) => {
        expect(evt.detail.oldUrl).toMatch(/http:\/\/localhost\/(#\/)?/);
        expect(evt.detail.newUrl).toBe("http://localhost/#/russell");

        if (new URL(evt.detail.newUrl).hash === "#/russell") {
          evt.detail.cancelNavigation();
        }
      };

      window.addEventListener(
        "single-spa:before-routing-event",
        beforeRoutingEvent,
      );

      const originalStatus = singleSpa.getAppStatus("russell");
      const originalUrl = window.location.href;

      expect(originalStatus).toMatch(/NOT_MOUNTED|NOT_LOADED/);

      window.location.hash = `#/russell`;

      await singleSpa.triggerAppChange();
      expect(singleSpa.getAppStatus("russell")).toBe(originalStatus);
      expect(window.location.href).toBe(originalUrl);
      window.removeEventListener(
        "single-spa:before-routing-event",
        beforeRoutingEvent,
      );
    });

    it(`allows you to cancel a pushState navigation event in the before-routing-event handler`, async () => {
      await singleSpa.triggerAppChange("/");

      const app = { async mount() {}, async unmount() {} };
      singleSpa.registerApplication({
        name: "cancel-pushstate",
        app,
        activeWhen: "/cancel-pushstate",
      });

      const beforeRoutingEvent = (evt) => {
        window.removeEventListener(
          "single-spa:before-routing-event",
          beforeRoutingEvent,
        );
        expect(evt.detail.oldUrl).toMatch(/http:\/\/localhost\/(#\/)?/);
        expect(evt.detail.newUrl).toBe("http://localhost/cancel-pushstate");

        if (new URL(evt.detail.newUrl).pathname === "/cancel-pushstate") {
          evt.detail.cancelNavigation();
        }
      };

      await singleSpa.triggerAppChange();

      window.addEventListener(
        "single-spa:before-routing-event",
        beforeRoutingEvent,
      );

      const originalStatus = singleSpa.getAppStatus("russell");
      const originalUrl = window.location.href;

      expect(originalStatus).toMatch(/NOT_MOUNTED|NOT_LOADED/);

      singleSpa.navigateToUrl("/cancel-pushstate");

      await singleSpa.triggerAppChange();
      expect(singleSpa.getAppStatus("russell")).toBe(originalStatus);
      expect(window.location.href).toBe(originalUrl);
    });

    it(`does not fire single-spa events during the reroute back to originalUrl after cancelation`, async () => {
      let preCancelation = [],
        postCancelation = [],
        cancelationStarted = false;

      singleSpa.registerApplication({
        name: "cancel-navigation-silent-reroute",
        app: {
          async mount() {},
          async unmount() {},
        },
        activeWhen: ["/"],
      });

      singleSpa.navigateToUrl("/");
      await singleSpa.triggerAppChange();

      window.addEventListener("single-spa:before-routing-event", countEvents);
      window.addEventListener(
        "single-spa:before-mount-routing-event",
        countEvents,
      );
      window.addEventListener("single-spa:before-app-change", countEvents);
      window.addEventListener("single-spa:before-no-app-change", countEvents);
      window.addEventListener("single-spa:app-change", countEvents);
      window.addEventListener("single-spa:no-app-change", countEvents);
      window.addEventListener("single-spa:routing-event", countEvents);

      window.addEventListener(
        "single-spa:before-routing-event",
        cancelTheNavigation,
      );

      let cancelationFinished,
        cancelationFinishedPromise = new Promise(
          (r) => (cancelationFinished = r),
        );

      singleSpa.navigateToUrl("/app1");

      await cancelationFinishedPromise;

      window.removeEventListener(
        "single-spa:before-routing-event",
        countEvents,
      );
      window.removeEventListener(
        "single-spa:before-mount-routing-event",
        countEvents,
      );
      window.removeEventListener("single-spa:before-app-change", countEvents);
      window.removeEventListener(
        "single-spa:before-no-app-change",
        countEvents,
      );
      window.removeEventListener("single-spa:app-change", countEvents);
      window.removeEventListener("single-spa:no-app-change", countEvents);
      window.removeEventListener("single-spa:routing-event", countEvents);
      window.removeEventListener(
        "single-spa:before-routing-event",
        cancelTheNavigation,
      );

      // Give time for single-spa to actually cancel the navigation
      await tick();

      // Cancelation causes two reroutes, and therefore two before-no-app-change and two before-routing-events
      expect(preCancelation).toEqual([
        "single-spa:before-no-app-change",
        "single-spa:before-routing-event",
      ]);
      expect(postCancelation).toEqual([]);
      expect(location.pathname).toEqual("/");

      function countEvents(evt) {
        (cancelationStarted ? postCancelation : preCancelation).push(evt.type);
      }

      function cancelTheNavigation(evt) {
        window.removeEventListener(
          "single-spa:before-routing-event",
          cancelTheNavigation,
        );
        expect(new URL(evt.detail.oldUrl).pathname).toEqual("/");
        expect(new URL(evt.detail.newUrl).pathname).toEqual("/app1");
        evt.detail.cancelNavigation();
        cancelationStarted = true;
        cancelationFinished();
      }
    });

    it(
      `cancels if you call with no arguments`,
      cancelNavigationTest({
        shouldCancel: true,
        cancelValue: undefined,
        name: "undefined-cancel",
      }),
    );

    it(
      `cancels if you call with true`,
      cancelNavigationTest({
        shouldCancel: true,
        cancelValue: true,
        name: "true-cancel",
      }),
    );

    it(
      `cancels if you call with truthy value`,
      cancelNavigationTest({
        shouldCancel: true,
        cancelValue: {},
        name: "truthy-cancel",
      }),
    );

    it(
      `doesn't cancel navigation if you call with false`,
      cancelNavigationTest({
        shouldCancel: false,
        cancelValue: false,
        name: "false-cancel",
      }),
    );

    it(
      `doesn't cancel navigation if you call with null`,
      cancelNavigationTest({
        shouldCancel: false,
        cancelValue: null,
        name: "null-cancel",
      }),
    );

    it(
      `doesn't cancel navigation if you call with falsy value`,
      cancelNavigationTest({
        shouldCancel: false,
        cancelValue: "",
        name: "empty-string-cancel",
      }),
    );

    // https://github.com/single-spa/single-spa/issues/670
    it(
      `allows for async navigation cancelation`,
      cancelNavigationTest({
        shouldCancel: true,
        cancelValue: () => Promise.resolve(true),
        name: "async-cancel",
      }),
    );

    it(
      `allows for delayed, async navigation cancelation`,
      cancelNavigationTest({
        shouldCancel: true,
        cancelValue: () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(true);
            }, 10);
          }),
        name: "async-delayed-cancel",
      }),
    );

    it(
      `doesn't cancel with promise rejection`,
      cancelNavigationTest({
        cancelValue: () => Promise.reject(),
        shouldCancel: false,
        name: "async-cancel-rejection",
      }),
    );

    it(
      `doesn't cancel with promise that resolves with a false value`,
      cancelNavigationTest({
        cancelValue: Promise.resolve(false),
        shouldCancel: false,
        name: "async-cancel-false",
      }),
    );

    it(
      `doesn't cancel with promise that resolves with a falsy value`,
      cancelNavigationTest({
        cancelValue: Promise.resolve(""),
        shouldCancel: false,
        name: "async-cancel-falsy",
      }),
    );

    it(
      `doesn't cancel with promise that resolves with undefined`,
      cancelNavigationTest({
        cancelValue: Promise.resolve(undefined),
        shouldCancel: false,
        name: "async-cancel-undefined",
      }),
    );

    function cancelNavigationTest({ cancelValue, shouldCancel, name }) {
      return async function () {
        singleSpa.registerApplication({
          name,
          app: {
            async mount() {},
            async unmount() {},
          },
          activeWhen: ["/"],
        });

        singleSpa.navigateToUrl("/");
        await singleSpa.triggerAppChange();

        window.addEventListener(
          "single-spa:before-routing-event",
          cancelTheNavigation,
        );

        singleSpa.navigateToUrl("/app1");
        await singleSpa.triggerAppChange();

        window.removeEventListener(
          "single-spa:before-routing-event",
          cancelTheNavigation,
        );

        expect(location.pathname).toEqual(shouldCancel ? "/" : "/app1");

        function cancelTheNavigation(evt) {
          evt.detail.cancelNavigation(
            typeof cancelValue === "function" ? cancelValue() : cancelValue,
          );
        }
      };
    }
  });
});

function tick() {
  return new Promise((r) => setTimeout(r));
}
