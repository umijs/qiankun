import * as singleSpa from 'single-spa';

const activeHash = `#lifecycle-props-function`;

describe(`lifecycle-props-function app`, () => {
  let myApp, customProps;

  beforeAll(() => {
    singleSpa.start();

    singleSpa.registerApplication(
      'lifecycle-props-function',
      () => import('./lifecycle-props-function.app'),
      (location) => location.hash === activeHash,
      (name, location) => {
        return customProps;
      },
    );
  });

  beforeEach(async () => {
    const app = await import('./lifecycle-props-function.app');
    myApp = app;
    app.reset();
    customProps = {};

    vi.spyOn(console, 'warn');
  });

  afterEach(() => {
    console.warn.mockRestore();
  });

  it(`is given dynamic props from a function for each lifecycle function`, async () => {
    customProps = {
      dynamically: 'set',
    };

    // This mounts the app
    window.location.hash = activeHash;

    await singleSpa.triggerAppChange();
    // This unmounts the app
    window.location.hash = `#/no-app`;
    await singleSpa.triggerAppChange();
    await singleSpa.unloadApplication('lifecycle-props-function');

    expect(myApp.getInitProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getMountProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getUnmountProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getUnloadProps().name).toEqual('lifecycle-props-function');

    expect(myApp.getInitProps().dynamically).toEqual('set');
    expect(myApp.getMountProps().dynamically).toEqual('set');
    expect(myApp.getUnmountProps().dynamically).toEqual('set');
    expect(myApp.getUnloadProps().dynamically).toEqual('set');

    expect(console.warn).not.toHaveBeenCalled();
  });

  it(`logs a warning if the custom props function returns null`, async () => {
    customProps = null;

    // This mounts the app
    window.location.hash = activeHash;

    await singleSpa.triggerAppChange();
    // This unmounts the app
    window.location.hash = `#/no-app`;
    await singleSpa.triggerAppChange();
    await singleSpa.unloadApplication('lifecycle-props-function');

    expect(myApp.getInitProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getMountProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getUnmountProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getUnloadProps().name).toEqual('lifecycle-props-function');

    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0][0]).toMatch(
      `lifecycle-props-function's customProps function must return an object`,
    );
  });

  it(`logs a warning if the custom props function doesn't return an object`, async () => {
    customProps = 'string';

    // This mounts the app
    window.location.hash = activeHash;

    await singleSpa.triggerAppChange();
    // This unmounts the app
    window.location.hash = `#/no-app`;
    await singleSpa.triggerAppChange();
    await singleSpa.unloadApplication('lifecycle-props-function');

    expect(myApp.getInitProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getMountProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getUnmountProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getUnloadProps().name).toEqual('lifecycle-props-function');

    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0][0]).toMatch(
      `lifecycle-props-function's customProps function must return an object`,
    );
  });

  it(`logs a warning if the custom props function returns an array`, async () => {
    customProps = [];

    // This mounts the app
    window.location.hash = activeHash;

    await singleSpa.triggerAppChange();
    // This unmounts the app
    window.location.hash = `#/no-app`;
    await singleSpa.triggerAppChange();
    await singleSpa.unloadApplication('lifecycle-props-function');

    expect(myApp.getInitProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getMountProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getUnmountProps().name).toEqual('lifecycle-props-function');
    expect(myApp.getUnloadProps().name).toEqual('lifecycle-props-function');

    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0][0]).toMatch(
      `lifecycle-props-function's customProps function must return an object`,
    );
  });
});
