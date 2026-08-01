import * as singleSpa from "single-spa";

describe("partial rerouting", () => {
  function delay() {
    return new Promise((resolve) => setTimeout(resolve));
  }

  beforeAll(() => singleSpa.start());

  beforeEach(() => {
    location.hash = "#";
  });

  it("shouldn't init and mount app if the route has been changed while app was loading, but if the user navigates back it should be initialized and mounted successfully", async () => {
    const activeHash = "#partial-rerouting";

    let initialized = false;
    let mounted = false;
    let unmounted = false;

    const app = {
      async init() {
        initialized = true;
      },
      async mount() {
        mounted = true;
      },
      async unmount() {
        unmounted = true;
      },
    };

    singleSpa.registerApplication(
      "partial-rerouting",
      () => delay().then(() => app),
      (location) => location.hash === activeHash,
    );

    location.hash = activeHash;

    const promise = singleSpa.triggerAppChange();

    singleSpa.navigateToUrl("#another-url");
    await Promise.all([singleSpa.triggerAppChange(), promise]);

    expect(initialized).toBeFalsy();
    expect(mounted).toBeFalsy();
    expect(unmounted).toBeFalsy();

    singleSpa.navigateToUrl(activeHash);
    await singleSpa.triggerAppChange();

    expect(initialized).toBeTruthy();
    expect(mounted).toBeTruthy();

    singleSpa.navigateToUrl("#another-url");
    await singleSpa.triggerAppChange();

    expect(unmounted).toBeTruthy();
  });

  it("should initialize and mount second app succcessfully, but should skip initializing and mounting first app if the route has been changed", async () => {
    let firstAppInitialized = false,
      firstAppMounted = false,
      firstAppUnmounted = false;

    const firstApp = {
      async init() {
        firstAppInitialized = true;
      },
      async mount() {
        firstAppMounted = true;
      },
      async unmount() {
        firstAppUnmounted = true;
      },
    };

    let secondAppInitialized = false,
      secondAppMounted = false,
      secondAppUnmounted = false;

    const secondApp = {
      async init() {
        secondAppInitialized = true;
      },
      async mount() {
        secondAppMounted = true;
      },
      async unmount() {
        secondAppUnmounted = true;
      },
    };

    const firstAppActiveHash = "#first-app";
    const secondAppActiveHash = "#second-app";

    singleSpa.registerApplication(
      "first-app",
      () => delay().then(() => firstApp),
      (location) => location.hash === firstAppActiveHash,
    );

    singleSpa.registerApplication(
      "second-app",
      () => Promise.resolve(secondApp),
      (location) => location.hash === secondAppActiveHash,
    );

    location.hash = firstAppActiveHash;

    const promise = singleSpa.triggerAppChange();

    singleSpa.navigateToUrl(secondAppActiveHash);
    await Promise.all([singleSpa.triggerAppChange(), promise]);

    expect(firstAppInitialized).toBeFalsy();
    expect(secondAppInitialized).toBeTruthy();
    expect(secondAppMounted).toBeTruthy();
    expect(secondAppUnmounted).toBeFalsy();

    singleSpa.navigateToUrl(firstAppActiveHash);
    await singleSpa.triggerAppChange();

    expect(secondAppUnmounted).toBeTruthy();
    expect(firstAppInitialized).toBeTruthy();
    expect(firstAppMounted).toBeTruthy();
  });
});
