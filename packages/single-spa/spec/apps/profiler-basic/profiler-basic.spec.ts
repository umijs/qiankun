import * as singleSpa from "single-spa";
import {
  clearProfilerData,
  getProfilerData,
} from "../../../src/devtools/profiler";

describe(`profiler basics`, () => {
  let app,
    shouldMount = false,
    loadApp;

  beforeAll(() => {
    singleSpa.start();
  });

  describe("application profiler events", () => {
    beforeEach(() => {
      app = {
        init: jest.fn(() => Promise.resolve()),
        mount: jest.fn(() => Promise.resolve()),
        unmount: jest.fn(() => Promise.resolve()),
        unload: jest.fn(() => Promise.resolve()),
      };

      loadApp = jest.fn(() => Promise.resolve(app));

      singleSpa.registerApplication({
        name: "profiler-basics",
        app: loadApp,
        activeWhen: () => shouldMount,
      });
      shouldMount = false;
    });

    afterEach(async () => {
      shouldMount = false;
      await singleSpa.unloadApplication("profiler-basics", {
        waitForUnmount: false,
      });
      singleSpa.unregisterApplication("profiler-basics");
      await singleSpa.triggerAppChange();
      clearProfilerData();
    });

    it(`captures load profile events`, async () => {
      const loadProfilesBefore = getProfilerEventsByKind("load");
      expect(loadProfilesBefore.length).toBe(0);

      shouldMount = true;
      await singleSpa.triggerAppChange();
      expect(singleSpa.getAppStatus("profiler-basics")).toEqual(
        singleSpa.AppOrParcelStatus.MOUNTED,
      );
      const loadProfilesAfter = getProfilerEventsByKind("load");

      expect(loadProfilesAfter.length).toBe(1);
      expect(loadProfilesAfter[0].operationSucceeded).toBe(true);
      expect(!Number.isNaN(loadProfilesAfter[0].start)).toBe(true);
      expect(!Number.isNaN(loadProfilesAfter[0].end)).toBe(true);
    });

    it(`captures load error profile events`, async () => {
      loadApp.mockImplementationOnce(() =>
        Promise.reject(Error("Failed to load")),
      );

      const loadProfilesBefore = getProfilerEventsByKind("load");
      expect(loadProfilesBefore.length).toBe(0);

      shouldMount = true;
      await singleSpa.triggerAppChange();
      expect(singleSpa.getAppStatus("profiler-basics")).toEqual(
        singleSpa.AppOrParcelStatus.LOAD_ERROR,
      );
      const loadProfilesAfter = getProfilerEventsByKind("load");

      expect(loadProfilesAfter.length).toBe(1);
      expect(loadProfilesAfter[0].operationSucceeded).toBe(false);
    });

    it(`captures init profile events`, async () => {
      const profilesBefore = getProfilerEventsByKind("init");
      expect(profilesBefore.length).toBe(0);

      shouldMount = true;
      await singleSpa.triggerAppChange();
      expect(singleSpa.checkActivityFunctions()).toContain("profiler-basics");
      expect(singleSpa.getAppStatus("profiler-basics")).toEqual(
        singleSpa.AppOrParcelStatus.MOUNTED,
      );
      const profilesAfter = getProfilerEventsByKind("init");

      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(true);
    });

    it(`captures init error profile events`, async () => {
      app.init.mockImplementationOnce(() => Promise.reject(Error("init err")));

      const profilesBefore = getProfilerEventsByKind("init");
      expect(profilesBefore.length).toBe(0);

      shouldMount = true;
      await singleSpa.triggerAppChange();
      expect(singleSpa.checkActivityFunctions()).toContain("profiler-basics");
      expect(singleSpa.getAppStatus("profiler-basics")).toEqual(
        singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
      );
      const profilesAfter = getProfilerEventsByKind("init");

      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(false);
    });

    it(`captures mount profile events`, async () => {
      const profilesBefore = getProfilerEventsByKind("mount");
      expect(profilesBefore.length).toBe(0);

      shouldMount = true;
      await singleSpa.triggerAppChange();
      expect(singleSpa.checkActivityFunctions()).toContain("profiler-basics");
      expect(singleSpa.getAppStatus("profiler-basics")).toEqual(
        singleSpa.AppOrParcelStatus.MOUNTED,
      );
      const profilesAfter = getProfilerEventsByKind("mount");

      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(true);
    });

    it(`captures mount error profile events`, async () => {
      app.mount.mockImplementationOnce(() =>
        Promise.reject(Error("Mount err")),
      );

      const profilesBefore = getProfilerEventsByKind("mount");
      expect(profilesBefore.length).toBe(0);

      shouldMount = true;
      await singleSpa.triggerAppChange();
      expect(singleSpa.checkActivityFunctions()).toContain("profiler-basics");
      expect(singleSpa.getAppStatus("profiler-basics")).toEqual(
        singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
      );
      const profilesAfter = getProfilerEventsByKind("mount");

      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(false);
    });

    it(`captures unmount profile events`, async () => {
      const profilesBefore = getProfilerEventsByKind("unmount");
      expect(profilesBefore.length).toBe(0);

      shouldMount = true;
      await singleSpa.triggerAppChange();
      shouldMount = false;
      await singleSpa.triggerAppChange();

      const profilesAfter = getProfilerEventsByKind("unmount");

      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(true);
    });

    it(`captures unmount error profile events`, async () => {
      app.unmount.mockImplementationOnce(() =>
        Promise.reject(Error("Mount errr")),
      );
      const profilesBefore = getProfilerEventsByKind("unmount");
      expect(profilesBefore.length).toBe(0);

      shouldMount = true;
      await singleSpa.triggerAppChange();
      shouldMount = false;
      await singleSpa.triggerAppChange();

      expect(singleSpa.getAppStatus("profiler-basics")).toBe(
        singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
      );

      const profilesAfter = getProfilerEventsByKind("unmount");

      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(false);
    });

    it(`captures unload profile events`, async () => {
      const profilesBefore = getProfilerEventsByKind("unload");
      expect(profilesBefore.length).toBe(0);

      shouldMount = true;
      await singleSpa.triggerAppChange();
      shouldMount = false;
      await singleSpa.unloadApplication("profiler-basics", {
        waitForUnmount: false,
      });
      await singleSpa.triggerAppChange();
      await singleSpa.triggerAppChange();
      expect(singleSpa.getAppStatus("profiler-basics")).toEqual(
        singleSpa.AppOrParcelStatus.NOT_LOADED,
      );

      const profilesAfter = getProfilerEventsByKind("unload");

      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(true);
    });

    it(`captures unloadErr error profile events`, async () => {
      app.unload.mockImplementationOnce(() =>
        Promise.reject(Error("Unload errr")),
      );
      const profilesBefore = getProfilerEventsByKind("unload");
      expect(profilesBefore.length).toBe(0);

      shouldMount = true;
      await singleSpa.triggerAppChange();
      shouldMount = false;
      await singleSpa.triggerAppChange();
      clearProfilerData();
      try {
        await singleSpa.unloadApplication("profiler-basics", {
          waitForUnmount: false,
        });
        fail("Expected unload err");
      } catch (err) {}

      await singleSpa.triggerAppChange();

      expect(singleSpa.getAppStatus("profiler-basics")).toBe(
        singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
      );

      const profilesAfter = getProfilerEventsByKind("unload");

      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(false);
    });
  });

  describe("parcel profiler events", () => {
    let parcelConfig, props;

    beforeEach(() => {
      clearProfilerData();

      parcelConfig = {
        async init() {},
        async mount() {},
        async update() {},
        async unmount() {},
        name: "profiler-basics",
      };

      props = {
        domElement: document.createElement("div"),
      };
    });

    it("captures successful init events", async () => {
      const profilesBefore = getProfilerEventsByKind("init", "parcel");
      expect(profilesBefore.length).toBe(0);

      const parcel = singleSpa.mountRootParcel(parcelConfig, props);
      await parcel.initPromise;

      const profilesAfter = getProfilerEventsByKind("init", "parcel");
      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(true);
    });

    it("captures successful mount events", async () => {
      const profilesBefore = getProfilerEventsByKind("mount", "parcel");
      expect(profilesBefore.length).toBe(0);

      const parcel = singleSpa.mountRootParcel(parcelConfig, props);
      await parcel.mountPromise;

      const profilesAfter = getProfilerEventsByKind("mount", "parcel");
      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(true);
    });

    it("captures successful update events", async () => {
      const profilesBefore = getProfilerEventsByKind("update", "parcel");
      expect(profilesBefore.length).toBe(0);

      const parcel = singleSpa.mountRootParcel(parcelConfig, props);
      await parcel.mountPromise;
      await parcel.update(props);

      const profilesAfter = getProfilerEventsByKind("update", "parcel");
      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(true);
    });

    it("captures successful unmount events", async () => {
      const profilesBefore = getProfilerEventsByKind("unmount", "parcel");
      expect(profilesBefore.length).toBe(0);

      const parcel = singleSpa.mountRootParcel(parcelConfig, props);
      await parcel.mountPromise;
      await parcel.unmount();

      const profilesAfter = getProfilerEventsByKind("unmount", "parcel");
      expect(profilesAfter.length).toBe(1);
      expect(profilesAfter[0].operationSucceeded).toBe(true);
    });
  });

  describe("routing profiler events", () => {});
});

function getProfilerEventsByKind(kind, type = "application") {
  return getProfilerData().filter(
    (d) => d.type === type && d.name === "profiler-basics" && d.kind === kind,
  );
}
