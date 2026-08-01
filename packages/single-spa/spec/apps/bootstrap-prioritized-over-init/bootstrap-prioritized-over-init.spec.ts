import * as singleSpa from 'single-spa';
import * as app from './bootstrap-prioritized-over-init.app';

// qiankun fork: bootstrap is the canonical lifecycle name and wins over the v7 init alias
// (upstream's init-prioritized-over-bootstrap spec, inverted — see the fork README)
describe(`bootstrap-prioritized-over-init`, () => {
  it(`calls the bootstrap lifecycle rather than init`, async () => {
    singleSpa.registerApplication({
      name: 'bootstrap-prioritized',
      app,
      activeWhen: ['/'],
    });

    singleSpa.start();

    await singleSpa.triggerAppChange();

    expect(app.bootstrapCalled).toBe(true);
    expect(app.initCalled).toBe(false);
  });
});
