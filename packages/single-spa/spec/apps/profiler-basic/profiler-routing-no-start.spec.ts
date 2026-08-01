import * as singleSpa from "single-spa";
import {
  clearProfilerData,
  getProfilerData,
} from "../../../src/devtools/profiler";

describe(`profiler routing events before start()`, () => {
  let app, shouldMount;

  beforeEach(async () => {
    app = {
      init: async () => {},
      mount: async () => {},
      unmount: async () => {},
    };

    shouldMount = true;

    singleSpa.getAppNames().forEach(singleSpa.unregisterApplication);

    await singleSpa.triggerAppChange();

    clearProfilerData();
  });

  it("fires successful loadApp profiler events", async () => {
    const profilesBefore = getProfilerEventsByKind("loadApps");
    expect(profilesBefore.length).toBe(0);

    singleSpa.registerApplication({
      name: "loadApp profiler success",
      app,
      activeWhen: () => shouldMount,
    });

    await singleSpa.triggerAppChange();

    const profilesAfter = getProfilerEventsByKind("loadApps");
    expect(profilesAfter.length).toBeGreaterThan(0);
    expect(profilesAfter[0].operationSucceeded).toBe(true);
  });

  // Excluded with xit() because load.js never throws Errors due to unhandled promise
  // rejection issues
  xit("fires failed loadApp profiler", async () => {
    const profilesBefore = getProfilerEventsByKind("loadApps");
    expect(profilesBefore.length).toBe(0);

    singleSpa.registerApplication({
      name: "loadApp profiler fail",
      app: async () => {
        console.log("failling");
        throw Error("failed");
      },
      activeWhen: () => shouldMount,
    });

    await singleSpa.triggerAppChange();

    const profilesAfter = getProfilerEventsByKind("loadApps");
    console.log(getProfilerData());
    expect(profilesAfter.length).toBeGreaterThan(0);
    expect(profilesAfter.some((p) => !p.operationSucceeded)).toBe(true);
  });
});

function getProfilerEventsByKind(name) {
  return getProfilerData().filter(
    (d) => d.type === "routing" && d.name === name,
  );
}
