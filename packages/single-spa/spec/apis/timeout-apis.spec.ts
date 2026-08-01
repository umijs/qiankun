import * as singleSpa from 'single-spa';

describe('global timeout configuration', () => {
  let consoleWarnSpy, consoleErrSpy, parcel;

  beforeAll(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn');
    consoleErrSpy = vi.spyOn(console, 'error');
    vi.useFakeTimers();
    singleSpa.start();
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
    consoleErrSpy.mockRestore();
    vi.useRealTimers();
  });

  afterEach(() => {
    consoleWarnSpy.mockReset();
    consoleErrSpy.mockReset();
    vi.clearAllTimers();
  });

  describe('setBootstrapMaxTime', () => {
    afterEach(() => {
      singleSpa.setBootstrapMaxTime(5000, false, 1000);
    });

    it(`respects the millis configuration option`, async () => {
      singleSpa.setBootstrapMaxTime(5, false, 1000);

      await controlledParcelActions((parcel) => parcel.bootstrapPromise, 'bootstrap-0', 3);
      expect(consoleErrSpy).not.toHaveBeenCalled();

      await controlledParcelActions((parcel) => parcel.bootstrapPromise, 'bootstrap-1', 10);
      expectError(
        `single-spa minified message #31: Lifecycle function bootstrap for parcel bootstrap-1 lifecycle did not resolve or reject for 5 ms. See https://single-spa.js.org/error/?code=31&arg=bootstrap&arg=parcel&arg=bootstrap-1&arg=5`,
      );
    });

    it(`respects warningMillis configuration option`, async () => {
      singleSpa.setBootstrapMaxTime(15, false, 5);

      await controlledParcelActions((parcel) => parcel.bootstrapPromise, 'bootstrap-2', 0);
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      await controlledParcelActions((parcel) => parcel.bootstrapPromise, 'bootstrap-3', 10);
      expectWarning(
        `single-spa minified message #31: Lifecycle function bootstrap for parcel bootstrap-3 lifecycle did not resolve or reject for 15 ms. See https://single-spa.js.org/error/?code=31&arg=bootstrap&arg=parcel&arg=bootstrap-3&arg=15`,
      );
    });
  });

  describe('setMountMaxTime', () => {
    afterEach(() => {
      singleSpa.setMountMaxTime(5000, false, 1000);
    });

    it(`respects the millis configuration option`, async () => {
      singleSpa.setMountMaxTime(5, false, 1000);

      await controlledParcelActions((parcel) => parcel.mountPromise, 'mount-0', 0, 3);
      expect(consoleErrSpy).not.toHaveBeenCalled();

      await controlledParcelActions((parcel) => parcel.mountPromise, 'mount-1', 0, 10);
      expectError(
        `single-spa minified message #31: Lifecycle function mount for parcel mount-1 lifecycle did not resolve or reject for 5 ms. See https://single-spa.js.org/error/?code=31&arg=mount&arg=parcel&arg=mount-1&arg=5`,
      );
    });

    it(`respects warningMillis configuration option`, async () => {
      singleSpa.setMountMaxTime(15, false, 5);

      await controlledParcelActions((parcel) => parcel.mountPromise, 'mount-2', 0, 3);
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      await controlledParcelActions((parcel) => parcel.mountPromise, 'mount-3', 0, 10);
      expectWarning(
        `single-spa minified message #31: Lifecycle function mount for parcel mount-3 lifecycle did not resolve or reject for 15 ms. See https://single-spa.js.org/error/?code=31&arg=mount&arg=parcel&arg=mount-3&arg=15`,
      );
    });
  });

  describe('setUnmountMaxTime', () => {
    const unmount = async (parcel) => {
      await parcel.mountPromise;
      await parcel.unmount();
    };

    afterEach(() => {
      singleSpa.setUnmountMaxTime(5000, false, 1000);
    });

    it(`respects the millis configuration option`, async () => {
      singleSpa.setUnmountMaxTime(5, false, 1000);

      await controlledParcelActions(unmount, 'unmount-0', 0, 0, 0, 3);
      expect(consoleErrSpy).not.toHaveBeenCalled();

      await controlledParcelActions(unmount, 'unmount-1', 0, 0, 0, 10);
      expectError(
        `single-spa minified message #31: Lifecycle function unmount for parcel unmount-1 lifecycle did not resolve or reject for 5 ms. See https://single-spa.js.org/error/?code=31&arg=unmount&arg=parcel&arg=unmount-1&arg=5`,
      );
    });

    it(`respects warningMillis configuration option`, async () => {
      singleSpa.setUnmountMaxTime(15, false, 5);

      await controlledParcelActions(unmount, 'unmount-2', 0, 0, 0, 3);
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      await controlledParcelActions(unmount, 'unmount-3', 0, 0, 0, 10);
      expectWarning(
        `single-spa minified message #31: Lifecycle function unmount for parcel unmount-3 lifecycle did not resolve or reject for 15 ms. See https://single-spa.js.org/error/?code=31&arg=unmount&arg=parcel&arg=unmount-3&arg=15`,
      );
    });
  });

  function expectWarning(message) {
    expect(consoleWarnSpy).toHaveBeenCalled();
    const found = consoleWarnSpy.mock.calls.some((call) => call[0] === message);
    if (!found) {
      expect(consoleWarnSpy).toHaveBeenCalledWith(message);
    }
  }

  function expectError(message) {
    expect(consoleErrSpy).toHaveBeenCalled();
    const found = consoleErrSpy.mock.calls.some((call) => call[0] === message);
    if (!found) {
      expect(consoleErrSpy).toHaveBeenCalledWith(message);
    }
  }
});

function generateParcel(name, bootstrapDelay = 0, mountDelay = 0, updateDelay = 0, unmountDelay = 0, unloadDelay = 0) {
  return [
    {
      name,
      bootstrap: () =>
        new Promise((resolve) => {
          setTimeout(resolve, bootstrapDelay);
          vi.advanceTimersByTime(bootstrapDelay);
        }),
      mount: () =>
        new Promise((resolve) => {
          setTimeout(resolve, mountDelay);
          vi.advanceTimersByTime(mountDelay);
        }),
      update: () =>
        new Promise((resolve) => {
          setTimeout(resolve, updateDelay);
          vi.advanceTimersByTime(updateDelay);
        }),
      unmount: () =>
        new Promise((resolve) => {
          setTimeout(resolve, unmountDelay);
          vi.advanceTimersByTime(unmountDelay);
        }),
      unload: () =>
        new Promise((resolve) => {
          setTimeout(resolve, unloadDelay);
          vi.advanceTimersByTime(unloadDelay);
        }),
    },
    {
      domElement: document.createElement('div'),
    },
  ];
}

async function controlledParcelActions(action, ...parcelArgs) {
  const parcel = singleSpa.mountRootParcel(...generateParcel(...parcelArgs));
  vi.runAllTimers();
  const actionPromise = action(parcel);
  vi.runAllTimers();
  await actionPromise;
}
