import * as singleSpa from "single-spa";

describe(`parcels mounting parcels`, () => {
  beforeAll(() => {
    singleSpa.start();
  });

  it("can mount a parcel as a child of a parcel and unmount both together", () => {
    const app = createApp();
    let shouldAppBeMounted = true;

    singleSpa.registerApplication(
      "parcel-mounts-parcels",
      app,
      () => shouldAppBeMounted,
    );

    return singleSpa.triggerAppChange().then(() => {
      expect(app.mountCalls).toBe(1);

      const parcelConfig1 = createParcelConfig();
      const parcelConfig2 = createParcelConfig();
      const parcel1 = app.mountProps.mountParcel(parcelConfig1, {
        domElement: document.createElement("div"),
      });

      return parcel1.mountPromise
        .then(() => {
          expect(parcelConfig1.initCalls).toBe(1);
          expect(parcelConfig1.mountCalls).toBe(1);
          expect(parcelConfig1.unmountCalls).toBe(0);

          const parcel2 = parcelConfig1.mountProps.mountParcel(parcelConfig2, {
            domElement: document.createElement("div"),
          });
          return parcel2.mountPromise.then(() => {
            expect(parcelConfig2.initCalls).toBe(1);
            expect(parcelConfig2.mountCalls).toBe(1);
            expect(parcelConfig2.unmountCalls).toBe(0);
          });
        })
        .then(() => parcel1.unmount())
        .then(() => {
          {
            expect(parcelConfig1.unmountCalls).toBe(1);
            expect(parcelConfig2.unmountCalls).toBe(1);
          }
        });
    });
  });

  it("unmounts parcels recursively deep when an app unmounts", () => {
    const app = createApp();
    let shouldAppBeMounted = true;

    singleSpa.registerApplication(
      "parcel-unmounts-recursive",
      app,
      () => shouldAppBeMounted,
    );

    return singleSpa.triggerAppChange().then(() => {
      expect(app.mountCalls).toBe(1);

      const parcelConfig1 = createParcelConfig();
      const parcelConfig2 = createParcelConfig();
      const parcelConfig3 = createParcelConfig();
      const parcel1 = app.mountProps.mountParcel(parcelConfig1, {
        domElement: document.createElement("div"),
      });

      return parcel1.mountPromise
        .then(() => {
          const parcel2 = parcelConfig1.mountProps.mountParcel(parcelConfig2, {
            domElement: document.createElement("div"),
          });
          return parcel2.mountPromise.then(() => {
            const parcel3 = parcelConfig2.mountProps.mountParcel(
              parcelConfig3,
              { domElement: document.createElement("div") },
            );
            return parcel3.mountPromise;
          });
        })
        .then(() => {
          shouldAppBeMounted = false;
          return singleSpa.triggerAppChange();
        })
        .then(() => {
          expect(app.unmountCalls).toBe(1);
          expect(parcelConfig1.unmountCalls).toBe(1);
          expect(parcelConfig2.unmountCalls).toBe(1);
          expect(parcelConfig3.unmountCalls).toBe(1);
        });
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
