import * as singleSpa from "single-spa";

describe("applications mounting parcels :", () => {
  let parcelConfig, shouldAppBeMounted, app;

  beforeAll(() => {
    singleSpa.start();
  });

  beforeEach(() => {
    parcelConfig = null;
    shouldAppBeMounted = false;

    app = {
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
  });

  it(`can mount and unmount a parcel (happy path)`, () => {
    let shouldAppBeMounted = false;
    singleSpa.registerApplication(
      "parcel-happy-1",
      app,
      () => shouldAppBeMounted,
    );

    parcelConfig = createParcelConfig();

    shouldAppBeMounted = true;

    expect(app.initCalls).toBe(0);
    expect(app.mountCalls).toBe(0);
    expect(app.unmountCalls).toBe(0);

    expect(parcelConfig.initCalls).toBe(0);
    expect(parcelConfig.mountCalls).toBe(0);
    expect(parcelConfig.unmountCalls).toBe(0);

    let parcel,
      unmountPromiseHasResolved = false;

    return singleSpa
      .triggerAppChange()
      .then(() => {
        expect(app.initCalls).toBe(1);
        expect(app.mountCalls).toBe(1);
        expect(app.unmountCalls).toBe(0);

        parcel = app.mountProps.mountParcel(parcelConfig, {
          domElement: document.createElement("div"),
        });

        parcel.unmountPromise.then(() => (unmountPromiseHasResolved = true));

        expect(parcel.getStatus()).toBe(
          singleSpa.AppOrParcelStatus.NOT_INITIALIZED,
        );
        expect(unmountPromiseHasResolved).toBe(false);

        return parcel.initPromise.then(() => {
          expect(parcel.getStatus()).toBe(singleSpa.AppOrParcelStatus.MOUNTING);
          expect(unmountPromiseHasResolved).toBe(false);

          return parcel.mountPromise.then(() => {
            expect(parcel.getStatus()).toBe(
              singleSpa.AppOrParcelStatus.MOUNTED,
            );
            expect(unmountPromiseHasResolved).toBe(false);
            expect(parcelConfig.initCalls).toBe(1);
            expect(parcelConfig.mountCalls).toBe(1);
            expect(parcelConfig.unmountCalls).toBe(0);

            shouldAppBeMounted = false;
            return singleSpa.triggerAppChange();
          });
        });
      })
      .then(() => {
        expect(parcel.getStatus()).toBe(
          singleSpa.AppOrParcelStatus.NOT_MOUNTED,
        );
        expect(unmountPromiseHasResolved).toBe(true);
        expect(app.initCalls).toBe(1);
        expect(app.mountCalls).toBe(1);
        expect(app.unmountCalls).toBe(1);

        expect(parcelConfig.initCalls).toBe(1);
        expect(parcelConfig.mountCalls).toBe(1);
        expect(parcelConfig.unmountCalls).toBe(1);
      });
  });

  it(`can mount and unmount a parcel some time after the app is mounted (happy path)`, () => {
    let shouldAppBeMounted = false;
    singleSpa.registerApplication(
      "parcel-happy-2",
      app,
      () => shouldAppBeMounted,
    );

    parcelConfig = createParcelConfig();

    shouldAppBeMounted = true;

    expect(app.initCalls).toBe(0);
    expect(app.mountCalls).toBe(0);
    expect(app.unmountCalls).toBe(0);

    expect(parcelConfig.initCalls).toBe(0);
    expect(parcelConfig.mountCalls).toBe(0);
    expect(parcelConfig.unmountCalls).toBe(0);

    return singleSpa
      .triggerAppChange()
      .then(() => {
        expect(app.initCalls).toBe(1);
        expect(app.mountCalls).toBe(1);
        expect(app.unmountCalls).toBe(0);
      })
      .then(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(resolve, 30);
          }),
      )
      .then(() => {
        const parcel = app.mountProps.mountParcel(parcelConfig, {
          domElement: document.createElement("div"),
        });
        return parcel.mountPromise;
      })
      .then(() => {
        expect(parcelConfig.initCalls).toBe(1);
        expect(parcelConfig.mountCalls).toBe(1);
        expect(parcelConfig.unmountCalls).toBe(0);
      })
      .then(() => {
        shouldAppBeMounted = false;
        return singleSpa.triggerAppChange();
      })
      .then(() => {
        expect(app.initCalls).toBe(1);
        expect(app.mountCalls).toBe(1);
        expect(app.unmountCalls).toBe(1);

        expect(parcelConfig.initCalls).toBe(1);
        expect(parcelConfig.mountCalls).toBe(1);
        expect(parcelConfig.unmountCalls).toBe(1);
      });
  });

  it(`doesn't unmount parcels twice if they are forcibly unmounted before the app is unmounted`, () => {
    let shouldAppBeMounted = false;
    singleSpa.registerApplication(
      "parcel-force-unmount",
      app,
      () => shouldAppBeMounted,
    );

    parcelConfig = createParcelConfig();

    shouldAppBeMounted = true;

    return singleSpa
      .triggerAppChange()
      .then(() => {
        const parcel = app.mountProps.mountParcel(parcelConfig, {
          domElement: document.createElement("div"),
        });
        return parcel.mountPromise.then(() => parcel.unmount());
      })
      .then(() => {
        expect(parcelConfig.unmountCalls).toBe(1);
        shouldAppBeMounted = false;
        return singleSpa.triggerAppChange();
      })
      .then(() => {
        expect(parcelConfig.unmountCalls).toBe(1);
      });
  });

  it(`lets you remount the parcel after forcibly unmounting it`, () => {
    let shouldAppBeMounted = false,
      parcel;
    singleSpa.registerApplication(
      "remount-parcel",
      app,
      () => shouldAppBeMounted,
    );
    parcelConfig = createParcelConfig();

    shouldAppBeMounted = true;

    return singleSpa
      .triggerAppChange()
      .then(() => {
        parcel = app.mountProps.mountParcel(parcelConfig, {
          domElement: document.createElement("div"),
        });
        return parcel.mountPromise;
      })
      .then(() =>
        parcel.unmount().then((value) => {
          // The mount promise isn't resolved with anything in particular
          expect(value).toBe(null);
        }),
      )
      .then(() => {
        expect(parcel.getStatus()).toBe(
          singleSpa.AppOrParcelStatus.NOT_MOUNTED,
        );
        return parcel.mount().then((value) => {
          // The mount promise isn't resolved with anything in particular
          expect(value).toBe(null);
        });
      })
      .then(() => {
        expect(parcel.getStatus()).toBe(singleSpa.AppOrParcelStatus.MOUNTED);
        shouldAppBeMounted = false;
        return singleSpa.triggerAppChange();
      })
      .then(() => {
        expect(parcel.getStatus()).toBe(
          singleSpa.AppOrParcelStatus.NOT_MOUNTED,
        );
        expect(app.unmountCalls).toBe(1);
      });
  });

  it(`correctly unmounts multiple parcels`, () => {
    let shouldAppBeMounted = false,
      parcel,
      parcel2;
    singleSpa.registerApplication(
      "multiple-parcels",
      app,
      () => shouldAppBeMounted,
    );
    parcelConfig = createParcelConfig();
    const parcelConfig2 = createParcelConfig();

    shouldAppBeMounted = true;

    return singleSpa
      .triggerAppChange()
      .then(() => {
        parcel = app.mountProps.mountParcel(parcelConfig, {
          domElement: document.createElement("div"),
        });
        parcel2 = app.mountProps.mountParcel(parcelConfig2, {
          domElement: document.createElement("div"),
        });
        expect(parcelConfig.mountCalls).toBe(0);
        expect(parcelConfig2.mountCalls).toBe(0);
        return Promise.all([parcel.mountPromise, parcel2.mountPromise]).then(
          () => [parcel, parcel2],
        );
      })
      .then(([p, p2]) => {
        expect(parcelConfig.mountCalls).toBe(1);
        expect(parcelConfig2.mountCalls).toBe(1);
        expect(p.getStatus()).toBe(singleSpa.AppOrParcelStatus.MOUNTED);
        expect(p2.getStatus()).toBe(singleSpa.AppOrParcelStatus.MOUNTED);
        return [p, p2];
      })
      .then(([p, p2]) => {
        shouldAppBeMounted = false;
        expect(parcelConfig.mountCalls).toBe(1);
        expect(parcelConfig2.mountCalls).toBe(1);
        expect(parcelConfig.unmountCalls).toBe(0);
        expect(parcelConfig2.unmountCalls).toBe(0);
        expect(p.getStatus()).toBe(singleSpa.AppOrParcelStatus.MOUNTED);
        expect(p2.getStatus()).toBe(singleSpa.AppOrParcelStatus.MOUNTED);
        return singleSpa
          .triggerAppChange()
          .then(() => {
            return Promise.all([p.unmountPromise, p2.unmountPromise]);
          })
          .then(() => [p, p2]);
      })
      .then(([p, p2]) => {
        expect(parcelConfig.mountCalls).toBe(1);
        expect(parcelConfig2.mountCalls).toBe(1);
        expect(parcelConfig.unmountCalls).toBe(1);
        expect(parcelConfig2.unmountCalls).toBe(1);
        expect(p.getStatus()).toBe(singleSpa.AppOrParcelStatus.NOT_MOUNTED);
        expect(p2.getStatus()).toBe(singleSpa.AppOrParcelStatus.NOT_MOUNTED);
      });
  });

  // https://github.com/single-spa/single-spa/issues/656
  it(`successfully unmounts a parcel that is unmounted before mount finishes`, async () => {
    let shouldAppBeMounted = false,
      parcel;

    singleSpa.registerApplication(
      "immediate-unmount",
      app,
      () => shouldAppBeMounted,
    );

    parcelConfig = {
      mount: () =>
        new Promise((resolve) => {
          setTimeout(resolve, 50);
        }),
      async unmount() {},
    };

    shouldAppBeMounted = true;

    return singleSpa.triggerAppChange().then(() => {
      parcel = app.mountProps.mountParcel(parcelConfig, {
        domElement: document.createElement("div"),
      });

      shouldAppBeMounted = false;
      return singleSpa.triggerAppChange();
    });
  });
});

function createParcelConfig() {
  const parcelConfig = {
    initCalls: 0,
    init() {
      parcelConfig.initCalls++;
      return Promise.resolve();
    },
    mountCalls: 0,
    mountProps: null,
    mount(props) {
      parcelConfig.mountCalls++;
      parcelConfig.mountProps = props;
      return Promise.resolve();
    },
    unmountCalls: 0,
    unmount() {
      parcelConfig.unmountCalls++;
      return Promise.resolve();
    },
  };

  return parcelConfig;
}
