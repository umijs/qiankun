import * as singleSpa from 'single-spa';

const activeHash = '#no-bootstrap';

describe(`no-bootstrap app`, () => {
  let myApp;

  beforeAll(() => {
    singleSpa.registerApplication({
      name: 'no-bootstrap',
      app: () => import('./no-bootstrap.app'),
      activeWhen: (location) => location.hash === activeHash,
    });
    singleSpa.start();
  });

  beforeEach(() => {
    location.hash = '#';
  });

  it(`allows an application to omit the bootstrap lifecycle`, async () => {
    expect(singleSpa.getAppStatus('no-bootstrap')).toBe(singleSpa.AppOrParcelStatus.NOT_LOADED);

    location.hash = activeHash;

    await singleSpa.triggerAppChange();

    expect(singleSpa.getAppStatus('no-bootstrap')).toBe(singleSpa.AppOrParcelStatus.MOUNTED);
  });
});
