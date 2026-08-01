import * as singleSpa from 'single-spa';

describe(`legacy-bootstrap`, () => {
  it(`calls the bootstrap lifecycle`, async () => {
    singleSpa.registerApplication({
      name: 'legacy-bootstrap',
      app: () => import('./legacy-bootstrap.app'),
      activeWhen: ['/'],
    });

    singleSpa.start();

    await singleSpa.triggerAppChange();

    expect((await import('./legacy-bootstrap.app')).bootstrapCalled).toBe(true);
  });
});
