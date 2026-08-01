import * as singleSpa from "single-spa";

describe(`app-names`, () => {
  beforeAll(() => {
    const app = {
      init() {
        return Promise.resolve();
      },
      mount() {
        return Promise.resolve();
      },
      unmount() {
        return Promise.resolve();
      },
    };
    singleSpa.registerApplication(
      "usingArgumentAPI",
      app,
      (location) => location.hash === "#app-names",
    );
    singleSpa.registerApplication({
      name: "usingObjectAPI",
      app,
      activeWhen: (location) => location.hash === "#app-names",
    });
    singleSpa.start();
  });

  it(`should return all registered app names up to this point regardless of activity`, () => {
    expect(singleSpa.getAppNames()).toEqual([
      "usingArgumentAPI",
      "usingObjectAPI",
    ]);
  });
});
