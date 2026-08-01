import * as singleSpa from 'single-spa';

describe(`mount-before-other-loads`, () => {
  let errs = [];

  function handleError(err) {
    errs.push(err);
  }

  beforeEach(() => {
    errs = [];
    singleSpa.addErrorHandler(handleError);
  });

  afterEach(() => {
    singleSpa.removeErrorHandler(handleError);
  });

  it(`will mount an application before loading another application finishes`, async () => {
    location.hash = '#mount-before-other-loads';

    const appChangeResultBeforeStart = await singleSpa.triggerAppChange();
    expect(appChangeResultBeforeStart).toEqual([]);

    let order = [];

    const slowApp = {
      bootstrap: async () => {
        order.push('slow:bootstrap');
      },
      mount: async () => {
        order.push('slow:mount');
      },
      unmount: async () => {
        order.push('slow:unmount');
      },
    };

    const fastApp = {
      bootstrap: async () => {
        order.push('fast:bootstrap');
      },
      mount: async () => {
        order.push('fast:mount');
      },
      unmount: async () => {
        order.push('fast:unmount');
      },
    };

    singleSpa.registerApplication(
      'slow-load',
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            order.push('slow:load');
            resolve(slowApp);
          }, 30);
        }),
      (location) => location.hash.startsWith('#mount-before-other-loads'),
    );

    singleSpa.registerApplication(
      'fast-load',
      async () => {
        order.push('fast:load');
        return fastApp;
      },
      (location) => location.hash.startsWith('#mount-before-other-loads'),
    );

    expect(errs.length).toBe(0);
    expect(order).toEqual([]);
    singleSpa.start();
    await singleSpa.triggerAppChange();
    expect(errs.length).toBe(0);
    expect(order).toEqual(['fast:load', 'fast:bootstrap', 'fast:mount', 'slow:load', 'slow:bootstrap', 'slow:mount']);
  });
});
