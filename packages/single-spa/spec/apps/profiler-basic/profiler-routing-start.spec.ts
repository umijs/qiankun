import * as singleSpa from "single-spa";
import {
  clearProfilerData,
  getProfilerData,
} from "../../../src/devtools/profiler";

describe(`profiler routing events after start()`, () => {
  let app, shouldMount;

  beforeAll(() => {
    singleSpa.start();
  });

  beforeEach(async () => {
    app = {
      init: async () => {},
      mount: async () => {},
      unmount: async () => {},
    };

    shouldMount = true;

    singleSpa.getAppNames().forEach(singleSpa.unregisterApplication);

    await singleSpa.triggerAppChange();

    // Unfortunately calling triggerAppChange results in things happening
    // after it finishes, so we need to wait for those to finish
    await tick(25);

    clearProfilerData();
  });

  it("fires successful unmountAndUnload profiler events", async () => {
    const profilesBefore = getProfilerEventsByKind("unmountAndUnload");
    expect(profilesBefore.length).toBe(0);

    singleSpa.registerApplication({
      name: "unmountAndUnload profiler success",
      app,
      activeWhen: () => shouldMount,
    });

    await singleSpa.triggerAppChange();

    const profilesAfter = getProfilerEventsByKind("unmountAndUnload");
    expect(profilesAfter.length).toBeGreaterThan(0);
    expect(profilesAfter[0].operationSucceeded).toBe(true);
  });

  it("fires successful loadAndMount profiler events", async () => {
    const profilesBefore = getProfilerEventsByKind("loadAndMount");
    expect(profilesBefore.length).toBe(0);

    singleSpa.registerApplication({
      name: "loadAndMount profiler success",
      app,
      activeWhen: () => shouldMount,
    });

    await singleSpa.triggerAppChange();

    const profilesAfter = getProfilerEventsByKind("loadAndMount");
    expect(profilesAfter.length).toBeGreaterThan(0);
    expect(profilesAfter[0].operationSucceeded).toBe(true);
  });

  it("fires navigationCanceled profiler events", async () => {
    const profilesBefore = getProfilerEventsByKind("navigationCanceled");
    expect(profilesBefore.length).toBe(0);

    window.addEventListener(
      "single-spa:before-routing-event",
      handleBeforeRouting,
    );

    await singleSpa.triggerAppChange();

    const profilesAfter = getProfilerEventsByKind("navigationCanceled");
    expect(profilesAfter.length).toBe(1);

    window.removeEventListener(
      "single-spa:before-routing-event",
      handleBeforeRouting,
    );

    function handleBeforeRouting(evt) {
      evt.detail.cancelNavigation();
    }
  });
});

function getProfilerEventsByKind(name) {
  return getProfilerData().filter(
    (d) => d.type === "routing" && d.name === name,
  );
}

function tick(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
