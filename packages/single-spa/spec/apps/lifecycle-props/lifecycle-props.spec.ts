import * as singleSpa from 'single-spa';

const activeHash = `#lifecycle-props`;

describe(`lifecycle-props app`, () => {
  let myApp;

  beforeAll(() => {
    singleSpa.start();
  });

  beforeEach(() => {
    return import('./lifecycle-props.app').then((app) => (myApp = app)).then((app) => app.reset());
  });

  it(`is given the correct props for each lifecycle function`, () => {
    singleSpa.registerApplication(
      'lifecycle-props',
      () => import('./lifecycle-props.app'),
      (location) => location.hash === activeHash,
    );

    // This mounts the app
    window.location.hash = activeHash;

    return singleSpa
      .triggerAppChange()
      .then(() => {
        // This unmounts the app
        window.location.hash = `#/no-app`;
        return singleSpa.triggerAppChange();
      })
      .then(() => {
        return singleSpa.unloadApplication('lifecycle-props');
      })
      .then(() => {
        expect(myApp.getInitProps().name).toEqual('lifecycle-props');
        expect(myApp.getMountProps().name).toEqual('lifecycle-props');
        expect(myApp.getUnmountProps().name).toEqual('lifecycle-props');
        expect(myApp.getUnloadProps().name).toEqual('lifecycle-props');
      });
  });

  it(`is given the correct props for each lifecycle function if customProps are passed`, () => {
    singleSpa.registerApplication(
      'lifecycle-props-customProps',
      () => import('./lifecycle-props.app'),
      (location) => location.hash === activeHash,
      { test: 'test' },
    );

    // This mounts the app
    window.location.hash = activeHash;

    return singleSpa
      .triggerAppChange()
      .then(() => {
        // This unmounts the app
        window.location.hash = `#/no-app`;
        return singleSpa.triggerAppChange();
      })
      .then(() => singleSpa.unloadApplication('lifecycle-props-customProps'))
      .then(() => {
        expect(myApp.getInitProps().test).toEqual('test');
        expect(myApp.getMountProps().test).toEqual('test');
        expect(myApp.getUnmountProps().test).toEqual('test');
        expect(myApp.getUnloadProps().test).toEqual('test');
      });
  });
});
